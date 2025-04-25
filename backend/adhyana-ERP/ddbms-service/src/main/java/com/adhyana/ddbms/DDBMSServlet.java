package com.adhyana.ddbms;

import com.adhyana.ddbms.controllers.SyncController;
import com.adhyana.ddbms.models.ApiResponse;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Main servlet for the DDBMS service that handles all incoming HTTP requests
 */
//@WebServlet("/api/*")
public class DDBMSServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(DDBMSServlet.class.getName());
    private final SyncController syncController = new SyncController();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        LOGGER.info("Received GET request to " + pathInfo);

        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("/status")) {
            // Root path or status check
            syncController.handleStatusRequest(request, response);
        } else {
            // Invalid path
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Endpoint not found", null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        LOGGER.info("Received POST request to " + pathInfo);

        if ("/sync".equals(pathInfo)) {
            // Handle data synchronization
            syncController.handleUpdateRequest(request, response);
        } else if ("/verify".equals(pathInfo)) {
            // Verify API key
            syncController.handleVerifyKey(request, response);
        } else {
            // Invalid path
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Endpoint not found", null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    @Override
    public void init() throws ServletException {
        LOGGER.info("Initializing DDBMS Servlet");
        super.init();
    }

    @Override
    public void destroy() {
        LOGGER.info("Destroying DDBMS Servlet");
        super.destroy();
    }
}