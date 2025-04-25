package com.adhyana.student.services;

import com.adhyana.student.models.Student;
import com.adhyana.student.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

public class StudentService {

    /**
     * Retrieves all students from the database
     *
     * Used by the student listing page (Image 1)
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
     * Retrieves a specific student by ID
     *
     * Used by the student view modal (Image 6)
     */
    public Student getStudent(int id) throws Exception {
        String query = "SELECT * FROM students WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToStudent(rs);
            }
        }
        return null;
    }

    /**
     * Retrieves all students with a specific degree ID
     *
     * @param degreeID The degree ID to filter by
     * @return List of students with the specified degree
     */
    public List<Student> getStudentsByDegreeID(String degreeID) throws Exception {
        List<Student> students = new ArrayList<>();
        String query = "SELECT * FROM students WHERE degree_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, degreeID);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Creates a new student in the database
     *
     * Used by the Add New Student modal (Images 2-3)
     */
    public Student createStudent(Student student) throws Exception {
        String query = "INSERT INTO students (name, email, degree_id,degree_program, index_number, " +
                "registration_number, mobile_number, birth_date, state) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setStudentParameters(stmt, student);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating student failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    student.setId(generatedKeys.getInt(1));
                    return student;
                } else {
                    throw new SQLException("Creating student failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Updates an existing student's information
     *
     * Used by the Edit Student modal (Image 4)
     */
    public void updateStudent(int id, Student student) throws Exception {
        // The UI shows only name, email, mobile number, and state can be updated
        // We'll use a more focused query to update only those fields
        String query = "UPDATE students SET name = ?, email = ?, mobile_number = ?, state = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setString(3, student.getMobileNumber());
            stmt.setString(4, student.getState());
            stmt.setInt(5, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating student failed, no rows affected.");
            }
        }
    }

    /**
     * Deletes a student from the database
     *
     * Used by the delete confirmation modal (Image 5)
     */
    public void deleteStudent(int id) throws Exception {
        String query = "DELETE FROM students WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting student failed, no rows affected.");
            }
        }
    }

    /**
     * Maps a database ResultSet to a Student object
     */
    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        return new Student(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("degree_id"),
                rs.getString("degree_program"),
                rs.getString("index_number"),
                rs.getString("registration_number"),
                rs.getString("mobile_number"),
                rs.getDate("birth_date").toLocalDate(),
                rs.getString("state")
        );
    }

    /**
     * Sets student parameters on a PreparedStatement for database operations
     */
    private void setStudentParameters(PreparedStatement stmt, Student student) throws SQLException {
        stmt.setString(1, student.getName());
        stmt.setString(2, student.getEmail());
        stmt.setString(3, student.getDegreeID());
        stmt.setString(4, student.getDegreeProgram());
        stmt.setString(5, student.getIndexNumber());
        stmt.setString(6, student.getRegistrationNumber());
        stmt.setString(7, student.getMobileNumber());
        stmt.setDate(8, Date.valueOf(student.getBirthDate()));
        stmt.setString(9, student.getState());
    }
}