package com.adhyana.course.services;

import com.adhyana.course.models.Announcement;
import com.adhyana.course.utils.DatabaseConnection;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class AnnouncementService {

    // Method to create a new announcement
    public Announcement createAnnouncement(Announcement newAnnouncement) throws Exception {
        String query = "INSERT INTO announcements (courseId, title, content, author, createdAt) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, newAnnouncement.getcourseId());
            stmt.setString(2, newAnnouncement.getTitle());
            stmt.setString(3, newAnnouncement.getContent());
            stmt.setString(4, newAnnouncement.getAuthor());
            stmt.setTimestamp(5, Timestamp.valueOf(newAnnouncement.getCreatedAt()));

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                // Get the generated ID for the new announcement
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int newId = generatedKeys.getInt(1);
                        newAnnouncement.setId(newId);  // Set the ID to the newly generated ID
                        return newAnnouncement;
                    }
                }
            }
            throw new Exception("Creating announcement failed, no rows affected.");
        }
    }

    // Get all announcements
    public List<Announcement> getAllAnnouncements() throws Exception {
        List<Announcement> announcements = new ArrayList<>();
        String query = "SELECT * FROM announcements";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                announcements.add(new Announcement(
                        rs.getInt("id"),
                        rs.getInt("courseId"),
                        rs.getString("title"),
                        rs.getString("content"),
                        rs.getString("author"),
                        rs.getTimestamp("createdAt").toLocalDateTime()
                ));
            }
        }
        return announcements;
    }

    // Search announcements by certain criteria (including author)
    public List<Announcement> getAnnouncement(Integer id, Integer courseId, String title, String author) throws Exception {
        StringBuilder query = new StringBuilder("SELECT * FROM announcements WHERE 1=1");
        if (id != null) query.append(" AND id = ?");
        if (courseId != null) query.append(" AND courseId = ?");
        if (title != null) query.append(" AND title = ?");
        if (author != null) query.append(" AND author = ?");

        List<Announcement> announcements = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query.toString())) {

            int paramIndex = 1;
            if (id != null) stmt.setInt(paramIndex++, id);
            if (courseId != null) stmt.setInt(paramIndex++, courseId);
            if (title != null) stmt.setString(paramIndex++, title);
            if (author != null) stmt.setString(paramIndex++, author);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                announcements.add(new Announcement(
                        rs.getInt("id"),
                        rs.getInt("courseId"),
                        rs.getString("title"),
                        rs.getString("content"),
                        rs.getString("author"),
                        rs.getTimestamp("createdAt").toLocalDateTime()
                ));
            }
        }
        return announcements;
    }

    // Update an announcement
    public boolean updateAnnouncement(Announcement updatedAnnouncement) throws Exception {
        String query;
        if (updatedAnnouncement.getId() > 0) {
            query = "UPDATE announcements SET courseId = ?, title = ?, content = ?, author = ?, createdAt = ? WHERE id = ?";
        } else if (updatedAnnouncement.getTitle() != null && !updatedAnnouncement.getTitle().isEmpty()) {
            query = "UPDATE announcements SET courseId = ?, title = ?, content = ?, author = ?, createdAt = ? WHERE title = ?";
        } else {
            throw new Exception("Both id and title cannot be empty. Please provide one.");
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, updatedAnnouncement.getcourseId());
            stmt.setString(2, updatedAnnouncement.getTitle());
            stmt.setString(3, updatedAnnouncement.getContent());
            stmt.setString(4, updatedAnnouncement.getAuthor());
            stmt.setTimestamp(5, java.sql.Timestamp.valueOf(updatedAnnouncement.getCreatedAt()));

            if (updatedAnnouncement.getId() > 0) {
                stmt.setInt(6, updatedAnnouncement.getId());
            } else {
                stmt.setString(6, updatedAnnouncement.getTitle());
            }

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0; // Return true if update was successful
        }
    }

    // Delete an announcement
    public void deleteAnnouncement(Object identifier) throws Exception {
        String query;
        if (identifier instanceof Integer) {
            query = "DELETE FROM announcements WHERE id = ?";
        } else if (identifier instanceof String) {
            query = "DELETE FROM announcements WHERE title = ?";
        } else {
            throw new IllegalArgumentException("Identifier must be either an Integer (id) or a String (title).");
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            if (identifier instanceof Integer) {
                stmt.setInt(1, (Integer) identifier);
            } else if (identifier instanceof String) {
                stmt.setString(1, (String) identifier);
            }

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Deleting announcement failed, no rows affected.");
            }
        }
    }
}
