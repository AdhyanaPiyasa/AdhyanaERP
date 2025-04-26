// auth-service/src/main/java/com/adhyana/auth/models/UserProfileRequest.java
package com.adhyana.auth.models;

/**
 * Model for receiving user profile creation requests from other services
 */
public class UserProfileRequest {
    private String userId;
    private String username;
    private String password;
    private String role;

    // Default constructor
    public UserProfileRequest() {}

    // Constructor with all fields
    public UserProfileRequest(String userId, String username, String password, String role) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    /**
     * Convert to User object
     * @return User object
     */
    public User toUser() {
        return new User(username, password, role, userId);
    }
}