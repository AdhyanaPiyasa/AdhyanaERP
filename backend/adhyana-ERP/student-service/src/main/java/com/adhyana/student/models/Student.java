package com.adhyana.student.models;

import java.time.LocalDate;

public class Student {
    private int id;
    private String name;
    private String email;
    private String degreeID;
    private String degreeProgram;
    private String indexNumber;
    private String registrationNumber;
    private String mobileNumber;
    private LocalDate birthDate;
    private String state;

    public Student(int id, String name, String email, String degreeID,String degreeProgram,
                   String indexNumber, String registrationNumber, String mobileNumber,
                   LocalDate birthDate, String state) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.degreeID = degreeID;
        this.degreeProgram = degreeProgram;
        this.indexNumber = indexNumber;
        this.registrationNumber = registrationNumber;
        this.mobileNumber = mobileNumber;
        this.birthDate = birthDate;
        this.state = state;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDegreeID() { return degreeID; }
    public void setDegreeID(String degreeID) { this.degreeID = degreeID; }

    public String getDegreeProgram() { return degreeProgram; }
    public void setDegreeProgram(String degreeProgram) { this.degreeProgram = degreeProgram; }

    public String getIndexNumber() { return indexNumber; }
    public void setIndexNumber(String indexNumber) { this.indexNumber = indexNumber; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}