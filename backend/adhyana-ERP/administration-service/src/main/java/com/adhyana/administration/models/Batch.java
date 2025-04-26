package com.adhyana.administration.models;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents a batch of students for a specific academic program.
 * Updated based on the schema changes.
 */
public class Batch {
    private String batchId; // Changed from int to String based on schema
    private String batchName;
    private Date startDate;
    private Date endDate;
    private int capacity;
    private String status; // ENUM: 'PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'
    private List<String> courseIds; // List of associated course IDs
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Batch() {
        this.courseIds = new ArrayList<>();
    }

    // Constructor with all fields
    public Batch(String batchId, String batchName, Date startDate, Date endDate,
                 int capacity, String status, List<String> courseIds,
                 Date createdAt, Date updatedAt) {
        this.batchId = batchId;
        this.batchName = batchName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.capacity = capacity;
        this.status = status;
        this.courseIds = courseIds != null ? courseIds : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getCourseIds() { return courseIds; }
    public void setCourseIds(List<String> courseIds) { this.courseIds = courseIds; }

    public void addCourseId(String courseId) {
        if (this.courseIds == null) {
            this.courseIds = new ArrayList<>();
        }
        this.courseIds.add(courseId);
    }

    public void removeCourseId(String courseId) {
        if (this.courseIds != null) {
            this.courseIds.remove(courseId);
        }
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Check if batch has available capacity
     * @return true if batch has available spots, false if full
     */
    public boolean hasAvailableCapacity() {
        // This would need to query the database to check current enrollment
        // Placeholder implementation
        return true;
    }

    /**
     * Calculate duration in months
     * @return Duration in months or -1 if dates not set
     */
    public int getDurationInMonths() {
        if (startDate == null || endDate == null) {
            return -1;
        }

        // Calculate months between start and end date
        long startTime = startDate.getTime();
        long endTime = endDate.getTime();
        long diffInMillies = endTime - startTime;

        // Convert to months (approximate)
        return (int)(diffInMillies / (1000L * 60 * 60 * 24 * 30));
    }
}