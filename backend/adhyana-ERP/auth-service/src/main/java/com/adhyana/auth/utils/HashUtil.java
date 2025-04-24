// auth-service/src/main/java/com/adhyana/auth/utils/HashUtil.java
package com.adhyana.auth.utils;

public class HashUtil {
    public static String hashPassword(String input) {
        if (input == null) return null;

        StringBuilder output = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                output.append((char) ('a' + (c - 'a' + 13) % 26));
            } else if (c >= 'A' && c <= 'Z') {
                output.append((char) ('A' + (c - 'A' + 13) % 26));
            } else {
                output.append(c);
            }
        }
        return output.toString();
    }
}