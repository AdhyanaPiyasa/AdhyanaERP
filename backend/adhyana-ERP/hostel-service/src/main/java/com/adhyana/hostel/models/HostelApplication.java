package com.adhyana.hostel.models;

import java.sql.Date;
import java.sql.Timestamp;

public class HostelApplication {
    private int applicationId;
    private int studentIndex;
    private Date applicationDate;
    private String status; // Pending, Approved, Rejected, Waitlisted
    private Integer preferredHostelId; // Nullable
    private String notes; // Nullable
    private Timestamp createdAt;
    private Timestamp updatedAt;
    // Can add student details if needed via JOIN later
    private String studentName; // Added for convenience
    private String studentGender; // Added for convenience


    // Constructors, Getters, Setters...
    public HostelApplication() {}

    // Example Constructor
    public HostelApplication(int applicationId, int studentIndex, Date applicationDate, String status, Integer preferredHostelId, String notes, Timestamp createdAt, Timestamp updatedAt) {
        this.applicationId = applicationId;
        this.studentIndex = studentIndex;
        this.applicationDate = applicationDate;
        this.status = status;
        this.preferredHostelId = preferredHostelId;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    // --- Getters and Setters ---
    public int getApplicationId() { return applicationId; }
    public void setApplicationId(int applicationId) { this.applicationId = applicationId; }
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }
    public Date getApplicationDate() { return applicationDate; }
    public void setApplicationDate(Date applicationDate) { this.applicationDate = applicationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getPreferredHostelId() { return preferredHostelId; }
    public void setPreferredHostelId(Integer preferredHostelId) { this.preferredHostelId = preferredHostelId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
    // Getter/Setter for studentName (populated via join)
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentGender() { return studentGender; }
    public void setStudentGender(String studentGender) { this.studentGender = studentGender; }
}