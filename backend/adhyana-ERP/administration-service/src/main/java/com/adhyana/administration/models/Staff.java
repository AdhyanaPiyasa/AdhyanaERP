package com.adhyana.administration.models;

import java.util.Date;

/**
 * Represents a staff member in the Core Administration Service.
 * Based on the updated schema, staff_id field is used instead of id.
 */
public class Staff {
    private int staffId; // Changed from 'id' to 'staffId' based on schema changes
    private String name; // Changed from firstName/lastName to name based on schema
    private String email;
    private String phone;
    private String department;
    private String position;
    private Date hireDate;
    private String status; // ACTIVE or INACTIVE
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public Staff() {}

    // Constructor with all fields
    public Staff(int staffId, String name, String email, String phone,
                 String department, String position, Date hireDate, String status,
                 Date createdAt, Date updatedAt) {
        this.staffId = staffId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.position = position;
        this.hireDate = hireDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Date getHireDate() { return hireDate; }
    public void setHireDate(Date hireDate) { this.hireDate = hireDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}