package com.adhyana.administration.models;

import java.time.LocalDate;

public class StudentApplication {
    private int id;
    private String name;
    private String nationalId;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;

    private String appliedProgram;
    private LocalDate applicationDate;

    private String mathematics;
    private String science;
    private String english;
    private String computerStudies;

    private String guardianName;
    private String guardianNationalId;
    private String guardianRelation;
    private String guardianContactNumber;
    private String guardianEmail;

    private String hostelRequired;
    private String status;

    // Constructor
    public StudentApplication(int id, String name, String nationalId, String email, String phone,
                              String gender, LocalDate dateOfBirth, String address,
                              String appliedProgram, LocalDate applicationDate,
                              String mathematics, String science, String english, String computerStudies,
                              String guardianName, String guardianNationalId, String guardianRelation,
                              String guardianContactNumber, String guardianEmail,
                              String hostelRequired, String status) {
        this.id = id;
        this.name = name;
        this.nationalId = nationalId;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.appliedProgram = appliedProgram;
        this.applicationDate = applicationDate;
        this.mathematics = mathematics;
        this.science = science;
        this.english = english;
        this.computerStudies = computerStudies;
        this.guardianName = guardianName;
        this.guardianNationalId = guardianNationalId;
        this.guardianRelation = guardianRelation;
        this.guardianContactNumber = guardianContactNumber;
        this.guardianEmail = guardianEmail;
        this.hostelRequired = hostelRequired;
        this.status = status;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

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

    public String getAppliedProgram() { return appliedProgram; }
    public void setAppliedProgram(String appliedProgram) { this.appliedProgram = appliedProgram; }

    public LocalDate getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDate applicationDate) { this.applicationDate = applicationDate; }

    public String getMathematics() { return mathematics; }
    public void setMathematics(String mathematics) { this.mathematics = mathematics; }

    public String getScience() { return science; }
    public void setScience(String science) { this.science = science; }

    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }

    public String getComputerStudies() { return computerStudies; }
    public void setComputerStudies(String computerStudies) { this.computerStudies = computerStudies; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Inner class for application response
    public static class ApplicationResponse {
        private String applicantId;
        private String name;
        private String status;

        public ApplicationResponse(String applicantId, String name, String status) {
            this.applicantId = applicantId;
            this.name = name;
            this.status = status;
        }

        public String getApplicantId() { return applicantId; }
        public void setApplicantId(String applicantId) { this.applicantId = applicantId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}