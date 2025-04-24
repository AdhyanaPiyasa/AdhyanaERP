package com.adhyana.administration.utils; // Change as appropriate for each service

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Client for communicating with the DDBMS service.
 * This class should be included in each microservice to handle synchronization.
 */
public class DDBMSClient {
    private static final Logger LOGGER = Logger.getLogger(DDBMSClient.class.getName());

    // Configuration - these should be adjusted for each service
    private static final String DDBMS_ENDPOINT = "http://localhost:8087/api/sync";
    private static final String SERVICE_NAME = "administration-service"; // Change for each service
    private static final String API_KEY = "administration-service-api-key"; // Change for each service

    /**
     * Sends an update notification to the DDBMS when a record is created, updated, or deleted
     *
     * @param tableName The name of the table that was modified
     * @param recordId The ID of the record that was modified
     * @param operationType The type of operation (INSERT, UPDATE, DELETE)
     * @param data The data associated with the record (for INSERT/UPDATE)
     * @return true if the notification was successful, false otherwise
     */
    public static boolean notifyDDBMS(String tableName, int recordId, String operationType, Map<String, Object> data) {
        LOGGER.info("Notifying DDBMS of " + operationType + " operation on table " + tableName + ", record ID: " + recordId);

        try {
            // Create JSON request body
            StringBuilder jsonBody = new StringBuilder();
            jsonBody.append("{");
            jsonBody.append("\"serviceName\":\"").append(SERVICE_NAME).append("\",");
            jsonBody.append("\"apiKey\":\"").append(API_KEY).append("\",");
            jsonBody.append("\"tableName\":\"").append(tableName).append("\",");
            jsonBody.append("\"recordId\":").append(recordId).append(",");
            jsonBody.append("\"operationType\":\"").append(operationType).append("\"");

            // Add data for INSERT/UPDATE operations
            if (data != null && !data.isEmpty() && ("INSERT".equals(operationType) || "UPDATE".equals(operationType))) {
                jsonBody.append(",\"data\":{");

                boolean first = true;
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    if (!first) {
                        jsonBody.append(",");
                    }

                    jsonBody.append("\"").append(entry.getKey()).append("\":");

                    Object value = entry.getValue();
                    if (value == null) {
                        jsonBody.append("null");
                    } else if (value instanceof String) {
                        jsonBody.append("\"").append(escapeJsonString((String) value)).append("\"");
                    } else if (value instanceof Number || value instanceof Boolean) {
                        jsonBody.append(value);
                    } else {
                        // For other types, convert to string
                        jsonBody.append("\"").append(escapeJsonString(value.toString())).append("\"");
                    }

                    first = false;
                }

                jsonBody.append("}");
            } else {
                jsonBody.append(",\"data\":null");
            }

            jsonBody.append("}");

            // Send request to DDBMS
            return sendRequest(DDBMS_ENDPOINT, jsonBody.toString());

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error notifying DDBMS", e);
            return false;
        }
    }

    /**
     * Sends a synchronization request to the DDBMS
     *
     * @param endpoint The DDBMS endpoint
     * @param jsonBody The JSON request body
     * @return true if the request was successful, false otherwise
     */
    private static boolean sendRequest(String endpoint, String jsonBody) throws IOException {
        LOGGER.fine("Sending request to DDBMS: " + jsonBody);

        HttpURLConnection connection = null;

        try {
            // Create connection
            URL url = new URL(endpoint);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
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
            LOGGER.fine("DDBMS response code: " + responseCode);

            // Read response
            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(
                            responseCode >= 200 && responseCode < 300
                                    ? connection.getInputStream()
                                    : connection.getErrorStream(), "utf-8"))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }

            LOGGER.fine("DDBMS response: " + response.toString());

            return responseCode >= 200 && responseCode < 300;

        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    /**
     * Escapes special characters in a JSON string
     *
     * @param input The string to escape
     * @return The escaped string
     */
    private static String escapeJsonString(String input) {
        if (input == null) {
            return "";
        }

        StringBuilder result = new StringBuilder();

        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);

            switch (ch) {
                case '\\':
                    result.append("\\\\");
                    break;
                case '"':
                    result.append("\\\"");
                    break;
                case '\b':
                    result.append("\\b");
                    break;
                case '\f':
                    result.append("\\f");
                    break;
                case '\n':
                    result.append("\\n");
                    break;
                case '\r':
                    result.append("\\r");
                    break;
                case '\t':
                    result.append("\\t");
                    break;
                default:
                    result.append(ch);
            }
        }

        return result.toString();
    }
}