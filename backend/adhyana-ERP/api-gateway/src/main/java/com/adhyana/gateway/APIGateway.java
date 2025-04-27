// api-gateway/src/main/java/com/adhyana/gateway/APIGateway.java
package com.adhyana.gateway;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.logging.Logger;
import java.util.logging.Level;

@WebServlet("/api/*")
public class APIGateway extends HttpServlet {
    private static final String AUTH_SERVICE = "http://localhost:8082";
    private static final String STUDENT_SERVICE = "http://localhost:8083";
    private static final String COURSE_SERVICE = "http://localhost:8084";
    private static final String EXAM_SERVICE = "http://localhost:8085";
    private static final String ADMINISTRATION_SERVICE = "http://localhost:8086";
    private static final String DDBMS_SERVICE = "http://localhost:8087";
    private static final String HOSTEL_SERVICE = "http://localhost:8088";
    private static final String SCHOLARSHIP_SERVICE = "http://localhost:8089";
    private static final String CALENDAR_SERVICE = "http://localhost:8090";
    private static final String ANNOUNCEMENT_SERVICE = "http://localhost:8091";

    // Create a logger for this class
    private static final Logger LOGGER = Logger.getLogger(APIGateway.class.getName());

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getPathInfo();
        String method = request.getMethod();
        String ipAddress = request.getRemoteAddr();

        LOGGER.info(String.format("Received %s request for %s from %s", method, path, ipAddress));

        String targetUrl;

        // Check authentication for all routes except auth
        if (!path.startsWith("/auth/")) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                LOGGER.warning(String.format("Unauthorized access attempt to %s from %s - No valid token", path, ipAddress));
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No valid token provided");
                return;
            }
            LOGGER.fine("Authentication token validated for request to " + path);
        }

        // Route to appropriate service
        if (path.startsWith("/auth/")) {
            targetUrl = AUTH_SERVICE + path;
            LOGGER.info("Routing to Auth Service: " + targetUrl);
        } else if (path.startsWith("/api/admin")) {
            targetUrl = ADMINISTRATION_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Administration Service: " + targetUrl);
        } else if (path.startsWith("/api/students")) {
            targetUrl = STUDENT_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Student Service: " + targetUrl);
        } else if (path.startsWith("/api/courses")) {
            targetUrl = COURSE_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Course Service: " + targetUrl);
        } else if (path.startsWith("/api/exams")) {
            targetUrl = EXAM_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Exam Service: " + targetUrl);
        } else if (path.startsWith("/api/ddbms")) {
            targetUrl = DDBMS_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to DDBMS Service: " + targetUrl);
        } else if (path.startsWith("/api/hostel")) {
            targetUrl = HOSTEL_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Hostel Service: " + targetUrl);
        } else if (path.startsWith("/api/scholarship")) {
            targetUrl = SCHOLARSHIP_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Scholarship Service: " + targetUrl);
        } else if (path.startsWith("/api/calendar")) {
            targetUrl = CALENDAR_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Calendar Service: " + targetUrl);
        } else if (path.startsWith("/api/attendance")) {
            targetUrl = ANNOUNCEMENT_SERVICE + "/api" + path.substring(4);
            LOGGER.info("Routing to Announcement Service: " + targetUrl);
        } else {
            LOGGER.warning(String.format("Invalid service path requested: %s from %s", path, ipAddress));
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Invalid service path");
            return;
        }

        // Forward the request
        try {
            forwardRequest(request, response, targetUrl);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error forwarding request to " + targetUrl, e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error forwarding request: " + e.getMessage());
        }
    }

    private void forwardRequest(HttpServletRequest request, HttpServletResponse response, String targetUrl)
            throws IOException {
        long startTime = System.currentTimeMillis();

        URL url = new URL(targetUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(request.getMethod());

        LOGGER.fine("Connecting to: " + targetUrl + " with method: " + request.getMethod());

        // Copy headers
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            String headerValue = request.getHeader(headerName);
            conn.setRequestProperty(headerName, headerValue);
        });

        // Copy request body for POST/PUT
        if ("POST".equals(request.getMethod()) || "PUT".equals(request.getMethod())) {
            conn.setDoOutput(true);
            LOGGER.fine("Forwarding request body for " + request.getMethod() + " request");
            try (BufferedReader reader = request.getReader();
                 OutputStream os = conn.getOutputStream()) {
                char[] charBuffer = new char[128];
                int bytesRead;
                while ((bytesRead = reader.read(charBuffer)) != -1) {
                    os.write(new String(charBuffer, 0, bytesRead).getBytes());
                }
            }
        }

        // Get the response
        int responseCode = conn.getResponseCode();
        long endTime = System.currentTimeMillis();
        long responseTime = endTime - startTime;

        LOGGER.info(String.format("Response from %s: %d - took %d ms", targetUrl, responseCode, responseTime));

        // Copy response headers back to client
        conn.getHeaderFields().forEach((key, values) -> {
            if (key != null) { // skip status line
                values.forEach(value -> response.addHeader(key, value));
            }
        });

        // Copy response
        response.setStatus(responseCode);
        try (InputStream is = responseCode >= 400 ? conn.getErrorStream() : conn.getInputStream();
             BufferedReader in = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = in.readLine()) != null) {
                response.getWriter().write(line);
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error processing response from " + targetUrl, e);
            throw e;
        }

        if (responseCode >= 400) {
            LOGGER.warning(String.format("Error response from %s: %d for request %s %s",
                    targetUrl, responseCode, request.getMethod(), request.getPathInfo()));
        }
    }

    @Override
    public void init() throws ServletException {
        LOGGER.info("API Gateway initialized. Services registered: " +
                "AUTH=" + AUTH_SERVICE + ", " +
                "ADMINISTRATION=" + ADMINISTRATION_SERVICE + ", " +
                "STUDENT=" + STUDENT_SERVICE + ", " +
                "COURSE=" + COURSE_SERVICE + ", " +
                "EXAM=" + EXAM_SERVICE + ", " +
                "DDBMS=" + DDBMS_SERVICE + ", " +
                "HOSTEL=" + HOSTEL_SERVICE + ", " +
                "SCHOLARSHIP=" + SCHOLARSHIP_SERVICE + ", " +
                "CALENDAR=" + CALENDAR_SERVICE + ", " +
                "ANNOUNCEMENT=" + ANNOUNCEMENT_SERVICE);
        super.init();
    }

    @Override
    public void destroy() {
        LOGGER.info("API Gateway shutting down");
        super.destroy();
    }
}