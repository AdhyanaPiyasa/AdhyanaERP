package com.adhyana.administration.models;

import java.util.Date;

/**
 * Model for tracking staff attendance records.
 * New model added to support staff attendance tracking functionality.
 */
public class StaffAttendance {
    private int attendanceId;
    private int staffId;
    private Date month; // Stored as the first day of the month (YYYY-MM-01)
    private int workingDays;
    private int presentDays;
    private String status; // e.g., "APPROVED", "PENDING"
    private int approvedBy;
    private Date approvedDate;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public StaffAttendance() {}

    // Constructor with all fields
    public StaffAttendance(int attendanceId, int staffId, Date month, int workingDays,
                           int presentDays, String status, int approvedBy,
                           Date approvedDate, Date createdAt, Date updatedAt) {
        this.attendanceId = attendanceId;
        this.staffId = staffId;
        this.month = month;
        this.workingDays = workingDays;
        this.presentDays = presentDays;
        this.status = status;
        this.approvedBy = approvedBy;
        this.approvedDate = approvedDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public Date getMonth() { return month; }
    public void setMonth(Date month) { this.month = month; }

    public int getWorkingDays() { return workingDays; }
    public void setWorkingDays(int workingDays) { this.workingDays = workingDays; }

    public int getPresentDays() { return presentDays; }
    public void setPresentDays(int presentDays) { this.presentDays = presentDays; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getApprovedBy() { return approvedBy; }
    public void setApprovedBy(int approvedBy) { this.approvedBy = approvedBy; }

    public Date getApprovedDate() { return approvedDate; }
    public void setApprovedDate(Date approvedDate) { this.approvedDate = approvedDate; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Calculate attendance percentage for the month
     * @return Attendance percentage
     */
    public double getAttendancePercentage() {
        if (workingDays == 0) return 0;
        return ((double) presentDays / workingDays) * 100;
    }
}