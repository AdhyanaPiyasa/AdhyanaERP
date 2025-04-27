package com.adhyana.administration.services;

import com.adhyana.administration.models.Staff;
import com.adhyana.administration.models.StaffRole;
import com.adhyana.administration.models.StaffAttendance;
import com.adhyana.administration.utils.DatabaseConnection;
import com.adhyana.administration.utils.DDBMSClient;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Service for managing staff-related operations.
 * Updated to match the schema changes.
 */
public class StaffService {

        private static final Logger LOGGER = Logger.getLogger(StaffService.class.getName());
        private static final SimpleDateFormat SQL_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

        private final UserProfileService userProfileService = new UserProfileService(); // Assuming UserProfileService exists

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
     * Add a new staff member and notify DDBMS.
     * @param staff Staff to add
     * @return Added staff with ID
     */
    public Staff addStaff(Staff staff) throws Exception {
        String sql = "INSERT INTO staff (name, email, phone, department, position, hire_date, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet generatedKeys = null;
        Staff createdStaff = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            setStaffParameters(stmt, staff); // Helper to set parameters

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating staff failed, no rows affected.");
            }

            generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                int newId = generatedKeys.getInt(1);
                staff.setStaffId(newId); // Set the generated ID back to the object
                LOGGER.info("Staff created locally with ID: " + newId);

                // Commit local transaction before notifying DDBMS
                conn.commit();
                createdStaff = getStaffById(newId); // Fetch the created staff to return

                // --- Notify DDBMS ---
                String insertQueryString = reconstructInsertQuery(staff); // Reconstruct the query
                LOGGER.fine("Reconstructed INSERT query for DDBMS: " + insertQueryString);
                boolean notified = DDBMSClient.notifyDDBMS(insertQueryString, "staff");
                if (!notified) {
                    LOGGER.warning("Failed to notify DDBMS about staff creation (ID: " + newId + "). Data might be out of sync.");
                    // Decide on error handling: maybe log to a retry queue?
                } else {
                    LOGGER.info("DDBMS notified successfully for staff creation (ID: " + newId + ")");
                }
                // --- End Notify DDBMS ---

                // Notify Auth Service (existing logic)
                try {
                    userProfileService.createStaffUserProfile(staff);
                } catch (Exception e) {
                    LOGGER.log(Level.WARNING, "Failed to create user profile in Auth Service for staff ID: " + newId, e);
                    // Don't fail the whole operation for this
                }


            } else {
                conn.rollback(); // Rollback if ID wasn't obtained
                throw new SQLException("Creating staff failed, no ID obtained.");
            }

            return createdStaff; // Return the staff object with the ID

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error adding staff", e);
            if (conn != null) {
                try {
                    conn.rollback();
                    LOGGER.info("Transaction rolled back due to error.");
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Error rolling back transaction", ex);
                }
            }
            throw e; // Re-throw the exception
        } finally {
            // Close resources
            if (generatedKeys != null) try { generatedKeys.close(); } catch (SQLException e) { /* ignore */ }
            if (stmt != null) try { stmt.close(); } catch (SQLException e) { /* ignore */ }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true); // Restore default
                    conn.close();
                } catch (SQLException e) { /* ignore */ }
            }
        }
    }

    /**
     * Update an existing staff member and notify DDBMS.
     * @param staffId Staff ID to update
     * @param staff Updated staff data
     */
    public void updateStaff(int staffId, Staff staff) throws Exception {
        // Ensure the staff object has the correct ID for query reconstruction
        staff.setStaffId(staffId);

        String sql = "UPDATE staff SET name = ?, email = ?, phone = ?, " +
                "department = ?, position = ?, hire_date = ?, status = ? WHERE staff_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            stmt = conn.prepareStatement(sql);
            setStaffParameters(stmt, staff); // Set parameters 1 to 7
            stmt.setInt(8, staffId); // Set the WHERE clause parameter

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                conn.rollback(); // Rollback if staff not found
                throw new Exception("Staff not found with id: " + staffId);
            }

            LOGGER.info("Staff updated locally (ID: " + staffId + ")");
            conn.commit(); // Commit local transaction

            // --- Notify DDBMS ---
            String updateQueryString = reconstructUpdateQuery(staff); // Reconstruct the query
            LOGGER.fine("Reconstructed UPDATE query for DDBMS: " + updateQueryString);
            boolean notified = DDBMSClient.notifyDDBMS(updateQueryString, "staff");
            if (!notified) {
                LOGGER.warning("Failed to notify DDBMS about staff update (ID: " + staffId + "). Data might be out of sync.");
                // Log for retry?
            } else {
                LOGGER.info("DDBMS notified successfully for staff update (ID: " + staffId + ")");
            }
            // --- End Notify DDBMS ---

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating staff (ID: " + staffId + ")", e);
            if (conn != null) {
                try {
                    conn.rollback();
                    LOGGER.info("Transaction rolled back due to error.");
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Error rolling back transaction", ex);
                }
            }
            throw e;
        } finally {
            if (stmt != null) try { stmt.close(); } catch (SQLException e) { /* ignore */ }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) { /* ignore */ }
            }
        }
    }

    /**
     * Delete a staff member and notify DDBMS.
     * @param staffId Staff ID to delete
     */
    public void deleteStaff(int staffId) throws Exception {
        // First check if staff has any active roles or assignments (existing logic)
        // if (hasActiveAssignments(staffId)) {
        //     throw new Exception("Cannot delete staff with active assignments");
        // }

        String sql = "DELETE FROM staff WHERE staff_id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, staffId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                conn.rollback(); // Rollback if staff not found
                throw new Exception("Staff not found with id: " + staffId);
            }

            LOGGER.info("Staff deleted locally (ID: " + staffId + ")");
            conn.commit(); // Commit local transaction

            // --- Notify DDBMS ---
            String deleteQueryString = reconstructDeleteQuery(staffId); // Reconstruct the query
            LOGGER.fine("Reconstructed DELETE query for DDBMS: " + deleteQueryString);
            boolean notified = DDBMSClient.notifyDDBMS(deleteQueryString, "staff");
            if (!notified) {
                LOGGER.warning("Failed to notify DDBMS about staff deletion (ID: " + staffId + "). Data might be out of sync.");
                // Log for retry?
            } else {
                LOGGER.info("DDBMS notified successfully for staff deletion (ID: " + staffId + ")");
            }
            // --- End Notify DDBMS ---


        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error deleting staff (ID: " + staffId + ")", e);
            if (conn != null) {
                try {
                    conn.rollback();
                    LOGGER.info("Transaction rolled back due to error.");
                } catch (SQLException ex) {
                    LOGGER.log(Level.SEVERE, "Error rolling back transaction", ex);
                }
            }
            throw e;
        } finally {
            if (stmt != null) try { stmt.close(); } catch (SQLException e) { /* ignore */ }
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) { /* ignore */ }
            }
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
        // Handle potential null values gracefully for non-essential fields
        if (staff.getPhone() != null) {
            stmt.setString(3, staff.getPhone());
        } else {
            stmt.setNull(3, Types.VARCHAR);
        }
        if (staff.getDepartment() != null) {
            stmt.setString(4, staff.getDepartment());
        } else {
            stmt.setNull(4, Types.VARCHAR);
        }
        if (staff.getPosition() != null) {
            stmt.setString(5, staff.getPosition());
        } else {
            stmt.setNull(5, Types.VARCHAR);
        }
        if (staff.getHireDate() != null) {
            stmt.setDate(6, new java.sql.Date(staff.getHireDate().getTime()));
        } else {
            stmt.setNull(6, Types.DATE);
        }
        if (staff.getStatus() != null) {
            stmt.setString(7, staff.getStatus());
        } else {
            stmt.setString(7, "ACTIVE"); // Default if null
        }
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

    // --- Helper methods to reconstruct SQL queries ---

    private String reconstructInsertQuery(Staff staff) {
        // NOTE: This is error-prone. Assumes staff object has the ID already set.
        // It's better if the DDBMSClient could handle structured data,
        // but sticking to the "send query string" requirement.
        StringBuilder query = new StringBuilder("INSERT INTO staff (staff_id, name, email, phone, department, position, hire_date, status) VALUES (");
        query.append(staff.getStaffId()).append(", ");
        query.append("'").append(escapeSqlString(staff.getName())).append("', ");
        query.append("'").append(escapeSqlString(staff.getEmail())).append("', ");
        query.append(staff.getPhone() == null ? "NULL, " : "'" + escapeSqlString(staff.getPhone()) + "', ");
        query.append(staff.getDepartment() == null ? "NULL, " : "'" + escapeSqlString(staff.getDepartment()) + "', ");
        query.append(staff.getPosition() == null ? "NULL, " : "'" + escapeSqlString(staff.getPosition()) + "', ");
        query.append(staff.getHireDate() == null ? "NULL, " : "'" + SQL_DATE_FORMAT.format(staff.getHireDate()) + "', ");
        query.append("'").append(escapeSqlString(staff.getStatus() != null ? staff.getStatus() : "ACTIVE")).append("')"); // Default status if needed
        return query.toString();
    }

    private String reconstructUpdateQuery(Staff staff) {
        // NOTE: Also error-prone.
        StringBuilder query = new StringBuilder("UPDATE staff SET ");
        query.append("name = '").append(escapeSqlString(staff.getName())).append("', ");
        query.append("email = '").append(escapeSqlString(staff.getEmail())).append("', ");
        query.append("phone = ").append(staff.getPhone() == null ? "NULL, " : "'" + escapeSqlString(staff.getPhone()) + "', ");
        query.append("department = ").append(staff.getDepartment() == null ? "NULL, " : "'" + escapeSqlString(staff.getDepartment()) + "', ");
        query.append("position = ").append(staff.getPosition() == null ? "NULL, " : "'" + escapeSqlString(staff.getPosition()) + "', ");
        query.append("hire_date = ").append(staff.getHireDate() == null ? "NULL, " : "'" + SQL_DATE_FORMAT.format(staff.getHireDate()) + "', ");
        query.append("status = '").append(escapeSqlString(staff.getStatus() != null ? staff.getStatus() : "ACTIVE")).append("' ");
        query.append("WHERE staff_id = ").append(staff.getStaffId());
        return query.toString();
    }

    private String reconstructDeleteQuery(int staffId) {
        return "DELETE FROM staff WHERE staff_id = " + staffId;
    }

    /**
     * Basic SQL string escaping. Replace single quotes with two single quotes.
     * A more robust solution would handle other special characters.
     */
    private String escapeSqlString(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("'", "''");
    }

}