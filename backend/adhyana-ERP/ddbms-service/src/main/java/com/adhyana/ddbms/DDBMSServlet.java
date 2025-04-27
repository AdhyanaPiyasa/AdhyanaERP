package com.adhyana.ddbms;

import com.adhyana.ddbms.utils.DatabaseConnection; // Use the correct package

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

// Mapped in web.xml to /api/replicate
public class DDBMSServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(DDBMSServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        LOGGER.info("Received replication request.");
        String requestBody = readBody(req);
        LOGGER.fine("Request Body: " + requestBody);

        Map<String, String> data = parseJsonToMap(requestBody);
        String queryToExecute = data.get("query");
        String tableName = data.get("table");

        if (queryToExecute == null || tableName == null) {
            LOGGER.warning("Missing 'query' or 'table' in request body.");
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Request must include 'query' and 'table' fields.");
            return;
        }

        LOGGER.info("Processing query for table: " + tableName);
        LOGGER.fine("Query to execute: " + queryToExecute);

        // 1. Execute query locally in DDBMS database
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            LOGGER.fine("Executing query locally on DDBMS database...");
            int rowsAffected = stmt.executeUpdate(queryToExecute);
            LOGGER.info("Local execution successful. Rows affected: " + rowsAffected);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Local DDBMS query execution failed.", e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "DDBMS local execution failed: " + e.getMessage());
            return; // Stop processing if local execution fails
        }

        // 2. Find target services for propagation
        List<String> targetEndpoints = getTargetEndpoints(tableName);
        if (targetEndpoints.isEmpty()) {
            LOGGER.info("No target services found for table '" + tableName + "' in mappings. Propagation skipped.");
        } else {
            LOGGER.info("Found " + targetEndpoints.size() + " target service(s) for propagation for table: " + tableName);
        }

        // 3. Broadcast the original payload to target services
        for (String endpoint : targetEndpoints) {
            LOGGER.fine("Propagating query to endpoint: " + endpoint);
            propagateQuery(endpoint, requestBody); // Send the original JSON payload
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"success\": true, \"message\": \"Replication initiated.\"}");
        LOGGER.info("Replication request processed successfully.");
    }

    /**
     * Retrieves the endpoint URLs for services that need updates for a given table.
     */
    private List<String> getTargetEndpoints(String tableName) {
        List<String> endpoints = new ArrayList<>();
        // Query joins table_mappings and services to get URLs
        String sql = "SELECT s.endpoint_url FROM services s " +
                "JOIN table_mappings tm ON s.service_id = tm.service_id " +
                "WHERE tm.table_name = ? AND s.active = TRUE";

        LOGGER.fine("Querying target endpoints for table: " + tableName);
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, tableName);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                String endpoint = rs.getString("endpoint_url");
                if (endpoint != null && !endpoint.trim().isEmpty()){
                    endpoints.add(endpoint);
                    LOGGER.finer("Found target endpoint: " + endpoint);
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to retrieve target endpoints for table: " + tableName, e);
            // Continue without propagation if DB query fails
        }
        return endpoints;
    }

    /**
     * Sends the query payload to a target service endpoint.
     */
    private void propagateQuery(String targetUrl, String jsonPayload) {
        HttpURLConnection connection = null;
        try {
            URL url = new URL(targetUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("Accept", "application/json");
            // Add any necessary headers like API keys if the target service requires them
            // connection.setRequestProperty("X-API-Key", "some-key");
            connection.setDoOutput(true);
            connection.setConnectTimeout(5000); // 5 seconds
            connection.setReadTimeout(10000); // 10 seconds

            LOGGER.fine("Sending payload to " + targetUrl + ": " + jsonPayload);

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            LOGGER.info("Response code from " + targetUrl + ": " + responseCode);

            // Read response (optional, good for debugging)
            InputStream is = (responseCode >= 200 && responseCode < 300) ? connection.getInputStream() : connection.getErrorStream();
            if (is != null) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    LOGGER.fine("Response body from " + targetUrl + ": " + response.toString());
                }
            } else {
                LOGGER.warning("No response body stream available from " + targetUrl);
            }


        } catch (IOException e) {
            // Log the error but don't stop the DDBMS service
            LOGGER.log(Level.WARNING, "Failed to propagate query to " + targetUrl, e);
        } finally {
            if (connection != null) {
                connection.disconnect();
                LOGGER.finer("Disconnected from " + targetUrl);
            }
        }
    }

    /**
     * Reads the request body into a String.
     */
    private String readBody(HttpServletRequest request) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        }
        return buffer.toString();
    }

    /**
     * Parses a simple JSON string into a Map.
     * Handles basic structure like {"key1":"value1", "key2":"value2"}.
     * Note: This is a very basic parser and might fail on complex JSON.
     */
    private Map<String, String> parseJsonToMap(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.isEmpty()) {
            return map;
        }

        try {
            // Remove { and }
            json = json.trim();
            if (json.startsWith("{") && json.endsWith("}")) {
                json = json.substring(1, json.length() - 1).trim();
            } else {
                LOGGER.warning("JSON does not start/end with braces: " + json);
                return map; // or throw exception
            }

            if (json.isEmpty()) {
                return map; // Empty object
            }

            // Split by comma, but be careful about commas inside quoted values
            List<String> pairs = splitJsonPairs(json);

            for (String pair : pairs) {
                // Split by the first colon
                int colonIndex = pair.indexOf(':');
                if (colonIndex != -1) {
                    String key = pair.substring(0, colonIndex).trim();
                    String value = pair.substring(colonIndex + 1).trim();

                    // Remove surrounding quotes if present
                    if (key.startsWith("\"") && key.endsWith("\"")) {
                        key = key.substring(1, key.length() - 1);
                    }
                    if (value.startsWith("\"") && value.endsWith("\"")) {
                        value = value.substring(1, value.length() - 1);
                        // Basic unescaping for quotes inside values
                        value = value.replace("\\\"", "\"").replace("\\\\", "\\");
                    } else if (value.equalsIgnoreCase("null")) {
                        value = null; // Represent JSON null as Java null
                    }

                    map.put(key, value);
                } else {
                    LOGGER.warning("Malformed JSON pair skipped: " + pair);
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to parse JSON: " + json, e);
            // Return empty map or throw exception based on desired strictness
        }

        return map;
    }

    /**
     * Splits a JSON object's content string into key-value pair strings,
     * handling commas within quoted strings.
     */
    private List<String> splitJsonPairs(String jsonContent) {
        List<String> pairs = new ArrayList<>();
        int level = 0; // Track nesting level (braces/brackets) - not fully implemented here for simplicity
        boolean inQuotes = false;
        int start = 0;

        for (int i = 0; i < jsonContent.length(); i++) {
            char c = jsonContent.charAt(i);

            if (c == '"') {
                // Basic handling of quotes; doesn't account for escaped quotes
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes && level == 0) {
                pairs.add(jsonContent.substring(start, i));
                start = i + 1;
            }
            // Basic nesting level tracking could be added here if needed
        }
        pairs.add(jsonContent.substring(start)); // Add the last pair
        return pairs;
    }
}