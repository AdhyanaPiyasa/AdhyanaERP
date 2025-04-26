// semester-service/src/main/java/com/adhyana/semester/services/SemesterService.java
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
        FIELD_MAPPINGS.put("id", "id");
        FIELD_MAPPINGS.put("batchId", "batchId");
        FIELD_MAPPINGS.put("courseId", "courseId");
        FIELD_MAPPINGS.put("teacherId", "teacherId");
        FIELD_MAPPINGS.put("year", "year");
        FIELD_MAPPINGS.put("semester", "semester");
        FIELD_MAPPINGS.put("startedAt", "started_at");
        FIELD_MAPPINGS.put("endedAt", "ended_at");
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
    public List<Semester> getSemestersByBatchId(int batchId) throws Exception {
        List<Semester> semesters = new ArrayList<>();
        String query = "SELECT * FROM semesters WHERE batchId = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, batchId);
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
        if (!FIELD_MAPPINGS.containsKey(fieldName.toLowerCase())) {
            throw new IllegalArgumentException("Invalid field name: " + fieldName);
        }

        String columnName = FIELD_MAPPINGS.get(fieldName.toLowerCase());
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
            case "id":
            case "batchId":
            case "courseId":
            case "teacherId":
            case "year":
            case "semester":
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

            case "started_at":
            case "ended_at":
                // Text field for dates - use LIKE for partial matches
                query = "SELECT * FROM semesters WHERE " + columnName + " LIKE ?";
                stmt = conn.prepareStatement(query);
                stmt.setString(1, "%" + fieldValue + "%");
                break;

            default:
                throw new SQLException("Unsupported column name: " + columnName);
        }

        return stmt;
    }

    // Helper method to extract a Semester object from ResultSet
    private Semester extractSemesterFromResultSet(ResultSet rs) throws SQLException {
        // Format month and year for started_at and ended_at
        Date startedDate = rs.getDate("started_at");
        Date endedDate = rs.getDate("ended_at");

        String startedAt = formatMonthYear(startedDate);
        String endedAt = formatMonthYear(endedDate);

        return new Semester(
                rs.getInt("id"),
                rs.getInt("batchId"),
                rs.getInt("courseId"),
                rs.getInt("teacherId"),
                rs.getInt("year"),
                rs.getInt("semester"),
                startedAt,
                endedAt,
                rs.getDate("created_at"),
                rs.getDate("updated_at")
        );
    }

    // Helper method to format date as Month Year
    private String formatMonthYear(Date date) {
        if (date == null) return null;

        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);

        String[] months = {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        };

        int month = cal.get(java.util.Calendar.MONTH);
        int year = cal.get(java.util.Calendar.YEAR);

        return months[month] + " " + year;
    }

    // Get a semester by ID
    public Semester getSemesterById(int id) throws Exception {
        List<Semester> semesters = searchSemestersByField("id", String.valueOf(id));
        return semesters.isEmpty() ? null : semesters.get(0);
    }

    // Create a new semester
    public Semester createSemester(Semester semester) throws Exception {
        String query = "INSERT INTO semesters (batchId, courseId, teacherId, year, semester, started_at, ended_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, semester.getBatchId());
            stmt.setInt(2, semester.getCourseId());
            stmt.setInt(3, semester.getTeacherId());
            stmt.setInt(4, semester.getYear());
            stmt.setInt(5, semester.getSemester());

            // Parse the month and year strings to Date objects
            stmt.setDate(6, parseMonthYearToDate(semester.getStartedAt()));
            stmt.setDate(7, parseMonthYearToDate(semester.getEndedAt()));

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating semester failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    semester.setId(generatedKeys.getInt(1));
                    return getSemesterById(semester.getId());
                } else {
                    throw new SQLException("Creating semester failed, no ID obtained.");
                }
            }
        }
    }

    // Update an existing semester
    public boolean updateSemester(Semester semester) throws Exception {
        String query = "UPDATE semesters SET batchId = ?, courseId = ?, teacherId = ?, " +
                "year = ?, semester = ?, started_at = ?, ended_at = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, semester.getBatchId());
            stmt.setInt(2, semester.getCourseId());
            stmt.setInt(3, semester.getTeacherId());
            stmt.setInt(4, semester.getYear());
            stmt.setInt(5, semester.getSemester());

            // Parse the month and year strings to Date objects
            stmt.setDate(6, parseMonthYearToDate(semester.getStartedAt()));
            stmt.setDate(7, parseMonthYearToDate(semester.getEndedAt()));
            stmt.setInt(8, semester.getId());

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Delete a semester
    public boolean deleteSemester(int id) throws Exception {
        String query = "DELETE FROM semesters WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Helper method to parse Month Year string to SQL Date
    private java.sql.Date parseMonthYearToDate(String monthYear) throws SQLException {
        if (monthYear == null || monthYear.trim().isEmpty()) {
            return null;
        }

        try {
            String[] parts = monthYear.split(" ");
            if (parts.length != 2) {
                throw new SQLException("Invalid month year format: " + monthYear + ". Expected format: 'Month Year'");
            }

            String month = parts[0].trim();
            int year = Integer.parseInt(parts[1].trim());

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.clear();

            // Map month name to month number (0-based in Calendar)
            String[] months = {
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
            };

            int monthIndex = -1;
            for (int i = 0; i < months.length; i++) {
                if (months[i].equalsIgnoreCase(month)) {
                    monthIndex = i;
                    break;
                }
            }

            if (monthIndex == -1) {
                throw new SQLException("Invalid month name: " + month);
            }

            cal.set(year, monthIndex, 1); // Day is set to 1

            return new java.sql.Date(cal.getTimeInMillis());
        } catch (NumberFormatException e) {
            throw new SQLException("Invalid year format in: " + monthYear, e);
        } catch (Exception e) {
            throw new SQLException("Error parsing month year: " + monthYear, e);
        }
    }
}