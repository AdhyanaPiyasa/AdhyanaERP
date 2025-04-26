package com.adhyana.administration.services;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.adhyana.administration.models.Staff;
import com.adhyana.administration.models.Student;
import com.adhyana.administration.models.UserProfileRequest;

/**
 * Service for creating and managing user profiles.
 * Handles communication with the Authentication Service.
 */
public class UserProfileService {
    // Auth service URL - would be configurable in production
    private static final String AUTH_SERVICE_URL = "http://localhost:8082/auth/profiles";

    /**
     * Create a user profile for a staff member
     * @param staff Staff to create profile for
     * @return true if successful, false otherwise
     */
    public boolean createStaffUserProfile(Staff staff) throws Exception {
        UserProfileRequest request = new UserProfileRequest();
        request.setUserId("S" + staff.getStaffId()); // Prefix 'S' for Staff
        request.setUsername(staff.getEmail());
        // Default password is staff ID + first 3 chars of name
        String defaultPassword = "staff" + staff.getStaffId() +
                staff.getName().substring(0, Math.min(3, staff.getName().length()));
        request.setPassword(hashPassword(defaultPassword));

        // Set role based on staff position or default to "STAFF"
        String position = staff.getPosition().toUpperCase();
        if (position.contains("ADMIN")) {
            request.setRole("ADMIN");
        } else if (position.contains("LECTURER") || position.contains("PROFESSOR")) {
            request.setRole("FACULTY");
        } else {
            request.setRole("STAFF");
        }

        return sendUserProfileToAuthService(request);
    }

    /**
     * Create a user profile for a student
     * @param student Student to create profile for
     * @return true if successful, false otherwise
     */
    public boolean createStudentUserProfile(Student student) throws Exception {
        UserProfileRequest request = new UserProfileRequest();
        request.setUserId("STU" + student.getIndexNumber()); // Prefix 'STU' for Student
        request.setUsername(student.getEmail());
        // Default password is registration number
        request.setPassword(hashPassword(student.getRegistrationNumber()));
        request.setRole("STUDENT");

        return sendUserProfileToAuthService(request);
    }

    /**
     * Create a user profile for a guardian
     * @param guardianName Guardian's name
     * @param guardianEmail Guardian's email
     * @param studentIndexNumber Associated student's index number
     * @return true if successful, false otherwise
     */
    public boolean createGuardianUserProfile(String guardianName, String guardianEmail,
                                             int studentIndexNumber) throws Exception {
        UserProfileRequest request = new UserProfileRequest();
        request.setUserId("G" + studentIndexNumber); // Prefix 'G' + student ID
        request.setUsername(guardianEmail);
        // Default password is "guardian" + student index
        request.setPassword(hashPassword("guardian" + studentIndexNumber));
        request.setRole("GUARDIAN");

        return sendUserProfileToAuthService(request);
    }

    /**
     * Send user profile request to Auth Service
     * @param request User profile request
     * @return true if successful, false otherwise
     */
    private boolean sendUserProfileToAuthService(UserProfileRequest request) throws Exception {
        URL url = new URL(AUTH_SERVICE_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Convert request to JSON
        String jsonRequest = request.toJson();

        // Send request
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonRequest.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Get response
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK ||
                responseCode == HttpURLConnection.HTTP_CREATED) {

            // Read response
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }

                // Log success
                System.out.println("Successfully created user profile: " + request.getUserId());
                return true;
            }
        } else {
            // Read error response
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8))) {
                StringBuilder error = new StringBuilder();
                String errorLine;
                while ((errorLine = br.readLine()) != null) {
                    error.append(errorLine.trim());
                }

                // Log error
                System.err.println("Failed to create user profile: " + error.toString());
            }
            return false;
        }
    }

    /**
     * Hash password for secure storage
     * @param password Plain text password
     * @return Hashed password
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            // Fall back to plaintext in case of error (should never happen in production)
            System.err.println("Error hashing password: " + e.getMessage());
            return password;
        }
    }

    /**
     * Generate a random password
     * @param length Length of password
     * @return Random password
     */
    public String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            password.append(chars.charAt(index));
        }

        return password.toString();
    }
}