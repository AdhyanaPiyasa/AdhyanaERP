package com.adhyana.student.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EnrolledStudent {
    private int studentIndex;
    private String registrationNumber;
    private String batchId;
    private String name;
    private String nationalId;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianNationalId;
    private String guardianRelation;
    private String guardianContactNumber;
    private String guardianEmail;
    private String hostelRequired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EnrolledStudent(int studentIndex, String registrationNumber, String batchId, String name,
                           String nationalId, String email, String phone, String gender, LocalDate dateOfBirth,
                           String address, String guardianName, String guardianNationalId, String guardianRelation,
                           String guardianContactNumber, String guardianEmail, String hostelRequired,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.studentIndex = studentIndex;
        this.registrationNumber = registrationNumber;
        this.batchId = batchId;
        this.name = name;
        this.nationalId = nationalId;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianNationalId = guardianNationalId;
        this.guardianRelation = guardianRelation;
        this.guardianContactNumber = guardianContactNumber;
        this.guardianEmail = guardianEmail;
        this.hostelRequired = hostelRequired;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor without timestamps for creation operations
    public EnrolledStudent(int studentIndex, String registrationNumber, String batchId, String name,
                           String nationalId, String email, String phone, String gender, LocalDate dateOfBirth,
                           String address, String guardianName, String guardianNationalId, String guardianRelation,
                           String guardianContactNumber, String guardianEmail, String hostelRequired) {
        this.studentIndex = studentIndex;
        this.registrationNumber = registrationNumber;
        this.batchId = batchId;
        this.name = name;
        this.nationalId = nationalId;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianNationalId = guardianNationalId;
        this.guardianRelation = guardianRelation;
        this.guardianContactNumber = guardianContactNumber;
        this.guardianEmail = guardianEmail;
        this.hostelRequired = hostelRequired;
    }

    // Getters and setters
    public int getStudentIndex() { return studentIndex; }
    public void setStudentIndex(int studentIndex) { this.studentIndex = studentIndex; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getGuardianNationalId() { return guardianNationalId; }
    public void setGuardianNationalId(String guardianNationalId) { this.guardianNationalId = guardianNationalId; }

    public String getGuardianRelation() { return guardianRelation; }
    public void setGuardianRelation(String guardianRelation) { this.guardianRelation = guardianRelation; }

    public String getGuardianContactNumber() { return guardianContactNumber; }
    public void setGuardianContactNumber(String guardianContactNumber) { this.guardianContactNumber = guardianContactNumber; }

    public String getGuardianEmail() { return guardianEmail; }
    public void setGuardianEmail(String guardianEmail) { this.guardianEmail = guardianEmail; }

    public String getHostelRequired() { return hostelRequired; }
    public void setHostelRequired(String hostelRequired) { this.hostelRequired = hostelRequired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}