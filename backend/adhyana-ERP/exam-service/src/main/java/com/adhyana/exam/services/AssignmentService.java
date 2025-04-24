package com.adhyana.exam.services;

import com.adhyana.exam.models.Assignment;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AssignmentService {
    public List<Assignment> getAllAssignments() throws Exception {
        System.out.println("AssignmentService - getAllAssignments: Retrieving all assignments");
        List<Assignment> assignments = new ArrayList<>();
        String query = "SELECT * FROM assignments ORDER BY date,start_time";
        System.out.println("AssignmentService - getAllAssignments: Executing query: " + query);

        try (Connection connection = DatabaseConnection.getConnection();
             Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            int count = 0;
            while (rs.next()) {
                assignments.add(createAssignmentFromResultSet(rs));
                count++;
            }
            System.out.println("AssignmentService - getAllAssignments: Retrieved " + count + " assignments");
        } catch (Exception e) {
            System.out.println("AssignmentService - getAllAssignments: Error occurred: " + e.getMessage());
            throw e;
        }
        return assignments;
    }

    public Assignment getAssignmentById(int id) throws Exception {
        System.out.println("AssignmentService - getAssignmentById: Retrieving assignment with ID: " + id);
        String query = "SELECT * FROM assignments WHERE Aid = ?";
        System.out.println("AssignmentService - getAssignmentById: Executing query: " + query);

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Assignment assignment = createAssignmentFromResultSet(rs);
                    System.out.println("AssignmentService - getAssignmentById: Found assignment: " + assignment.getTitle());
                    return assignment;
                } else {
                    System.out.println("AssignmentService - getAssignmentById: No assignment found with ID: " + id);
                }
            }
        } catch (Exception e) {
            System.out.println("AssignmentService - getAssignmentById: Error occurred: " + e.getMessage());
            throw e;
        }
        return null;
    }

    public Assignment createAssignment(Assignment assignment) throws Exception {
        System.out.println("AssignmentService - createAssignment: Creating new assignment: " + assignment.getTitle());
        String query = "INSERT INTO assignments (title, course, course_code, type, " +
                "date, start_time, end_time, room, teacher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        System.out.println("AssignmentService - createAssignment: Preparing query with parameters");

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            setAssignmentParameters(stmt, assignment);
            System.out.println("AssignmentService - createAssignment: Executing insert query");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                String errorMsg = "Couldn't insert assignment";
                System.out.println("AssignmentService - createAssignment: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int generatedId = generatedKeys.getInt(1);
                    assignment.setId(generatedId);
                    System.out.println("AssignmentService - createAssignment: Assignment created with ID: " + generatedId);
                    return assignment;
                } else {
                    String errorMsg = "Creating assignment failed, no ID obtained.";
                    System.out.println("AssignmentService - createAssignment: Error - " + errorMsg);
                    throw new SQLException(errorMsg);
                }
            }
        } catch (Exception e) {
            System.out.println("AssignmentService - createAssignment: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void updateAssignment(int aid, Assignment assignment) throws Exception {
        System.out.println("AssignmentService - updateAssignment: Updating assignment with ID: " + aid);
        String query = "UPDATE assignments SET title = ?, course = ?, course_code = ?, type = ?, date = ?, " +
                "start_time = ?, end_time = ?, room = ?, teacher = ? WHERE Aid = ?";
        System.out.println("AssignmentService - updateAssignment: Preparing update query");

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {

            setAssignmentParameters(stmt, assignment);
            stmt.setInt(10, aid);
            System.out.println("AssignmentService - updateAssignment: Executing update query");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                String errorMsg = "Couldn't update assignment, ID may not exist: " + aid;
                System.out.println("AssignmentService - updateAssignment: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("AssignmentService - updateAssignment: Successfully updated assignment with ID: " + aid);
            }
        } catch (Exception e) {
            System.out.println("AssignmentService - updateAssignment: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteAssignment(int assignment) throws Exception {
        System.out.println("AssignmentService - deleteAssignment: Deleting assignment with ID: " + assignment);
        String query = "DELETE FROM assignments WHERE Aid = ?";
        System.out.println("AssignmentService - deleteAssignment: Preparing delete query");

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, assignment);
            System.out.println("AssignmentService - deleteAssignment: Executing delete query");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                String errorMsg = "Couldn't delete assignment, ID may not exist: " + assignment;
                System.out.println("AssignmentService - deleteAssignment: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("AssignmentService - deleteAssignment: Successfully deleted assignment with ID: " + assignment);
            }
        } catch (Exception e) {
            System.out.println("AssignmentService - deleteAssignment: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private Assignment createAssignmentFromResultSet(ResultSet rs) throws SQLException {
        Assignment assignment = new Assignment(
                rs.getInt("Aid"),
                rs.getString("title"),
                rs.getString("course"),
                rs.getInt("course_code"),
                rs.getString("type"),
                rs.getString("date"),
                rs.getString("start_time"),
                rs.getString("end_time"),
                rs.getString("room"),
                rs.getString("teacher")
        );
        System.out.println("AssignmentService - createAssignmentFromResultSet: Created assignment object: " +
                assignment.getTitle() + ", ID: " + assignment.getId());
        return assignment;
    }

    private void setAssignmentParameters(PreparedStatement stmt, Assignment assignment) throws SQLException {
        System.out.println("AssignmentService - setAssignmentParameters: Setting parameters for assignment: " + assignment.getTitle());
        stmt.setString(1, assignment.getTitle());
        stmt.setString(2, assignment.getCourse());
        stmt.setInt(3, assignment.getCourseCode());
        stmt.setString(4, assignment.getType());
        stmt.setString(5, assignment.getDate());
        stmt.setString(6, assignment.getStartTime());
        stmt.setString(7, assignment.getEndTime());
        stmt.setString(8, assignment.getRoom());
        stmt.setString(9, assignment.getTeacher());
        System.out.println("AssignmentService - setAssignmentParameters: Parameters set successfully");
    }
}