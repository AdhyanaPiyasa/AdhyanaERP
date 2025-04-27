package com.adhyana.hostel;

// Import Gson
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import com.adhyana.hostel.models.*;
import com.adhyana.hostel.services.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/api/hostel/*")
public class HostelServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(HostelServlet.class.getName());
    private final HostelService hostelService = new HostelService();
    private final HostelApplicationService applicationService = new HostelApplicationService();

    // Create a Gson instance for this servlet
    private static final Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd") // Default date format
            .create();

    // --- doGet, doPut, doDelete Methods (Modify response sending) ---

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel GET request received: {0}", pathInfo);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel Service API", null));
                return;
            }

            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];

            switch (resource.toLowerCase()) {
                case "hostels":
                    handleGetHostels(req, resp, parts);
                    break;
                case "applications":
                    handleGetApplications(req, resp, parts);
                    break;
                case "check-application":
                    handleCheckApplicationStatus(req, resp, parts);
                    break;
                // Add other cases if needed
                default:
                    sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Resource not found.", null));
            }
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel POST request received: {0}", pathInfo);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid POST request path.", null));
                return;
            }

            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];

            switch (resource.toLowerCase()) {
                case "hostels":
                    handlePostHostel(req, resp);
                    break;
                case "applications":
                    if (parts.length > 1 && "approve".equalsIgnoreCase(parts[parts.length - 1])) {
                        handleApproveApplication(req, resp, parts);
                    } else if (parts.length > 1 && "reject".equalsIgnoreCase(parts[parts.length - 1])) {
                        handleRejectApplication(req, resp, parts);
                    }
                    else {
                        handlePostApplication(req, resp);
                    }
                    break;
                // Add other cases if needed
                default:
                    sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Resource not found.", null));
            }
        } catch (JsonSyntaxException e) { // Catch Gson parsing errors
            LOGGER.log(Level.WARNING, "Invalid JSON format received", e);
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid JSON format: " + e.getMessage(), null));
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel PUT request received: {0}", pathInfo);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid PUT request path. Resource ID required.", null));
                return;
            }
            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];
            if ("hostels".equalsIgnoreCase(resource) && parts.length == 2) {
                handlePutHostel(req, resp, parts);
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Resource not found or PUT not supported.", null));
            }
        } catch (JsonSyntaxException e) { // Catch Gson parsing errors
            LOGGER.log(Level.WARNING, "Invalid JSON format received", e);
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid JSON format: " + e.getMessage(), null));
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel DELETE request received: {0}", pathInfo);
        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid DELETE request path. Resource ID required.", null));
                return;
            }
            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];
            if ("hostels".equalsIgnoreCase(resource) && parts.length == 2) {
                handleDeleteHostel(req, resp, parts);
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Resource not found or DELETE not supported.", null));
            }
        } catch (Exception e) {
            handleError(resp, e);
        }
    }


    // --- GET Handlers (No change needed unless modifying response structure) ---
    private void handleGetHostels(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        if (parts.length == 1) { // GET /hostels
            List<Hostel> hostels = hostelService.getAllHostels();
            sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostels retrieved successfully", hostels));
        } else if (parts.length == 2) { // GET /hostels/{id}
            try {
                int hostelId = Integer.parseInt(parts[1]);
                Hostel hostel = hostelService.getHostelById(hostelId);
                if (hostel != null) {
                    sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel retrieved successfully", hostel));
                } else {
                    sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Hostel not found", null));
                }
            } catch (NumberFormatException e) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Hostel ID format", null));
            }
        } else {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid path for hostels.", null));
        }
    }

    private void handleGetApplications(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        if (parts.length == 1) { // GET /applications
            String statusFilter = req.getParameter("status");
            List<HostelApplication> applications = applicationService.getApplications(statusFilter);
            sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Applications retrieved successfully", applications));
        } else if (parts.length == 2) { // GET /applications/{id}
            try {
                int appId = Integer.parseInt(parts[1]);
                HostelApplication application = applicationService.getApplicationById(appId);
                if (application != null) {
                    sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Application retrieved", application));
                } else {
                    sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Application not found", null));
                }
            } catch (NumberFormatException e) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Application ID format", null));
            }
        }
        else {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid path for applications.", null));
        }
    }
    private void handleCheckApplicationStatus(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // GET /check-application/student/{studentIndex}
        if (parts.length == 3 && "student".equalsIgnoreCase(parts[1])) {
            try {
                int studentIndex = Integer.parseInt(parts[2]);
                boolean hasActive = applicationService.hasActiveApplicationOrAssignment(studentIndex);
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Checked application status", hasActive));
            } catch (NumberFormatException e) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Student Index format", null));
            }
        } else {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid path for checking application status.", null));
        }
    }

    // --- POST Handlers (Use Gson for parsing) ---
    private void handlePostHostel(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String jsonBody = readRequestBody(req); // Read body once
        Hostel hostel = gson.fromJson(jsonBody, Hostel.class); // Parse with Gson
        Hostel createdHostel = hostelService.createHostel(hostel);
        sendJsonResponse(resp, HttpServletResponse.SC_CREATED, new ApiResponse<>(true, "Hostel created successfully", createdHostel));
    }

    private void handlePostApplication(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String jsonBody = readRequestBody(req);
        HostelApplication application = gson.fromJson(jsonBody, HostelApplication.class);

        if (application.getStudentIndex() <= 0) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Missing or invalid studentIndex", null));
            return;
        }

        try {
            HostelApplication createdApp = applicationService.createApplication(application);
            sendJsonResponse(resp, HttpServletResponse.SC_CREATED, new ApiResponse<>(true, "Hostel application submitted successfully", createdApp));
        } catch (SQLException e) {
            if (e.getMessage().contains("already has an active")) {
                sendJsonResponse(resp, HttpServletResponse.SC_CONFLICT, new ApiResponse<>(false, e.getMessage(), null));
            } else {
                throw e;
            }
        }
    }

    private void handleApproveApplication(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        if (parts.length != 3 || !"applications".equalsIgnoreCase(parts[0]) || !"approve".equalsIgnoreCase(parts[2])) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid path for approving application.", null));
            return;
        }
        try {
            int applicationId = Integer.parseInt(parts[1]);
            boolean approved = applicationService.approveApplication(applicationId);
            if (approved) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Application approved and student assigned.", null));
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(false, "Application could not be approved (e.g., no vacancy). Status updated.", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Application ID format", null));
        } catch (SQLException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    private void handleRejectApplication(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        if (parts.length != 3 || !"applications".equalsIgnoreCase(parts[0]) || !"reject".equalsIgnoreCase(parts[2])) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid path for rejecting application.", null));
            return;
        }
        try {
            int applicationId = Integer.parseInt(parts[1]);
            String jsonBody = readRequestBody(req);
            // Use a simple Map or a dedicated request object if structure is complex
            @SuppressWarnings("unchecked") // Use with caution or create a specific request class
            Map<String, String> requestData = gson.fromJson(jsonBody, Map.class);
            String reason = requestData != null ? requestData.getOrDefault("reason", "Rejected by administrator.") : "Rejected by administrator.";

            boolean rejected = applicationService.rejectApplication(applicationId, reason);
            if (rejected) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Application rejected.", null));
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Application not found or already processed.", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Application ID format", null));
        }
    }


    // --- PUT Handlers (Use Gson for parsing) ---
    private void handlePutHostel(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        try {
            int hostelId = Integer.parseInt(parts[1]);
            String jsonBody = readRequestBody(req);
            Hostel hostel = gson.fromJson(jsonBody, Hostel.class);
            boolean updated = hostelService.updateHostel(hostelId, hostel);
            if (updated) {
                // Fetch updated hostel to return
                Hostel updatedHostel = hostelService.getHostelById(hostelId);
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel updated successfully", updatedHostel));
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Hostel not found", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Hostel ID format", null));
        }
    }

    // --- DELETE Handlers ---
    private void handleDeleteHostel(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        try {
            int hostelId = Integer.parseInt(parts[1]);
            boolean deleted = hostelService.deleteHostel(hostelId);
            if (deleted) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel deleted successfully", null));
            } else {
                // Note: deleteHostel might throw SQLException if deletion isn't possible
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Hostel not found or could not be deleted", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Hostel ID format", null));
        } catch (SQLException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_CONFLICT, new ApiResponse<>(false, e.getMessage(), null)); // e.g., "Cannot delete hostel with active residents."
        }
    }

    // --- Utility Methods ---

    // Keep readRequestBody for getting the raw JSON string
    private String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        }
        return buffer.toString();
    }

    // Removed parseJsonToMap and getValueFromJson - Gson handles this now.

    // Use the refactored ApiResponse which uses Gson internally
    private void sendJsonResponse(HttpServletResponse response, int statusCode, ApiResponse<?> apiResponse) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        // The ApiResponse object now handles its own Gson serialization
        response.getWriter().write(apiResponse.toJson());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        LOGGER.log(Level.SEVERE, "Error processing hostel request", e);
        int statusCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        String message = "An internal server error occurred: " + e.getMessage();

        if (e instanceof JsonSyntaxException) {
            statusCode = HttpServletResponse.SC_BAD_REQUEST;
            message = "Invalid JSON format: " + e.getMessage();
        } else if (e instanceof SQLException) {
            statusCode = HttpServletResponse.SC_BAD_REQUEST; // Or Conflict (409)? Depends on error
            message = "Database error: " + e.getMessage();
        } else if (e instanceof NumberFormatException) {
            statusCode = HttpServletResponse.SC_BAD_REQUEST;
            message = "Invalid ID format in request.";
        } else if (e instanceof IOException) {
            statusCode = HttpServletResponse.SC_BAD_REQUEST;
            message = "Error reading request: " + e.getMessage();
        }

        ApiResponse<Void> apiResponse = new ApiResponse<>(false, message, null);
        // Use the updated sendJsonResponse
        sendJsonResponse(response, statusCode, apiResponse);
    }
}