// src/main/java/com/adhyana/course/models/ApiResponse.java
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

    // --- Utility method to properly escape strings for JSON ---
    private String escapeJsonString(String value) {
        if (value == null) {
            return "null"; // Represent null as JSON null literal
        }
        // Escape quotes, backslashes, and control characters
        // Replace backslash first to avoid double-escaping
        value = value.replace("\\", "\\\\"); // Escape backslashes
        value = value.replace("\"", "\\\""); // Escape double quotes
        value = value.replace("\b", "\\b");  // Escape backspace
        value = value.replace("\f", "\\f");  // Escape form feed
        value = value.replace("\n", "\\n");  // Escape newline
        value = value.replace("\r", "\\r");  // Escape carriage return
        value = value.replace("\t", "\\t");  // Escape tab
        // Wrap the escaped string in double quotes
        return "\"" + value + "\"";
    }
    // --- END Utility method ---

    // --- Helper function to serialize SemesterOfferingDetail ---
    private String offeringDetailToJson(SemesterOfferingDetail offering) {
        if (offering == null) return "null";
        // Use escapeJsonString for all string values
        return String.format(
                "{\"courseId\":%s,\"teacherName\":%s}",
                escapeJsonString(offering.getCourseId()),
                escapeJsonString(offering.getTeacherName())
        );
    }

    // --- Helper function to serialize List<SemesterOfferingDetail> ---
    private String offeringsListToJson(List<SemesterOfferingDetail> offerings) {
        if (offerings == null) { // Handle null list explicitly
            return "[]"; // Return empty JSON array for null list
        }
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < offerings.size(); i++) {
            // Ensure null elements in the list are handled
            json.append(offeringDetailToJson(offerings.get(i)));
            if (i < offerings.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }


    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        // Boolean value for success (no quotes)
        json.append("\"success\":").append(success).append(",");
        // Properly escaped string for message
        json.append("\"message\":").append(escapeJsonString(message));

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
                // Need to check the type of list elements for proper serialization
                json.append(listToJson((List<?>) data));
            }
            // Handle basic types directly if needed
            else if (data instanceof String) {
                json.append(escapeJsonString((String) data));
            } else if (data instanceof Number || data instanceof Boolean) {
                json.append(data.toString()); // Numbers and booleans don't need quotes
            }
            else {
                // Fallback for unknown complex types - might be unsafe
                System.err.println("Warning: Serializing unknown type in ApiResponse: " + data.getClass().getName());
                json.append(escapeJsonString(data.toString())); // Escape the toString representation
            }
        } else {
            // Optionally include "data": null if data is null
            // json.append(",\"data\":null");
        }

        json.append("}");
        return json.toString();
    }


    private String announcementToJson(Announcement a) {
        if (a == null) return "null";
        // Use escapeJsonString for all string fields
        return String.format(
                "{\"id\":%d,\"courseId\":%s,\"semesterId\":%s,\"title\":%s,\"content\":%s," +
                        "\"postedBy\":%s,\"author\":%s,\"createdAt\":%s,\"updatedAt\":%s}",
                a.getId(),
                escapeJsonString(a.getCourseId()),
                a.getSemesterId() == null ? "null" : escapeJsonString(a.getSemesterId()),
                escapeJsonString(a.getTitle()),
                escapeJsonString(a.getContent()),
                a.getPostedBy() == null ? "null" : a.getPostedBy().toString(), // Assuming postedBy is numeric or simple string
                a.getPostedBy() == null ? "\"\"" : escapeJsonString(a.getPostedBy().toString()), // Author likely needs escaping too
                a.getCreatedAt() == null ? "null" : escapeJsonString(a.getCreatedAt().toString()),
                a.getUpdatedAt() == null ? "null" : escapeJsonString(a.getUpdatedAt().toString())
        );
    }

    private String courseToJson(Course course) {
        if (course == null) return "null";
        return String.format(
                "{\"courseId\":%s,\"name\":%s,\"year\":%d," +
                        "\"credits\":%d,\"duration\":%d,\"avgRating\":%s}",
                escapeJsonString(course.getCourseId()),
                escapeJsonString(course.getName()),
                course.getYear(), // number
                course.getCredits(), // number
                course.getDuration(), // number
                course.getAvgRating() == null ? "null" : course.getAvgRating().toString() // number or null
        );
    }

    private String semesterToJson(Semester s) {
        if (s == null) return "null";
        // Dates/Timestamps need to be strings, so use escapeJsonString on their toString() result
        return String.format(
                "{\"semesterId\":%s,\"batchId\":%s,\"academicYear\":%d,\"semesterNum\":%d," +
                        "\"startDate\":%s,\"endDate\":%s,\"status\":%s," +
                        "\"createdAt\":%s,\"updatedAt\":%s,\"offerings\":%s}",
                escapeJsonString(s.getSemesterId()),
                escapeJsonString(s.getBatchId()),
                s.getAcademicYear(), // number
                s.getSemesterNum(), // number
                s.getStartDate() == null ? "null" : escapeJsonString(s.getStartDate().toString()), // date as string
                s.getEndDate() == null ? "null" : escapeJsonString(s.getEndDate().toString()),   // date as string
                escapeJsonString(s.getStatus()),
                s.getCreatedAt() == null ? "null" : escapeJsonString(s.getCreatedAt().toString()), // timestamp as string
                s.getUpdatedAt() == null ? "null" : escapeJsonString(s.getUpdatedAt().toString()), // timestamp as string
                offeringsListToJson(s.getOfferings()) // This already returns a valid JSON array string
        );
    }

    private String feedbackToJson(Feedback f) {
        if (f == null) return "null";
        return String.format(
                "{\"feedbackId\":%d,\"courseId\":%s,\"semesterId\":%s,\"studentIndex\":%s," +
                        "\"ratingContent\":%d,\"ratingInstructor\":%d,\"ratingMaterials\":%d,\"ratingLms\":%d," +
                        "\"comment\":%s,\"isAnonymous\":%b,\"createdAt\":%s,\"updatedAt\":%s}",
                f.getFeedbackId(), // number
                escapeJsonString(f.getCourseId()),
                f.getSemesterId() == null ? "null" : escapeJsonString(f.getSemesterId()),
                f.getStudentIndex() == null ? "null" : f.getStudentIndex().toString(), // number or null
                f.getRatingContent(), // number
                f.getRatingInstructor(), // number
                f.getRatingMaterials(), // number
                f.getRatingLms(), // number
                escapeJsonString(f.getComment()),
                f.isAnonymous(), // boolean
                f.getCreatedAt() == null ? "null" : escapeJsonString(f.getCreatedAt().toString()), // timestamp as string
                f.getUpdatedAt() == null ? "null" : escapeJsonString(f.getUpdatedAt().toString()) // timestamp as string
        );
    }

    private String studentSemesterCourseToJson(StudentSemesterCourse ssc) {
        if (ssc == null) return "null";
        return String.format(
                "{\"studentIndex\":%d,\"semesterId\":%s,\"courseId\":%s,\"enrollmentDate\":%s}",
                ssc.getStudentIndex(), // number
                escapeJsonString(ssc.getSemesterId()),
                escapeJsonString(ssc.getCourseId()),
                ssc.getEnrollmentDate() == null ? "null" : escapeJsonString(ssc.getEnrollmentDate().toString()) // timestamp as string
        );
    }

    // Modified listToJson to be more type-aware (basic example)
    private String listToJson(List<?> list) {
        if (list == null) return "[]"; // Handle null list

        StringBuilder json = new StringBuilder();
        json.append("[");

        for (int i = 0; i < list.size(); i++) {
            Object item = list.get(i);

            if (item == null) {
                json.append("null");
            } else if (item instanceof Course) {
                json.append(courseToJson((Course) item));
            } else if (item instanceof Announcement) {
                json.append(announcementToJson((Announcement) item));
            } else if (item instanceof Feedback) {
                json.append(feedbackToJson((Feedback) item));
            } else if (item instanceof Semester) {
                json.append(semesterToJson((Semester) item));
            } else if (item instanceof StudentSemesterCourse) {
                json.append(studentSemesterCourseToJson((StudentSemesterCourse) item));
            } else if (item instanceof String) {
                json.append(escapeJsonString((String) item));
            } else if (item instanceof Number || item instanceof Boolean) {
                json.append(item.toString());
            } else {
                System.err.println("Warning: Serializing unknown type in list: " + item.getClass().getName());
                json.append(escapeJsonString(item.toString())); // Fallback: escape toString
            }


            if (i < list.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }
}