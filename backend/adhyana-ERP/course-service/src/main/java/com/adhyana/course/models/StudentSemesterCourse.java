package com.adhyana.course.models;

import java.sql.Timestamp;
import java.util.Objects;

/**
 * Represents an enrollment record linking a student to a specific course within a semester.
 * Corresponds to the 'student_semester_courses' table.
 */
public class StudentSemesterCourse {
    private int studentIndex;
    private String semesterId;
    private String courseId;
    private Timestamp enrollmentDate;

    // Default constructor
    public StudentSemesterCourse() {
    }

    // Constructor with all fields
    public StudentSemesterCourse(int studentIndex, String semesterId, String courseId, Timestamp enrollmentDate) {
        this.studentIndex = studentIndex;
        this.semesterId = semesterId;
        this.courseId = courseId;
        this.enrollmentDate = enrollmentDate;
    }

    // Getters and Setters
    public int getStudentIndex() {
        return studentIndex;
    }

    public void setStudentIndex(int studentIndex) {
        this.studentIndex = studentIndex;
    }

    public String getSemesterId() {
        return semesterId;
    }

    public void setSemesterId(String semesterId) {
        this.semesterId = semesterId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Timestamp getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(Timestamp enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    @Override
    public String toString() {
        return "StudentSemesterCourse{" +
                "studentIndex=" + studentIndex +
                ", semesterId='" + semesterId + '\'' +
                ", courseId='" + courseId + '\'' +
                ", enrollmentDate=" + enrollmentDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudentSemesterCourse that = (StudentSemesterCourse) o;
        return studentIndex == that.studentIndex &&
                Objects.equals(semesterId, that.semesterId) &&
                Objects.equals(courseId, that.courseId);
        // enrollmentDate is not part of the primary key, so not included in equals
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentIndex, semesterId, courseId);
        // enrollmentDate is not part of the primary key, so not included in hashCode
    }
}