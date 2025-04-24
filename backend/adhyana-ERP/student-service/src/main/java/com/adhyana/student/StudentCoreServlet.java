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
            } else if (subPath.startsWith("/degree/")) {
                // Get students by degree ID
                String degreeID = subPath.substring("/degree/".length());
                handleGetStudentsByDegree(response, degreeID);
            } else {
                try {
                    // Assume it's a student ID
                    int id = Integer.parseInt(subPath.substring(1));
                    handleGetStudent(response, id);
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
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID required");
                return;
            }

            try {
                // Assume it's a student ID
                int id = Integer.parseInt(subPath.substring(1));
                handleUpdateStudent(request, response, id);
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
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
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID required");
                return;
            }

            try {
                // Assume it's a student ID
                int id = Integer.parseInt(subPath.substring(1));
                handleDeleteStudent(response, id);
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ID format");
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

    private void handleGetStudent(HttpServletResponse response, int id) throws Exception {
        Student student = studentService.getStudent(id);
        if (student != null) {
            ApiResponse<Student> apiResponse =
                    new ApiResponse<>(true, "Student retrieved successfully", student);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
        }
    }

    private void handleGetStudentsByDegree(HttpServletResponse response, String degreeID) throws Exception {
        List<Student> students = studentService.getStudentsByDegreeID(degreeID);
        ApiResponse<List<Student>> apiResponse =
                new ApiResponse<>(true, "Students retrieved successfully", students);
        sendJsonResponse(response, apiResponse);
    }

    private void handleCreateStudent(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Student student = parseStudentFromRequest(request);
        Student newStudent = studentService.createStudent(student);
        ApiResponse<Student> apiResponse =
                new ApiResponse<>(true, "Student created successfully", newStudent);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateStudent(HttpServletRequest request, HttpServletResponse response, int id) throws Exception {
        Student student = parseStudentFromRequest(request);
        studentService.updateStudent(id, student);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Student updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteStudent(HttpServletResponse response, int id) throws Exception {
        studentService.deleteStudent(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Student deleted successfully", null);
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
        String name = null;
        String email = null;
        String degreeID = null;
        String degreeProgram = null;
        String indexNumber = null;
        String registrationNumber = null;
        String mobileNumber = null;
        LocalDate birthDate = null;
        String state = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "name":
                        name = value;
                        break;
                    case "email":
                        email = value;
                        break;
                    case "degreeID":
                        degreeID = value;
                        break;
                    case "degreeProgram":
                        degreeProgram = value;
                        break;
                    case "indexNumber":
                        indexNumber = value;
                        break;
                    case "registrationNumber":
                        registrationNumber = value;
                        break;
                    case "mobileNumber":
                        mobileNumber = value;
                        break;
                    case "birthDate":
                        birthDate = LocalDate.parse(value);
                        break;
                    case "state":
                        state = value;
                        break;
                }
            }
        }

        return new Student(0, name, email, degreeID, degreeProgram, indexNumber,
                registrationNumber, mobileNumber, birthDate, state);
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