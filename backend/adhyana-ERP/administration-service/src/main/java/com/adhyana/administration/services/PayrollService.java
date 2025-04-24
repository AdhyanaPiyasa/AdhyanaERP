package com.adhyana.administration.services;

import com.adhyana.administration.models.Payroll;
import com.adhyana.administration.utils.DatabaseConnection;
import java.sql.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PayrollService {

    public List<Payroll> getPayrollHistory(int staffId) throws Exception {
        List<Payroll> payrollHistory = new ArrayList<>();
        String query = "SELECT * FROM payroll WHERE staff_id = ? ORDER BY salary_month DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                payrollHistory.add(mapResultSetToPayroll(rs));
            }
        }
        return payrollHistory;
    }

    public Payroll getPayrollById(int id) throws Exception {
        String query = "SELECT * FROM payroll WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToPayroll(rs);
            }
        }
        return null;
    }

    public void processPayroll(int staffId, Date month) throws Exception {
        // Check if payroll already exists for this month
        if (isPayrollAlreadyProcessed(staffId, month)) {
            throw new Exception("Payroll already processed for this month");
        }

        // Calculate salary components
        String query = "INSERT INTO payroll (staff_id, salary_month, basic_salary, allowances, deductions, net_salary, payment_status) " +
                "VALUES (?, ?, ?, ?, ?, ?, 'PENDING')";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            BigDecimal basicSalary = getBasicSalary(staffId);
            BigDecimal allowances = calculateAllowances(staffId);
            BigDecimal deductions = calculateDeductions(staffId);
            BigDecimal netSalary = basicSalary.add(allowances).subtract(deductions);

            stmt.setInt(1, staffId);
            stmt.setDate(2, new java.sql.Date(month.getTime()));
            stmt.setBigDecimal(3, basicSalary);
            stmt.setBigDecimal(4, allowances);
            stmt.setBigDecimal(5, deductions);
            stmt.setBigDecimal(6, netSalary);

            stmt.executeUpdate();
        }
    }

    public void markPayrollAsPaid(int payrollId, Date paymentDate) throws Exception {
        String query = "UPDATE payroll SET payment_status = 'PAID', payment_date = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setDate(1, new java.sql.Date(paymentDate.getTime()));
            stmt.setInt(2, payrollId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Payroll record not found");
            }
        }
    }

    public void deletePayroll(int id) throws Exception {
        String query = "DELETE FROM payroll WHERE id = ? AND payment_status = 'PENDING'";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Cannot delete paid or non-existent payroll record");
            }
        }
    }

    private boolean isPayrollAlreadyProcessed(int staffId, Date month) throws Exception {
        String query = "SELECT COUNT(*) FROM payroll WHERE staff_id = ? AND " +
                "YEAR(salary_month) = ? AND MONTH(salary_month) = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(month);

            stmt.setInt(1, staffId);
            stmt.setInt(2, cal.get(java.util.Calendar.YEAR));
            stmt.setInt(3, cal.get(java.util.Calendar.MONTH) + 1);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    private BigDecimal getBasicSalary(int staffId) throws Exception {
        // In a real implementation, this would fetch from staff grade/position tables
        // For now, using a simple implementation
        String query = "SELECT position FROM staff WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, staffId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String position = rs.getString("position");
                // Simple salary mapping based on position
                switch (position) {
                    case "Professor":
                        return new BigDecimal("100000.00");
                    case "Associate Professor":
                        return new BigDecimal("80000.00");
                    case "Assistant Professor":
                        return new BigDecimal("60000.00");
                    case "Lecturer":
                        return new BigDecimal("40000.00");
                    default:
                        return new BigDecimal("30000.00");
                }
            }
        }
        return new BigDecimal("30000.00"); // Default salary
    }

    private BigDecimal calculateAllowances(int staffId) throws Exception {
        // In a real implementation, this would calculate various allowances
        // For simplicity, returning 20% of basic salary
        BigDecimal basicSalary = getBasicSalary(staffId);
        return basicSalary.multiply(new BigDecimal("0.2"));
    }

    private BigDecimal calculateDeductions(int staffId) throws Exception {
        // In a real implementation, this would calculate various deductions
        // For simplicity, returning 10% of basic salary
        BigDecimal basicSalary = getBasicSalary(staffId);
        return basicSalary.multiply(new BigDecimal("0.1"));
    }

    private Payroll mapResultSetToPayroll(ResultSet rs) throws SQLException {
        Payroll payroll = new Payroll();
        payroll.setId(rs.getInt("id"));
        payroll.setStaffId(rs.getInt("staff_id"));
        payroll.setSalaryMonth(rs.getDate("salary_month"));
        payroll.setBasicSalary(rs.getBigDecimal("basic_salary"));
        payroll.setAllowances(rs.getBigDecimal("allowances"));
        payroll.setDeductions(rs.getBigDecimal("deductions"));
        payroll.setNetSalary(rs.getBigDecimal("net_salary"));
        payroll.setPaymentStatus(rs.getString("payment_status"));
        payroll.setPaymentDate(rs.getDate("payment_date"));
        payroll.setCreatedAt(rs.getTimestamp("created_at"));
        payroll.setUpdatedAt(rs.getTimestamp("updated_at"));
        return payroll;
    }
}