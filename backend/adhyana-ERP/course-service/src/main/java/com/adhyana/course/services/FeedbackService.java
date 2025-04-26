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

    public Feedback getFeedbackById(int feedbackId) throws Exception {
        String query = "SELECT * FROM feedbacks WHERE feedback_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, feedbackId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapFeedback(rs);
            }
        }
        return null;
    }

    public List<Feedback> getFeedbacksByCourse(String courseId) throws Exception {
        List<Feedback> feedbacks = new ArrayList<>();
        String query = "SELECT * FROM feedbacks WHERE course_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                feedbacks.add(mapFeedback(rs));
            }
        }
        return feedbacks;
    }

    public List<Feedback> getFeedbacksBySemester(String semesterId) throws Exception {
        List<Feedback> feedbacks = new ArrayList<>();
        String query = "SELECT * FROM feedbacks WHERE semester_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, semesterId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                feedbacks.add(mapFeedback(rs));
            }
        }
        return feedbacks;
    }

    public Feedback createFeedback(Feedback feedback) throws Exception {
        String query = "INSERT INTO feedbacks (course_id, semester_id, student_index, rating_content, " +
                "rating_instructor, rating_materials, rating_lms, comment, is_anonymous, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, feedback.getCourseId());
            stmt.setString(2, feedback.getSemesterId());

            // Handle null student_index
            if (feedback.getStudentIndex() != null) {
                stmt.setInt(3, feedback.getStudentIndex());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }

            stmt.setInt(4, feedback.getRatingContent());
            stmt.setInt(5, feedback.getRatingInstructor());
            stmt.setInt(6, feedback.getRatingMaterials());
            stmt.setInt(7, feedback.getRatingLms());
            stmt.setString(8, feedback.getComment());
            stmt.setBoolean(9, feedback.isAnonymous());
            stmt.setTimestamp(10, feedback.getCreatedAt());
            stmt.setTimestamp(11, feedback.getUpdatedAt());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating feedback failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    feedback.setFeedbackId(generatedKeys.getInt(1));
                    return feedback;
                } else {
                    throw new SQLException("Creating feedback failed, no ID obtained.");
                }
            }
        }
    }

    public void updateFeedback(int feedbackId, Feedback feedback) throws Exception {
        String query = "UPDATE feedbacks SET course_id = ?, semester_id = ?, student_index = ?, " +
                "rating_content = ?, rating_instructor = ?, rating_materials = ?, rating_lms = ?, " +
                "comment = ?, is_anonymous = ?, updated_at = ? WHERE feedback_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, feedback.getCourseId());
            stmt.setString(2, feedback.getSemesterId());

            // Handle null student_index
            if (feedback.getStudentIndex() != null) {
                stmt.setInt(3, feedback.getStudentIndex());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }

            stmt.setInt(4, feedback.getRatingContent());
            stmt.setInt(5, feedback.getRatingInstructor());
            stmt.setInt(6, feedback.getRatingMaterials());
            stmt.setInt(7, feedback.getRatingLms());
            stmt.setString(8, feedback.getComment());
            stmt.setBoolean(9, feedback.isAnonymous());
            stmt.setTimestamp(10, feedback.getUpdatedAt());
            stmt.setInt(11, feedbackId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating feedback failed, no rows affected.");
            }
        }
    }

    public void deleteFeedback(int feedbackId) throws Exception {
        String query = "DELETE FROM feedbacks WHERE feedback_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, feedbackId);
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Deleting feedback failed, no rows affected.");
            }
        }
    }

    private Feedback mapFeedback(ResultSet rs) throws SQLException {
        return new Feedback(
                rs.getInt("feedback_id"),
                rs.getString("course_id"),
                rs.getString("semester_id"),
                rs.getObject("student_index") != null ? rs.getInt("student_index") : null,
                rs.getInt("rating_content"),
                rs.getInt("rating_instructor"),
                rs.getInt("rating_materials"),
                rs.getInt("rating_lms"),
                rs.getString("comment"),
                rs.getBoolean("is_anonymous"),
                rs.getTimestamp("created_at"),
                rs.getTimestamp("updated_at")
        );
    }
}