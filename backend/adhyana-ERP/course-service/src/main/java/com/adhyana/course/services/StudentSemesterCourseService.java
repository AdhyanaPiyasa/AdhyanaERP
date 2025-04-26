package com.adhyana.course.services;

import com.adhyana.course.models.Course;
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
     * Retrieves the full details of courses a student is enrolled in for a specific semester.
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
     * Retrieves all enrollments for a specific student and semester.
     *
     * @param studentIndex The student's index number.
     * @param semesterId The semester ID.
     * @return A list of StudentSemesterCourse objects.
     * @throws Exception If a database error occurs.
     */
    public List<StudentSemesterCourse> getEnrollmentsByStudentAndSemester(int studentIndex, String semesterId) throws Exception {
        List<StudentSemesterCourse> enrollments = new ArrayList<>();
        String query = "SELECT * FROM student_semester_courses WHERE student_index = ? AND semester_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, semesterId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    enrollments.add(extractEnrollmentFromResultSet(rs));
                }
            }
        }
        return enrollments;
    }

    /**
     * Retrieves a specific enrollment record by its composite primary key.
     *
     * @param studentIndex The student's index number.
     * @param semesterId   The semester ID.
     * @param courseId     The course ID.
     * @return The StudentSemesterCourse object if found, otherwise null.
     * @throws Exception If a database error occurs.
     */
    public StudentSemesterCourse getEnrollment(int studentIndex, String semesterId, String courseId) throws Exception {
        String query = "SELECT * FROM student_semester_courses WHERE student_index = ? AND semester_id = ? AND course_id = ?";
        StudentSemesterCourse enrollment = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, semesterId);
            stmt.setString(3, courseId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    enrollment = extractEnrollmentFromResultSet(rs);
                }
            }
        }
        return enrollment;
    }

    /**
     * Retrieves all enrollments for a specific student.
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