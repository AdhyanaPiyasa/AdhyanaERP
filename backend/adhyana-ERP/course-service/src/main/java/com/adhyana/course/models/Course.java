// course-service/src/main/java/com/adhyana/course/models/Course.java
package com.adhyana.course.models;

public class Course {
    private String courseId;       // Changed from int id to String courseId
    private String name;
    private int year;
    // semester field removed as it's not in the schema
    private int credits;
    private int duration;
    private Double avgRating;

    // Constructor with fields in database table order
    public Course(String courseId, String name, int year,
                  int credits, int duration, Double avgRating) {
        this.courseId = courseId;
        this.name = name;
        this.year = year;
        this.credits = credits;
        this.duration = duration;
        this.avgRating = avgRating;
    }

    // Getters and setters
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }

    @Override
    public String toString() {
        return "Course{" +
                "courseId='" + courseId + '\'' +
                ", name='" + name + '\'' +
                ", year=" + year +
                ", credits=" + credits +
                ", duration=" + duration +
                ", avgRating=" + avgRating +
                '}';
    }
}