package com.adhyana.course.models;

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

    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"success\":").append(success).append(",");
        json.append("\"message\":\"").append(message).append("\"");

        if (data != null) {
            json.append(",\"data\":");
            if (data instanceof Course) {
                json.append(courseToJson((Course) data));
            } else if (data instanceof Announcement) {
                json.append(announcementToJson((Announcement) data));
            } else if (data instanceof Feedback) {
                json.append(feedbackToJson((Feedback) data));
            } else if (data instanceof Semester) {
                json.append(semesterToJson((Semester) data));
            } else if (data instanceof StudentSemesterCourse) {
                json.append(studentSemesterCourseToJson((StudentSemesterCourse) data));
            } else if (data instanceof List<?>) {
                json.append(listToJson((List<?>) data));
            }
        }

        json.append("}");
        return json.toString();
    }

    private String announcementToJson(Announcement a) {
        return String.format(
                "{\"id\":%d,\"courseId\":\"%s\",\"semesterId\":%s,\"title\":\"%s\",\"content\":\"%s\"," +
                        "\"postedBy\":%s,\"author\":\"%s\",\"createdAt\":\"%s\",\"updatedAt\":\"%s\"}",
                a.getId(),
                a.getCourseId(),
                a.getSemesterId() == null ? "null" : "\"" + a.getSemesterId() + "\"",
                a.getTitle(),
                a.getContent(),
                a.getPostedBy() == null ? "null" : a.getPostedBy(),
                a.getPostedBy() == null ? "" : a.getPostedBy().toString(), // Include author for backward compatibility
                a.getCreatedAt().toString(),
                a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : a.getCreatedAt().toString()
        );
    }

    private String courseToJson(Course course) {
        // Updated to match the new Course model fields
        return String.format(
                "{\"courseId\":\"%s\",\"name\":\"%s\",\"year\":%d," +
                        "\"credits\":%d,\"duration\":%d,\"avgRating\":%s}",
                course.getCourseId(), course.getName(), course.getYear(),
                course.getCredits(), course.getDuration(),
                course.getAvgRating() == null ? "null" : course.getAvgRating()
        );
    }

    private String semesterToJson(Semester s) {
        return String.format(
                "{\"semesterId\":\"%s\",\"batchId\":\"%s\",\"academicYear\":%d,\"semesterNum\":%d," +
                        "\"startDate\":\"%s\",\"endDate\":\"%s\",\"status\":\"%s\"," +
                        "\"createdAt\":%s,\"updatedAt\":%s}",
                s.getSemesterId(),
                s.getBatchId(),
                s.getAcademicYear(),
                s.getSemesterNum(),
                s.getStartDate().toString(),
                s.getEndDate().toString(),
                s.getStatus(),
                s.getCreatedAt() == null ? "null" : "\"" + s.getCreatedAt().toString() + "\"",
                s.getUpdatedAt() == null ? "null" : "\"" + s.getUpdatedAt().toString() + "\""
        );
    }

    private String feedbackToJson(Feedback f) {
        return String.format(
                "{\"feedbackId\":%d,\"courseId\":\"%s\",\"semesterId\":%s,\"studentIndex\":%s," +
                        "\"ratingContent\":%d,\"ratingInstructor\":%d,\"ratingMaterials\":%d,\"ratingLms\":%d," +
                        "\"comment\":\"%s\",\"isAnonymous\":%b,\"createdAt\":\"%s\",\"updatedAt\":\"%s\"}",
                f.getFeedbackId(),
                f.getCourseId(),
                f.getSemesterId() == null ? "null" : "\"" + f.getSemesterId() + "\"",
                f.getStudentIndex() == null ? "null" : f.getStudentIndex().toString(),
                f.getRatingContent(),
                f.getRatingInstructor(),
                f.getRatingMaterials(),
                f.getRatingLms(),
                f.getComment(),
                f.isAnonymous(),
                f.getCreatedAt().toString(),
                f.getUpdatedAt().toString()
        );
    }

    private String studentSemesterCourseToJson(StudentSemesterCourse ssc) {
        return String.format(
                "{\"studentIndex\":%d,\"semesterId\":\"%s\",\"courseId\":\"%s\",\"enrollmentDate\":%s}",
                ssc.getStudentIndex(),
                ssc.getSemesterId(),
                ssc.getCourseId(),
                ssc.getEnrollmentDate() != null ? "\"" + ssc.getEnrollmentDate().toString() + "\"" : "null"
        );
    }

    private String listToJson(List<?> list) {
        StringBuilder json = new StringBuilder();
        json.append("[");

        for (int i = 0; i < list.size(); i++) {
            Object item = list.get(i);

            if (item instanceof Course) {
                json.append(courseToJson((Course) item));
            } else if (item instanceof Announcement) {
                json.append(announcementToJson((Announcement) item));
            } else if (item instanceof Feedback) {
                json.append(feedbackToJson((Feedback) item));
            } else if (item instanceof Semester) {
                json.append(semesterToJson((Semester) item));
            } else if (item instanceof StudentSemesterCourse) {
                json.append(studentSemesterCourseToJson((StudentSemesterCourse) item));
            }

            if (i < list.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }
}