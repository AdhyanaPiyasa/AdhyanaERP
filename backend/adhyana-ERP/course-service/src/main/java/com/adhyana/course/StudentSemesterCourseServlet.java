package com.adhyana.course;

import com.adhyana.course.models.ApiResponse;
import com.adhyana.course.models.Course;
import com.adhyana.course.models.Semester;
import com.adhyana.course.models.StudentSemesterCourse;
import com.adhyana.course.services.StudentSemesterCourseService;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Servlet to handle API requests for retrieving student course details based on enrollments.
 * Mapped to /api/courses/studentCourses/*
 *
 * Supported URL patterns:
 * GET /api/courses/studentCourses/student/{studentIndex} - Get all course details for a student
 * GET /api/courses/studentCourses/student/{studentIndex}/semester/{semesterId} - Get courses for a specific student in a semester
 * GET /api/courses/studentCourses/student/{studentIndex}/course/{courseId}/semesters - Get semester details for a student and course
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
                    "Invalid request. Use format: /student/{studentIndex}");
            return;
        }

        // Remove leading slash and split
        String[] parts = pathInfo.substring(1).split("/");

        // Check for path: /student/{index}/course/{courseId}/semesters - Get all semesters for a student in a course
        if (parts.length == 5 && parts[0].equalsIgnoreCase("student") &&
                parts[2].equalsIgnoreCase("course") && parts[4].equalsIgnoreCase("semesters")) {
            try {
                int studentIndex = Integer.parseInt(parts[1]);
                String courseId = parts[3];

                System.out.println("Fetching semester details for studentIndex: " + studentIndex +
                        ", courseId: " + courseId);

                // Call the new service method
                List<Semester> semesters = enrollmentService.getSemesterDetailsForStudentCourse(studentIndex, courseId);

                if (semesters != null && !semesters.isEmpty()) {
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "Semester details retrieved successfully", semesters));
                } else {
                    // Return success but with empty data if no semesters found
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "No semester details found for the student and course.", semesters));
                }
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format.");
            } catch (Exception e) {
                handleError(response, e);
            }
            return;
        }

        // Check for simplified path: /student/{studentIndex} - Get all courses for a student
        if (parts.length == 2 && parts[0].equalsIgnoreCase("student")) {
            try {
                int studentIndex = Integer.parseInt(parts[1]);

                System.out.println("Fetching all courses for studentIndex: " + studentIndex);

                // Call the service method to get all Course details for the student
                List<Course> courses = enrollmentService.getCoursesForStudent(studentIndex);

                if (courses != null && !courses.isEmpty()) {
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "Courses retrieved successfully", courses));
                } else {
                    // Return success but with empty data if no courses found
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "No courses found for the student.", courses)); // Send empty list
                }
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format.");
            } catch (Exception e) {
                handleError(response, e);
            }
            return;
        }

        // Handle legacy path with semester: /student/{index}/semester/{id} - Kept for backward compatibility
        if (parts.length == 4 && parts[0].equalsIgnoreCase("student") && parts[2].equalsIgnoreCase("semester")) {
            try {
                int studentIndex = Integer.parseInt(parts[1]);
                String semesterId = parts[3];

                System.out.println("Fetching courses for studentIndex: " + studentIndex +
                        ", semesterId: " + semesterId); // Debugging

                // Call the original service method for backward compatibility
                List<Course> courses = enrollmentService.getCoursesForStudentInSemester(studentIndex, semesterId);

                if (courses != null && !courses.isEmpty()) {
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "Courses retrieved successfully", courses));
                } else {
                    // Return success but with empty data if no courses found
                    sendJsonResponse(response, new ApiResponse<>(true,
                            "No courses found for the student in the specified semester.", courses));
                }
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid student index format.");
            } catch (Exception e) {
                handleError(response, e);
            }
            return;
        }

        // If none of the paths match, return error
        response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                "Invalid request format. Use: /student/{studentIndex}, " +
                        "/student/{studentIndex}/semester/{semesterId}, or " +
                        "/student/{studentIndex}/course/{courseId}/semesters");
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