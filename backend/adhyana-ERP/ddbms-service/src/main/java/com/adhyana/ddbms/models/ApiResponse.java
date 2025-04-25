package com.adhyana.ddbms.models;

/**
 * Model class representing a standardized API response format
 * @param <T> The type of data contained in the response
 */
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    /**
     * Constructor with all fields
     */
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    /**
     * Converts this object to a JSON string
     * @return JSON string representation of this object
     */
    public String toJson() {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"success\":").append(success).append(",");
        json.append("\"message\":\"").append(escapeJsonString(message)).append("\",");
        json.append("\"data\":");

        if (data == null) {
            json.append("null");
        } else if (data instanceof String) {
            json.append("\"").append(escapeJsonString((String) data)).append("\"");
        } else if (data instanceof Number || data instanceof Boolean) {
            json.append(data);
        } else {
            // For complex objects, use toString() which should be overridden to provide JSON
            json.append(data.toString());
        }

        json.append("}");
        return json.toString();
    }

    /**
     * Escapes special characters in a JSON string
     */
    private String escapeJsonString(String input) {
        if (input == null) {
            return "";
        }

        StringBuilder result = new StringBuilder();

        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);

            switch (ch) {
                case '\\':
                    result.append("\\\\");
                    break;
                case '"':
                    result.append("\\\"");
                    break;
                case '\b':
                    result.append("\\b");
                    break;
                case '\f':
                    result.append("\\f");
                    break;
                case '\n':
                    result.append("\\n");
                    break;
                case '\r':
                    result.append("\\r");
                    break;
                case '\t':
                    result.append("\\t");
                    break;
                default:
                    result.append(ch);
            }
        }

        return result.toString();
    }
}