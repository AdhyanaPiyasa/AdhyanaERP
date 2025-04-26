package com.adhyana.administration.models;

/**
 * Data structure for creating a user profile in the Authentication Service.
 * Used for communication between Core Admin and Auth Services.
 */
public class UserProfileRequest {
    private String userId;
    private String username;
    private String password; // Will be hashed before sending to Auth Service
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
     * Convert this request to JSON format for transmission
     * @return JSON string representation of the request
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"userId\":\"").append(escape(userId)).append("\",");
        json.append("\"username\":\"").append(escape(username)).append("\",");
        json.append("\"password\":\"").append(escape(password)).append("\",");
        json.append("\"role\":\"").append(escape(role)).append("\"");
        json.append("}");
        return json.toString();
    }

    /**
     * Escape special characters for JSON
     * @param str String to escape
     * @return Escaped string
     */
    private String escape(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}