package com.adhyana.course.services;

import com.adhyana.course.models.Semester;
import com.adhyana.course.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SemesterService {
    // Map of field names to database column names
    private static final Map<String, String> FIELD_MAPPINGS = new HashMap<>();

    static {
        FIELD_MAPPINGS.put("semesterId", "semester_id");
        FIELD_MAPPINGS.put("batchId", "batch_id");
        FIELD_MAPPINGS.put("academicYear", "academic_year");
        FIELD_MAPPINGS.put("semesterNum", "semester_num");
        FIELD_MAPPINGS.put("startDate", "start_date");
        FIELD_MAPPINGS.put("endDate", "end_date");
        FIELD_MAPPINGS.put("status", "status");
    }

    // Get all semesters
    public List<Semester> getAllSemesters() throws Exception {
        List<Semester> semesters = new ArrayList<>();
        String query = "SELECT * FROM semesters";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                semesters.add(extractSemesterFromResultSet(rs));
            }
        }
        return semesters;
    }

    // Get semesters by batch ID
    public List<Semester> getSemestersByBatchId(String batchId) throws Exception {
        List<Semester> semesters = new ArrayList<>();
        String query = "SELECT * FROM semesters WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                semesters.add(extractSemesterFromResultSet(rs));
            }
        }
        return semesters;
    }

    // Generic search method that can handle any field
    public List<Semester> searchSemestersByField(String fieldName, String fieldValue) throws Exception {
        // Validate that the field name is valid
        if (!FIELD_MAPPINGS.containsKey(fieldName)) {
            throw new IllegalArgumentException("Invalid field name: " + fieldName);
        }

        String columnName = FIELD_MAPPINGS.get(fieldName);
        List<Semester> semesters = new ArrayList<>();

        // Build different queries based on field type
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = createSearchStatement(conn, columnName, fieldValue)) {

            System.out.println("Executing query: " + stmt.toString());
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Semester semester = extractSemesterFromResultSet(rs);
                semesters.add(semester);
                System.out.println("Found semester: " + semester.toString());
            }
        }

        return semesters;
    }

    // Helper method to create the appropriate prepared statement based on field type
    private PreparedStatement createSearchStatement(Connection conn, String columnName, String fieldValue) throws SQLException {
        String query;
        PreparedStatement stmt;

        // Handle special cases based on column type
        switch (columnName) {
            case "semester_id":
            case "batch_id":
            case "status":
                // String fields - exact match
                query = "SELECT * FROM semesters WHERE " + columnName + " = ?";
                stmt = conn.prepareStatement(query);
                stmt.setString(1, fieldValue);
                break;

            case "academic_year":
            case "semester_num":
                // Numeric fields - exact match
                query = "SELECT * FROM semesters WHERE " + columnName + " = ?";
                stmt = conn.prepareStatement(query);

                try {
                    // Try to parse as integer
                    int intValue = Integer.parseInt(fieldValue);
                    stmt.setInt(1, intValue);
                } catch (NumberFormatException e) {
                    // Handle invalid number format
                    throw new SQLException("Invalid numeric value for " + columnName + ": " + fieldValue);
                }
                break;

            case "start_date":
            case "end_date":
                // Date fields
                query = "SELECT * FROM semesters WHERE " + columnName + " = ?";
                stmt = conn.prepareStatement(query);

                try {
                    // Try to parse as date (assuming ISO format)
                    Date dateValue = Date.valueOf(fieldValue);
                    stmt.setDate(1, dateValue);
                } catch (IllegalArgumentException e) {
                    // Handle invalid date format
                    throw new SQLException("Invalid date format for " + columnName + ": " + fieldValue);
                }
                break;

            default:
                throw new SQLException("Unsupported column name: " + columnName);
        }

        return stmt;
    }

    // Helper method to extract a Semester object from ResultSet
    private Semester extractSemesterFromResultSet(ResultSet rs) throws SQLException {
        return new Semester(
                rs.getString("semester_id"),
                rs.getString("batch_id"),
                rs.getInt("academic_year"),
                rs.getInt("semester_num"),
                rs.getDate("start_date"),
                rs.getDate("end_date"),
                rs.getString("status"),
                rs.getDate("created_at"),
                rs.getDate("updated_at")
        );
    }

    // Get a semester by ID
    public Semester getSemesterById(String semesterId) throws Exception {
        List<Semester> semesters = searchSemestersByField("semesterId", semesterId);
        return semesters.isEmpty() ? null : semesters.get(0);
    }

    // Create a new semester
    public Semester createSemester(Semester semester) throws Exception {
        String query = "INSERT INTO semesters (semester_id, batch_id, academic_year, semester_num, " +
                "start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, semester.getSemesterId());
            stmt.setString(2, semester.getBatchId());
            stmt.setInt(3, semester.getAcademicYear());
            stmt.setInt(4, semester.getSemesterNum());
            stmt.setDate(5, semester.getStartDate());
            stmt.setDate(6, semester.getEndDate());
            stmt.setString(7, semester.getStatus());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating semester failed, no rows affected.");
            }

            return getSemesterById(semester.getSemesterId());
        }
    }

    // Update an existing semester
    public boolean updateSemester(Semester semester) throws Exception {
        String query = "UPDATE semesters SET batch_id = ?, academic_year = ?, semester_num = ?, " +
                "start_date = ?, end_date = ?, status = ? WHERE semester_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, semester.getBatchId());
            stmt.setInt(2, semester.getAcademicYear());
            stmt.setInt(3, semester.getSemesterNum());
            stmt.setDate(4, semester.getStartDate());
            stmt.setDate(5, semester.getEndDate());
            stmt.setString(6, semester.getStatus());
            stmt.setString(7, semester.getSemesterId());

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Delete a semester
    public boolean deleteSemester(String semesterId) throws Exception {
        String query = "DELETE FROM semesters WHERE semester_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, semesterId);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }
}