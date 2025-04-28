// src/main/java/com/adhyana/course/SemesterServlet.java
package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Semester;
// No longer importing SemesterOfferingDetail here as it's not parsed from request
import com.adhyana.course.services.SemesterService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Date;
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
        // --- doGet remains the same: Fetches data including offerings for display ---
        try { String pathInfo = request.getPathInfo(); System.out.println("GET PathInfo: " + pathInfo); if (pathInfo == null || pathInfo.equals("/")) { List<Semester> sems = semesterService.getAllSemesters(); sendJsonResponse(response, new ApiResponse<>(true, "All semesters", sems)); } else { if (pathInfo.startsWith("/")) pathInfo = pathInfo.substring(1); if (pathInfo.startsWith("batch/")) { String batchId = pathInfo.substring("batch/".length()); List<Semester> sems = semesterService.getSemestersByBatchId(batchId); if (!sems.isEmpty()) sendJsonResponse(response, new ApiResponse<>(true, "Semesters for batch " + batchId, sems)); else response.sendError(HttpServletResponse.SC_NOT_FOUND, "No semesters for batch " + batchId); } else { Semester semById = semesterService.getSemesterById(pathInfo); if (semById != null) { sendJsonResponse(response, new ApiResponse<>(true, "Semester by ID " + pathInfo, semById)); } else { String[] parts = pathInfo.split("/", 2); if (parts.length < 2) { response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid URL or ID not found"); return; } String field = parts[0]; String value = URLDecoder.decode(parts[1], StandardCharsets.UTF_8.name()); System.out.println("Searching: " + field + "=" + value); try { List<Semester> sems = semesterService.searchSemestersByField(field, value); if (!sems.isEmpty()) sendJsonResponse(response, new ApiResponse<>(true, "Semesters by " + field, sems)); else response.sendError(HttpServletResponse.SC_NOT_FOUND, "No semesters found for " + field + "=" + value); } catch (IllegalArgumentException e) { response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage()); } } } } }
        catch (Exception e) { System.err.println("Error doGet: " + e.getMessage()); e.printStackTrace(); handleError(response, e); }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // --- Use Simplified Parsing ---
            Semester semester = parseSemesterFromRequestSimple(request);
            // Use simplified service method (no offerings handling here)
            Semester createdSemester = semesterService.createSemester(semester);
            // Fetch the full data (including any DB defaults/triggers and empty offerings list) to return
            Semester responseSemester = semesterService.getSemesterById(createdSemester.getSemesterId());
            sendJsonResponse(response, new ApiResponse<>(true, "Semester created successfully", responseSemester));
        } catch (Exception e) { System.err.println("Error doPost: " + e.getMessage()); e.printStackTrace(); handleError(response, e); }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo(); if (pathInfo == null || pathInfo.equals("/")) { response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Semester ID required for update"); return; }
            String semesterId = pathInfo.substring(1);
            // --- Use Simplified Parsing ---
            Semester semester = parseSemesterFromRequestSimple(request);
            semester.setSemesterId(semesterId); // Ensure ID from URL is set
            // Use simplified service method (no offerings handling here)
            boolean updated = semesterService.updateSemester(semester);
            if (updated) {
                // Fetch updated data (incl. offerings) to return consistent response
                Semester updatedSemesterData = semesterService.getSemesterById(semesterId);
                sendJsonResponse(response, new ApiResponse<>(true, "Semester updated successfully", updatedSemesterData));
            } else { response.sendError(HttpServletResponse.SC_NOT_FOUND, "Semester not found or update failed for ID: " + semesterId); }
        } catch (Exception e) { System.err.println("Error doPut: " + e.getMessage()); e.printStackTrace(); handleError(response, e); }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // --- doDelete remains the same ---
        try { String pathInfo = request.getPathInfo(); if (pathInfo == null || pathInfo.equals("/")) { response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Semester ID required"); return; } String semesterId = pathInfo.substring(1); boolean deleted = semesterService.deleteSemester(semesterId); if (deleted) { sendJsonResponse(response, new ApiResponse<>(true, "Semester deleted successfully", null)); } else { response.sendError(HttpServletResponse.SC_NOT_FOUND, "Semester not found or deletion failed"); } }
        catch (Exception e) { System.err.println("Error doDelete: " + e.getMessage()); e.printStackTrace(); handleError(response, e); }
    }

    // --- Simplified Request Parser (Core Fields Only) ---
    private Semester parseSemesterFromRequestSimple(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        System.out.println("Received JSON for POST/PUT (Simplified): " + json);
        Map<String, String> semesterData = parseJsonToFlatMap(json); // Use the basic flat parser
        System.out.println("Parsed Flat Map: " + semesterData);

        String semesterId = semesterData.getOrDefault("semesterId", "");
        String batchId = semesterData.getOrDefault("batchId", "");
        int academicYear = parseInteger(semesterData.get("academicYear"), 0); // Use helper
        int semesterNum = parseInteger(semesterData.get("semesterNum"), 0);   // Use helper
        Date startDate = parseDate(semesterData.get("startDate"));           // Use helper
        Date endDate = parseDate(semesterData.get("endDate"));               // Use helper
        String status = semesterData.getOrDefault("status", "PLANNED");

        // Create Semester object WITHOUT setting offerings from request
        Semester semester = new Semester(semesterId, batchId, academicYear, semesterNum, startDate, endDate, status);
        System.out.println("Parsed Semester object: " + semester.toString());
        return semester;
    }

    // Helper to read request body
    private String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder(); try (BufferedReader reader = request.getReader()) { String line; while ((line = reader.readLine()) != null) { sb.append(line).append(System.lineSeparator()); } } return sb.toString();
    }

    // Original Simple Flat JSON Parser
    private Map<String, String> parseJsonToFlatMap(String json) {
        Map<String, String> map = new HashMap<>(); if (json == null || json.isEmpty()) return map; json = json.trim(); if (json.startsWith("{") && json.endsWith("}")) json = json.substring(1, json.length() - 1).trim();
        // Regex split by comma not inside quotes
        String[] pairs = json.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        for (String pair : pairs) {
            // Regex split on first colon not inside quotes
            String[] keyValue = pair.split(":(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", 2);
            if (keyValue.length == 2) {
                String key = keyValue[0].trim(); String value = keyValue[1].trim();
                // Remove quotes from keys/values
                if (key.startsWith("\"") && key.endsWith("\"")) key = key.substring(1, key.length() - 1);
                if (value.startsWith("\"") && value.endsWith("\"")) value = value.substring(1, value.length() - 1);
                else if (value.equalsIgnoreCase("null")) value = null; // Handle JSON null literal
                // Basic unescaping
                if (value != null) value = value.replace("\\\"", "\"").replace("\\\\", "\\");
                map.put(key, value);
            }
        } return map;
    }

    // Helper to safely parse Integer
    private Integer parseInteger(String str, Integer defaultValue) {
        if (str == null || str.trim().isEmpty()) return defaultValue;
        try { return Integer.parseInt(str.trim()); }
        catch (NumberFormatException e) { System.err.println("WARN: Could not parse integer from '" + str + "'"); return defaultValue; }
    }
    // Helper to safely parse Date
    private Date parseDate(String dateStr) {
        System.out.println("parseDate received string: [" + dateStr + "]"); // Log input
        if (dateStr == null || dateStr.trim().isEmpty()) { System.out.println("parseDate returning null: input empty/null."); return null; }
        try { Date parsedDate = Date.valueOf(dateStr.trim()); System.out.println("parseDate success: " + parsedDate); return parsedDate; } // Expects yyyy-MM-dd
        catch (IllegalArgumentException e) { System.err.println("WARN: Could not parse date from '" + dateStr + "'. Error: " + e.getMessage()); return null; }
    }

    // --- Helper to send JSON response ---
    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse) throws IOException {
        response.setContentType("application/json"); response.setCharacterEncoding("UTF-8"); response.getWriter().write(apiResponse.toJson());
    }
    // --- Helper to handle errors ---
    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        System.err.println("Error processing request: " + e.getClass().getName() + " - " + e.getMessage()); e.printStackTrace(); response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Server Error: " + e.getMessage(), null); sendJsonResponse(response, apiResponse);
    }
}