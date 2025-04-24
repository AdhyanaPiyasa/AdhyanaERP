package com.adhyana.administration.models;

import java.util.Date;

public class Announcement {
    private int id;
    private String title;
    private String content;
    private String category;
    private int postedBy;
    private Date validFrom;
    private Date validUntil;
    private String status;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Announcement() {}

    // Constructor with all fields
    public Announcement(int id, String title, String content, String category,
                        int postedBy, Date validFrom, Date validUntil, String status,
                        Date createdAt, Date updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.postedBy = postedBy;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPostedBy() { return postedBy; }
    public void setPostedBy(int postedBy) { this.postedBy = postedBy; }

    public Date getValidFrom() { return validFrom; }
    public void setValidFrom(Date validFrom) { this.validFrom = validFrom; }

    public Date getValidUntil() { return validUntil; }
    public void setValidUntil(Date validUntil) { this.validUntil = validUntil; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
