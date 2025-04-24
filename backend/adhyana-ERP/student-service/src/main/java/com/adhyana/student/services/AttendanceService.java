// student-service/src/main/java/com/adhyana/student/services/AttendanceService.java
package com.adhyana.student.services;

import com.adhyana.student.models.Attendance;
import com.adhyana.student.models.AttendanceSummary;
import com.adhyana.student.models.CourseSession;
import com.adhyana.student.utils.DatabaseConnection;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AttendanceService {

    // Record attendance for a single student
    public Attendance recordAttendance(Attendance attendance) throws Exception {
        String query = "INSERT INTO attendance (student_id, course_code, date, present, remarks) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, attendance.getStudentId());
            stmt.setString(2, attendance.getCourseCode());
            stmt.setDate(3, Date.valueOf(attendance.getDate()));
            stmt.setBoolean(4, attendance.isPresent());
            stmt.setString(5, attendance.getRemarks());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Recording attendance failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    attendance.setId(generatedKeys.getInt(1));
                    return attendance;
                } else {
                    throw new SQLException("Recording attendance failed, no ID obtained.");
                }
            }
        }
    }

    // Record attendance for multiple students in a batch for a course session
    public boolean recordBatchAttendance(String courseCode, LocalDate date,
                                         Map<Integer, Boolean> studentAttendance,
                                         Map<Integer, String> remarks) throws Exception {
        String query = "INSERT INTO attendance (student_id, course_code, date, present, remarks) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            conn.setAutoCommit(false);

            for (Map.Entry<Integer, Boolean> entry : studentAttendance.entrySet()) {
                int studentId = entry.getKey();
                boolean present = entry.getValue();
                String remark = remarks.getOrDefault(studentId, "");

                stmt.setInt(1, studentId);
                stmt.setString(2, courseCode);
                stmt.setDate(3, Date.valueOf(date));
                stmt.setBoolean(4, present);
                stmt.setString(5, remark);
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

    // Create a new course session
    public CourseSession createCourseSession(CourseSession session) throws Exception {
        String query = "INSERT INTO course_sessions (course_code, course_name, date," +
                "total_students, present_students) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, session.getCourseCode());
            stmt.setString(2, session.getCourseName());
            stmt.setDate(3, Date.valueOf(session.getDate()));
            stmt.setInt(4, session.getTotalStudents());
            stmt.setInt(5, session.getPresentStudents());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating course session failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    session.setId(generatedKeys.getInt(1));
                    return session;
                } else {
                    throw new SQLException("Creating course session failed, no ID obtained.");
                }
            }
        }
    }

    // Add this method to your AttendanceService.java
    public void updateAttendance(int id, Attendance attendance) throws Exception {
        String query = "UPDATE attendance SET student_id = ?, course_code = ?, date = ?, present = ?, remarks = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, attendance.getStudentId());
            stmt.setString(2, attendance.getCourseCode());
            stmt.setDate(3, Date.valueOf(attendance.getDate()));
            stmt.setBoolean(4, attendance.isPresent());
            stmt.setString(5, attendance.getRemarks());
            stmt.setInt(6, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating attendance failed, no rows affected.");
            }
        }
    }

    // Update the attendance count for a course session
    public void updateSessionAttendance(int sessionId, int totalStudents, int presentStudents) throws Exception {
        String query = "UPDATE course_sessions SET total_students = ?, present_students = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, totalStudents);
            stmt.setInt(2, presentStudents);
            stmt.setInt(3, sessionId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating session attendance failed, no rows affected.");
            }
        }
    }

    // Add this method to your AttendanceService.java
    public List<Attendance> getAllAttendance() throws Exception {
        List<Attendance> attendanceList = new ArrayList<>();
        String query = "SELECT * FROM attendance ORDER BY date DESC, student_id";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                attendanceList.add(mapResultSetToAttendance(rs));
            }
        }
        return attendanceList;
    }

    // Add this method to your AttendanceService.java
    public Attendance getAttendance(int id) throws Exception {
        String query = "SELECT * FROM attendance WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToAttendance(rs);
            }
        }
        return null;
    }



    // Get a list of all course sessions for a specific course
    public List<CourseSession> getCourseSessionsByCourse(String courseCode) throws Exception {
        List<CourseSession> sessions = new ArrayList<>();
        String query = "SELECT * FROM course_sessions WHERE course_code = ? ORDER BY date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseCode);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                sessions.add(mapResultSetToCourseSession(rs));
            }
        }
        return sessions;
    }

    // Get a single course session by ID
    public CourseSession getCourseSessionById(int sessionId) throws Exception {
        String query = "SELECT * FROM course_sessions WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, sessionId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToCourseSession(rs);
            }
        }
        return null;
    }

    // Get attendance records for a specific student
    public List<Attendance> getStudentAttendance(int studentId) throws Exception {
        List<Attendance> attendanceList = new ArrayList<>();
        String query = "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                attendanceList.add(mapResultSetToAttendance(rs));
            }
        }
        return attendanceList;
    }

    // Get attendance records for a specific student in a specific course
    public List<Attendance> getStudentCourseAttendance(int studentId, String courseCode) throws Exception {
        List<Attendance> attendanceList = new ArrayList<>();
        String query = "SELECT * FROM attendance WHERE student_id = ? AND course_code = ? ORDER BY date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentId);
            stmt.setString(2, courseCode);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                attendanceList.add(mapResultSetToAttendance(rs));
            }
        }
        return attendanceList;
    }

    // Get attendance summary for a specific student across all courses
    public List<AttendanceSummary> getStudentAttendanceSummary(int studentId) throws Exception {
        List<AttendanceSummary> summaries = new ArrayList<>();

        // First, get the student's name
        String studentName = getStudentName(studentId);
        if (studentName == null) {
            throw new SQLException("Student not found with ID: " + studentId);
        }

        // Get attendance summary for each course
        String query = "SELECT a.course_code, " +
                "(SELECT course_name FROM course_sessions WHERE course_code = a.course_code LIMIT 1) as course_name, " +
                "COUNT(DISTINCT DATE(a.date)) as total_sessions, " +
                "SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END) as present_count " +
                "FROM attendance a WHERE a.student_id = ? " +
                "GROUP BY a.course_code";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                String courseCode = rs.getString("course_code");
                String courseName = rs.getString("course_name");
                int totalSessions = rs.getInt("total_sessions");
                int presentCount = rs.getInt("present_count");

                summaries.add(new AttendanceSummary(
                        studentId,
                        studentName,
                        courseCode,
                        courseName,
                        totalSessions,
                        presentCount
                ));
            }
        }
        return summaries;
    }

    // Get the attendance list for a course session
    public List<Map<String, Object>> getCourseSessionAttendance(String courseCode, LocalDate date) throws Exception {
        List<Map<String, Object>> attendanceList = new ArrayList<>();
        String query = "SELECT s.id, s.name, s.index_number, a.present, a.remarks " +
                "FROM students s " +
                "LEFT JOIN attendance a ON s.id = a.student_id AND a.course_code = ? AND a.date = ? " +
                "WHERE s.state = 'Active' " +
                "ORDER BY s.name";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, courseCode);
            stmt.setDate(2, Date.valueOf(date));
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> attendanceRecord = new HashMap<>();
                attendanceRecord.put("studentId", rs.getInt("id"));
                attendanceRecord.put("name", rs.getString("name"));
                attendanceRecord.put("indexNumber", rs.getString("index_number"));

                // Check if attendance was taken (not null in the result)
                Object presentObj = rs.getObject("present");
                if (presentObj != null) {
                    attendanceRecord.put("present", rs.getBoolean("present"));
                    attendanceRecord.put("remarks", rs.getString("remarks"));
                } else {
                    // No attendance record exists yet
                    attendanceRecord.put("present", null);
                    attendanceRecord.put("remarks", "");
                }

                attendanceList.add(attendanceRecord);
            }
        }
        return attendanceList;
    }

    // Helper method to get student name
    private String getStudentName(int studentId) throws Exception {
        String query = "SELECT name FROM students WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getString("name");
            }
        }
        return null;
    }

    // Add this method to your AttendanceService.java
    public void deleteAttendance(int id) throws Exception {
        String query = "DELETE FROM attendance WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting attendance failed, no rows affected.");
            }
        }
    }

    // Add this method to your AttendanceService.java
    public void deleteCourseSession(int id) throws Exception {
        String query = "DELETE FROM course_sessions WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Deleting course session failed, no rows affected.");
            }
        }
    }

    // Helper method to map ResultSet to Attendance
    private Attendance mapResultSetToAttendance(ResultSet rs) throws SQLException {
        return new Attendance(
                rs.getInt("id"),
                rs.getInt("student_id"),
                rs.getString("course_code"),
                rs.getDate("date").toLocalDate(),
                rs.getBoolean("present"),
                rs.getString("remarks")
        );
    }

    // Helper method to map ResultSet to CourseSession
    private CourseSession mapResultSetToCourseSession(ResultSet rs) throws SQLException {
        return new CourseSession(
                rs.getInt("id"),
                rs.getString("course_code"),
                rs.getString("course_name"),
                rs.getDate("date").toLocalDate(),
                rs.getInt("total_students"),
                rs.getInt("present_students")
        );
    }
}


//package com.adhyana.student.services;
//
//import com.adhyana.student.models.Attendance;
//import com.adhyana.student.utils.DatabaseConnection;
//import java.sql.*;
//import java.util.ArrayList;
//import java.util.List;
//import java.time.LocalDate;
//
//public class AttendanceService {
//
//    //Creates a new attendance record in the database
//    public Attendance createAttendance(Attendance attendance) throws Exception {
//        String query = "INSERT INTO attendance (student_id, date, present, remarks) " +
//                "VALUES (?, ?, ?, ?)";
//
//        try (Connection conn = DatabaseConnection.getConnection();
//             // Get generated keys to return the new ID
//             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
//
//            // Set parameters from the attendance object
//            setAttendanceParameters(stmt, attendance);
//
//            int affectedRows = stmt.executeUpdate();
//            if (affectedRows == 0) {
//                throw new SQLException("Creating attendance failed, no rows affected.");
//            }
//
//            // Get the auto-generated ID and set it on the attendance object
//            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
//                if (generatedKeys.next()) {
//                    attendance.setId(generatedKeys.getInt(1));
//                    return attendance;
//                } else {
//                    throw new SQLException("Creating attendance failed, no ID obtained.");
//                }
//            }
//        }
//    }
//
//    //Retrieves all attendance records from the database
//    public List<Attendance> getAllAttendance() throws Exception {
//        List<Attendance> attendanceList = new ArrayList<>();
//        String query = "SELECT * FROM attendance";
//
//        // ensure connections are closed properly
//        try (Connection conn = DatabaseConnection.getConnection();
//             Statement stmt = conn.createStatement();
//             ResultSet rs = stmt.executeQuery(query)) {
//
//            // Iterate through all records and map them to Attendance objects
//            while (rs.next()) {
//                attendanceList.add(mapResultSetToAttendance(rs));
//            }
//        }
//        return attendanceList;
//    }
//
//    //Retrieves a single attendance record by its ID
//    public Attendance getAttendance(int id) throws Exception {
//        String query = "SELECT * FROM attendance WHERE id = ?";
//
//        try (Connection conn = DatabaseConnection.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(query)) {
//
//            stmt.setInt(1, id);
//            ResultSet rs = stmt.executeQuery();
//
//            // Return the attendance record if found, otherwise null
//            if (rs.next()) {
//                return mapResultSetToAttendance(rs);
//            }
//        }
//        return null;
//    }
//
//    //Retrieves all attendance records for a specific student
//    public List<Attendance> getStudentAttendance(int studentId) throws Exception {
//        List<Attendance> attendanceList = new ArrayList<>();
//        String query = "SELECT * FROM attendance WHERE student_id = ?";
//
//        try (Connection conn = DatabaseConnection.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(query)) {
//
//            // Set the student ID parameter in the query
//            stmt.setInt(1, studentId);
//            ResultSet rs = stmt.executeQuery();
//
//            // Iterate through the student's records
//            while (rs.next()) {
//                attendanceList.add(mapResultSetToAttendance(rs));
//            }
//        }
//        return attendanceList;
//    }
//
//    //Updates an existing attendance record
//    public void updateAttendance(int id, Attendance attendance) throws Exception {
//        String query = "UPDATE attendance SET student_id = ?, date = ?, present = ?, remarks = ? " +
//                "WHERE id = ?";
//
//        try (Connection conn = DatabaseConnection.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(query)) {
//
//            // Set parameters from the attendance object
//            setAttendanceParameters(stmt, attendance);
//            // Set the ID for the WHERE clause
//            stmt.setInt(5, id);
//
//            int affectedRows = stmt.executeUpdate();
//            if (affectedRows == 0) {
//                throw new SQLException("Updating attendance failed, no rows affected.");
//            }
//        }
//    }
//
//    //Deletes an attendance record by ID
//    public void deleteAttendance(int id) throws Exception {
//        String query = "DELETE FROM attendance WHERE id = ?";
//
//        try (Connection conn = DatabaseConnection.getConnection();
//             PreparedStatement stmt = conn.prepareStatement(query)) {
//
//            stmt.setInt(1, id);
//
//            int affectedRows = stmt.executeUpdate();
//            if (affectedRows == 0) {
//                throw new SQLException("Deleting attendance failed, no rows affected.");
//            }
//        }
//    }
//
//    //convert a database ResultSet row to an Attendance object
//    private Attendance mapResultSetToAttendance(ResultSet rs) throws SQLException {
//        return new Attendance(
//                rs.getInt("id"),
//                rs.getInt("student_id"),
//                rs.getDate("date").toLocalDate(),
//                rs.getBoolean("present"),
//                rs.getString("remarks")
//        );
//    }
//
//    //set prepared statement parameters from an Attendance object
//    private void setAttendanceParameters(PreparedStatement stmt, Attendance attendance) throws SQLException {
//        stmt.setInt(1, attendance.getStudentId());
//        stmt.setDate(2, Date.valueOf(attendance.getDate()));
//        stmt.setBoolean(3, attendance.isPresent());
//        stmt.setString(4, attendance.getRemarks());
//    }
//
//}
