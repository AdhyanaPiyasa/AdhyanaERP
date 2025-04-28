// src/main/java/com/adhyana/course/services/SemesterService.java
package com.adhyana.course.services;

import com.adhyana.course.models.Semester;
import com.adhyana.course.models.SemesterOfferingDetail; // Still needed for fetching/display
import com.adhyana.course.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SemesterService {
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

    // Fetches offerings details for display (REMAINS THE SAME)
    private List<SemesterOfferingDetail> getSemesterOfferingsDetails(String semesterId) throws SQLException {
        List<SemesterOfferingDetail> offerings = new ArrayList<>();
        if (semesterId == null || semesterId.trim().isEmpty()) return offerings;
        String query = "SELECT so.course_id, s.name AS teacher_name " +
                "FROM semester_offerings so JOIN staff s ON so.staff_id = s.staff_id " +
                "WHERE so.semester_id = ?";
        // System.out.println("Attempting to fetch offerings for semesterId: [" + semesterId + "]");
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            if (conn == null || conn.isClosed()) return offerings;
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, semesterId);
                try (ResultSet rs = stmt.executeQuery()) {
                    int count = 0;
                    while (rs.next()) { count++; offerings.add(new SemesterOfferingDetail(rs.getString("course_id"), rs.getString("teacher_name"))); }
                    // System.out.println("Found " + count + " offerings for semesterId: [" + semesterId + "]");
                }
            }
        } catch (Exception e) { System.err.println("Error fetching semester offerings details for [" + semesterId + "]: " + e.getMessage()); }
        finally { if (conn != null) { try { if (!conn.isClosed()) conn.close(); } catch (SQLException e) { /* ignored */ } } }
        return offerings;
    }

    // Extracts core semester details (REMAINS THE SAME)
    private Semester extractSemesterFromResultSet(ResultSet rs) throws SQLException {
        return new Semester( rs.getString("semester_id"), rs.getString("batch_id"), rs.getInt("academic_year"), rs.getInt("semester_num"), rs.getDate("start_date"), rs.getDate("end_date"), rs.getString("status"), rs.getDate("created_at"), rs.getDate("updated_at"));
    }

    // Gets ALL semesters and populates offerings for display (REMAINS THE SAME)
    public List<Semester> getAllSemesters() throws Exception {
        System.out.println("getAllSemesters called"); List<Semester> semesters = new ArrayList<>(); String query = "SELECT * FROM semesters ORDER BY academic_year DESC, semester_num DESC";
        try (Connection conn = DatabaseConnection.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) { Semester semester = extractSemesterFromResultSet(rs); try { semester.setOfferings(getSemesterOfferingsDetails(semester.getSemesterId())); } catch (SQLException e) { System.err.println("Failed fetch offerings for " + semester.getSemesterId() + ": " + e.getMessage()); } semesters.add(semester); }
        } catch (SQLException e) { System.err.println("SQL Error getAllSemesters: " + e.getMessage()); throw e; }
        System.out.println("getAllSemesters returning " + semesters.size()); return semesters;
    }

    // Gets SINGLE semester by ID and populates offerings for display (REMAINS THE SAME)
    public Semester getSemesterById(String semesterId) throws Exception {
        System.out.println("getSemesterById called for semesterId: [" + semesterId + "]"); Semester semester = null; String query = "SELECT * FROM semesters WHERE semester_id = ?";
        try (Connection conn = DatabaseConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, semesterId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) { semester = extractSemesterFromResultSet(rs); try { semester.setOfferings(getSemesterOfferingsDetails(semester.getSemesterId())); } catch (SQLException e) { System.err.println("Failed fetch offerings for " + semester.getSemesterId() + ": " + e.getMessage()); } }
                else { System.out.println("Semester not found [" + semesterId + "]"); }
            }
        } catch (SQLException e) { System.err.println("SQL Error getSemesterById [" + semesterId + "]: " + e.getMessage()); throw e; }
        return semester;
    }

    // --- Simplified createSemester: Only inserts into semesters table ---
    public Semester createSemester(Semester semester) throws Exception {
        System.out.println("createSemester (Simplified) called for semesterId: " + semester.getSemesterId());
        String semesterQuery = "INSERT INTO semesters (semester_id, batch_id, academic_year, semester_num, " +
                "start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)";

        System.out.println("Service: Preparing to insert StartDate: " + semester.getStartDate()); // Log before insert
        System.out.println("Service: Preparing to insert EndDate: " + semester.getEndDate());     // Log before insert

        // Use try-with-resources for automatic closing
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmtSem = conn.prepareStatement(semesterQuery)) {

            stmtSem.setString(1, semester.getSemesterId());
            stmtSem.setString(2, semester.getBatchId());
            stmtSem.setInt(3, semester.getAcademicYear());
            stmtSem.setInt(4, semester.getSemesterNum());

            // Set Date, explicitly handling null from parsing (though validation should prevent)
            if (semester.getStartDate() != null) stmtSem.setDate(5, semester.getStartDate());
            else stmtSem.setNull(5, java.sql.Types.DATE);

            if (semester.getEndDate() != null) stmtSem.setDate(6, semester.getEndDate());
            else stmtSem.setNull(6, java.sql.Types.DATE);

            stmtSem.setString(7, semester.getStatus());

            int affectedRows = stmtSem.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating semester failed, no rows affected.");
            }
            System.out.println("Inserted semester details for ID: " + semester.getSemesterId());

            // Return the input semester object as confirmation (or fetch if needed)
            return semester;

        } catch (SQLException e) {
            System.err.println("SQL Error during createSemester: " + e.getMessage());
            e.printStackTrace(); // Log stack trace
            // Provide more specific error message based on SQL state or message if possible
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("cannot be null")) {
                throw new Exception("Database constraint violation: A required field (like start_date or end_date) was not provided or was invalid.", e);
            } else if (e.getMessage() != null && e.getMessage().toLowerCase().contains("duplicate entry")) {
                throw new Exception("Database constraint violation: Semester ID '" + semester.getSemesterId() + "' likely already exists.", e);
            }
            throw new Exception("Failed to create semester: " + e.getMessage(), e); // General rethrow
        }
        // No transaction needed for single table insert
    }
    // --- END Simplified createSemester ---


    // --- Simplified updateSemester: Only updates semesters table ---
    public boolean updateSemester(Semester semester) throws Exception {
        System.out.println("updateSemester (Simplified) called for semesterId: " + semester.getSemesterId());
        String semesterUpdateQuery = "UPDATE semesters SET batch_id = ?, academic_year = ?, semester_num = ?, " +
                "start_date = ?, end_date = ?, status = ? WHERE semester_id = ?";

        System.out.println("Service: Preparing to update StartDate: " + semester.getStartDate()); // Log before update
        System.out.println("Service: Preparing to update EndDate: " + semester.getEndDate());     // Log before update

        // Use try-with-resources
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmtSem = conn.prepareStatement(semesterUpdateQuery)) {

            stmtSem.setString(1, semester.getBatchId());
            stmtSem.setInt(2, semester.getAcademicYear());
            stmtSem.setInt(3, semester.getSemesterNum());
            if (semester.getStartDate() != null) stmtSem.setDate(4, semester.getStartDate()); else stmtSem.setNull(4, java.sql.Types.DATE);
            if (semester.getEndDate() != null) stmtSem.setDate(5, semester.getEndDate()); else stmtSem.setNull(5, java.sql.Types.DATE);
            stmtSem.setString(6, semester.getStatus());
            stmtSem.setString(7, semester.getSemesterId()); // WHERE clause

            int affectedRows = stmtSem.executeUpdate();
            System.out.println("Updated semesters table for ID: " + semester.getSemesterId() + ". Rows affected: " + affectedRows);
            // Consider update successful even if 0 rows affected (data might be unchanged)
            // Return true if the query executed without error. For stricter check use: return affectedRows > 0;
            return true;

        } catch (SQLException e) {
            System.err.println("SQL Error during updateSemester: " + e.getMessage()); e.printStackTrace();
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("cannot be null")) { throw new Exception("Database constraint violation during update.", e); }
            throw new Exception("Failed to update semester: " + e.getMessage(), e);
        }
        // No transaction needed for single table update
    }
    // --- END Simplified updateSemester ---

    // Deletes a Semester (Offerings deleted via DB Cascade) - REMAINS THE SAME
    public boolean deleteSemester(String semesterId) throws Exception {
        System.out.println("deleteSemester [" + semesterId + "]"); String q = "DELETE FROM semesters WHERE semester_id = ?"; int rows = 0;
        try (Connection c = DatabaseConnection.getConnection(); PreparedStatement s = c.prepareStatement(q)) { s.setString(1, semesterId); rows = s.executeUpdate(); System.out.println("deleteSemester rows: " + rows); }
        catch (SQLException e) { System.err.println("SQL Error deleteSemester [" + semesterId + "]: " + e.getMessage()); throw e; } return rows > 0;
    }

    // --- Other fetch methods (getSemestersByBatchId, searchSemestersByField) REMAINS THE SAME ---
    public List<Semester> getSemestersByBatchId(String batchId) throws Exception { /* ... as before ... */
        System.out.println("getSemestersByBatchId [" + batchId + "]"); List<Semester> ss = new ArrayList<>(); String q = "SELECT * FROM semesters WHERE batch_id = ?"; try (Connection c = DatabaseConnection.getConnection(); PreparedStatement s = c.prepareStatement(q)) { s.setString(1, batchId); try (ResultSet r = s.executeQuery()) { while (r.next()) { Semester sm = extractSemesterFromResultSet(r); try { sm.setOfferings(getSemesterOfferingsDetails(sm.getSemesterId())); } catch (SQLException e) { System.err.println("Failed fetch offerings for " + sm.getSemesterId() + ": " + e.getMessage()); } ss.add(sm); } } } catch (SQLException e) { System.err.println("SQL Error getSemestersByBatchId: " + e.getMessage()); throw e; } System.out.println("getSemestersByBatchId returning " + ss.size()); return ss;
    }
    public List<Semester> searchSemestersByField(String fieldName, String fieldValue) throws Exception { /* ... as before ... */
        System.out.println("searchSemestersByField: " + fieldName + "=" + fieldValue); if (!FIELD_MAPPINGS.containsKey(fieldName)) throw new IllegalArgumentException("Invalid field: " + fieldName); String col = FIELD_MAPPINGS.get(fieldName); List<Semester> ss = new ArrayList<>(); try (Connection c = DatabaseConnection.getConnection(); PreparedStatement s = createSearchStatement(c, col, fieldValue)) { try (ResultSet r = s.executeQuery()) { while (r.next()) { Semester sm = extractSemesterFromResultSet(r); try { sm.setOfferings(getSemesterOfferingsDetails(sm.getSemesterId())); } catch (SQLException e) { System.err.println("Failed fetch offerings for " + sm.getSemesterId() + ": " + e.getMessage()); } ss.add(sm); } } } catch (SQLException e) { System.err.println("SQL Error searchSemestersByField: " + e.getMessage()); throw e; } System.out.println("searchSemestersByField returning " + ss.size()); return ss;
    }
    private PreparedStatement createSearchStatement(Connection conn, String columnName, String fieldValue) throws SQLException { /* ... Java 11 compatible switch ... */
        String query; PreparedStatement stmt; switch (columnName) { case "semester_id": case "batch_id": case "status": query = "SELECT * FROM semesters WHERE " + columnName + " = ?"; stmt = conn.prepareStatement(query); stmt.setString(1, fieldValue); break; case "academic_year": case "semester_num": query = "SELECT * FROM semesters WHERE " + columnName + " = ?"; stmt = conn.prepareStatement(query); try { stmt.setInt(1, Integer.parseInt(fieldValue)); } catch (NumberFormatException e) { throw new SQLException("Invalid number: " + fieldValue); } break; case "start_date": case "end_date": query = "SELECT * FROM semesters WHERE " + columnName + " = ?"; stmt = conn.prepareStatement(query); try { stmt.setDate(1, Date.valueOf(fieldValue)); } catch (IllegalArgumentException e) { throw new SQLException("Invalid date format (Use yyyy-MM-dd): " + fieldValue); } break; default: throw new SQLException("Unsupported search column: " + columnName); } return stmt;
    }
}