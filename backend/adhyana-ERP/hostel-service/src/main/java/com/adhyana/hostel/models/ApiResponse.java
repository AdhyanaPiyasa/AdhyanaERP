package com.adhyana.hostel.models;

// Import Gson
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;
import java.sql.Timestamp;
import java.sql.Date;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    // Gson instance for JSON serialization/deserialization
    private transient static final Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss") // Handle Timestamp
            .create();

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Converts this ApiResponse object to its JSON representation using Gson.
     * @return JSON string.
     */
    public String toJson() {
        // Gson handles the serialization of this object, including nested data (List, Hostel, etc.)
        return gson.toJson(this);
    }

    // Static helper method to convert any object to JSON (useful elsewhere)
    public static String toJson(Object object) {
        return gson.toJson(object);
    }

    // Getters (remain the same)
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}