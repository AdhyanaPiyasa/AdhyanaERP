package com.adhyana.course.services;

import com.adhyana.course.models.Course;
import com.adhyana.course.models.Semester;
import com.adhyana.course.models.StudentSemesterCourse;
import com.adhyana.course.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class focused on retrieving course information based on student enrollments.
 * Provides methods to interact with student_semester_courses table.
 */
public class StudentSemesterCourseService {

    /**
     * Retrieves the full details of all courses a student is enrolled in, regardless of semester.
     *
     * @param studentIndex The student's index number.
     * @return A list of Course objects the student is enrolled in.
     * @throws Exception If a database error occurs.
     */
    public List<Course> getCoursesForStudent(int studentIndex) throws Exception {
        List<Course> courses = new ArrayList<>();
        // Query to join student_semester_courses with courses table, without semester filtering
        String query = "SELECT c.* FROM courses c " +
                "JOIN student_semester_courses ssc ON c.course_id = ssc.course_id " +
                "WHERE ssc.student_index = ?";

        System.out.println("Executing query: " + query + " with studentIndex=" + studentIndex);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    courses.add(extractCourseFromResultSet(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Database error fetching courses for student: " + e.getMessage());
            throw new Exception("Error retrieving courses: " + e.getMessage(), e);
        }
        return courses;
    }

    /**
     * Retrieves the full details of courses a student is enrolled in for a specific semester.
     * Kept for backward compatibility.
     *
     * @param studentIndex The student's index number.
     * @param semesterId   The semester ID.
     * @return A list of Course objects the student is enrolled in for that semester.
     * @throws Exception If a database error occurs.
     */
    public List<Course> getCoursesForStudentInSemester(int studentIndex, String semesterId) throws Exception {
        List<Course> courses = new ArrayList<>();
        // Query to join student_semester_courses with courses table
        String query = "SELECT c.* FROM courses c " +
                "JOIN student_semester_courses ssc ON c.course_id = ssc.course_id " +
                "WHERE ssc.student_index = ? AND ssc.semester_id = ?";

        System.out.println("Executing query: " + query + " with studentIndex=" + studentIndex + ", semesterId=" + semesterId);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, semesterId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    courses.add(extractCourseFromResultSet(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Database error fetching courses for student in semester: " + e.getMessage());
            throw new Exception("Error retrieving courses: " + e.getMessage(), e);
        }
        return courses;
    }

    /**
     * Retrieves semester details for a specific student and course.
     *
     * @param studentIndex The student's index number.
     * @param courseId The course ID.
     * @return A list of Semester objects containing details about each semester
     *         the student is enrolled in for the specified course.
     * @throws Exception If a database error occurs.
     */
    public List<Semester> getSemesterDetailsForStudentCourse(int studentIndex, String courseId) throws Exception {
        List<Semester> semesters = new ArrayList<>();

        // Join query to get semester details through student_semester_courses table
        String query = "SELECT s.* FROM semesters s " +
                "JOIN student_semester_courses ssc ON s.semester_id = ssc.semester_id " +
                "WHERE ssc.student_index = ? AND ssc.course_id = ? " +
                "ORDER BY s.academic_year DESC, s.semester_num DESC";

        System.out.println("Executing query: " + query + " with studentIndex=" + studentIndex +
                ", courseId=" + courseId);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, courseId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Semester semester = extractSemesterFromResultSet(rs);
                    semesters.add(semester);
                }
            }
        } catch (SQLException e) {
            System.err.println("Database error fetching semester details: " + e.getMessage());
            throw new Exception("Error retrieving semester details: " + e.getMessage(), e);
        }

        return semesters;
    }

    /**
     * Helper method to extract a Course object from ResultSet.
     * Matches the Course model structure as defined in the schema.
     *
     * @param rs The ResultSet pointing to the current row.
     * @return A Course object.
     * @throws SQLException If a database access error occurs.
     */
    private Course extractCourseFromResultSet(ResultSet rs) throws SQLException {
        // Extract columns based on the 'courses' table definition
        String courseId = rs.getString("course_id");
        String name = rs.getString("name");
        int year = rs.getInt("year");
        int credits = rs.getInt("credits");
        int duration = rs.getInt("duration");
        Double avgRating = rs.getObject("avg_rating") != null ? rs.getDouble("avg_rating") : null;

        // Using the updated Course constructor
        return new Course(courseId, name, year, credits, duration, avgRating);
    }

    /**
     * Helper method to extract a Semester object from ResultSet.
     *
     * @param rs The ResultSet pointing to the current row.
     * @return A Semester object.
     * @throws SQLException If a database access error occurs.
     */
    private Semester extractSemesterFromResultSet(ResultSet rs) throws SQLException {
        // Extract columns based on the 'semesters' table definition
        String semesterId = rs.getString("semester_id");
        String batchId = rs.getString("batch_id");
        int academicYear = rs.getInt("academic_year");
        int semesterNum = rs.getInt("semester_num");
        Date startDate = rs.getDate("start_date");
        Date endDate = rs.getDate("end_date");
        String status = rs.getString("status");
        Date createdAt = rs.getDate("created_at");
        Date updatedAt = rs.getDate("updated_at");

        // Using the Semester constructor
        return new Semester(semesterId, batchId, academicYear, semesterNum,
                startDate, endDate, status, createdAt, updatedAt);
    }

    /**
     * Retrieves all enrollments for a specific student, regardless of semester.
     *
     * @param studentIndex The student's index number.
     * @return A list of StudentSemesterCourse objects.
     * @throws Exception If a database error occurs.
     */
    public List<StudentSemesterCourse> getEnrollmentsByStudent(int studentIndex) throws Exception {
        List<StudentSemesterCourse> enrollments = new ArrayList<>();
        String query = "SELECT * FROM student_semester_courses WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    enrollments.add(extractEnrollmentFromResultSet(rs));
                }
            }
        }
        return enrollments;
    }

    /**
     * Helper method to extract a StudentSemesterCourse object from a ResultSet row.
     *
     * @param rs The ResultSet pointing to the current row.
     * @return A StudentSemesterCourse object.
     * @throws SQLException If a database access error occurs.
     */
    private StudentSemesterCourse extractEnrollmentFromResultSet(ResultSet rs) throws SQLException {
        return new StudentSemesterCourse(
                rs.getInt("student_index"),
                rs.getString("semester_id"),
                rs.getString("course_id"),
                rs.getTimestamp("enrollment_date")
        );
    }
}