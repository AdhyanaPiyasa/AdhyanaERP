package com.adhyana.exam.models;

import java.sql.Timestamp;

public class Reports {
    private int report_id;
    private String report_type;
    private String generated_for_type;
    private String generated_for_id;
    private Integer generated_by;
    private Timestamp generation_date;

    public Reports() {
        // Default constructor
    }

    public Reports(int report_id, String report_type, String generated_for_type, String generated_for_id, Integer generated_by, Timestamp generation_date) {
        this.report_id = report_id;
        this.report_type = report_type;
        this.generated_for_type = generated_for_type;
        this.generated_for_id = generated_for_id;
        this.generated_by = generated_by;
        this.generation_date = generation_date;
    }

    // Getters and setters
    public int getReport_id() {
        return report_id;
    }

    public void setReport_id(int report_id) {
        this.report_id = report_id;
    }

    public String getReport_type() {
        return report_type;
    }

    public void setReport_type(String report_type) {
        this.report_type = report_type;
    }

    public String getGenerated_for_type() {
        return generated_for_type;
    }

    public void setGenerated_for_type(String generated_for_type) {
        this.generated_for_type = generated_for_type;
    }

    public String getGenerated_for_id() {
        return generated_for_id;
    }

    public void setGenerated_for_id(String generated_for_id) {
        this.generated_for_id = generated_for_id;
    }

    public Integer getGenerated_by() {
        return generated_by;
    }

    public void setGenerated_by(Integer generated_by) {
        this.generated_by = generated_by;
    }

    public Timestamp getGeneration_date() {
        return generation_date;
    }

    public void setGeneration_date(Timestamp generation_date) {
        this.generation_date = generation_date;
    }
}
