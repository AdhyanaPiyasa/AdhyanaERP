package com.adhyana.exam;

import com.adhyana.exam.models.*;
import com.adhyana.exam.services.AssignmentService;
import com.adhyana.exam.services.ExamService;
import com.adhyana.exam.services.GradeService;
import com.adhyana.exam.services.ReportService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;
import java.util.List;

@WebServlet("/api/exams/*")
public class ExamServlet extends HttpServlet {
    private final ExamService examService = new ExamService();
    private final AssignmentService assignmentService = new AssignmentService();
    private final GradeService gradeService = new GradeService();
    private final ReportService reportService = new ReportService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("=== ExamServlet - doGet: Request received ===");
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                handleGetAllExams(response);
                System.out.println("Exam List");
            } else if (pathInfo.equals("/assignment")) {
                handleGetAllAssignments(response);
            } else if (pathInfo.startsWith("/assignment/")) {
                int assignmentId = Integer.parseInt(pathInfo.substring("/assignment/".length()));
                handleGetAssignment(assignmentId, response);
            } else if (pathInfo.equals("/grade")) {
                handleGetAllGrades(response);
            } else if (pathInfo.startsWith("/grade/")) {
                int gradeId = Integer.parseInt(pathInfo.substring("/grade/".length()));
                handleGetGrade(gradeId, response);
            } else if (pathInfo.equals("/report")) {
                handleGetAllReports(response);
            } else if (pathInfo.startsWith("/report/")) {
                int reportId = Integer.parseInt(pathInfo.substring("/report/".length()));
                handleGetReport(reportId, response);
            } else {
                try {
                    int id = Integer.parseInt(pathInfo.substring(1));
                    handleGetExam(id, response);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path.");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                handleCreateExam(request, response);
            } else if (pathInfo.equals("/assignment")) {
                handleCreateAssignment(request, response);
            } else if (pathInfo.equals("/grade")) {
                handleCreateGrade(request, response);
            } else if (pathInfo.equals("/report")) {
                handleCreateReport(request, response);
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path.");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            if (pathInfo.startsWith("/assignment/")) {
                int id = Integer.parseInt(pathInfo.substring("/assignment/".length()));
                handleUpdateAssignment(request, response, id);
            } else if (pathInfo.startsWith("/grade/")) {
                int id = Integer.parseInt(pathInfo.substring("/grade/".length()));
                handleUpdateGrade(request, response, id);
            } else if (pathInfo.startsWith("/report/")) {
                int id = Integer.parseInt(pathInfo.substring("/report/".length()));
                handleUpdateReport(request, response, id);
            } else {
                try {
                    int id = Integer.parseInt(pathInfo.substring(1));
                    handleUpdateExam(request, response, id);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path.");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Resource ID required");
                return;
            }

            if (pathInfo.startsWith("/assignment/")) {
                int id = Integer.parseInt(pathInfo.substring("/assignment/".length()));
                handleDeleteAssignment(response, id);
            } else if (pathInfo.startsWith("/grade/")) {
                int id = Integer.parseInt(pathInfo.substring("/grade/".length()));
                handleDeleteGrade(response, id);
            } else if (pathInfo.startsWith("/report/")) {
                int id = Integer.parseInt(pathInfo.substring("/report/".length()));
                handleDeleteReport(response, id);
            } else {
                try {
                    int id = Integer.parseInt(pathInfo.substring(1));
                    handleDeleteExam(response, id);
                } catch (NumberFormatException e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid path.");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    //exam handlers
    private void handleGetAllExams(HttpServletResponse response) throws Exception {
        ApiResponse<List<Exam>> apiResponse =
                new ApiResponse<>(true, "Exams retrieved successfully", examService.getAllExams());
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetExam(int id, HttpServletResponse response) throws Exception {
        Exam exam = examService.getExam(id);
        if (exam != null) {
            ApiResponse<Exam> apiResponse =
                    new ApiResponse<>(true, "Exam retrieved successfully", exam);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Exam not found");
        }
    }

    private void handleCreateExam(HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Exam exam = parseExamFromRequest(request);
        Exam newExam = examService.createExam(exam);

        ApiResponse<Exam> apiResponse =
                new ApiResponse<>(true, "Exam created successfully", newExam);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateExam(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Exam exam = parseExamFromRequest(request);
        examService.updateExam(id, exam);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Exam updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteExam(HttpServletResponse response, int id)
            throws Exception {
        examService.deleteExam(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Exam deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    //==========Assignment handlers=========//
    private void handleGetAllAssignments(HttpServletResponse response) throws Exception {
        List<Assignment> assignmentList = assignmentService.getAllAssignments();
        ApiResponse<List<Assignment>> apiResponse =
                new ApiResponse<>(true, "Assignments retrieved successfully", assignmentList);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetAssignment(int id, HttpServletResponse response) throws Exception {
        Assignment assignment = assignmentService.getAssignmentById(id);
        if (assignment != null) {
            ApiResponse<Assignment> apiResponse =
                    new ApiResponse<>(true, "Assignment retrieved successfully", assignment);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Assignment record not found");
        }
    }

    private void handleCreateAssignment(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Assignment assignment = parseAssignmentFromRequest(request);
        Assignment newAssignment = assignmentService.createAssignment(assignment);
        ApiResponse<Assignment> apiResponse =
                new ApiResponse<>(true, "Assignment created successfully", newAssignment);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateAssignment(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Assignment assignment = parseAssignmentFromRequest(request);
        assignmentService.updateAssignment(id, assignment);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Assignment record updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteAssignment(HttpServletResponse response, int id) throws Exception {
        assignmentService.deleteAssignment(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Assignment record deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    //Grades handlers
    private void handleGetAllGrades(HttpServletResponse response) throws Exception {
        List<Grades> gradesList = gradeService.getAllGrades();
        ApiResponse<List<Grades>> apiResponse =
                new ApiResponse<>(true, "Grades retrieved successfully", gradesList);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetGrade(int id, HttpServletResponse response) throws Exception {
        Grades grade = gradeService.getGradeById(id);
        if (grade != null) {
            ApiResponse<Grades> apiResponse =
                    new ApiResponse<>(true, "Grade retrieved successfully", grade);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Grade record not found");
        }
    }

    private void handleCreateGrade(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Grades grade = parseGradesFromRequest(request);
        Grades newGrade = gradeService.createGrade(grade);
        ApiResponse<Grades> apiResponse =
                new ApiResponse<>(true, "Grade created successfully", newGrade);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateGrade(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Grades grade = parseGradesFromRequest(request);
        gradeService.updateGrade(id, grade);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Grade updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteGrade(HttpServletResponse response, int id) throws Exception {
        gradeService.deleteGrade(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Grade deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    //Reports handlers
    private void handleGetAllReports(HttpServletResponse response) throws Exception {
        List<Reports> reportsList = reportService.getAllReports();
        ApiResponse<List<Reports>> apiResponse =
                new ApiResponse<>(true, "Reports retrieved successfully", reportsList);
        sendJsonResponse(response, apiResponse);
    }

    private void handleGetReport(int id, HttpServletResponse response) throws Exception {
        Reports report = reportService.getReportById(id);
        if (report != null) {
            ApiResponse<Reports> apiResponse =
                    new ApiResponse<>(true, "Report retrieved successfully", report);
            sendJsonResponse(response, apiResponse);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Report record not found");
        }
    }

    private void handleCreateReport(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Reports report = parseReportsFromRequest(request);
        Reports newReport = reportService.createReport(report);
        ApiResponse<Reports> apiResponse =
                new ApiResponse<>(true, "Report created successfully", newReport);
        sendJsonResponse(response, apiResponse);
    }

    private void handleUpdateReport(HttpServletRequest request, HttpServletResponse response, int id)
            throws Exception {
        Reports report = parseReportsFromRequest(request);
        reportService.updateReport(id, report);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Report updated successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    private void handleDeleteReport(HttpServletResponse response, int id) throws Exception {
        reportService.deleteReport(id);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(true, "Report deleted successfully", null);
        sendJsonResponse(response, apiResponse);
    }

    // Parsing methods
    private Exam parseExamFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        String title = null;
        String course = null;
        int courseCode = 0;
        String date = null;
        String startTime = null;
        String endTime = null;
        String room = null;
        String teacher = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "title": title = value; break;
                    case "course": course = value; break;
                    case "courseCode": courseCode = Integer.parseInt(value); break;
                    case "date": date = value; break;
                    case "startTime": startTime = value; break;
                    case "endTime": endTime = value; break;
                    case "room": room = value; break;
                    case "teacher": teacher = value; break;
                }
            }
        }

        return new Exam(0, title, course, courseCode, date, startTime, endTime, room, teacher);
    }

    private Assignment parseAssignmentFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        String title = null;
        String course = null;
        int courseCode = 0;
        String type = null;
        String date = null;
        String startTime = null;
        String endTime = null;
        String room = null;
        String teacher = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "title": title = value; break;
                    case "course": course = value; break;
                    case "courseCode": courseCode = Integer.parseInt(value); break;
                    case "type": type = value; break;
                    case "date": date = value; break;
                    case "startTime": startTime = value; break;
                    case "endTime": endTime = value; break;
                    case "room": room = value; break;
                    case "teacher": teacher = value; break;
                }
            }
        }

        return new Assignment(0, title, course, courseCode, type, date, startTime, endTime, room, teacher);
    }

    private Grades parseGradesFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        String indexNo = null;
        String name = null;
        int courseCode = 0;
        String courseName = null;
        String grade = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "Index_No": indexNo = value; break;
                    case "Name": name = value; break;
                    case "courseCode": courseCode = Integer.parseInt(value); break;
                    case "courseName": courseName = value; break;
                    case "grade": grade = value; break;
                }
            }
        }

        return new Grades(0, indexNo, name, courseCode, courseName, grade);
    }

    private Reports parseReportsFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        String courseName = null;
        String examName = null;
        String name = null;
        String date = null;

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "coursename": courseName = value; break;
                    case "examname": examName = value; break;
                    case "name": name = value; break;
                    case "date": date = value; break;
                }
            }
        }

        return new Reports(0, courseName, examName, name, date);
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

    private void sendJsonResponse(HttpServletResponse response, ApiResponse<?> apiResponse)
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(apiResponse.toJson());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        e.printStackTrace(); // Log the full stack trace for debugging
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse =
                new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}