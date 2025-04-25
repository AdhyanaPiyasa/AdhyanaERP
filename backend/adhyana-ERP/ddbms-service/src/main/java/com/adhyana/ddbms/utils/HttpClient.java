package com.adhyana.ddbms.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Utility class for making HTTP requests to other services
 */
public class HttpClient {
    private static final Logger LOGGER = Logger.getLogger(HttpClient.class.getName());

    /**
     * Sends a POST request to the specified URL with the given JSON body and API key
     *
     * @param url The URL to send the request to
     * @param jsonBody The JSON body to include in the request
     * @param apiKey The API key for authentication
     * @return The response body as a string
     * @throws IOException If an I/O error occurs
     */
    public static String post(String url, String jsonBody, String apiKey) throws IOException {
        LOGGER.info("Sending POST request to " + url);
        HttpURLConnection connection = null;

        try {
            // Create connection
            URL urlObj = new URL(url);
            connection = (HttpURLConnection) urlObj.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("X-API-Key", apiKey);
            connection.setDoOutput(true);
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            // Send request
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonBody.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // Get response
            int responseCode = connection.getResponseCode();
            LOGGER.info("Response code: " + responseCode);

            if (responseCode >= 200 && responseCode < 300) {
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    return response.toString();
                }
            } else {
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(connection.getErrorStream(), "utf-8"))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    String errorResponse = response.toString();
                    LOGGER.warning("Error response: " + errorResponse);
                    throw new IOException("HTTP error code: " + responseCode + ", response: " + errorResponse);
                }
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "HTTP request failed", e);
            throw e;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}