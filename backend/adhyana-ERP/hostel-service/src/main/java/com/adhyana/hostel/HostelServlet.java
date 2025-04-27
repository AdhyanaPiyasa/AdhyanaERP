package com.adhyana.hostel;

import com.adhyana.hostel.models.*;
import com.adhyana.hostel.services.*;
import com.adhyana.hostel.utils.JsonUtils; // Assuming you have a JsonUtils helper

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/api/hostel/*")
public class HostelServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(HostelServlet.class.getName());
    private final HostelService hostelService = new HostelService();
    private final HostelApplicationService applicationService = new HostelApplicationService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel GET request received: {0}", pathInfo);

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // Maybe return general service status or help info
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
                case "assignments": // Maybe needed later to view assignments
                    resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "Assignments endpoint not implemented yet.");
                    break;
                case "check-application": // Endpoint for students to check their status
                    handleCheckApplicationStatus(req, resp, parts);
                    break;
                default:
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found.");
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
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid POST request path.");
                return;
            }

            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];

            switch (resource.toLowerCase()) {
                case "hostels": // Admin: Create Hostel
                    handlePostHostel(req, resp);
                    break;
                case "applications": // Student: Submit Application
                    if (parts.length > 1 && "approve".equalsIgnoreCase(parts[parts.length - 1])) {
                        // Admin: Approve Application POST /applications/{id}/approve
                        handleApproveApplication(req, resp, parts);
                    } else if (parts.length > 1 && "reject".equalsIgnoreCase(parts[parts.length - 1])) {
                        // Admin: Reject Application POST /applications/{id}/reject
                        handleRejectApplication(req, resp, parts);
                    }
                    else {
                        // Student: Create Application POST /applications
                        handlePostApplication(req, resp);
                    }
                    break;
                default:
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found.");
            }
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
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid PUT request path. Hostel ID required.");
                return;
            }
            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];
            if ("hostels".equalsIgnoreCase(resource) && parts.length == 2) {
                // Admin: Update Hostel PUT /hostels/{id}
                handlePutHostel(req, resp, parts);
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found or PUT not supported.");
            }
        } catch (Exception e) {
            handleError(resp, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        LOGGER.log(Level.INFO, "Hostel DELETE request received: {0}", pathInfo);
        // Generally, DELETE might be restricted or handled carefully.
        // Example: DELETE /hostels/{id} (Admin only)
        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid DELETE request path. Hostel ID required.");
                return;
            }
            String[] parts = pathInfo.substring(1).split("/");
            String resource = parts[0];
            if ("hostels".equalsIgnoreCase(resource) && parts.length == 2) {
                // Admin: Delete Hostel DELETE /hostels/{id}
                handleDeleteHostel(req, resp, parts);
            } else {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found or DELETE not supported.");
            }
        } catch (Exception e) {
            handleError(resp, e);
        }

    }

    // --- GET Handlers ---

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
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path for hostels.");
        }
    }

    private void handleGetApplications(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        if (parts.length == 1) { // GET /applications (Admin view, maybe with filters)
            String statusFilter = req.getParameter("status"); // e.g., ?status=Pending
            List<HostelApplication> applications = applicationService.getApplications(statusFilter);
            sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Applications retrieved successfully", applications));
        } else if (parts.length == 2) { // GET /applications/{id} (Admin view specific app)
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
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path for applications.");
        }
    }

    private void handleCheckApplicationStatus(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // GET /check-application/student/{studentIndex}
        if (parts.length == 3 && "student".equalsIgnoreCase(parts[1])) {
            try {
                int studentIndex = Integer.parseInt(parts[2]);
                // This logic needs refinement - should likely return the specific application or assignment status
                boolean hasActive = applicationService.hasActiveApplicationOrAssignment(studentIndex);
                // For now, just return if active application/assignment exists
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Checked application status", hasActive));
            } catch (NumberFormatException e) {
                sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Student Index format", null));
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path for checking application status.");
        }
    }

    // --- POST Handlers ---
    private void handlePostHostel(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // Admin creates a hostel
        String jsonBody = JsonUtils.readRequestBody(req);
        Hostel hostel = JsonUtils.fromJson(jsonBody, Hostel.class); // Use your JSON parsing util
        Hostel createdHostel = hostelService.createHostel(hostel);
        sendJsonResponse(resp, HttpServletResponse.SC_CREATED, new ApiResponse<>(true, "Hostel created successfully", createdHostel));
    }

    private void handlePostApplication(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // Student submits an application
        String jsonBody = JsonUtils.readRequestBody(req);
        HostelApplication application = JsonUtils.fromJson(jsonBody, HostelApplication.class);
        // Basic validation: Ensure studentIndex is present
        if (application.getStudentIndex() <= 0) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Missing or invalid studentIndex", null));
            return;
        }

        try {
            HostelApplication createdApp = applicationService.createApplication(application);
            sendJsonResponse(resp, HttpServletResponse.SC_CREATED, new ApiResponse<>(true, "Hostel application submitted successfully", createdApp));
        } catch (SQLException e) {
            // Handle specific errors like student already applied
            if (e.getMessage().contains("already has an active")) {
                sendJsonResponse(resp, HttpServletResponse.SC_CONFLICT, new ApiResponse<>(false, e.getMessage(), null));
            } else {
                throw e; // Rethrow other SQL errors
            }
        }
    }

    private void handleApproveApplication(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // POST /applications/{id}/approve (Admin)
        if (parts.length != 3) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path for approving application.");
            return;
        }
        try {
            int applicationId = Integer.parseInt(parts[1]);
            boolean approved = applicationService.approveApplication(applicationId);
            if (approved) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Application approved and student assigned.", null));
            } else {
                // This might mean rejection due to no vacancy now
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(false, "Application could not be approved (e.g., no vacancy). Status updated.", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Application ID format", null));
        } catch (SQLException e) {
            // Handle specific errors, e.g., app not found or not pending
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    private void handleRejectApplication(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // POST /applications/{id}/reject (Admin)
        if (parts.length != 3) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path for rejecting application.");
            return;
        }
        try {
            int applicationId = Integer.parseInt(parts[1]);
            // Optionally get reason from request body
            String jsonBody = JsonUtils.readRequestBody(req);
            String reason = JsonUtils.getValueFromJson(jsonBody, "reason", "Rejected by administrator."); // Default reason

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

    // --- PUT Handlers ---
    private void handlePutHostel(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // Admin updates hostel info
        try {
            int hostelId = Integer.parseInt(parts[1]);
            String jsonBody = JsonUtils.readRequestBody(req);
            Hostel hostel = JsonUtils.fromJson(jsonBody, Hostel.class);
            boolean updated = hostelService.updateHostel(hostelId, hostel);
            if (updated) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel updated successfully", null));
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Hostel not found", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Hostel ID format", null));
        }
    }

    // --- DELETE Handlers ---
    private void handleDeleteHostel(HttpServletRequest req, HttpServletResponse resp, String[] parts) throws Exception {
        // Admin deletes a hostel (if empty)
        try {
            int hostelId = Integer.parseInt(parts[1]);
            boolean deleted = hostelService.deleteHostel(hostelId);
            if (deleted) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, new ApiResponse<>(true, "Hostel deleted successfully", null));
            } else {
                sendJsonResponse(resp, HttpServletResponse.SC_NOT_FOUND, new ApiResponse<>(false, "Hostel not found", null));
            }
        } catch (NumberFormatException e) {
            sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, new ApiResponse<>(false, "Invalid Hostel ID format", null));
        } catch (SQLException e) {
            // Catch constraint violations (e.g., hostel has residents)
            sendJsonResponse(resp, HttpServletResponse.SC_CONFLICT, new ApiResponse<>(false, e.getMessage(), null));
        }
    }


    // --- Utility Methods ---
    private void sendJsonResponse(HttpServletResponse response, int statusCode, ApiResponse<?> apiResponse) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse.toJson());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        LOGGER.log(Level.SEVERE, "Error processing hostel request", e);
        // Default error code
        int statusCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        String message = "An internal server error occurred.";

        // Handle specific exceptions for better client feedback
        if (e instanceof SQLException) {
            // Check for specific SQL errors if needed
            statusCode = HttpServletResponse.SC_BAD_REQUEST; // Or Conflict?
            message = "Database error: " + e.getMessage();
        } else if (e instanceof NumberFormatException) {
            statusCode = HttpServletResponse.SC_BAD_REQUEST;
            message = "Invalid ID format in request.";
        } else if (e instanceof IOException) {
            // Potentially from reading request body
            statusCode = HttpServletResponse.SC_BAD_REQUEST;
            message = "Error reading request: " + e.getMessage();
        }

        ApiResponse<Void> apiResponse = new ApiResponse<>(false, message, null);
        sendJsonResponse(response, statusCode, apiResponse);
    }
}