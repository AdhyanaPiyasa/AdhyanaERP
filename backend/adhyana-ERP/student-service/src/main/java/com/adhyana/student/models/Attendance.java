package com.adhyana.student.models;

import java.time.LocalDate;

public class Attendance {
    private int id;
    private int studentIndex;
    private String courseCode;
    private LocalDate date;
    private boolean present;

    // Constructor
    public Attendance(int id, int studentIndex, String courseCode, LocalDate date, boolean present) {
        this.id = id;
        this.studentIndex = studentIndex;
        this.courseCode = courseCode;
        this.date = date;
        this.present = present;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

}