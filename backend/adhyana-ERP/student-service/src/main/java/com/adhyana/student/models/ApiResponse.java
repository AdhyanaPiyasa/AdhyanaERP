package com.adhyana.student.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // determines the appropriate JSON representation based on object type
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"success\":").append(success).append(",");
        json.append("\"message\":\"").append(message).append("\"");

        if (data != null) {
            json.append(",\"data\":");
            if (data instanceof Student) {
                json.append(studentToJson((Student) data));
            } else if (data instanceof EnrolledStudent) {
                json.append(enrolledStudentToJson((EnrolledStudent) data));
            } else if (data instanceof Attendance) {
                json.append(attendanceToJson((Attendance) data));
            } else if (data instanceof CourseSession) {
                json.append(courseSessionToJson((CourseSession) data));
            } else if (data instanceof AttendanceSummary) {
                json.append(attendanceSummaryToJson((AttendanceSummary) data));
            } else if (data instanceof Scholarship) {
                json.append(scholarshipToJson((Scholarship) data));
            } else if (data instanceof ScholarshipApplication) {
                json.append(scholarshipApplicationToJson((ScholarshipApplication) data));
            } else if (data instanceof StudentApplication) {
                json.append(studentApplicationToJson((StudentApplication) data));
            } else if (data instanceof StudentApplication.ApplicationResponse) {
                json.append(applicationResponseToJson((StudentApplication.ApplicationResponse) data));
            } else if (data instanceof java.util.List) {
                json.append(listToJson((java.util.List<?>) data));
            }else if (data instanceof CourseEnrollment) {
                json.append(courseEnrollmentToJson((CourseEnrollment) data));
            } else if (data instanceof java.util.Map) {
                json.append(listToJson((java.util.List<?>) data));
            } else {
                json.append("null");
            }
        } else {
            json.append(",\"data\":null");
        }

        json.append("}");
        return json.toString();
    }

    // Convert objects to JSON strings

    // Updated method for the new Student model
    private String studentToJson(Student student) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        String createdAt = student.getCreatedAt() != null ? "\"" + student.getCreatedAt().format(formatter) + "\"" : "null";
        String updatedAt = student.getUpdatedAt() != null ? "\"" + student.getUpdatedAt().format(formatter) + "\"" : "null";

        return String.format(
                "{\"studentIndex\":%d,\"registrationNumber\":\"%s\",\"name\":\"%s\",\"email\":\"%s\"," +
                        "\"batchId\":%s,\"createdAt\":%s,\"updatedAt\":%s}",
                student.getStudentIndex(),
                student.getRegistrationNumber(),
                student.getName(),
                student.getEmail(),
                student.getBatchId() != null ? "\"" + student.getBatchId() + "\"" : "null",
                createdAt,
                updatedAt
        );
    }

    // New method for EnrolledStudent model
    private String enrolledStudentToJson(EnrolledStudent student) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        String createdAt = student.getCreatedAt() != null ? "\"" + student.getCreatedAt().format(formatter) + "\"" : "null";
        String updatedAt = student.getUpdatedAt() != null ? "\"" + student.getUpdatedAt().format(formatter) + "\"" : "null";

        return String.format(
                "{\"studentIndex\":%d,\"registrationNumber\":\"%s\",\"batchId\":%s,\"name\":\"%s\"," +
                        "\"nationalId\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\",\"gender\":\"%s\"," +
                        "\"dateOfBirth\":\"%s\",\"address\":\"%s\",\"guardianName\":\"%s\"," +
                        "\"guardianNationalId\":\"%s\",\"guardianRelation\":\"%s\",\"guardianContactNumber\":\"%s\"," +
                        "\"guardianEmail\":%s,\"hostelRequired\":%s,\"createdAt\":%s,\"updatedAt\":%s}",
                student.getStudentIndex(),
                student.getRegistrationNumber(),
                student.getBatchId() != null ? "\"" + student.getBatchId() + "\"" : "null",
                student.getName(),
                student.getNationalId(),
                student.getEmail(),
                student.getPhone(),
                student.getGender(),
                student.getDateOfBirth().toString(),
                student.getAddress(),
                student.getGuardianName(),
                student.getGuardianNationalId(),
                student.getGuardianRelation(),
                student.getGuardianContactNumber(),
                student.getGuardianEmail() != null ? "\"" + student.getGuardianEmail() + "\"" : "null",
                student.getHostelRequired() != null ? "\"" + student.getHostelRequired() + "\"" : "null",
                createdAt,
                updatedAt
        );
    }

    // New method to handle Attendance objects
    private String attendanceToJson(Attendance attendance) {
        return String.format(
                "{\"id\":%d,\"studentIndex\":%d,\"courseCode\":\"%s\",\"date\":\"%s\"," +
                        "\"present\":%b}",
                attendance.getId(), attendance.getStudentIndex(), attendance.getCourseCode(),
                attendance.getDate(), attendance.isPresent()
        );
    }

    // New method to handle CourseSession objects
    private String courseSessionToJson(CourseSession session) {
        return String.format(
                "{\"id\":%d,\"courseCode\":\"%s\",\"courseName\":\"%s\",\"date\":\"%s\"," +
                        "\"totalStudents\":%d,\"presentStudents\":%d,\"attendancePercentage\":%.2f}",
                session.getId(), session.getCourseCode(), session.getCourseName(),
                session.getDate(), session.getTotalStudents(), session.getPresentStudents(),
                session.getAttendancePercentage()
        );
    }

    // Add this new method for CourseEnrollment JSON conversion
    private String courseEnrollmentToJson(CourseEnrollment enrollment) {
        return String.format(
                "{\"studentIndex\":%d,\"studentName\":\"%s\"}",
                enrollment.getStudentIndex(), enrollment.getStudentName()
        );
    }

    // Existing method for AttendanceSummaryToJson
    private String attendanceSummaryToJson(AttendanceSummary summary) {
        return String.format(
                "{\"studentIndex\":%d,\"studentName\":\"%s\",\"courseCode\":\"%s\",\"courseName\":\"%s\"," +
                        "\"totalSessions\":%d,\"presentCount\":%d,\"absentCount\":%d,\"attendancePercentage\":%.2f}",
                summary.getStudentIndex(), summary.getStudentName(), summary.getCourseCode(),
                summary.getCourseName(), summary.getTotalSessions(), summary.getPresentCount(),
                summary.getAbsentCount(), summary.getAttendancePercentage()
        );
    }

    // Existing method for ScholarshipToJson
    private String scholarshipToJson(Scholarship scholarship) {
        return String.format(
                "{\"id\":%d,\"name\":\"%s\",\"description\":\"%s\",\"minGpa\":%f," +
                        "\"amount\":%s,\"applicationDeadline\":\"%s\"}",
                scholarship.getId(), scholarship.getName(), scholarship.getDescription(),
                scholarship.getMinGpa(), scholarship.getAmount().toString(),
                scholarship.getApplicationDeadline().toString()
        );
    }

    // Existing method for ScholarshipApplicationToJson
    private String scholarshipApplicationToJson(ScholarshipApplication application) {
        return String.format(
                "{\"id\":%d,\"studentIndexNumber\":%d,\"scholarshipId\":%d,\"studentBatch\":\"%s\"," +
                        "\"studentDegree\":\"%s\",\"studentGpa\":%f,\"status\":\"%s\",\"comments\":\"%s\"}",
                application.getId(), application.getStudentIndexNumber(), application.getScholarshipId(),
                application.getStudentBatch(), application.getStudentDegree(),
                application.getStudentGpa(), application.getStatus(),
                application.getComments() != null ? application.getComments() : ""
        );
    }

    // Existing method for StudentApplicationToJson
    private String studentApplicationToJson(StudentApplication application) {
        return String.format(
                "{\"student_application_id\":%d,\"name\":\"%s\",\"nationalId\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"," +
                        "\"gender\":\"%s\",\"dateOfBirth\":\"%s\",\"address\":\"%s\",\"appliedProgram\":\"%s\"," +
                        "\"applicationDate\":\"%s\",\"mathematics\":\"%s\",\"science\":\"%s\",\"english\":\"%s\"," +
                        "\"computerStudies\":\"%s\",\"guardianName\":\"%s\",\"guardianNationalId\":\"%s\"," +
                        "\"guardianRelation\":\"%s\",\"guardianContactNumber\":\"%s\",\"guardianEmail\":\"%s\"," +
                        "\"hostelRequired\":\"%s\",\"status\":\"%s\"}",
                application.getId(), application.getName(), application.getNationalId(), application.getEmail(),
                application.getPhone(), application.getGender(), application.getDateOfBirth(), application.getAddress(),
                application.getAppliedProgram(), application.getApplicationDate(), application.getMathematics(),
                application.getScience(), application.getEnglish(), application.getComputerStudies(),
                application.getGuardianName(), application.getGuardianNationalId(), application.getGuardianRelation(),
                application.getGuardianContactNumber(), application.getGuardianEmail(), application.getHostelRequired(),
                application.getStatus()
        );
    }

    // Existing method for ApplicationResponseToJson
    private String applicationResponseToJson(StudentApplication.ApplicationResponse response) {
        return String.format(
                "{\"applicantId\":\"%s\",\"name\":\"%s\",\"status\":\"%s\"}",
                response.getApplicantId(), response.getName(), response.getStatus()
        );
    }

    // Updated method to handle all object types
    private String listToJson(java.util.List<?> list) {
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) instanceof Student) {
                json.append(studentToJson((Student) list.get(i)));
            } else if (list.get(i) instanceof EnrolledStudent) {
                json.append(enrolledStudentToJson((EnrolledStudent) list.get(i)));
            } else if (list.get(i) instanceof Attendance) {
                json.append(attendanceToJson((Attendance) list.get(i)));
            } else if (list.get(i) instanceof CourseSession) {
                json.append(courseSessionToJson((CourseSession) list.get(i)));
            } else if (list.get(i) instanceof AttendanceSummary) {
                json.append(attendanceSummaryToJson((AttendanceSummary) list.get(i)));
            } else if (list.get(i) instanceof Scholarship) {
                json.append(scholarshipToJson((Scholarship) list.get(i)));
            } else if (list.get(i) instanceof ScholarshipApplication) {
                json.append(scholarshipApplicationToJson((ScholarshipApplication) list.get(i)));
            } else if (list.get(i) instanceof StudentApplication) {
                json.append(studentApplicationToJson((StudentApplication) list.get(i)));
            } else if (list.get(i) instanceof CourseEnrollment) {
                json.append(courseEnrollmentToJson((CourseEnrollment) list.get(i)));
            }else if (list.get(i) instanceof StudentApplication.ApplicationResponse) {
                json.append(applicationResponseToJson((StudentApplication.ApplicationResponse) list.get(i)));
            }

            if (i < list.size() - 1) {
                json.append(",");// Add comma between items
            }
        }

        json.append("]");
        return json.toString();
    }
}