package com.adhyana.student;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/api/students/*")
public class StudentDispatcherServlet extends HttpServlet {

    private final StudentCoreServlet studentCoreServlet = new StudentCoreServlet();
    private final AttendanceServlet attendanceServlet = new AttendanceServlet();
    private final ScholarshipServlet scholarshipServlet = new ScholarshipServlet();
    private final StudentApplicationServlet StudentApplicationServlet = new StudentApplicationServlet(); // Add this line


    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found");
            return;
        }

        if (pathInfo.startsWith("/newapplications")) {
            // New applications functionality
            StudentApplicationServlet.service(request, response);
        }else if (pathInfo.startsWith("/core")) {
            // Core student functionality
            studentCoreServlet.service(request, response);
        } else if (pathInfo.startsWith("/attendance")) {
            // Attendance functionality
            attendanceServlet.service(request, response);
        } else if (pathInfo.startsWith("/scholarships") || pathInfo.startsWith("/applications")) {
            // Scholarship functionality
            scholarshipServlet.service(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Resource not found");
        }
    }
}