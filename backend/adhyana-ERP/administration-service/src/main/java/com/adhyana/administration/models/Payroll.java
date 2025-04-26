package com.adhyana.administration.models;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Represents a payroll record for a staff member.
 * Updated based on the schema changes.
 */
public class Payroll {
    private int payrollId; // Changed from 'id' to 'payrollId' based on schema
    private int staffId;
    private Date salaryMonth;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary; // Now calculated by database (GENERATED ALWAYS AS)
    private String paymentStatus; // ENUM: 'PENDING', 'PROCESSED', 'PAID', 'FAILED'
    private Date paymentDate;
    private String notes; // Added based on schema updates
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Payroll() {}

    // Constructor with all fields
    public Payroll(int payrollId, int staffId, Date salaryMonth, BigDecimal basicSalary,
                   BigDecimal allowances, BigDecimal deductions, BigDecimal netSalary,
                   String paymentStatus, Date paymentDate, String notes,
                   Date createdAt, Date updatedAt) {
        this.payrollId = payrollId;
        this.staffId = staffId;
        this.salaryMonth = salaryMonth;
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getPayrollId() { return payrollId; }
    public void setPayrollId(int payrollId) { this.payrollId = payrollId; }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public Date getSalaryMonth() { return salaryMonth; }
    public void setSalaryMonth(Date salaryMonth) { this.salaryMonth = salaryMonth; }

    public BigDecimal getBasicSalary() { return basicSalary; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Calculate net salary (in case it's not provided by database)
     * @return The calculated net salary
     */
    public BigDecimal calculateNetSalary() {
        if (basicSalary == null) return BigDecimal.ZERO;

        BigDecimal baseAmount = basicSalary;

        if (allowances != null) {
            baseAmount = baseAmount.add(allowances);
        }

        if (deductions != null) {
            baseAmount = baseAmount.subtract(deductions);
        }

        return baseAmount;
    }
}