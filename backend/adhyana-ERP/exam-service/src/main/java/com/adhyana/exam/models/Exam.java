package com.adhyana.exam.models;

import java.sql.Time; // Import for java.sql.Time
import java.util.Date;  // Import for java.sql.Date

public class Exam {
    private int exam_id;
    private String title;
    private String semester_id;
    private Date exam_date; // Use java.sql.Date for compatibility with SQL DATE
    private Time start_time; // Use java.sql.Time for compatibility with SQL TIME
    private Time end_time;   // Use java.sql.Time for compatibility with SQL TIME
    private String location;
    private String type; //  Use String, as the ENUM is handled by the database

    // Constructors

    public Exam() {
        // Default constructor
    }

    public Exam(int exam_id, String title, String semester_id, Date exam_date, Time start_time, Time end_time, String location, String type) {
        this.exam_id = exam_id;
        this.title = title;
        this.semester_id = semester_id;
        this.exam_date = exam_date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.location = location;
        this.type = type;
    }



    // Getters and Setters
    public int getExam_id() {
        return exam_id;
    }

    public void setExam_id(int exam_id) {
        this.exam_id = exam_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSemester_id() {
        return semester_id;
    }

    public void setSemester_id(String semester_id) {
        this.semester_id = semester_id;
    }

    public Date getExam_date() {
        return exam_date;
    }

    public void setExam_date(Date exam_date) {
        this.exam_date = exam_date;
    }

    public Time getStart_time() {
        return start_time;
    }

    public void setStart_time(Time start_time) {
        this.start_time = start_time;
    }

    public Time getEnd_time() {
        return end_time;
    }

    public void setEnd_time(Time end_time) {
        this.end_time = end_time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
