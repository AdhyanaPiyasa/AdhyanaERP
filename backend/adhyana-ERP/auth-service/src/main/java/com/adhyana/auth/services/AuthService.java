// auth-service/src/main/java/com/adhyana/auth/services/AuthService.java
package com.adhyana.auth.services;

import com.adhyana.auth.models.User;
import com.adhyana.auth.utils.DatabaseConnection;
import com.adhyana.auth.utils.HashUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AuthService {
    public User authenticate(String username, String rawPassword) throws Exception {
        // Hash the input password
        String hashedPassword = HashUtil.hashPassword(rawPassword);
        System.out.println("Input username: " + username);
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Hashed password: " + hashedPassword);

        String query = "SELECT id, username, password, role FROM users WHERE username = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String dbPassword = rs.getString("password");
                System.out.println("DB password: " + dbPassword);

                if (hashedPassword.equals(dbPassword)) {
                    return new User(
                            rs.getInt("id"),
                            rs.getString("username"),
                            "",  // Don't return password
                            rs.getString("role")
                    );
                }
            }
            System.out.println("Authentication failed");
        }
        return null;
    }
}