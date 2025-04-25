package com.adhyana.student;

import com.adhyana.student.models.*;
import com.adhyana.student.services.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ScholarshipServlet extends HttpServlet {

    private final ScholarshipService scholarshipService = new ScholarshipService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo.startsWith("/scholarships")) {
                handleScholarshipsGet(request, response, pathInfo.substring("/scholarships".length()));
            } else if (pathInfo.startsWith("/applications")) {
                handleApplicationsGet(request, response, pathInfo.substring("/applications".length()));
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo.equals("/scholarships")) {
                // Create a new scholarship
                handleCreateScholarship(request, response);
            } else if (pathInfo.equals("/applications")) {
                // Submit a new scholarship application
                handleCreateApplication(request, response);
            } else if (pathInfo.startsWith("/scholarships/process/")) {
                // Process applications for a specific scholarship
                int scholarshipId = Integer.parseInt(pathInfo.substring("/scholarships/process/".length()));
                handleProcessApplications(response, scholarshipId);
            } else if (pathInfo.startsWith("/applications/status/")) {
                // Update application status
                int applicationId = Integer.parseInt(pathInfo.substring("/applications/status/".length()));
                handleUpdateApplicationStatus(request, response, applicationId);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo.startsWith("/scholarships/")) {
                // Update scholarship
                int id = Integer.parseInt(pathInfo.substring("/scholarships/".length()));
                handleUpdateScholarship(request, response, id);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo.startsWith("/scholarships/")) {
                // Delete scholarship
                int id = Integer.parseInt(pathInfo.substring("/scholarships/".length()));
                handleDeleteScholarship(response, id);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    // Scholarship handlers
    private void handleScholarshipsGet(HttpServletRequest request, HttpServletResponse response, String path)
            throws Exception {
        if (path == null || path.equals("/")) {
            // Get all scholarships
            List<Scholarship> scholarships = scholarshipService.getAllScholarships();
            ApiResponse<List<Scholarship>> apiResponse =
                    new ApiResponse<>(true, "Scholarships retrieved successfully", scholarships);
            sendJsonResponse(response, apiResponse);
        } else {
            // Get specific scholarship by ID
            int id = Integer.parseInt(path.substring(1));
            Scholarship scholarship = scholarshipService.getScholarship(id);
            if (scholarship != null) {
                ApiResponse<Scholarship> apiResponse =
                        new ApiResponse<>(true, "Scholarship retrieved successfully", scholarship);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Scholarship not found");
            }
        }
    }

    private void handleCreateScholarship(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Scholarship scholarship = parseScholarshipFromRequest(request);
        Scholarship newScholarship = scholarshipService.createScholarship(scholarship);
        ApiResponse<Scholarship> apiResponse =
                new ApiResponse<>(true, "Scholarship created successfully", newScholarship);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateScholarship(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Scholarship scholarship = parseScholarshipFromRequest(request);
        scholarshipService.updateScholarship(id, scholarship);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Scholarship updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteScholarship(HttpServletResponse response, int id) throws Exception {
        scholarshipService.deleteScholarship(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Scholarship deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Scholarship Application handlers
    private void handleApplicationsGet(HttpServletRequest request, HttpServletResponse response, String path)
            throws Exception {
        if (path == null || path.equals("/")) {
            // Get all applications
            List<ScholarshipApplication> applications = scholarshipService.getAllApplications();
            ApiResponse<List<ScholarshipApplication>> apiResponse =
                    new ApiResponse<>(true, "Applications retrieved successfully", applications);
            sendJsonResponse(response, apiResponse);
        } else if (path.startsWith("/student/")) {
            // Get application by student ID
            int studentId = Integer.parseInt(path.substring("/student/".length()));
            ScholarshipApplication application = scholarshipService.getApplicationByStudentId(studentId);
            if (application != null) {
                ApiResponse<ScholarshipApplication> apiResponse =
                        new ApiResponse<>(true, "Application retrieved successfully", application);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "No application found for this student");
            }
        } else {
            // Get specific application by ID
            int id = Integer.parseInt(path.substring(1));
            ScholarshipApplication application = scholarshipService.getApplication(id);
            if (application != null) {
                ApiResponse<ScholarshipApplication> apiResponse =
                        new ApiResponse<>(true, "Application retrieved successfully", application);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Application not found");
            }
        }
    }

    private void handleCreateApplication(HttpServletRequest request, HttpServletResponse response) throws Exception {
        ScholarshipApplication application = parseApplicationFromRequest(request);
        ScholarshipApplication newApplication = scholarshipService.applyForScholarship(application);
        ApiResponse<ScholarshipApplication> apiResponse =
                new ApiResponse<>(true, "Application submitted successfully", newApplication);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateApplicationStatus(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        // Parse status update from request
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");
        String status = null;
        String comments = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                if ("status".equals(key)) {
                    status = value;
                } else if ("comments".equals(key)) {
                    comments = value;
                }
            }
        }
        scholarshipService.updateApplicationStatus(id, status, comments);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Application status updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleProcessApplications(HttpServletResponse response, int scholarshipId) throws Exception {
        int approvedCount = scholarshipService.processScholarshipApplications(scholarshipId);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, approvedCount + " applications approved successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Parse methods
    private Scholarship parseScholarshipFromRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");
        String name = null;
        String description = null;
        double minGpa = 0.0;
        BigDecimal amount = null;
        LocalDate applicationDeadline = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "name":
                        name = value;
                        break;
                    case "description":
                        description = value;
                        break;
                    case "minGpa":
                        minGpa = Double.parseDouble(value);
                        break;
                    case "amount":
                        amount = new BigDecimal(value);
                        break;
                    case "applicationDeadline":
                        applicationDeadline = LocalDate.parse(value);
                        break;
                }
            }
        }

        return new Scholarship(0, name, description, minGpa, amount, applicationDeadline);
    }

    private ScholarshipApplication parseApplicationFromRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");
        int studentId = 0;
        int scholarshipId = 0;
        String studentBatch = null;
        String studentDegree = null;
        double studentGpa = 0.0;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "studentId":
                        studentId = Integer.parseInt(value);
                        break;
                    case "scholarshipId":
                        scholarshipId = Integer.parseInt(value);
                        break;
                    case "studentBatch":
                        studentBatch = value;
                        break;
                    case "studentDegree":
                        studentDegree = value;
                        break;
                    case "studentGpa":
                        studentGpa = Double.parseDouble(value);
                        break;
                }
            }
        }

        // Default status for new applications is "Pending"
        return new ScholarshipApplication(0, studentId, scholarshipId, studentBatch,
                studentDegree, studentGpa, "Pending", null);
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