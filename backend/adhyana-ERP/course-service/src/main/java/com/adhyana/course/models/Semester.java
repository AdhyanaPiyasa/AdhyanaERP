package com.adhyana.course.models;

import java.sql.Date;

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

    // Constructor with fields in database table order
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
    }

    // Constructor without timestamps for creation
    public Semester(String semesterId, String batchId, int academicYear, int semesterNum,
                    Date startDate, Date endDate, String status) {
        this.semesterId = semesterId;
        this.batchId = batchId;
        this.academicYear = academicYear;
        this.semesterNum = semesterNum;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
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
                '}';
    }
}