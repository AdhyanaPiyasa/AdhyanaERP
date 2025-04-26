package com.adhyana.exam.services;

import com.adhyana.exam.models.Reports;
import com.adhyana.exam.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReportService {
    public List<Reports> getAllReports() throws Exception {
        System.out.println("ReportService - getAllReports: Retrieving all reports");
        List<Reports> reports = new ArrayList<>();
        String query = "SELECT report_id, report_type, generated_for_type, generated_for_id, generated_by, generation_date FROM generated_reports";
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

    public Reports getReportById(int reportId) throws Exception {
        System.out.println("ReportService - getReportById: Retrieving report with ID: " + reportId);
        String query = "SELECT report_id, report_type, generated_for_type, generated_for_id, generated_by, generation_date FROM generated_reports WHERE report_id = ?";
        System.out.println("ReportService - getReportById: Executing query: " + query);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, reportId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Reports report = createReportFromResultSet(rs);
                    System.out.println("ReportService - getReportById: Found report with ID: " + reportId);
                    return report;
                } else {
                    System.out.println("ReportService - getReportById: No report found with ID: " + reportId);
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
        System.out.println("ReportService - createReport: Creating new report of type: " + report.getReport_type());
        String query = "INSERT INTO generated_reports (report_type, generated_for_type, generated_for_id, generated_by, generation_date) VALUES (?, ?, ?, ?, ?)";
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
                    report.setReport_id(newId);
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

    public void updateReport(int reportId, Reports report) throws Exception {
        System.out.println("ReportService - updateReport: Updating report with ID: " + reportId);
        String query = "UPDATE generated_reports SET report_type = ?, generated_for_type = ?, generated_for_id = ?, generated_by = ?, generation_date = ? WHERE report_id = ?";
        System.out.println("ReportService - updateReport: Preparing update query");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            setReportParameters(stmt, report);
            stmt.setInt(6, reportId);
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
        String query = "DELETE FROM generated_reports WHERE report_id = ?";
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
        Reports report = new Reports();
        report.setReport_id(rs.getInt("report_id"));
        report.setReport_type(rs.getString("report_type"));
        report.setGenerated_for_type(rs.getString("generated_for_type"));
        report.setGenerated_for_id(rs.getString("generated_for_id"));
        report.setGenerated_by(rs.getInt("generated_by"));
        report.setGeneration_date(rs.getTimestamp("generation_date"));
        return report;
    }

    private void setReportParameters(PreparedStatement stmt, Reports report) throws SQLException {
        System.out.println("ReportService - setReportParameters: Setting parameters for report with ID: " + report.getReport_id());
        stmt.setString(1, report.getReport_type());
        stmt.setString(2, report.getGenerated_for_type());
        stmt.setString(3, report.getGenerated_for_id());
        if (report.getGenerated_by() != null) {
            stmt.setInt(4, report.getGenerated_by());
        } else {
            stmt.setNull(4, java.sql.Types.INTEGER);
        }
        stmt.setTimestamp(5, report.getGeneration_date());
        System.out.println("ReportService - setReportParameters: Parameters set successfully");
    }
}

