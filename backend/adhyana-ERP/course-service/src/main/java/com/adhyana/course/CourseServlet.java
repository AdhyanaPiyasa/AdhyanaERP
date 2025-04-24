package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Course;
import com.adhyana.course.services.CourseService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@WebServlet("/api/courses/courseCore/*")
public class CourseServlet extends HttpServlet {
    private final CourseService courseService = new CourseService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // Debug the full request details
            System.out.println("=============== REQUEST DEBUG ===============");
            System.out.println("Request URL: " + request.getRequestURL());
            System.out.println("Path Info: " + request.getPathInfo());

            String pathInfo = request.getPathInfo();

            // No pathInfo means get all courses
            if (pathInfo == null || pathInfo.equals("/")) {
                List<Course> courses = courseService.getAllCourses();
                ApiResponse<List<Course>> apiResponse = new ApiResponse<>(true, "All courses retrieved", courses);
                sendJsonResponse(response, apiResponse);
                return;
            }

            // Remove leading slash
            if (pathInfo.startsWith("/")) {
                pathInfo = pathInfo.substring(1);
            }

            // First try direct ID lookup (for backwards compatibility)
            try {
                int id = Integer.parseInt(pathInfo);
                Course course = courseService.getCourseById(id);
                if (course != null) {
                    ApiResponse<Course> apiResponse = new ApiResponse<>(true,
                            "Course retrieved by ID: " + id, course);
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Course not found with ID: " + id);
                }
                return;
            } catch (NumberFormatException e) {
                // Not a direct ID lookup, continue with field-based lookup
            }

            // Split the path into field and value parts
            String[] pathParts = pathInfo.split("/", 2);

            if (pathParts.length < 2) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                        "Invalid URL format. Use /{fieldName}/{value} (e.g., /name/Data Structures)");
                return;
            }

            String fieldName = pathParts[0].toLowerCase();
            String fieldValue = URLDecoder.decode(pathParts[1], StandardCharsets.UTF_8.name());

            System.out.println("Searching courses with " + fieldName + " = " + fieldValue);

            try {
                List<Course> courses = courseService.searchCoursesByField(fieldName, fieldValue);

                if (!courses.isEmpty()) {
                    ApiResponse<List<Course>> apiResponse = new ApiResponse<>(true,
                            "Courses retrieved by " + fieldName + ": " + fieldValue, courses);
                    sendJsonResponse(response, apiResponse);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND,
                            "No courses found with " + fieldName + " = " + fieldValue);
                }
            } catch (IllegalArgumentException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("Error in doGet: " + e.getMessage());
            e.printStackTrace();
            handleError(response, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Course course = parseCourseFromRequest(request);
            Course createdCourse = courseService.createCourse(course);

            ApiResponse<Course> apiResponse = new ApiResponse<>(true, "Course created successfully", createdCourse);
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
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Course ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            Course course = parseCourseFromRequest(request);
            course.setId(id);

            boolean updated = courseService.updateCourse(course);
            if (updated) {
                ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Course updated successfully", null);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Course not found or update failed");
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
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Course ID required");
                return;
            }

            int id = Integer.parseInt(pathInfo.substring(1));
            boolean deleted = courseService.deleteCourse(id);

            if (deleted) {
                ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Course deleted successfully", null);
                sendJsonResponse(response, apiResponse);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Course not found or deletion failed");
            }
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private Course parseCourseFromRequest(HttpServletRequest request) throws IOException {
        String json = readRequestBody(request);
        Map<String, String> courseData = parseJsonToMap(json);

        System.out.println("Parsed course data from request:");
        for (Map.Entry<String, String> entry : courseData.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue());
        }

        int code = Integer.parseInt(courseData.getOrDefault("code", "0"));
        String name = courseData.getOrDefault("name", "");
        int year = Integer.parseInt(courseData.getOrDefault("year", "0"));
        int semester = Integer.parseInt(courseData.getOrDefault("semester", "0"));
        int credits = Integer.parseInt(courseData.getOrDefault("credits", "0"));
        int duration = Integer.parseInt(courseData.getOrDefault("duration", "0"));

        // Note: We don't parse avgRating from request as it's calculated by triggers
        // The order matches the Course constructor with avgRating as null
        // id, code, name, year, semester, credits, duration, avgRating
        return new Course(0, code, name, year, semester, credits, duration, null);
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

        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2); // Split only on the first ":"
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
        System.err.println("Error processing request: " + e.getMessage());
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        sendJsonResponse(response, apiResponse);
    }
}