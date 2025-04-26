package com.adhyana.exam.services;

import com.adhyana.exam.models.Assignment;
import com.adhyana.exam.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AssignmentService {

    public List<Assignment> getAllAssignments() throws Exception {
        List<Assignment> assignments = new ArrayList<>();
        String query = "SELECT assignment_id, title, course_id, semester_id, type, due_date, due_time, max_marks, description, posted_by FROM assignments";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                assignments.add(createAssignmentFromResultSet(rs));
            }
        }
        return assignments;
    }

    public Assignment getAssignment(int id) throws Exception {
        String query = "SELECT assignment_id, title, course_id, semester_id, type, due_date, due_time, max_marks, description, posted_by FROM assignments WHERE assignment_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return createAssignmentFromResultSet(rs);
            }
        }
        return null;
    }

    public Assignment createAssignment(Assignment assignment) throws Exception {
        String query = "INSERT INTO assignments (title, course_id, semester_id, type, due_date, due_time, max_marks, description, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setAssignmentParameters(stmt, assignment);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating assignment failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    assignment.setAssignment_id(generatedKeys.getInt(1));
                    return assignment;
                } else {
                    throw new SQLException("Creating assignment failed, no ID obtained.");
                }
            }
        }
    }

    public void updateAssignment(int id, Assignment assignment) throws Exception {
        String query = "UPDATE assignments SET title = ?, course_id = ?, semester_id = ?, type = ?, due_date = ?, due_time = ?, max_marks = ?, description = ?, posted_by = ? WHERE assignment_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setAssignmentParameters(stmt, assignment);
            stmt.setInt(10, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating assignment failed, no rows affected.");
            }
        }
    }

    public void deleteAssignment(int id) throws Exception {
        String query = "DELETE FROM assignments WHERE assignment_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting assignment failed, no rows affected.");
            }
        }
    }

    private Assignment createAssignmentFromResultSet(ResultSet rs) throws SQLException {
        Assignment assignment = new Assignment();
        assignment.setAssignment_id(rs.getInt("assignment_id"));
        assignment.setTitle(rs.getString("title"));
        assignment.setCourse_id(rs.getString("course_id"));
        assignment.setSemester_id(rs.getString("semester_id"));
        assignment.setType(rs.getString("type"));
        assignment.setDue_date(rs.getDate("due_date"));
        assignment.setDue_time(rs.getTime("due_time"));
        assignment.setMax_marks(rs.getInt("max_marks")); // Use getInt for Integer
        assignment.setDescription(rs.getString("description"));
        assignment.setPosted_by(rs.getInt("posted_by"));   // Use getInt for Integer
        return assignment;
    }

    private void setAssignmentParameters(PreparedStatement stmt, Assignment assignment) throws SQLException {
        stmt.setString(1, assignment.getTitle());
        stmt.setString(2, assignment.getCourse_id());
        stmt.setString(3, assignment.getSemester_id());
        stmt.setString(4, assignment.getType());
        stmt.setDate(5, new java.sql.Date(assignment.getDue_date().getTime()));
        stmt.setTime(6, assignment.getDue_time());
        if (assignment.getMax_marks() != null) {
            stmt.setInt(7, assignment.getMax_marks());
        } else {
            stmt.setNull(7, java.sql.Types.INTEGER);
        }
        stmt.setString(8, assignment.getDescription());
        if (assignment.getPosted_by() != null) {
            stmt.setInt(9, assignment.getPosted_by());
        } else {
            stmt.setNull(9, java.sql.Types.INTEGER);
        }
    }
}
