package com.adhyana.course.models;

import java.time.LocalDateTime;

public class Announcement {
    private int id;
    private int courseId;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;


    //constructor
    public Announcement(int id, int courseId, String title, String content,String author, LocalDateTime createdAt) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
    }

    //getters and setters
    public int getId() {return id;}
    public void setId(int id) {this.id = id;}

    public int getcourseId() {return courseId;}
    public void setcourseId(int courseId) {this.courseId = courseId;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public String getContent() {return content;}
    public void setContent(String content) {this.content = content;}

    public String getAuthor() {return author;}
    public void setAuthor(String author) {this.author = author;}

    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
}