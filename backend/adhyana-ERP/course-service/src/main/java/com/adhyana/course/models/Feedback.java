package com.adhyana.course.models;

import java.sql.Timestamp;

public class Feedback {
    private int feedbackId;
    private String courseId;
    private String semesterId;
    private Integer studentIndex;
    private int ratingContent;
    private int ratingInstructor;
    private int ratingMaterials;
    private int ratingLms;
    private String comment;
    private boolean isAnonymous;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructor
    public Feedback(int feedbackId, String courseId, String semesterId, Integer studentIndex,
                    int ratingContent, int ratingInstructor, int ratingMaterials, int ratingLms,
                    String comment, boolean isAnonymous,
                    Timestamp createdAt, Timestamp updatedAt) {
        this.feedbackId = feedbackId;
        this.courseId = courseId;
        this.semesterId = semesterId;
        this.studentIndex = studentIndex;
        this.ratingContent = ratingContent;
        this.ratingInstructor = ratingInstructor;
        this.ratingMaterials = ratingMaterials;
        this.ratingLms = ratingLms;
        this.comment = comment;
        this.isAnonymous = isAnonymous;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public int getFeedbackId() { return feedbackId; }
    public void setFeedbackId(int feedbackId) { this.feedbackId = feedbackId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getSemesterId() { return semesterId; }
    public void setSemesterId(String semesterId) { this.semesterId = semesterId; }

    public Integer getStudentIndex() { return studentIndex; }
    public void setStudentIndex(Integer studentIndex) { this.studentIndex = studentIndex; }

    public int getRatingContent() { return ratingContent; }
    public void setRatingContent(int ratingContent) { this.ratingContent = ratingContent; }

    public int getRatingInstructor() { return ratingInstructor; }
    public void setRatingInstructor(int ratingInstructor) { this.ratingInstructor = ratingInstructor; }

    public int getRatingMaterials() { return ratingMaterials; }
    public void setRatingMaterials(int ratingMaterials) { this.ratingMaterials = ratingMaterials; }

    public int getRatingLms() { return ratingLms; }
    public void setRatingLms(int ratingLms) { this.ratingLms = ratingLms; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    // Backward compatibility methods if needed
    public int getId() { return feedbackId; }
    public void setId(int id) { this.feedbackId = id; }
}