package com.adhyana.course.services;

import com.adhyana.course.models.Course; // Import Course model
import com.adhyana.course.models.StudentSemesterCourse; // Still useful for extraction
import com.adhyana.course.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class focused on retrieving course information based on student enrollments.
 * Assumes the student_semester_courses table is populated externally.
 */
public class StudentSemesterCourseService {

    // Service for fetching course details, likely needed here.
    // Assuming CourseService exists and has a method like getCourseById(String courseId)
    // If not, you might need to inject CourseService or duplicate the logic.
    // For simplicity here, we'll perform the JOIN directly.
    // private final CourseService courseService = new CourseService(); // Option 1: Inject/Use CourseService

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

        System.out.println("Executing query: " + query + " with studentIndex=" + studentIndex + ", semesterId=" + semesterId); // Debugging

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, studentIndex);
            stmt.setString(2, semesterId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    // Extract Course object from the result set
                    // Assuming CourseService's extractCourseFromResultSet or similar logic
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
     * NOTE: This duplicates logic likely present in CourseService.
     * Consider refactoring to share this logic if possible.
     * Assumes the columns from the 'courses' table are selected (c.*).
     * --- ADJUST THIS based on your actual Course constructor and table columns ---
     *
     * @param rs The ResultSet pointing to the current row.
     * @return A Course object.
     * @throws SQLException If a database access error occurs.
     */
    private Course extractCourseFromResultSet(ResultSet rs) throws SQLException {
        // Retrieve columns based on the 'courses' table definition in course_schema.sql
        String courseId = rs.getString("course_id"); // PK is VARCHAR
        String name = rs.getString("name");
        int year = rs.getInt("year"); // Assuming 'year' in courses table means academic year level
        int credits = rs.getInt("credits");
        int duration = rs.getInt("duration");
        Double avgRating = rs.getObject("avg_rating") != null ? rs.getDouble("avg_rating") : null;
        // Timestamp createdAt = rs.getTimestamp("created_at"); // Available if needed
        // Timestamp updatedAt = rs.getTimestamp("updated_at"); // Available if needed

        // --- IMPORTANT ---
        // The Course model provided previously had different fields (id, code, semester).
        // You MUST adjust either the Course model OR this extraction logic
        // to match the actual 'courses' table schema and the desired Course object structure.

        // Example assuming Course model needs adjustment to match DB:
        // return new Course(courseId, name, year, credits, duration, avgRating);

        // Example assuming Course model from Course.java is correct and DB needs mapping:
        // This requires mapping course_id to 'code' or 'id', and potentially adding a 'semester' field
        // to the Course model or fetching it differently if relevant here.
        // For now, using placeholder values where direct mapping isn't obvious from Course.java vs DB schema.
        // **REPLACE WITH CORRECT MAPPING**
        int placeholderId = 0; // Cannot get INT id from VARCHAR course_id directly
        int placeholderCode = 0; // Cannot get INT code from VARCHAR course_id directly
        int placeholderSemester = 0; // 'semester' field doesn't exist directly in 'courses' table

        // Using the constructor from the provided Course.java for structure:
        // Course(int id, int code, String name, int year, int semester, int credits, int duration, Double avgRating)
        // THIS WILL LIKELY CAUSE ISSUES without adjusting the Course model or this logic.
        return new Course(placeholderId, placeholderCode, name, year, placeholderSemester, credits, duration, avgRating);
    }


    // Optional: Keep methods to retrieve raw enrollment data if needed elsewhere or for debugging.
    // These methods return StudentSemesterCourse objects.

    /**
     * Retrieves a specific enrollment record by its composite primary key. (Optional)
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
     * Retrieves all enrollments for a specific student. (Optional)
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
     * Helper method to extract a StudentSemesterCourse object from a ResultSet row. (Optional)
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
