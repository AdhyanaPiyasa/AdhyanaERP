package com.adhyana.course.models;

import java.time.LocalDateTime;

public class Announcement {
    private int id;
    private String courseId;
    private String semesterId;
    private String title;
    private String content;
    private Integer postedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor
    public Announcement(int id, String courseId, String semesterId, String title,
                        String content, Integer postedBy, LocalDateTime createdAt,
                        LocalDateTime updatedAt) {
        this.id = id;
        this.courseId = courseId;
        this.semesterId = semesterId;
        this.title = title;
        this.content = content;
        this.postedBy = postedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Simplified constructor for backward compatibility
    public Announcement(int id, String courseId, String title, String content,
                        Integer postedBy, LocalDateTime createdAt) {
        this(id, courseId, null, title, content, postedBy, createdAt, createdAt);
    }

    // Getters and setters
    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public String getCourseId() {return courseId;}
    public void setCourseId(String courseId) {this.courseId = courseId;}

    public String getSemesterId() {return semesterId;}
    public void setSemesterId(String semesterId) {this.semesterId = semesterId;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public Integer getPostedBy() {return postedBy;}
    public void setPostedBy(Integer postedBy) {this.postedBy = postedBy;}

    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}

    public LocalDateTime getUpdatedAt() {return updatedAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}

    // Legacy method for backward compatibility
    public String getAuthor() {
        return postedBy != null ? postedBy.toString() : null;
    }

    // Legacy method for backward compatibility
    public void setAuthor(String author) {
        if (author != null && !author.isEmpty()) {
            try {
                this.postedBy = Integer.parseInt(author);
            } catch (NumberFormatException e) {
                // Handle case where author is not a number
                this.postedBy = null;
            }
        } else {
            this.postedBy = null;
        }
    }

    // Legacy method for backward compatibility
    public int getcourseId() {
        if (courseId != null && !courseId.isEmpty()) {
            try {
                return Integer.parseInt(courseId);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

    // Legacy method for backward compatibility
    public void setcourseId(int courseId) {
        this.courseId = String.valueOf(courseId);
    }
}