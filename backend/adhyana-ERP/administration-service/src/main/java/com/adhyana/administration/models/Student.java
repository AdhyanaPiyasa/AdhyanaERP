package com.adhyana.administration.models;

import java.util.Date;

/**
 * Represents a student in the system.
 * Based on the schema updates for Students.
 */
public class Student {
    private int indexNumber; // Primary key
    private String registrationNumber;
    private String name;
    private String email;
    private String batchId; // Can be null initially
    private String gender; // Added for hostel assignment
    private boolean hostelRequired; // Added for hostel assignment
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Student() {}

    // Constructor with all fields
    public Student(int indexNumber, String registrationNumber, String name, String email,
                   String batchId, String gender, boolean hostelRequired,
                   Date createdAt, Date updatedAt) {
        this.indexNumber = indexNumber;
        this.registrationNumber = registrationNumber;
        this.name = name;
        this.email = email;
        this.batchId = batchId;
        this.gender = gender;
        this.hostelRequired = hostelRequired;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getIndexNumber() { return indexNumber; }
    public void setIndexNumber(int indexNumber) { this.indexNumber = indexNumber; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public boolean isHostelRequired() { return hostelRequired; }
    public void setHostelRequired(boolean hostelRequired) { this.hostelRequired = hostelRequired; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Generate a User Profile creation request for this student
     * @return UserProfileRequest object with student data
     */
    public UserProfileRequest generateUserProfileRequest() {
        UserProfileRequest request = new UserProfileRequest();
        request.setUserId(String.valueOf(indexNumber));
        request.setUsername(this.email);
        // Default password is registration number
        request.setPassword(this.registrationNumber);
        request.setRole("STUDENT");
        return request;
    }
}