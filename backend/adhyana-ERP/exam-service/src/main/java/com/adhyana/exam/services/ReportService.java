package com.adhyana.exam.services;

import java.util.List;
import com.adhyana.exam.models.Reports;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;

public class ReportService {
    public List<Reports> getAllReports() throws Exception {
        System.out.println("ReportService - getAllReports: Retrieving all reports");
        List<Reports> reports = new ArrayList<>();
        String query = "SELECT * FROM reports";
        System.out.println("ReportService - getAllReports: Executing query: " + query);

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            int count = 0;
            while (rs.next()) {
                reports.add(createReportFromResultSet(rs));
                count++;
            }
            System.out.println("ReportService - getAllReports: Retrieved " + count + " report records");
        } catch (Exception e) {
            System.out.println("ReportService - getAllReports: Error occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return reports;
    }

    public Reports getReportById(int id) throws Exception {
        System.out.println("ReportService - getReportById: Retrieving report with ID: " + id);
        String query = "SELECT * FROM reports WHERE reportId = ?";
        System.out.println("ReportService - getReportById: Executing query: " + query);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Reports report = createReportFromResultSet(rs);
                    System.out.println("ReportService - getReportById: Found report for: " + report.getName());
                    return report;
                } else {
                    System.out.println("ReportService - getReportById: No report found with ID: " + id);
                }
            }
        } catch (Exception e) {
            System.out.println("ReportService - getReportById: Error occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return null;
    }

    public Reports createReport(Reports report) throws Exception {
        System.out.println("ReportService - createReport: Creating new report for: " + report.getName());
        String query = "INSERT INTO reports (course_name, exam_name, name, date) VALUES (?, ?, ?, ?)";
        System.out.println("ReportService - createReport: Preparing insert query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            setReportParameters(stmt, report);
            System.out.println("ReportService - createReport: Executing insert query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to insert report";
                System.out.println("ReportService - createReport: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);
                    report.setReportId(newId);
                    System.out.println("ReportService - createReport: Report created with ID: " + newId);
                    return report;
                } else {
                    String errorMsg = "Failed to insert report, no ID obtained";
                    System.out.println("ReportService - createReport: Error - " + errorMsg);
                    throw new SQLException(errorMsg);
                }
            }
        } catch (Exception e) {
            System.out.println("ReportService - createReport: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void updateReport(int reportId, Reports reports) throws Exception {
        System.out.println("ReportService - updateReport: Updating report with ID: " + reportId);
        String query = "UPDATE reports SET course_name = ?, exam_name = ?, name = ?, date = ? WHERE reportId = ?";
        System.out.println("ReportService - updateReport: Preparing update query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, reports.getCoursename());
            stmt.setString(2, reports.getExamname());
            stmt.setString(3, reports.getName());
            stmt.setString(4, reports.getDate());
            stmt.setInt(5, reportId);
            System.out.println("ReportService - updateReport: Executing update query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to update report. ID may not exist: " + reportId;
                System.out.println("ReportService - updateReport: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("ReportService - updateReport: Successfully updated report with ID: " + reportId);
            }
        } catch (Exception e) {
            System.out.println("ReportService - updateReport: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteReport(int reportId) throws Exception {
        System.out.println("ReportService - deleteReport: Deleting report with ID: " + reportId);
        String query = "DELETE FROM reports WHERE reportId = ?";
        System.out.println("ReportService - deleteReport: Preparing delete query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, reportId);
            System.out.println("ReportService - deleteReport: Executing delete query");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                String errorMsg = "Failed to delete report. ID may not exist: " + reportId;
                System.out.println("ReportService - deleteReport: Error - " + errorMsg);
                throw new SQLException(errorMsg);
            } else {
                System.out.println("ReportService - deleteReport: Successfully deleted report with ID: " + reportId);
            }
        } catch (Exception e) {
            System.out.println("ReportService - deleteReport: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private Reports createReportFromResultSet(ResultSet rs) throws SQLException {
        Reports report = new Reports(
                rs.getInt("reportId"),
                rs.getString("course_name"),
                rs.getString("exam_name"),
                rs.getString("name"),
                rs.getString("date")
        );
        System.out.println("ReportService - createReportFromResultSet: Created report object for: " +
                report.getName() + ", ID: " + report.getReportId());
        return report;
    }

    private void setReportParameters(PreparedStatement stmt, Reports reports) throws SQLException {
        System.out.println("ReportService - setReportParameters: Setting parameters for report: " + reports.getName());
        stmt.setString(1, reports.getCoursename());
        stmt.setString(2, reports.getExamname());
        stmt.setString(3, reports.getName());
        stmt.setString(4, reports.getDate());
        System.out.println("ReportService - setReportParameters: Parameters set successfully");
    }
}