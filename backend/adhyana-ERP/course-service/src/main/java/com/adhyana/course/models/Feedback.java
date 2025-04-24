
// course-service/src/main/java/com/adhyana/course/models/CourseFeedback.java
package com.adhyana.course.models;

import java.sql.Timestamp;

public class Feedback {
    private int id;
    private int courseId;
    private Integer studentId; // Use Integer to allow null (for anonymous)
    private String teacher;  //Optional, depends on your use case
    private int ratingContent;
    private int ratingInstructor;
    private int ratingLms;
    private String comment;
    private boolean isAnonymous;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructor
    public Feedback(int id, int courseId, Integer studentId,String teacher,
                          int ratingContent, int ratingInstructor, int ratingLms,
                          String comment, boolean isAnonymous,
                          Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.courseId = courseId;
        this.studentId = studentId;
        this.teacher = teacher;
        this.ratingContent = ratingContent;
        this.ratingInstructor = ratingInstructor;
        this.ratingLms = ratingLms;
        this.comment = comment;
        this.isAnonymous = isAnonymous;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

     public String getTeacher() { return teacher; }
     public void setTeacher(String teacher) { this.teacher = teacher; }

    public int getRatingContent() { return ratingContent; }
    public void setRatingContent(int ratingContent) { this.ratingContent = ratingContent; }

    public int getRatingInstructor() { return ratingInstructor; }
    public void setRatingInstructor(int ratingInstructor) { this.ratingInstructor = ratingInstructor; }

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
}
