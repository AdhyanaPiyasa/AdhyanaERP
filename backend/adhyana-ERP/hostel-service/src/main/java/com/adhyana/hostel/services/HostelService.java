package com.adhyana.hostel.services;

import com.adhyana.hostel.models.Hostel;
import com.adhyana.hostel.utils.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HostelService {

    // Get all hostels
    public List<Hostel> getAllHostels() throws Exception {
        List<Hostel> hostels = new ArrayList<>();
        String query = "SELECT * FROM hostels";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                hostels.add(mapResultSetToHostel(rs));
            }
        }
        return hostels;
    }

    // Get hostel by ID
    public Hostel getHostelById(int hostelId) throws Exception {
        String query = "SELECT * FROM hostels WHERE hostel_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, hostelId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToHostel(rs);
                }
            }
        }
        return null;
    }

    // Create a new hostel
    public Hostel createHostel(Hostel hostel) throws Exception {
        String query = "INSERT INTO hostels (name, capacity, gender, assistant_name, wifi, kitchen, laundry, study_area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            setHostelParameters(stmt, hostel);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating hostel failed, no rows affected.");
            }
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    hostel.setHostelId(generatedKeys.getInt(1));
                    updateOccupancyAndVacancy(hostel.getHostelId()); // Update calculated fields
                    return getHostelById(hostel.getHostelId()); // Return the full object
                } else {
                    throw new SQLException("Creating hostel failed, no ID obtained.");
                }
            }
        }
    }


    // Update hostel information
    public boolean updateHostel(int hostelId, Hostel hostel) throws Exception {
        String query = "UPDATE hostels SET name=?, capacity=?, gender=?, assistant_name=?, wifi=?, kitchen=?, laundry=?, study_area=?, updated_at=CURRENT_TIMESTAMP WHERE hostel_id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            setHostelParameters(stmt, hostel); // Sets params 1-8
            stmt.setInt(9, hostelId);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                updateOccupancyAndVacancy(hostelId); // Recalculate occupancy
                return true;
            }
            return false;
        }
    }

    // Update occupancy based on current assignments (call after assignment changes)
    public void updateOccupancyAndVacancy(int hostelId) throws Exception {
        String countQuery = "SELECT COUNT(*) FROM hostel_assignments WHERE hostel_id = ? AND status = 'Active'";
        String updateQuery = "UPDATE hostels SET occupancy = ? WHERE hostel_id = ?";
        int currentOccupancy = 0;

        try (Connection conn = DatabaseConnection.getConnection()) {
            // Get current occupancy count
            try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
                countStmt.setInt(1, hostelId);
                try (ResultSet rs = countStmt.executeQuery()) {
                    if (rs.next()) {
                        currentOccupancy = rs.getInt(1);
                    }
                }
            }

            // Update the occupancy in the hostels table
            try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                updateStmt.setInt(1, currentOccupancy);
                updateStmt.setInt(2, hostelId);
                updateStmt.executeUpdate();
            }
        }
    }


    // Delete hostel
    public boolean deleteHostel(int hostelId) throws Exception {
        // Add check: Cannot delete if students are assigned
        updateOccupancyAndVacancy(hostelId); // Ensure occupancy is up-to-date
        Hostel hostel = getHostelById(hostelId);
        if (hostel != null && hostel.getOccupancy() > 0) {
            throw new SQLException("Cannot delete hostel with active residents.");
        }

        String query = "DELETE FROM hostels WHERE hostel_id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, hostelId);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    // Find a suitable hostel based on gender and availability
    public Hostel findAvailableHostel(String gender) throws Exception {
        // Prioritize hostels matching gender, then 'Mixed', with vacancy > 0
        String query = "SELECT * FROM hostels " +
                "WHERE (gender = ? OR gender = 'Mixed') AND capacity > occupancy " +
                "ORDER BY CASE gender WHEN ? THEN 1 WHEN 'Mixed' THEN 2 ELSE 3 END, (capacity - occupancy) DESC " + // Prioritize direct match, then mixed, then by most vacancy
                "LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, gender);
            stmt.setString(2, gender); // For ORDER BY
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToHostel(rs);
                }
            }
        }
        return null; // No suitable hostel found
    }


    private Hostel mapResultSetToHostel(ResultSet rs) throws SQLException {
        return new Hostel(
                rs.getInt("hostel_id"),
                rs.getString("name"),
                rs.getInt("capacity"),
                rs.getInt("occupancy"),
                rs.getString("gender"),
                rs.getString("assistant_name"),
                rs.getBoolean("wifi"),
                rs.getBoolean("kitchen"),
                rs.getBoolean("laundry"),
                rs.getBoolean("study_area"),
                rs.getTimestamp("created_at"),
                rs.getTimestamp("updated_at")
        );
    }

    private void setHostelParameters(PreparedStatement stmt, Hostel hostel) throws SQLException {
        stmt.setString(1, hostel.getName());
        stmt.setInt(2, hostel.getCapacity());
        stmt.setString(3, hostel.getGender());
        stmt.setString(4, hostel.getAssistantName());
        stmt.setBoolean(5, hostel.isWifi());
        stmt.setBoolean(6, hostel.isKitchen());
        stmt.setBoolean(7, hostel.isLaundry());
        stmt.setBoolean(8, hostel.isStudyArea());
    }
}