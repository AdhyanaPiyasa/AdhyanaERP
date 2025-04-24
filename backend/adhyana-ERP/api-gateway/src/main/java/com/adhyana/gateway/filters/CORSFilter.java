// api-gateway/src/main/java/com/adhyana/gateway/filters/CORSFilter.java
package com.adhyana.gateway.filters;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import javax.servlet.annotation.WebFilter;

@WebFilter("/*")
public class CORSFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Allow all origins for development - restrict this in production
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");

        // Allow common HTTP methods
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // Allow common headers
        httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        // Allow credentials
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");

        // Cache preflight response for 3600 seconds
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}