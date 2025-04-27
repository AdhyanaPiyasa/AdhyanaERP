package com.adhyana.hostel.services;

import com.adhyana.hostel.models.Hostel;
import com.adhyana.hostel.models.HostelApplication;
import com.adhyana.hostel.models.HostelAssignment;
import com.adhyana.hostel.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HostelApplicationService {

    private final HostelService hostelService = new HostelService(); // To interact with Hostel data

    // Check if a student has an active application or assignment
    public boolean hasActiveApplicationOrAssignment(int studentIndex) throws Exception {
        String checkQuery = "SELECT COUNT(*) FROM hostel_applications WHERE student_index = ? AND status IN ('Pending', 'Approved', 'Waitlisted') " +
                "UNION ALL " +
                "SELECT COUNT(*) FROM hostel_assignments WHERE student_index = ? AND status = 'Active'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(checkQuery)) {
            stmt.setInt(1, studentIndex);
            stmt.setInt(2, studentIndex);
            try (ResultSet rs = stmt.executeQuery()) {
                int count = 0;
                while (rs.next()) {
                    count += rs.getInt(1);
                }
                return count > 0;
            }
        }
    }


    // Create a new hostel application
    public HostelApplication createApplication(HostelApplication application) throws Exception {
        // Check if student already applied or assigned
        if (hasActiveApplicationOrAssignment(application.getStudentIndex())) {
            throw new SQLException("Student already has an active hostel application or assignment.");
        }

        String query = "INSERT INTO hostel_applications (student_index, preferred_hostel_id, application_date, status) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, application.getStudentIndex());
            stmt.setObject(2, application.getPreferredHostelId()); // Handle null preference
            stmt.setDate(3, new java.sql.Date(System.currentTimeMillis())); // Use current date
            stmt.setString(4, "Pending"); // Initial status

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating application failed.");
            }
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    application.setApplicationId(generatedKeys.getInt(1));
                    application.setStatus("Pending");
                    application.setApplicationDate(new java.sql.Date(System.currentTimeMillis()));
                    return application;
                } else {
                    throw new SQLException("Creating application failed, no ID obtained.");
                }
            }
        }
    }

    // Get applications (can filter by status)
    public List<HostelApplication> getApplications(String statusFilter) throws Exception {
        List<HostelApplication> applications = new ArrayList<>();
        // Join with student table to get name and gender
        String baseQuery = "SELECT ha.*, s.name as student_name, s.gender as student_gender " +
                "FROM hostel_applications ha " +
                "JOIN students s ON ha.student_index = s.student_index";
        String query;
        if (statusFilter != null && !statusFilter.isEmpty()) {
            query = baseQuery + " WHERE ha.status = ? ORDER BY ha.application_date";
        } else {
            query = baseQuery + " ORDER BY ha.application_date";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            if (statusFilter != null && !statusFilter.isEmpty()) {
                stmt.setString(1, statusFilter);
            }
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    applications.add(mapResultSetToApplication(rs));
                }
            }
        }
        return applications;
    }

    // Get a single application by ID
    public HostelApplication getApplicationById(int applicationId) throws Exception {
        String query = "SELECT ha.*, s.name as student_name, s.gender as student_gender " +
                "FROM hostel_applications ha " +
                "JOIN students s ON ha.student_index = s.student_index " +
                "WHERE ha.application_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, applicationId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToApplication(rs);
                }
            }
        }
        return null;
    }


    // Approve an application and assign hostel
    public boolean approveApplication(int applicationId) throws Exception {
        HostelApplication application = getApplicationById(applicationId);
        if (application == null || !"Pending".equals(application.getStatus())) {
            throw new SQLException("Application not found or not in Pending state.");
        }

        // Fetch student details needed for assignment (gender)
        // Assuming gender is now part of the HostelApplication object via the JOIN in getApplicationById
        String studentGender = application.getStudentGender();
        if (studentGender == null) {
            // Fetch separately if not joined
            studentGender = getStudentGender(application.getStudentIndex());
        }
        if (studentGender == null) {
            throw new SQLException("Could not determine student gender.");
        }


        // Find available hostel
        Hostel availableHostel = hostelService.findAvailableHostel(studentGender);

        if (availableHostel == null) {
            // No space, potentially waitlist or reject
            // For now, let's reject if no space
            return rejectApplication(applicationId, "No suitable hostel vacancy available.");
            // Or update status to Waitlisted
            // updateApplicationStatus(applicationId, "Waitlisted", "No vacancy, placed on waitlist.");
            // return false; // Indicate not assigned yet
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            // 1. Update application status to Approved
            String updateAppSql = "UPDATE hostel_applications SET status = 'Approved', updated_at = CURRENT_TIMESTAMP WHERE application_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(updateAppSql)) {
                stmt.setInt(1, applicationId);
                if (stmt.executeUpdate() == 0) throw new SQLException("Failed to update application status.");
            }

            // 2. Create hostel assignment
            String insertAssignSql = "INSERT INTO hostel_assignments (student_index, hostel_id, assigned_date, status) VALUES (?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(insertAssignSql)) {
                stmt.setInt(1, application.getStudentIndex());
                stmt.setInt(2, availableHostel.getHostelId());
                stmt.setDate(3, new java.sql.Date(System.currentTimeMillis())); // Assign date
                stmt.setString(4, "Active");
                if (stmt.executeUpdate() == 0) throw new SQLException("Failed to create hostel assignment.");
            }


            conn.commit(); // Commit transaction

            // Update occupancy for the assigned hostel *after* successful commit
            hostelService.updateOccupancyAndVacancy(availableHostel.getHostelId());

            return true;

        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { /* ignored */ }
            }
            // If assignment failed (e.g., student already assigned due to race condition), set app back to Pending?
            // Or maybe leave it Approved but log the assignment failure.
            // For simplicity now, we just rethrow.
            System.err.println("Transaction failed during approval/assignment: " + e.getMessage());
            throw e;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) { /* ignored */ }
            }
        }
    }

    // Helper to get student gender if not already fetched
    private String getStudentGender(int studentIndex) throws Exception {
        String query = "SELECT gender FROM students WHERE student_index = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, studentIndex);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("gender");
                }
            }
        }
        return null;
    }


    // Reject an application
    public boolean rejectApplication(int applicationId, String reason) throws Exception {
        return updateApplicationStatus(applicationId, "Rejected", reason);
    }

    // Update application status and notes
    private boolean updateApplicationStatus(int applicationId, String newStatus, String notes) throws Exception {
        String query = "UPDATE hostel_applications SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE application_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, newStatus);
            stmt.setString(2, notes);
            stmt.setInt(3, applicationId);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }


    private HostelApplication mapResultSetToApplication(ResultSet rs) throws SQLException {
        HostelApplication app = new HostelApplication(
                rs.getInt("application_id"),
                rs.getInt("student_index"),
                rs.getDate("application_date"),
                rs.getString("status"),
                rs.getObject("preferred_hostel_id") != null ? rs.getInt("preferred_hostel_id") : null,
                rs.getString("notes"),
                rs.getTimestamp("created_at"),
                rs.getTimestamp("updated_at")
        );
        // Populate joined fields if they exist in the ResultSet
        try {
            app.setStudentName(rs.getString("student_name"));
        } catch (SQLException e) { /* column not found, ignore */ }
        try {
            app.setStudentGender(rs.getString("student_gender"));
        } catch (SQLException e) { /* column not found, ignore */ }
        return app;
    }

    // Helper to map ResultSet to HostelAssignment
    private HostelAssignment mapResultSetToAssignment(ResultSet rs) throws SQLException {
        HostelAssignment assignment = new HostelAssignment();
        assignment.setAssignmentId(rs.getInt("assignment_id"));
        assignment.setStudentIndex(rs.getInt("student_index"));
        assignment.setHostelId(rs.getInt("hostel_id"));
        assignment.setAssignedDate(rs.getDate("assigned_date"));
        assignment.setStatus(rs.getString("status"));
        assignment.setCreatedAt(rs.getTimestamp("created_at"));
        assignment.setUpdatedAt(rs.getTimestamp("updated_at"));
        return assignment;
    }
}