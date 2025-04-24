package com.adhyana.exam.models;

public class Grades {
    private int Gid;
    private String Index_No;
    private String Name;
    private int courseCode;
    private String courseName;
    private String grade;

    public Grades(int Gid, String Index_No, String Name, int courseCode, String courseName, String grade) {
        this.Gid = Gid;
        this.Index_No = Index_No;
        this.Name = Name;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.grade = grade;

    }
    //Getters & Setters
    public int getGid() {return Gid;}
    public void setGid(int Gid) {this.Gid = Gid;}
    public String getIndex_No() {return Index_No;}
    public void setIndex_No(String Index_No) {this.Index_No = Index_No;}
    public String getName() {return Name;}
    public void setName(String Name) {this.Name = Name;}
    public int getCourseCode() {return courseCode;}
    public void setCourseCode(int courseCode) {this.courseCode = courseCode;}
    public String getCourseName() {return courseName;}
    public void setCourseName(String courseName) {this.courseName = courseName;}
    public String getGrade() {return grade;}
    public void setGrade(String grade) {this.grade = grade;}
}
