package com.adhyana.ddbms.controllers;

import com.adhyana.ddbms.models.ApiResponse;
import com.adhyana.ddbms.models.ServiceInfo;
import com.adhyana.ddbms.models.UpdateRequest;
import com.adhyana.ddbms.services.DDBMSService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller for handling synchronization operations between services
 */
public class SyncController {
    private static final Logger LOGGER = Logger.getLogger(SyncController.class.getName());
    private final DDBMSService ddbmsService;

    /**
     * Constructor
     */
    public SyncController() {
        this.ddbmsService = new DDBMSService();
    }

    /**
     * Handles an update request from a service
     *
     * @param request The HTTP request containing the update information
     * @param response The HTTP response to send back
     * @throws IOException If an I/O error occurs
     */
    public void handleUpdateRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LOGGER.info("Handling update request");

        try {
            // Read the request body
            StringBuilder requestBody = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }

            // Parse the request body manually
            String json = requestBody.toString();
            json = json.replaceAll("[{}\"]", "");
            String[] pairs = json.split(",");
            String serviceName = null;
            String apiKey = null;
            String tableName = null;
            int recordId = 0;
            String operationType = null;
            Map<String, Object> data = null;

            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim();
                    String value = keyValue[1].trim();

                    switch (key) {
                        case "serviceName":
                            serviceName = value;
                            break;
                        case "apiKey":
                            apiKey = value;
                            break;
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
                            // This is a complex object and would be passed as a string
                            // Parse it appropriately if it's not null
                            if (!value.equals("null")) {
                                data = parseDataObject(value);
                            }
                            break;
                    }
                }
            }

            if (serviceName == null || apiKey == null || tableName == null || operationType == null) {
                LOGGER.warning("Missing required fields in update request");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Missing required fields", null);
                response.getWriter().write(apiResponse.toJson());
                return;
            }

            UpdateRequest updateRequest = new UpdateRequest(
                    serviceName,
                    apiKey,
                    tableName,
                    recordId,
                    operationType,
                    data
            );

            // Process the update
            boolean success = ddbmsService.processUpdateRequest(updateRequest);

            // Send response
            response.setContentType("application/json");
            if (success) {
                ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Update processed successfully", null);
                response.getWriter().write(apiResponse.toJson());
            } else {
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Failed to process update", null);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(apiResponse.toJson());
            }

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error handling update request", e);
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    /**
     * Handles a status request to return information about the DDBMS
     *
     * @param request The HTTP request
     * @param response The HTTP response to send back
     * @throws IOException If an I/O error occurs
     */
    public void handleStatusRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LOGGER.info("Handling status request");

        try {
            // Get service and mapping counts
            int serviceCount = ddbmsService.getAllServices().size();
            int mappingCount = ddbmsService.getAllTableMappings().size();

            // Build status response
            StringBuilder statusJson = new StringBuilder();
            statusJson.append("{");
            statusJson.append("\"status\":\"operational\",");
            statusJson.append("\"message\":\"DDBMS service is running\",");
            statusJson.append("\"version\":\"1.0.0\",");
            statusJson.append("\"services\":").append(serviceCount).append(",");
            statusJson.append("\"tableMappings\":").append(mappingCount);
            statusJson.append("}");

            // Send response
            response.setContentType("application/json");
            ApiResponse<String> apiResponse = new ApiResponse<>(true, "Status retrieved successfully", statusJson.toString());
            response.getWriter().write(apiResponse.toJson());

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error handling status request", e);
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    /**
     * Verifies a service's API key
     *
     * @param request The HTTP request containing the API key
     * @param response The HTTP response to send back
     * @throws IOException If an I/O error occurs
     */
    public void handleVerifyKey(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LOGGER.info("Handling API key verification request");

        try {
            // Read the request body
            StringBuilder requestBody = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }

            // Parse the request body manually
            String json = requestBody.toString();
            json = json.replaceAll("[{}\"]", "");
            String[] pairs = json.split(",");
            String serviceName = null;
            String apiKey = null;

            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim();
                    String value = keyValue[1].trim();

                    if ("serviceName".equals(key)) {
                        serviceName = value;
                    } else if ("apiKey".equals(key)) {
                        apiKey = value;
                    }
                }
            }

            if (serviceName == null || apiKey == null) {
                LOGGER.warning("Missing required fields in API key verification request");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Missing required fields", null);
                response.getWriter().write(apiResponse.toJson());
                return;
            }

            // Verify the API key
            ServiceInfo serviceInfo = ddbmsService.authenticateService(serviceName, apiKey);

            // Send response
            response.setContentType("application/json");
            if (serviceInfo != null) {
                ApiResponse<Boolean> apiResponse = new ApiResponse<>(true, "API key verified successfully", true);
                response.getWriter().write(apiResponse.toJson());
            } else {
                ApiResponse<Boolean> apiResponse = new ApiResponse<>(false, "Invalid API key", false);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(apiResponse.toJson());
            }

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error handling API key verification request", e);
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    /**
     * Parses a data object from a JSON string
     */
    private Map<String, Object> parseDataObject(String json) {
        Map<String, Object> result = new HashMap<>();

        // Strip outer braces
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
}