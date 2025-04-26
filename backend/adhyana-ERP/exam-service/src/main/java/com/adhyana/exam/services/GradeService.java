package com.adhyana.exam.services;

import com.adhyana.exam.models.Grades;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GradeService {
    public List<Grades> getAllGrades() throws Exception {
        System.out.println("GradeService - getAllGrades: Retrieving all grades");
        List<Grades> grades = new ArrayList<>();
        String query = "SELECT grade_id, student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, feedback, graded_by FROM grades";
        System.out.println("GradeService - getAllGrades: Executing query: " + query);

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            int count = 0;
            while (rs.next()) {
                grades.add(createGradeFromResultSet(rs));
                count++;
            }
            System.out.println("GradeService - getAllGrades: Retrieved " + count + " grade records");
        } catch (Exception e) {
            System.out.println("GradeService - getAllGrades: Error occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return grades;
    }

    public Grades getGradeById(int gradeId) throws Exception {
        System.out.println("GradeService - getGradeById: Retrieving grade with ID: " + gradeId);
        String sql = "SELECT grade_id, student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, feedback, graded_by FROM grades WHERE grade_id = ?";
        System.out.println("GradeService - getGradeById: Executing query: " + sql);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, gradeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Grades grade = createGradeFromResultSet(rs);
                    System.out.println("GradeService - getGradeById: Found grade with ID: " + gradeId);
                    return grade;
                } else {
                    System.out.println("GradeService - getGradeById: No grade found with ID: " + gradeId);
                }
            }
        } catch (Exception e) {
            System.out.println("GradeService - getGradeById: Error occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return null;
    }

    public Grades createGrade(Grades grade) throws Exception {
        System.out.println("GradeService - createGrade: Creating new grade for student: " + grade.getStudent_index());
        String query = "INSERT INTO grades (student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, feedback, graded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        System.out.println("GradeService - createGrade: Preparing insert query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setGradeParameters(stmt, grade);
            System.out.println("GradeService - createGrade: Executing insert query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to insert grade";
                System.out.println("GradeService - createGrade: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);
                    grade.setGrade_id(newId);
                    System.out.println("GradeService - createGrade: Grade created with ID: " + newId);
                    return grade;
                } else {
                    String errorMsg = "Failed to insert grade, no ID obtained";
                    System.out.println("GradeService - createGrade: Error - " + errorMsg);
                    throw new SQLException(errorMsg);
                }
            }
        } catch (Exception e) {
            System.out.println("GradeService - createGrade: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void updateGrade(int gradeId, Grades grade) throws Exception {
        System.out.println("GradeService - updateGrade: Updating grade with ID: " + gradeId);
        String query = "UPDATE grades SET student_index = ?, course_id = ?, semester_id = ?, component_id = ?, component_type = ?, marks_obtained = ?, grade = ?, feedback = ?, graded_by = ? WHERE grade_id = ?";
        System.out.println("GradeService - updateGrade: Preparing update query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setGradeParameters(stmt, grade);
            stmt.setInt(10, gradeId);
            System.out.println("GradeService - updateGrade: Executing update query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to update grade. ID may not exist: " + gradeId;
                System.out.println("GradeService - updateGrade: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("GradeService - updateGrade: Successfully updated grade with ID: " + gradeId);
            }
        } catch (Exception e) {
            System.out.println("GradeService - updateGrade: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteGrade(int gradeId) throws Exception {
        System.out.println("GradeService - deleteGrade: Deleting grade with ID: " + gradeId);
        String query = "DELETE FROM grades WHERE grade_id = ?";
        System.out.println("GradeService - deleteGrade: Preparing delete query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, gradeId);
            System.out.println("GradeService - deleteGrade: Executing delete query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to delete grade. ID may not exist: " + gradeId;
                System.out.println("GradeService - deleteGrade: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("GradeService - deleteGrade: Successfully deleted grade with ID: " + gradeId);
            }
        } catch (Exception e) {
            System.out.println("GradeService - deleteGrade: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private Grades createGradeFromResultSet(ResultSet rs) throws SQLException {
        Grades grade = new Grades();
        grade.setGrade_id(rs.getInt("grade_id"));
        grade.setStudent_index(rs.getInt("student_index"));
        grade.setCourse_id(rs.getString("course_id"));
        grade.setSemester_id(rs.getString("semester_id"));
        grade.setComponent_id(rs.getInt("component_id"));
        grade.setComponent_type(rs.getString("component_type"));
        grade.setMarks_obtained(rs.getDouble("marks_obtained"));
        grade.setGrade(rs.getString("grade"));
        grade.setFeedback(rs.getString("feedback"));
        grade.setGraded_by(rs.getInt("graded_by"));
        System.out.println("GradeService - createGradeFromResultSet: Created grade object with ID: " + grade.getGrade_id());
        return grade;
    }

    private void setGradeParameters(PreparedStatement stmt, Grades grade) throws SQLException {
        System.out.println("GradeService - setGradeParameters: Setting parameters for grade with ID: " + grade.getGrade_id());
        stmt.setInt(1, grade.getStudent_index());
        stmt.setString(2, grade.getCourse_id());
        stmt.setString(3, grade.getSemester_id());
        stmt.setInt(4, grade.getComponent_id());
        stmt.setString(5, grade.getComponent_type());
        if (grade.getMarks_obtained() != null) {
            stmt.setDouble(6, grade.getMarks_obtained());
        } else {
            stmt.setNull(6, java.sql.Types.DOUBLE);
        }
        stmt.setString(7, grade.getGrade());
        stmt.setString(8, grade.getFeedback());
        if (grade.getGraded_by() != null) {
            stmt.setInt(9, grade.getGraded_by());
        } else {
            stmt.setNull(9, java.sql.Types.INTEGER);
        }
        System.out.println("GradeService - setGradeParameters: Parameters set successfully");
    }
}
