package com.adhyana.exam.services;

import com.adhyana.exam.models.Exam;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ExamService {
    public List<Exam> getAllExams() throws Exception {
        List<Exam> exams = new ArrayList<>();
        String query = "SELECT exam_id, title, semester_id, exam_date, start_time, end_time, location, type FROM exams ORDER BY exam_date, start_time";

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
        String query = "SELECT exam_id, title, semester_id, exam_date, start_time, end_time, location, type FROM exams WHERE exam_id = ?";

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
        String query = "INSERT INTO exams (title, semester_id, exam_date, start_time, end_time, location, type) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setExamParameters(stmt, exam);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating exam failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    exam.setExam_id(generatedKeys.getInt(1));
                    return exam;
                } else {
                    throw new SQLException("Creating exam failed, no ID obtained.");
                }
            }
        }
    }

    public void updateExam(int id, Exam exam) throws Exception {
        String query = "UPDATE exams SET title = ?, semester_id = ?, exam_date = ?, start_time = ?, end_time = ?, location = ?, type = ? WHERE exam_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setExamParameters(stmt, exam);
            stmt.setInt(8, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating exam failed, no rows affected.");
            }
        }
    }

    public void deleteExam(int id) throws Exception {
        String query = "DELETE FROM exams WHERE exam_id = ?";

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
        Exam exam = new Exam();
        exam.setExam_id(rs.getInt("exam_id"));
        exam.setTitle(rs.getString("title"));
        exam.setSemester_id(rs.getString("semester_id"));
        exam.setExam_date(rs.getDate("exam_date"));
        exam.setStart_time(rs.getTime("start_time"));
        exam.setEnd_time(rs.getTime("end_time"));
        exam.setLocation(rs.getString("location"));
        exam.setType(rs.getString("type"));
        return exam;
    }

    private void setExamParameters(PreparedStatement stmt, Exam exam) throws SQLException {
        stmt.setString(1, exam.getTitle());
        stmt.setString(2, exam.getSemester_id());
        stmt.setDate(3, new java.sql.Date(exam.getExam_date().getTime())); // Convert java.util.Date to java.sql.Date
        stmt.setTime(4, new java.sql.Time(exam.getStart_time().getTime()));     // Convert java.util.Time to java.sql.Time
        stmt.setTime(5, new java.sql.Time(exam.getEnd_time().getTime()));       // Convert java.util.Time to java.sql.Time
        stmt.setString(6, exam.getLocation());
        stmt.setString(7, exam.getType());
    }
}
