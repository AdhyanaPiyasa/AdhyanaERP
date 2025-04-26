package com.adhyana.administration.services;

import com.adhyana.administration.models.Batch;
import com.adhyana.administration.models.BatchFacultyAssignment;
import com.adhyana.administration.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Service for managing batch-related operations.
 * Updated to match schema changes.
 */
public class BatchService {

    /**
     * Get all batches
     * @return List of all batches
     */
    public List<Batch> getAllBatches() throws Exception {
        List<Batch> batches = new ArrayList<>();
        String query = "SELECT * FROM batches ORDER BY start_date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Batch batch = mapResultSetToBatch(rs);
                // Load course IDs for this batch
                batch.setCourseIds(getBatchCourseIds(batch.getBatchId()));
                batches.add(batch);
            }
        }
        return batches;
    }

    /**
     * Get batch by ID
     * @param batchId Batch ID
     * @return Batch object or null if not found
     */
    public Batch getBatchById(String batchId) throws Exception {
        String query = "SELECT * FROM batches WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Batch batch = mapResultSetToBatch(rs);
                // Load course IDs for this batch
                batch.setCourseIds(getBatchCourseIds(batchId));
                return batch;
            }
        }
        return null;
    }

    /**
     * Create a new batch with courses
     * @param batch Batch to create
     * @return Created batch with ID
     */
    public Batch createBatch(Batch batch) throws Exception {
        // Validate batch data
        if (batch.getBatchName() == null || batch.getBatchName().trim().isEmpty()) {
            throw new Exception("Batch name is required");
        }

        // Check if batch name already exists
        if (isBatchNameExists(batch.getBatchName())) {
            throw new Exception("Batch name already exists: " + batch.getBatchName());
        }

        // If batch ID is not provided, generate one
        if (batch.getBatchId() == null || batch.getBatchId().trim().isEmpty()) {
            batch.setBatchId(generateBatchId(batch.getBatchName()));
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            // Start transaction
            conn.setAutoCommit(false);

            // Insert batch
            String query = "INSERT INTO batches (batch_id, batch_name, start_date, end_date, " +
                    "capacity, status) VALUES (?, ?, ?, ?, ?, ?)";

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, batch.getBatchId());
                stmt.setString(2, batch.getBatchName());
                stmt.setDate(3, batch.getStartDate() != null ?
                        new java.sql.Date(batch.getStartDate().getTime()) : null);
                stmt.setDate(4, batch.getEndDate() != null ?
                        new java.sql.Date(batch.getEndDate().getTime()) : null);
                stmt.setInt(5, batch.getCapacity());
                stmt.setString(6, batch.getStatus() != null ? batch.getStatus() : "PLANNED");

                int affectedRows = stmt.executeUpdate();
                if (affectedRows == 0) {
                    throw new Exception("Creating batch failed, no rows affected.");
                }
            }

            // Add courses to the batch
            if (batch.getCourseIds() != null && !batch.getCourseIds().isEmpty()) {
                addCoursesToBatch(conn, batch.getBatchId(), batch.getCourseIds());
            }

            // Commit transaction
            conn.commit();

            // Return created batch
            return getBatchById(batch.getBatchId());

        } catch (Exception e) {
            // Rollback transaction in case of error
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Error rolling back transaction: " + ex.getMessage());
                }
            }
            throw e;
        } finally {
            // Restore auto-commit mode
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    System.err.println("Error closing connection: " + ex.getMessage());
                }
            }
        }
    }

    /**
     * Update an existing batch
     * @param batchId Batch ID to update
     * @param batch Updated batch data
     */
    public void updateBatch(String batchId, Batch batch) throws Exception {
        // Validate batch data
        if (batch.getBatchName() == null || batch.getBatchName().trim().isEmpty()) {
            throw new Exception("Batch name is required");
        }

        // Check if batch name already exists for a different batch
        if (!batch.getBatchName().equals(getBatchById(batchId).getBatchName()) &&
                isBatchNameExists(batch.getBatchName())) {
            throw new Exception("Batch name already exists: " + batch.getBatchName());
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            // Start transaction
            conn.setAutoCommit(false);

            // Update batch
            String query = "UPDATE batches SET batch_name = ?, start_date = ?, end_date = ?, " +
                    "capacity = ?, status = ? WHERE batch_id = ?";

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, batch.getBatchName());
                stmt.setDate(2, batch.getStartDate() != null ?
                        new java.sql.Date(batch.getStartDate().getTime()) : null);
                stmt.setDate(3, batch.getEndDate() != null ?
                        new java.sql.Date(batch.getEndDate().getTime()) : null);
                stmt.setInt(4, batch.getCapacity());
                stmt.setString(5, batch.getStatus());
                stmt.setString(6, batchId);

                int affectedRows = stmt.executeUpdate();
                if (affectedRows == 0) {
                    throw new Exception("Batch not found with id: " + batchId);
                }
            }

            // Update batch courses - first remove existing
            removeBatchCourses(conn, batchId);

            // Then add new courses
            if (batch.getCourseIds() != null && !batch.getCourseIds().isEmpty()) {
                addCoursesToBatch(conn, batchId, batch.getCourseIds());
            }

            // Commit transaction
            conn.commit();

        } catch (Exception e) {
            // Rollback transaction in case of error
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Error rolling back transaction: " + ex.getMessage());
                }
            }
            throw e;
        } finally {
            // Restore auto-commit mode
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    System.err.println("Error closing connection: " + ex.getMessage());
                }
            }
        }
    }

    /**
     * Delete a batch
     * @param batchId Batch ID to delete
     */
    public void deleteBatch(String batchId) throws Exception {
        // First check if batch has any faculty assignments
        if (hasFacultyAssignments(batchId)) {
            throw new Exception("Cannot delete batch with faculty assignments");
        }

        // Also check if batch has students enrolled
        if (hasEnrolledStudents(batchId)) {
            throw new Exception("Cannot delete batch with enrolled students");
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            // Start transaction
            conn.setAutoCommit(false);

            // First remove batch courses
            removeBatchCourses(conn, batchId);

            // Then delete batch
            String query = "DELETE FROM batches WHERE batch_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, batchId);
                int affectedRows = stmt.executeUpdate();
                if (affectedRows == 0) {
                    throw new Exception("Batch not found with id: " + batchId);
                }
            }

            // Commit transaction
            conn.commit();

        } catch (Exception e) {
            // Rollback transaction in case of error
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Error rolling back transaction: " + ex.getMessage());
                }
            }
            throw e;
        } finally {
            // Restore auto-commit mode
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ex) {
                    System.err.println("Error closing connection: " + ex.getMessage());
                }
            }
        }
    }

    /**
     * Assign faculty to batch
     * @param assignment Faculty assignment
     */
    public void assignFacultyToBatch(BatchFacultyAssignment assignment) throws Exception {
        // Validate assignment data
        if (assignment.getBatchId() == null || assignment.getBatchId().trim().isEmpty()) {
            throw new Exception("Batch ID is required");
        }

        if (assignment.getCourseId() == null || assignment.getCourseId().trim().isEmpty()) {
            throw new Exception("Course ID is required");
        }

        // Check if batch exists
        if (getBatchById(assignment.getBatchId()) == null) {
            throw new Exception("Batch not found with id: " + assignment.getBatchId());
        }

        // Check if course is associated with batch
        if (!isCourseInBatch(assignment.getBatchId(), assignment.getCourseId())) {
            throw new Exception("Course is not associated with this batch");
        }

        // Check if faculty is available for the time period
        if (!isFacultyAvailable(assignment.getStaffId(), assignment.getAssignmentDate(),
                assignment.getEndDate())) {
            throw new Exception("Faculty is not available for the specified time period");
        }

        String query = "INSERT INTO batch_faculty_assignments (batch_id, staff_id, course_id, " +
                "assignment_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, assignment.getBatchId());
            stmt.setInt(2, assignment.getStaffId());
            stmt.setString(3, assignment.getCourseId());
            stmt.setDate(4, new java.sql.Date(assignment.getAssignmentDate().getTime()));
            stmt.setDate(5, new java.sql.Date(assignment.getEndDate().getTime()));
            stmt.setString(6, assignment.getStatus() != null ? assignment.getStatus() : "ACTIVE");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Faculty assignment failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    assignment.setAssignmentId(generatedKeys.getInt(1));
                } else {
                    throw new Exception("Faculty assignment failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Get faculty assignments for a batch
     * @param batchId Batch ID
     * @return List of faculty assignments
     */
    public List<BatchFacultyAssignment> getBatchFacultyAssignments(String batchId) throws Exception {
        List<BatchFacultyAssignment> assignments = new ArrayList<>();
        String query = "SELECT * FROM batch_faculty_assignments WHERE batch_id = ? ORDER BY assignment_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                assignments.add(mapResultSetToAssignment(rs));
            }
        }
        return assignments;
    }

    /**
     * Remove faculty assignment
     * @param assignmentId Assignment ID to remove
     */
    public void removeFacultyAssignment(int assignmentId) throws Exception {
        String query = "DELETE FROM batch_faculty_assignments WHERE assignment_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, assignmentId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Assignment not found with id: " + assignmentId);
            }
        }
    }

    /**
     * Get courses assigned to a batch
     * @param batchId Batch ID
     * @return List of course IDs
     */
    private List<String> getBatchCourseIds(String batchId) throws Exception {
        List<String> courseIds = new ArrayList<>();
        String query = "SELECT course_id FROM batch_courses WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                courseIds.add(rs.getString("course_id"));
            }
        }
        return courseIds;
    }

    /**
     * Add courses to a batch
     * @param conn Database connection
     * @param batchId Batch ID
     * @param courseIds List of course IDs
     */
    private void addCoursesToBatch(Connection conn, String batchId, List<String> courseIds) throws Exception {
        String query = "INSERT INTO batch_courses (batch_id, course_id) VALUES (?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            for (String courseId : courseIds) {
                stmt.setString(1, batchId);
                stmt.setString(2, courseId);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    /**
     * Remove all courses from a batch
     * @param conn Database connection
     * @param batchId Batch ID
     */
    private void removeBatchCourses(Connection conn, String batchId) throws Exception {
        String query = "DELETE FROM batch_courses WHERE batch_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, batchId);
            stmt.executeUpdate();
        }
    }

    /**
     * Check if batch has faculty assignments
     * @param batchId Batch ID
     * @return true if batch has faculty assignments, false otherwise
     */
    private boolean hasFacultyAssignments(String batchId) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_faculty_assignments WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Check if batch has enrolled students
     * @param batchId Batch ID
     * @return true if batch has enrolled students, false otherwise
     */
    private boolean hasEnrolledStudents(String batchId) throws Exception {
        String query = "SELECT COUNT(*) FROM students WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Check if a course is associated with a batch
     * @param batchId Batch ID
     * @param courseId Course ID
     * @return true if course is in batch, false otherwise
     */
    private boolean isCourseInBatch(String batchId, String courseId) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_courses WHERE batch_id = ? AND course_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            stmt.setString(2, courseId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Check if faculty is available for a time period
     * @param staffId Staff ID
     * @param startDate Start date
     * @param endDate End date
     * @return true if faculty is available, false otherwise
     */
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

    /**
     * Check if batch name already exists
     * @param batchName Batch name
     * @return true if batch name exists, false otherwise
     */
    private boolean isBatchNameExists(String batchName) throws Exception {
        String query = "SELECT COUNT(*) FROM batches WHERE batch_name = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchName);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Generate a batch ID based on batch name
     * @param batchName Batch name
     * @return Generated batch ID
     */
    private String generateBatchId(String batchName) {
        // Generate batch ID from batch name
        // e.g., "Computer Science 2023 Fall" -> "CS23F"
        StringBuilder id = new StringBuilder();

        // Extract program abbreviation (first letters of major words)
        String[] words = batchName.split("\\s+");
        for (String word : words) {
            if (word.length() > 0 && Character.isUpperCase(word.charAt(0))) {
                id.append(word.charAt(0));
            }
        }

        // If no abbreviation was extracted, use first two letters
        if (id.length() == 0 && batchName.length() >= 2) {
            id.append(batchName.substring(0, 2).toUpperCase());
        }

        // Add current year (last two digits)
        int year = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR) % 100;
        id.append(year);

        // Add unique suffix if needed (e.g., 'S' for Spring, 'F' for Fall)
        if (batchName.toLowerCase().contains("spring")) {
            id.append("S");
        } else if (batchName.toLowerCase().contains("fall")) {
            id.append("F");
        } else if (batchName.toLowerCase().contains("summer")) {
            id.append("X");
        } else {
            id.append("A"); // Default suffix
        }

        return id.toString();
    }

    /**
     * Map database result set to Batch object
     * @param rs ResultSet
     * @return Batch object
     */
    private Batch mapResultSetToBatch(ResultSet rs) throws SQLException {
        Batch batch = new Batch();
        batch.setBatchId(rs.getString("batch_id"));
        batch.setBatchName(rs.getString("batch_name"));
        batch.setStartDate(rs.getDate("start_date"));
        batch.setEndDate(rs.getDate("end_date"));
        batch.setCapacity(rs.getInt("capacity"));
        batch.setStatus(rs.getString("status"));
        batch.setCreatedAt(rs.getTimestamp("created_at"));
        batch.setUpdatedAt(rs.getTimestamp("updated_at"));
        return batch;
    }

    /**
     * Map database result set to BatchFacultyAssignment object
     * @param rs ResultSet
     * @return BatchFacultyAssignment object
     */
    private BatchFacultyAssignment mapResultSetToAssignment(ResultSet rs) throws SQLException {
        BatchFacultyAssignment assignment = new BatchFacultyAssignment();
        assignment.setAssignmentId(rs.getInt("assignment_id"));
        assignment.setBatchId(rs.getString("batch_id"));
        assignment.setStaffId(rs.getInt("staff_id"));
        assignment.setCourseId(rs.getString("course_id"));
        assignment.setAssignmentDate(rs.getDate("assignment_date"));
        assignment.setEndDate(rs.getDate("end_date"));
        assignment.setStatus(rs.getString("status"));
        assignment.setCreatedAt(rs.getTimestamp("created_at"));
        assignment.setUpdatedAt(rs.getTimestamp("updated_at"));
        return assignment;
    }
}