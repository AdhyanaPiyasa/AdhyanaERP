package com.adhyana.administration.services;

import com.adhyana.administration.models.Announcement;
import com.adhyana.administration.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AnnouncementService {

    public List<Announcement> getAllAnnouncements() throws Exception {
        List<Announcement> announcements = new ArrayList<>();
        String query = "SELECT * FROM announcements ORDER BY valid_from DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                announcements.add(mapResultSetToAnnouncement(rs));
            }
        }
        return announcements;
    }

    public List<Announcement> getActiveAnnouncements() throws Exception {
        List<Announcement> announcements = new ArrayList<>();
        String query = "SELECT * FROM announcements " +
                "WHERE status = 'PUBLISHED' " +
                "AND valid_from <= CURRENT_DATE " +
                "AND (valid_until IS NULL OR valid_until >= CURRENT_DATE) " +
                "ORDER BY valid_from DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                announcements.add(mapResultSetToAnnouncement(rs));
            }
        }
        return announcements;
    }

    public Announcement getAnnouncementById(int id) throws Exception {
        String query = "SELECT * FROM announcements WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToAnnouncement(rs);
            }
        }
        return null;
    }

    public Announcement createAnnouncement(Announcement announcement) throws Exception {
        String query = "INSERT INTO announcements (title, content, category, posted_by, valid_from, valid_until, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setAnnouncementParameters(stmt, announcement);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Creating announcement failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    announcement.setId(generatedKeys.getInt(1));
                    return getAnnouncementById(announcement.getId());
                } else {
                    throw new Exception("Creating announcement failed, no ID obtained.");
                }
            }
        }
    }

    public void updateAnnouncement(int id, Announcement announcement) throws Exception {
        String query = "UPDATE announcements SET title = ?, content = ?, category = ?, " +
                "posted_by = ?, valid_from = ?, valid_until = ?, status = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setAnnouncementParameters(stmt, announcement);
            stmt.setInt(8, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Announcement not found with id: " + id);
            }
        }
    }

    public void deleteAnnouncement(int id) throws Exception {
        String query = "DELETE FROM announcements WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Announcement not found with id: " + id);
            }
        }
    }

    public void publishAnnouncement(int id) throws Exception {
        String query = "UPDATE announcements SET status = 'PUBLISHED' WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Announcement not found with id: " + id);
            }
        }
    }

    public void archiveAnnouncement(int id) throws Exception {
        String query = "UPDATE announcements SET status = 'ARCHIVED' WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Announcement not found with id: " + id);
            }
        }
    }

    private Announcement mapResultSetToAnnouncement(ResultSet rs) throws SQLException {
        Announcement announcement = new Announcement();
        announcement.setId(rs.getInt("id"));
        announcement.setTitle(rs.getString("title"));
        announcement.setContent(rs.getString("content"));
        announcement.setCategory(rs.getString("category"));
        announcement.setPostedBy(rs.getInt("posted_by"));
        announcement.setValidFrom(rs.getDate("valid_from"));
        announcement.setValidUntil(rs.getDate("valid_until"));
        announcement.setStatus(rs.getString("status"));
        announcement.setCreatedAt(rs.getTimestamp("created_at"));
        announcement.setUpdatedAt(rs.getTimestamp("updated_at"));
        return announcement;
    }

    private void setAnnouncementParameters(PreparedStatement stmt, Announcement announcement) throws SQLException {
        stmt.setString(1, announcement.getTitle());
        stmt.setString(2, announcement.getContent());
        stmt.setString(3, announcement.getCategory());
        stmt.setInt(4, announcement.getPostedBy());
        stmt.setDate(5, announcement.getValidFrom() != null ? new java.sql.Date(announcement.getValidFrom().getTime()) : null);
        stmt.setDate(6, announcement.getValidUntil() != null ? new java.sql.Date(announcement.getValidUntil().getTime()) : null);
        stmt.setString(7, announcement.getStatus());
    }
}
