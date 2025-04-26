package com.adhyana.exam.servlets;

import com.adhyana.exam.models.Exam;
import com.adhyana.exam.services.ExamService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet("/api/exams/*")
public class ExamServlet extends HttpServlet {
    private ExamService examService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        examService = new ExamService();
        // Configure Gson with date formatting
        gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd")
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Get all exams
                List<Exam> exams = examService.getAllExams();
                out.print(gson.toJson(exams));
            } else {
                // Get a specific exam by ID
                int examId = getExamIdFromPath(pathInfo);
                Exam exam = examService.getExam(examId);

                if (exam != null) {
                    out.print(gson.toJson(exam));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\": \"Exam not found\"}");
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // Parse the exam from the request body
            Exam exam = parseExamFromRequest(request);

            // Create the exam
            Exam createdExam = examService.createExam(exam);

            response.setStatus(HttpServletResponse.SC_CREATED);
            out.print(gson.toJson(createdExam));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // Get exam ID from path
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Exam ID is required for update\"}");
                return;
            }

            int examId = getExamIdFromPath(pathInfo);

            // Check if exam exists
            Exam existingExam = examService.getExam(examId);
            if (existingExam == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\": \"Exam not found\"}");
                return;
            }

            // Parse the updated exam from request
            Exam updatedExam = parseExamFromRequest(request);

            // Update the exam
            examService.updateExam(examId, updatedExam);

            // Return the updated exam
            Exam exam = examService.getExam(examId);
            out.print(gson.toJson(exam));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            // Get exam ID from path
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\": \"Exam ID is required for deletion\"}");
                return;
            }

            int examId = getExamIdFromPath(pathInfo);

            // Check if exam exists
            Exam existingExam = examService.getExam(examId);
            if (existingExam == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\": \"Exam not found\"}");
                return;
            }

            // Delete the exam
            examService.deleteExam(examId);

            response.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"message\": \"Exam deleted successfully\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }

    private int getExamIdFromPath(String pathInfo) {
        // Extract the exam ID from the path
        // Path format: /123 where 123 is the exam ID
        String[] pathParts = pathInfo.split("/");
        return Integer.parseInt(pathParts[1]);
    }

    private Exam parseExamFromRequest(HttpServletRequest request) throws Exception {
        // Read the request body
        StringBuilder buffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        }

        // Parse JSON to Exam object
        return gson.fromJson(buffer.toString(), Exam.class);
    }
}