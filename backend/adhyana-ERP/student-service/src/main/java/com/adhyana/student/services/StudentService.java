package com.adhyana.student.services;

import com.adhyana.student.models.Student;
import com.adhyana.student.models.EnrolledStudent;
import com.adhyana.student.utils.DatabaseConnection;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class StudentService {

    /**
     * Retrieves all students from the students table
     */
    public List<Student> getAllStudents() throws Exception {
        List<Student> students = new ArrayList<>();
        String query = "SELECT * FROM students";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Retrieves a specific student by student index
     */
    public Student getStudent(int studentIndex) throws Exception {
        String query = "SELECT * FROM students WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToStudent(rs);
            }
        }
        return null;
    }

    /**
     * Retrieves all students with a specific batch ID
     */
    public List<Student> getStudentsByBatchId(String batchId) throws Exception {
        List<Student> students = new ArrayList<>();
        String query = "SELECT * FROM students WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Creates a new student in the students table
     */
    public Student createStudent(Student student) throws Exception {
        String query = "INSERT INTO students (student_index, registration_number, name, email, batch_id) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setStudentParameters(stmt, student);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating student failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    student.setStudentIndex(generatedKeys.getInt(1));
                    return student;
                } else {
                    throw new SQLException("Creating student failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Updates an existing student's information in the students table
     */
    public void updateStudent(int studentIndex, Student student) throws Exception {
        String query = "UPDATE students SET name = ?, email = ?, batch_id = ? WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setString(3, student.getBatchId());
            stmt.setInt(4, studentIndex);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating student failed, no rows affected.");
            }
        }
    }

    /**
     * Deletes a student from the students table
     */
    public void deleteStudent(int studentIndex) throws Exception {
        String query = "DELETE FROM students WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting student failed, no rows affected.");
            }
        }
    }

    /**
     * Retrieves all enrolled students
     */
    public List<EnrolledStudent> getAllEnrolledStudents() throws Exception {
        List<EnrolledStudent> students = new ArrayList<>();
        String query = "SELECT * FROM enrolled_students";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                students.add(mapResultSetToEnrolledStudent(rs));
            }
        }
        return students;
    }

    /**
     * Retrieves a specific enrolled student by student index
     */
    public EnrolledStudent getEnrolledStudent(int studentIndex) throws Exception {
        String query = "SELECT * FROM enrolled_students WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToEnrolledStudent(rs);
            }
        }
        return null;
    }

    /**
     * Retrieves all enrolled students with a specific batch ID
     */
    public List<EnrolledStudent> getEnrolledStudentsByBatchId(String batchId) throws Exception {
        List<EnrolledStudent> students = new ArrayList<>();
        String query = "SELECT * FROM enrolled_students WHERE batch_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                students.add(mapResultSetToEnrolledStudent(rs));
            }
        }
        return students;
    }

    /**
     * Creates a new enrolled student
     */
    public EnrolledStudent createEnrolledStudent(EnrolledStudent student) throws Exception {
        String query = "INSERT INTO enrolled_students (registration_number, batch_id, name, national_id, " +
                "email, phone, gender, date_of_birth, address, guardian_name, guardian_national_id, " +
                "guardian_relation, guardian_contact_number, guardian_email, hostel_required) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setEnrolledStudentParameters(stmt, student);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating enrolled student failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    student.setStudentIndex(generatedKeys.getInt(1));

                    // Also create entry in the students table
                    Student baseStudent = new Student(
                            student.getStudentIndex(),
                            student.getRegistrationNumber(),
                            student.getName(),
                            student.getEmail(),
                            student.getBatchId()
                    );
                    createStudent(baseStudent);

                    return student;
                } else {
                    throw new SQLException("Creating enrolled student failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Updates an existing enrolled student's information
     */
    public void updateEnrolledStudent(int studentIndex, EnrolledStudent student) throws Exception {
        String query = "UPDATE enrolled_students SET registration_number = ?, batch_id = ?, name = ?, " +
                "national_id = ?, email = ?, phone = ?, gender = ?, date_of_birth = ?, address = ?, " +
                "guardian_name = ?, guardian_national_id = ?, guardian_relation = ?, " +
                "guardian_contact_number = ?, guardian_email = ?, hostel_required = ? " +
                "WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, student.getRegistrationNumber());
            stmt.setString(2, student.getBatchId());
            stmt.setString(3, student.getName());
            stmt.setString(4, student.getNationalId());
            stmt.setString(5, student.getEmail());
            stmt.setString(6, student.getPhone());
            stmt.setString(7, student.getGender());
            stmt.setDate(8, Date.valueOf(student.getDateOfBirth()));
            stmt.setString(9, student.getAddress());
            stmt.setString(10, student.getGuardianName());
            stmt.setString(11, student.getGuardianNationalId());
            stmt.setString(12, student.getGuardianRelation());
            stmt.setString(13, student.getGuardianContactNumber());
            stmt.setString(14, student.getGuardianEmail());
            stmt.setString(15, student.getHostelRequired());
            stmt.setInt(16, studentIndex);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating enrolled student failed, no rows affected.");
            }

            // Also update the corresponding entry in the students table
            Student baseStudent = new Student(
                    studentIndex,
                    student.getRegistrationNumber(),
                    student.getName(),
                    student.getEmail(),
                    student.getBatchId()
            );
            updateStudent(studentIndex, baseStudent);
        }
    }

    /**
     * Deletes an enrolled student
     */
    public void deleteEnrolledStudent(int studentIndex) throws Exception {
        String query = "DELETE FROM enrolled_students WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting enrolled student failed, no rows affected.");
            }

            // Also delete from the students table
            deleteStudent(studentIndex);
        }
    }

    /**
     * Maps a database ResultSet to a Student object
     */
    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        LocalDateTime createdAt = null;
        if (rs.getTimestamp("created_at") != null) {
            createdAt = rs.getTimestamp("created_at").toLocalDateTime();
        }

        LocalDateTime updatedAt = null;
        if (rs.getTimestamp("updated_at") != null) {
            updatedAt = rs.getTimestamp("updated_at").toLocalDateTime();
        }

        return new Student(
                rs.getInt("student_index"),
                rs.getString("registration_number"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("batch_id"),
                createdAt,
                updatedAt
        );
    }

    /**
     * Maps a database ResultSet to an EnrolledStudent object
     */
    private EnrolledStudent mapResultSetToEnrolledStudent(ResultSet rs) throws SQLException {
        LocalDateTime createdAt = null;
        if (rs.getTimestamp("created_at") != null) {
            createdAt = rs.getTimestamp("created_at").toLocalDateTime();
        }

        LocalDateTime updatedAt = null;
        if (rs.getTimestamp("updated_at") != null) {
            updatedAt = rs.getTimestamp("updated_at").toLocalDateTime();
        }

        return new EnrolledStudent(
                rs.getInt("student_index"),
                rs.getString("registration_number"),
                rs.getString("batch_id"),
                rs.getString("name"),
                rs.getString("national_id"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("gender"),
                rs.getDate("date_of_birth").toLocalDate(),
                rs.getString("address"),
                rs.getString("guardian_name"),
                rs.getString("guardian_national_id"),
                rs.getString("guardian_relation"),
                rs.getString("guardian_contact_number"),
                rs.getString("guardian_email"),
                rs.getString("hostel_required"),
                createdAt,
                updatedAt
        );
    }

    /**
     * Sets student parameters on a PreparedStatement for database operations
     */
    private void setStudentParameters(PreparedStatement stmt, Student student) throws SQLException {
        stmt.setInt(1, student.getStudentIndex());
        stmt.setString(2, student.getRegistrationNumber());
        stmt.setString(3, student.getName());
        stmt.setString(4, student.getEmail());
        stmt.setString(5, student.getBatchId());
    }

    /**
     * Sets enrolled student parameters on a PreparedStatement for database operations
     */
    private void setEnrolledStudentParameters(PreparedStatement stmt, EnrolledStudent student) throws SQLException {
        stmt.setString(1, student.getRegistrationNumber());
        stmt.setString(2, student.getBatchId());
        stmt.setString(3, student.getName());
        stmt.setString(4, student.getNationalId());
        stmt.setString(5, student.getEmail());
        stmt.setString(6, student.getPhone());
        stmt.setString(7, student.getGender());
        stmt.setDate(8, Date.valueOf(student.getDateOfBirth()));
        stmt.setString(9, student.getAddress());
        stmt.setString(10, student.getGuardianName());
        stmt.setString(11, student.getGuardianNationalId());
        stmt.setString(12, student.getGuardianRelation());
        stmt.setString(13, student.getGuardianContactNumber());
        stmt.setString(14, student.getGuardianEmail());
        stmt.setString(15, student.getHostelRequired());
    }
}