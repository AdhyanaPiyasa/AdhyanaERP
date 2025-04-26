package com.adhyana.administration.services;

import com.adhyana.administration.models.Staff;
import com.adhyana.administration.models.StaffRole;
import com.adhyana.administration.models.StaffAttendance;
import com.adhyana.administration.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for managing staff-related operations.
 * Updated to match the schema changes.
 */
public class StaffService {

    /**
     * Get all staff members
     * @return List of all staff
     */
    public List<Staff> getAllStaff() throws Exception {
        List<Staff> staffList = new ArrayList<>();
        String query = "SELECT * FROM staff ORDER BY staff_id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                staffList.add(mapResultSetToStaff(rs));
            }
        }
        return staffList;
    }

    /**
     * Get staff by ID
     * @param staffId Staff ID
     * @return Staff object or null if not found
     */
    public Staff getStaffById(int staffId) throws Exception {
        String query = "SELECT * FROM staff WHERE staff_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToStaff(rs);
            }
        }
        return null;
    }

    /**
     * Add a new staff member
     * @param staff Staff to add
     * @return Added staff with ID
     */
    public Staff addStaff(Staff staff) throws Exception {
        String query = "INSERT INTO staff (name, email, phone, department, position, hire_date, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setStaffParameters(stmt, staff);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Creating staff failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);
                    staff.setStaffId(newId);

                    // Notify any external systems about the new staff (if needed)
                    // This would be where inter-service communication might happen
                    notifyExternalSystems("staff", newId, "INSERT", staff);

                    // Return the newly created staff object
                    return getStaffById(newId);
                } else {
                    throw new Exception("Creating staff failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Update an existing staff member
     * @param staffId Staff ID to update
     * @param staff Updated staff data
     */
    public void updateStaff(int staffId, Staff staff) throws Exception {
        String query = "UPDATE staff SET name = ?, email = ?, phone = ?, " +
                "department = ?, position = ?, hire_date = ?, status = ? WHERE staff_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setStaffParameters(stmt, staff);
            stmt.setInt(8, staffId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Staff not found with id: " + staffId);
            }

            // Notify any external systems about the staff update
            notifyExternalSystems("staff", staffId, "UPDATE", staff);
        }
    }

    /**
     * Delete a staff member
     * @param staffId Staff ID to delete
     */
    public void deleteStaff(int staffId) throws Exception {
        // First check if staff has any active roles or assignments
        if (hasActiveAssignments(staffId)) {
            throw new Exception("Cannot delete staff with active assignments");
        }

        String query = "DELETE FROM staff WHERE staff_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Staff not found with id: " + staffId);
            }

            // Notify any external systems about the staff deletion
            notifyExternalSystems("staff", staffId, "DELETE", null);
        }
    }

    /**
     * Get roles assigned to a staff member
     * @param staffId Staff ID
     * @return List of roles
     */
    public List<StaffRole> getStaffRoles(int staffId) throws Exception {
        List<StaffRole> roles = new ArrayList<>();
        String query = "SELECT * FROM staff_roles WHERE staff_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                roles.add(mapResultSetToStaffRole(rs));
            }
        }
        return roles;
    }

    /**
     * Assign a role to a staff member
     * @param role Role to assign
     */
    public void assignRole(StaffRole role) throws Exception {
        String query = "INSERT INTO staff_roles (staff_id, role, assigned_date) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, role.getStaffId());
            stmt.setString(2, role.getRole());
            stmt.setDate(3, role.getAssignedDate() != null ?
                    new java.sql.Date(role.getAssignedDate().getTime()) :
                    new java.sql.Date(System.currentTimeMillis()));

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Creating staff role failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    role.setRoleId(generatedKeys.getInt(1));
                } else {
                    throw new Exception("Creating staff role failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Remove a role from a staff member
     * @param roleId Role ID to remove
     */
    public void removeRole(int roleId) throws Exception {
        String query = "DELETE FROM staff_roles WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, roleId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Staff role not found with id: " + roleId);
            }
        }
    }

    /**
     * Record staff attendance
     * @param attendance Attendance record to add
     * @return Created attendance record with ID
     */
    public StaffAttendance recordAttendance(StaffAttendance attendance) throws Exception {
        // Check if there's already an attendance record for this staff and month
        if (hasAttendanceForMonth(attendance.getStaffId(), attendance.getMonth())) {
            throw new Exception("Attendance already recorded for this month");
        }

        String query = "INSERT INTO staff_attendance (staff_id, month, working_days, present_days, status) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, attendance.getStaffId());
            stmt.setDate(2, new java.sql.Date(attendance.getMonth().getTime()));
            stmt.setInt(3, attendance.getWorkingDays());
            stmt.setInt(4, attendance.getPresentDays());
            stmt.setString(5, attendance.getStatus() != null ? attendance.getStatus() : "PENDING");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Recording attendance failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    attendance.setAttendanceId(generatedKeys.getInt(1));
                    return attendance;
                } else {
                    throw new Exception("Recording attendance failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Get attendance records for a staff member
     * @param staffId Staff ID
     * @return List of attendance records
     */
    public List<StaffAttendance> getStaffAttendance(int staffId) throws Exception {
        List<StaffAttendance> attendanceList = new ArrayList<>();
        String query = "SELECT * FROM staff_attendance WHERE staff_id = ? ORDER BY month DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                attendanceList.add(mapResultSetToStaffAttendance(rs));
            }
        }
        return attendanceList;
    }

    /**
     * Approve attendance record
     * @param attendanceId Attendance ID to approve
     * @param approvedBy Staff ID of approver
     */
    public void approveAttendance(int attendanceId, int approvedBy) throws Exception {
        String query = "UPDATE staff_attendance SET status = 'APPROVED', approved_by = ?, " +
                "approved_date = CURRENT_TIMESTAMP WHERE attendance_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, approvedBy);
            stmt.setInt(2, attendanceId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Attendance record not found with id: " + attendanceId);
            }
        }
    }

    /**
     * Check if a staff has attendance recorded for a specific month
     * @param staffId Staff ID
     * @param month Month to check
     * @return true if attendance exists, false otherwise
     */
    private boolean hasAttendanceForMonth(int staffId, java.util.Date month) throws Exception {
        String query = "SELECT COUNT(*) FROM staff_attendance WHERE staff_id = ? AND " +
                "YEAR(month) = ? AND MONTH(month) = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(month);

            stmt.setInt(1, staffId);
            stmt.setInt(2, cal.get(java.util.Calendar.YEAR));
            stmt.setInt(3, cal.get(java.util.Calendar.MONTH) + 1);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Check if staff has active assignments
     * @param staffId Staff ID to check
     * @return true if staff has active assignments, false otherwise
     */
    private boolean hasActiveAssignments(int staffId) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_faculty_assignments " +
                "WHERE staff_id = ? AND status = 'ACTIVE'";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Map database result set to Staff object
     * @param rs ResultSet
     * @return Staff object
     */
    private Staff mapResultSetToStaff(ResultSet rs) throws SQLException {
        Staff staff = new Staff();
        staff.setStaffId(rs.getInt("staff_id"));
        staff.setName(rs.getString("name"));
        staff.setEmail(rs.getString("email"));
        staff.setPhone(rs.getString("phone"));
        staff.setDepartment(rs.getString("department"));
        staff.setPosition(rs.getString("position"));
        staff.setHireDate(rs.getDate("hire_date"));
        staff.setStatus(rs.getString("status"));
        staff.setCreatedAt(rs.getTimestamp("created_at"));
        staff.setUpdatedAt(rs.getTimestamp("updated_at"));
        return staff;
    }

    /**
     * Map database result set to StaffRole object
     * @param rs ResultSet
     * @return StaffRole object
     */
    private StaffRole mapResultSetToStaffRole(ResultSet rs) throws SQLException {
        StaffRole role = new StaffRole();
        role.setRoleId(rs.getInt("id"));
        role.setStaffId(rs.getInt("staff_id"));
        role.setRole(rs.getString("role"));
        role.setAssignedDate(rs.getDate("assigned_date"));
        role.setCreatedAt(rs.getTimestamp("created_at"));
        role.setUpdatedAt(rs.getTimestamp("updated_at"));
        return role;
    }

    /**
     * Map database result set to StaffAttendance object
     * @param rs ResultSet
     * @return StaffAttendance object
     */
    private StaffAttendance mapResultSetToStaffAttendance(ResultSet rs) throws SQLException {
        StaffAttendance attendance = new StaffAttendance();
        attendance.setAttendanceId(rs.getInt("attendance_id"));
        attendance.setStaffId(rs.getInt("staff_id"));
        attendance.setMonth(rs.getDate("month"));
        attendance.setWorkingDays(rs.getInt("working_days"));
        attendance.setPresentDays(rs.getInt("present_days"));
        attendance.setStatus(rs.getString("status"));
        attendance.setApprovedBy(rs.getInt("approved_by"));
        attendance.setApprovedDate(rs.getTimestamp("approved_date"));
        attendance.setCreatedAt(rs.getTimestamp("created_at"));
        attendance.setUpdatedAt(rs.getTimestamp("updated_at"));
        return attendance;
    }

    /**
     * Set staff parameters for prepared statement
     * @param stmt PreparedStatement
     * @param staff Staff object
     */
    private void setStaffParameters(PreparedStatement stmt, Staff staff) throws SQLException {
        stmt.setString(1, staff.getName());
        stmt.setString(2, staff.getEmail());
        stmt.setString(3, staff.getPhone());
        stmt.setString(4, staff.getDepartment());
        stmt.setString(5, staff.getPosition());
        stmt.setDate(6, staff.getHireDate() != null ?
                new java.sql.Date(staff.getHireDate().getTime()) : null);
        stmt.setString(7, staff.getStatus());
    }

    /**
     * Notify external systems of changes
     * Placeholder for inter-service communication
     */
    private void notifyExternalSystems(String entityType, int entityId, String operation, Object data) {
        try {
            // This is a placeholder for inter-service communication
            // In a real implementation, this would call other services or publish events

            // Example: If we need to notify the Auth Service when a staff is created
            if ("staff".equals(entityType) && "INSERT".equals(operation)) {
                Staff staff = (Staff) data;
                if (staff != null) {
                    System.out.println("Notifying Auth Service of new staff: " + staff.getStaffId());
                    // Create a user profile for the staff member
                    UserProfileService userProfileService = new UserProfileService();
                    userProfileService.createStaffUserProfile(staff);
                }
            }
        } catch (Exception e) {
            // Log error but don't interrupt main flow
            System.err.println("Failed to notify external systems: " + e.getMessage());
        }
    }
}