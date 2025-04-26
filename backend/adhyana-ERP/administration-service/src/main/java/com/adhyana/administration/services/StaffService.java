package com.adhyana.administration.services;

import com.adhyana.administration.models.Staff;
import com.adhyana.administration.models.StaffRole;
import com.adhyana.administration.utils.DatabaseConnection;
import com.adhyana.administration.utils.DDBMSClient;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StaffService {

    public List<Staff> getAllStaff() throws Exception {
        List<Staff> staffList = new ArrayList<>();
        String query = "SELECT * FROM staff ORDER BY id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                staffList.add(mapResultSetToStaff(rs));
            }
        }
        return staffList;
    }

    public Staff getStaffById(int id) throws Exception {
        String query = "SELECT * FROM staff WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToStaff(rs);
            }
        }
        return null;
    }

    public Staff addStaff(Staff staff) throws Exception {
        String query = "INSERT INTO staff (first_name, last_name, email, phone, department, position, hire_date, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setStaffParameters(stmt, staff);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Creating staff failed, no rows affected.");
            }

            // build the *exact* SQL string we just ran
            String filledSql = String.format(
                    "INSERT INTO courses (code, name, year, semester, credits, duration) " +
                            "VALUES (%d, '%s', %d, %d, %d, %d)",
                    staff.getCode(),
                    course.getName().replace("'", "''"),  // basic escaping
                    course.getYear(),
                    course.getSemester(),
                    course.getCredits(),
                    course.getDuration()
            );

            // **replicate** to DDBMS
            replicateQuery(filledSql, "courses");

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    staff.setId(generatedKeys.getInt(1));

                    // Return the newly created staff object
                    return getStaffById(staff.getId());
                } else {
                    throw new Exception("Creating staff failed, no ID obtained.");
                }
            }
        }
    }

    public void updateStaff(int id, Staff staff) throws Exception {
        String query = "UPDATE staff SET first_name = ?, last_name = ?, email = ?, phone = ?, " +
                "department = ?, position = ?, hire_date = ?, status = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setStaffParameters(stmt, staff);
            stmt.setInt(9, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Staff not found with id: " + id);
            }

            // Notify DDBMS about the staff update
            Map<String, Object> data = new HashMap<>();
            data.put("name", staff.getFirstName() + " " + staff.getLastName());
            data.put("email", staff.getEmail());
            data.put("phone", staff.getPhone());
            data.put("department", staff.getDepartment());
            data.put("position", staff.getPosition());
            data.put("hire_date", staff.getHireDate().toString());
            data.put("status", staff.getStatus());
            DDBMSClient.notifyDDBMS("staff", id, "UPDATE", data);
        }
    }

    public void deleteStaff(int id) throws Exception {
        // First check if staff has any active roles or assignments
        if (hasActiveAssignments(id)) {
            throw new Exception("Cannot delete staff with active assignments");
        }

        String query = "DELETE FROM staff WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Staff not found with id: " + id);
            }

            // Notify DDBMS about the staff deletion
            DDBMSClient.notifyDDBMS("staff", id, "DELETE", null);
        }
    }

    private boolean hasActiveAssignments(int staffId) throws Exception {
        String query = "SELECT COUNT(*) FROM batch_faculty_assignments WHERE staff_id = ? AND status = 'ACTIVE'";

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

    private Staff mapResultSetToStaff(ResultSet rs) throws SQLException {
        Staff staff = new Staff();
        staff.setId(rs.getInt("id"));
        staff.setFirstName(rs.getString("first_name"));
        staff.setLastName(rs.getString("last_name"));
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

    private StaffRole mapResultSetToStaffRole(ResultSet rs) throws SQLException {
        StaffRole role = new StaffRole();
        role.setId(rs.getInt("id"));
        role.setStaffId(rs.getInt("staff_id"));
        role.setRole(rs.getString("role"));
        role.setAssignedDate(rs.getDate("assigned_date"));
        role.setCreatedAt(rs.getTimestamp("created_at"));
        role.setUpdatedAt(rs.getTimestamp("updated_at"));
        return role;
    }

    private void setStaffParameters(PreparedStatement stmt, Staff staff) throws SQLException {
        stmt.setString(1, staff.getFirstName());
        stmt.setString(2, staff.getLastName());
        stmt.setString(3, staff.getEmail());
        stmt.setString(4, staff.getPhone());
        stmt.setString(5, staff.getDepartment());
        stmt.setString(6, staff.getPosition());
        stmt.setDate(7, staff.getHireDate() != null ? new java.sql.Date(staff.getHireDate().getTime()) : null);
        stmt.setString(8, staff.getStatus());
    }

    /**
     * Sends the exact SQL string + table name to the DDBMS via your API Gateway.
     */
    private void replicateQuery(String sql, String table) {
        try {
            // build payload
            String payload = String.format(
                    "{\"query\":\"%s\",\"table\":\"%s\"}",
                    sql.replace("\"", "\\\""),
                    table
            );

            // call API Gateway → DDBMS
            URL url = new URL("http://localhost:8081/api/ddbms/replicate");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload.getBytes(StandardCharsets.UTF_8));
            }
            conn.getResponseCode();  // you can check/handle errors if you like
        } catch (Exception e) {
            // swallow or log; best-effort replication
            System.err.println("Replication failed: " + e.getMessage());
        }
    }
}
