// auth-service/src/main/java/com/adhyana/auth/services/AuthService.java
package com.adhyana.auth.services;

import com.adhyana.auth.models.User;
import com.adhyana.auth.utils.DatabaseConnection;
import com.adhyana.auth.utils.HashUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class AuthService {
    public User authenticate(String username, String rawPassword) throws Exception {
        // Hash the input password
        String hashedPassword = HashUtil.hashPassword(rawPassword);
        System.out.println("Input username: " + username);
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Hashed password: " + hashedPassword);

        String query = "SELECT user_id, username, password, role, user_external_id FROM users WHERE username = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String dbPassword = rs.getString("password");
                System.out.println("DB password: " + dbPassword);

                if (hashedPassword.equals(dbPassword)) {
                    return new User(
                            rs.getInt("user_id"),
                            rs.getString("username"),
                            "",  // Don't return password
                            rs.getString("role"),
                            rs.getString("user_external_id")
                    );
                }
            }
            System.out.println("Authentication failed");
        }
        return null;
    }

    /**
     * Create a new user profile
     * @param user User to create
     * @return Created user with ID set
     */
    public User createUserProfile(User user) throws Exception {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        // Check if username already exists
        if (isUsernameExists(user.getUsername())) {
            throw new Exception("Username already exists: " + user.getUsername());
        }

        // Hash the password
        String hashedPassword = HashUtil.hashPassword(user.getPassword());

        String query = "INSERT INTO users (username, password, role, user_external_id) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, user.getUsername());
            stmt.setString(2, hashedPassword);
            stmt.setString(3, user.getRole());
            stmt.setString(4, user.getUserId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new Exception("Creating user profile failed, no rows affected");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getInt(1));
                    return user;
                } else {
                    throw new Exception("Creating user profile failed, no ID obtained");
                }
            }
        }
    }

    /**
     * Check if username already exists
     * @param username Username to check
     * @return true if exists, false otherwise
     */
    private boolean isUsernameExists(String username) throws Exception {
        String query = "SELECT COUNT(*) FROM users WHERE username = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }

        return false;
    }
}