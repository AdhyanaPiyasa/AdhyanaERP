// src/main/java/com/adhyana/course/models/SemesterOfferingDetail.java
package com.adhyana.course.models;

public class SemesterOfferingDetail {
    private String courseId;
    private String teacherName; // Used for displaying data fetched FROM DB
    private Integer staffId;   // Used for receiving data FROM frontend requests

    // Constructor for data coming FROM DB (via getSemesterOfferingsDetails)
    public SemesterOfferingDetail(String courseId, String teacherName) {
        this.courseId = courseId;
        this.teacherName = teacherName;
        this.staffId = null; // Not applicable here
    }

    // Constructor for data coming FROM frontend request
    public SemesterOfferingDetail(String courseId, Integer staffId) {
        this.courseId = courseId;
        this.staffId = staffId;
        this.teacherName = null; // Not applicable here
    }

    // Default constructor (good practice for libraries/frameworks)
    public SemesterOfferingDetail() {}

    // --- Getters ---
    public String getCourseId() {
        return courseId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    // --- THIS METHOD MUST EXIST ---
    public Integer getStaffId() {
        return staffId;
    }
    // --- END GETTER ---

    // --- Setters --- (Might be needed for some frameworks/libraries)
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }
    // --- END SETTERS ---

    @Override
    public String toString() {
        return "SemesterOfferingDetail{" +
                "courseId='" + courseId + '\'' +
                ", teacherName='" + teacherName + '\'' + // May be null
                ", staffId=" + staffId +                // May be null
                '}';
    }
}