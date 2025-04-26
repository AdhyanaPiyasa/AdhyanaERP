package com.adhyana.exam.models;

import java.sql.Date;
import java.sql.Time;

public class Assignment {
    private int assignment_id;
    private String title;
    private String course_id;
    private String semester_id;
    private String type;
    private Date due_date;
    private Time due_time;
    private Integer max_marks; // Use Integer for nullable
    private String description;
    private Integer posted_by;    // Use Integer for nullable

    public Assignment() {
        // Default constructor
    }

    public Assignment(int assignment_id, String title, String course_id, String semester_id, String type, Date due_date, Time due_time, Integer max_marks, String description, Integer posted_by) {
        this.assignment_id = assignment_id;
        this.title = title;
        this.course_id = course_id;
        this.semester_id = semester_id;
        this.type = type;
        this.due_date = due_date;
        this.due_time = due_time;
        this.max_marks = max_marks;
        this.description = description;
        this.posted_by = posted_by;
    }

    // Getters and setters
    public int getAssignment_id() {
        return assignment_id;
    }

    public void setAssignment_id(int assignment_id) {
        this.assignment_id = assignment_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCourse_id() {
        return course_id;
    }

    public void setCourse_id(String course_id) {
        this.course_id = course_id;
    }

    public String getSemester_id() {
        return semester_id;
    }

    public void setSemester_id(String semester_id) {
        this.semester_id = semester_id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDue_date() {
        return due_date;
    }

    public void setDue_date(Date due_date) {
        this.due_date = due_date;
    }

    public Time getDue_time() {
        return due_time;
    }

    public void setDue_time(Time due_time) {
        this.due_time = due_time;
    }

    public Integer getMax_marks() {
        return max_marks;
    }

    public void setMax_marks(Integer max_marks) {
        this.max_marks = max_marks;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPosted_by() {
        return posted_by;
    }

    public void setPosted_by(Integer posted_by) {
        this.posted_by = posted_by;
    }
}
