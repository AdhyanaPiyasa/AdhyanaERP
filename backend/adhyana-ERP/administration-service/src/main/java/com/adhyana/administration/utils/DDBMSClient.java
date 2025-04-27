package com.adhyana.administration.utils; // Assuming this is in the admin service utils

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Client for notifying the DDBMS service about local data changes.
 * Sends the executed SQL query string.
 */
public class DDBMSClient {
    private static final Logger LOGGER = Logger.getLogger(DDBMSClient.class.getName());

    // URL of the DDBMS service's replication endpoint
    // This should point to where the DDBMS service's DDBMSServlet is mapped.
    private static final String DDBMS_REPLICATE_ENDPOINT = "http://localhost:8087/api/replicate"; // Adjust port if needed

    /**
     * Sends the executed SQL query to the DDBMS for replication.
     *
     * @param query The exact SQL query string that was executed locally.
     * @param tableName The name of the table affected by the query.
     * @return true if the notification was sent successfully (doesn't guarantee processing), false otherwise.
     */
    public static boolean notifyDDBMS(String query, String tableName) {
        if (query == null || query.trim().isEmpty() || tableName == null || tableName.trim().isEmpty()) {
            LOGGER.warning("Cannot notify DDBMS: Query or table name is empty.");
            return false;
        }

        LOGGER.info("Notifying DDBMS about change in table: " + tableName);
        LOGGER.fine("Query being sent: " + query);

        HttpURLConnection connection = null;
        try {
            // 1. Construct JSON Payload: {"query":"...", "table":"..."}
            String jsonPayload = "{\"query\":\"" + escapeJsonString(query) + "\", \"table\":\"" + escapeJsonString(tableName) + "\"}";
            LOGGER.finer("Constructed JSON payload: " + jsonPayload);

            // 2. Create Connection
            URL url = new URL(DDBMS_REPLICATE_ENDPOINT);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("Accept", "application/json");
            connection.setDoOutput(true);
            connection.setConnectTimeout(5000); // 5 seconds
            connection.setReadTimeout(10000); // 10 seconds

            // 3. Send Request Body
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // 4. Get Response Code (Important to trigger the request)
            int responseCode = connection.getResponseCode();
            LOGGER.info("DDBMS notification response code: " + responseCode);

            // 5. Read Response (Optional but good for debugging)
            InputStream is = (responseCode >= 200 && responseCode < 300) ? connection.getInputStream() : connection.getErrorStream();
            if (is != null) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    LOGGER.fine("DDBMS notification response body: " + response.toString());
                }
            } else {
                LOGGER.warning("No response body stream available from DDBMS notification.");
            }


            // Consider success if response code is 2xx
            return responseCode >= 200 && responseCode < 300;

        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error notifying DDBMS endpoint: " + DDBMS_REPLICATE_ENDPOINT, e);
            return false;
        } finally {
            if (connection != null) {
                connection.disconnect();
                LOGGER.finer("Disconnected from DDBMS endpoint.");
            }
        }
    }

    /**
     * Escapes special characters for embedding a string within a JSON string value.
     *
     * @param input The string to escape.
     * @return The JSON-escaped string.
     */
    private static String escapeJsonString(String input) {
        if (input == null) {
            return "";
        }
        // Basic escaping for quotes and backslashes
        return input.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
    