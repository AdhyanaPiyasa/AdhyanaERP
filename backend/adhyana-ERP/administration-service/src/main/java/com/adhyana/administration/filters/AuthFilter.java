package com.adhyana.administration.filters;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@WebFilter("/api/admin/*")
public class AuthFilter implements Filter {

    // Auth service URL (configurable properties would be better in production)
    private static final String AUTH_SERVICE_URL = "http://localhost:8082/auth/verify";
    // If going through API gateway
    // private static final String AUTH_SERVICE_URL = "http://localhost:8081/auth/verify";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("AUTH FILTER: Initializing authentication filter for /api/admin/*");
        System.out.println("AUTH FILTER: Using Auth Service at " + AUTH_SERVICE_URL);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        System.out.println("\n========== AUTH FILTER START ==========");
        System.out.println("AUTH FILTER: Processing " + httpRequest.getMethod() + " request to " + httpRequest.getRequestURI());

        String authHeader = httpRequest.getHeader("Authorization");
        System.out.println("AUTH FILTER: Authorization header " + (authHeader != null ? "present" : "missing"));

        // Skip auth for OPTIONS requests
        if (httpRequest.getMethod().equals("OPTIONS")) {
            System.out.println("AUTH FILTER: Skipping authentication for OPTIONS request");
            chain.doFilter(request, response);
            System.out.println("AUTH FILTER: OPTIONS request processed");
            System.out.println("========== AUTH FILTER END ==========");
            return;
        }

        // Verify auth header exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("AUTH FILTER: ERROR - No valid authorization token provided");
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No authorization token provided");
            System.out.println("AUTH FILTER: Sending 401 Unauthorized response");
            System.out.println("========== AUTH FILTER END ==========");
            return;
        }

        System.out.println("AUTH FILTER: Token format validation passed");

        // Verify token with Auth Service
        String role = verifyTokenWithAuthService(authHeader);

        if (role == null) {
            System.out.println("AUTH FILTER: ERROR - Token validation failed with Auth Service");
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            System.out.println("AUTH FILTER: Sending 401 Unauthorized response");
            System.out.println("========== AUTH FILTER END ==========");
            return;
        }

        System.out.println("AUTH FILTER: Token successfully validated with Auth Service");
        System.out.println("AUTH FILTER: User role from Auth Service: " + role);

        // For non-GET requests or sensitive endpoints, verify admin role
        boolean isGetMethod = httpRequest.getMethod().equals("GET");
        boolean isAdminEndpoint = isAdminOnlyEndpoint(httpRequest.getRequestURI());

        System.out.println("AUTH FILTER: Request method: " + httpRequest.getMethod());
        System.out.println("AUTH FILTER: Is admin-only endpoint: " + isAdminEndpoint);

        if (!isGetMethod || isAdminEndpoint) {
            System.out.println("AUTH FILTER: Admin role verification required");

            if (!"admin".equals(role)) {
                System.out.println("AUTH FILTER: ERROR - User lacks admin privileges (role: " + role + ")");
                httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Admin privileges required");
                System.out.println("AUTH FILTER: Sending 403 Forbidden response");
                System.out.println("========== AUTH FILTER END ==========");
                return;
            }
            System.out.println("AUTH FILTER: Admin role verification passed");
        } else {
            System.out.println("AUTH FILTER: Admin role verification skipped for GET request to non-admin endpoint");
        }

        // Log request details before passing to next filter/servlet
        logRequestDetails(httpRequest);

        System.out.println("AUTH FILTER: Authentication successful, proceeding to next filter/servlet");
        long startTime = System.currentTimeMillis();

        // Proceed with the request
        chain.doFilter(request, response);

        long endTime = System.currentTimeMillis();
        System.out.println("AUTH FILTER: Request processing completed in " + (endTime - startTime) + "ms");
        System.out.println("AUTH FILTER: Response status: " + httpResponse.getStatus());
        System.out.println("========== AUTH FILTER END ==========");
    }

    private boolean isAdminOnlyEndpoint(String uri) {
        boolean isAdminEndpoint = uri.contains("/api/admin/staff") ||
                uri.contains("/api/admin/payroll") ||
                uri.contains("/api/admin/batch");

        System.out.println("AUTH FILTER: Checking if " + uri + " is admin-only endpoint: " + isAdminEndpoint);
        return isAdminEndpoint;
    }

    private String verifyTokenWithAuthService(String authHeader) {
        System.out.println("AUTH FILTER: Verifying token with Auth Service at " + AUTH_SERVICE_URL);
        HttpURLConnection connection = null;

        try {
            // Create connection to auth service
            URL url = new URL(AUTH_SERVICE_URL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Authorization", authHeader);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            System.out.println("AUTH FILTER: Sending request to Auth Service");
            int responseCode = connection.getResponseCode();
            System.out.println("AUTH FILTER: Auth Service response code: " + responseCode);

            if (responseCode == 200) {
                // Read the response from the auth service
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuilder content = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close();

                String responseBody = content.toString();
                System.out.println("AUTH FILTER: Auth Service response: " + responseBody);

                // Parse the JSON response manually to extract the role
                // Looking for something like: {"success":true,"message":"Token valid","data":{"token":"...","role":"admin"}}
                String role = extractRoleFromJson(responseBody);
                System.out.println("AUTH FILTER: Extracted role from response: " + role);
                return role;
            } else {
                System.out.println("AUTH FILTER: Token validation failed with status: " + responseCode);
                // If possible, read error message
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()))) {
                    StringBuilder errorContent = new StringBuilder();
                    String errorLine;
                    while ((errorLine = reader.readLine()) != null) {
                        errorContent.append(errorLine);
                    }
                    System.out.println("AUTH FILTER: Auth Service error: " + errorContent.toString());
                } catch (Exception e) {
                    System.out.println("AUTH FILTER: Could not read error details: " + e.getMessage());
                }
                return null;
            }
        } catch (Exception e) {
            System.out.println("AUTH FILTER: ERROR - Exception during Auth Service communication: " + e.getMessage());
            e.printStackTrace();
            return null;
        } finally {
            if (connection != null) {
                connection.disconnect();
                System.out.println("AUTH FILTER: Auth Service connection closed");
            }
        }
    }

    private String extractRoleFromJson(String json) {
        try {
            // Simple JSON extraction - find "role":"value" pattern
            // In production, use a proper JSON parser library
            System.out.println("AUTH FILTER: Parsing JSON response for role");

            int roleIndex = json.indexOf("\"role\"");
            if (roleIndex == -1) {
                System.out.println("AUTH FILTER: ERROR - Role field not found in JSON response");
                return null;
            }

            // Find the role value
            int colonIndex = json.indexOf(":", roleIndex);
            int startQuoteIndex = json.indexOf("\"", colonIndex);
            int endQuoteIndex = json.indexOf("\"", startQuoteIndex + 1);

            if (colonIndex == -1 || startQuoteIndex == -1 || endQuoteIndex == -1) {
                System.out.println("AUTH FILTER: ERROR - Invalid JSON format for role field");
                return null;
            }

            String role = json.substring(startQuoteIndex + 1, endQuoteIndex);
            System.out.println("AUTH FILTER: Successfully parsed role: " + role);
            return role;
        } catch (Exception e) {
            System.out.println("AUTH FILTER: ERROR - Exception while parsing JSON: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private void logRequestDetails(HttpServletRequest request) {
        System.out.println("AUTH FILTER: Detailed request information:");
        System.out.println("  Remote Address: " + request.getRemoteAddr());
        System.out.println("  Request URL: " + request.getRequestURL() +
                (request.getQueryString() != null ? "?" + request.getQueryString() : ""));
        System.out.println("  Content Type: " + request.getContentType());

        // Log specific headers that might be relevant for auth/debugging
        System.out.println("  User-Agent: " + request.getHeader("User-Agent"));
        System.out.println("  Referer: " + request.getHeader("Referer"));
        System.out.println("  X-Forwarded-For: " + request.getHeader("X-Forwarded-For"));
    }

    @Override
    public void destroy() {
        System.out.println("AUTH FILTER: Destroying authentication filter");
    }
}