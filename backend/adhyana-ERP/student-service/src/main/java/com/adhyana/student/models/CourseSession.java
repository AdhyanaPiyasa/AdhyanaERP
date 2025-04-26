package com.adhyana.student.models;

import java.time.LocalDate;

public class CourseSession {
    private int id;
    private String courseCode;
    private String courseName;
    private LocalDate date;
    private int totalStudents;
    private int presentStudents;
    private double attendancePercentage;

    // Constructor
    public CourseSession(int id, String courseCode, String courseName, LocalDate date,
                         int totalStudents, int presentStudents) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.date = date;
        this.totalStudents = totalStudents;
        this.presentStudents = presentStudents;
        this.calculateAttendancePercentage();
    }

    // Calculate attendance percentage
    private void calculateAttendancePercentage() {
        if (totalStudents > 0) {
            this.attendancePercentage = ((double) presentStudents / totalStudents) * 100.0;
        } else {
            this.attendancePercentage = 0.0;
        }
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
        this.calculateAttendancePercentage();
    }

    public int getPresentStudents() { return presentStudents; }
    public void setPresentStudents(int presentStudents) {
        this.presentStudents = presentStudents;
        this.calculateAttendancePercentage();
    }

    public double getAttendancePercentage() { return attendancePercentage; }
}