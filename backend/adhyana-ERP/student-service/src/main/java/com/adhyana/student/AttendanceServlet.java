package com.adhyana.student;

import com.adhyana.student.models.*;
import com.adhyana.student.services.*;
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

            handleAttendanceGet(request, response, subPath);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/attendance".length());

            if (subPath == null || subPath.equals("") || subPath.equals("/")) {
                // Create a new attendance record
                handleCreateAttendance(request, response);
            } else if (subPath.equals("/batch")) {
                // Create batch attendance records
                handleCreateBatchAttendance(request, response);
            } else if (subPath.equals("/session")) {
                // Create a new course session
                handleCreateCourseSession(request, response);
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
            String subPath = pathInfo.substring("/attendance".length());

            if (subPath.startsWith("/session/")) {
                // Update course session
                int id = Integer.parseInt(subPath.substring("/session/".length()));
                handleUpdateSessionAttendance(request, response, id);
            } else if (subPath.startsWith("/")) {
                // Update attendance record
                int id = Integer.parseInt(subPath.substring(1));
                handleUpdateAttendance(request, response, id);
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
            String subPath = pathInfo.substring("/attendance".length());

            if (subPath.startsWith("/session/")) {
                // Delete course session
                int id = Integer.parseInt(subPath.substring("/session/".length()));
                handleDeleteCourseSession(response, id);
            } else if (subPath.startsWith("/")) {
                // Delete attendance record
                int id = Integer.parseInt(subPath.substring(1));
                handleDeleteAttendance(response, id);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    // Attendance handlers
    private void handleAttendanceGet(HttpServletRequest request, HttpServletResponse response, String path)
            throws Exception {
        if (path == null || path.equals("/")) {
            // Get all attendance records
            List<Attendance> attendanceList = attendanceService.getAllAttendance();
            ApiResponse<List<Attendance>> apiResponse =
                    new ApiResponse<>(true, "Attendance records retrieved successfully", attendanceList);
            sendJsonResponse(response, apiResponse);
        } else if (path.startsWith("/student/")) {
            // Check if course code is specified
            String subPath = path.substring("/student/".length());
            if (subPath.contains("/course/")) {
                // Get student's attendance for specific course
                String[] parts = subPath.split("/course/");
                int studentId = Integer.parseInt(parts[0]);
                String courseCode = parts[1];

                List<Attendance> attendanceList = attendanceService.getStudentCourseAttendance(studentId, courseCode);
                ApiResponse<List<Attendance>> apiResponse =
                        new ApiResponse<>(true, "Student course attendance retrieved successfully", attendanceList);
                sendJsonResponse(response, apiResponse);
            } else {
                // Get all student's attendance records
                int studentId = Integer.parseInt(subPath);
                List<Attendance> attendanceList = attendanceService.getStudentAttendance(studentId);
                ApiResponse<List<Attendance>> apiResponse =
                        new ApiResponse<>(true, "Student attendance retrieved successfully", attendanceList);
                sendJsonResponse(response, apiResponse);
            }
        } else if (path.startsWith("/session/")) {
            // Get course session by ID
            int sessionId = Integer.parseInt(path.substring("/session/".length()));
            CourseSession session = attendanceService.getCourseSessionById(sessionId);

            if (session != null) {
                ApiResponse<CourseSession> apiResponse =
                        new ApiResponse<>(true, "Course session retrieved successfully", session);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Course session not found");
            }
        } else if (path.startsWith("/course/")) {
            // Get attendance for course or course sessions
            String coursePath = path.substring("/course/".length());
            if (coursePath.contains("?date=")) {
                // Extract course code and date
                String[] parts = coursePath.split("\\?date=");
                String courseCode = parts[0];
                LocalDate date = LocalDate.parse(parts[1]);

                // Get attendance sheet for specific date
                List<Map<String, Object>> attendanceList = attendanceService.getCourseSessionAttendance(courseCode, date);
                ApiResponse<List<Map<String, Object>>> apiResponse =
                        new ApiResponse<>(true, "Course attendance sheet retrieved successfully", attendanceList);
                sendJsonResponse(response, apiResponse);
            } else {
                // Get all course sessions
                String courseCode = coursePath;
                List<CourseSession> sessions = attendanceService.getCourseSessionsByCourse(courseCode);
                ApiResponse<List<CourseSession>> apiResponse =
                        new ApiResponse<>(true, "Course sessions retrieved successfully", sessions);
                sendJsonResponse(response, apiResponse);
            }
        } else if (path.startsWith("/summary/")) {
            // Get attendance summary for student
            int studentId = Integer.parseInt(path.substring("/summary/".length()));
            List<AttendanceSummary> summaries = attendanceService.getStudentAttendanceSummary(studentId);

            ApiResponse<List<AttendanceSummary>> apiResponse =
                    new ApiResponse<>(true, "Attendance summary retrieved successfully", summaries);
            sendJsonResponse(response, apiResponse);
        } else {
            // Get specific attendance by ID
            int id = Integer.parseInt(path.substring(1));
            Attendance attendance = attendanceService.getAttendance(id);
            if (attendance != null) {
                ApiResponse<Attendance> apiResponse =
                        new ApiResponse<>(true, "Attendance record retrieved successfully", attendance);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Attendance record not found");
            }
        }
    }

    private void handleCreateAttendance(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Attendance attendance = parseAttendanceFromRequest(request);
        Attendance newAttendance = attendanceService.recordAttendance(attendance);
        ApiResponse<Attendance> apiResponse =
                new ApiResponse<>(true, "Attendance record created successfully", newAttendance);
        sendJsonResponse(response, apiResponse);
    }

    private void handleCreateBatchAttendance(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> batchData = parseBatchAttendanceFromRequest(request);

        String courseCode = (String) batchData.get("courseCode");
        LocalDate date = (LocalDate) batchData.get("date");
        @SuppressWarnings("unchecked")
        Map<Integer, Boolean> studentAttendance = (Map<Integer, Boolean>) batchData.get("studentAttendance");
        @SuppressWarnings("unchecked")
        Map<Integer, String> remarks = (Map<Integer, String>) batchData.get("remarks");

        boolean success = attendanceService.recordBatchAttendance(courseCode, date, studentAttendance, remarks);

        if (success) {
            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Batch attendance recorded successfully", null);
            sendJsonResponse(response, apiResponse);
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Failed to record batch attendance", null);
            sendJsonResponse(response, apiResponse);
        }
    }

    private void handleCreateCourseSession(HttpServletRequest request, HttpServletResponse response) throws Exception {
        CourseSession session = parseCourseSessionFromRequest(request);
        CourseSession newSession = attendanceService.createCourseSession(session);
        ApiResponse<CourseSession> apiResponse =
                new ApiResponse<>(true, "Course session created successfully", newSession);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateAttendance(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Attendance attendance = parseAttendanceFromRequest(request);
        attendanceService.updateAttendance(id, attendance);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Attendance record updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateSessionAttendance(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Map<String, Integer> counts = parseSessionAttendanceCountsFromRequest(request);
        attendanceService.updateSessionAttendance(id, counts.get("totalStudents"), counts.get("presentStudents"));
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Session attendance updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteAttendance(HttpServletResponse response, int id) throws Exception {
        attendanceService.deleteAttendance(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Attendance record deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteCourseSession(HttpServletResponse response, int id) throws Exception {
        attendanceService.deleteCourseSession(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Course session deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Parse methods for attendance
    private Attendance parseAttendanceFromRequest(HttpServletRequest request) throws IOException {
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
        String courseCode = null;
        LocalDate date = null;
        boolean present = false;
        String remarks = "";

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "studentId":
                        studentId = Integer.parseInt(value);
                        break;
                    case "courseCode":
                        courseCode = value;
                        break;
                    case "date":
                        date = LocalDate.parse(value);
                        break;
                    case "present":
                        present = Boolean.parseBoolean(value);
                        break;
                    case "remarks":
                        remarks = value;
                        break;
                }
            }
        }

        return new Attendance(0, studentId, courseCode, date, present, remarks);
    }

    private CourseSession parseCourseSessionFromRequest(HttpServletRequest request) throws IOException {
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
        String courseCode = null;
        String courseName = null;
        LocalDate date = null;
        int totalStudents = 0;
        int presentStudents = 0;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "courseCode":
                        courseCode = value;
                        break;
                    case "courseName":
                        courseName = value;
                        break;
                    case "date":
                        date = LocalDate.parse(value);
                        break;
                    case "totalStudents":
                        try {
                            totalStudents = Integer.parseInt(value);
                        } catch (NumberFormatException e) {
                            totalStudents = 0;
                        }
                        break;
                    case "presentStudents":
                        try {
                            presentStudents = Integer.parseInt(value);
                        } catch (NumberFormatException e) {
                            presentStudents = 0;
                        }
                        break;
                }
            }
        }

        return new CourseSession(0, courseCode, courseName, date, totalStudents, presentStudents);
    }

    private Map<String, Object> parseBatchAttendanceFromRequest(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String json = sb.toString();
        Map<String, Object> result = new HashMap<>();
        String courseCode = null;
        LocalDate date = null;
        Map<Integer, Boolean> studentAttendance = new HashMap<>();
        Map<Integer, String> remarks = new HashMap<>();

        // Extract course code and date
        if (json.contains("courseCode")) {
            courseCode = json.split("\"courseCode\":\"")[1].split("\"")[0];
        }
        if (json.contains("date")) {
            String dateStr = json.split("\"date\":\"")[1].split("\"")[0];
            date = LocalDate.parse(dateStr);
        }

        // Extract student attendance data
        if (json.contains("students")) {
            String studentsJsonPart = json.split("\"students\":")[1].trim();
            if (studentsJsonPart.startsWith("[")) {
                studentsJsonPart = studentsJsonPart.substring(1, studentsJsonPart.indexOf("]"));
                String[] studentEntries = studentsJsonPart.split("\\},\\{");

                for (String entry : studentEntries) {
                    entry = entry.replace("{", "").replace("}", "").replace("\"", "");
                    int studentId = 0;
                    boolean present = false;
                    String remark = "";

                    String[] fields = entry.split(",");
                    for (String field : fields) {
                        String[] keyValue = field.split(":");
                        if (keyValue.length == 2) {
                            String key = keyValue[0].trim();
                            String value = keyValue[1].trim();

                            switch (key) {
                                case "studentId":
                                    studentId = Integer.parseInt(value);
                                    break;
                                case "present":
                                    present = Boolean.parseBoolean(value);
                                    break;
                                case "remarks":
                                    remark = value;
                                    break;
                            }
                        }
                    }

                    if (studentId > 0) {
                        studentAttendance.put(studentId, present);
                        remarks.put(studentId, remark);
                    }
                }
            }
        }

        result.put("courseCode", courseCode);
        result.put("date", date);
        result.put("studentAttendance", studentAttendance);
        result.put("remarks", remarks);

        return result;
    }

    private Map<String, Integer> parseSessionAttendanceCountsFromRequest(HttpServletRequest request) throws IOException {
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
        Map<String, Integer> counts = new HashMap<>();
        counts.put("totalStudents", 0);
        counts.put("presentStudents", 0);

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "totalStudents":
                        counts.put("totalStudents", Integer.parseInt(value));
                        break;
                    case "presentStudents":
                        counts.put("presentStudents", Integer.parseInt(value));
                        break;
                }
            }
        }

        return counts;
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