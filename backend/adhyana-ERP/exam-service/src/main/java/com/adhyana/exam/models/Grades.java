package com.adhyana.exam.models;

public class Grades {
    private int grade_id;
    private int student_index;
    private String course_id;
    private String semester_id;
    private int component_id;
    private String component_type;
    private Double marks_obtained; // Use Double for nullable DECIMAL
    private String grade;
    private String feedback;
    private Integer graded_by; // Use Integer for nullable

    public Grades() {
        // Default constructor
    }

    public Grades(int grade_id, int student_index, String course_id, String semester_id, int component_id, String component_type, Double marks_obtained, String grade, String feedback, Integer graded_by) {
        this.grade_id = grade_id;
        this.student_index = student_index;
        this.course_id = course_id;
        this.semester_id = semester_id;
        this.component_id = component_id;
        this.component_type = component_type;
        this.marks_obtained = marks_obtained;
        this.grade = grade;
        this.feedback = feedback;
        this.graded_by = graded_by;
    }

    // Getters and setters
    public int getGrade_id() {
        return grade_id;
    }

    public void setGrade_id(int grade_id) {
        this.grade_id = grade_id;
    }

    public int getStudent_index() {
        return student_index;
    }

    public void setStudent_index(int student_index) {
        this.student_index = student_index;
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

    public int getComponent_id() {
        return component_id;
    }

    public void setComponent_id(int component_id) {
        this.component_id = component_id;
    }

    public String getComponent_type() {
        return component_type;
    }

    public void setComponent_type(String component_type) {
        this.component_type = component_type;
    }

    public Double getMarks_obtained() {
        return marks_obtained;
    }

    public void setMarks_obtained(Double marks_obtained) {
        this.marks_obtained = marks_obtained;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getGraded_by() {
        return graded_by;
    }

    public void setGraded_by(Integer graded_by) {
        this.graded_by = graded_by;
    }
}
