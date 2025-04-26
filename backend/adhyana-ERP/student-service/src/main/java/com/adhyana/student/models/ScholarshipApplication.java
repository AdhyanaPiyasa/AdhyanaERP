// student-service/src/main/java/com/adhyana/student/models/ScholarshipApplication.java
package com.adhyana.student.models;

public class ScholarshipApplication {
    private int id;
    private int studentIndexNumber;
    private int scholarshipId;
    private String studentBatch;
    private String studentDegree;
    private double studentGpa;
    private String status;
    private String comments;

    // Constructor
    public ScholarshipApplication(int id, int studentIndexNumber, int scholarshipId,
                                  String studentBatch, String studentDegree,
                                  double studentGpa, String status, String comments) {
        this.id = id;
        this.studentIndexNumber = studentIndexNumber;
        this.scholarshipId = scholarshipId;
        this.studentBatch = studentBatch;
        this.studentDegree = studentDegree;
        this.studentGpa = studentGpa;
        this.status = status;
        this.comments = comments;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getStudentIndexNumber() { return studentIndexNumber; }
    public void setStudentIndexNumber(int studentId) { this.studentIndexNumber = studentIndexNumber; }

    public int getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(int scholarshipId) { this.scholarshipId = scholarshipId; }

    public String getStudentBatch() { return studentBatch; }
    public void setStudentBatch(String studentBatch) { this.studentBatch = studentBatch; }

    public String getStudentDegree() { return studentDegree; }
    public void setStudentDegree(String studentDegree) { this.studentDegree = studentDegree; }

    public double getStudentGpa() { return studentGpa; }
    public void setStudentGpa(double studentGpa) { this.studentGpa = studentGpa; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}