package com.adhyana.administration.models;

import java.util.Date;

public class AcademicCalendar {
    private int id;
    private String eventTitle;
    private String description;
    private Date eventDate;
    private String eventType;
    private int createdBy;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public AcademicCalendar() {}

    // Constructor with all fields
    public AcademicCalendar(int id, String eventTitle, String description, Date eventDate,
                            String eventType, int createdBy, Date createdAt, Date updatedAt) {
        this.id = id;
        this.eventTitle = eventTitle;
        this.description = description;
        this.eventDate = eventDate;
        this.eventType = eventType;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getEventDate() { return eventDate; }
    public void setEventDate(Date eventDate) { this.eventDate = eventDate; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public int getCreatedBy() { return createdBy; }
    public void setCreatedBy(int createdBy) { this.createdBy = createdBy; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}