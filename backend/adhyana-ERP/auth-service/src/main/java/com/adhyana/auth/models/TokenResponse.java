// auth-service/src/main/java/com/adhyana/auth/models/TokenResponse.java
package com.adhyana.auth.models;

public class TokenResponse {
    private String token;
    private String role;
    private String userId;

    public TokenResponse(String token, String role, String userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getUserId() { return userId; }
}