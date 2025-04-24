package com.adhyana.administration.services;

import com.adhyana.administration.models.AcademicCalendar;
import com.adhyana.administration.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class AcademicCalendarService {

    public List<AcademicCalendar> getAllEvents() throws Exception {
        List<AcademicCalendar> events = new ArrayList<>();
        String query = "SELECT * FROM academic_calendar ORDER BY event_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                events.add(mapResultSetToEvent(rs));
            }
        }
        return events;
    }

    public AcademicCalendar getEventById(int id) throws Exception {
        String query = "SELECT * FROM academic_calendar WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToEvent(rs);
            }
        }
        return null;
    }

    public List<AcademicCalendar> getUpcomingEvents(int daysAhead) throws Exception {
        List<AcademicCalendar> events = new ArrayList<>();
        String query = "SELECT * FROM academic_calendar " +
                "WHERE event_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL ? DAY) " +
                "ORDER BY event_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, daysAhead);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                events.add(mapResultSetToEvent(rs));
            }
        }
        return events;
    }

    public void addEvent(AcademicCalendar event) throws Exception {
        String query = "INSERT INTO academic_calendar (event_title, description, event_date, event_type, created_by) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, event.getEventTitle());
            stmt.setString(2, event.getDescription());
            stmt.setDate(3, new java.sql.Date(event.getEventDate().getTime()));
            stmt.setString(4, event.getEventType());
            stmt.setInt(5, event.getCreatedBy());

            stmt.executeUpdate();
        }
    }

    public void updateEvent(int id, AcademicCalendar event) throws Exception {
        String query = "UPDATE academic_calendar SET event_title = ?, description = ?, " +
                "event_date = ?, event_type = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, event.getEventTitle());
            stmt.setString(2, event.getDescription());
            stmt.setDate(3, new java.sql.Date(event.getEventDate().getTime()));
            stmt.setString(4, event.getEventType());
            stmt.setInt(5, id);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Calendar event not found with id: " + id);
            }
        }
    }

    public void deleteEvent(int id) throws Exception {
        String query = "DELETE FROM academic_calendar WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, id);
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Calendar event not found with id: " + id);
            }
        }
    }

    public List<AcademicCalendar> getEventsByMonth(int year, int month) throws Exception {
        List<AcademicCalendar> events = new ArrayList<>();
        String query = "SELECT * FROM academic_calendar " +
                "WHERE YEAR(event_date) = ? AND MONTH(event_date) = ? " +
                "ORDER BY event_date";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, year);
            stmt.setInt(2, month);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                events.add(mapResultSetToEvent(rs));
            }
        }
        return events;
    }

    private AcademicCalendar mapResultSetToEvent(ResultSet rs) throws SQLException {
        AcademicCalendar event = new AcademicCalendar();
        event.setId(rs.getInt("id"));
        event.setEventTitle(rs.getString("event_title"));
        event.setDescription(rs.getString("description"));
        event.setEventDate(rs.getDate("event_date"));
        event.setEventType(rs.getString("event_type"));
        event.setCreatedBy(rs.getInt("created_by"));
        event.setCreatedAt(rs.getTimestamp("created_at"));
        event.setUpdatedAt(rs.getTimestamp("updated_at"));
        return event;
    }
}