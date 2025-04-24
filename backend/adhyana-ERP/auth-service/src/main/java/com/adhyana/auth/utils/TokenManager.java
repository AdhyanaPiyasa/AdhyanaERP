// auth-service/src/main/java/com/adhyana/auth/utils/TokenManager.java
package com.adhyana.auth.utils;

import com.adhyana.auth.models.User;
import java.util.Base64;

public class TokenManager {
    private static final String SECRET_KEY = "your-secret-key";
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

    public static String generateToken(User user) {
        // Simple JWT-like token: header.payload.signature
        long timestamp = System.currentTimeMillis();
        String header = Base64.getEncoder().encodeToString("{\"alg\":\"ROT13\"}".getBytes());
        String payload = Base64.getEncoder().encodeToString(
                String.format("{\"id\":%d,\"username\":\"%s\",\"role\":\"%s\",\"exp\":%d}",
                                user.getId(), user.getUsername(), user.getRole(), timestamp + EXPIRATION_TIME)
                        .getBytes());
        String signature = HashUtil.hashPassword(header + "." + payload + SECRET_KEY);

        return header + "." + payload + "." + Base64.getEncoder().encodeToString(signature.getBytes());
    }

    public static String getRoleFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String payload = new String(Base64.getDecoder().decode(parts[1]));
            return payload.split("\"role\":\"")[1].split("\"")[0];
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            // Verify signature
            String signature = new String(Base64.getDecoder().decode(parts[2]));
            String expectedSignature = HashUtil.hashPassword(parts[0] + "." + parts[1] + SECRET_KEY);
            if (!signature.equals(expectedSignature)) return false;

            // Verify expiration
            String payload = new String(Base64.getDecoder().decode(parts[1]));
            String expStr = payload.split("\"exp\":")[1].split("}")[0];
            long expiration = Long.parseLong(expStr);

            return System.currentTimeMillis() < expiration;
        } catch (Exception e) {
            return false;
        }
    }
}