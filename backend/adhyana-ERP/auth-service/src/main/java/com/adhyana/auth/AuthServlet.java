// auth-service/src/main/java/com/adhyana/auth/AuthServlet.java
package com.adhyana.auth;

import com.adhyana.auth.models.ApiResponse;
import com.adhyana.auth.models.TokenResponse;
import com.adhyana.auth.models.User;
import com.adhyana.auth.services.AuthService;
import com.adhyana.auth.utils.TokenManager;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.BufferedReader;

@WebServlet("/auth/*")
public class AuthServlet extends HttpServlet {
    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("\n========== AUTH SERVICE - POST REQUEST ==========");
        System.out.println("AUTH SERVICE: Processing POST request to " + request.getRequestURI());
        logRequestInfo(request);

        String path = request.getPathInfo();
        System.out.println("AUTH SERVICE: Path info: " + path);

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
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }

        System.out.println("========== AUTH SERVICE - POST REQUEST COMPLETED ==========");
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Read JSON body
            StringBuilder buffer = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }

            String json = buffer.toString();
            System.out.println("AUTH SERVICE: Received login request JSON: " + json);

            // Parse JSON
            json = json.replaceAll("\\s", "").replace("{", "").replace("}", "");
            String username = null;
            String password = null;

            String[] pairs = json.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].replace("\"", "");
                    String value = keyValue[1].replace("\"", "");

                    if ("username".equals(key)) {
                        username = value;
                    } else if ("password".equals(key)) {
                        password = value;
                    }
                }
            }

            if (username == null || password == null) {
                System.out.println("AUTH SERVICE: ERROR - Missing username or password");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Invalid request format", null);
                response.getWriter().write(apiResponse.toJson());
                return;
            }

            System.out.println("AUTH SERVICE: Attempting to authenticate user: " + username);
            // Now we pass just the username and password values, not the full JSON
            User user = authService.authenticate(username, password);

            response.setContentType("application/json");
            if (user != null) {
                System.out.println("AUTH SERVICE: Authentication successful for user: " + username + " with role: " + user.getRole());
                String token = TokenManager.generateToken(user);
                System.out.println("AUTH SERVICE: Generated token: " + (token.length() > 10 ? token.substring(0, 10) + "..." : token));
                response.setHeader("Authorization", "Bearer " + token);

                ApiResponse<Object> apiResponse = new ApiResponse<>(
                        true,
                        "Login successful",
                        new TokenResponse(token, user.getRole())
                );
                String jsonResponse = apiResponse.toJson();
                System.out.println("AUTH SERVICE: Sending successful login response");
                response.getWriter().write(jsonResponse);
            } else {
                System.out.println("AUTH SERVICE: Authentication failed for user: " + username);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Invalid credentials", null);
                response.getWriter().write(apiResponse.toJson());
            }
        } catch (Exception e) {
            System.out.println("AUTH SERVICE: ERROR - Exception during login process: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    /**
     * Handle user profile creation requests from other services
     */
    private void handleProfileCreation(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // Read JSON body
            StringBuilder buffer = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }

            String json = buffer.toString();
            System.out.println("AUTH SERVICE: Received profile creation request JSON: " + json);

            // Parse JSON using a simplified approach (no external libraries)
            json = json.replaceAll("\\s", "").replace("{", "").replace("}", "");
            String userId = null;
            String username = null;
            String password = null;
            String role = null;

            String[] pairs = json.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].replace("\"", "");
                    String value = keyValue[1].replace("\"", "");

                    if ("userId".equals(key)) {
                        userId = value;
                    } else if ("username".equals(key)) {
                        username = value;
                    } else if ("password".equals(key)) {
                        password = value;
                    } else if ("role".equals(key)) {
                        role = value;
                    }
                }
            }

            // Validate required fields
            if (username == null || password == null || role == null) {
                System.out.println("AUTH SERVICE: ERROR - Missing required fields");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Missing required fields", null);
                response.getWriter().write(apiResponse.toJson());
                return;
            }

            // Create user profile
            System.out.println("AUTH SERVICE: Creating user profile for username: " + username + ", role: " + role + ", userId: " + userId);
            User user = new User(username, password, role, userId);
            user = authService.createUserProfile(user);

            // Send success response
            response.setContentType("application/json");
            ApiResponse<User> apiResponse = new ApiResponse<>(true, "User profile created successfully", user);
            response.getWriter().write(apiResponse.toJson());
            System.out.println("AUTH SERVICE: User profile created successfully with ID: " + user.getId());

        } catch (Exception e) {
            System.out.println("AUTH SERVICE: ERROR - Exception during profile creation: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Error: " + e.getMessage(), null);
            response.getWriter().write(apiResponse.toJson());
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

        if ("/verify".equals(path)) {
            System.out.println("AUTH SERVICE: Handling token verification request");
            handleTokenVerification(request, response);
        } else {
            System.out.println("AUTH SERVICE: ERROR - Invalid path: " + path);
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }

        System.out.println("========== AUTH SERVICE - GET REQUEST COMPLETED ==========");
    }

    private void handleTokenVerification(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader("Authorization");
        System.out.println("AUTH SERVICE: Token verification - Authorization header: " +
                (authHeader != null ? (authHeader.length() > 15 ? authHeader.substring(0, 15) + "..." : authHeader) : "null"));
        response.setContentType("application/json");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("AUTH SERVICE: Validating token: " + (token.length() > 10 ? token.substring(0, 10) + "..." : token));

            if (TokenManager.validateToken(token)) {
                String role = TokenManager.getRoleFromToken(token);
                System.out.println("AUTH SERVICE: Token is valid, role extracted: " + role);

                ApiResponse<Object> apiResponse = new ApiResponse<>(
                        true,
                        "Token valid",
                        new TokenResponse(token, role)
                );
                String jsonResponse = apiResponse.toJson();
                System.out.println("AUTH SERVICE: Sending successful token validation response");
                response.getWriter().write(jsonResponse);
            } else {
                System.out.println("AUTH SERVICE: Invalid token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ApiResponse<Void> apiResponse = new ApiResponse<>(false, "Invalid token", null);
                response.getWriter().write(apiResponse.toJson());
            }
        } else {
            System.out.println("AUTH SERVICE: No token provided or invalid format");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ApiResponse<Void> apiResponse = new ApiResponse<>(false, "No token provided", null);
            response.getWriter().write(apiResponse.toJson());
        }
    }

    private void handleLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        System.out.println("AUTH SERVICE: Processing logout request");
        response.setContentType("application/json");
        ApiResponse<Void> apiResponse = new ApiResponse<>(true, "Logged out successfully", null);
        System.out.println("AUTH SERVICE: Logout successful");
        response.getWriter().write(apiResponse.toJson());
    }

    private void logRequestInfo(HttpServletRequest request) {
        System.out.println("AUTH SERVICE: Request details:");
        System.out.println("  Remote Address: " + request.getRemoteAddr());
        System.out.println("  Content Type: " + request.getContentType());
        System.out.println("  User-Agent: " + request.getHeader("User-Agent"));

        // Log request parameters
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
    }
}