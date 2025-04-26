package com.adhyana.student.services;

import com.adhyana.student.models.Attendance;
import com.adhyana.student.models.AttendanceSummary;
import com.adhyana.student.models.CourseSession;
import com.adhyana.student.utils.DatabaseConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AttendanceService {

    /**
     * Record attendance for multiple students in a batch for a course session
     */
    public boolean recordBatchAttendance(String courseCode, LocalDate date,
                                         Map<Integer, Boolean> studentAttendance) throws Exception {
        String query = "INSERT INTO attendance (student_index, course_id, date, present) " +
                "VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE present = VALUES(present)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            conn.setAutoCommit(false);

            for (Map.Entry<Integer, Boolean> entry : studentAttendance.entrySet()) {
                int studentIndex = entry.getKey();
                boolean present = entry.getValue();

                stmt.setInt(1, studentIndex);
                stmt.setString(2, courseCode);
                stmt.setDate(3, Date.valueOf(date));
                stmt.setBoolean(4, present);
                stmt.addBatch();
            }

            int[] results = stmt.executeBatch();
            conn.commit();

            // Check if all insertions were successful
            for (int result : results) {
                if (result == Statement.EXECUTE_FAILED) {
                    conn.rollback();
                    return false;
                }
            }

            return true;
        }
    }

    /**
     * Get the attendance percentage for a specific course on a specific date
     */
    public CourseSession getCourseSessionAttendance(String courseCode, LocalDate date) throws Exception {
        String query = "SELECT course_id, " +
                "(SELECT name FROM courses WHERE course_id = ?) as course_name, " +
                "COUNT(*) as total_students, " +
                "SUM(CASE WHEN present = true THEN 1 ELSE 0 END) as present_students " +
                "FROM attendance WHERE course_id = ? AND date = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseCode);
            stmt.setString(2, courseCode);
            stmt.setDate(3, Date.valueOf(date));
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToCourseSession(rs, date);
            }

            // If no attendance records found, return a default session with 0 students
            return new CourseSession(0, courseCode, getCourseName(courseCode), date, 0, 0);
        }
    }

    /**
     * Get all course sessions for a specific course
     */
    public List<CourseSession> getCourseSessionHistory(String courseCode) throws Exception {
        List<CourseSession> sessions = new ArrayList<>();
        String query = "SELECT date, COUNT(*) as total_students, " +
                "SUM(CASE WHEN present = true THEN 1 ELSE 0 END) as present_students " +
                "FROM attendance WHERE course_id = ? GROUP BY date ORDER BY date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            String courseName = getCourseName(courseCode);
            stmt.setString(1, courseCode);
            ResultSet rs = stmt.executeQuery();

            int sessionId = 1;
            while (rs.next()) {
                LocalDate sessionDate = rs.getDate("date").toLocalDate();
                int totalStudents = rs.getInt("total_students");
                int presentStudents = rs.getInt("present_students");

                sessions.add(new CourseSession(
                        sessionId++,
                        courseCode,
                        courseName,
                        sessionDate,
                        totalStudents,
                        presentStudents
                ));
            }
        }
        return sessions;
    }

    /**
     * Get students for a specific course with their attendance status for a date
     */
    public List<Attendance> getStudentAttendanceForSession(String courseCode, LocalDate date) throws Exception {
        List<Attendance> attendanceList = new ArrayList<>();

        // This query gets all enrolled students and their attendance status if available
        String query = "SELECT s.student_index, a.attendance_id, a.course_id, a.date, " +
                "COALESCE(a.present, false) as present " +
                "FROM students s " +
                "JOIN student_courses sc ON s.student_index = sc.student_index " +
                "LEFT JOIN attendance a ON s.student_index = a.student_index " +
                "AND a.course_id = ? AND a.date = ? " +
                "WHERE sc.course_id = ? " +
                "ORDER BY s.name";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseCode);
            stmt.setDate(2, Date.valueOf(date));
            stmt.setString(3, courseCode);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                attendanceList.add(mapResultSetToAttendance(rs, date));
            }
        }
        return attendanceList;
    }

    /**
     * Get attendance summary for a specific student
     */
    public List<AttendanceSummary> getStudentAttendanceSummary(int studentIndex) throws Exception {
        List<AttendanceSummary> summaries = new ArrayList<>();
        String query = "SELECT a.course_id, " +
                "(SELECT name FROM courses WHERE course_id = a.course_id) as course_name, " +
                "COUNT(DISTINCT a.date) as total_sessions, " +
                "SUM(CASE WHEN a.present = true THEN 1 ELSE 0 END) as present_count, " +
                "(SELECT name FROM students WHERE student_index = ?) as student_name " +
                "FROM attendance a WHERE a.student_index = ? " +
                "GROUP BY a.course_id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setInt(2, studentIndex);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                summaries.add(mapResultSetToAttendanceSummary(rs, studentIndex));
            }
        }
        return summaries;
    }

    /**
     * Get detailed attendance for a student in a specific course
     */
    public List<Attendance> getStudentCourseAttendance(int studentIndex, String courseCode) throws Exception {
        List<Attendance> attendanceList = new ArrayList<>();
        String query = "SELECT * FROM attendance WHERE student_index = ? AND course_id = ? ORDER BY date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, courseCode);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                attendanceList.add(mapResultSetToAttendance(rs));
            }
        }
        return attendanceList;
    }

    /**
     * Helper method to get course name
     */
    private String getCourseName(String courseCode) throws Exception {
        String query = "SELECT name FROM courses WHERE course_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseCode);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getString("name");
            }
        }
        return "Unknown Course";
    }

    /**
     * Helper method to map ResultSet to CourseSession
     */
    private CourseSession mapResultSetToCourseSession(ResultSet rs, LocalDate date) throws SQLException {
        return new CourseSession(
                0, // We don't have a session ID in the database
                rs.getString("course_id"),
                rs.getString("course_name"),
                date,
                rs.getInt("total_students"),
                rs.getInt("present_students")
        );
    }

    /**
     * Helper method to map ResultSet to AttendanceSummary
     */
    private AttendanceSummary mapResultSetToAttendanceSummary(ResultSet rs, int studentIndex) throws SQLException {
        return new AttendanceSummary(
                studentIndex,
                rs.getString("student_name"),
                rs.getString("course_id"),
                rs.getString("course_name"),
                rs.getInt("total_sessions"),
                rs.getInt("present_count")
        );
    }

    /**
     * Helper method to map ResultSet to Attendance (for existing attendance records)
     */
    private Attendance mapResultSetToAttendance(ResultSet rs) throws SQLException {
        return new Attendance(
                rs.getInt("attendance_id"),
                rs.getInt("student_index"),
                rs.getString("course_id"),
                rs.getDate("date").toLocalDate(),
                rs.getBoolean("present")
        );
    }

    private Attendance mapResultSetToAttendance(ResultSet rs, LocalDate date) throws SQLException {
        int id = rs.getInt("attendance_id");
        int studentIndex = rs.getInt("student_index");
        String courseCode = rs.getString("course_id");
        boolean present = rs.getBoolean("present");

        return new Attendance(
                id,
                studentIndex,
                courseCode,
                date,
                present
        );
    }
}