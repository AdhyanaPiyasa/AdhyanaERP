// student-service/src/main/java/com/adhyana/student/filters/AuthFilter.java
package com.adhyana.exam.filters;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authHeader = httpRequest.getHeader("Authorization");

        // Skip auth for OPTIONS requests
        if (httpRequest.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        // Verify auth header exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No authorization token provided");
            return;
        }

//        // For non-GET requests, verify admin role
//        if (!httpRequest.getMethod().equals("GET")) {
//            String role = verifyAdminRole(authHeader);
//            if (!"admin".equals(role)) {
//                httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Admin privileges required");
//                return;
//            }
//        }

        chain.doFilter(request, response);
    }

    private String verifyAdminRole(String authHeader) {
        // In a real implementation, verify the token with the auth service
        // For now, just extract the role from the token
        return authHeader.split("\\.")[1];
    }

    @Override
    public void destroy() {}
}