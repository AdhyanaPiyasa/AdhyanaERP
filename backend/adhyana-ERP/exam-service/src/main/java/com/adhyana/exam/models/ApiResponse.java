package com.adhyana.exam.models;

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
            if (data instanceof Exam) {
                json.append(examToJson((Exam) data));
            } else if (data instanceof java.util.List) {
                json.append(listToJson((java.util.List<?>) data));
            } else if (data instanceof Assignment) {
                json.append(assignmentToJson((Assignment) data));
            } else if (data instanceof Grades) {
                json.append(gradesToJson((Grades) data));
            } else if (data instanceof Reports) {
                json.append(reportsToJson((Reports) data));
            } else {
                json.append("null");
            }
        }

        json.append("}");
        return json.toString();
    }

    private String examToJson(Exam exam) {
        return String.format(
                "{\"id\":%d,\"title\":\"%s\",\"course\":\"%s\",\"courseCode\":%d," +
                        "\"date\":\"%s\",\"startTime\":\"%s\",\"endTime\":\"%s\"," +
                        "\"room\":\"%s\",\"teacher\":\"%s\"}",
                exam.getId(), exam.getTitle(), exam.getCourse(), exam.getCourseCode(),
                exam.getDate(), exam.getStartTime(), exam.getEndTime(),
                exam.getRoom(), exam.getTeacher()
        );
    }

    private String assignmentToJson(Assignment assignment) {
        return String.format(
                "{\"id\":%d,\"title\":\"%s\",\"course\":\"%s\",\"courseCode\":%d,\"type\":\"%s\"," +
                        "\"date\":\"%s\",\"startTime\":\"%s\",\"endTime\":\"%s\"," +
                        "\"room\":\"%s\",\"teacher\":\"%s\"}",
                assignment.getId(), assignment.getTitle(), assignment.getCourse(), assignment.getCourseCode(),
                assignment.getType(), assignment.getDate(), assignment.getStartTime(), assignment.getEndTime(),
                assignment.getRoom(), assignment.getTeacher()
        );
    }

    private String gradesToJson(Grades grades) {
        return String.format(
                "{\"Gid\":%d,\"Index_No\":\"%s\",\"Name\":\"%s\",\"courseCode\":%d," +
                        "\"courseName\":\"%s\",\"grade\":\"%s\"}",
                grades.getGid(), grades.getIndex_No(), grades.getName(), grades.getCourseCode(),
                grades.getCourseName(), grades.getGrade()
        );
    }

    private String reportsToJson(Reports reports) {
        return String.format(
                "{\"reportId\":%d,\"coursename\":\"%s\",\"examname\":\"%s\",\"name\":\"%s\",\"date\":\"%s\"}",
                reports.getReportId(), reports.getCoursename(), reports.getExamname(), reports.getName(), reports.getDate()
        );
    }

    private String listToJson(java.util.List<?> list) {
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) instanceof Exam) {
                json.append(examToJson((Exam) list.get(i)));
            } else if (list.get(i) instanceof Assignment) {
                json.append(assignmentToJson((Assignment) list.get(i)));
            } else if (list.get(i) instanceof Grades) {
                json.append(gradesToJson((Grades) list.get(i)));
            } else if (list.get(i) instanceof Reports) {
                json.append(reportsToJson((Reports) list.get(i)));
            }
            if (i < list.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }
}