// src/main/java/com/adhyana/course/models/Semester.java
package com.adhyana.course.models;

import java.sql.Date;
import java.util.List; // Import List
import java.util.ArrayList; // Import ArrayList

public class Semester {
    private String semesterId;
    private String batchId;
    private int academicYear;
    private int semesterNum;
    private Date startDate;
    private Date endDate;
    private String status;
    private Date createdAt;
    private Date updatedAt;

    // --- NEW FIELD ---
    private List<SemesterOfferingDetail> offerings; // To hold course code and teacher name

    // Constructor with fields in database table order (excluding offerings initially)
    public Semester(String semesterId, String batchId, int academicYear, int semesterNum,
                    Date startDate, Date endDate, String status, Date createdAt, Date updatedAt) {
        this.semesterId = semesterId;
        this.batchId = batchId;
        this.academicYear = academicYear;
        this.semesterNum = semesterNum;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.offerings = new ArrayList<>(); // Initialize the list
    }

    // Constructor without timestamps for creation (excluding offerings initially)
    public Semester(String semesterId, String batchId, int academicYear, int semesterNum,
                    Date startDate, Date endDate, String status) {
        this.semesterId = semesterId;
        this.batchId = batchId;
        this.academicYear = academicYear;
        this.semesterNum = semesterNum;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.offerings = new ArrayList<>(); // Initialize the list
    }

    // Getters and setters
    public String getSemesterId() { return semesterId; }
    public void setSemesterId(String semesterId) { this.semesterId = semesterId; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public int getAcademicYear() { return academicYear; }
    public void setAcademicYear(int academicYear) { this.academicYear = academicYear; }

    public int getSemesterNum() { return semesterNum; }
    public void setSemesterNum(int semesterNum) { this.semesterNum = semesterNum; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    // --- GETTER AND SETTER FOR OFFERINGS ---
    public List<SemesterOfferingDetail> getOfferings() {
        return offerings;
    }

    public void setOfferings(List<SemesterOfferingDetail> offerings) {
        this.offerings = offerings;
    }
    // --- END GETTER AND SETTER ---


    @Override
    public String toString() {
        return "Semester{" +
                "semesterId='" + semesterId + '\'' +
                ", batchId='" + batchId + '\'' +
                ", academicYear=" + academicYear +
                ", semesterNum=" + semesterNum +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", offerings=" + (offerings != null ? offerings.size() : 0) + // Show count in toString
                '}';
    }
}