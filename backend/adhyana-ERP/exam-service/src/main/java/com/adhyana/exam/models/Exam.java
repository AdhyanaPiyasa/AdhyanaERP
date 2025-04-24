package com.adhyana.exam.models;

public class Exam {
    private int id;
    private String title;
    private String course;
    private int courseCode;
    private String date;
    private String startTime;
    private String endTime;
    private String room;
    private String teacher;

    public Exam(int id, String title, String course, int courseCode, String date,
                String startTime, String endTime, String room, String teacher) {
        this.id = id;
        this.title = title;
        this.course = course;
        this.courseCode = courseCode;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.teacher = teacher;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public int getCourseCode() { return courseCode; }
    public void setCourseCode(int courseCode) { this.courseCode = courseCode; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public String getTeacher() { return teacher; }
    public void setTeacher(String teacher) { this.teacher = teacher; }
}
