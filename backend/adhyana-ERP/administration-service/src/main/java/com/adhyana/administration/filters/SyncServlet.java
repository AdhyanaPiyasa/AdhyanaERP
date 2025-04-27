package com.adhyana.administration.filters; // Or move to a 'servlets' package if preferred

import com.adhyana.administration.utils.DatabaseConnection; // Use admin service's DB connection

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Receives synchronization requests (SQL queries) from the DDBMS service
 * and executes them on the local administration database.
 */
@WebServlet("/api/sync") // Mapped in web.xml (or directly via annotation)
public class SyncServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(SyncServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        LOGGER.info("Received sync request from DDBMS.");
        String body = readBody(req);
        LOGGER.fine("Sync Request Body: " + body);

        Map<String,String> data = parseJsonToMap(body);
        String query = data.get("query"); // Expecting {"query": "SQL..."}

        if (query == null || query.trim().isEmpty()) {
            LOGGER.warning("Received sync request with missing or empty query.");
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing 'query' in request body.");
            return;
        }

        LOGGER.fine("Query to execute locally: " + query);

        Connection conn = null;
        Statement stmt = null;
        try {
            conn = DatabaseConnection.getConnection(); // Get connection for adhyana_admin DB
            stmt = conn.createStatement();
            int rowsAffected = stmt.executeUpdate(query);
            LOGGER.info("Sync query executed successfully. Rows affected: " + rowsAffected);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"success\": true, \"message\": \"Sync query executed.\"}");

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to execute sync query locally.", e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Sync failed: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to get database connection for sync.", e);
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Sync failed: Could not connect to database.");
        }
        finally {
            // Ensure resources are closed
            try {
                if (stmt != null) stmt.close();
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Error closing statement.", e);
            }
            try {
                if (conn != null && !conn.isClosed()) conn.close();
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Error closing connection.", e);
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
     * Parses a simple JSON string like {"key":"value",...} into a Map.
     * Note: Very basic, assumes simple key-value pairs with string values.
     */
    private Map<String,String> parseJsonToMap(String json) {
        Map<String,String> map = new HashMap<>();
        if (json == null || json.isEmpty()) {
            return map;
        }

        try {
            // Remove { and }
            json = json.trim();
            if (json.startsWith("{") && json.endsWith("}")) {
                json = json.substring(1, json.length() - 1).trim();
            } else {
                LOGGER.warning("JSON for sync servlet does not start/end with braces: " + json);
                return map;
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
                    LOGGER.warning("Malformed JSON pair skipped in sync servlet: " + pair);
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to parse JSON in sync servlet: " + json, e);
            // Return empty map or throw exception based on desired strictness
        }
        return map;
    }

    /**
     * Splits a JSON object's content string into key-value pair strings,
     * handling commas within quoted strings. Basic implementation.
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
    