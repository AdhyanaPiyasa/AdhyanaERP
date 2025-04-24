//package com.adhyana.student;
//
//import com.adhyana.student.models.*;
//import com.adhyana.student.services.*;
//import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.io.BufferedReader;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.math.BigDecimal;
//import java.text.DecimalFormat;
//
//
//@WebServlet("/api/students/*")
//public class StudentServlet extends HttpServlet {
//    // Initialize all services
//    private final StudentService studentService = new StudentService();
//    private final AttendanceService attendanceService = new AttendanceService();
//    private final ScholarshipService scholarshipService = new ScholarshipService();
//
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        try {
//            String pathInfo = request.getPathInfo();
//
//            // Path-based routing
//            if (pathInfo == null || pathInfo.equals("/")) {
//                // Get all students
//                handleGetAllStudents(response);
//            }  else if (pathInfo.startsWith("/degree/")) {
//                // Get students by degree ID
//                String degreeID = pathInfo.substring("/degree/".length());
//                handleGetStudentsByDegree(response, degreeID);
//            } else if (pathInfo.startsWith("/attendance")) {
//                // Handle attendance-related GET requests
//                handleAttendanceGet(request, response, pathInfo.substring("/attendance".length()));
//            }  else if (pathInfo.startsWith("/scholarships")) {
//                // Handle scholarship-related GET requests
//                handleScholarshipsGet(request, response, pathInfo.substring("/scholarships".length()));
//            } else if (pathInfo.startsWith("/applications")) {
//                // Handle scholarship application-related GET requests
//                handleApplicationsGet(request, response, pathInfo.substring("/applications".length()));
//            } else {
//                try {
//                    // Assume it's a student ID
//                    int id = Integer.parseInt(pathInfo.substring(1));
//                    handleGetStudent(response, id);
//                } catch (NumberFormatException e) {
//                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
//                }
//            }
//        } catch (Exception e) {
//            handleError(response, e);
//        }
//    }
//
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        try {
//            String pathInfo = request.getPathInfo();
//
//            if (pathInfo == null || pathInfo.equals("/")) {
//                // Create a new student
//                handleCreateStudent(request, response);
//            } else if (pathInfo.equals("/attendance")) {
//                // Create a new attendance record
//                handleCreateAttendance(request, response);
//            } else if (pathInfo.equals("/attendance/batch")) {
//                // Create batch attendance records
//                handleCreateBatchAttendance(request, response);
//            } else if (pathInfo.equals("/attendance/session")) {
//                // Create a new course session
//                handleCreateCourseSession(request, response);
//            }  else if (pathInfo.equals("/scholarships")) {
//                // Create a new scholarship
//                handleCreateScholarship(request, response);
//            } else if (pathInfo.equals("/applications")) {
//                // Submit a new scholarship application
//                handleCreateApplication(request, response);
//            } else if (pathInfo.startsWith("/scholarships/process/")) {
//                // Process applications for a specific scholarship
//                int scholarshipId = Integer.parseInt(pathInfo.substring("/scholarships/process/".length()));
//                handleProcessApplications(response, scholarshipId);
//            } else if (pathInfo.startsWith("/applications/status/")) {
//                // Update application status
//                int applicationId = Integer.parseInt(pathInfo.substring("/applications/status/".length()));
//                handleUpdateApplicationStatus(request, response, applicationId);
//            } else {
//                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path");
//            }
//        } catch (Exception e) {
//            handleError(response, e);
//        }
//    }
//
//    @Override
//    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        try {
//            String pathInfo = request.getPathInfo();
//
//            if (pathInfo == null) {
//                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID required");
//                return;
//            }
//
//            if (pathInfo.startsWith("/attendance/session/")) {
//                // Update course session
//                int id = Integer.parseInt(pathInfo.substring("/attendance/session/".length()));
//                handleUpdateSessionAttendance(request, response, id);
//            } else if (pathInfo.startsWith("/attendance/")) {
//                // Update attendance record
//                int id = Integer.parseInt(pathInfo.substring("/attendance/".length()));
//                handleUpdateAttendance(request, response, id);
//            }else if (pathInfo.startsWith("/scholarships/")) {
//                // Update scholarship
//                int id = Integer.parseInt(pathInfo.substring("/scholarships/".length()));
//                handleUpdateScholarship(request, response, id);
//            } else {
//                try {
//                    // Assume it's a student ID
//                    int id = Integer.parseInt(pathInfo.substring(1));
//                    handleUpdateStudent(request, response, id);
//                } catch (NumberFormatException e) {
//                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
//                }
//            }
//        } catch (Exception e) {
//            handleError(response, e);
//        }
//    }
//
//    @Override
//    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        try {
//            String pathInfo = request.getPathInfo();
//
//            if (pathInfo == null) {
//                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID required");
//                return;
//            }
//
//            // Check for the longer path first
//            if (pathInfo.startsWith("/attendance/session/")) {
//                // Delete course session
//                int id = Integer.parseInt(pathInfo.substring("/attendance/session/".length()));
//                handleDeleteCourseSession(response, id);
//            } else if (pathInfo.startsWith("/attendance/")) {
//                // Delete attendance record
//                int id = Integer.parseInt(pathInfo.substring("/attendance/".length()));
//                handleDeleteAttendance(response, id);
//            }  else if (pathInfo.startsWith("/scholarships/")) {
//                // Delete scholarship
//                int id = Integer.parseInt(pathInfo.substring("/scholarships/".length()));
//                handleDeleteScholarship(response, id);
//            } else {
//                try {
//                    // Assume it's a student ID
//                    int id = Integer.parseInt(pathInfo.substring(1));
//                    handleDeleteStudent(response, id);
//                } catch (NumberFormatException e) {
//                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
//                }
//            }
//        } catch (Exception e) {
//            handleError(response, e);
//        }
//    }
//
//    // *Student Handlers *
//
//    /**
//     * Handles retrieving all students
//     *
//     * This method retrieves all students from the database and sends
//     * a JSON response containing the list of students
//     *
//     * - Used by the student listing page (Image 1)
//     */
//    private void handleGetAllStudents(HttpServletResponse response) throws Exception {
//        ApiResponse<List<Student>> apiResponse =
//                new ApiResponse<>(true, "Students retrieved successfully", studentService.getAllStudents());
//        sendJsonResponse(response, apiResponse);
//    }
//
//    /**
//     * Handles retrieving a single student by ID
//     *
//     * This method retrieves a student by ID and sends a JSON response
//     * containing the student data
//     *
//     * - Used by the student view modal (Image 6)
//     */
//    private void handleGetStudent(HttpServletResponse response, int id) throws Exception {
//        Student student = studentService.getStudent(id);
//        if (student != null) {
//            ApiResponse<Student> apiResponse =
//                    new ApiResponse<>(true, "Student retrieved successfully", student);
//            sendJsonResponse(response, apiResponse);
//        } else {
//            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
//        }
//    }
//
//    /**
//     * Handles retrieving students filtered by degree ID
//     *
//     * This method retrieves all students with a specific degree
//     * and sends a JSON response containing the filtered list
//     */
//    private void handleGetStudentsByDegree(HttpServletResponse response, String degreeID) throws Exception {
//        List<Student> students = studentService.getStudentsByDegreeID(degreeID);
//        ApiResponse<List<Student>> apiResponse =
//                new ApiResponse<>(true, "Students retrieved successfully", students);
//        sendJsonResponse(response, apiResponse);
//    }
//
//
//    /**
//     * Handles creating a new student
//     *
//     * This method parses the request body to extract student data,
//     * creates a new student in the database, and sends a JSON response
//     * with the newly created student
//     *
//     * - Used by the Add New Student modal (Images 2-3)
//     */
//    private void handleCreateStudent(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        Student student = parseStudentFromRequest(request);
//        Student newStudent = studentService.createStudent(student);
//        ApiResponse<Student> apiResponse =
//                new ApiResponse<>(true, "Student created successfully", newStudent);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    /**
//     * Handles updating a student
//     *
//     * This method parses the request body to extract updated student data,
//     * updates the student in the database, and sends a success response
//     *
//     * - Used by the Edit Student modal (Image 4)
//     */
//    private void handleUpdateStudent(HttpServletRequest request, HttpServletResponse response, int id) throws Exception {
//        Student student = parseStudentFromRequest(request);
//        studentService.updateStudent(id, student);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Student updated successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    /**
//     * Handles deleting a student
//     *
//     * This method deletes a student from the database and sends
//     * a success response
//     *
//     * - Used by the delete confirmation modal (Image 5)
//     */
//    private void handleDeleteStudent(HttpServletResponse response, int id) throws Exception {
//        studentService.deleteStudent(id);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Student deleted successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    // *Attendance Handlers *
//
//    private void handleAttendanceGet(HttpServletRequest request, HttpServletResponse response, String path)
//            throws Exception {
//        if (path == null || path.equals("/")) {
//            // Get all attendance records
//            List<Attendance> attendanceList = attendanceService.getAllAttendance();
//            ApiResponse<List<Attendance>> apiResponse =
//                    new ApiResponse<>(true, "Attendance records retrieved successfully", attendanceList);
//            sendJsonResponse(response, apiResponse);
//        } else if (path.startsWith("/student/")) {
//            // Check if course code is specified
//            String subPath = path.substring("/student/".length());
//            if (subPath.contains("/course/")) {
//                // Get student's attendance for specific course
//                String[] parts = subPath.split("/course/");
//                int studentId = Integer.parseInt(parts[0]);
//                String courseCode = parts[1];
//
//                List<Attendance> attendanceList = attendanceService.getStudentCourseAttendance(studentId, courseCode);
//                ApiResponse<List<Attendance>> apiResponse =
//                        new ApiResponse<>(true, "Student course attendance retrieved successfully", attendanceList);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                // Get all student's attendance records
//                int studentId = Integer.parseInt(subPath);
//                List<Attendance> attendanceList = attendanceService.getStudentAttendance(studentId);
//                ApiResponse<List<Attendance>> apiResponse =
//                        new ApiResponse<>(true, "Student attendance retrieved successfully", attendanceList);
//                sendJsonResponse(response, apiResponse);
//            }
//        } else if (path.startsWith("/session/")) {
//            // Get course session by ID
//            int sessionId = Integer.parseInt(path.substring("/session/".length()));
//            CourseSession session = attendanceService.getCourseSessionById(sessionId);
//
//            if (session != null) {
//                ApiResponse<CourseSession> apiResponse =
//                        new ApiResponse<>(true, "Course session retrieved successfully", session);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Course session not found");
//            }
//        } else if (path.startsWith("/course/")) {
//            // Get attendance for course or course sessions
//            String coursePath = path.substring("/course/".length());
//            if (coursePath.contains("?date=")) {
//                // Extract course code and date
//                String[] parts = coursePath.split("\\?date=");
//                String courseCode = parts[0];
//                LocalDate date = LocalDate.parse(parts[1]);
//
//                // Get attendance sheet for specific date
//                List<Map<String, Object>> attendanceList = attendanceService.getCourseSessionAttendance(courseCode, date);
//                ApiResponse<List<Map<String, Object>>> apiResponse =
//                        new ApiResponse<>(true, "Course attendance sheet retrieved successfully", attendanceList);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                // Get all course sessions
//                String courseCode = coursePath;
//                List<CourseSession> sessions = attendanceService.getCourseSessionsByCourse(courseCode);
//                ApiResponse<List<CourseSession>> apiResponse =
//                        new ApiResponse<>(true, "Course sessions retrieved successfully", sessions);
//                sendJsonResponse(response, apiResponse);
//            }
//        } else if (path.startsWith("/summary/")) {
//            // Get attendance summary for student
//            int studentId = Integer.parseInt(path.substring("/summary/".length()));
//            List<AttendanceSummary> summaries = attendanceService.getStudentAttendanceSummary(studentId);
//
//            ApiResponse<List<AttendanceSummary>> apiResponse =
//                    new ApiResponse<>(true, "Attendance summary retrieved successfully", summaries);
//            sendJsonResponse(response, apiResponse);
//        } else {
//            // Get specific attendance by ID
//            int id = Integer.parseInt(path.substring(1));
//            Attendance attendance = attendanceService.getAttendance(id);
//            if (attendance != null) {
//                ApiResponse<Attendance> apiResponse =
//                        new ApiResponse<>(true, "Attendance record retrieved successfully", attendance);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Attendance record not found");
//            }
//        }
//    }
//
//    private void handleCreateAttendance(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        Attendance attendance = parseAttendanceFromRequest(request);
//        Attendance newAttendance = attendanceService.recordAttendance(attendance);
//        ApiResponse<Attendance> apiResponse =
//                new ApiResponse<>(true, "Attendance record created successfully", newAttendance);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleCreateBatchAttendance(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        Map<String, Object> batchData = parseBatchAttendanceFromRequest(request);
//
//        String courseCode = (String) batchData.get("courseCode");
//        LocalDate date = (LocalDate) batchData.get("date");
//        @SuppressWarnings("unchecked")
//        Map<Integer, Boolean> studentAttendance = (Map<Integer, Boolean>) batchData.get("studentAttendance");
//        @SuppressWarnings("unchecked")
//        Map<Integer, String> remarks = (Map<Integer, String>) batchData.get("remarks");
//
//        boolean success = attendanceService.recordBatchAttendance(courseCode, date, studentAttendance, remarks);
//
//        if (success) {
//            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Batch attendance recorded successfully", null);
//            sendJsonResponse(response, apiResponse);
//        } else {
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Failed to record batch attendance", null);
//            sendJsonResponse(response, apiResponse);
//        }
//    }
//
//    private void handleCreateCourseSession(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        CourseSession session = parseCourseSessionFromRequest(request);
//        CourseSession newSession = attendanceService.createCourseSession(session);
//        ApiResponse<CourseSession> apiResponse =
//                new ApiResponse<>(true, "Course session created successfully", newSession);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleUpdateAttendance(HttpServletRequest request, HttpServletResponse response, int id)
//            throws Exception {
//        Attendance attendance = parseAttendanceFromRequest(request);
//        attendanceService.updateAttendance(id, attendance);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Attendance record updated successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleUpdateSessionAttendance(HttpServletRequest request, HttpServletResponse response, int id)
//            throws Exception {
//        Map<String, Integer> counts = parseSessionAttendanceCountsFromRequest(request);
//        attendanceService.updateSessionAttendance(id, counts.get("totalStudents"), counts.get("presentStudents"));
//        ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Session attendance updated successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleDeleteAttendance(HttpServletResponse response, int id) throws Exception {
//        attendanceService.deleteAttendance(id);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Attendance record deleted successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleDeleteCourseSession(HttpServletResponse response, int id) throws Exception {
//        attendanceService.deleteCourseSession(id);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Course session deleted successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//
//    // * Scholarship Handlers *
//    private void handleScholarshipsGet(HttpServletRequest request, HttpServletResponse response, String path)
//            throws Exception {
//        if (path == null || path.equals("/")) {
//            // Get all scholarships
//            List<Scholarship> scholarships = scholarshipService.getAllScholarships();
//            ApiResponse<List<Scholarship>> apiResponse =
//                    new ApiResponse<>(true, "Scholarships retrieved successfully", scholarships);
//            sendJsonResponse(response, apiResponse);
//        } else {
//            // Get specific scholarship by ID
//            int id = Integer.parseInt(path.substring(1));
//            Scholarship scholarship = scholarshipService.getScholarship(id);
//            if (scholarship != null) {
//                ApiResponse<Scholarship> apiResponse =
//                        new ApiResponse<>(true, "Scholarship retrieved successfully", scholarship);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Scholarship not found");
//            }
//        }
//    }
//
//    private void handleCreateScholarship(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        Scholarship scholarship = parseScholarshipFromRequest(request);
//        Scholarship newScholarship = scholarshipService.createScholarship(scholarship);
//        ApiResponse<Scholarship> apiResponse =
//                new ApiResponse<>(true, "Scholarship created successfully", newScholarship);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleUpdateScholarship(HttpServletRequest request, HttpServletResponse response, int id)
//            throws Exception {
//        Scholarship scholarship = parseScholarshipFromRequest(request);
//        scholarshipService.updateScholarship(id, scholarship);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Scholarship updated successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleDeleteScholarship(HttpServletResponse response, int id) throws Exception {
//        scholarshipService.deleteScholarship(id);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Scholarship deleted successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    // * Scholarship Application Handlers *
//    private void handleApplicationsGet(HttpServletRequest request, HttpServletResponse response, String path)
//            throws Exception {
//        if (path == null || path.equals("/")) {
//            // Get all applications
//            List<ScholarshipApplication> applications = scholarshipService.getAllApplications();
//            ApiResponse<List<ScholarshipApplication>> apiResponse =
//                    new ApiResponse<>(true, "Applications retrieved successfully", applications);
//            sendJsonResponse(response, apiResponse);
//        } else if (path.startsWith("/student/")) {
//            // Get application by student ID
//            int studentId = Integer.parseInt(path.substring("/student/".length()));
//            ScholarshipApplication application = scholarshipService.getApplicationByStudentId(studentId);
//            if (application != null) {
//                ApiResponse<ScholarshipApplication> apiResponse =
//                        new ApiResponse<>(true, "Application retrieved successfully", application);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                response.sendError(HttpServletResponse.SC_NOT_FOUND, "No application found for this student");
//            }
//        } else {
//            // Get specific application by ID
//            int id = Integer.parseInt(path.substring(1));
//            ScholarshipApplication application = scholarshipService.getApplication(id);
//            if (application != null) {
//                ApiResponse<ScholarshipApplication> apiResponse =
//                        new ApiResponse<>(true, "Application retrieved successfully", application);
//                sendJsonResponse(response, apiResponse);
//            } else {
//                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Application not found");
//            }
//        }
//    }
//
//    private void handleCreateApplication(HttpServletRequest request, HttpServletResponse response) throws Exception {
//        ScholarshipApplication application = parseApplicationFromRequest(request);
//        ScholarshipApplication newApplication = scholarshipService.applyForScholarship(application);
//        ApiResponse<ScholarshipApplication> apiResponse =
//                new ApiResponse<>(true, "Application submitted successfully", newApplication);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleUpdateApplicationStatus(HttpServletRequest request, HttpServletResponse response, int id)
//            throws Exception {
//        // Parse status update from request
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        String status = null;
//        String comments = null;
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                if ("status".equals(key)) {
//                    status = value;
//                } else if ("comments".equals(key)) {
//                    comments = value;
//                }
//            }
//        }
//        scholarshipService.updateApplicationStatus(id, status, comments);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, "Application status updated successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    private void handleProcessApplications(HttpServletResponse response, int scholarshipId) throws Exception {
//        int approvedCount = scholarshipService.processScholarshipApplications(scholarshipId);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(true, approvedCount + " applications approved successfully", null);
//        sendJsonResponse(response, apiResponse);
//    }
//
//    // * Parsing Methods *
//
//    /**
//     * Parses student data from HTTP request
//     *
//     * This method extracts student information from the request body
//     * and creates a Student object.
//     *
//     * - Modified to handle all student fields required by the Add Student UI (Images 2-3)
//     * - Ensures all required fields are properly parsed
//     */
//    private Student parseStudentFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        String name = null;
//        String email = null;
//        String degreeID = null;
//        String degreeProgram = null;
//        String indexNumber = null;
//        String registrationNumber = null;
//        String mobileNumber = null;
//        LocalDate birthDate = null;
//        String state = null;
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                switch (key) {
//                    case "name":
//                        name = value;
//                        break;
//                    case "email":
//                        email = value;
//                        break;
//                    case "degreeID":
//                        degreeID = value;
//                    case "degreeProgram":
//                        degreeProgram = value;
//                        break;
//                    case "indexNumber":
//                        indexNumber = value;
//                        break;
//                    case "registrationNumber":
//                        registrationNumber = value;
//                        break;
//                    case "mobileNumber":
//                        mobileNumber = value;
//                        break;
//                    case "birthDate":
//                        birthDate = LocalDate.parse(value);
//                        break;
//                    case "state":
//                        state = value;
//                        break;
//                }
//            }
//        }
//
//        return new Student(0, name, email, degreeID,degreeProgram, indexNumber,
//                registrationNumber, mobileNumber, birthDate, state);
//    }
//
//    // Attendance
//    private Attendance parseAttendanceFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        int studentId = 0;
//        String courseCode = null;
//        LocalDate date = null;
//        boolean present = false;
//        String remarks = "";
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                switch (key) {
//                    case "studentId":
//                        studentId = Integer.parseInt(value);
//                        break;
//                    case "courseCode":
//                        courseCode = value;
//                        break;
//                    case "date":
//                        date = LocalDate.parse(value);
//                        break;
//                    case "present":
//                        present = Boolean.parseBoolean(value);
//                        break;
//                    case "remarks":
//                        remarks = value;
//                        break;
//                }
//            }
//        }
//
//        return new Attendance(0, studentId, courseCode, date, present, remarks);
//    }
//
//    // Course Session
//    private CourseSession parseCourseSessionFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        System.out.println("Received JSON: " + json);
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        String courseCode = null;
//        String courseName = null;
//        LocalDate date = null;
//        int totalStudents = 0;
//        int presentStudents = 0;
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                System.out.println("Parsing key: " + key + ", value: " + value); // Debug line
//
//
//                switch (key) {
//                    case "courseCode":
//                        courseCode = value;
//                        break;
//                    case "courseName":
//                        courseName = value;
//                        break;
//                    case "date":
//                        date = LocalDate.parse(value);
//                        break;
//                    case "totalStudents":
//                        try {
//                            totalStudents = Integer.parseInt(value);
//                        } catch (NumberFormatException e) {
//                            System.err.println("Error parsing totalStudents: " + e.getMessage());
//                            totalStudents = 0;
//                        }
//                        break;
//                    case "presentStudents":
//                        try {
//                            presentStudents = Integer.parseInt(value);
//                        } catch (NumberFormatException e) {
//                            System.err.println("Error parsing presentStudents: " + e.getMessage());
//                            presentStudents = 0;
//                        }
//                        break;
//                }
//            }
//        }
//
//        // Debug output before creating object
//        System.out.println("Final values before creating CourseSession:");
//        System.out.println("courseCode: " + courseCode);
//        System.out.println("courseName: " + courseName);
//        System.out.println("date: " + date);
//        System.out.println("totalStudents: " + totalStudents);
//        System.out.println("presentStudents: " + presentStudents);
//
//
//
//        return new CourseSession(0, courseCode, courseName, date, totalStudents, presentStudents);
//    }
//
//    // Batch Attendance
//    private Map<String, Object> parseBatchAttendanceFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        Map<String, Object> result = new HashMap<>();
//        String courseCode = null;
//        LocalDate date = null;
//        Map<Integer, Boolean> studentAttendance = new HashMap<>();
//        Map<Integer, String> remarks = new HashMap<>();
//
//        // Extract course code and date
//        if (json.contains("courseCode")) {
//            courseCode = json.split("\"courseCode\":\"")[1].split("\"")[0];
//        }
//        if (json.contains("date")) {
//            String dateStr = json.split("\"date\":\"")[1].split("\"")[0];
//            date = LocalDate.parse(dateStr);
//        }
//
//        // Extract student attendance data
//        if (json.contains("students")) {
//            String studentsJsonPart = json.split("\"students\":")[1].trim();
//            if (studentsJsonPart.startsWith("[")) {
//                studentsJsonPart = studentsJsonPart.substring(1, studentsJsonPart.indexOf("]"));
//                String[] studentEntries = studentsJsonPart.split("\\},\\{");
//
//                for (String entry : studentEntries) {
//                    entry = entry.replace("{", "").replace("}", "").replace("\"", "");
//                    int studentId = 0;
//                    boolean present = false;
//                    String remark = "";
//
//                    String[] fields = entry.split(",");
//                    for (String field : fields) {
//                        String[] keyValue = field.split(":");
//                        if (keyValue.length == 2) {
//                            String key = keyValue[0].trim();
//                            String value = keyValue[1].trim();
//
//                            switch (key) {
//                                case "studentId":
//                                    studentId = Integer.parseInt(value);
//                                    break;
//                                case "present":
//                                    present = Boolean.parseBoolean(value);
//                                    break;
//                                case "remarks":
//                                    remark = value;
//                                    break;
//                            }
//                        }
//                    }
//
//                    if (studentId > 0) {
//                        studentAttendance.put(studentId, present);
//                        remarks.put(studentId, remark);
//                    }
//                }
//            }
//        }
//
//        result.put("courseCode", courseCode);
//        result.put("date", date);
//        result.put("studentAttendance", studentAttendance);
//        result.put("remarks", remarks);
//
//        return result;
//    }
//
//    // Session Attendance Counts
//    private Map<String, Integer> parseSessionAttendanceCountsFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        Map<String, Integer> counts = new HashMap<>();
//        counts.put("totalStudents", 0);
//        counts.put("presentStudents", 0);
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                switch (key) {
//                    case "totalStudents":
//                        counts.put("totalStudents", Integer.parseInt(value));
//                        break;
//                    case "presentStudents":
//                        counts.put("presentStudents", Integer.parseInt(value));
//                        break;
//                }
//            }
//        }
//
//        return counts;
//    }
//
//
//    //scholarships
//    private Scholarship parseScholarshipFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        String name = null;
//        String description = null;
//        double minGpa = 0.0;
//        BigDecimal amount = null;
//        LocalDate applicationDeadline = null;
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                switch (key) {
//                    case "name":
//                        name = value;
//                        break;
//                    case "description":
//                        description = value;
//                        break;
//                    case "minGpa":
//                        minGpa = Double.parseDouble(value);
//                        break;
//                    case "amount":
//                        amount = new BigDecimal(value);
//                        break;
//                    case "applicationDeadline":
//                        applicationDeadline = LocalDate.parse(value);
//                        break;
//                }
//            }
//        }
//
//        return new Scholarship(0, name, description, minGpa, amount, applicationDeadline);
//    }
//
//    // scholarship applications
//    private ScholarshipApplication parseApplicationFromRequest(HttpServletRequest request) throws IOException {
//        StringBuilder sb = new StringBuilder();
//        try (BufferedReader reader = request.getReader()) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//
//        String json = sb.toString();
//        json = json.replaceAll("[{}\"]", "");
//        String[] pairs = json.split(",");
//        int studentId = 0;
//        int scholarshipId = 0;
//        String studentBatch = null;
//        String studentDegree = null;
//        double studentGpa = 0.0;
//
//        for (String pair : pairs) {
//            String[] keyValue = pair.split(":");
//            if (keyValue.length == 2) {
//                String key = keyValue[0].trim();
//                String value = keyValue[1].trim();
//
//                switch (key) {
//                    case "studentId":
//                        studentId = Integer.parseInt(value);
//                        break;
//                    case "scholarshipId":
//                        scholarshipId = Integer.parseInt(value);
//                        break;
//                    case "studentBatch":
//                        studentBatch = value;
//                        break;
//                    case "studentDegree":
//                        studentDegree = value;
//                        break;
//                    case "studentGpa":
//                        studentGpa = Double.parseDouble(value);
//                        break;
//                }
//            }
//        }
//
//        // Default status for new applications is "Pending"
//        return new ScholarshipApplication(0, studentId, scholarshipId, studentBatch,
//                studentDegree, studentGpa, "Pending", null);
//    }
//
//    // Attendance JSON helper methods
//    private String createAttendanceListJson(List<Attendance> attendanceList) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"success\":true,");
//        json.append("\"message\":\"Attendance records retrieved successfully\",");
//        json.append("\"data\":[");
//
//        for (int i = 0; i < attendanceList.size(); i++) {
//            Attendance attendance = attendanceList.get(i);
//
//            json.append("{");
//            json.append("\"id\":").append(attendance.getId()).append(",");
//            json.append("\"studentId\":").append(attendance.getStudentId()).append(",");
//            json.append("\"courseCode\":\"").append(attendance.getCourseCode()).append("\",");
//            json.append("\"date\":\"").append(attendance.getDate()).append("\",");
//            json.append("\"present\":").append(attendance.isPresent()).append(",");
//            json.append("\"remarks\":\"").append(attendance.getRemarks()).append("\"");
//            json.append("}");
//
//            if (i < attendanceList.size() - 1) {
//                json.append(",");
//            }
//        }
//
//        json.append("]");
//        json.append("}");
//
//        return json.toString();
//    }
//
//    private String createAttendanceListMapJson(List<Map<String, Object>> attendanceList) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"success\":true,");
//        json.append("\"message\":\"Attendance records retrieved successfully\",");
//        json.append("\"data\":[");
//
//        for (int i = 0; i < attendanceList.size(); i++) {
//            Map<String, Object> attendance = attendanceList.get(i);
//
//            json.append("{");
//            json.append("\"studentId\":").append(attendance.get("studentId")).append(",");
//            json.append("\"name\":\"").append(attendance.get("name")).append("\",");
//            json.append("\"indexNumber\":\"").append(attendance.get("indexNumber")).append("\",");
//
//            if (attendance.get("present") != null) {
//                json.append("\"present\":").append(attendance.get("present")).append(",");
//                json.append("\"remarks\":\"").append(attendance.get("remarks")).append("\"");
//            } else {
//                json.append("\"present\":null,");
//                json.append("\"remarks\":\"").append(attendance.get("remarks")).append("\"");
//            }
//
//            json.append("}");
//
//            if (i < attendanceList.size() - 1) {
//                json.append(",");
//            }
//        }
//
//        json.append("]");
//        json.append("}");
//
//        return json.toString();
//    }
//
//    private String createCourseSessionsJson(List<CourseSession> sessions) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"success\":true,");
//        json.append("\"message\":\"Course sessions retrieved successfully\",");
//        json.append("\"data\":[");
//
//        for (int i = 0; i < sessions.size(); i++) {
//            json.append(createCourseSessionJsonObject(sessions.get(i)));
//
//            if (i < sessions.size() - 1) {
//                json.append(",");
//            }
//        }
//
//        json.append("]");
//        json.append("}");
//
//        return json.toString();
//    }
//
//    private String createCourseSessionJson(CourseSession session) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"success\":true,");
//        json.append("\"message\":\"Course session retrieved successfully\",");
//        json.append("\"data\":").append(createCourseSessionJsonObject(session));
//        json.append("}");
//
//        return json.toString();
//    }
//
//    private String createCourseSessionJsonObject(CourseSession session) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"id\":").append(session.getId()).append(",");
//        json.append("\"courseCode\":\"").append(session.getCourseCode()).append("\",");
//        json.append("\"courseName\":\"").append(session.getCourseName()).append("\",");
//        json.append("\"date\":\"").append(session.getDate()).append("\",");
//        json.append("\"totalStudents\":").append(session.getTotalStudents()).append(",");
//        json.append("\"presentStudents\":").append(session.getPresentStudents()).append(",");
//        json.append("\"attendancePercentage\":").append(String.format("%.2f", session.getAttendancePercentage()));
//        json.append("}");
//
//        return json.toString();
//    }
//
//    private String createAttendanceSummaryJson(List<AttendanceSummary> summaries) {
//        StringBuilder json = new StringBuilder();
//        json.append("{");
//        json.append("\"success\":true,");
//        json.append("\"message\":\"Attendance summary retrieved successfully\",");
//        json.append("\"data\":[");
//
//        for (int i = 0; i < summaries.size(); i++) {
//            AttendanceSummary summary = summaries.get(i);
//
//            json.append("{");
//            json.append("\"studentId\":").append(summary.getStudentId()).append(",");
//            json.append("\"studentName\":\"").append(summary.getStudentName()).append("\",");
//            json.append("\"courseCode\":\"").append(summary.getCourseCode()).append("\",");
//            json.append("\"courseName\":\"").append(summary.getCourseName()).append("\",");
//            json.append("\"totalSessions\":").append(summary.getTotalSessions()).append(",");
//            json.append("\"presentCount\":").append(summary.getPresentCount()).append(",");
//            json.append("\"absentCount\":").append(summary.getAbsentCount()).append(",");
//            json.append("\"attendancePercentage\":").append(String.format("%.2f", summary.getAttendancePercentage()));
//            json.append("}");
//
//            if (i < summaries.size() - 1) {
//                json.append(",");
//            }
//        }
//
//        json.append("]");
//        json.append("}");
//
//        return json.toString();
//    }
//
//    // ============== Utility Methods ==============
//
//    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse)
//            throws IOException {
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//        response.getWriter().write(apiResponse.toJson());
//    }
//
//    private void handleError(HttpServletResponse response, Exception e) throws IOException {
//        e.printStackTrace();
//        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        ApiResponse<Void> apiResponse =
//                new ApiResponse<>(false, "Error: " + e.getMessage(), null);
//        sendJsonResponse(response, apiResponse);
//    }
//}