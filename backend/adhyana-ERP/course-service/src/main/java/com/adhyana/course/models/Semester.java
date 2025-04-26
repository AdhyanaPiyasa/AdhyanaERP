// semester-service/src/main/java/com/adhyana/semester/models/Semester.java
package com.adhyana.course.models;

import java.sql.Date;

public class Semester {
    private int id;
    private int batchId;
    private int courseId;
    private int teacherId;
    private int year;
    private int semester;
    private String startedAt; // Month and year only, e.g., "August 2023"
    private String endedAt;   // Month and year only, e.g., "December 2023"
    private Date createdAt;
    private Date updatedAt;

    // Constructor with fields in database table order
    public Semester(int id, int batchId, int courseId, int teacherId, int year, int semester, String startedAt, String endedAt, Date createdAt, Date updatedAt) {
        this.id = id;
        this.batchId = batchId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.year = year;
        this.semester = semester;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor without timestamps for creation
    public Semester(int id, int batchId, int courseId, int teacherId, int year, int semester,
                    String startedAt, String endedAt) {
        this.id = id;
        this.batchId = batchId;
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.year = year;
        this.semester = semester;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getBatchId() { return batchId; }
    public void setBatchId(int batchId) { this.batchId = batchId; }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public int getTeacherId() { return teacherId; }
    public void setTeacherId(int teacherId) { this.teacherId = teacherId; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }

    public String getEndedAt() { return endedAt; }
    public void setEndedAt(String endedAt) { this.endedAt = endedAt; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Semester{" +
                "id=" + id +
                ", batchId=" + batchId +
                ", courseId=" + courseId +
                ", teacherId=" + teacherId +
                ", year=" + year +
                ", semester=" + semester +
                ", startedAt='" + startedAt + '\'' +
                ", endedAt='" + endedAt + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

