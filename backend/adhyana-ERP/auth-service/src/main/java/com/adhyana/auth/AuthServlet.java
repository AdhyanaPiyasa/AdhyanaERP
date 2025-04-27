// auth-service/src/main/java/com/adhyana/auth/AuthServlet.java
package com.adhyana.auth;

import com.adhyana.auth.models.ApiResponse;
import com.adhyana.auth.models.TokenResponse;
import com.adhyana.auth.models.User;
import com.adhyana.auth.models.UserProfileRequest; // Import UserProfileRequest
import com.adhyana.auth.services.AuthService;
import com.adhyana.auth.utils.TokenManager;
import com.google.gson.Gson; // Import Gson
import com.google.gson.JsonSyntaxException; // Import specific exception

import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.PrintWriter; // Import PrintWriter for writing JSON response
import java.nio.charset.StandardCharsets;

@WebServlet("/auth/*")
public class AuthServlet extends HttpServlet {
    private final AuthService authService = new AuthService();
    private final Gson gson = new Gson(); // Instantiate Gson

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("\n========== AUTH SERVICE - POST REQUEST ==========");
        System.out.println("AUTH SERVICE: Processing POST request to " + request.getRequestURI());
        logRequestInfo(request);

        String path = request.getPathInfo();
        System.out.println("AUTH SERVICE: Path info: " + path);

        // Set content type for all responses early
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if ("/login".equals(path)) {
            System.out.println("AUTH SERVICE: Handling login request");
            handleLogin(request, response);
        } else if ("/logout".equals(path)) {
            System.out.println("AUTH SERVICE: Handling logout request");
            handleLogout(request, response);
        } else if ("/profiles".equals(path)) {
            System.out.println("AUTH SERVICE: Handling user profile creation request");
            handleProfileCreation(request, response);
        } else {
            System.out.println("AUTH SERVICE: ERROR - Invalid path: " + path);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            writeJsonResponse(response, new ApiResponse<>(false, "Endpoint not found", null));
        }

        System.out.println("========== AUTH SERVICE - POST REQUEST COMPLETED ==========");
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Read JSON body using Gson
            LoginRequest loginRequest = gson.fromJson(request.getReader(), LoginRequest.class);
            System.out.println("AUTH SERVICE: Received login request for user: " + loginRequest.getUsername());

            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                System.out.println("AUTH SERVICE: ERROR - Missing username or password");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJsonResponse(response, new ApiResponse<>(false, "Missing username or password", null));
                return;
            }

            System.out.println("AUTH SERVICE: Attempting to authenticate user: " + loginRequest.getUsername());
            User user = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            if (user != null) {
                System.out.println("AUTH SERVICE: Authentication successful for user: " + user.getUsername() +
                        " with role: " + user.getRole() + " and external ID: " + user.getUserId()); // Log userId
                String token = TokenManager.generateToken(user);
                System.out.println("AUTH SERVICE: Generated token: " + (token.length() > 10 ? token.substring(0, 10) + "..." : token));
                response.setHeader("Authorization", "Bearer " + token);

                // Include userId in the TokenResponse
                TokenResponse tokenData = new TokenResponse(token, user.getRole(), user.getUserId());
                ApiResponse<TokenResponse> apiResponse = new ApiResponse<>(true, "Login successful", tokenData);
                System.out.println("AUTH SERVICE: Sending successful login response");
                writeJsonResponse(response, apiResponse);
            } else {
                System.out.println("AUTH SERVICE: Authentication failed for user: " + loginRequest.getUsername());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                writeJsonResponse(response, new ApiResponse<>(false, "Invalid credentials", null));
            }
        } catch (JsonSyntaxException e) {
            System.out.println("AUTH SERVICE: ERROR - Invalid JSON format: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJsonResponse(response, new ApiResponse<>(false, "Invalid JSON format", null));
        } catch (Exception e) {
            System.out.println("AUTH SERVICE: ERROR - Exception during login process: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            writeJsonResponse(response, new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    /**
     * Handle user profile creation requests from other services
     */
    private void handleProfileCreation(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Read JSON body using Gson
            UserProfileRequest profileRequest = gson.fromJson(request.getReader(), UserProfileRequest.class);
            System.out.println("AUTH SERVICE: Received profile creation request for username: " + profileRequest.getUsername());

            // Validate required fields (handled by UserProfileRequest potentially)
            if (profileRequest.getUsername() == null || profileRequest.getPassword() == null || profileRequest.getRole() == null) {
                System.out.println("AUTH SERVICE: ERROR - Missing required fields");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJsonResponse(response, new ApiResponse<>(false, "Missing required fields", null));
                return;
            }

            // Create user profile
            System.out.println("AUTH SERVICE: Creating user profile for username: " + profileRequest.getUsername() +
                    ", role: " + profileRequest.getRole() + ", userId: " + profileRequest.getUserId());
            User userToCreate = profileRequest.toUser(); // Use the conversion method
            User createdUser = authService.createUserProfile(userToCreate);

            // Send success response
            // Exclude password from the response user object for security
            createdUser.setPassword(null);
            ApiResponse<User> apiResponse = new ApiResponse<>(true, "User profile created successfully", createdUser);
            writeJsonResponse(response, apiResponse);
            System.out.println("AUTH SERVICE: User profile created successfully with ID: " + createdUser.getId());

        } catch (JsonSyntaxException e) {
            System.out.println("AUTH SERVICE: ERROR - Invalid JSON format: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJsonResponse(response, new ApiResponse<>(false, "Invalid JSON format", null));
        } catch (IllegalArgumentException e) {
            System.out.println("AUTH SERVICE: ERROR - Invalid input: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJsonResponse(response, new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.out.println("AUTH SERVICE: ERROR - Exception during profile creation: " + e.getMessage());
            // Check for specific exceptions like duplicate username
            if (e.getMessage() != null && e.getMessage().contains("Username already exists")) {
                response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                writeJsonResponse(response, new ApiResponse<>(false, e.getMessage(), null));
            } else {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                writeJsonResponse(response, new ApiResponse<>(false, "Error creating profile: " + e.getMessage(), null));
            }
        }
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("\n========== AUTH SERVICE - GET REQUEST ==========");
        System.out.println("AUTH SERVICE: Processing GET request to " + request.getRequestURI());
        logRequestInfo(request);

        String path = request.getPathInfo();
        System.out.println("AUTH SERVICE: Path info: " + path);

        // Set content type for all responses early
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if ("/verify".equals(path)) {
            System.out.println("AUTH SERVICE: Handling token verification request");
            handleTokenVerification(request, response);
        } else {
            System.out.println("AUTH SERVICE: ERROR - Invalid path: " + path);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            writeJsonResponse(response, new ApiResponse<>(false, "Endpoint not found", null));
        }

        System.out.println("========== AUTH SERVICE - GET REQUEST COMPLETED ==========");
    }

    private void handleTokenVerification(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("AUTH SERVICE: Token verification - Authorization header: " +
                (authHeader != null ? (authHeader.length() > 15 ? authHeader.substring(0, 15) + "..." : authHeader) : "null"));

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("AUTH SERVICE: Validating token: " + (token.length() > 10 ? token.substring(0, 10) + "..." : token));

            if (TokenManager.validateToken(token)) {
                // Need user details (role, userId) from token or re-fetch if needed
                // Simple token implementation might not store userId, adjust if necessary
                String role = TokenManager.getRoleFromToken(token);
                // Assuming we need to fetch User to get userId for the response.
                // This might be inefficient; consider adding userId to the token payload if possible.
                // For now, we'll return null for userId in verify response as per original logic.
                // If userId WAS added to the token in TokenManager, extract it here.
                String userId = null; // Placeholder - Extract if available in token
                System.out.println("AUTH SERVICE: Token is valid, role extracted: " + role);

                ApiResponse<TokenResponse> apiResponse = new ApiResponse<>(
                        true,
                        "Token valid",
                        new TokenResponse(token, role, userId) // Pass userId (null or extracted)
                );
                System.out.println("AUTH SERVICE: Sending successful token validation response");
                writeJsonResponse(response, apiResponse);
            } else {
                System.out.println("AUTH SERVICE: Invalid token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                writeJsonResponse(response, new ApiResponse<>(false, "Invalid token", null));
            }
        } else {
            System.out.println("AUTH SERVICE: No token provided or invalid format");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            writeJsonResponse(response, new ApiResponse<>(false, "No token provided", null));
        }
    }


    private void handleLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("AUTH SERVICE: Processing logout request");
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Logged out successfully", null);
        System.out.println("AUTH SERVICE: Logout successful");
        writeJsonResponse(response, apiResponse);
    }

    // Helper method to write JSON response using Gson
    private void writeJsonResponse(HttpServletResponse response, Object data) throws IOException {
        String jsonResponse = gson.toJson(data);
        byte[] jsonBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);

        // Set headers BEFORE writing response body
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setContentLength(jsonBytes.length); // Set Content-Length header

        // Write the bytes directly to the output stream
        try (ServletOutputStream out = response.getOutputStream()) {
            out.write(jsonBytes);
            out.flush(); // Ensure all bytes are written
        } catch (IOException e) {
            // Log the exception if possible
            System.err.println("AUTH SERVICE: Error writing JSON response: " + e.getMessage());
            // Re-throw the exception so the container knows something went wrong
            throw e;
        }
        System.out.println("AUTH SERVICE: Wrote JSON response with Content-Length: " + jsonBytes.length);
    }

    // Helper class for parsing login request JSON
    private static class LoginRequest {
        private String username;
        private String password;

        // Getters are needed for Gson deserialization
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }

    private void logRequestInfo(HttpServletRequest request) {
        System.out.println("AUTH SERVICE: Request details:");
        System.out.println("  Remote Address: " + request.getRemoteAddr());
        System.out.println("  Content Type: " + request.getContentType());
        System.out.println("  User-Agent: " + request.getHeader("User-Agent"));

        // Log request parameters (less relevant for JSON body requests)
        System.out.println("  Request Parameters:");
        request.getParameterMap().forEach((key, values) -> {
            System.out.println("    " + key + ": " + String.join(", ", values));
        });

        // Log select headers
        System.out.println("  Authorization: " +
                (request.getHeader("Authorization") != null ?
                        (request.getHeader("Authorization").length() > 15 ?
                                request.getHeader("Authorization").substring(0, 15) + "..." :
                                request.getHeader("Authorization")) :
                        "null"));
        System.out.println("  Origin: " + request.getHeader("Origin"));
    }
}