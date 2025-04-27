package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Course;
import com.adhyana.course.models.StudentSemesterCourse;
import com.adhyana.course.services.StudentSemesterCourseService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;

/**
 * Servlet to handle API requests for retrieving student course details based on enrollments.
 * Mapped to /api/courses/studentCourses/*
 *
 * Supported URL patterns:
 * GET /api/courses/studentCourses/student/{studentIndex}/semester/{semesterId} - Get course details for a student in a semester
 * GET /api/courses/studentCourses/enrollments/student/{studentIndex}/semester/{semesterId} - Get enrollment records for a student in a semester
 *
 * Assumes student_semester_courses table is populated externally. No POST/DELETE support here.
 */
@WebServlet("/api/courses/studentCourses/*")
public class StudentSemesterCourseServlet extends HttpServlet {
    private final StudentSemesterCourseService enrollmentService = new StudentSemesterCourseService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        System.out.println("GET Request PathInfo: " + pathInfo); // Debugging

        if (pathInfo == null || pathInfo.equals("/")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid request. Use format: /student/{studentIndex}/semester/{semesterId} or " +
                            "/enrollments/student/{studentIndex}/semester/{semesterId}");
            return;
        }

        // Remove leading slash and split
        String[] parts = pathInfo.substring(1).split("/");

        // Handle enrollments endpoint specifically
        if (parts.length > 0 && parts[0].equalsIgnoreCase("enrollments")) {
            handleEnrollmentsRequest(parts, response);
            return;
        }

        // Check for the correct structure: student, {index}, semester, {id}
        if (parts.length == 4 && parts[0].equalsIgnoreCase("student") && parts[2].equalsIgnoreCase("semester")) {
            try {
                int studentIndex = Integer.parseInt(parts[1]);
                String semesterId = URLDecoder.decode(parts[3], StandardCharsets.UTF_8.name());

                System.out.println("Fetching courses for studentIndex: " + studentIndex +
                        ", semesterId: " + semesterId); // Debugging

                // Call the service method to get Course details
                List<Course> courses = enrollmentService.getCoursesForStudentInSemester(studentIndex, semesterId);

                if (courses != null && !courses.isEmpty()) {
                    // Use the existing ApiResponse that handles List<Course>
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "Courses retrieved successfully", courses));
                } else {
                    // Return success but with empty data if no courses found for that student/semester combination
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "No courses found for the student in the specified semester.", courses)); // Send empty list
                }

            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format.");
            } catch (Exception e) {
                handleError(response, e);
            }
        } else {
            // Incorrect format
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid request format. Use: /student/{studentIndex}/semester/{semesterId} or " +
                            "/enrollments/student/{studentIndex}/semester/{semesterId}");
        }
    }

    /**
     * Handles requests for enrollment records directly
     *
     * @param parts The path parts from the URL
     * @param response The HTTP response object
     * @throws IOException If there is an error writing to the response
     */
    private void handleEnrollmentsRequest(String[] parts, HttpServletResponse response) throws IOException {
        // Expected format: enrollments/student/{studentIndex}/semester/{semesterId}
        if (parts.length == 5 && parts[1].equalsIgnoreCase("student") && parts[3].equalsIgnoreCase("semester")) {
            try {
                int studentIndex = Integer.parseInt(parts[2]);
                String semesterId = URLDecoder.decode(parts[4], StandardCharsets.UTF_8.name());

                System.out.println("Fetching enrollments for studentIndex: " + studentIndex +
                        ", semesterId: " + semesterId);

                List<StudentSemesterCourse> enrollments =
                        enrollmentService.getEnrollmentsByStudentAndSemester(studentIndex, semesterId);

                if (enrollments != null && !enrollments.isEmpty()) {
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "Enrollments retrieved successfully", enrollments));
                } else {
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "No enrollments found for the student in the specified semester.", enrollments));
                }
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format.");
            } catch (Exception e) {
                handleError(response, e);
            }
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid enrollment request format. Use: /enrollments/student/{studentIndex}/semester/{semesterId}");
        }
    }

    // POST method is not supported as enrollments are handled externally
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                "POST method is not supported for this resource. Enrollments are managed automatically by the system.");
    }

    // PUT method is not supported
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                "PUT method is not supported for this resource. Enrollments are managed automatically by the system.");
    }

    // DELETE method is not supported as unenrollments are handled externally
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                "DELETE method is not supported for this resource. Enrollments are managed automatically by the system.");
    }

    // Helper method to read request body if needed in the future
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

    // Helper method to parse JSON to Map if needed in the future
    private Map<String, String> parseJsonToMap(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.isEmpty() || !json.startsWith("{") || !json.endsWith("}")) {
            System.err.println("Warning: Invalid or empty JSON received: " + json);
            return map;
        }
        json = json.substring(1, json.length() - 1).trim();
        if (json.isEmpty()) {
            return map;
        }
        String[] pairs = json.split(",");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2);
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replaceAll("\"", "");
                String value = keyValue[1].trim();
                if (value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                } else if (value.equalsIgnoreCase("null")) {
                    value = null;
                }
                map.put(key, value);
            } else {
                System.err.println("Warning: Malformed JSON pair skipped: " + pair);
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
        System.err.println("Error processing student course request: " + e.getMessage());
        e.printStackTrace();
        String clientMessage = "An internal server error occurred.";
        if (e instanceof IllegalArgumentException) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            clientMessage = "Bad Request: " + e.getMessage();
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        ApiResponse<Void> apiResponse = new ApiResponse<>(false, clientMessage, null);
        sendJsonResponse(response, apiResponse);
    }
}