package com.adhyana.exam;

import com.adhyana.exam.models.Exam;
import com.adhyana.exam.services.ExamService;

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
import java.util.stream.Collectors;
import java.util.stream.Stream;

@WebServlet("/api/exams/*")
public class ExamServlet extends HttpServlet {
    private ExamService examService;
    private final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
    private final SimpleDateFormat timeFormatter = new SimpleDateFormat("HH:mm:ss");

    @Override
    public void init() throws ServletException {
        examService = new ExamService();
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
                out.print(toJson(exams));
            } else {
                // Get a specific exam by ID
                int examId = getExamIdFromPath(pathInfo);
                Exam exam = examService.getExam(examId);

                if (exam != null) {
                    out.print(toJson(exam));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print(toJsonError("Exam not found"));
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(toJsonError(e.getMessage()));
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
            out.print(toJson(createdExam));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(toJsonError(e.getMessage()));
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
                out.print(toJsonError("Exam ID is required for update"));
                return;
            }

            int examId = getExamIdFromPath(pathInfo);

            // Check if exam exists
            Exam existingExam = examService.getExam(examId);
            if (existingExam == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(toJsonError("Exam not found"));
                return;
            }

            // Parse the updated exam from request
            Exam updatedExam = parseExamFromRequest(request);

            // Update the exam
            examService.updateExam(examId, updatedExam);

            // Return the updated exam
            Exam exam = examService.getExam(examId);
            out.print(toJson(exam));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(toJsonError(e.getMessage()));
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
                out.print(toJsonError("Exam ID is required for deletion"));
                return;
            }

            int examId = getExamIdFromPath(pathInfo);

            // Check if exam exists
            Exam existingExam = examService.getExam(examId);
            if (existingExam == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(toJsonError("Exam not found"));
                return;
            }

            // Delete the exam
            examService.deleteExam(examId);

            response.setStatus(HttpServletResponse.SC_OK);
            out.print(toJsonMessage("Exam deleted successfully"));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(toJsonError(e.getMessage()));
            e.printStackTrace();
        }
    }

    private int getExamIdFromPath(String pathInfo) {
        String[] pathParts = pathInfo.split("/");
        return Integer.parseInt(pathParts[1]);
    }

    private Exam parseExamFromRequest(HttpServletRequest request) throws Exception {
        StringBuilder buffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        }
        String requestBody = buffer.toString();
        return examFromJson(requestBody);
    }

    private Exam examFromJson(String json) throws Exception {
        Exam exam = new Exam();
        // Basic manual parsing - you might need a more robust solution for complex JSON
        json = json.replaceAll("[{}]", "");
        String[] pairs = json.split(",");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replaceAll("\"", "");
                String value = keyValue[1].trim().replaceAll("\"", "");
                switch (key) {
                    case "title":
                        exam.setTitle(value);
                        break;
                    case "semester_id":
                        exam.setSemester_id(value);
                        break;
                    case "exam_date":
                        exam.setExam_date(dateFormatter.parse(value));
                        break;
                    case "start_time":
                        exam.setStart_time(new java.sql.Time(timeFormatter.parse(value).getTime()));
                        break;
                    case "end_time":
                        exam.setEnd_time(new java.sql.Time(timeFormatter.parse(value).getTime()));
                        break;
                    case "location":
                        exam.setLocation(value);
                        break;
                    case "type":
                        exam.setType(value);
                        break;
                    case "exam_id":
                        exam.setExam_id(Integer.parseInt(value));
                        break;
                    // Add other fields as necessary
                }
            }
        }
        return exam;
    }

    private String toJson(Object obj) throws Exception {
        if (obj == null) {
            return "null";
        }
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            return "[" + list.stream().map(this::toJsonInternal).collect(Collectors.joining(",")) + "]";
        }
        return toJsonInternal(obj);
    }

    private String toJsonInternal(Object obj) {
        if (obj == null) {
            return "null";
        }
        if (obj instanceof String) {
            return "\"" + escapeJsonString((String) obj) + "\"";
        }
        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }
        if (obj instanceof Date) {
            return "\"" + dateFormatter.format((Date) obj) + "\"";
        }
        if (obj instanceof java.sql.Time) {
            return "\"" + timeFormatter.format(obj) + "\"";
        }
        if (obj instanceof Exam) {
            Exam exam = (Exam) obj;
            return "{" +
                    "\"exam_id\":" + exam.getExam_id() + "," +
                    "\"title\":\"" + escapeJsonString(exam.getTitle()) + "\"," +
                    "\"semester_id\":\"" + escapeJsonString(exam.getSemester_id()) + "\"," +
                    "\"exam_date\":\"" + dateFormatter.format(exam.getExam_date()) + "\"," +
                    "\"start_time\":\"" + timeFormatter.format(exam.getStart_time()) + "\"," +
                    "\"end_time\":\"" + timeFormatter.format(exam.getEnd_time()) + "\"," +
                    "\"location\":\"" + escapeJsonString(exam.getLocation()) + "\"," +
                    "\"type\":\"" + escapeJsonString(exam.getType()) + "\"" +
                    "}";
        }
        // Handle other object types if needed
        return "\"Unsupported type\"";
    }

    private String escapeJsonString(String str) {
        if (str == null) {
            return "";
        }
        return str.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String toJsonError(String message) {
        return "{\"error\":\"" + escapeJsonString(message) + "\"}";
    }

    private String toJsonMessage(String message) {
        return "{\"message\":\"" + escapeJsonString(message) + "\"}";
    }
}