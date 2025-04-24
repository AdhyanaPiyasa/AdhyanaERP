package com.adhyana.student;

import com.adhyana.student.models.*;
import com.adhyana.student.services.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public class StudentApplicationServlet extends HttpServlet {

    private final StudentApplicationService applicationService = new StudentApplicationService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/newapplications".length());

            if (subPath == null || subPath.equals("") || subPath.equals("/")) {
                // Get all applications
                handleGetAllApplications(response);
            } else if (subPath.startsWith("/status/")) {
                String status = subPath.substring("/status/".length());
                handleGetApplicationsByStatus(response, status);
            } else {
                try {
                    // Assume it's an application ID
                    int id = Integer.parseInt(subPath.substring(1));
                    handleGetApplication(response, id);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/newapplications".length());

            if (subPath == null || subPath.equals("") || subPath.equals("/")) {
                // Create a new application
                handleCreateApplication(request, response);
            } else if (subPath.startsWith("/status/")) {
                // Update application status
                int id = Integer.parseInt(subPath.substring("/status/".length()));
                handleUpdateApplicationStatus(request, response, id);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    // Handler methods
    private void handleGetAllApplications(HttpServletResponse response) throws Exception {
        List<StudentApplication> applications = applicationService.getAllApplications();
        ApiResponse<List<StudentApplication>> apiResponse =
                new ApiResponse<>(true, "Applications retrieved successfully", applications);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetApplicationsByStatus(HttpServletResponse response , String status) throws Exception {
        List<StudentApplication> applications = applicationService.getApplicationsByStatus(status);
        ApiResponse<List<StudentApplication>> apiResponse =
                new ApiResponse<>(true, "Applications retrieved successfully", applications);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetApplication(HttpServletResponse response, int id) throws Exception {
        StudentApplication application = applicationService.getApplication(id);
        if (application != null) {
            ApiResponse<StudentApplication> apiResponse =
                    new ApiResponse<>(true, "Application retrieved successfully", application);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Application not found");
        }
    }

    private void handleCreateApplication(HttpServletRequest request, HttpServletResponse response) throws Exception {
        StudentApplication application = parseApplicationFromRequest(request);

        // Set initial status as "Pending"
        application.setStatus("Pending");

        StudentApplication.ApplicationResponse result = applicationService.createApplication(application);
        ApiResponse<StudentApplication.ApplicationResponse> apiResponse =
                new ApiResponse<>(true, "Application submitted successfully", result);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateApplicationStatus(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        String status = parseStatusFromRequest(request);
        applicationService.updateApplicationStatus(id, status);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Application status updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Parse methods
    private StudentApplication parseApplicationFromRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();

        // Parse personal info
        String personalInfoJson = extractJsonSection(json, "personalInfo");
        String name = extractJsonValue(personalInfoJson, "name");
        String nationalId = extractJsonValue(personalInfoJson, "nationalId");
        String email = extractJsonValue(personalInfoJson, "email");
        String phone = extractJsonValue(personalInfoJson, "phone");
        String gender = extractJsonValue(personalInfoJson, "gender");
        String dateOfBirthStr = extractJsonValue(personalInfoJson, "dateOfBirth");
        LocalDate dateOfBirth = LocalDate.parse(dateOfBirthStr);
        String address = extractJsonValue(personalInfoJson, "address");

        // Parse applied program info
        String appliedProgramJson = extractJsonSection(json, "appliedProgram");
        String appliedProgram = extractJsonValue(appliedProgramJson, "program");
        String applicationDateStr = extractJsonValue(appliedProgramJson, "applicationDate");
        LocalDate applicationDate = LocalDate.parse(applicationDateStr);

        // Parse academic records
        String academicRecordsJson = extractJsonSection(json, "academicRecords");
        String mathematics = extractJsonValue(academicRecordsJson, "mathematics");
        String science = extractJsonValue(academicRecordsJson, "science");
        String english = extractJsonValue(academicRecordsJson, "english");
        String computerStudies = extractJsonValue(academicRecordsJson, "computerStudies");

        // Parse guardian info
        String guardianInfoJson = extractJsonSection(json, "guardianInfo");
        String guardianName = extractJsonValue(guardianInfoJson, "name");
        String guardianNationalId = extractJsonValue(guardianInfoJson, "nationalId");
        String guardianRelation = extractJsonValue(guardianInfoJson, "relation");
        String guardianContactNumber = extractJsonValue(guardianInfoJson, "contactNumber");
        String guardianEmail = extractJsonValue(guardianInfoJson, "email");

        // Parse hostel required
        String hostelRequired = extractJsonValue(json, "hostelRequired");

        // Create the application object
        return new StudentApplication(
                0, // ID will be set by database
                name,
                nationalId,
                email,
                phone,
                gender,
                dateOfBirth,
                address,
                appliedProgram,
                applicationDate,
                mathematics,
                science,
                english,
                computerStudies,
                guardianName,
                guardianNationalId,
                guardianRelation,
                guardianContactNumber,
                guardianEmail,
                hostelRequired,
                null // Status will be set later
        );
    }

    private String parseStatusFromRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();
        return extractJsonValue(json, "status");
    }

    // Helper methods for JSON parsing
    private String extractJsonSection(String json, String sectionName) {
        int start = json.indexOf("\"" + sectionName + "\":");
        if (start == -1) {
            return "{}";
        }

        start = json.indexOf("{", start);
        if (start == -1) {
            return "{}";
        }

        int count = 1;
        int end = start + 1;
        while (count > 0 && end < json.length()) {
            char c = json.charAt(end);
            if (c == '{') {
                count++;
            } else if (c == '}') {
                count--;
            }
            end++;
        }

        return json.substring(start, end);
    }

    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int start = json.indexOf(searchKey);
        if (start == -1) {
            return "";
        }

        start += searchKey.length();
        // Skip whitespace
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) {
            start++;
        }

        // Check if value is a string
        boolean isString = false;
        if (start < json.length() && json.charAt(start) == '"') {
            isString = true;
            start++;
        }

        int end = start;
        if (isString) {
            // Find end of string (ignore escaped quotes)
            while (end < json.length()) {
                if (json.charAt(end) == '"' && json.charAt(end - 1) != '\\') {
                    break;
                }
                end++;
            }
        } else {
            // Find end of non-string value
            while (end < json.length() && !isEndOfValue(json.charAt(end))) {
                end++;
            }
        }

        return json.substring(start, end);
    }

    private boolean isEndOfValue(char c) {
        return c == ',' || c == '}' || c == ']' || Character.isWhitespace(c);
    }

    // Utility methods
    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse)
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse.toJson());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}