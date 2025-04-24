package com.adhyana.course.models;

import java.time.LocalDate;

public class Teacher {
    private int id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private LocalDate joined_at;


    public Teacher(int id, String name, String email, String phone, String department, String designation, LocalDate joined_at) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joined_at = joined_at;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department =department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation= designation; }

    public LocalDate getJoined_at() { return joined_at; }
    public void setJoined_at(LocalDate joined_at) { this.joined_at = joined_at; }
}