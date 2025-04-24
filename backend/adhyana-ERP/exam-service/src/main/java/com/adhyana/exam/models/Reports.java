package com.adhyana.exam.models;

public class Reports {
    private int reportId;
    private String coursename;
    private String examname;
    private String name;
    private String date;

    public Reports(int reportId,String coursename, String examname, String name,String date){
        this.reportId=reportId;
        this.coursename=coursename;
        this.examname=examname;
        this.name=name;
        this.date=date;

    }
    public int getReportId() {return reportId;}
    public void setReportId(int reportId) {this.reportId = reportId;}
    public String getCoursename() {return coursename;}
    public void setCoursename(String coursename) {this.coursename = coursename;}
    public String getExamname() {return examname;}
    public void setExamname(String examname) {this.examname = examname;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDate() {return date;}
    public void setDate(String date) {this.date = date;}

}

