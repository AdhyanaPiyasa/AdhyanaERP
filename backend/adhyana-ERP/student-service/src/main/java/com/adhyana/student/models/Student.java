package com.adhyana.student.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Student {
    private int studentIndex;
    private String registrationNumber;
    private String name;
    private String email;
    private String batchId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Student(int studentIndex, String registrationNumber, String name, String email,
                   String batchId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.studentIndex = studentIndex;
        this.registrationNumber = registrationNumber;
        this.name = name;
        this.email = email;
        this.batchId = batchId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor without timestamps for creation operations
    public Student(int studentIndex, String registrationNumber, String name, String email, String batchId) {
        this.studentIndex = studentIndex;
        this.registrationNumber = registrationNumber;
        this.name = name;
        this.email = email;
        this.batchId = batchId;
    }

    // Getters and setters
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}