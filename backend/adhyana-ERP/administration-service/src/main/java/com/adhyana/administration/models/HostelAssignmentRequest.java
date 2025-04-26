package com.adhyana.administration.models;

/**
 * Data structure for requesting hostel assignment from the Hostel Service.
 * Used for communication between Core Admin and Hostel Services.
 */
public class HostelAssignmentRequest {
    private int studentId; // Student index number
    private String gender; // M or F
    private boolean hostelPreference; // Whether student requested hostel

    // Default constructor
    public HostelAssignmentRequest() {}

    // Constructor with all fields
    public HostelAssignmentRequest(int studentId, String gender, boolean hostelPreference) {
        this.studentId = studentId;
        this.gender = gender;
        this.hostelPreference = hostelPreference;
    }

    // Getters and setters
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public boolean isHostelPreference() { return hostelPreference; }
    public void setHostelPreference(boolean hostelPreference) { this.hostelPreference = hostelPreference; }

    /**
     * Convert this request to JSON format for transmission
     * @return JSON string representation of the request
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"studentId\":").append(studentId).append(",");
        json.append("\"gender\":\"").append(escape(gender)).append("\",");
        json.append("\"hostelPreference\":").append(hostelPreference);
        json.append("}");
        return json.toString();
    }

    /**
     * Create request from Student object
     * @param student Student to create request for
     * @return HostelAssignmentRequest
     */
    public static HostelAssignmentRequest fromStudent(Student student) {
        return new HostelAssignmentRequest(
                student.getIndexNumber(),
                student.getGender(),
                student.isHostelRequired()
        );
    }

    /**
     * Escape special characters for JSON
     * @param str String to escape
     * @return Escaped string
     */
    private String escape(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}