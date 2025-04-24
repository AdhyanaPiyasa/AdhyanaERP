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
            } else if (data instanceof List<?>) {
                json.append(listToJson((List<?>) data));
            }
        }

        json.append("}");
        return json.toString();
    }

    private String courseToJson(Course course) {
        // Include avgRating in the JSON output
        return String.format(
                "{\"id\":%d,\"code\":%d,\"name\":\"%s\",\"year\":%d," +
                        "\"semester\":%d,\"credits\":%d,\"duration\":%d,\"avgRating\":%s}",
                course.getId(), course.getCode(), course.getName(), course.getYear(),
                course.getSemester(), course.getCredits(), course.getDuration(),
                course.getAvgRating() == null ? "null" : course.getAvgRating()
        );
    }

    private String announcementToJson(Announcement a) {
        return String.format(
                "{\"id\":%d,\"courseId\":%d,\"title\":\"%s\",\"content\":\"%s\"," +
                        "\"author\":\"%s\",\"createdAt\":\"%s\"}",
                a.getId(), a.getcourseId(), a.getTitle(), a.getContent(),
                a.getAuthor(), a.getCreatedAt().toString()
        );
    }

    private String feedbackToJson(Feedback f) {
        return String.format(
                "{\"id\":%d,\"courseId\":%d,\"studentId\":%s,\"teacher\":\"%s\"," +
                        "\"ratingContent\":%d,\"ratingInstructor\":%d,\"ratingLms\":%d," +
                        "\"comment\":\"%s\",\"isAnonymous\":%b,\"createdAt\":\"%s\",\"updatedAt\":\"%s\"}",
                f.getId(), f.getCourseId(),
                f.getStudentId() == null ? "null" : f.getStudentId().toString(),
                f.getTeacher(), f.getRatingContent(), f.getRatingInstructor(), f.getRatingLms(),
                f.getComment(), f.isAnonymous(),
                f.getCreatedAt().toString(), f.getUpdatedAt().toString()
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
            }

            if (i < list.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }
}