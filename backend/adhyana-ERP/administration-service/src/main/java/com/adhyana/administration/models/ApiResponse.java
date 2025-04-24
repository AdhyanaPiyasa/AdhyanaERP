package com.adhyana.administration.models;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"success\":").append(success).append(",");
        json.append("\"message\":\"").append(escapeJson(message)).append("\"");

        if (data != null) {
            json.append(",\"data\":");
            if (data instanceof java.util.List) {
                json.append(listToJson((java.util.List<?>) data));
            } else {
                json.append(objectToJson(data));
            }
        }

        json.append("}");
        return json.toString();
    }

    private String listToJson(java.util.List<?> list) {
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < list.size(); i++) {
            json.append(objectToJson(list.get(i)));
            if (i < list.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }

    private String objectToJson(Object obj) {
        if (obj instanceof Staff) {
            return staffToJson((Staff) obj);
        } else if (obj instanceof StaffRole) {
            return staffRoleToJson((StaffRole) obj);
        } else if (obj instanceof Payroll) {
            return payrollToJson((Payroll) obj);
        } else if (obj instanceof Batch) {
            return batchToJson((Batch) obj);
        } else if (obj instanceof BatchFacultyAssignment) {
            return assignmentToJson((BatchFacultyAssignment) obj);
        } else if (obj instanceof Announcement) {
            return announcementToJson((Announcement) obj);
        } else if (obj instanceof AcademicCalendar) {
            return calendarEventToJson((AcademicCalendar) obj);
        }
        return "{}";
    }

    private String staffToJson(Staff staff) {
        return String.format(
                "{\"id\":%d,\"firstName\":\"%s\",\"lastName\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"," +
                        "\"department\":\"%s\",\"position\":\"%s\",\"hireDate\":\"%s\",\"status\":\"%s\"}",
                staff.getId(), escapeJson(staff.getFirstName()), escapeJson(staff.getLastName()),
                escapeJson(staff.getEmail()), escapeJson(staff.getPhone()),
                escapeJson(staff.getDepartment()), escapeJson(staff.getPosition()),
                staff.getHireDate() != null ? dateFormat.format(staff.getHireDate()) : "",
                escapeJson(staff.getStatus())
        );
    }

    private String staffRoleToJson(StaffRole role) {
        return String.format(
                "{\"id\":%d,\"staffId\":%d,\"role\":\"%s\",\"assignedDate\":\"%s\"}",
                role.getId(), role.getStaffId(), escapeJson(role.getRole()),
                role.getAssignedDate() != null ? dateFormat.format(role.getAssignedDate()) : ""
        );
    }

    private String payrollToJson(Payroll payroll) {
        return String.format(
                "{\"id\":%d,\"staffId\":%d,\"salaryMonth\":\"%s\",\"basicSalary\":%s," +
                        "\"allowances\":%s,\"deductions\":%s,\"netSalary\":%s,\"paymentStatus\":\"%s\",\"paymentDate\":\"%s\"}",
                payroll.getId(), payroll.getStaffId(),
                payroll.getSalaryMonth() != null ? dateFormat.format(payroll.getSalaryMonth()) : "",
                formatBigDecimal(payroll.getBasicSalary()),
                formatBigDecimal(payroll.getAllowances()),
                formatBigDecimal(payroll.getDeductions()),
                formatBigDecimal(payroll.getNetSalary()),
                escapeJson(payroll.getPaymentStatus()),
                payroll.getPaymentDate() != null ? dateFormat.format(payroll.getPaymentDate()) : ""
        );
    }

    private String batchToJson(Batch batch) {
        return String.format(
                "{\"id\":%d,\"batchName\":\"%s\",\"startDate\":\"%s\",\"endDate\":\"%s\"," +
                        "\"courseId\":%d,\"capacity\":%d,\"status\":\"%s\"}",
                batch.getId(), escapeJson(batch.getBatchName()),
                batch.getStartDate() != null ? dateFormat.format(batch.getStartDate()) : "",
                batch.getEndDate() != null ? dateFormat.format(batch.getEndDate()) : "",
                batch.getCourseId(), batch.getCapacity(), escapeJson(batch.getStatus())
        );
    }

    private String assignmentToJson(BatchFacultyAssignment assignment) {
        return String.format(
                "{\"id\":%d,\"batchId\":%d,\"staffId\":%d,\"subject\":\"%s\"," +
                        "\"assignmentDate\":\"%s\",\"endDate\":\"%s\",\"status\":\"%s\"}",
                assignment.getId(), assignment.getBatchId(), assignment.getStaffId(),
                escapeJson(assignment.getSubject()),
                assignment.getAssignmentDate() != null ? dateFormat.format(assignment.getAssignmentDate()) : "",
                assignment.getEndDate() != null ? dateFormat.format(assignment.getEndDate()) : "",
                escapeJson(assignment.getStatus())
        );
    }

    private String announcementToJson(Announcement announcement) {
        return String.format(
                "{\"id\":%d,\"title\":\"%s\",\"content\":\"%s\",\"category\":\"%s\"," +
                        "\"postedBy\":%d,\"validFrom\":\"%s\",\"validUntil\":\"%s\",\"status\":\"%s\"}",
                announcement.getId(), escapeJson(announcement.getTitle()),
                escapeJson(announcement.getContent()), escapeJson(announcement.getCategory()),
                announcement.getPostedBy(),
                announcement.getValidFrom() != null ? dateFormat.format(announcement.getValidFrom()) : "",
                announcement.getValidUntil() != null ? dateFormat.format(announcement.getValidUntil()) : "",
                escapeJson(announcement.getStatus())
        );
    }

    private String calendarEventToJson(AcademicCalendar event) {
        return String.format(
                "{\"id\":%d,\"eventTitle\":\"%s\",\"description\":\"%s\",\"eventDate\":\"%s\"," +
                        "\"eventType\":\"%s\",\"createdBy\":%d}",
                event.getId(), escapeJson(event.getEventTitle()), escapeJson(event.getDescription()),
                event.getEventDate() != null ? dateFormat.format(event.getEventDate()) : "",
                escapeJson(event.getEventType()), event.getCreatedBy()
        );
    }

    private String formatBigDecimal(BigDecimal value) {
        if (value == null) {
            return "0";
        }
        return value.toString();
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}