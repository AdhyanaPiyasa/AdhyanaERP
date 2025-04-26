package com.adhyana.administration.utils;

import com.adhyana.administration.models.*;
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;

/**
 * Utilities for JSON handling without external libraries.
 * Improved implementation using standard Java APIs.
 */
public class JsonUtils {
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * Read the request body as a string
     * @param request HTTP request
     * @return Request body as string
     */
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

    /**
     * Parse Staff from JSON string
     * @param jsonStr JSON string
     * @return Staff object
     */
    public static Staff parseStaff(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        Staff staff = new Staff();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "staffId":
                        staff.setStaffId(parseIntOrDefault(value, 0));
                        break;
                    case "name":
                        staff.setName(value);
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
                            staff.setHireDate(parseDate(value));
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

    /**
     * Parse StaffRole from JSON string
     * @param jsonStr JSON string
     * @return StaffRole object
     */
    public static StaffRole parseStaffRole(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        StaffRole role = new StaffRole();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "roleId":
                        role.setRoleId(parseIntOrDefault(value, 0));
                        break;
                    case "staffId":
                        role.setStaffId(parseIntOrDefault(value, 0));
                        break;
                    case "role":
                        role.setRole(value);
                        break;
                    case "assignedDate":
                        if (!value.isEmpty()) {
                            role.setAssignedDate(parseDate(value));
                        } else {
                            role.setAssignedDate(new Date());
                        }
                        break;
                }
            }
        }

        return role;
    }

    /**
     * Parse StaffAttendance from JSON string
     * @param jsonStr JSON string
     * @return StaffAttendance object
     */
    public static StaffAttendance parseStaffAttendance(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        StaffAttendance attendance = new StaffAttendance();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "attendanceId":
                        attendance.setAttendanceId(parseIntOrDefault(value, 0));
                        break;
                    case "staffId":
                        attendance.setStaffId(parseIntOrDefault(value, 0));
                        break;
                    case "month":
                        if (!value.isEmpty()) {
                            attendance.setMonth(parseDate(value));
                        }
                        break;
                    case "workingDays":
                        attendance.setWorkingDays(parseIntOrDefault(value, 0));
                        break;
                    case "presentDays":
                        attendance.setPresentDays(parseIntOrDefault(value, 0));
                        break;
                    case "status":
                        attendance.setStatus(value);
                        break;
                    case "approvedBy":
                        attendance.setApprovedBy(parseIntOrDefault(value, 0));
                        break;
                    case "approvedDate":
                        if (!value.isEmpty()) {
                            attendance.setApprovedDate(parseDate(value));
                        }
                        break;
                }
            }
        }

        return attendance;
    }

    /**
     * Parse Payroll from JSON string
     * @param jsonStr JSON string
     * @return Payroll object
     */
    public static Payroll parsePayroll(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        Payroll payroll = new Payroll();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "payrollId":
                        payroll.setPayrollId(parseIntOrDefault(value, 0));
                        break;
                    case "staffId":
                        payroll.setStaffId(parseIntOrDefault(value, 0));
                        break;
                    case "salaryMonth":
                        if (!value.isEmpty()) {
                            payroll.setSalaryMonth(parseDate(value));
                        }
                        break;
                    case "basicSalary":
                        if (!value.isEmpty()) {
                            payroll.setBasicSalary(parseBigDecimal(value));
                        }
                        break;
                    case "allowances":
                        if (!value.isEmpty()) {
                            payroll.setAllowances(parseBigDecimal(value));
                        }
                        break;
                    case "deductions":
                        if (!value.isEmpty()) {
                            payroll.setDeductions(parseBigDecimal(value));
                        }
                        break;
                    case "netSalary":
                        if (!value.isEmpty()) {
                            payroll.setNetSalary(parseBigDecimal(value));
                        }
                        break;
                    case "paymentStatus":
                        payroll.setPaymentStatus(value);
                        break;
                    case "paymentDate":
                        if (!value.isEmpty()) {
                            payroll.setPaymentDate(parseDate(value));
                        }
                        break;
                    case "notes":
                        payroll.setNotes(value);
                        break;
                }
            }
        }

        return payroll;
    }

    /**
     * Parse Batch from JSON string
     * @param jsonStr JSON string
     * @return Batch object
     */
    public static Batch parseBatch(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        Batch batch = new Batch();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "batchId":
                        batch.setBatchId(value);
                        break;
                    case "batchName":
                        batch.setBatchName(value);
                        break;
                    case "startDate":
                        if (!value.isEmpty()) {
                            batch.setStartDate(parseDate(value));
                        }
                        break;
                    case "endDate":
                        if (!value.isEmpty()) {
                            batch.setEndDate(parseDate(value));
                        }
                        break;
                    case "capacity":
                        batch.setCapacity(parseIntOrDefault(value, 0));
                        break;
                    case "status":
                        batch.setStatus(value);
                        break;
                    case "courseIds":
                        if (value.startsWith("[") && value.endsWith("]")) {
                            String[] courseIds = parseJsonArray(value.substring(1, value.length() - 1));
                            for (String courseId : courseIds) {
                                batch.addCourseId(courseId);
                            }
                        }
                        break;
                }
            }
        }

        return batch;
    }

    /**
     * Parse BatchFacultyAssignment from JSON string
     * @param jsonStr JSON string
     * @return BatchFacultyAssignment object
     */
    public static BatchFacultyAssignment parseBatchFacultyAssignment(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        BatchFacultyAssignment assignment = new BatchFacultyAssignment();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "assignmentId":
                        assignment.setAssignmentId(parseIntOrDefault(value, 0));
                        break;
                    case "batchId":
                        assignment.setBatchId(value);
                        break;
                    case "staffId":
                        assignment.setStaffId(parseIntOrDefault(value, 0));
                        break;
                    case "courseId":
                        assignment.setCourseId(value);
                        break;
                    case "assignmentDate":
                        if (!value.isEmpty()) {
                            assignment.setAssignmentDate(parseDate(value));
                        } else {
                            assignment.setAssignmentDate(new Date());
                        }
                        break;
                    case "endDate":
                        if (!value.isEmpty()) {
                            assignment.setEndDate(parseDate(value));
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

    /**
     * Parse Student from JSON string
     * @param jsonStr JSON string
     * @return Student object
     */
    public static Student parseStudent(String jsonStr) throws Exception {
        // Remove outer braces and quotes
        jsonStr = jsonStr.trim();
        if (jsonStr.startsWith("{")) {
            jsonStr = jsonStr.substring(1);
        }
        if (jsonStr.endsWith("}")) {
            jsonStr = jsonStr.substring(0, jsonStr.length() - 1);
        }

        // Split into key-value pairs
        Student student = new Student();
        String[] pairs = splitJsonPairs(jsonStr);

        for (String pair : pairs) {
            String[] keyValue = splitKeyValue(pair);
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];

                switch (key) {
                    case "indexNumber":
                        student.setIndexNumber(parseIntOrDefault(value, 0));
                        break;
                    case "registrationNumber":
                        student.setRegistrationNumber(value);
                        break;
                    case "name":
                        student.setName(value);
                        break;
                    case "email":
                        student.setEmail(value);
                        break;
                    case "batchId":
                        student.setBatchId(value);
                        break;
                    case "gender":
                        student.setGender(value);
                        break;
                    case "hostelRequired":
                        student.setHostelRequired(parseBooleanOrDefault(value, false));
                        break;
                }
            }
        }

        return student;
    }

    /**
     * Split JSON string into key-value pairs
     * @param jsonStr JSON string without outer braces
     * @return Array of key-value pair strings
     */
    private static String[] splitJsonPairs(String jsonStr) {
        // This handles nested objects and arrays by counting braces and brackets
        java.util.List<String> pairs = new java.util.ArrayList<>();

        int start = 0;
        int braceCount = 0;
        int bracketCount = 0;
        boolean inQuotes = false;
        boolean escaped = false;

        for (int i = 0; i < jsonStr.length(); i++) {
            char c = jsonStr.charAt(i);

            if (escaped) {
                escaped = false;
                continue;
            }

            if (c == '\\') {
                escaped = true;
                continue;
            }

            if (c == '"' && !escaped) {
                inQuotes = !inQuotes;
                continue;
            }

            if (!inQuotes) {
                if (c == '{') braceCount++;
                else if (c == '}') braceCount--;
                else if (c == '[') bracketCount++;
                else if (c == ']') bracketCount--;

                if (c == ',' && braceCount == 0 && bracketCount == 0) {
                    pairs.add(jsonStr.substring(start, i).trim());
                    start = i + 1;
                }
            }
        }

        // Add the last pair
        if (start < jsonStr.length()) {
            pairs.add(jsonStr.substring(start).trim());
        }

        return pairs.toArray(new String[0]);
    }

    /**
     * Split key-value pair string into key and value
     * @param pair Key-value pair string
     * @return Array with key and value
     */
    private static String[] splitKeyValue(String pair) {
        int colonIndex = -1;
        boolean inQuotes = false;
        boolean escaped = false;

        // Find the colon that separates key and value
        for (int i = 0; i < pair.length(); i++) {
            char c = pair.charAt(i);

            if (escaped) {
                escaped = false;
                continue;
            }

            if (c == '\\') {
                escaped = true;
                continue;
            }

            if (c == '"' && !escaped) {
                inQuotes = !inQuotes;
                continue;
            }

            if (!inQuotes && c == ':') {
                colonIndex = i;
                break;
            }
        }

        if (colonIndex == -1) {
            return new String[0];
        }

        String key = pair.substring(0, colonIndex).trim();
        String value = pair.substring(colonIndex + 1).trim();

        // Remove quotes from key and value
        if (key.startsWith("\"") && key.endsWith("\"")) {
            key = key.substring(1, key.length() - 1);
        }

        if (value.startsWith("\"") && value.endsWith("\"")) {
            value = value.substring(1, value.length() - 1);
        }

        return new String[]{key, value};
    }

    /**
     * Parse JSON array string into array of strings
     * @param arrayStr JSON array string without brackets
     * @return Array of strings
     */
    private static String[] parseJsonArray(String arrayStr) {
        java.util.List<String> items = new java.util.ArrayList<>();

        int start = 0;
        int braceCount = 0;
        int bracketCount = 0;
        boolean inQuotes = false;
        boolean escaped = false;

        for (int i = 0; i < arrayStr.length(); i++) {
            char c = arrayStr.charAt(i);

            if (escaped) {
                escaped = false;
                continue;
            }

            if (c == '\\') {
                escaped = true;
                continue;
            }

            if (c == '"' && !escaped) {
                inQuotes = !inQuotes;
                continue;
            }

            if (!inQuotes) {
                if (c == '{') braceCount++;
                else if (c == '}') braceCount--;
                else if (c == '[') bracketCount++;
                else if (c == ']') bracketCount--;

                if (c == ',' && braceCount == 0 && bracketCount == 0) {
                    String item = arrayStr.substring(start, i).trim();
                    if (item.startsWith("\"") && item.endsWith("\"")) {
                        item = item.substring(1, item.length() - 1);
                    }
                    items.add(item);
                    start = i + 1;
                }
            }
        }

        // Add the last item
        if (start < arrayStr.length()) {
            String item = arrayStr.substring(start).trim();
            if (item.startsWith("\"") && item.endsWith("\"")) {
                item = item.substring(1, item.length() - 1);
            }
            items.add(item);
        }

        return items.toArray(new String[0]);
    }

    /**
     * Parse integer from string
     * @param str String to parse
     * @param defaultValue Default value if parsing fails
     * @return Parsed integer or default value
     */
    private static int parseIntOrDefault(String str, int defaultValue) {
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    /**
     * Parse boolean from string
     * @param str String to parse
     * @param defaultValue Default value if parsing fails
     * @return Parsed boolean or default value
     */
    private static boolean parseBooleanOrDefault(String str, boolean defaultValue) {
        if (str == null) {
            return defaultValue;
        }

        str = str.trim().toLowerCase();

        if (str.equals("true") || str.equals("yes") || str.equals("1")) {
            return true;
        } else if (str.equals("false") || str.equals("no") || str.equals("0")) {
            return false;
        } else {
            return defaultValue;
        }
    }

    /**
     * Parse BigDecimal from string
     * @param str String to parse
     * @return Parsed BigDecimal or BigDecimal.ZERO
     */
    private static BigDecimal parseBigDecimal(String str) {
        try {
            return new BigDecimal(str);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Parse date from string
     * @param str String to parse
     * @return Parsed date or null
     */
    private static Date parseDate(String str) {
        try {
            return DATE_FORMAT.parse(str);
        } catch (ParseException e) {
            return null;
        }
    }
}