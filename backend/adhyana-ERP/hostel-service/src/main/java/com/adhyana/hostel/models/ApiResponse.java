package com.adhyana.hostel.models;
import com.google.gson.Gson;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Converts this ApiResponse object to its JSON representation using Gson.
     *
     * @param gson A Gson instance (ideally pre-configured if needed).
     * @return The JSON string representation of this object.
     */
    public String toJson(Gson gson) {
        // Gson handles serialization of nested objects (data) automatically
        return gson.toJson(this);
    }

    // --- Getters --- (Keep these)
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}