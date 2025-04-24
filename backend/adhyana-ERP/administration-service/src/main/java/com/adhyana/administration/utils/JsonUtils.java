package com.adhyana.administration.utils;

import com.adhyana.administration.models.*;
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;

public class JsonUtils {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public static String readRequestBody(HttpServletRequest request) throws Exception {
        StringBuilder sb = new StringBuilder();
        String line;

        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        return sb.toString();
    }

    // Parse Staff from JSON string
    public static Staff parseStaff(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        Staff staff = new Staff();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        staff.setId(Integer.parseInt(value));
                        break;
                    case "firstName":
                        staff.setFirstName(value);
                        break;
                    case "lastName":
                        staff.setLastName(value);
                        break;
                    case "email":
                        staff.setEmail(value);
                        break;
                    case "phone":
                        staff.setPhone(value);
                        break;
                    case "department":
                        staff.setDepartment(value);
                        break;
                    case "position":
                        staff.setPosition(value);
                        break;
                    case "hireDate":
                        if (!value.isEmpty()) {
                            staff.setHireDate(dateFormat.parse(value));
                        }
                        break;
                    case "status":
                        staff.setStatus(value);
                        break;
                }
            }
        }

        return staff;
    }

    // Parse StaffRole from JSON string
    public static StaffRole parseStaffRole(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        StaffRole role = new StaffRole();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        role.setId(Integer.parseInt(value));
                        break;
                    case "staffId":
                        role.setStaffId(Integer.parseInt(value));
                        break;
                    case "role":
                        role.setRole(value);
                        break;
                    case "assignedDate":
                        if (!value.isEmpty()) {
                            role.setAssignedDate(dateFormat.parse(value));
                        } else {
                            role.setAssignedDate(new Date());
                        }
                        break;
                }
            }
        }

        return role;
    }

    // Parse Payroll from JSON string
    public static Payroll parsePayroll(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        Payroll payroll = new Payroll();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        payroll.setId(Integer.parseInt(value));
                        break;
                    case "staffId":
                        payroll.setStaffId(Integer.parseInt(value));
                        break;
                    case "salaryMonth":
                        if (!value.isEmpty()) {
                            payroll.setSalaryMonth(dateFormat.parse(value));
                        }
                        break;
                    case "basicSalary":
                        if (!value.isEmpty()) {
                            payroll.setBasicSalary(new BigDecimal(value));
                        }
                        break;
                    case "allowances":
                        if (!value.isEmpty()) {
                            payroll.setAllowances(new BigDecimal(value));
                        }
                        break;
                    case "deductions":
                        if (!value.isEmpty()) {
                            payroll.setDeductions(new BigDecimal(value));
                        }
                        break;
                    case "netSalary":
                        if (!value.isEmpty()) {
                            payroll.setNetSalary(new BigDecimal(value));
                        }
                        break;
                    case "paymentStatus":
                        payroll.setPaymentStatus(value);
                        break;
                    case "paymentDate":
                        if (!value.isEmpty()) {
                            payroll.setPaymentDate(dateFormat.parse(value));
                        }
                        break;
                }
            }
        }

        return payroll;
    }

    // Parse Batch from JSON string
    public static Batch parseBatch(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        Batch batch = new Batch();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        batch.setId(Integer.parseInt(value));
                        break;
                    case "batchName":
                        batch.setBatchName(value);
                        break;
                    case "startDate":
                        if (!value.isEmpty()) {
                            batch.setStartDate(dateFormat.parse(value));
                        }
                        break;
                    case "endDate":
                        if (!value.isEmpty()) {
                            batch.setEndDate(dateFormat.parse(value));
                        }
                        break;
                    case "courseId":
                        batch.setCourseId(Integer.parseInt(value));
                        break;
                    case "capacity":
                        batch.setCapacity(Integer.parseInt(value));
                        break;
                    case "status":
                        batch.setStatus(value);
                        break;
                }
            }
        }

        return batch;
    }

    // Parse BatchFacultyAssignment from JSON string
    public static BatchFacultyAssignment parseBatchFacultyAssignment(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        BatchFacultyAssignment assignment = new BatchFacultyAssignment();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        assignment.setId(Integer.parseInt(value));
                        break;
                    case "batchId":
                        assignment.setBatchId(Integer.parseInt(value));
                        break;
                    case "staffId":
                        assignment.setStaffId(Integer.parseInt(value));
                        break;
                    case "subject":
                        assignment.setSubject(value);
                        break;
                    case "assignmentDate":
                        if (!value.isEmpty()) {
                            assignment.setAssignmentDate(dateFormat.parse(value));
                        } else {
                            assignment.setAssignmentDate(new Date());
                        }
                        break;
                    case "endDate":
                        if (!value.isEmpty()) {
                            assignment.setEndDate(dateFormat.parse(value));
                        }
                        break;
                    case "status":
                        assignment.setStatus(value);
                        break;
                }
            }
        }

        return assignment;
    }

    // Parse Announcement from JSON string
    public static Announcement parseAnnouncement(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        Announcement announcement = new Announcement();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        announcement.setId(Integer.parseInt(value));
                        break;
                    case "title":
                        announcement.setTitle(value);
                        break;
                    case "content":
                        announcement.setContent(value);
                        break;
                    case "category":
                        announcement.setCategory(value);
                        break;
                    case "postedBy":
                        announcement.setPostedBy(Integer.parseInt(value));
                        break;
                    case "validFrom":
                        if (!value.isEmpty()) {
                            announcement.setValidFrom(dateFormat.parse(value));
                        } else {
                            announcement.setValidFrom(new Date());
                        }
                        break;
                    case "validUntil":
                        if (!value.isEmpty()) {
                            announcement.setValidUntil(dateFormat.parse(value));
                        }
                        break;
                    case "status":
                        announcement.setStatus(value);
                        break;
                }
            }
        }

        return announcement;
    }

    // Parse AcademicCalendar from JSON string
    public static AcademicCalendar parseCalendarEvent(String jsonStr) throws Exception {
        jsonStr = jsonStr.replaceAll("[{}\"]", "");
        String[] pairs = jsonStr.split(",");

        AcademicCalendar event = new AcademicCalendar();

        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();

                switch (key) {
                    case "id":
                        event.setId(Integer.parseInt(value));
                        break;
                    case "eventTitle":
                        event.setEventTitle(value);
                        break;
                    case "description":
                        event.setDescription(value);
                        break;
                    case "eventDate":
                        if (!value.isEmpty()) {
                            event.setEventDate(dateFormat.parse(value));
                        } else {
                            throw new Exception("Event date is required");
                        }
                        break;
                    case "eventType":
                        event.setEventType(value);
                        break;
                    case "createdBy":
                        event.setCreatedBy(Integer.parseInt(value));
                        break;
                }
            }
        }

        return event;
    }
}