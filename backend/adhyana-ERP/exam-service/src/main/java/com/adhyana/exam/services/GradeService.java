package com.adhyana.exam.services;

import java.util.List;
import com.adhyana.exam.models.Grades;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;

public class GradeService {
    public List<Grades> getAllGrades() throws Exception {
        System.out.println("GradeService - getAllGrades: Retrieving all grades");
        List<Grades> grades = new ArrayList<>();
        String query = "SELECT * FROM grades";
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

    public Grades getGradeById(int Gid) throws Exception {
        System.out.println("GradeService - getGradeById: Retrieving grade with ID: " + Gid);
        String sql = "SELECT * FROM grades WHERE Gid = ?";
        System.out.println("GradeService - getGradeById: Executing query: " + sql);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, Gid);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Grades grade = createGradeFromResultSet(rs);
                    System.out.println("GradeService - getGradeById: Found grade for: " + grade.getName());
                    return grade;
                } else {
                    System.out.println("GradeService - getGradeById: No grade found with ID: " + Gid);
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
        System.out.println("GradeService - createGrade: Creating new grade for: " + grade.getName());
        String query = "INSERT INTO grades (Index_No, Name, courseCode, courseName, grade) VALUES (?, ?, ?, ?, ?)";
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
                    grade.setGid(newId);
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

    public void updateGrade(int Gid, Grades grades) throws Exception {
        System.out.println("GradeService - updateGrade: Updating grade with ID: " + Gid);
        String query = "UPDATE grades SET Index_No = ?, Name = ?, courseCode = ?, courseName = ?, grade = ? WHERE Gid = ?";
        System.out.println("GradeService - updateGrade: Preparing update query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, grades.getIndex_No());
            stmt.setString(2, grades.getName());
            stmt.setInt(3, grades.getCourseCode());
            stmt.setString(4, grades.getCourseName());
            stmt.setString(5, grades.getGrade());
            stmt.setInt(6, Gid);
            System.out.println("GradeService - updateGrade: Executing update query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to update grade. ID may not exist: " + Gid;
                System.out.println("GradeService - updateGrade: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("GradeService - updateGrade: Successfully updated grade with ID: " + Gid);
            }
        } catch (Exception e) {
            System.out.println("GradeService - updateGrade: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteGrade(int Gid) throws Exception {
        System.out.println("GradeService - deleteGrade: Deleting grade with ID: " + Gid);
        String query = "DELETE FROM grades WHERE Gid = ?";
        System.out.println("GradeService - deleteGrade: Preparing delete query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, Gid);
            System.out.println("GradeService - deleteGrade: Executing delete query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to delete grade. ID may not exist: " + Gid;
                System.out.println("GradeService - deleteGrade: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("GradeService - deleteGrade: Successfully deleted grade with ID: " + Gid);
            }
        } catch (Exception e) {
            System.out.println("GradeService - deleteGrade: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private Grades createGradeFromResultSet(ResultSet rs) throws SQLException {
        Grades grade = new Grades(
                rs.getInt("Gid"),
                rs.getString("Index_No"),
                rs.getString("Name"),
                rs.getInt("courseCode"),
                rs.getString("courseName"),
                rs.getString("grade")
        );
        System.out.println("GradeService - createGradeFromResultSet: Created grade object for: " +
                grade.getName() + ", ID: " + grade.getGid());
        return grade;
    }

    private void setGradeParameters(PreparedStatement stmt, Grades grades) throws SQLException {
        System.out.println("GradeService - setGradeParameters: Setting parameters for grade: " + grades.getName());
        stmt.setString(1, grades.getIndex_No());
        stmt.setString(2, grades.getName());
        stmt.setInt(3, grades.getCourseCode());
        stmt.setString(4, grades.getCourseName());
        stmt.setString(5, grades.getGrade());
        System.out.println("GradeService - setGradeParameters: Parameters set successfully");
    }
}