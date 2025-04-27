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

public class StudentCoreServlet extends HttpServlet {

    private final StudentService studentService = new StudentService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/core".length());

            if (subPath == null || subPath.equals("") || subPath.equals("/")) {
                // Get all students
                handleGetAllStudents(response);
            } else if (subPath.startsWith("/batch/")) {
                // Get students by batch ID
                String batchId = subPath.substring("/batch/".length());
                handleGetStudentsByBatch(response, batchId);
            } else if (subPath.startsWith("/enrolled/")) {
                if (subPath.equals("/enrolled/")) {
                    // Get all enrolled students
                    handleGetAllEnrolledStudents(response);
                } else {
                    String enrolledPath = subPath.substring("/enrolled/".length());
                    if (enrolledPath.startsWith("batch/")) {
                        // Get enrolled students by batch
                        String batchId = enrolledPath.substring("batch/".length());
                        handleGetEnrolledStudentsByBatch(response, batchId);
                    } else {
                        try {
                            // Assume it's a student index
                            int studentIndex = Integer.parseInt(enrolledPath);
                            handleGetEnrolledStudent(response, studentIndex);
                        } catch (NumberFormatException e) {
                            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path format");
                        }
                    }
                }
            } else {
                try {
                    // Assume it's a student index
                    int studentIndex = Integer.parseInt(subPath.substring(1));
                    handleGetStudent(response, studentIndex);
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
            String subPath = pathInfo.substring("/core".length());

            if (subPath == null || subPath.equals("") || subPath.equals("/")) {
                // Create a new student
                handleCreateStudent(request, response);
            } else if (subPath.equals("/enrolled/")) {
                // Create a new enrolled student
                handleCreateEnrolledStudent(request, response);
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
            String subPath = pathInfo.substring("/core".length());

            if (subPath == null || subPath.equals("")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Student index required");
                return;
            }

            if (subPath.startsWith("/enrolled/")) {
                String enrolledPath = subPath.substring("/enrolled/".length());
                try {
                    // Update enrolled student
                    int studentIndex = Integer.parseInt(enrolledPath);
                    handleUpdateEnrolledStudent(request, response, studentIndex);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format");
                }
            } else {
                try {
                    // Update regular student
                    int studentIndex = Integer.parseInt(subPath.substring(1));
                    handleUpdateStudent(request, response, studentIndex);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            String subPath = pathInfo.substring("/core".length());

            if (subPath == null || subPath.equals("")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Student index required");
                return;
            }

            if (subPath.startsWith("/enrolled/")) {
                String enrolledPath = subPath.substring("/enrolled/".length());
                try {
                    // Delete enrolled student
                    int studentIndex = Integer.parseInt(enrolledPath);
                    handleDeleteEnrolledStudent(response, studentIndex);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format");
                }
            } else {
                try {
                    // Delete regular student
                    int studentIndex = Integer.parseInt(subPath.substring(1));
                    handleDeleteStudent(response, studentIndex);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    // Student handlers
    private void handleGetAllStudents(HttpServletResponse response) throws Exception {
        ApiResponse<List<Student>> apiResponse =
                new ApiResponse<>(true, "Students retrieved successfully", studentService.getAllStudents());
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetStudent(HttpServletResponse response, int studentIndex) throws Exception {
        Student student = studentService.getStudent(studentIndex);
        if (student != null) {
            ApiResponse<Student> apiResponse =
                    new ApiResponse<>(true, "Student retrieved successfully", student);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
        }
    }

    private void handleGetStudentsByBatch(HttpServletResponse response, String batchId) throws Exception {
        List<Student> students = studentService.getStudentsByBatchId(batchId);
        ApiResponse<List<Student>> apiResponse =
                new ApiResponse<>(true, "Students retrieved successfully", students);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetAllEnrolledStudents(HttpServletResponse response) throws Exception {
        ApiResponse<List<EnrolledStudent>> apiResponse =
                new ApiResponse<>(true, "Enrolled students retrieved successfully", studentService.getAllEnrolledStudents());
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetEnrolledStudent(HttpServletResponse response, int studentIndex) throws Exception {
        EnrolledStudent student = studentService.getEnrolledStudent(studentIndex);
        if (student != null) {
            ApiResponse<EnrolledStudent> apiResponse =
                    new ApiResponse<>(true, "Enrolled student retrieved successfully", student);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Enrolled student not found");
        }
    }

    private void handleGetEnrolledStudentsByBatch(HttpServletResponse response, String batchId) throws Exception {
        List<EnrolledStudent> students = studentService.getEnrolledStudentsByBatchId(batchId);
        ApiResponse<List<EnrolledStudent>> apiResponse =
                new ApiResponse<>(true, "Enrolled students retrieved successfully", students);
        sendJsonResponse(response, apiResponse);
    }

    private void handleCreateStudent(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Student student = parseStudentFromRequest(request);
        Student newStudent = studentService.createStudent(student);
        ApiResponse<Student> apiResponse =
                new ApiResponse<>(true, "Student created successfully", newStudent);
        sendJsonResponse(response, apiResponse);
    }

    private void handleCreateEnrolledStudent(HttpServletRequest request, HttpServletResponse response) throws Exception {
        EnrolledStudent student = parseEnrolledStudentFromRequest(request);
        EnrolledStudent newStudent = studentService.createEnrolledStudent(student);
        ApiResponse<EnrolledStudent> apiResponse =
                new ApiResponse<>(true, "Enrolled student created successfully", newStudent);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateStudent(HttpServletRequest request, HttpServletResponse response, int studentIndex) throws Exception {
        Student student = parseStudentFromRequest(request);
        studentService.updateStudent(studentIndex, student);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Student updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateEnrolledStudent(HttpServletRequest request, HttpServletResponse response, int studentIndex) throws Exception {
        EnrolledStudent student = parseEnrolledStudentFromRequest(request);
        studentService.updateEnrolledStudent(studentIndex, student);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Enrolled student updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteStudent(HttpServletResponse response, int studentIndex) throws Exception {
        studentService.deleteStudent(studentIndex);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Student deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteEnrolledStudent(HttpServletResponse response, int studentIndex) throws Exception {
        studentService.deleteEnrolledStudent(studentIndex);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Enrolled student deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Parse methods
    private Student parseStudentFromRequest(HttpServletRequest request) throws IOException {
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
        int studentIndex = 0;
        String registrationNumber = null;
        String name = null;
        String email = null;
        String batchId = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "studentIndex":
                        studentIndex = Integer.parseInt(value);
                        break;
                    case "registrationNumber":
                        registrationNumber = value;
                        break;
                    case "name":
                        name = value;
                        break;
                    case "email":
                        email = value;
                        break;
                    case "batchId":
                        batchId = value;
                        break;
                }
            }
        }

        return new Student(studentIndex, registrationNumber, name, email, batchId);
    }

    private EnrolledStudent parseEnrolledStudentFromRequest(HttpServletRequest request) throws IOException {
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
        int studentIndex = 0;
        String registrationNumber = null;
        String batchId = null;
        String name = null;
        String nationalId = null;
        String email = null;
        String phone = null;
        String gender = null;
        LocalDate dateOfBirth = null;
        String address = null;
        String guardianName = null;
        String guardianNationalId = null;
        String guardianRelation = null;
        String guardianContactNumber = null;
        String guardianEmail = null;
        String hostelRequired = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "studentIndex":
                        studentIndex = Integer.parseInt(value);
                        break;
                    case "registrationNumber":
                        registrationNumber = value;
                        break;
                    case "batchId":
                        batchId = value;
                        break;
                    case "name":
                        name = value;
                        break;
                    case "nationalId":
                        nationalId = value;
                        break;
                    case "email":
                        email = value;
                        break;
                    case "phone":
                        phone = value;
                        break;
                    case "gender":
                        gender = value;
                        break;
                    case "dateOfBirth":
                        dateOfBirth = LocalDate.parse(value);
                        break;
                    case "address":
                        address = value;
                        break;
                    case "guardianName":
                        guardianName = value;
                        break;
                    case "guardianNationalId":
                        guardianNationalId = value;
                        break;
                    case "guardianRelation":
                        guardianRelation = value;
                        break;
                    case "guardianContactNumber":
                        guardianContactNumber = value;
                        break;
                    case "guardianEmail":
                        guardianEmail = value;
                        break;
                    case "hostelRequired":
                        hostelRequired = value;
                        break;
                }
            }
        }

        return new EnrolledStudent(studentIndex, registrationNumber, batchId, name, nationalId, email, phone, gender,
                dateOfBirth, address, guardianName, guardianNationalId, guardianRelation, guardianContactNumber,
                guardianEmail, hostelRequired);
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