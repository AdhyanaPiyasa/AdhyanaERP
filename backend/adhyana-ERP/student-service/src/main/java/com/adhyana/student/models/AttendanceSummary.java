package com.adhyana.student.models;

public class AttendanceSummary {
    private int studentIndex;
    private String studentName;
    private String courseCode;
    private String courseName;
    private int totalSessions;
    private int presentCount;
    private int absentCount;
    private double attendancePercentage;

    // Constructor
    public AttendanceSummary(int studentIndex, String studentName, String courseCode,
                             String courseName, int totalSessions, int presentCount) {
        this.studentIndex = studentIndex;
        this.studentName = studentName;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.totalSessions = totalSessions;
        this.presentCount = presentCount;
        this.absentCount = totalSessions - presentCount;
        this.calculateAttendancePercentage();
    }

    // Calculate attendance percentage
    private void calculateAttendancePercentage() {
        if (totalSessions > 0) {
            this.attendancePercentage = ((double) presentCount / totalSessions) * 100.0;
        } else {
            this.attendancePercentage = 0.0;
        }
    }

    // Getters and setters
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
        this.absentCount = totalSessions - presentCount;
        this.calculateAttendancePercentage();
    }

    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) {
        this.presentCount = presentCount;
        this.absentCount = totalSessions - presentCount;
        this.calculateAttendancePercentage();
    }

    public int getAbsentCount() { return absentCount; }

    public double getAttendancePercentage() { return attendancePercentage; }
}