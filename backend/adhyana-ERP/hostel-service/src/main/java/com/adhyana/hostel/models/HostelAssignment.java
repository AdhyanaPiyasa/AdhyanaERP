package com.adhyana.hostel.models;

import java.sql.Date;
import java.sql.Timestamp;

public class HostelAssignment {
    private int assignmentId;
    private int studentIndex;
    private int hostelId;
    private Date assignedDate;
    private String status; // Active, Inactive
    private Timestamp createdAt;
    private Timestamp updatedAt;
    // Can add student/hostel names via JOIN later

    // Constructors, Getters, Setters...
    public HostelAssignment() {}

    // --- Getters and Setters ---
    public int getAssignmentId() { return assignmentId; }
    public void setAssignmentId(int assignmentId) { this.assignmentId = assignmentId; }
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }
    public int getHostelId() { return hostelId; }
    public void setHostelId(int hostelId) { this.hostelId = hostelId; }
    public Date getAssignedDate() { return assignedDate; }
    public void setAssignedDate(Date assignedDate) { this.assignedDate = assignedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}