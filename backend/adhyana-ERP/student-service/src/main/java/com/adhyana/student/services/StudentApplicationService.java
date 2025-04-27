package com.adhyana.student.services;

import com.adhyana.student.models.StudentApplication;
import com.adhyana.student.utils.DatabaseConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class StudentApplicationService {

    /**
     * Creates a new student application in the database
     */
    public StudentApplication.ApplicationResponse createApplication(StudentApplication application) throws Exception {
        String query = "INSERT INTO student_applications (student_application_id,name, national_id, email, phone, gender, date_of_birth, " +
                "address, applied_program, application_date, mathematics, science, english, computer_studies, " +
                "guardian_name, guardian_national_id, guardian_relation, guardian_contact_number, guardian_email, " +
                "hostel_required, status) " +
                "VALUES (20,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            int i = 1;
            stmt.setString(i++, application.getName());
            stmt.setString(i++, application.getNationalId());
            stmt.setString(i++, application.getEmail());
            stmt.setString(i++, application.getPhone());
            stmt.setString(i++, application.getGender());
            stmt.setDate(i++, Date.valueOf(application.getDateOfBirth()));
            stmt.setString(i++, application.getAddress());
            stmt.setString(i++, application.getAppliedProgram());
            stmt.setDate(i++, Date.valueOf(application.getApplicationDate()));
            stmt.setString(i++, application.getMathematics());
            stmt.setString(i++, application.getScience());
            stmt.setString(i++, application.getEnglish());
            stmt.setString(i++, application.getComputerStudies());
            stmt.setString(i++, application.getGuardianName());
            stmt.setString(i++, application.getGuardianNationalId());
            stmt.setString(i++, application.getGuardianRelation());
            stmt.setString(i++, application.getGuardianContactNumber());
            stmt.setString(i++, application.getGuardianEmail());
            stmt.setString(i++, application.getHostelRequired());
            stmt.setString(i++, application.getStatus());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating application failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    application.setId(id);;

                    // Generate application ID with prefix "APP" followed by the generated ID with leading zeros
                    String applicantId = String.format("APP%06d", id);

                    return new StudentApplication.ApplicationResponse(
                            applicantId,
                            application.getName(),
                            application.getStatus()
                    );
                } else {
                    throw new SQLException("Creating application failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Retrieves all applications
     */
    public List<StudentApplication> getAllApplications() throws Exception {
        List<StudentApplication> applications = new ArrayList<>();
        String query = "SELECT * FROM student_applications ORDER BY application_date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                applications.add(mapResultSetToApplication(rs));
            }
        }
        return applications;
    }

    /**
     * Retrieves a specific application by ID
     */
    public StudentApplication getApplication(int id) throws Exception {
        String query = "SELECT * FROM student_applications WHERE student_application_id = ?";

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

    /**
     * Updates an application status
     */
    public void updateApplicationStatus(int id, String status) throws Exception {
        String query = "UPDATE student_applications SET status = ? WHERE student_application_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, status);
            stmt.setInt(2, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating application status failed, no rows affected.");
            }
        }
    }

    /**
     * Retrieves applications by status
     */
    public List<StudentApplication> getApplicationsByStatus(String status) throws Exception {
        List<StudentApplication> applications = new ArrayList<>();
        String query = "SELECT * FROM student_applications WHERE status = ? ORDER BY application_date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, status);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                applications.add(mapResultSetToApplication(rs));
            }
        }
        return applications;
    }

    /**
     * Helper method to map ResultSet to StudentApplication
     */
    private StudentApplication mapResultSetToApplication(ResultSet rs) throws SQLException {
        return new StudentApplication(
                rs.getInt("student_application_id"),
                rs.getString("name"),
                rs.getString("national_id"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("gender"),
                rs.getDate("date_of_birth").toLocalDate(),
                rs.getString("address"),
                rs.getString("applied_program"),
                rs.getDate("application_date").toLocalDate(),
                rs.getString("mathematics"),
                rs.getString("science"),
                rs.getString("english"),
                rs.getString("computer_studies"),
                rs.getString("guardian_name"),
                rs.getString("guardian_national_id"),
                rs.getString("guardian_relation"),
                rs.getString("guardian_contact_number"),
                rs.getString("guardian_email"),
                rs.getString("hostel_required"),
                rs.getString("status")
        );
    }
}