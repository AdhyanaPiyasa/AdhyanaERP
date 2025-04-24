package com.adhyana.student.models;

import java.time.LocalDate;

public class Attendance {
    private int id;
    private int studentId;
    private String courseCode;
    private LocalDate date;
    private boolean present;
    private String remarks;// Optional notes about this attendance record (e.g., reason for absence)

    // Constructor to initialize all fields
    public Attendance(int id, int studentId, String courseCode, LocalDate date, boolean present, String remarks) {
        this.id = id;
        this.studentId = studentId;
        this.courseCode = courseCode;
        this.date = date;
        this.present = present;
        this.remarks = remarks;
    }

    // Getters and setters for all fields(allow controlled access to the private fields)
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

}
