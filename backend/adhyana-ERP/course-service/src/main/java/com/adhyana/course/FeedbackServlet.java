package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Feedback;
import com.adhyana.course.services.FeedbackService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;

@WebServlet("/api/courses/feedbacks/*")
public class FeedbackServlet extends HttpServlet {
    private final FeedbackService feedbackService = new FeedbackService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Get all feedback records
                List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
                ApiResponse<List<Feedback>> apiResponse = new ApiResponse<>(true, "Feedbacks retrieved successfully", feedbacks);
                sendJsonResponse(response, apiResponse);
            } else {
                // Try to parse ID from path and fetch that feedback
                int id = Integer.parseInt(pathInfo.substring(1));
                Feedback feedback = feedbackService.getFeedbackById(id);

                if (feedback != null) {
                    ApiResponse<Feedback> apiResponse = new ApiResponse<>(true, "Feedback retrieved successfully", feedback);
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Feedback not found");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Feedback feedback = parseFeedbackFromRequest(request);
            Feedback created = feedbackService.createFeedback(feedback);

            ApiResponse<Feedback> apiResponse = new ApiResponse<>(true, "Feedback created successfully", created);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Feedback ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            Feedback feedback = parseFeedbackFromRequest(request);
            feedbackService.updateFeedback(id, feedback);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Feedback updated successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Feedback ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            feedbackService.deleteFeedback(id);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Feedback deleted successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private Feedback parseFeedbackFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        Map<String, String> data = parseJsonToMap(json);

        int courseId = Integer.parseInt(data.get("courseId"));
        Integer studentId = data.containsKey("studentId") && !data.get("studentId").equalsIgnoreCase("null")
                ? Integer.parseInt(data.get("studentId")) : null;
        String teacher = data.getOrDefault("teacher", null);
        int ratingContent = Integer.parseInt(data.get("ratingContent"));
        int ratingInstructor = Integer.parseInt(data.get("ratingInstructor"));
        int ratingLms = Integer.parseInt(data.get("ratingLms"));
        String comment = data.get("comment");
        boolean isAnonymous = Boolean.parseBoolean(data.get("isAnonymous"));
        Timestamp now = new Timestamp(System.currentTimeMillis());

        return new Feedback(0, courseId, studentId, teacher, ratingContent, ratingInstructor, ratingLms, comment, isAnonymous, now, now);
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
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
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
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}
