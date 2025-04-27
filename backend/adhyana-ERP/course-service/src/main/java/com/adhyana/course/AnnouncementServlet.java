package com.adhyana.course;

import com.adhyana.course.models.Announcement;
import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.services.AnnouncementService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/courses/announcements/*")
public class AnnouncementServlet extends HttpServlet {
    private final AnnouncementService announcementService = new AnnouncementService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Query params
                String idParam = request.getParameter("id");
                String courseIdParam = request.getParameter("courseId");
                String semesterIdParam = request.getParameter("semesterId");
                String title = request.getParameter("title");
                String postedByParam = request.getParameter("postedBy");

                Integer id = idParam != null ? Integer.parseInt(idParam) : null;
                String courseId = courseIdParam;
                String semesterId = semesterIdParam;
                Integer postedBy = postedByParam != null ? Integer.parseInt(postedByParam) : null;

                List<Announcement> announcements = announcementService.getAnnouncement(id, courseId, semesterId, title, postedBy);

                ApiResponse<List<Announcement>> apiResponse = new ApiResponse<>(true, "Announcements retrieved", announcements);
                sendJsonResponse(response, apiResponse);
            } else {
                int id = Integer.parseInt(pathInfo.substring(1));
                List<Announcement> announcements = announcementService.getAnnouncement(id, null, null, null, null);
                if (!announcements.isEmpty()) {
                    ApiResponse<Announcement> apiResponse = new ApiResponse<>(true, "Announcement retrieved", announcements.get(0));
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Announcement not found");
                }
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Announcement announcement = parseAnnouncementFromRequest(request);

            // Set current timestamp if not already set
            if (announcement.getCreatedAt() == null) {
                LocalDateTime now = LocalDateTime.now();
                announcement.setCreatedAt(now);
                announcement.setUpdatedAt(now);
            }

            Announcement created = announcementService.createAnnouncement(announcement);

            ApiResponse<Announcement> apiResponse = new ApiResponse<>(true, "Announcement created", created);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Announcement ID required in URL");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            Announcement announcement = parseAnnouncementFromRequest(request);
            announcement.setId(id); // Set ID from URL

            // Always update the updatedAt timestamp
            announcement.setUpdatedAt(LocalDateTime.now());

            boolean updated = announcementService.updateAnnouncement(announcement);

            if (updated) {
                ApiResponse<Void> apiResponse =
                        new ApiResponse<>(true, "Announcement updated successfully", null);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Announcement not found");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID or title required in path");
                return;
            }

            String identifier = pathInfo.substring(1); // strip '/'
            Object key;
            try {
                key = Integer.parseInt(identifier);
            } catch (NumberFormatException e) {
                key = identifier; // treat as title
            }

            announcementService.deleteAnnouncement(key);

            ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Announcement deleted", null);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private Announcement parseAnnouncementFromRequest(HttpServletRequest request) throws IOException {
        // Read and parse the JSON data
        String requestBody = readRequestBody(request);
        Map<String, String> jsonData = parseJsonToMap(requestBody);

        // Extract the fields
        int id = 0;
        if (jsonData.containsKey("id")) {
            try {
                id = Integer.parseInt(jsonData.get("id"));
            } catch (NumberFormatException e) {
                // Ignore parsing errors, default to 0
            }
        }

        String courseId = jsonData.getOrDefault("courseId", "");
        String semesterId = jsonData.getOrDefault("semesterId", null);
        String title = jsonData.getOrDefault("title", "");
        String content = jsonData.getOrDefault("content", "");

        Integer postedBy = null;
        if (jsonData.containsKey("postedBy")) {
            try {
                postedBy = Integer.parseInt(jsonData.get("postedBy"));
            } catch (NumberFormatException e) {
                // If postedBy is not a valid integer, keep it as null
            }
        }

        // Handle legacy field "author" for backward compatibility
        if (postedBy == null && jsonData.containsKey("author")) {
            try {
                postedBy = Integer.parseInt(jsonData.get("author"));
            } catch (NumberFormatException e) {
                // If author is not a valid integer, keep postedBy as null
            }
        }

        LocalDateTime now = LocalDateTime.now();

        return new Announcement(id, courseId, semesterId, title, content, postedBy, now, now);
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
        String[] fields = json.split(",");

        for (String field : fields) {
            String[] pair = field.trim().split(":", 2); // Split on first colon only
            if (pair.length == 2) {
                String key = pair[0].trim();
                String value = pair[1].trim();

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
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}