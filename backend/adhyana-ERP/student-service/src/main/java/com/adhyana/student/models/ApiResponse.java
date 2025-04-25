package com.adhyana.student.models;

import java.util.List;
import java.util.Map;

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
            }else if (data instanceof Attendance) {
                json.append(attendanceToJson((Attendance) data));
            }else if (data instanceof CourseSession) {
                json.append(courseSessionToJson((CourseSession) data));
            } else if (data instanceof Scholarship) {
                json.append(scholarshipToJson((Scholarship) data));
            } else if (data instanceof ScholarshipApplication) {
                json.append(scholarshipApplicationToJson((ScholarshipApplication) data));
            }else if (data instanceof StudentApplication) {
                json.append(studentApplicationToJson((StudentApplication) data));
            } else if (data instanceof StudentApplication.ApplicationResponse) {
                json.append(applicationResponseToJson((StudentApplication.ApplicationResponse) data));
            }else if (data instanceof java.util.List) {
                json.append(listToJson((java.util.List<?>) data));
            }else {
                json.append("null");
            }
        }else {
            json.append(",\"data\":null");
        }

        json.append("}");
        return json.toString();
    }

    //*convert objects to JSON strings *

    /**
     * Converts a Student object to a JSON string
     *
     * Contains all the student fields needed for the UI:
     * - Full details for the student listing page (Image 1)
     * - Fields for student profile view (Image 6)
     * - Fields for edit form (Image 4)
     */
    private String studentToJson(Student student) {
        return String.format(
                "{\"id\":%d,\"name\":\"%s\",\"email\":\"%s\",\"degreeID\":\"%s\",\"degreeProgram\":\"%s\"," +
                        "\"indexNumber\":\"%s\",\"registrationNumber\":\"%s\",\"mobileNumber\":\"%s\"," +
                        "\"birthDate\":\"%s\",\"state\":\"%s\"}",
                student.getId(), student.getName(), student.getEmail(),student.getDegreeID(),
                student.getDegreeProgram(), student.getIndexNumber(),
                student.getRegistrationNumber(), student.getMobileNumber(),
                student.getBirthDate(), student.getState()
        );
    }


    // Add this new method to handle StudentApplication objects
    private String studentApplicationToJson(StudentApplication application) {
        return String.format(
                "{\"id\":%d,\"name\":\"%s\",\"nationalId\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"," +
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


    // Add this method to handle ApplicationResponse objects
    private String applicationResponseToJson(StudentApplication.ApplicationResponse response) {
        return String.format(
                "{\"applicantId\":\"%s\",\"name\":\"%s\",\"status\":\"%s\"}",
                response.getApplicantId(), response.getName(), response.getStatus()
        );
    }

    // converts an Attendance object to a JSON string
    private String attendanceToJson(Attendance attendance) {
        return String.format(
                "{\"id\":%d,\"studentId\":%d,\"courseCode\":\"%s\",\"date\":\"%s\"," +
                        "\"present\":%b,\"remarks\":\"%s\"}",
                attendance.getId(), attendance.getStudentId(), attendance.getCourseCode(),
                attendance.getDate(), attendance.isPresent(), attendance.getRemarks()
        );
    }

    // converts an course session object to a JSON string
    private String courseSessionToJson(CourseSession session) {
        return String.format(
                "{\"id\":%d,\"courseCode\":\"%s\",\"courseName\":\"%s\",\"date\":\"%s\",\"totalStudents\":%d," +
                        "\"presentStudents\":%d,\"attendancePercentage\":%.2f}",
                session.getId(), session.getCourseCode(), session.getCourseName(),
                session.getDate(),
                session.getTotalStudents(), session.getPresentStudents(),
                session.getAttendancePercentage()
        );
    }

    // converts a attendanceSummary object to a JSON string
    private String attendanceSummaryToJson(AttendanceSummary summary) {
        return String.format(
                "{\"studentId\":%d,\"studentName\":\"%s\",\"courseCode\":\"%s\",\"courseName\":\"%s\"," +
                        "\"totalSessions\":%d,\"presentCount\":%d,\"absentCount\":%d,\"attendancePercentage\":%.2f}",
                summary.getStudentId(), summary.getStudentName(), summary.getCourseCode(),
                summary.getCourseName(), summary.getTotalSessions(), summary.getPresentCount(),
                summary.getAbsentCount(), summary.getAttendancePercentage()
        );
    }

    // converts a scholarship object to a JSON string
    private String scholarshipToJson(Scholarship scholarship) {
        return String.format(
                "{\"id\":%d,\"name\":\"%s\",\"description\":\"%s\",\"minGpa\":%f," +
                        "\"amount\":%s,\"applicationDeadline\":\"%s\"}",
                scholarship.getId(), scholarship.getName(), scholarship.getDescription(),
                scholarship.getMinGpa(), scholarship.getAmount().toString(),
                scholarship.getApplicationDeadline().toString()
        );
    }

    // converts a scholarship Application object to a JSON string
    private String scholarshipApplicationToJson(ScholarshipApplication application) {
        return String.format(
                "{\"id\":%d,\"studentId\":%d,\"scholarshipId\":%d,\"studentBatch\":\"%s\"," +
                        "\"studentDegree\":\"%s\",\"studentGpa\":%f,\"status\":\"%s\",\"comments\":\"%s\"}",
                application.getId(), application.getStudentId(), application.getScholarshipId(),
                application.getStudentBatch(), application.getStudentDegree(),
                application.getStudentGpa(), application.getStatus(),
                application.getComments() != null ? application.getComments() : ""
        );
    }


    // Update the existing listToJson method to handle the new classes
    private String listToJson(java.util.List<?> list) {
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) instanceof Student) {
                json.append(studentToJson((Student) list.get(i)));
            }else if (list.get(i) instanceof Attendance) {
                json.append(attendanceToJson((Attendance) list.get(i)));
            }else if (list.get(i) instanceof CourseSession) {
                json.append(courseSessionToJson((CourseSession) list.get(i)));
            } else if (list.get(i) instanceof AttendanceSummary) {
                json.append(attendanceSummaryToJson((AttendanceSummary) list.get(i)));
            } else if (list.get(i) instanceof Scholarship) {
                json.append(scholarshipToJson((Scholarship) list.get(i)));
            } else if (list.get(i) instanceof ScholarshipApplication) {
                json.append(scholarshipApplicationToJson((ScholarshipApplication) list.get(i)));
            }else if (list.get(i) instanceof StudentApplication) {
                json.append(studentApplicationToJson((StudentApplication) list.get(i)));
            } else if (list.get(i) instanceof StudentApplication.ApplicationResponse) {
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