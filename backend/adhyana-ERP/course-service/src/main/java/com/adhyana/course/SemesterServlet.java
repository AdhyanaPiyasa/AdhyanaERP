package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Semester;
import com.adhyana.course.services.SemesterService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@WebServlet("/api/courses/semesters/*")
public class SemesterServlet extends HttpServlet {
    private final SemesterService semesterService = new SemesterService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // Debug the full request details
            System.out.println("=============== REQUEST DEBUG ===============");
            System.out.println("Request URL: " + request.getRequestURL());
            System.out.println("Path Info: " + request.getPathInfo());

            String pathInfo = request.getPathInfo();

            // No pathInfo means get all semesters
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Semester> semesters = semesterService.getAllSemesters();
                ApiResponse<List<Semester>> apiResponse = new ApiResponse<>(true, "All semesters retrieved", semesters);
                sendJsonResponse(response, apiResponse);
                return;
            }

            // Remove leading slash
            if (pathInfo.startsWith("/")) {
                pathInfo = pathInfo.substring(1);
            }

            // Special case for batch lookup
            if (pathInfo.startsWith("batch/")) {
                String batchIdStr = pathInfo.substring("batch/".length());
                try {
                    int batchId = Integer.parseInt(batchIdStr);
                    List<Semester> semesters = semesterService.getSemestersByBatchId(batchId);

                    if (!semesters.isEmpty()) {
                        ApiResponse<List<Semester>> apiResponse = new ApiResponse<>(true,
                                "Semesters retrieved for batch ID: " + batchId, semesters);
                        sendJsonResponse(response, apiResponse);
                    } else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND,
                                "No semesters found for batch ID: " + batchId);
                    }
                    return;
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                            "Invalid batch ID format: " + batchIdStr);
                    return;
                }
            }

            // First try direct ID lookup (for backwards compatibility)
            try {
                int id = Integer.parseInt(pathInfo);
                Semester semester = semesterService.getSemesterById(id);
                if (semester != null) {
                    ApiResponse<Semester> apiResponse = new ApiResponse<>(true,
                            "Semester retrieved by ID: " + id, semester);
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Semester not found with ID: " + id);
                }
                return;
            } catch (NumberFormatException e) {
                // Not a direct ID lookup, continue with field-based lookup
            }

            // Split the path into field and value parts
            String[] pathParts = pathInfo.split("/", 2);

            if (pathParts.length < 2) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                        "Invalid URL format. Use /{fieldName}/{value} (e.g., /year/1)");
                return;
            }

            String fieldName = pathParts[0].toLowerCase();
            String fieldValue = URLDecoder.decode(pathParts[1], StandardCharsets.UTF_8.name());

            System.out.println("Searching semesters with " + fieldName + " = " + fieldValue);

            try {
                List<Semester> semesters = semesterService.searchSemestersByField(fieldName, fieldValue);

                if (!semesters.isEmpty()) {
                    ApiResponse<List<Semester>> apiResponse = new ApiResponse<>(true,
                            "Semesters retrieved by " + fieldName + ": " + fieldValue, semesters);
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND,
                            "No semesters found with " + fieldName + " = " + fieldValue);
                }
            } catch (IllegalArgumentException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("Error in doGet: " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Semester semester = parseSemesterFromRequest(request);
            Semester createdSemester = semesterService.createSemester(semester);

            ApiResponse<Semester> apiResponse = new ApiResponse<>(true, "Semester created successfully", createdSemester);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Semester ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            Semester semester = parseSemesterFromRequest(request);
            semester.setId(id);

            boolean updated = semesterService.updateSemester(semester);
            if (updated) {
                // Fetch the updated semester to return in the response
                Semester updatedSemester = semesterService.getSemesterById(id);
                ApiResponse<Semester> apiResponse = new ApiResponse<>(true, "Semester updated successfully", updatedSemester);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Semester not found or update failed");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Semester ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            boolean deleted = semesterService.deleteSemester(id);

            if (deleted) {
                ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Semester deleted successfully", null);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Semester not found or deletion failed");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private Semester parseSemesterFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        Map<String, String> semesterData = parseJsonToMap(json);

        System.out.println("Parsed semester data from request:");
        for (Map.Entry<String, String> entry : semesterData.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue());
        }

        int batchId = Integer.parseInt(semesterData.getOrDefault("batchId", "0"));
        int courseId = Integer.parseInt(semesterData.getOrDefault("courseId", "0"));
        int teacherId = Integer.parseInt(semesterData.getOrDefault("teacherId", "0"));
        int year = Integer.parseInt(semesterData.getOrDefault("year", "0"));
        int semester = Integer.parseInt(semesterData.getOrDefault("semester", "0"));
        String startedAt = semesterData.getOrDefault("startedAt", null);
        String endedAt = semesterData.getOrDefault("endedAt", null);

        return new Semester(0, batchId, courseId, teacherId, year, semester, startedAt, endedAt);
    }

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

    private Map<String, String> parseJsonToMap(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.isEmpty()) {
            return map;
        }

        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2); // Split only on the first ":"
            if (keyValue.length == 2) {
                map.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }

        return map;
    }

    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse.toJson());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        System.err.println("Error processing request: " + e.getMessage());
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}