package com.adhyana.student;

import com.adhyana.student.models.*;
import com.adhyana.student.services.AttendanceService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AttendanceServlet extends HttpServlet {

    private final AttendanceService attendanceService = new AttendanceService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/attendance".length());

            if (subPath.startsWith("/session/")) {
                // Get attendance for a specific course session
                String[] parts = subPath.substring("/session/".length()).split("/");
                if (parts.length != 2) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
                    return;
                }
                String courseCode = parts[0];
                LocalDate date = LocalDate.parse(parts[1]);
                handleGetCourseSessionAttendance(response, courseCode, date);
            } else if (subPath.startsWith("/history/")) {
                // Get session history for a course
                String courseCode = subPath.substring("/history/".length());
                handleGetCourseSessionHistory(response, courseCode);
            } else if (subPath.startsWith("/summary/")) {
                // Get student's attendance summary
                int studentIndex = Integer.parseInt(subPath.substring("/summary/".length()));
                handleGetAttendanceSummary(response, studentIndex);
            } else if (subPath.startsWith("/detail/")) {
                // Get student's detailed attendance for a course
                String[] parts = subPath.substring("/detail/".length()).split("/");
                if (parts.length != 2) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
                    return;
                }
                int studentIndex = Integer.parseInt(parts[0]);
                String courseCode = parts[1];
                handleGetStudentCourseAttendance(response, studentIndex, courseCode);
            } else if (subPath.startsWith("/mark/")) {
                // Get list of students with their attendance status for a session
                String[] parts = subPath.substring("/mark/".length()).split("/");
                if (parts.length != 2) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
                    return;
                }
                String courseCode = parts[0];
                LocalDate date = LocalDate.parse(parts[1]);
                handleGetStudentAttendanceForSession(response, courseCode, date);
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
            String subPath = pathInfo.substring("/attendance".length());

            if (subPath.equals("/submit")) {
                // Submit attendance for a batch of students
                handleSubmitAttendance(request, response);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private void handleGetCourseSessionAttendance(HttpServletResponse response, String courseCode, LocalDate date)
            throws Exception {
        CourseSession session = attendanceService.getCourseSessionAttendance(courseCode, date);
        ApiResponse<CourseSession> apiResponse =
                new ApiResponse<>(true, "Course session attendance retrieved successfully", session);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetCourseSessionHistory(HttpServletResponse response, String courseCode) throws Exception {
        List<CourseSession> sessions = attendanceService.getCourseSessionHistory(courseCode);
        ApiResponse<List<CourseSession>> apiResponse =
                new ApiResponse<>(true, "Course session history retrieved successfully", sessions);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetAttendanceSummary(HttpServletResponse response, int studentIndex) throws Exception {
        List<AttendanceSummary> summary = attendanceService.getStudentAttendanceSummary(studentIndex);
        ApiResponse<List<AttendanceSummary>> apiResponse =
                new ApiResponse<>(true, "Attendance summary retrieved successfully", summary);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetStudentCourseAttendance(HttpServletResponse response, int studentIndex, String courseCode) throws Exception {
        List<Attendance> attendanceList = attendanceService.getStudentCourseAttendance(studentIndex, courseCode);
        ApiResponse<List<Attendance>> apiResponse =
                new ApiResponse<>(true, "Student course attendance retrieved successfully", attendanceList);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetStudentAttendanceForSession(HttpServletResponse response, String courseCode, LocalDate date) throws Exception {
        List<Attendance> attendanceList = attendanceService.getStudentAttendanceForSession(courseCode, date);
        ApiResponse<List<Attendance>> apiResponse =
                new ApiResponse<>(true, "Session attendance list retrieved successfully", attendanceList);
        sendJsonResponse(response, apiResponse);
    }

    private void handleSubmitAttendance(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // Parse the attendance data from the request
        AttendanceSubmissionData submissionData = parseAttendanceSubmission(request);
        String courseCode = submissionData.getCourseCode();
        LocalDate date = submissionData.getDate();
        Map<Integer, Boolean> studentAttendance = submissionData.getStudentAttendance();

        boolean success = attendanceService.recordBatchAttendance(courseCode, date, studentAttendance);

        if (success) {
            CourseSession session = attendanceService.getCourseSessionAttendance(courseCode, date);
            ApiResponse<CourseSession> apiResponse =
                    new ApiResponse<>(true, "Attendance submitted successfully", session);
            sendJsonResponse(response, apiResponse);
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse =
                    new ApiResponse<>(false, "Failed to submit attendance", null);
            sendJsonResponse(response, apiResponse);
        }
    }

    // Helper class for attendance submission data
    private static class AttendanceSubmissionData {
        private String courseCode;
        private LocalDate date;
        private Map<Integer, Boolean> studentAttendance;

        public AttendanceSubmissionData(String courseCode, LocalDate date,
                                        Map<Integer, Boolean> studentAttendance) {
            this.courseCode = courseCode;
            this.date = date;
            this.studentAttendance = studentAttendance;
        }

        public String getCourseCode() { return courseCode; }
        public LocalDate getDate() { return date; }
        public Map<Integer, Boolean> getStudentAttendance() { return studentAttendance; }
    }

    // Helper methods for request parsing
    private AttendanceSubmissionData parseAttendanceSubmission(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();

        // Extract course code
        String courseCode = extractJsonValue(json, "courseCode");

        // Extract date
        String dateStr = extractJsonValue(json, "date");
        LocalDate date = LocalDate.parse(dateStr);

        // Extract student attendance data
        Map<Integer, Boolean> studentAttendance = new HashMap<>();
        String studentsJsonPart = extractJsonSection(json, "students");

        if (!studentsJsonPart.equals("{}")) {
            // Parse each student entry
            String[] studentEntries = studentsJsonPart.split("\\},\\{");
            for (String entry : studentEntries) {
                entry = entry.replace("[{", "").replace("}]", "").replace("{", "").replace("}", "");

                String indexStr = extractJsonValue(entry, "index");
                String presentStr = extractJsonValue(entry, "present");

                if (!indexStr.isEmpty() && !presentStr.isEmpty()) {
                    int index = Integer.parseInt(indexStr);
                    boolean present = Boolean.parseBoolean(presentStr);
                    studentAttendance.put(index, present);
                }
            }
        }

        return new AttendanceSubmissionData(courseCode, date, studentAttendance);
    }

    // Helper methods for JSON parsing
    private String extractJsonSection(String json, String sectionName) {
        int start = json.indexOf("\"" + sectionName + "\":");
        if (start == -1) {
            return "{}";
        }

        start = json.indexOf("[", start);
        if (start == -1) {
            return "{}";
        }

        int end = start + 1;
        int bracketCount = 1;
        while (bracketCount > 0 && end < json.length()) {
            char c = json.charAt(end);
            if (c == '[') {
                bracketCount++;
            } else if (c == ']') {
                bracketCount--;
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