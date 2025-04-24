// student-service/src/main/java/com/adhyana/student/models/Scholarship.java
package com.adhyana.student.models;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Scholarship {
    private int id;
    private String name;
    private String description;
    private double minGpa;
    private BigDecimal amount;
    private LocalDate applicationDeadline;

    public Scholarship(int id, String name, String description, double minGpa,
                       BigDecimal amount, LocalDate applicationDeadline) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.minGpa = minGpa;
        this.amount = amount;
        this.applicationDeadline = applicationDeadline;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getMinGpa() { return minGpa; }
    public void setMinGpa(double minGpa) { this.minGpa = minGpa; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
}