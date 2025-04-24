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
import java.util.List;

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
                String title = request.getParameter("title");
                String author = request.getParameter("author");

                Integer id = idParam != null ? Integer.parseInt(idParam) : null;
                Integer courseId = courseIdParam != null ? Integer.parseInt(courseIdParam) : null;

                List<Announcement> announcements = announcementService.getAnnouncement(id, courseId, title, author);

                ApiResponse<List<Announcement>> apiResponse = new ApiResponse<>(true, "Announcements retrieved", announcements);
                sendJsonResponse(response, apiResponse);
            } else {
                int id = Integer.parseInt(pathInfo.substring(1));
                List<Announcement> announcements = announcementService.getAnnouncement(id, null, null, null);
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
            announcement.setCreatedAt(LocalDateTime.now());
            Announcement created = announcementService.createAnnouncement(announcement);

            ApiResponse<Announcement> apiResponse = new ApiResponse<>(true, "Announcement created", created);
            sendJsonResponse(response, apiResponse);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Announcement ID required in URL");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            Announcement announcement = parseAnnouncementFromRequest(request);
            announcement.setId(id); //  Set ID from URL

            announcement.setCreatedAt(LocalDateTime.now()); // Optional: reset time if needed
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
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Very simple manual JSON parsing
        String json = sb.toString().replaceAll("[{}\"]", "");
        String[] fields = json.split(",");

        int id = 0;
        int courseId = 0;
        String title = null;
        String content = null;
        String author = null;

        for (String field : fields) {
            String[] pair = field.trim().split(":");
            if (pair.length == 2) {
                String key = pair[0].trim();
                String value = pair[1].trim();

                switch (key) {
                    case "id":
                        id = Integer.parseInt(value);
                        break;
                    case "courseId":
                        courseId = Integer.parseInt(value);
                        break;
                    case "title":
                        title = value;
                        break;
                    case "content":
                        content = value;
                        break;
                    case "author":
                        author = value;
                        break;
                }
            }
        }

        return new Announcement(id, courseId, title, content, author, LocalDateTime.now());
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
