package com.adhyana.course.services;

import com.adhyana.course.models.Teacher;
import com.adhyana.course.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

public class TeacherService {
    public List<Teacher> getAllTeachers() throws Exception {
        List<Teacher> teachers = new ArrayList<>();
        String query = "SELECT * FROM teachers";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                teachers.add(mapResultSetToTeacher(rs));
            }
        }
        return teachers;
    }

    public Teacher getTeacher(int id) throws Exception {
        String query = "SELECT * FROM teachers WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToTeacher(rs);
            }
        }
        return null;
    }

    public Teacher createTeacher(Teacher teacher) throws Exception {
        String query = "INSERT INTO teachers (name, email, phone, department, designation, joined_at) " +
                "VALUES (?, ?, ?, ?, ?, ?)";


        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setTeacherParameters(stmt, teacher);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating teacher failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    teacher.setId(generatedKeys.getInt(1));
                    return teacher;
                } else {
                    throw new SQLException("Creating teacher failed, no ID obtained.");
                }
            }
        }
    }

    public void updateTeacher(int id, Teacher teacher) throws Exception {
        String query = "UPDATE teachers SET name = ?, email= ?, phone = ?, department = ?, designation = ?, joined_at = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setTeacherParameters(stmt, teacher);
            stmt.setInt(7, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating teacher failed, no rows affected.");
            }
        }
    }

    public void deleteTeacher(int id) throws Exception {
        String query = "DELETE FROM teachers WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting teacher failed, no rows affected.");
            }
        }
    }

    private Teacher mapResultSetToTeacher(ResultSet rs) throws SQLException {
        return new Teacher(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("department"),
                rs.getString("designation"),
                rs.getDate("joined_at").toLocalDate()
        );
    }

    private void setTeacherParameters(PreparedStatement stmt, Teacher teacher) throws SQLException {
        stmt.setString(1, teacher.getName());
        stmt.setString(2, teacher.getEmail());
        stmt.setString(3, teacher.getPhone());
        stmt.setString(4, teacher.getDepartment());
        stmt.setString(5, teacher.getDesignation());
        stmt.setDate(6, Date.valueOf(teacher.getJoined_at()));

    }
}
