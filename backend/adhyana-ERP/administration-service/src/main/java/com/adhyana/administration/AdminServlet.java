package com.adhyana.administration;

import com.adhyana.administration.models.*;
import com.adhyana.administration.services.*;
import com.adhyana.administration.utils.JsonUtils;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.Date;
import java.util.List;

@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {
    private final StaffService staffService = new StaffService();
    private final PayrollService payrollService = new PayrollService();
    private final BatchService batchService = new BatchService();
    private final AnnouncementService announcementService = new AnnouncementService();
    private final AcademicCalendarService calendarService = new AcademicCalendarService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logRequestInfo(request, "GET");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Root endpoint - return service info
                System.out.println("GET: Accessing root endpoint");
                ApiResponse<String> apiResponse = new ApiResponse<>(true, "Administration Service API", "v1.0");
                sendJsonResponse(response, apiResponse);
                return;
            }

            // Remove leading slash and split the path
            String path = pathInfo.substring(1);
            String[] parts = path.split("/");

            if (parts.length == 0) {
                System.out.println("ERROR: Invalid request path");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request path");
                return;
            }

            switch (parts[0]) {
                case "staff":
                    System.out.println("GET: Handling staff request");
                    handleStaffGet(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("GET: Handling payroll request");
                    handlePayrollGet(request, response, parts);
                    break;
                case "batch":
                    System.out.println("GET: Handling batch request");
                    handleBatchGet(request, response, parts);
                    break;
                case "announcements":
                    System.out.println("GET: Handling announcements request");
                    handleAnnouncementsGet(request, response, parts);
                    break;
                case "calendar":
                    System.out.println("GET: Handling calendar request");
                    handleCalendarGet(request, response, parts);
                    break;
                default:
                    System.out.println("ERROR: Invalid endpoint - " + parts[0]);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
            }
        } catch (Exception e) {
            System.out.println("ERROR: Exception in doGet - " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
        System.out.println("GET: Request completed");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logRequestInfo(request, "POST");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                System.out.println("ERROR: Invalid request path for POST");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request path");
                return;
            }

            // Remove leading slash and split the path
            String path = pathInfo.substring(1);
            String[] parts = path.split("/");

            if (parts.length == 0) {
                System.out.println("ERROR: Invalid request path - empty parts array");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request path");
                return;
            }

            switch (parts[0]) {
                case "staff":
                    System.out.println("POST: Handling staff request");
                    handleStaffPost(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("POST: Handling payroll request");
                    handlePayrollPost(request, response, parts);
                    break;
                case "batch":
                    System.out.println("POST: Handling batch request");
                    handleBatchPost(request, response, parts);
                    break;
                case "announcements":
                    System.out.println("POST: Handling announcements request");
                    handleAnnouncementsPost(request, response, parts);
                    break;
                case "calendar":
                    System.out.println("POST: Handling calendar request");
                    handleCalendarPost(request, response, parts);
                    break;
                default:
                    System.out.println("ERROR: Invalid endpoint for POST - " + parts[0]);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
            }
        } catch (Exception e) {
            System.out.println("ERROR: Exception in doPost - " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
        System.out.println("POST: Request completed");
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logRequestInfo(request, "PUT");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                System.out.println("ERROR: Resource ID required for PUT");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            // Remove leading slash and split the path
            String path = pathInfo.substring(1);
            String[] parts = path.split("/");

            if (parts.length < 2) {
                System.out.println("ERROR: Resource ID required for PUT - insufficient path parts");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            switch (parts[0]) {
                case "staff":
                    System.out.println("PUT: Handling staff update request for ID: " + parts[1]);
                    handleStaffPut(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("PUT: Handling payroll update request for ID: " + parts[1]);
                    handlePayrollPut(request, response, parts);
                    break;
                case "batch":
                    System.out.println("PUT: Handling batch update request for ID: " + parts[1]);
                    handleBatchPut(request, response, parts);
                    break;
                case "announcements":
                    System.out.println("PUT: Handling announcements update request for ID: " + parts[1]);
                    handleAnnouncementsPut(request, response, parts);
                    break;
                case "calendar":
                    System.out.println("PUT: Handling calendar update request for ID: " + parts[1]);
                    handleCalendarPut(request, response, parts);
                    break;
                default:
                    System.out.println("ERROR: Invalid endpoint for PUT - " + parts[0]);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
            }
        } catch (Exception e) {
            System.out.println("ERROR: Exception in doPut - " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
        System.out.println("PUT: Request completed");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logRequestInfo(request, "DELETE");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                System.out.println("ERROR: Resource ID required for DELETE");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            // Remove leading slash and split the path
            String path = pathInfo.substring(1);
            String[] parts = path.split("/");

            if (parts.length < 2) {
                System.out.println("ERROR: Resource ID required for DELETE - insufficient path parts");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            switch (parts[0]) {
                case "staff":
                    System.out.println("DELETE: Handling staff deletion request for ID: " + parts[1]);
                    handleStaffDelete(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("DELETE: Handling payroll deletion request for ID: " + parts[1]);
                    handlePayrollDelete(request, response, parts);
                    break;
                case "batch":
                    System.out.println("DELETE: Handling batch deletion request for ID: " + parts[1]);
                    handleBatchDelete(request, response, parts);
                    break;
                case "announcements":
                    System.out.println("DELETE: Handling announcements deletion request for ID: " + parts[1]);
                    handleAnnouncementsDelete(request, response, parts);
                    break;
                case "calendar":
                    System.out.println("DELETE: Handling calendar deletion request for ID: " + parts[1]);
                    handleCalendarDelete(request, response, parts);
                    break;
                default:
                    System.out.println("ERROR: Invalid endpoint for DELETE - " + parts[0]);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Invalid endpoint");
            }
        } catch (Exception e) {
            System.out.println("ERROR: Exception in doDelete - " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
        System.out.println("DELETE: Request completed");
    }

    // Staff handlers
    private void handleStaffGet(HttpServletRequest request, HttpServletResponse response,
                                String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get all staff
            System.out.println("Retrieving all staff");
            List<Staff> staffList = staffService.getAllStaff();
            System.out.println("Retrieved " + staffList.size() + " staff records");
            ApiResponse<List<Staff>> apiResponse = new ApiResponse<>(true, "Staff retrieved successfully", staffList);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length >= 2) {
            try {
                int id = Integer.parseInt(parts[1]);

                if (parts.length == 2) {
                    // Get specific staff
                    System.out.println("Retrieving staff with ID: " + id);
                    Staff staff = staffService.getStaffById(id);
                    if (staff != null) {
                        System.out.println("Staff found: " + staff.getFirstName() + " " + staff.getLastName());
                        ApiResponse<Staff> apiResponse = new ApiResponse<>(true, "Staff retrieved successfully", staff);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        System.out.println("Staff not found with ID: " + id);
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Staff not found");
                    }
                } else if (parts.length == 3 && "roles".equals(parts[2])) {
                    // Get staff roles
                    System.out.println("Retrieving roles for staff ID: " + id);
                    List<StaffRole> roles = staffService.getStaffRoles(id);
                    System.out.println("Retrieved " + roles.size() + " roles for staff ID: " + id);
                    ApiResponse<List<StaffRole>> apiResponse = new ApiResponse<>(true, "Staff roles retrieved successfully", roles);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("ERROR: Invalid staff request with parts: " + String.join("/", parts));
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff request");
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid staff ID format: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff ID");
            }
        }
    }

    private void handleStaffPost(HttpServletRequest request, HttpServletResponse response,
                                 String[] parts) throws Exception {
        if (parts.length == 1) {
            // Create new staff
            System.out.println("Creating new staff member");
            String requestBody = readRequestBody(request);
            System.out.println("Request body: " + requestBody);
            Staff staff = JsonUtils.parseStaff(requestBody);
            Staff newStaff = staffService.addStaff(staff);
            System.out.println("Staff created with ID: " + newStaff.getId() + ", Name: " + newStaff.getFirstName() + " " + newStaff.getLastName());

            ApiResponse<Staff> apiResponse = new ApiResponse<>(true,
                    "Staff created successfully", newStaff);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 3 && "roles".equals(parts[2])) {
            try {
                int staffId = Integer.parseInt(parts[1]);
                // Add role to staff
                System.out.println("Assigning role to staff ID: " + staffId);
                String requestBody = readRequestBody(request);
                System.out.println("Role request body: " + requestBody);
                StaffRole role = JsonUtils.parseStaffRole(requestBody);
                role.setStaffId(staffId);
                staffService.assignRole(role);
                System.out.println("Role assigned successfully to staff ID: " + staffId + ", Role: " + role.getRole());

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Role assigned successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid staff ID format for role assignment: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff ID");
            }
        } else {
            System.out.println("ERROR: Invalid staff POST request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff request");
        }
    }

    private void handleStaffPut(HttpServletRequest request, HttpServletResponse response,
                                String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid staff update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff update request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            System.out.println("Updating staff with ID: " + id);
            String requestBody = readRequestBody(request);
            System.out.println("Staff update request body: " + requestBody);
            Staff staff = JsonUtils.parseStaff(requestBody);

            staffService.updateStaff(id, staff);
            System.out.println("Staff updated successfully, ID: " + id + ", Name: " + staff.getFirstName() + " " + staff.getLastName());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Staff updated successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid staff ID format for update: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff ID");
        }
    }

    private void handleStaffDelete(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 2) {
            try {
                // Delete staff
                int id = Integer.parseInt(parts[1]);
                System.out.println("Deleting staff with ID: " + id);
                staffService.deleteStaff(id);
                System.out.println("Staff deleted successfully, ID: " + id);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Staff deleted successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid staff ID format for deletion: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff ID");
            }
        } else if (parts.length == 3 && "roles".equals(parts[2])) {
            // Delete staff role
            String roleIdParam = request.getParameter("roleId");
            System.out.println("Deleting staff role, role ID: " + roleIdParam);
            int roleId = Integer.parseInt(roleIdParam);
            staffService.removeRole(roleId);
            System.out.println("Staff role removed successfully, role ID: " + roleId);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Role removed successfully", null);
            sendJsonResponse(response, apiResponse);
        } else {
            System.out.println("ERROR: Invalid staff delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff delete request");
        }
    }

    // Payroll handlers
    private void handlePayrollGet(HttpServletRequest request, HttpServletResponse response,
                                  String[] parts) throws Exception {
        if (parts.length == 2 && "staff".equals(parts[1])) {
            // Get payroll history for staff by staff ID
            String staffIdParam = request.getParameter("id");
            if (staffIdParam == null) {
                System.out.println("ERROR: Staff ID required for payroll history");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Staff ID required");
                return;
            }

            try {
                int staffId = Integer.parseInt(staffIdParam);
                System.out.println("Retrieving payroll history for staff ID: " + staffId);
                List<Payroll> payrollHistory = payrollService.getPayrollHistory(staffId);
                System.out.println("Retrieved " + payrollHistory.size() + " payroll records for staff ID: " + staffId);

                ApiResponse<List<Payroll>> apiResponse = new ApiResponse<>(true, "Payroll records retrieved successfully", payrollHistory);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid staff ID format for payroll history: " + staffIdParam);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff ID");
            }
        } else if (parts.length == 2) {
            try {
                // Get specific payroll by ID
                int id = Integer.parseInt(parts[1]);
                System.out.println("Retrieving payroll record with ID: " + id);
                Payroll payroll = payrollService.getPayrollById(id);

                if (payroll != null) {
                    System.out.println("Payroll record found, ID: " + id + ", Staff ID: " + payroll.getStaffId());
                    ApiResponse<Payroll> apiResponse = new ApiResponse<>(true, "Payroll record retrieved successfully", payroll);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("Payroll record not found with ID: " + id);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Payroll record not found");
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid payroll ID format: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll ID");
            }
        } else {
            System.out.println("ERROR: Invalid payroll request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll request");
        }
    }

    private void handlePayrollPost(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 1) {
            // Process payroll
            String requestBody = readRequestBody(request);
            System.out.println("Processing payroll, request body: " + requestBody);
            Payroll payroll = JsonUtils.parsePayroll(requestBody);
            System.out.println("Processing payroll for staff ID: " + payroll.getStaffId() + ", Month: " + payroll.getSalaryMonth());

            payrollService.processPayroll(payroll.getStaffId(), payroll.getSalaryMonth());
            System.out.println("Payroll processed successfully for staff ID: " + payroll.getStaffId());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Payroll processed successfully", null);
            sendJsonResponse(response, apiResponse);
        } else {
            System.out.println("ERROR: Invalid payroll POST request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll request");
        }
    }

    private void handlePayrollPut(HttpServletRequest request, HttpServletResponse response,
                                  String[] parts) throws Exception {
        if (parts.length == 2 && "pay".equals(parts[1])) {
            // Mark payroll as paid
            String requestBody = readRequestBody(request);
            System.out.println("Marking payroll as paid, request body: " + requestBody);
            Payroll payroll = JsonUtils.parsePayroll(requestBody);
            System.out.println("Marking payroll as paid, ID: " + payroll.getId());

            payrollService.markPayrollAsPaid(payroll.getId(), new Date());
            System.out.println("Payroll marked as paid successfully, ID: " + payroll.getId());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Payroll marked as paid", null);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2) {
            try {
                int id = Integer.parseInt(parts[1]);
                // Update payroll details
                String requestBody = readRequestBody(request);
                System.out.println("Updating payroll details, ID: " + id + ", request body: " + requestBody);
                Payroll payroll = JsonUtils.parsePayroll(requestBody);
                // Update logic would go here
                System.out.println("Payroll updated successfully, ID: " + id);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Payroll updated successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid payroll ID format for update: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll ID");
            }
        } else {
            System.out.println("ERROR: Invalid payroll update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll update request");
        }
    }

    private void handlePayrollDelete(HttpServletRequest request, HttpServletResponse response,
                                     String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid payroll delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll delete request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            System.out.println("Deleting payroll record with ID: " + id);
            payrollService.deletePayroll(id);
            System.out.println("Payroll record deleted successfully, ID: " + id);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Payroll record deleted successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid payroll ID format for deletion: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll ID");
        }
    }

    // Batch handlers
    private void handleBatchGet(HttpServletRequest request, HttpServletResponse response,
                                String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get all batches
            System.out.println("Retrieving all batches");
            List<Batch> batches = batchService.getAllBatches();
            System.out.println("Retrieved " + batches.size() + " batches");
            ApiResponse<List<Batch>> apiResponse = new ApiResponse<>(true, "Batches retrieved successfully", batches);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length >= 2) {
            try {
                int id = Integer.parseInt(parts[1]);

                if (parts.length == 2) {
                    // Get specific batch
                    System.out.println("Retrieving batch with ID: " + id);
                    Batch batch = batchService.getBatchById(id);
                    if (batch != null) {
                        System.out.println("Batch found, ID: " + id + ", Name: " + batch.getBatchName());
                        ApiResponse<Batch> apiResponse = new ApiResponse<>(true, "Batch retrieved successfully", batch);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        System.out.println("Batch not found with ID: " + id);
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Batch not found");
                    }
                } else if (parts.length == 3 && "faculty".equals(parts[2])) {
                    // Get faculty assignments for batch
                    System.out.println("Retrieving faculty assignments for batch ID: " + id);
                    List<BatchFacultyAssignment> assignments =
                            batchService.getBatchFacultyAssignments(id);
                    System.out.println("Retrieved " + assignments.size() + " faculty assignments for batch ID: " + id);
                    ApiResponse<List<BatchFacultyAssignment>> apiResponse = new ApiResponse<>(true, "Faculty assignments retrieved successfully", assignments);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("ERROR: Invalid batch request with parts: " + String.join("/", parts));
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch request");
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid batch ID format: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch ID");
            }
        }
    }

    private void handleBatchPost(HttpServletRequest request, HttpServletResponse response,
                                 String[] parts) throws Exception {
        if (parts.length == 1) {
            // Create new batch
            String requestBody = readRequestBody(request);
            System.out.println("Creating new batch, request body: " + requestBody);
            Batch batch = JsonUtils.parseBatch(requestBody);
            Batch newBatch = batchService.createBatch(batch);
            System.out.println("Batch created successfully, ID: " + newBatch.getId() + ", Name: " + newBatch.getBatchName());

            ApiResponse<Batch> apiResponse = new ApiResponse<>(true,
                    "Batch created successfully", newBatch);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 3 && "faculty".equals(parts[2])) {
            try {
                int batchId = Integer.parseInt(parts[1]);
                // Assign faculty to batch
                String requestBody = readRequestBody(request);
                System.out.println("Assigning faculty to batch ID: " + batchId + ", request body: " + requestBody);
                BatchFacultyAssignment assignment =
                        JsonUtils.parseBatchFacultyAssignment(requestBody);
                assignment.setBatchId(batchId);
                batchService.assignFacultyToBatch(assignment);
                System.out.println("Faculty (ID: " + assignment.getStaffId() + ") assigned to batch ID: " + batchId);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Faculty assigned successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid batch ID format for faculty assignment: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch ID");
            }
        } else {
            System.out.println("ERROR: Invalid batch POST request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch request");
        }
    }

    private void handleBatchPut(HttpServletRequest request, HttpServletResponse response,
                                String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid batch update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch update request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            String requestBody = readRequestBody(request);
            System.out.println("Updating batch with ID: " + id + ", request body: " + requestBody);
            Batch batch = JsonUtils.parseBatch(requestBody);

            batchService.updateBatch(id, batch);
            System.out.println("Batch updated successfully, ID: " + id + ", Name: " + batch.getBatchName());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Batch updated successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid batch ID format for update: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch ID");
        }
    }

    private void handleBatchDelete(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 2) {
            try {
                // Delete batch
                int id = Integer.parseInt(parts[1]);
                System.out.println("Deleting batch with ID: " + id);
                batchService.deleteBatch(id);
                System.out.println("Batch deleted successfully, ID: " + id);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Batch deleted successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid batch ID format for deletion: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch ID");
            }
        } else if (parts.length == 3 && "faculty".equals(parts[2])) {
            // Remove faculty assignment
            String assignmentIdParam = request.getParameter("assignmentId");
            if (assignmentIdParam == null) {
                System.out.println("ERROR: Assignment ID required for faculty removal");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Assignment ID required");
                return;
            }

            try {
                int assignmentId = Integer.parseInt(assignmentIdParam);
                System.out.println("Removing faculty assignment with ID: " + assignmentId);
                batchService.removeFacultyAssignment(assignmentId);
                System.out.println("Faculty assignment removed successfully, ID: " + assignmentId);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Faculty assignment removed successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid assignment ID format: " + assignmentIdParam);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid assignment ID");
            }
        } else {
            System.out.println("ERROR: Invalid batch delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch delete request");
        }
    }

    // Announcements handlers
    private void handleAnnouncementsGet(HttpServletRequest request, HttpServletResponse response,
                                        String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get active announcements
            System.out.println("Retrieving active announcements");
            List<Announcement> announcements = announcementService.getActiveAnnouncements();
            System.out.println("Retrieved " + announcements.size() + " active announcements");
            ApiResponse<List<Announcement>> apiResponse = new ApiResponse<>(true, "Announcements retrieved successfully", announcements);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2) {
            if ("all".equals(parts[1])) {
                // Get all announcements including drafts and archived
                System.out.println("Retrieving all announcements");
                List<Announcement> announcements = announcementService.getAllAnnouncements();
                System.out.println("Retrieved " + announcements.size() + " announcements (including drafts and archived)");
                ApiResponse<List<Announcement>> apiResponse = new ApiResponse<>(true, "All announcements retrieved successfully", announcements);
                sendJsonResponse(response, apiResponse);
            } else {
                try {
                    // Get specific announcement
                    int id = Integer.parseInt(parts[1]);
                    System.out.println("Retrieving announcement with ID: " + id);
                    Announcement announcement = announcementService.getAnnouncementById(id);

                    if (announcement != null) {
                        System.out.println("Announcement found, ID: " + id + ", Title: " + announcement.getTitle());
                        ApiResponse<Announcement> apiResponse = new ApiResponse<>(true, "Announcement retrieved successfully", announcement);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        System.out.println("Announcement not found with ID: " + id);
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Announcement not found");
                    }
                } catch (NumberFormatException e) {
                    System.out.println("ERROR: Invalid announcement ID format: " + parts[1]);
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement ID");
                }
            }
        } else {
            System.out.println("ERROR: Invalid announcement request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement request");
        }
    }

    private void handleAnnouncementsPost(HttpServletRequest request, HttpServletResponse response,
                                         String[] parts) throws Exception {
        if (parts.length != 1) {
            System.out.println("ERROR: Invalid announcement create request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement create request");
            return;
        }

        String requestBody = readRequestBody(request);
        System.out.println("Creating new announcement, request body: " + requestBody);
        Announcement announcement = JsonUtils.parseAnnouncement(requestBody);
        Announcement newAnnouncement = announcementService.createAnnouncement(announcement);
        System.out.println("Announcement created successfully, ID: " + newAnnouncement.getId() + ", Title: " + newAnnouncement.getTitle());

        ApiResponse<Announcement> apiResponse = new ApiResponse<>(true,
                "Announcement created successfully", newAnnouncement);
        sendJsonResponse(response, apiResponse);
    }

    private void handleAnnouncementsPut(HttpServletRequest request, HttpServletResponse response,
                                        String[] parts) throws Exception {
        if (parts.length < 2) {
            System.out.println("ERROR: Invalid announcement update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement update request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);

            if (parts.length == 2) {
                // Update announcement
                String requestBody = readRequestBody(request);
                System.out.println("Updating announcement with ID: " + id + ", request body: " + requestBody);
                Announcement announcement = JsonUtils.parseAnnouncement(requestBody);

                announcementService.updateAnnouncement(id, announcement);
                System.out.println("Announcement updated successfully, ID: " + id + ", Title: " + announcement.getTitle());

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Announcement updated successfully", null);
                sendJsonResponse(response, apiResponse);
            } else if (parts.length == 3) {
                // Change announcement status
                if ("publish".equals(parts[2])) {
                    System.out.println("Publishing announcement with ID: " + id);
                    announcementService.publishAnnouncement(id);
                    System.out.println("Announcement published successfully, ID: " + id);
                    ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                            "Announcement published successfully", null);
                    sendJsonResponse(response, apiResponse);
                } else if ("archive".equals(parts[2])) {
                    System.out.println("Archiving announcement with ID: " + id);
                    announcementService.archiveAnnouncement(id);
                    System.out.println("Announcement archived successfully, ID: " + id);
                    ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                            "Announcement archived successfully", null);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("ERROR: Invalid announcement action: " + parts[2]);
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement action");
                }
            } else {
                System.out.println("ERROR: Invalid announcement update request with too many parts: " + String.join("/", parts));
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement update request");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid announcement ID format for update: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement ID");
        }
    }

    private void handleAnnouncementsDelete(HttpServletRequest request, HttpServletResponse response,
                                           String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid announcement delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement delete request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            System.out.println("Deleting announcement with ID: " + id);
            announcementService.deleteAnnouncement(id);
            System.out.println("Announcement deleted successfully, ID: " + id);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Announcement deleted successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid announcement ID format for deletion: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid announcement ID");
        }
    }

    // Calendar handlers
    private void handleCalendarGet(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get all events
            System.out.println("Retrieving all calendar events");
            List<AcademicCalendar> events = calendarService.getAllEvents();
            System.out.println("Retrieved " + events.size() + " calendar events");
            ApiResponse<List<AcademicCalendar>> apiResponse = new ApiResponse<>(true, "Calendar events retrieved successfully", events);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2 && "upcoming".equals(parts[1])) {
            // Get upcoming events
            String daysParam = request.getParameter("days");
            int days = daysParam != null ? Integer.parseInt(daysParam) : 30;
            System.out.println("Retrieving upcoming events for next " + days + " days");

            List<AcademicCalendar> events = calendarService.getUpcomingEvents(days);
            System.out.println("Retrieved " + events.size() + " upcoming events");
            ApiResponse<List<AcademicCalendar>> apiResponse = new ApiResponse<>(true, "Upcoming events retrieved successfully", events);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2 && "month".equals(parts[1])) {
            // Get events for specific month
            String yearParam = request.getParameter("year");
            String monthParam = request.getParameter("month");

            if (yearParam == null || monthParam == null) {
                System.out.println("ERROR: Year and month parameters required for monthly events");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Year and month parameters required");
                return;
            }

            try {
                int year = Integer.parseInt(yearParam);
                int month = Integer.parseInt(monthParam);
                System.out.println("Retrieving calendar events for year: " + year + ", month: " + month);

                List<AcademicCalendar> events = calendarService.getEventsByMonth(year, month);
                System.out.println("Retrieved " + events.size() + " events for year: " + year + ", month: " + month);
                ApiResponse<List<AcademicCalendar>> apiResponse = new ApiResponse<>(true, "Monthly events retrieved successfully", events);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid year or month parameters: year=" + yearParam + ", month=" + monthParam);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid year or month parameters");
            }
        } else if (parts.length == 2) {
            try {
                // Get specific event
                int id = Integer.parseInt(parts[1]);
                System.out.println("Retrieving calendar event with ID: " + id);
                AcademicCalendar event = calendarService.getEventById(id);

                if (event != null) {
                    System.out.println("Calendar event found, ID: " + id + ", Title: " + event.getEventTitle());
                    ApiResponse<AcademicCalendar> apiResponse = new ApiResponse<>(true, "Event retrieved successfully", event);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("Calendar event not found with ID: " + id);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Calendar event not found");
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid event ID format: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid event ID");
            }
        } else {
            System.out.println("ERROR: Invalid calendar request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid calendar request");
        }
    }

    private void handleCalendarPost(HttpServletRequest request, HttpServletResponse response,
                                    String[] parts) throws Exception {
        if (parts.length != 1) {
            System.out.println("ERROR: Invalid calendar event create request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid calendar event create request");
            return;
        }

        String requestBody = readRequestBody(request);
        System.out.println("Creating calendar event, request body: " + requestBody);
        AcademicCalendar event = JsonUtils.parseCalendarEvent(requestBody);
        calendarService.addEvent(event);
        System.out.println("Calendar event added successfully, Title: " + event.getEventTitle());

        ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                "Calendar event added successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleCalendarPut(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid calendar event update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid calendar event update request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            String requestBody = readRequestBody(request);
            System.out.println("Updating calendar event with ID: " + id + ", request body: " + requestBody);
            AcademicCalendar event = JsonUtils.parseCalendarEvent(requestBody);

            calendarService.updateEvent(id, event);
            System.out.println("Calendar event updated successfully, ID: " + id + ", Title: " + event.getEventTitle());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Calendar event updated successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid event ID format for update: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid event ID");
        }
    }

    private void handleCalendarDelete(HttpServletRequest request, HttpServletResponse response,
                                      String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid calendar event delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid calendar event delete request");
            return;
        }

        try {
            int id = Integer.parseInt(parts[1]);
            System.out.println("Deleting calendar event with ID: " + id);
            calendarService.deleteEvent(id);
            System.out.println("Calendar event deleted successfully, ID: " + id);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Calendar event deleted successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid event ID format for deletion: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid event ID");
        }
    }

    // Helper methods
    private String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }

    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse)
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = apiResponse.toJson();
        System.out.println("Sending JSON response: " + jsonResponse);
        response.getWriter().write(jsonResponse);
    }

    private void handleError(HttpServletResponse response, Exception e)
            throws IOException {
        System.out.println("ERROR: Exception handled in servlet: " + e.getMessage());
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }

    // Logging helper method
    private void logRequestInfo(HttpServletRequest request, String method) {
        System.out.println("\n========== REQUEST START ==========");
        System.out.println(method + " Request: " + request.getRequestURL() +
                (request.getQueryString() != null ? "?" + request.getQueryString() : ""));
        System.out.println("Remote Address: " + request.getRemoteAddr());
        System.out.println("Content Type: " + request.getContentType());
        System.out.println("User Agent: " + request.getHeader("User-Agent"));

        // Log request parameters
        System.out.println("Request Parameters:");
        request.getParameterMap().forEach((key, values) -> {
            System.out.println("  " + key + ": " + String.join(", ", values));
        });

        System.out.println("Request Headers:");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println("  " + headerName + ": " + request.getHeader(headerName));
        }
        System.out.println("===================================");
    }
}