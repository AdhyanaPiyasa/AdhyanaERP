

package com.adhyana.administration; // Change as appropriate for each service

import com.adhyana.administration.models.ApiResponse; // Change as appropriate for each service

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.adhyana.administration.utils.DatabaseConnection; // Change as appropriate for each service

/**
 * Servlet that handles synchronization requests from the DDBMS
 */
@WebServlet("/api/sync")
public class SyncServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(SyncServlet.class.getName());
    private static final String API_KEY = "administration-service-api-key"; // Change for each service

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        LOGGER.info("Received sync request from DDBMS");

        // Verify the API key
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey == null || !API_KEY.equals(apiKey)) {
            LOGGER.warning("Invalid API key: " + apiKey);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(createErrorResponse("Invalid API key"));
            return;
        }

        try {
            // Read the request body
            StringBuilder requestBody = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    requestBody.append(line);
                }
            }

            // Parse the JSON manually
            String json = requestBody.toString();
            json = json.replaceAll("[{}\"]", "");
            String[] pairs = json.split(",");
            String tableName = null;
            int recordId = 0;
            String operationType = null;
            Map<String, Object> data = new HashMap<>();

            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim();
                    String value = keyValue[1].trim();

                    switch (key) {
                        case "tableName":
                            tableName = value;
                            break;
                        case "recordId":
                            recordId = Integer.parseInt(value);
                            break;
                        case "operationType":
                            operationType = value;
                            break;
                        case "data":
                            if (!value.equals("null")) {
                                data = parseDataObject(value);
                            }
                            break;
                    }
                }
            }

            if (tableName == null || operationType == null) {
                LOGGER.warning("Missing required fields in sync request");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(createErrorResponse("Missing required fields"));
                return;
            }

            // Perform the operation
            boolean success = false;
            switch (operationType.toUpperCase()) {
                case "INSERT":
                    success = insertRecord(tableName, recordId, data);
                    break;
                case "UPDATE":
                    success = updateRecord(tableName, recordId, data);
                    break;
                case "DELETE":
                    success = deleteRecord(tableName, recordId);
                    break;
                default:
                    LOGGER.warning("Unknown operation type: " + operationType);
            }

            // Send response
            response.setContentType("application/json");
            if (success) {
                response.getWriter().write(createSuccessResponse("Sync operation completed successfully"));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(createErrorResponse("Failed to perform sync operation"));
            }

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error processing sync request", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(createErrorResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Inserts a record into a table
     */
    private boolean insertRecord(String tableName, int recordId, Map<String, Object> data) {
        if (data == null || data.isEmpty()) {
            LOGGER.warning("No data provided for INSERT operation");
            return false;
        }

        StringBuilder sql = new StringBuilder("INSERT INTO ").append(tableName).append(" (");
        StringBuilder placeholders = new StringBuilder();

        // Add id column and value
        sql.append("id, ");
        placeholders.append("?, ");

        // Add other columns and values
        int i = 0;
        for (String column : data.keySet()) {
            sql.append(column);
            placeholders.append("?");

            if (i < data.size() - 1) {
                sql.append(", ");
                placeholders.append(", ");
            }
            i++;
        }

        sql.append(") VALUES (").append(placeholders).append(")");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            // Set id parameter
            stmt.setInt(1, recordId);

            // Set other parameters
            i = 0;
            for (Object value : data.values()) {
                setParameter(stmt, i + 2, value);
                i++;
            }

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error inserting record into " + tableName, e);
            return false;
        }
    }

    /**
     * Updates a record in a table
     */
    private boolean updateRecord(String tableName, int recordId, Map<String, Object> data) {
        if (data == null || data.isEmpty()) {
            LOGGER.warning("No data provided for UPDATE operation");
            return false;
        }

        StringBuilder sql = new StringBuilder("UPDATE ").append(tableName).append(" SET ");

        // Add columns and placeholders
        int i = 0;
        for (String column : data.keySet()) {
            sql.append(column).append(" = ?");

            if (i < data.size() - 1) {
                sql.append(", ");
            }
            i++;
        }

        sql.append(" WHERE id = ?");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            // Set parameters for column values
            i = 0;
            for (Object value : data.values()) {
                setParameter(stmt, i + 1, value);
                i++;
            }

            // Set id parameter
            stmt.setInt(i + 1, recordId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating record in " + tableName, e);
            return false;
        }
    }

    /**
     * Deletes a record from a table
     */
    private boolean deleteRecord(String tableName, int recordId) {
        String sql = "DELETE FROM " + tableName + " WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, recordId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error deleting record from " + tableName, e);
            return false;
        }
    }

    /**
     * Sets a parameter in a PreparedStatement based on its Java type
     */
    private void setParameter(PreparedStatement stmt, int index, Object value) throws SQLException {
        if (value == null) {
            stmt.setNull(index, Types.NULL);
        } else if (value instanceof String) {
            stmt.setString(index, (String) value);
        } else if (value instanceof Integer) {
            stmt.setInt(index, (Integer) value);
        } else if (value instanceof Long) {
            stmt.setLong(index, (Long) value);
        } else if (value instanceof Double) {
            stmt.setDouble(index, (Double) value);
        } else if (value instanceof Boolean) {
            stmt.setBoolean(index, (Boolean) value);
        } else {
            // For other types, convert to string
            stmt.setString(index, value.toString());
        }
    }

    /**
     * Parses a data object from a JSON string
     */
    private Map<String, Object> parseDataObject(String json) {
        Map<String, Object> result = new HashMap<>();

        // Remove outer braces if present
        if (json.startsWith("{")) {
            json = json.substring(1);
        }
        if (json.endsWith("}")) {
            json = json.substring(0, json.length() - 1);
        }

        // Split into key-value pairs
        String[] pairs = json.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2);
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replaceAll("\"", "");
                String valueStr = keyValue[1].trim();

                // Parse the value based on its type
                Object value;
                if (valueStr.equals("null")) {
                    value = null;
                } else if (valueStr.startsWith("\"") && valueStr.endsWith("\"")) {
                    // String value
                    value = valueStr.substring(1, valueStr.length() - 1);
                } else if (valueStr.equals("true") || valueStr.equals("false")) {
                    // Boolean value
                    value = Boolean.parseBoolean(valueStr);
                } else {
                    try {
                        // Try parsing as integer
                        value = Integer.parseInt(valueStr);
                    } catch (NumberFormatException e1) {
                        try {
                            // Try parsing as double
                            value = Double.parseDouble(valueStr);
                        } catch (NumberFormatException e2) {
                            // Default to string
                            value = valueStr;
                        }
                    }
                }

                result.put(key, value);
            }
        }

        return result;
    }

    /**
     * Creates a success response JSON string
     */
    private String createSuccessResponse(String message) {
        return "{\"success\":true,\"message\":\"" + escapeJsonString(message) + "\",\"data\":null}";
    }

    /**
     * Creates an error response JSON string
     */
    private String createErrorResponse(String message) {
        return "{\"success\":false,\"message\":\"" + escapeJsonString(message) + "\",\"data\":null}";
    }

    /**
     * Escapes special characters in a JSON string
     */
    private String escapeJsonString(String input) {
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