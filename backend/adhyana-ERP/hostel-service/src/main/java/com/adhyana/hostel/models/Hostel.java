package com.adhyana.hostel.models;

import java.sql.Timestamp;

public class Hostel {
    private int hostelId;
    private String name;
    private int capacity;
    private int occupancy;
    private String gender; // Male, Female, Mixed
    private String assistantName;
    private boolean wifi;
    private boolean kitchen;
    private boolean laundry;
    private boolean studyArea;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors, Getters, Setters...

    public Hostel() {}

    // Constructor (Example)
    public Hostel(int hostelId, String name, int capacity, int occupancy, String gender, String assistantName, boolean wifi, boolean kitchen, boolean laundry, boolean studyArea, Timestamp createdAt, Timestamp updatedAt) {
        this.hostelId = hostelId;
        this.name = name;
        this.capacity = capacity;
        this.occupancy = occupancy;
        this.gender = gender;
        this.assistantName = assistantName;
        this.wifi = wifi;
        this.kitchen = kitchen;
        this.laundry = laundry;
        this.studyArea = studyArea;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getters and Setters ---
    public int getHostelId() { return hostelId; }
    public void setHostelId(int hostelId) { this.hostelId = hostelId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getOccupancy() { return occupancy; }
    public void setOccupancy(int occupancy) { this.occupancy = occupancy; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAssistantName() { return assistantName; }
    public void setAssistantName(String assistantName) { this.assistantName = assistantName; }
    public boolean isWifi() { return wifi; }
    public void setWifi(boolean wifi) { this.wifi = wifi; }
    public boolean isKitchen() { return kitchen; }
    public void setKitchen(boolean kitchen) { this.kitchen = kitchen; }
    public boolean isLaundry() { return laundry; }
    public void setLaundry(boolean laundry) { this.laundry = laundry; }
    public boolean isStudyArea() { return studyArea; }
    public void setStudyArea(boolean studyArea) { this.studyArea = studyArea; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    // Calculated property
    public int getVacancy() {
        return this.capacity - this.occupancy;
    }
}