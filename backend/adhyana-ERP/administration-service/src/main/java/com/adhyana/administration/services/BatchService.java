package com.adhyana.administration.services;

import com.adhyana.administration.models.Batch;
import com.adhyana.administration.models.BatchFacultyAssignment;
import com.adhyana.administration.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class BatchService {

    public List<Batch> getAllBatches() throws Exception {
        List<Batch> batches = new ArrayList<>();
        String query = "SELECT * FROM batches ORDER BY start_date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                batches.add(mapResultSetToBatch(rs));
            }
        }
        return batches;
    }

    public Batch getBatchById(int id) throws Exception {
        String query = "SELECT * FROM batches WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToBatch(rs);
            }
        }
        return null;
    }

    public Batch createBatch(Batch batch) throws Exception {
        String query = "INSERT INTO batches (batch_name, start_date, end_date, course_id, capacity, status) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setBatchParameters(stmt, batch);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Creating batch failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    batch.setId(generatedKeys.getInt(1));
                    return getBatchById(batch.getId());
                } else {
                    throw new Exception("Creating batch failed, no ID obtained.");
                }
            }
        }
    }

    public void updateBatch(int id, Batch batch) throws Exception {
        String query = "UPDATE batches SET batch_name = ?, start_date = ?, end_date = ?, " +
                "course_id = ?, capacity = ?, status = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setBatchParameters(stmt, batch);
            stmt.setInt(7, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Batch not found with id: " + id);
            }
        }
    }

    public void deleteBatch(int id) throws Exception {
        // First check if batch has any faculty assignments
        if (hasFacultyAssignments(id)) {
            throw new Exception("Cannot delete batch with faculty assignments");
        }

        String query = "DELETE FROM batches WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Batch not found with id: " + id);
            }
        }
    }

    public void assignFacultyToBatch(BatchFacultyAssignment assignment) throws Exception {
        // First check if faculty is available for the time period
        if (!isFacultyAvailable(assignment.getStaffId(), assignment.getAssignmentDate(), assignment.getEndDate())) {
            throw new Exception("Faculty is not available for the specified time period");
        }

        String query = "INSERT INTO batch_faculty_assignments (batch_id, staff_id, subject, assignment_date, end_date, status) " +
                "VALUES (?, ?, ?, ?, ?, 'ACTIVE')";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, assignment.getBatchId());
            stmt.setInt(2, assignment.getStaffId());
            stmt.setString(3, assignment.getSubject());
            stmt.setDate(4, new java.sql.Date(assignment.getAssignmentDate().getTime()));
            stmt.setDate(5, new java.sql.Date(assignment.getEndDate().getTime()));

            stmt.executeUpdate();
        }
    }

    public List<BatchFacultyAssignment> getBatchFacultyAssignments(int batchId) throws Exception {
        List<BatchFacultyAssignment> assignments = new ArrayList<>();
        String query = "SELECT * FROM batch_faculty_assignments WHERE batch_id = ? ORDER BY assignment_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                assignments.add(mapResultSetToAssignment(rs));
            }
        }
        return assignments;
    }

    public void removeFacultyAssignment(int assignmentId) throws Exception {
        String query = "DELETE FROM batch_faculty_assignments WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, assignmentId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Assignment not found with id: " + assignmentId);
            }
        }
    }

    private boolean hasFacultyAssignments(int batchId) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_faculty_assignments WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, batchId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    private boolean isFacultyAvailable(int staffId, Date startDate, Date endDate) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_faculty_assignments " +
                "WHERE staff_id = ? AND status = 'ACTIVE' " +
                "AND ((assignment_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            stmt.setDate(2, new java.sql.Date(startDate.getTime()));
            stmt.setDate(3, new java.sql.Date(endDate.getTime()));
            stmt.setDate(4, new java.sql.Date(startDate.getTime()));
            stmt.setDate(5, new java.sql.Date(endDate.getTime()));

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) == 0;
            }
        }
        return true;
    }

    private Batch mapResultSetToBatch(ResultSet rs) throws SQLException {
        Batch batch = new Batch();
        batch.setId(rs.getInt("id"));
        batch.setBatchName(rs.getString("batch_name"));
        batch.setStartDate(rs.getDate("start_date"));
        batch.setEndDate(rs.getDate("end_date"));
        batch.setCourseId(rs.getInt("course_id"));
        batch.setCapacity(rs.getInt("capacity"));
        batch.setStatus(rs.getString("status"));
        batch.setCreatedAt(rs.getTimestamp("created_at"));
        batch.setUpdatedAt(rs.getTimestamp("updated_at"));
        return batch;
    }

    private BatchFacultyAssignment mapResultSetToAssignment(ResultSet rs) throws SQLException {
        BatchFacultyAssignment assignment = new BatchFacultyAssignment();
        assignment.setId(rs.getInt("id"));
        assignment.setBatchId(rs.getInt("batch_id"));
        assignment.setStaffId(rs.getInt("staff_id"));
        assignment.setSubject(rs.getString("subject"));
        assignment.setAssignmentDate(rs.getDate("assignment_date"));
        assignment.setEndDate(rs.getDate("end_date"));
        assignment.setStatus(rs.getString("status"));
        assignment.setCreatedAt(rs.getTimestamp("created_at"));
        assignment.setUpdatedAt(rs.getTimestamp("updated_at"));
        return assignment;
    }

    private void setBatchParameters(PreparedStatement stmt, Batch batch) throws SQLException {
        stmt.setString(1, batch.getBatchName());
        stmt.setDate(2, batch.getStartDate() != null ? new java.sql.Date(batch.getStartDate().getTime()) : null);
        stmt.setDate(3, batch.getEndDate() != null ? new java.sql.Date(batch.getEndDate().getTime()) : null);
        stmt.setInt(4, batch.getCourseId());
        stmt.setInt(5, batch.getCapacity());
        stmt.setString(6, batch.getStatus());
    }
}