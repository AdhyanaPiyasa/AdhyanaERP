package com.adhyana.ddbms.services;

import com.adhyana.ddbms.models.ServiceInfo;
import com.adhyana.ddbms.models.TableMapping;
import com.adhyana.ddbms.models.UpdateRequest;
import com.adhyana.ddbms.utils.DatabaseConnection;
import com.adhyana.ddbms.utils.HttpClient;

import java.sql.*;
import java.util.*;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Core service class for the DDBMS functionality
 */
public class DDBMSService {
    private static final Logger LOGGER = Logger.getLogger(DDBMSService.class.getName());

    /**
     * Verifies that a service is authorized to perform operations
     *
     * @param serviceName The name of the service
     * @param apiKey The API key provided by the service
     * @return The ServiceInfo object if authorized, null otherwise
     */
    public ServiceInfo authenticateService(String serviceName, String apiKey) {
        String query = "SELECT * FROM services WHERE service_name = ? AND api_key = ? AND active = TRUE";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, serviceName);
            stmt.setString(2, apiKey);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new ServiceInfo(
                            rs.getInt("id"),
                            rs.getString("service_name"),
                            rs.getString("endpoint_url"),
                            rs.getString("api_key"),
                            rs.getBoolean("active")
                    );
                }
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error authenticating service: " + serviceName, e);
        }

        return null;
    }

    /**
     * Processes an update request from a service
     *
     * @param request The update request to process
     * @return true if the update was successful, false otherwise
     */
    public boolean processUpdateRequest(UpdateRequest request) {
        LOGGER.info("Processing update request: " + request);

        // Authenticate the service
        ServiceInfo sourceService = authenticateService(request.getServiceName(), request.getApiKey());
        if (sourceService == null) {
            LOGGER.warning("Authentication failed for service: " + request.getServiceName());
            return false;
        }

        // Validate that the service has access to the table
        if (!hasAccessToTable(sourceService.getId(), request.getTableName())) {
            LOGGER.warning("Service " + request.getServiceName() + " does not have access to table: " + request.getTableName());
            return false;
        }

        try {
            // Update the record in the DDBMS central database
            boolean updated = updateLocalRecord(request);
            if (!updated) {
                LOGGER.warning("Failed to update local record");
                return false;
            }

            // Propagate the update to other services that use this table
            propagateUpdate(sourceService.getId(), request);

            return true;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error processing update request", e);
            return false;
        }
    }

    /**
     * Checks if a service has access to a table
     *
     * @param serviceId The ID of the service
     * @param tableName The name of the table
     * @return true if the service has access to the table, false otherwise
     */
    private boolean hasAccessToTable(int serviceId, String tableName) {
        String query = "SELECT * FROM table_mappings WHERE service_id = ? AND table_name = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, serviceId);
            stmt.setString(2, tableName);

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next(); // If a record exists, the service has access
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error checking table access", e);
            return false;
        }
    }

    /**
     * Updates a record in the local DDBMS database
     *
     * @param request The update request containing the record data
     * @return true if the update was successful, false otherwise
     */
    private boolean updateLocalRecord(UpdateRequest request) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            switch (request.getOperationType().toUpperCase()) {
                case "INSERT":
                    stmt = prepareInsertStatement(conn, request);
                    break;
                case "UPDATE":
                    stmt = prepareUpdateStatement(conn, request);
                    break;
                case "DELETE":
                    stmt = prepareDeleteStatement(conn, request);
                    break;
                default:
                    LOGGER.warning("Unknown operation type: " + request.getOperationType());
                    return false;
            }

            int affectedRows = stmt.executeUpdate();
            conn.commit();

            LOGGER.info("Local update completed: " + affectedRows + " rows affected");
            return affectedRows > 0;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Error rolling back transaction", ex);
                }
            }
            LOGGER.log(Level.SEVERE, "Error updating local record", e);
            throw e;
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    LOGGER.log(Level.WARNING, "Error closing statement", e);
                }
            }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    LOGGER.log(Level.WARNING, "Error closing connection", e);
                }
            }
        }
    }

    /**
     * Prepares an INSERT statement for the given request
     */
    private PreparedStatement prepareInsertStatement(Connection conn, UpdateRequest request) throws SQLException {
        Map<String, Object> data = request.getData();
        if (data == null || data.isEmpty()) {
            throw new SQLException("No data provided for INSERT operation");
        }

        StringBuilder sql = new StringBuilder("INSERT INTO ").append(request.getTableName()).append(" (");
        StringBuilder placeholders = new StringBuilder();

        // Add id column and value
        sql.append("id, ");
        placeholders.append("?, ");

        // Add other columns and values
        List<String> columns = new ArrayList<>(data.keySet());
        for (int i = 0; i < columns.size(); i++) {
            sql.append(columns.get(i));
            placeholders.append("?");

            if (i < columns.size() - 1) {
                sql.append(", ");
                placeholders.append(", ");
            }
        }

        sql.append(") VALUES (").append(placeholders).append(")");

        PreparedStatement stmt = conn.prepareStatement(sql.toString());

        // Set id parameter
        stmt.setInt(1, request.getRecordId());

        // Set other parameters
        for (int i = 0; i < columns.size(); i++) {
            setParameterValue(stmt, i + 2, data.get(columns.get(i)));
        }

        return stmt;
    }

    /**
     * Prepares an UPDATE statement for the given request
     */
    private PreparedStatement prepareUpdateStatement(Connection conn, UpdateRequest request) throws SQLException {
        Map<String, Object> data = request.getData();
        if (data == null || data.isEmpty()) {
            throw new SQLException("No data provided for UPDATE operation");
        }

        StringBuilder sql = new StringBuilder("UPDATE ").append(request.getTableName()).append(" SET ");

        // Add columns and placeholders
        List<String> columns = new ArrayList<>(data.keySet());
        for (int i = 0; i < columns.size(); i++) {
            sql.append(columns.get(i)).append(" = ?");

            if (i < columns.size() - 1) {
                sql.append(", ");
            }
        }

        sql.append(" WHERE id = ?");

        PreparedStatement stmt = conn.prepareStatement(sql.toString());

        // Set parameters for column values
        for (int i = 0; i < columns.size(); i++) {
            setParameterValue(stmt, i + 1, data.get(columns.get(i)));
        }

        // Set id parameter
        stmt.setInt(columns.size() + 1, request.getRecordId());

        return stmt;
    }

    /**
     * Prepares a DELETE statement for the given request
     */
    private PreparedStatement prepareDeleteStatement(Connection conn, UpdateRequest request) throws SQLException {
        String sql = "DELETE FROM " + request.getTableName() + " WHERE id = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setInt(1, request.getRecordId());
        return stmt;
    }

    /**
     * Sets a parameter value in a PreparedStatement based on its Java type
     */
    private void setParameterValue(PreparedStatement stmt, int index, Object value) throws SQLException {
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
        } else if (value instanceof Date) {
            stmt.setTimestamp(index, new java.sql.Timestamp(((Date) value).getTime()));
        } else {
            // For other types, convert to string
            stmt.setString(index, value.toString());
        }
    }

    /**
     * Propagates an update to all services that use the specified table
     *
     * @param sourceServiceId The ID of the service that initiated the update
     * @param request The update request to propagate
     */
    private void propagateUpdate(int sourceServiceId, UpdateRequest request) {
        LOGGER.info("Propagating update to other services");

        List<ServiceInfo> targetServices = getServicesUsingTable(request.getTableName(), sourceServiceId);
        if (targetServices.isEmpty()) {
            LOGGER.info("No other services use this table, no propagation needed");
            return;
        }

        for (ServiceInfo targetService : targetServices) {
            try {
                LOGGER.info("Propagating update to service: " + targetService.getServiceName());

                // Prepare the JSON payload
                StringBuilder jsonPayload = new StringBuilder();
                jsonPayload.append("{");
                jsonPayload.append("\"tableName\":\"").append(request.getTableName()).append("\",");
                jsonPayload.append("\"recordId\":").append(request.getRecordId()).append(",");
                jsonPayload.append("\"operationType\":\"").append(request.getOperationType()).append("\",");

                // Add data for INSERT/UPDATE operations
                Map<String, Object> data = request.getData();
                if (data != null && !data.isEmpty() &&
                        ("INSERT".equalsIgnoreCase(request.getOperationType()) ||
                                "UPDATE".equalsIgnoreCase(request.getOperationType()))) {

                    jsonPayload.append("\"data\":{");

                    boolean first = true;
                    for (Map.Entry<String, Object> entry : data.entrySet()) {
                        if (!first) {
                            jsonPayload.append(",");
                        }

                        jsonPayload.append("\"").append(entry.getKey()).append("\":");

                        Object value = entry.getValue();
                        if (value == null) {
                            jsonPayload.append("null");
                        } else if (value instanceof String) {
                            jsonPayload.append("\"").append(escapeJsonString((String) value)).append("\"");
                        } else if (value instanceof Number || value instanceof Boolean) {
                            jsonPayload.append(value);
                        } else {
                            // For other types, convert to string
                            jsonPayload.append("\"").append(escapeJsonString(value.toString())).append("\"");
                        }

                        first = false;
                    }

                    jsonPayload.append("}");
                } else {
                    jsonPayload.append("\"data\":null");
                }

                jsonPayload.append("}");

                // Send the update to the target service
                HttpClient.post(targetService.getEndpointUrl(), jsonPayload.toString(), targetService.getApiKey());

                // Log the sync operation
                logSyncOperation(sourceServiceId, targetService.getId(), request.getTableName(),
                        request.getRecordId(), request.getOperationType(), "COMPLETED", null);

            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Error propagating update to service: " + targetService.getServiceName(), e);

                // Log the failed sync operation
                logSyncOperation(sourceServiceId, targetService.getId(), request.getTableName(),
                        request.getRecordId(), request.getOperationType(), "FAILED", e.getMessage());
            }
        }
    }

    /**
     * Gets a list of services that use a specific table, excluding the source service
     *
     * @param tableName The name of the table
     * @param sourceServiceId The ID of the source service to exclude
     * @return List of ServiceInfo objects for services that use the table
     */
    private List<ServiceInfo> getServicesUsingTable(String tableName, int sourceServiceId) {
        List<ServiceInfo> services = new ArrayList<>();
        String query = "SELECT s.* FROM services s " +
                "JOIN table_mappings tm ON s.id = tm.service_id " +
                "WHERE tm.table_name = ? AND s.id != ? AND s.active = TRUE";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, tableName);
            stmt.setInt(2, sourceServiceId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    services.add(new ServiceInfo(
                            rs.getInt("id"),
                            rs.getString("service_name"),
                            rs.getString("endpoint_url"),
                            rs.getString("api_key"),
                            rs.getBoolean("active")
                    ));
                }
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting services using table: " + tableName, e);
        }

        return services;
    }

    /**
     * Logs a synchronization operation
     */
    private void logSyncOperation(int sourceServiceId, int targetServiceId, String tableName,
                                  int recordId, String operationType, String status, String errorMessage) {
        String query = "INSERT INTO sync_operations (source_service_id, target_service_id, table_name, " +
                "record_id, operation_type, status, error_message, completed_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, sourceServiceId);
            stmt.setInt(2, targetServiceId);
            stmt.setString(3, tableName);
            stmt.setInt(4, recordId);
            stmt.setString(5, operationType);
            stmt.setString(6, status);
            stmt.setString(7, errorMessage);

            if ("COMPLETED".equals(status) || "FAILED".equals(status)) {
                stmt.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
            } else {
                stmt.setNull(8, Types.TIMESTAMP);
            }

            stmt.executeUpdate();

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error logging sync operation", e);
        }
    }

    /**
     * Gets all table mappings
     *
     * @return List of TableMapping objects
     */
    public List<TableMapping> getAllTableMappings() {
        List<TableMapping> mappings = new ArrayList<>();
        String query = "SELECT * FROM table_mappings ORDER BY table_name, service_id";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                mappings.add(new TableMapping(
                        rs.getInt("id"),
                        rs.getString("table_name"),
                        rs.getInt("service_id"),
                        rs.getBoolean("is_primary")
                ));
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting table mappings", e);
        }

        return mappings;
    }

    /**
     * Gets all services
     *
     * @return List of ServiceInfo objects
     */
    public List<ServiceInfo> getAllServices() {
        List<ServiceInfo> services = new ArrayList<>();
        String query = "SELECT * FROM services ORDER BY service_name";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                services.add(new ServiceInfo(
                        rs.getInt("id"),
                        rs.getString("service_name"),
                        rs.getString("endpoint_url"),
                        rs.getString("api_key"),
                        rs.getBoolean("active")
                ));
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting services", e);
        }

        return services;
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