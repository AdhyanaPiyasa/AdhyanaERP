package com.adhyana.administration.models;

import java.util.Date;

/**
 * Represents a faculty member assigned to teach a batch.
 * Updated based on schema changes.
 */
public class BatchFacultyAssignment {
    private int assignmentId; // Changed from 'id' to 'assignmentId' for clarity
    private String batchId; // Changed from int to String based on batch schema
    private int staffId;
    private String courseId; // Changed from 'subject' to 'courseId' for schema consistency
    private Date assignmentDate;
    private Date endDate;
    private String status; // e.g., "ACTIVE", "COMPLETED", "CANCELLED"
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public BatchFacultyAssignment() {}

    // Constructor with all fields
    public BatchFacultyAssignment(int assignmentId, String batchId, int staffId, String courseId,
                                  Date assignmentDate, Date endDate, String status,
                                  Date createdAt, Date updatedAt) {
        this.assignmentId = assignmentId;
        this.batchId = batchId;
        this.staffId = staffId;
        this.courseId = courseId;
        this.assignmentDate = assignmentDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getAssignmentId() { return assignmentId; }
    public void setAssignmentId(int assignmentId) { this.assignmentId = assignmentId; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public Date getAssignmentDate() { return assignmentDate; }
    public void setAssignmentDate(Date assignmentDate) { this.assignmentDate = assignmentDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Check if the assignment is currently active
     * @return true if active, false otherwise
     */
    public boolean isActive() {
        return "ACTIVE".equals(status);
    }

    /**
     * Check if the assignment has ended
     * @return true if ended, false otherwise
     */
    public boolean isEnded() {
        if (endDate == null) {
            return false;
        }
        return new Date().after(endDate);
    }
}