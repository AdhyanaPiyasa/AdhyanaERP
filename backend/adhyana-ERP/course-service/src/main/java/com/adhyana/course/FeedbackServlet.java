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
                // Check for query parameters for filtering
                String courseId = request.getParameter("courseId");
                String semesterId = request.getParameter("semesterId");

                List<Feedback> feedbacks;

                if (courseId != null) {
                    feedbacks = feedbackService.getFeedbacksByCourse(courseId);
                } else if (semesterId != null) {
                    feedbacks = feedbackService.getFeedbacksBySemester(semesterId);
                } else {
                    // Get all feedback records
                    feedbacks = feedbackService.getAllFeedbacks();
                }

                ApiResponse<List<Feedback>> apiResponse = new ApiResponse<>(true, "Feedbacks retrieved successfully", feedbacks);
                sendJsonResponse(response, apiResponse);
            } else {
                // Try to parse ID from path and fetch that feedback
                int feedbackId = Integer.parseInt(pathInfo.substring(1));
                Feedback feedback = feedbackService.getFeedbackById(feedbackId);

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

            int feedbackId = Integer.parseInt(pathInfo.substring(1));
            Feedback feedback = parseFeedbackFromRequest(request);
            feedbackService.updateFeedback(feedbackId, feedback);

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

            int feedbackId = Integer.parseInt(pathInfo.substring(1));
            feedbackService.deleteFeedback(feedbackId);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Feedback deleted successfully", null);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private Feedback parseFeedbackFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        Map<String, String> data = parseJsonToMap(json);

        // Parse data with proper handling of null values
        String courseId = data.get("courseId");
        String semesterId = data.getOrDefault("semesterId", null);

        Integer studentIndex = null;
        if (data.containsKey("studentIndex") && !data.get("studentIndex").equalsIgnoreCase("null")) {
            try {
                studentIndex = Integer.parseInt(data.get("studentIndex"));
            } catch (NumberFormatException e) {
                // Handle invalid student index format
            }
        }

        int ratingContent = Integer.parseInt(data.getOrDefault("ratingContent", "0"));
        int ratingInstructor = Integer.parseInt(data.getOrDefault("ratingInstructor", "0"));
        int ratingMaterials = Integer.parseInt(data.getOrDefault("ratingMaterials", "0"));
        int ratingLms = Integer.parseInt(data.getOrDefault("ratingLms", "0"));
        String comment = data.getOrDefault("comment", "");
        boolean isAnonymous = Boolean.parseBoolean(data.getOrDefault("isAnonymous", "false"));

        Timestamp now = new Timestamp(System.currentTimeMillis());

        return new Feedback(
                0, // feedbackId will be generated by the database
                courseId,
                semesterId,
                studentIndex,
                ratingContent,
                ratingInstructor,
                ratingMaterials,
                ratingLms,
                comment,
                isAnonymous,
                now,
                now
        );
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
        if (json == null || json.isEmpty()) {
            return map;
        }

        // Simple JSON parsing
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2); // Split on first colon only
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                // Handle null values
                if (value.equalsIgnoreCase("null")) {
                    value = null;
                }

                map.put(key, value);
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
        System.err.println("Error processing feedback request: " + e.getMessage());
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}