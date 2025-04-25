// student-service/src/main/java/com/adhyana/student/utils/DatabaseConnection.java
package com.adhyana.student.utils;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/adhyana_student";
    private static String USER;
    private static String PASSWORD;

    static {
        try {
            // Load database driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Load credentials from properties file
            loadCredentials();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Failed to load MySQL driver", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load database credentials", e);
        }
    }

    private static void loadCredentials() throws Exception {
        Properties prop = new Properties();
        try (InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                throw new Exception("Unable to find application.properties");
            }
            prop.load(input);
            USER = prop.getProperty("db.user");
            PASSWORD = prop.getProperty("db.password");

            if (USER == null || PASSWORD == null) {
                throw new Exception("Database credentials not found in application.properties");
            }
        }
    }

    public static Connection getConnection() throws Exception {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}