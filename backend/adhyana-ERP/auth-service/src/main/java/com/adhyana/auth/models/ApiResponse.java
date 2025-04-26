package com.adhyana.auth.models;

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
        json.append("\"message\":\"").append(escapeJson(message)).append("\"");

        if (data != null) {
            json.append(",\"data\":");
            if (data instanceof TokenResponse) {
                TokenResponse tr = (TokenResponse) data;
                json.append("{\"token\":\"").append(tr.getToken())
                        .append("\",\"role\":\"").append(tr.getRole()).append("\"}");
            } else if (data instanceof User) {
                User user = (User) data;
                json.append("{\"role\":\"").append(user.getRole()).append("\"");
                if (user.getUserId() != null) {
                    json.append(",\"userId\":\"").append(user.getUserId()).append("\"");
                }
                json.append("}");
            } else if (data instanceof String) {
                json.append("\"").append(escapeJson((String) data)).append("\"");
            } else {
                json.append("null");
            }
        } else {
            json.append(",\"data\":null");
        }

        json.append("}");
        return json.toString();
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}