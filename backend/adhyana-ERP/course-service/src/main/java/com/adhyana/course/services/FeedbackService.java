package com.adhyana.course.services;

import com.adhyana.course.models.Feedback;
import com.adhyana.course.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FeedbackService {

    public List<Feedback> getAllFeedbacks() throws Exception {
        List<Feedback> feedbacks = new ArrayList<>();
        String query = "SELECT * FROM feedbacks";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                feedbacks.add(mapFeedback(rs));
            }
        }
        return feedbacks;
    }

    public Feedback getFeedbackById(int id) throws Exception {
        String query = "SELECT * FROM feedbacks WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapFeedback(rs);
            }
        }
        return null;
    }


    public Feedback createFeedback(Feedback feedback) throws Exception {
        String query = "INSERT INTO feedbacks (courseId, studentId, teacher, rating_content, rating_instructor, rating_lms, comment, is_anonymous, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, feedback.getCourseId());
            stmt.setInt(2, feedback.getStudentId());
            stmt.setString(3, feedback.getTeacher());
            stmt.setInt(4, feedback.getRatingContent());
            stmt.setInt(5, feedback.getRatingInstructor());
            stmt.setInt(6, feedback.getRatingLms());
            stmt.setString(7, feedback.getComment());
            stmt.setBoolean(8, feedback.isAnonymous());
            stmt.setTimestamp(9, feedback.getCreatedAt());
            stmt.setTimestamp(10, feedback.getUpdatedAt());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating feedback failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    feedback.setId(generatedKeys.getInt(1));
                    return feedback;
                } else {
                    throw new SQLException("Creating feedback failed, no ID obtained.");
                }
            }
        }
    }

    public void updateFeedback(int id, Feedback feedback) throws Exception {
        String query = "UPDATE feedbacks SET courseId = ?, studentId = ?, teacher = ?, rating_content = ?, " +
                "rating_instructor = ?, rating_lms = ?, comment = ?, is_anonymous = ?, updated_at = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, feedback.getCourseId());
            stmt.setInt(2, feedback.getStudentId());
            stmt.setString(3, feedback.getTeacher());
            stmt.setInt(4, feedback.getRatingContent());
            stmt.setInt(5, feedback.getRatingInstructor());
            stmt.setInt(6, feedback.getRatingLms());
            stmt.setString(7, feedback.getComment());
            stmt.setBoolean(8, feedback.isAnonymous());
            stmt.setTimestamp(9, feedback.getUpdatedAt());
            stmt.setInt(10, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating feedback failed, no rows affected.");
            }
        }
    }

    public void deleteFeedback(int id) throws Exception {
        String query = "DELETE FROM feedbacks WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Deleting feedback failed, no rows affected.");
            }
        }
    }

    private Feedback mapFeedback(ResultSet rs) throws SQLException {
        return new Feedback(
                rs.getInt("id"),
                rs.getInt("courseId"),
                rs.getInt("studentId"),
                rs.getString("teacher"),
                rs.getInt("rating_content"),
                rs.getInt("rating_instructor"),
                rs.getInt("rating_lms"),
                rs.getString("comment"),
                rs.getBoolean("is_anonymous"),
                rs.getTimestamp("created_at"),
                rs.getTimestamp("updated_at")
        );
    }
}
