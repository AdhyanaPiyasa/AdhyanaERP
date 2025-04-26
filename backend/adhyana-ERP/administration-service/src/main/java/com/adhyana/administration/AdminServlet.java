package com.adhyana.administration;

import com.adhyana.administration.models.*;
import com.adhyana.administration.services.*;
import com.adhyana.administration.utils.JsonUtils;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

/**
 * Servlet for handling HTTP requests to the Core Administration Service.
 */
@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {
    private final StaffService staffService = new StaffService();
    private final PayrollService payrollService = new PayrollService();
    private final BatchService batchService = new BatchService();
    private final EnrollmentService enrollmentService = new EnrollmentService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logRequestInfo(request, "GET");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Root endpoint - return service info
                System.out.println("GET: Accessing root endpoint");
                ApiResponse<String> apiResponse = new ApiResponse<>(true, "Core Administration Service API", "v1.0");
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
                case "student":
                    System.out.println("GET: Handling student request");
                    handleStudentGet(request, response, parts);
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
                case "student":
                    System.out.println("POST: Handling student request");
                    handleStudentPost(request, response, parts);
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
                    System.out.println("PUT: Handling staff update request");
                    handleStaffPut(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("PUT: Handling payroll update request");
                    handlePayrollPut(request, response, parts);
                    break;
                case "batch":
                    System.out.println("PUT: Handling batch update request");
                    handleBatchPut(request, response, parts);
                    break;
                case "student":
                    System.out.println("PUT: Handling student update request");
                    handleStudentPut(request, response, parts);
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
                    System.out.println("DELETE: Handling staff deletion request");
                    handleStaffDelete(request, response, parts);
                    break;
                case "payroll":
                    System.out.println("DELETE: Handling payroll deletion request");
                    handlePayrollDelete(request, response, parts);
                    break;
                case "batch":
                    System.out.println("DELETE: Handling batch deletion request");
                    handleBatchDelete(request, response, parts);
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
                int staffId = Integer.parseInt(parts[1]);

                if (parts.length == 2) {
                    // Get specific staff
                    System.out.println("Retrieving staff with ID: " + staffId);
                    Staff staff = staffService.getStaffById(staffId);
                    if (staff != null) {
                        System.out.println("Staff found: " + staff.getName());
                        ApiResponse<Staff> apiResponse = new ApiResponse<>(true, "Staff retrieved successfully", staff);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        System.out.println("Staff not found with ID: " + staffId);
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Staff not found");
                    }
                } else if (parts.length == 3) {
                    if ("roles".equals(parts[2])) {
                        // Get staff roles
                        System.out.println("Retrieving roles for staff ID: " + staffId);
                        List<StaffRole> roles = staffService.getStaffRoles(staffId);
                        System.out.println("Retrieved " + roles.size() + " roles for staff ID: " + staffId);
                        ApiResponse<List<StaffRole>> apiResponse = new ApiResponse<>(true, "Staff roles retrieved successfully", roles);
                        sendJsonResponse(response, apiResponse);
                    } else if ("attendance".equals(parts[2])) {
                        // Get staff attendance
                        System.out.println("Retrieving attendance for staff ID: " + staffId);
                        List<StaffAttendance> attendance = staffService.getStaffAttendance(staffId);
                        System.out.println("Retrieved " + attendance.size() + " attendance records for staff ID: " + staffId);
                        ApiResponse<List<StaffAttendance>> apiResponse = new ApiResponse<>(true, "Staff attendance retrieved successfully", attendance);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        System.out.println("ERROR: Invalid staff request with parts: " + String.join("/", parts));
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff request");
                    }
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
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Request body: " + requestBody);
            Staff staff = JsonUtils.parseStaff(requestBody);
            Staff newStaff = staffService.addStaff(staff);
            System.out.println("Staff created with ID: " + newStaff.getStaffId() + ", Name: " + newStaff.getName());

            ApiResponse<Staff> apiResponse = new ApiResponse<>(true,
                    "Staff created successfully", newStaff);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 3 && "roles".equals(parts[2])) {
            try {
                int staffId = Integer.parseInt(parts[1]);
                // Add role to staff
                System.out.println("Assigning role to staff ID: " + staffId);
                String requestBody = JsonUtils.readRequestBody(request);
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
        } else if (parts.length == 3 && "attendance".equals(parts[2])) {
            try {
                int staffId = Integer.parseInt(parts[1]);
                // Record staff attendance
                System.out.println("Recording attendance for staff ID: " + staffId);
                String requestBody = JsonUtils.readRequestBody(request);
                System.out.println("Attendance request body: " + requestBody);
                StaffAttendance attendance = JsonUtils.parseStaffAttendance(requestBody);
                attendance.setStaffId(staffId);
                StaffAttendance newAttendance = staffService.recordAttendance(attendance);
                System.out.println("Attendance recorded successfully for staff ID: " + staffId);

                ApiResponse<StaffAttendance> apiResponse = new ApiResponse<>(true,
                        "Attendance recorded successfully", newAttendance);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid staff ID format for attendance recording: " + parts[1]);
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
            int staffId = Integer.parseInt(parts[1]);
            System.out.println("Updating staff with ID: " + staffId);
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Staff update request body: " + requestBody);
            Staff staff = JsonUtils.parseStaff(requestBody);

            staffService.updateStaff(staffId, staff);
            System.out.println("Staff updated successfully, ID: " + staffId + ", Name: " + staff.getName());

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
                int staffId = Integer.parseInt(parts[1]);
                System.out.println("Deleting staff with ID: " + staffId);
                staffService.deleteStaff(staffId);
                System.out.println("Staff deleted successfully, ID: " + staffId);

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
            if (roleIdParam == null) {
                System.out.println("ERROR: Role ID required for role deletion");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Role ID required");
                return;
            }

            try {
                int roleId = Integer.parseInt(roleIdParam);
                System.out.println("Deleting staff role, role ID: " + roleId);
                staffService.removeRole(roleId);
                System.out.println("Staff role removed successfully, role ID: " + roleId);

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Role removed successfully", null);
                sendJsonResponse(response, apiResponse);
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid role ID format: " + roleIdParam);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid role ID");
            }
        } else {
            System.out.println("ERROR: Invalid staff delete request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid staff delete request");
        }
    }

    // Payroll handlers
    private void handlePayrollGet(HttpServletRequest request, HttpServletResponse response,
                                  String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get all payroll records
            System.out.println("Retrieving all payroll records");
            List<Payroll> allPayroll = payrollService.getAllPayroll();
            System.out.println("Retrieved " + allPayroll.size() + " payroll records");

            ApiResponse<List<Payroll>> apiResponse = new ApiResponse<>(true, "All payroll records retrieved successfully", allPayroll);
            sendJsonResponse(response, apiResponse);
            return;
        } else if (parts.length == 2 && "staff".equals(parts[1])) {
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
                int payrollId = Integer.parseInt(parts[1]);
                System.out.println("Retrieving payroll record with ID: " + payrollId);
                Payroll payroll = payrollService.getPayrollById(payrollId);

                if (payroll != null) {
                    System.out.println("Payroll record found, ID: " + payrollId + ", Staff ID: " + payroll.getStaffId());
                    ApiResponse<Payroll> apiResponse = new ApiResponse<>(true, "Payroll record retrieved successfully", payroll);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("Payroll record not found with ID: " + payrollId);
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
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Processing payroll, request body: " + requestBody);
            Payroll payroll = JsonUtils.parsePayroll(requestBody);
            System.out.println("Processing payroll for staff ID: " + payroll.getStaffId() + ", Month: " + payroll.getSalaryMonth());

            Payroll processedPayroll = payrollService.processPayroll(payroll.getStaffId(), payroll.getSalaryMonth());
            System.out.println("Payroll processed successfully for staff ID: " + payroll.getStaffId());

            ApiResponse<Payroll> apiResponse = new ApiResponse<>(true,
                    "Payroll processed successfully", processedPayroll);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2 && "bulk".equals(parts[1])) {
            // Process bulk payroll
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Processing bulk payroll, request body: " + requestBody);

            // Extract month from request
            // For simplicity, assuming the request contains a payroll object with just the month
            Payroll payroll = JsonUtils.parsePayroll(requestBody);

            if (payroll.getSalaryMonth() == null) {
                System.out.println("ERROR: Month required for bulk payroll processing");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Month required");
                return;
            }

            int processedCount = payrollService.processBulkPayroll(payroll.getSalaryMonth());
            System.out.println("Processed payroll for " + processedCount + " staff members");

            ApiResponse<Integer> apiResponse = new ApiResponse<>(true,
                    "Bulk payroll processed successfully for " + processedCount + " staff members",
                    processedCount);
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
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Marking payroll as paid, request body: " + requestBody);

            // Check if it's a single payroll or multiple
            if (requestBody.contains("\"payrollIds\"")) {
                // Handle multiple payrolls
                // For simplicity, assuming format: {"payrollIds":[1,2,3],"paymentDate":"2025-04-26"}
                try {
                    List<Integer> payrollIds = new ArrayList<>();
                    String idsStr = requestBody.substring(requestBody.indexOf("[") + 1, requestBody.indexOf("]"));
                    for (String idStr : idsStr.split(",")) {
                        payrollIds.add(Integer.parseInt(idStr.trim()));
                    }

                    // Extract payment date
                    Date paymentDate = new Date(); // Default to current date
                    int dateStart = requestBody.indexOf("\"paymentDate\":\"");
                    if (dateStart != -1) {
                        dateStart += 15; // Length of "paymentDate":"
                        int dateEnd = requestBody.indexOf("\"", dateStart);
                        if (dateEnd != -1) {
                            String dateStr = requestBody.substring(dateStart, dateEnd);
                            try {
                                paymentDate = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
                            } catch (Exception e) {
                                System.out.println("ERROR: Invalid date format. Using current date.");
                            }
                        }
                    }

                    System.out.println("Marking " + payrollIds.size() + " payrolls as paid");
                    int updatedCount = payrollService.markMultiplePayrollsAsPaid(payrollIds, paymentDate);
                    System.out.println(updatedCount + " payroll records marked as paid");

                    ApiResponse<Integer> apiResponse = new ApiResponse<>(true,
                            updatedCount + " payroll records marked as paid", updatedCount);
                    sendJsonResponse(response, apiResponse);
                } catch (Exception e) {
                    System.out.println("ERROR: Invalid payroll IDs format");
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid payroll IDs format");
                }
            } else {
                // Handle single payroll
                Payroll payroll = JsonUtils.parsePayroll(requestBody);
                System.out.println("Marking payroll as paid, ID: " + payroll.getPayrollId());

                Date paymentDate = payroll.getPaymentDate() != null ? payroll.getPaymentDate() : new Date();
                payrollService.markPayrollAsPaid(payroll.getPayrollId(), paymentDate);
                System.out.println("Payroll marked as paid successfully, ID: " + payroll.getPayrollId());

                ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                        "Payroll marked as paid", null);
                sendJsonResponse(response, apiResponse);
            }
        } else if (parts.length == 2) {
            try {
                int payrollId = Integer.parseInt(parts[1]);
                // Update payroll details
                String requestBody = JsonUtils.readRequestBody(request);
                System.out.println("Updating payroll details, ID: " + payrollId + ", request body: " + requestBody);
                Payroll payroll = JsonUtils.parsePayroll(requestBody);

                payrollService.updatePayroll(payrollId, payroll);
                System.out.println("Payroll updated successfully, ID: " + payrollId);

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
            int payrollId = Integer.parseInt(parts[1]);
            System.out.println("Deleting payroll record with ID: " + payrollId);
            payrollService.deletePayroll(payrollId);
            System.out.println("Payroll record deleted successfully, ID: " + payrollId);

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
            String batchId = parts[1];

            if (parts.length == 2) {
                // Get specific batch
                System.out.println("Retrieving batch with ID: " + batchId);
                Batch batch = batchService.getBatchById(batchId);
                if (batch != null) {
                    System.out.println("Batch found, ID: " + batchId + ", Name: " + batch.getBatchName());
                    ApiResponse<Batch> apiResponse = new ApiResponse<>(true, "Batch retrieved successfully", batch);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("Batch not found with ID: " + batchId);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Batch not found");
                }
            } else if (parts.length == 3 && "faculty".equals(parts[2])) {
                // Get faculty assignments for batch
                System.out.println("Retrieving faculty assignments for batch ID: " + batchId);
                List<BatchFacultyAssignment> assignments = batchService.getBatchFacultyAssignments(batchId);
                System.out.println("Retrieved " + assignments.size() + " faculty assignments for batch ID: " + batchId);
                ApiResponse<List<BatchFacultyAssignment>> apiResponse = new ApiResponse<>(true, "Faculty assignments retrieved successfully", assignments);
                sendJsonResponse(response, apiResponse);
            } else if (parts.length == 3 && "students".equals(parts[2])) {
                // Get students in batch
                System.out.println("Retrieving students for batch ID: " + batchId);
                List<Student> students = enrollmentService.getStudentsByBatch(batchId);
                System.out.println("Retrieved " + students.size() + " students for batch ID: " + batchId);
                ApiResponse<List<Student>> apiResponse = new ApiResponse<>(true, "Students retrieved successfully", students);
                sendJsonResponse(response, apiResponse);
            } else {
                System.out.println("ERROR: Invalid batch request with parts: " + String.join("/", parts));
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid batch request");
            }
        }
    }

    private void handleBatchPost(HttpServletRequest request, HttpServletResponse response,
                                 String[] parts) throws Exception {
        if (parts.length == 1) {
            // Create new batch
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Creating new batch, request body: " + requestBody);
            Batch batch = JsonUtils.parseBatch(requestBody);
            Batch newBatch = batchService.createBatch(batch);
            System.out.println("Batch created successfully, ID: " + newBatch.getBatchId() + ", Name: " + newBatch.getBatchName());

            ApiResponse<Batch> apiResponse = new ApiResponse<>(true,
                    "Batch created successfully", newBatch);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 3 && "faculty".equals(parts[2])) {
            // Assign faculty to batch
            String batchId = parts[1];
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Assigning faculty to batch ID: " + batchId + ", request body: " + requestBody);
            BatchFacultyAssignment assignment = JsonUtils.parseBatchFacultyAssignment(requestBody);
            assignment.setBatchId(batchId);
            batchService.assignFacultyToBatch(assignment);
            System.out.println("Faculty (ID: " + assignment.getStaffId() + ") assigned to batch ID: " + batchId);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Faculty assigned successfully", null);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 3 && "enrollment".equals(parts[2])) {
            // Bulk enroll students to batch
            String batchId = parts[1];
            System.out.println("Performing bulk enrollment for batch ID: " + batchId);

            // Perform bulk enrollment
            int enrolledCount = enrollmentService.bulkEnrollStudents(batchId);
            System.out.println("Enrolled " + enrolledCount + " students to batch ID: " + batchId);

            ApiResponse<Integer> apiResponse = new ApiResponse<>(true,
                    "Enrolled " + enrolledCount + " students successfully", enrolledCount);
            sendJsonResponse(response, apiResponse);
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

        String batchId = parts[1];
        String requestBody = JsonUtils.readRequestBody(request);
        System.out.println("Updating batch with ID: " + batchId + ", request body: " + requestBody);
        Batch batch = JsonUtils.parseBatch(requestBody);

        batchService.updateBatch(batchId, batch);
        System.out.println("Batch updated successfully, ID: " + batchId + ", Name: " + batch.getBatchName());

        ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                "Batch updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleBatchDelete(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 2) {
            // Delete batch
            String batchId = parts[1];
            System.out.println("Deleting batch with ID: " + batchId);
            batchService.deleteBatch(batchId);
            System.out.println("Batch deleted successfully, ID: " + batchId);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Batch deleted successfully", null);
            sendJsonResponse(response, apiResponse);
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

    // Student handlers
    private void handleStudentGet(HttpServletRequest request, HttpServletResponse response,
                                  String[] parts) throws Exception {
        if (parts.length == 1) {
            // Get all students
            System.out.println("Retrieving all students");
            List<Student> students = enrollmentService.getAllStudents();
            System.out.println("Retrieved " + students.size() + " students");
            ApiResponse<List<Student>> apiResponse = new ApiResponse<>(true, "Students retrieved successfully", students);
            sendJsonResponse(response, apiResponse);
        } else if (parts.length == 2) {
            try {
                // Get specific student by index number
                int indexNumber = Integer.parseInt(parts[1]);
                System.out.println("Retrieving student with index number: " + indexNumber);
                Student student = enrollmentService.getStudentByIndex(indexNumber);

                if (student != null) {
                    System.out.println("Student found, Index: " + indexNumber + ", Name: " + student.getName());
                    ApiResponse<Student> apiResponse = new ApiResponse<>(true, "Student retrieved successfully", student);
                    sendJsonResponse(response, apiResponse);
                } else {
                    System.out.println("Student not found with index number: " + indexNumber);
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Invalid student index number format: " + parts[1]);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index number");
            }
        } else {
            System.out.println("ERROR: Invalid student request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student request");
        }
    }

    private void handleStudentPost(HttpServletRequest request, HttpServletResponse response,
                                   String[] parts) throws Exception {
        if (parts.length == 1) {
            // Enroll new student
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Enrolling new student, request body: " + requestBody);
            Student student = JsonUtils.parseStudent(requestBody);
            Student enrolledStudent = enrollmentService.enrollStudent(student);
            System.out.println("Student enrolled successfully, Index: " + enrolledStudent.getIndexNumber() +
                    ", Name: " + enrolledStudent.getName());

            ApiResponse<Student> apiResponse = new ApiResponse<>(true,
                    "Student enrolled successfully", enrolledStudent);
            sendJsonResponse(response, apiResponse);
        } else {
            System.out.println("ERROR: Invalid student POST request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student request");
        }
    }

    private void handleStudentPut(HttpServletRequest request, HttpServletResponse response,
                                  String[] parts) throws Exception {
        if (parts.length != 2) {
            System.out.println("ERROR: Invalid student update request with parts: " + String.join("/", parts));
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student update request");
            return;
        }

        try {
            int indexNumber = Integer.parseInt(parts[1]);
            String requestBody = JsonUtils.readRequestBody(request);
            System.out.println("Updating student with index number: " + indexNumber + ", request body: " + requestBody);
            Student student = JsonUtils.parseStudent(requestBody);

            enrollmentService.updateStudent(indexNumber, student);
            System.out.println("Student updated successfully, Index: " + indexNumber + ", Name: " + student.getName());

            ApiResponse<Void> apiResponse = new ApiResponse<>(true,
                    "Student updated successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid student index number format for update: " + parts[1]);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index number");
        }
    }

    // Helper methods
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

        System.out.println("===================================");
    }
}