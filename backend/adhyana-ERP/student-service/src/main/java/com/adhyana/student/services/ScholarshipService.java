// student-service/src/main/java/com/adhyana/student/services/ScholarshipService.java
package com.adhyana.student.services;

import com.adhyana.student.models.Scholarship;
import com.adhyana.student.models.ScholarshipApplication;
import com.adhyana.student.utils.DatabaseConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ScholarshipService {

    // *Scholarship CRUD operations*

    //get all scholarships
    public List<Scholarship> getAllScholarships() throws Exception {
        List<Scholarship> scholarships = new ArrayList<>();
        String query = "SELECT * FROM scholarships";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                scholarships.add(mapResultSetToScholarship(rs));
            }
        }
        return scholarships;
    }

    // get scholarship using scholarship id
    public Scholarship getScholarship(int id) throws Exception {
        String query = "SELECT * FROM scholarships WHERE scholarship_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToScholarship(rs);
            }
        }
        return null;
    }

    // create a scholarship
    public Scholarship createScholarship(Scholarship scholarship) throws Exception {
        String query = "INSERT INTO scholarships (name, description, min_gpa, amount, application_deadline) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setScholarshipParameters(stmt, scholarship);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating scholarship failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    scholarship.setId(generatedKeys.getInt(1));
                    return scholarship;
                } else {
                    throw new SQLException("Creating scholarship failed, no ID obtained.");
                }
            }
        }
    }

    // update scholarship
    public void updateScholarship(int id, Scholarship scholarship) throws Exception {
        String query = "UPDATE scholarships SET name = ?, description = ?, min_gpa = ?, " +
                "amount = ?, application_deadline = ? WHERE scholarship_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setScholarshipParameters(stmt, scholarship);
            stmt.setInt(6, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating scholarship failed, no rows affected.");
            }
        }
    }

    //delete a scholarship
    public void deleteScholarship(int id) throws Exception {
        String query = "DELETE FROM scholarships WHERE scholarship_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting scholarship failed, no rows affected.");
            }
        }
    }

    // *ScholarshipApplication CRUD operations*
    public List<ScholarshipApplication> getAllApplications() throws Exception {
        List<ScholarshipApplication> applications = new ArrayList<>();
        String query = "SELECT * FROM scholarship_applications";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                applications.add(mapResultSetToApplication(rs));
            }
        }
        return applications;
    }

    public ScholarshipApplication getApplication(int id) throws Exception {
        String query = "SELECT * FROM scholarship_applications WHERE scholarship_application_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToApplication(rs);
            }
        }
        return null;
    }

    public ScholarshipApplication getApplicationByStudentId(int studentIndexNumber) throws Exception {
        String query = "SELECT * FROM scholarship_applications WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndexNumber);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToApplication(rs);
            }
        }
        return null;
    }

    public ScholarshipApplication applyForScholarship(ScholarshipApplication application) throws Exception {
        String query = "INSERT INTO scholarship_applications (student_index, scholarship_id, student_batch, " +
                "student_degree, student_gpa, status, comments) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setApplicationParameters(stmt, application);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating application failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    application.setId(generatedKeys.getInt(1));
                    return application;
                } else {
                    throw new SQLException("Creating application failed, no ID obtained.");
                }
            }
        }
    }

    public void updateApplicationStatus(int id, String status, String comments) throws Exception {
        String query = "UPDATE scholarship_applications SET status = ?, comments = ? WHERE scholarship_application_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, status);
            stmt.setString(2, comments);
            stmt.setInt(3, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating application status failed, no rows affected.");
            }
        }
    }

    // Process scholarship applications based on GPA criteria
    public int processScholarshipApplications(int scholarshipId) throws Exception {
        // Get the scholarship details to check minimum GPA
        Scholarship scholarship = getScholarship(scholarshipId);
        if (scholarship == null) {
            throw new Exception("Scholarship not found");
        }

        double minGpa = scholarship.getMinGpa();

        // Update all pending applications for this scholarship
        String query = "UPDATE scholarship_applications SET status = ?, comments = ? " +
                "WHERE scholarship_id = ? AND status = 'Pending' " +
                "AND student_gpa >= ?";

        String rejectQuery = "UPDATE scholarship_applications SET status = ?, comments = ? " +
                "WHERE scholarship_id = ? AND status = 'Pending' " +
                "AND student_gpa < ?";

        try (Connection conn = DatabaseConnection.getConnection()) {
            // First, approve eligible applications
            try (PreparedStatement approveStmt = conn.prepareStatement(query)) {
                approveStmt.setString(1, "Approved");
                approveStmt.setString(2, "Automatically approved based on GPA criteria");
                approveStmt.setInt(3, scholarshipId);
                approveStmt.setDouble(4, minGpa);

                int approvedCount = approveStmt.executeUpdate();

                // Then, reject ineligible applications
                try (PreparedStatement rejectStmt = conn.prepareStatement(rejectQuery)) {
                    rejectStmt.setString(1, "Rejected");
                    rejectStmt.setString(2, "GPA does not meet minimum requirement of " + minGpa);
                    rejectStmt.setInt(3, scholarshipId);
                    rejectStmt.setDouble(4, minGpa);

                    int rejectedCount = rejectStmt.executeUpdate();

                    return approvedCount;
                }
            }
        }
    }

    // Helper methods
    private Scholarship mapResultSetToScholarship(ResultSet rs) throws SQLException {
        return new Scholarship(
                rs.getInt("scholarship_id"),
                rs.getString("name"),
                rs.getString("description"),
                rs.getDouble("min_gpa"),
                rs.getBigDecimal("amount"),
                rs.getDate("application_deadline").toLocalDate()
        );
    }

    private ScholarshipApplication mapResultSetToApplication(ResultSet rs) throws SQLException {
        return new ScholarshipApplication(
                rs.getInt("scholarship_application_id"),
                rs.getInt("student_index"),
                rs.getInt("scholarship_id"),
                rs.getString("student_batch"),
                rs.getString("student_batch"),
                rs.getDouble("student_gpa"),
                rs.getString("status"),
                rs.getString("comments")
        );
    }

    private void setScholarshipParameters(PreparedStatement stmt, Scholarship scholarship) throws SQLException {
        stmt.setString(1, scholarship.getName());
        stmt.setString(2, scholarship.getDescription());
        stmt.setDouble(3, scholarship.getMinGpa());
        stmt.setBigDecimal(4, scholarship.getAmount());
        stmt.setDate(5, Date.valueOf(scholarship.getApplicationDeadline()));
    }

    private void setApplicationParameters(PreparedStatement stmt, ScholarshipApplication application) throws SQLException {
        stmt.setInt(1, application.getStudentIndexNumber());
        stmt.setInt(2, application.getScholarshipId());
        stmt.setString(3, application.getStudentBatch());
        stmt.setString(4, application.getStudentDegree());
        stmt.setDouble(5, application.getStudentGpa());
        stmt.setString(6, application.getStatus());
        stmt.setString(7, application.getComments());
    }
}