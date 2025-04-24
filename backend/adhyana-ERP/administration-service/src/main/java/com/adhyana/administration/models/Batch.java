package com.adhyana.administration.models;

import java.util.Date;

public class Batch {
    private int id;
    private String batchName;
    private Date startDate;
    private Date endDate;
    private int courseId;
    private int capacity;
    private String status;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Batch() {}

    // Constructor with all fields
    public Batch(int id, String batchName, Date startDate, Date endDate,
                 int courseId, int capacity, String status, Date createdAt, Date updatedAt) {
        this.id = id;
        this.batchName = batchName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.courseId = courseId;
        this.capacity = capacity;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
