package com.adhyana.administration.services;

import com.adhyana.administration.models.Payroll;
import com.adhyana.administration.models.Staff;
import com.adhyana.administration.models.StaffAttendance;
import com.adhyana.administration.utils.DatabaseConnection;

import java.sql.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Service for managing payroll-related operations.
 * Updated to match schema changes.
 */
public class PayrollService {

    private final StaffService staffService;

    /**
     * Constructor
     */
    public PayrollService() {
        this.staffService = new StaffService();
    }

    /**
     * Get all payroll records
     * @return List of all payroll records
     */
    public List<Payroll> getAllPayroll() throws Exception {
        List<Payroll> allPayroll = new ArrayList<>();
        String query = "SELECT * FROM payroll ORDER BY salary_month DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                allPayroll.add(mapResultSetToPayroll(rs));
            }
        }
        return allPayroll;
    }

    /**
     * Get payroll history for a staff member
     * @param staffId Staff ID
     * @return List of payroll records
     */
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

    /**
     * Get payroll record by ID
     * @param payrollId Payroll ID
     * @return Payroll record or null if not found
     */
    public Payroll getPayrollById(int payrollId) throws Exception {
        String query = "SELECT * FROM payroll WHERE payroll_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, payrollId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToPayroll(rs);
            }
        }
        return null;
    }

    /**
     * Process payroll for a staff member for a specific month
     * @param staffId Staff ID
     * @param month Month to process payroll for (format: YYYY-MM-01)
     * @return Processed payroll record
     */
    public Payroll processPayroll(int staffId, Date month) throws Exception {
        // Check if staff exists
        Staff staff = staffService.getStaffById(staffId);
        if (staff == null) {
            throw new Exception("Staff not found with id: " + staffId);
        }

        // Ensure month is set to the first day of the month
        Calendar cal = Calendar.getInstance();
        cal.setTime(month);
        cal.set(Calendar.DAY_OF_MONTH, 1);
        Date firstDayOfMonth = cal.getTime();

        // Check if payroll already exists for this month
        if (isPayrollAlreadyProcessed(staffId, firstDayOfMonth)) {
            throw new Exception("Payroll already processed for this month");
        }

        // Get staff attendance for the month
        List<StaffAttendance> attendanceList = staffService.getStaffAttendance(staffId);
        StaffAttendance monthAttendance = null;

        for (StaffAttendance attendance : attendanceList) {
            Calendar attCal = Calendar.getInstance();
            attCal.setTime(attendance.getMonth());

            if (attCal.get(Calendar.YEAR) == cal.get(Calendar.YEAR) &&
                    attCal.get(Calendar.MONTH) == cal.get(Calendar.MONTH)) {
                monthAttendance = attendance;
                break;
            }
        }

        // Calculate salary components
        BigDecimal basicSalary = getBasicSalary(staff);
        BigDecimal allowances = calculateAllowances(staff);
        BigDecimal deductions = BigDecimal.ZERO;

        // Apply attendance-based deductions if attendance record exists
        if (monthAttendance != null) {
            deductions = calculateDeductions(basicSalary, monthAttendance);
        }

        // Net salary calculation happens in the database (GENERATED ALWAYS AS)
        // For the model, we still calculate it
        BigDecimal netSalary = basicSalary.add(allowances).subtract(deductions);

        // Process payroll
        String query = "INSERT INTO payroll (staff_id, salary_month, basic_salary, allowances, " +
                "deductions, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, staffId);
            stmt.setDate(2, new java.sql.Date(firstDayOfMonth.getTime()));
            stmt.setBigDecimal(3, basicSalary);
            stmt.setBigDecimal(4, allowances);
            stmt.setBigDecimal(5, deductions);
            stmt.setString(6, "PENDING");

            // Include attendance information in notes
            String notes = "Generated on " + new java.util.Date() + ". ";
            if (monthAttendance != null) {
                notes += "Attendance: " + monthAttendance.getPresentDays() + "/" +
                        monthAttendance.getWorkingDays() + " days (" +
                        monthAttendance.getAttendancePercentage() + "%).";
            } else {
                notes += "No attendance record available.";
            }
            stmt.setString(7, notes);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Processing payroll failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int payrollId = generatedKeys.getInt(1);
                    return getPayrollById(payrollId);
                } else {
                    throw new Exception("Processing payroll failed, no ID obtained.");
                }
            }
        }
    }

    /**
     * Process payroll for all active staff for a specific month
     * @param month Month to process payroll for (format: YYYY-MM-01)
     * @return Number of payroll records processed
     */
    public int processBulkPayroll(Date month) throws Exception {
        // Get all active staff
        List<Staff> activeStaff = new ArrayList<>();

        for (Staff staff : staffService.getAllStaff()) {
            if ("ACTIVE".equals(staff.getStatus())) {
                activeStaff.add(staff);
            }
        }

        int processedCount = 0;

        // Process payroll for each staff
        for (Staff staff : activeStaff) {
            try {
                processPayroll(staff.getStaffId(), month);
                processedCount++;
            } catch (Exception e) {
                // Log error but continue with next staff
                System.err.println("Error processing payroll for staff " + staff.getStaffId() +
                        " (" + staff.getName() + "): " + e.getMessage());
            }
        }

        return processedCount;
    }

    /**
     * Mark payroll as paid
     * @param payrollId Payroll ID
     * @param paymentDate Payment date
     */
    public void markPayrollAsPaid(int payrollId, Date paymentDate) throws Exception {
        String query = "UPDATE payroll SET payment_status = 'PAID', payment_date = ? WHERE payroll_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setDate(1, new java.sql.Date(paymentDate.getTime()));
            stmt.setInt(2, payrollId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Payroll record not found with id: " + payrollId);
            }
        }
    }

    /**
     * Mark multiple payroll records as paid
     * @param payrollIds List of payroll IDs
     * @param paymentDate Payment date
     * @return Number of records marked as paid
     */
    public int markMultiplePayrollsAsPaid(List<Integer> payrollIds, Date paymentDate) throws Exception {
        if (payrollIds == null || payrollIds.isEmpty()) {
            return 0;
        }

        String query = "UPDATE payroll SET payment_status = 'PAID', payment_date = ? WHERE payroll_id IN (";

        for (int i = 0; i < payrollIds.size(); i++) {
            query += "?";
            if (i < payrollIds.size() - 1) {
                query += ",";
            }
        }
        query += ")";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setDate(1, new java.sql.Date(paymentDate.getTime()));

            for (int i = 0; i < payrollIds.size(); i++) {
                stmt.setInt(i + 2, payrollIds.get(i));
            }

            return stmt.executeUpdate();
        }
    }

    /**
     * Delete a pending payroll record
     * @param payrollId Payroll ID to delete
     */
    public void deletePayroll(int payrollId) throws Exception {
        String query = "DELETE FROM payroll WHERE payroll_id = ? AND payment_status = 'PENDING'";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, payrollId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Cannot delete paid or non-existent payroll record");
            }
        }
    }

    /**
     * Update a pending payroll record
     * @param payrollId Payroll ID to update
     * @param payroll Updated payroll data
     */
    public void updatePayroll(int payrollId, Payroll payroll) throws Exception {
        // Only allow updating pending payrolls
        Payroll existingPayroll = getPayrollById(payrollId);
        if (existingPayroll == null) {
            throw new Exception("Payroll record not found with id: " + payrollId);
        }

        if (!"PENDING".equals(existingPayroll.getPaymentStatus())) {
            throw new Exception("Cannot update non-pending payroll record");
        }

        String query = "UPDATE payroll SET basic_salary = ?, allowances = ?, " +
                "deductions = ?, notes = ? WHERE payroll_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setBigDecimal(1, payroll.getBasicSalary());
            stmt.setBigDecimal(2, payroll.getAllowances());
            stmt.setBigDecimal(3, payroll.getDeductions());
            stmt.setString(4, payroll.getNotes());
            stmt.setInt(5, payrollId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Payroll record not found with id: " + payrollId);
            }
        }
    }

    /**
     * Check if payroll already exists for a staff member for a specific month
     * @param staffId Staff ID
     * @param month Month to check
     * @return true if payroll exists, false otherwise
     */
    private boolean isPayrollAlreadyProcessed(int staffId, Date month) throws Exception {
        String query = "SELECT COUNT(*) FROM payroll WHERE staff_id = ? AND " +
                "YEAR(salary_month) = ? AND MONTH(salary_month) = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            Calendar cal = Calendar.getInstance();
            cal.setTime(month);

            stmt.setInt(1, staffId);
            stmt.setInt(2, cal.get(Calendar.YEAR));
            stmt.setInt(3, cal.get(Calendar.MONTH) + 1);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Get basic salary for a staff member based on position
     * @param staff Staff
     * @return Basic salary
     */
    private BigDecimal getBasicSalary(Staff staff) {
        // In a real implementation, this would fetch from staff grade/position tables
        // For simplicity, using a position-based mapping
        String position = staff.getPosition().toLowerCase();

        if (position.contains("professor")) {
            if (position.contains("associate")) {
                return new BigDecimal("80000.00");
            } else if (position.contains("assistant")) {
                return new BigDecimal("60000.00");
            } else {
                return new BigDecimal("100000.00"); // Full Professor
            }
        } else if (position.contains("lecturer")) {
            return new BigDecimal("40000.00");
        } else if (position.contains("admin")) {
            return new BigDecimal("50000.00");
        } else if (position.contains("officer")) {
            return new BigDecimal("35000.00");
        }

        return new BigDecimal("30000.00"); // Default salary
    }

    /**
     * Calculate allowances for a staff member
     * @param staff Staff
     * @return Allowances
     */
    private BigDecimal calculateAllowances(Staff staff) {
        // In a real implementation, this would calculate various allowances
        // For simplicity, using a percentage of basic salary
        BigDecimal basicSalary = getBasicSalary(staff);

        // Housing allowance - 10% of basic
        BigDecimal housingAllowance = basicSalary.multiply(new BigDecimal("0.10"));

        // Transport allowance - 5% of basic
        BigDecimal transportAllowance = basicSalary.multiply(new BigDecimal("0.05"));

        // Research allowance for academic staff - 5% of basic
        BigDecimal researchAllowance = BigDecimal.ZERO;
        if (staff.getPosition().toLowerCase().contains("professor") ||
                staff.getPosition().toLowerCase().contains("lecturer")) {
            researchAllowance = basicSalary.multiply(new BigDecimal("0.05"));
        }

        // Total allowances
        return housingAllowance.add(transportAllowance).add(researchAllowance);
    }

    /**
     * Calculate deductions based on attendance
     * @param basicSalary Basic salary
     * @param attendance Attendance record
     * @return Deductions
     */
    private BigDecimal calculateDeductions(BigDecimal basicSalary, StaffAttendance attendance) {
        // Calculate per day salary
        BigDecimal perDaySalary = basicSalary.divide(new BigDecimal(attendance.getWorkingDays()),
                2, RoundingMode.HALF_UP);

        // Calculate absent days
        int absentDays = attendance.getWorkingDays() - attendance.getPresentDays();

        // Calculate attendance deduction
        BigDecimal attendanceDeduction = perDaySalary.multiply(new BigDecimal(absentDays));

        // Fixed deductions (tax, pension, etc.)
        BigDecimal taxDeduction = basicSalary.multiply(new BigDecimal("0.05")); // 5% tax
        BigDecimal pensionDeduction = basicSalary.multiply(new BigDecimal("0.03")); // 3% pension

        // Total deductions
        return attendanceDeduction.add(taxDeduction).add(pensionDeduction);
    }

    /**
     * Map database result set to Payroll object
     * @param rs ResultSet
     * @return Payroll object
     */
    private Payroll mapResultSetToPayroll(ResultSet rs) throws SQLException {
        Payroll payroll = new Payroll();
        payroll.setPayrollId(rs.getInt("payroll_id"));
        payroll.setStaffId(rs.getInt("staff_id"));
        payroll.setSalaryMonth(rs.getDate("salary_month"));
        payroll.setBasicSalary(rs.getBigDecimal("basic_salary"));
        payroll.setAllowances(rs.getBigDecimal("allowances"));
        payroll.setDeductions(rs.getBigDecimal("deductions"));
        payroll.setNetSalary(rs.getBigDecimal("net_salary"));
        payroll.setPaymentStatus(rs.getString("payment_status"));
        payroll.setPaymentDate(rs.getDate("payment_date"));
        payroll.setNotes(rs.getString("notes"));
        payroll.setCreatedAt(rs.getTimestamp("created_at"));
        payroll.setUpdatedAt(rs.getTimestamp("updated_at"));
        return payroll;
    }
}