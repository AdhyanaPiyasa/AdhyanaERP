package com.adhyana.administration.models;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Generic API response class that can wrap any data type.
 * Improved JSON serialization using standard Java APIs.
 */
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat DATETIME_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * Constructor
     * @param success Whether the operation was successful
     * @param message Message to include in the response
     * @param data Data to include in the response
     */
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Convert response to JSON string
     * @return JSON string representation of the response
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"success\":").append(success).append(",");
        json.append("\"message\":\"").append(escapeJson(message)).append("\"");

        if (data != null) {
            json.append(",\"data\":");
            if (data instanceof List) {
                json.append(listToJson((List<?>) data));
            } else {
                json.append(objectToJson(data));
            }
        }

        json.append("}");
        return json.toString();
    }

    /**
     * Convert a list to JSON array
     * @param list List to convert
     * @return JSON array representation of the list
     */
    private String listToJson(List<?> list) {
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

    /**
     * Convert an object to JSON
     * @param obj Object to convert
     * @return JSON representation of the object
     */
    private String objectToJson(Object obj) {
        if (obj == null) {
            return "null";
        }

        if (obj instanceof String) {
            return "\"" + escapeJson((String) obj) + "\"";
        }

        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }

        if (obj instanceof Date) {
            return "\"" + DATE_FORMAT.format((Date) obj) + "\"";
        }

        if (obj instanceof Staff) {
            return staffToJson((Staff) obj);
        }

        if (obj instanceof StaffRole) {
            return staffRoleToJson((StaffRole) obj);
        }

        if (obj instanceof StaffAttendance) {
            return staffAttendanceToJson((StaffAttendance) obj);
        }

        if (obj instanceof Payroll) {
            return payrollToJson((Payroll) obj);
        }

        if (obj instanceof Batch) {
            return batchToJson((Batch) obj);
        }

        if (obj instanceof BatchFacultyAssignment) {
            return batchFacultyAssignmentToJson((BatchFacultyAssignment) obj);
        }

        if (obj instanceof Student) {
            return studentToJson((Student) obj);
        }

        if (obj instanceof UserProfileRequest) {
            return ((UserProfileRequest) obj).toJson();
        }

        if (obj instanceof HostelAssignmentRequest) {
            return ((HostelAssignmentRequest) obj).toJson();
        }

        // Default for unknown objects
        return "{}";
    }

    /**
     * Convert Staff object to JSON
     */
    private String staffToJson(Staff staff) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"staffId\":").append(staff.getStaffId()).append(",");
        json.append("\"name\":\"").append(escapeJson(staff.getName())).append("\",");
        json.append("\"email\":\"").append(escapeJson(staff.getEmail())).append("\",");
        json.append("\"phone\":\"").append(escapeJson(staff.getPhone())).append("\",");
        json.append("\"department\":\"").append(escapeJson(staff.getDepartment())).append("\",");
        json.append("\"position\":\"").append(escapeJson(staff.getPosition())).append("\",");

        if (staff.getHireDate() != null) {
            json.append("\"hireDate\":\"").append(DATE_FORMAT.format(staff.getHireDate())).append("\",");
        } else {
            json.append("\"hireDate\":null,");
        }

        json.append("\"status\":\"").append(escapeJson(staff.getStatus())).append("\"");
        json.append("}");
        return json.toString();
    }

    /**
     * Convert StaffRole object to JSON
     */
    private String staffRoleToJson(StaffRole role) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"roleId\":").append(role.getRoleId()).append(",");
        json.append("\"staffId\":").append(role.getStaffId()).append(",");
        json.append("\"role\":\"").append(escapeJson(role.getRole())).append("\",");

        if (role.getAssignedDate() != null) {
            json.append("\"assignedDate\":\"").append(DATE_FORMAT.format(role.getAssignedDate())).append("\"");
        } else {
            json.append("\"assignedDate\":null");
        }

        json.append("}");
        return json.toString();
    }

    /**
     * Convert StaffAttendance object to JSON
     */
    private String staffAttendanceToJson(StaffAttendance attendance) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"attendanceId\":").append(attendance.getAttendanceId()).append(",");
        json.append("\"staffId\":").append(attendance.getStaffId()).append(",");

        if (attendance.getMonth() != null) {
            json.append("\"month\":\"").append(DATE_FORMAT.format(attendance.getMonth())).append("\",");
        } else {
            json.append("\"month\":null,");
        }

        json.append("\"workingDays\":").append(attendance.getWorkingDays()).append(",");
        json.append("\"presentDays\":").append(attendance.getPresentDays()).append(",");
        json.append("\"attendancePercentage\":").append(attendance.getAttendancePercentage()).append(",");
        json.append("\"status\":\"").append(escapeJson(attendance.getStatus())).append("\"");
        json.append("}");
        return json.toString();
    }

    /**
     * Convert Payroll object to JSON
     */
    private String payrollToJson(Payroll payroll) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"payrollId\":").append(payroll.getPayrollId()).append(",");
        json.append("\"staffId\":").append(payroll.getStaffId()).append(",");

        if (payroll.getSalaryMonth() != null) {
            json.append("\"salaryMonth\":\"").append(DATE_FORMAT.format(payroll.getSalaryMonth())).append("\",");
        } else {
            json.append("\"salaryMonth\":null,");
        }

        json.append("\"basicSalary\":").append(formatBigDecimal(payroll.getBasicSalary())).append(",");
        json.append("\"allowances\":").append(formatBigDecimal(payroll.getAllowances())).append(",");
        json.append("\"deductions\":").append(formatBigDecimal(payroll.getDeductions())).append(",");
        json.append("\"netSalary\":").append(formatBigDecimal(payroll.getNetSalary())).append(",");
        json.append("\"paymentStatus\":\"").append(escapeJson(payroll.getPaymentStatus())).append("\",");

        if (payroll.getPaymentDate() != null) {
            json.append("\"paymentDate\":\"").append(DATE_FORMAT.format(payroll.getPaymentDate())).append("\",");
        } else {
            json.append("\"paymentDate\":null,");
        }

        json.append("\"notes\":").append(payroll.getNotes() != null ? "\"" + escapeJson(payroll.getNotes()) + "\"" : "null");
        json.append("}");
        return json.toString();
    }

    /**
     * Convert Batch object to JSON
     */
    private String batchToJson(Batch batch) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"batchId\":\"").append(escapeJson(batch.getBatchId())).append("\",");
        json.append("\"batchName\":\"").append(escapeJson(batch.getBatchName())).append("\",");

        if (batch.getStartDate() != null) {
            json.append("\"startDate\":\"").append(DATE_FORMAT.format(batch.getStartDate())).append("\",");
        } else {
            json.append("\"startDate\":null,");
        }

        if (batch.getEndDate() != null) {
            json.append("\"endDate\":\"").append(DATE_FORMAT.format(batch.getEndDate())).append("\",");
        } else {
            json.append("\"endDate\":null,");
        }

        json.append("\"capacity\":").append(batch.getCapacity()).append(",");
        json.append("\"status\":\"").append(escapeJson(batch.getStatus())).append("\",");

        // Handling list of course IDs
        json.append("\"courseIds\":[");
        List<String> courseIds = batch.getCourseIds();
        if (courseIds != null) {
            for (int i = 0; i < courseIds.size(); i++) {
                json.append("\"").append(escapeJson(courseIds.get(i))).append("\"");
                if (i < courseIds.size() - 1) {
                    json.append(",");
                }
            }
        }
        json.append("]");

        json.append("}");
        return json.toString();
    }

    /**
     * Convert BatchFacultyAssignment object to JSON
     */
    private String batchFacultyAssignmentToJson(BatchFacultyAssignment assignment) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"assignmentId\":").append(assignment.getAssignmentId()).append(",");
        json.append("\"batchId\":\"").append(escapeJson(assignment.getBatchId())).append("\",");
        json.append("\"staffId\":").append(assignment.getStaffId()).append(",");
        json.append("\"courseId\":\"").append(escapeJson(assignment.getCourseId())).append("\",");

        if (assignment.getAssignmentDate() != null) {
            json.append("\"assignmentDate\":\"").append(DATE_FORMAT.format(assignment.getAssignmentDate())).append("\",");
        } else {
            json.append("\"assignmentDate\":null,");
        }

        if (assignment.getEndDate() != null) {
            json.append("\"endDate\":\"").append(DATE_FORMAT.format(assignment.getEndDate())).append("\",");
        } else {
            json.append("\"endDate\":null,");
        }

        json.append("\"status\":\"").append(escapeJson(assignment.getStatus())).append("\",");
        json.append("\"active\":").append(assignment.isActive());
        json.append("}");
        return json.toString();
    }

    /**
     * Convert Student object to JSON
     */
    private String studentToJson(Student student) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"indexNumber\":").append(student.getIndexNumber()).append(",");
        json.append("\"registrationNumber\":\"").append(escapeJson(student.getRegistrationNumber())).append("\",");
        json.append("\"name\":\"").append(escapeJson(student.getName())).append("\",");
        json.append("\"email\":\"").append(escapeJson(student.getEmail())).append("\",");

        if (student.getBatchId() != null) {
            json.append("\"batchId\":\"").append(escapeJson(student.getBatchId())).append("\",");
        } else {
            json.append("\"batchId\":null,");
        }

        json.append("\"gender\":\"").append(escapeJson(student.getGender())).append("\",");
        json.append("\"hostelRequired\":").append(student.isHostelRequired());
        json.append("}");
        return json.toString();
    }

    /**
     * Format BigDecimal for JSON
     */
    private String formatBigDecimal(BigDecimal value) {
        if (value == null) {
            return "0";
        }
        return value.toString();
    }

    /**
     * Escape JSON string
     */
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