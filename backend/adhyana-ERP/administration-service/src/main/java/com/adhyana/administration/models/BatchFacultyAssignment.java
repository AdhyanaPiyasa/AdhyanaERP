package com.adhyana.administration.models;

import java.util.Date;

public class BatchFacultyAssignment {
    private int id;
    private int batchId;
    private int staffId;
    private String subject;
    private Date assignmentDate;
    private Date endDate;
    private String status;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public BatchFacultyAssignment() {}

    // Constructor with all fields
    public BatchFacultyAssignment(int id, int batchId, int staffId, String subject,
                                  Date assignmentDate, Date endDate, String status,
                                  Date createdAt, Date updatedAt) {
        this.id = id;
        this.batchId = batchId;
        this.staffId = staffId;
        this.subject = subject;
        this.assignmentDate = assignmentDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getBatchId() { return batchId; }
    public void setBatchId(int batchId) { this.batchId = batchId; }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

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
}
