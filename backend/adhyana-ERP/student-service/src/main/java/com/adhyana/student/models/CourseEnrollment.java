package com.adhyana.student.models;

public class CourseEnrollment {
    private int studentIndex;
    private String studentName;

    public CourseEnrollment(int studentIndex, String studentName) {
        this.studentIndex = studentIndex;
        this.studentName = studentName;
    }

    // Getters and setters
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
}