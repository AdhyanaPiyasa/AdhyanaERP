package com.adhyana.administration.models;

import java.util.Date;

/**
 * Represents a role assigned to a staff member.
 */
public class StaffRole {
    private int roleId; // Changed from 'id' to 'roleId' for consistency
    private int staffId;
    private String role;
    private Date assignedDate;
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public StaffRole() {}

    // Constructor with all fields
    public StaffRole(int roleId, int staffId, String role, Date assignedDate,
                     Date createdAt, Date updatedAt) {
        this.roleId = roleId;
        this.staffId = staffId;
        this.role = role;
        this.assignedDate = assignedDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Date getAssignedDate() { return assignedDate; }
    public void setAssignedDate(Date assignedDate) { this.assignedDate = assignedDate; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}