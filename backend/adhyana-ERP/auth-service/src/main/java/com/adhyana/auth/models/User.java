// auth-service/src/main/java/com/adhyana/auth/models/User.java
package com.adhyana.auth.models;

public class User {
    private int user_id;
    private String username;
    private String password;
    private String role;
    private String userId; // External ID from source system (e.g., S123 for Staff, STU456 for Student)

    // Original constructor
    public User(int user_id, String username, String password, String role) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.userId = null;
    }

    // New constructor with userId
    public User(int user_id, String username, String password, String role, String userId) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.userId = userId;
    }

    // For creating new user profiles
    public User(String username, String password, String role, String userId) {
        this.user_id = 0; // Will be set by database
        this.username = username;
        this.password = password;
        this.role = role;
        this.userId = userId;
    }

    // Getters and setters
    public int getId() { return user_id; }
    public void setId(int user_id) { this.user_id = user_id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}