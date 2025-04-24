// course-service/src/main/java/com/adhyana/course/models/Course.java
package com.adhyana.course.models;

public class Course {
    private int id;
    private int code;
    private String name;
    private int year;
    private int semester;
    private int credits;
    private int duration;
    private Double avgRating;  // New field for average rating

    // Constructor with fields in database table order
    public Course(int id, int code, String name, int year,
                  int semester, int credits, int duration, Double avgRating) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.year = year;
        this.semester = semester;
        this.credits = credits;
        this.duration = duration;
        this.avgRating = avgRating;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", code=" + code +
                ", name='" + name + '\'' +
                ", year=" + year +
                ", semester=" + semester +
                ", credits=" + credits +
                ", duration=" + duration +
                ", avgRating=" + avgRating +
                '}';
    }
}