package com.adhyana.course.services;

import com.adhyana.course.models.Announcement;
import com.adhyana.course.utils.DatabaseConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AnnouncementService {

    // Method to create a new announcement
    public Announcement createAnnouncement(Announcement newAnnouncement) throws Exception {
        String query = "INSERT INTO course_announcements (course_id, semester_id, title, content, posted_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, newAnnouncement.getCourseId());
            stmt.setString(2, newAnnouncement.getSemesterId());
            stmt.setString(3, newAnnouncement.getTitle());
            stmt.setString(4, newAnnouncement.getContent());
            stmt.setObject(5, newAnnouncement.getPostedBy()); // Use setObject to handle null

            // Set timestamps
            Timestamp now = Timestamp.valueOf(newAnnouncement.getCreatedAt() != null ?
                    newAnnouncement.getCreatedAt() : LocalDateTime.now());
            stmt.setTimestamp(6, now);
            stmt.setTimestamp(7, now);

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
        String query = "SELECT * FROM course_announcements";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                announcements.add(extractAnnouncementFromResultSet(rs));
            }
        }
        return announcements;
    }

    // Search announcements by certain criteria
    public List<Announcement> getAnnouncement(Integer id, String courseId, String semesterId, String title, Integer postedBy) throws Exception {
        StringBuilder query = new StringBuilder("SELECT * FROM course_announcements WHERE 1=1");

        if (id != null) query.append(" AND course_announcement_id = ?");
        if (courseId != null) query.append(" AND course_id = ?");
        if (semesterId != null) query.append(" AND semester_id = ?");
        if (title != null) query.append(" AND title = ?");
        if (postedBy != null) query.append(" AND posted_by = ?");

        List<Announcement> announcements = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query.toString())) {

            int paramIndex = 1;
            if (id != null) stmt.setInt(paramIndex++, id);
            if (courseId != null) stmt.setString(paramIndex++, courseId);
            if (semesterId != null) stmt.setString(paramIndex++, semesterId);
            if (title != null) stmt.setString(paramIndex++, title);
            if (postedBy != null) stmt.setInt(paramIndex++, postedBy);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                announcements.add(extractAnnouncementFromResultSet(rs));
            }
        }
        return announcements;
    }

    // Legacy method for backward compatibility
    public List<Announcement> getAnnouncement(Integer id, Integer courseId, String title, String author) throws Exception {
        String courseIdStr = courseId != null ? courseId.toString() : null;
        Integer postedBy = null;
        if (author != null && !author.isEmpty()) {
            try {
                postedBy = Integer.parseInt(author);
            } catch (NumberFormatException e) {
                // Not a numeric author value, will return empty results
            }
        }
        return getAnnouncement(id, courseIdStr, null, title, postedBy);
    }

    // Update an announcement
    public boolean updateAnnouncement(Announcement updatedAnnouncement) throws Exception {
        String query;
        if (updatedAnnouncement.getId() > 0) {
            query = "UPDATE course_announcements SET course_id = ?, semester_id = ?, title = ?, content = ?, posted_by = ?, updated_at = ? WHERE course_announcement_id = ?";
        } else if (updatedAnnouncement.getTitle() != null && !updatedAnnouncement.getTitle().isEmpty()) {
            query = "UPDATE course_announcements SET course_id = ?, semester_id = ?, title = ?, content = ?, posted_by = ?, updated_at = ? WHERE title = ?";
        } else {
            throw new Exception("Both id and title cannot be empty. Please provide one.");
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, updatedAnnouncement.getCourseId());
            stmt.setString(2, updatedAnnouncement.getSemesterId());
            stmt.setString(3, updatedAnnouncement.getTitle());
            stmt.setString(4, updatedAnnouncement.getContent());
            stmt.setObject(5, updatedAnnouncement.getPostedBy()); // Use setObject to handle null

            // Set updated timestamp
            Timestamp now = Timestamp.valueOf(updatedAnnouncement.getUpdatedAt() != null ?
                    updatedAnnouncement.getUpdatedAt() : LocalDateTime.now());
            stmt.setTimestamp(6, now);

            if (updatedAnnouncement.getId() > 0) {
                stmt.setInt(7, updatedAnnouncement.getId());
            } else {
                stmt.setString(7, updatedAnnouncement.getTitle());
            }

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0; // Return true if update was successful
        }
    }

    // Delete an announcement
    public void deleteAnnouncement(Object identifier) throws Exception {
        String query;
        if (identifier instanceof Integer) {
            query = "DELETE FROM course_announcements WHERE course_announcement_id = ?";
        } else if (identifier instanceof String) {
            query = "DELETE FROM course_announcements WHERE title = ?";
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

    // Helper method to extract announcement from ResultSet
    private Announcement extractAnnouncementFromResultSet(ResultSet rs) throws SQLException {
        int id = rs.getInt("course_announcement_id");
        String courseId = rs.getString("course_id");
        String semesterId = rs.getString("semester_id");
        String title = rs.getString("title");
        String content = rs.getString("content");

        // Handle the posted_by which can be null
        Integer postedBy = null;
        if (rs.getObject("posted_by") != null) {
            postedBy = rs.getInt("posted_by");
        }

        LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();
        LocalDateTime updatedAt = rs.getTimestamp("updated_at").toLocalDateTime();

        return new Announcement(id, courseId, semesterId, title, content, postedBy, createdAt, updatedAt);
    }
}