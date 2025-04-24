package com.adhyana.exam.services;

import com.adhyana.exam.models.Exam;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ExamService {
    public List<Exam> getAllExams() throws Exception {
        List<Exam> exams = new ArrayList<>();
        String query = "SELECT * FROM exams ORDER BY date, start_time";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                exams.add(createExamFromResultSet(rs));
            }
        }
        return exams;
    }

    public Exam getExam(int id) throws Exception {
        String query = "SELECT * FROM exams WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return createExamFromResultSet(rs);
            }
        }
        return null;
    }

    public Exam createExam(Exam exam) throws Exception {
        String query = "INSERT INTO exams (title, course, course_code, date, " +
                "start_time, end_time, room, teacher) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setExamParameters(stmt, exam);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating exam failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    exam.setId(generatedKeys.getInt(1));
                    return exam;
                } else {
                    throw new SQLException("Creating exam failed, no ID obtained.");
                }
            }
        }
    }

    public void updateExam(int id, Exam exam) throws Exception {
        String query = "UPDATE exams SET title = ?, course = ?, course_code = ?, date = ?, " +
                "start_time = ?, end_time = ?, room = ?, teacher = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setExamParameters(stmt, exam);
            stmt.setInt(9, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating exam failed, no rows affected.");
            }
        }
    }

    public void deleteExam(int id) throws Exception {
        String query = "DELETE FROM exams WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting exam failed, no rows affected.");
            }
        }
    }

    private Exam createExamFromResultSet(ResultSet rs) throws SQLException {
        return new Exam(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getString("course"),
                rs.getInt("course_code"),
                rs.getString("date"),
                rs.getString("start_time"),
                rs.getString("end_time"),
                rs.getString("room"),
                rs.getString("teacher")
        );
    }

    private void setExamParameters(PreparedStatement stmt, Exam exam) throws SQLException {
        stmt.setString(1, exam.getTitle());
        stmt.setString(2, exam.getCourse());
        stmt.setInt(3, exam.getCourseCode());
        stmt.setString(4, exam.getDate());
        stmt.setString(5, exam.getStartTime());
        stmt.setString(6, exam.getEndTime());
        stmt.setString(7, exam.getRoom());
        stmt.setString(8, exam.getTeacher());
    }
}
