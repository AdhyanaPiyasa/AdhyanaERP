// course-service/src/main/java/com/adhyana/course/services/CourseService.java
package com.adhyana.course.services;

import com.adhyana.course.models.Course;
import com.adhyana.course.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CourseService {
    // Map of field names to database column names
    private static final Map<String, String> FIELD_MAPPINGS = new HashMap<>();

    static {
        FIELD_MAPPINGS.put("id", "id");
        FIELD_MAPPINGS.put("code", "code");
        FIELD_MAPPINGS.put("name", "name");
        FIELD_MAPPINGS.put("year", "year");
        FIELD_MAPPINGS.put("semester", "semester");
        FIELD_MAPPINGS.put("credits", "credits");
        FIELD_MAPPINGS.put("duration", "duration");
        FIELD_MAPPINGS.put("avgRating", "avg_rating");  // Add mapping for avg_rating
    }

    // Get all courses
    public List<Course> getAllCourses() throws Exception {
        List<Course> courses = new ArrayList<>();
        String query = "SELECT * FROM courses";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                courses.add(extractCourseFromResultSet(rs));
            }
        }
        return courses;
    }

    // Generic search method that can handle any field
    public List<Course> searchCoursesByField(String fieldName, String fieldValue) throws Exception {
        // Validate that the field name is valid
        if (!FIELD_MAPPINGS.containsKey(fieldName.toLowerCase())) {
            throw new IllegalArgumentException("Invalid field name: " + fieldName);
        }

        String columnName = FIELD_MAPPINGS.get(fieldName.toLowerCase());
        String query = "SELECT * FROM courses WHERE ";
        List<Course> courses = new ArrayList<>();

        // Build different queries based on field type
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = createSearchStatement(conn, columnName, fieldValue)) {

            System.out.println("Executing query: " + stmt.toString());
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Course course = extractCourseFromResultSet(rs);
                courses.add(course);
                System.out.println("Found course: " + course.toString());
            }
        }

        return courses;
    }

    // Helper method to create the appropriate prepared statement based on field type
    private PreparedStatement createSearchStatement(Connection conn, String columnName, String fieldValue) throws SQLException {
        String query;
        PreparedStatement stmt;

        // Handle special cases based on column type
        switch (columnName) {
            case "id":
            case "code":
            case "year":
            case "semester":
            case "credits":
            case "duration":
                // Numeric fields - exact match
                query = "SELECT * FROM courses WHERE " + columnName + " = ?";
                stmt = conn.prepareStatement(query);

                try {
                    // Try to parse as integer
                    int intValue = Integer.parseInt(fieldValue);
                    stmt.setInt(1, intValue);
                } catch (NumberFormatException e) {
                    // Handle invalid number format
                    throw new SQLException("Invalid numeric value for " + columnName + ": " + fieldValue);
                }
                break;

            case "avg_rating":
                // Decimal field - exact match
                query = "SELECT * FROM courses WHERE " + columnName + " = ?";
                stmt = conn.prepareStatement(query);

                try {
                    // Try to parse as double
                    double doubleValue = Double.parseDouble(fieldValue);
                    stmt.setDouble(1, doubleValue);
                } catch (NumberFormatException e) {
                    // Handle invalid number format
                    throw new SQLException("Invalid decimal value for " + columnName + ": " + fieldValue);
                }
                break;

            case "name":
                // Text field - use LIKE for partial matches
                query = "SELECT * FROM courses WHERE " + columnName + " LIKE ?";
                stmt = conn.prepareStatement(query);
                stmt.setString(1, "%" + fieldValue + "%");
                break;

            default:
                throw new SQLException("Unsupported column name: " + columnName);
        }

        return stmt;
    }

    // Helper method to extract a Course object from ResultSet
    private Course extractCourseFromResultSet(ResultSet rs) throws SQLException {
        Double avgRating = rs.getObject("avg_rating") != null ? rs.getDouble("avg_rating") : null;

        return new Course(
                rs.getInt("id"),
                rs.getInt("code"),
                rs.getString("name"),
                rs.getInt("year"),
                rs.getInt("semester"),
                rs.getInt("credits"),
                rs.getInt("duration"),
                avgRating
        );
    }

    // Get a course by ID - kept for backward compatibility
    public Course getCourseById(int id) throws Exception {
        List<Course> courses = searchCoursesByField("id", String.valueOf(id));
        return courses.isEmpty() ? null : courses.get(0);
    }

    // Create a new course
    public Course createCourse(Course course) throws Exception {
        String query = "INSERT INTO courses (code, name, year, semester, credits, duration) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, course.getCode());
            stmt.setString(2, course.getName());
            stmt.setInt(3, course.getYear());
            stmt.setInt(4, course.getSemester());
            stmt.setInt(5, course.getCredits());
            stmt.setInt(6, course.getDuration());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating course failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    course.setId(generatedKeys.getInt(1));
                    return course;
                } else {
                    throw new SQLException("Creating course failed, no ID obtained.");
                }
            }
        }
    }

    // Update an existing course
    public boolean updateCourse(Course course) throws Exception {
        String query = "UPDATE courses SET code = ?, name = ?, year = ?, semester = ?, " +
                "credits = ?, duration = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, course.getCode());
            stmt.setString(2, course.getName());
            stmt.setInt(3, course.getYear());
            stmt.setInt(4, course.getSemester());
            stmt.setInt(5, course.getCredits());
            stmt.setInt(6, course.getDuration());
            stmt.setInt(7, course.getId());

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Delete a course
    public boolean deleteCourse(int id) throws Exception {
        String query = "DELETE FROM courses WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }
}