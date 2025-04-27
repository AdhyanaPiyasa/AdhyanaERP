
package com.adhyana.announcement.utils;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DatabaseConnection {
    private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());
    private static String DB_URL;
    private static String DB_USER;
    private static String DB_PASSWORD;
    private static boolean driverLoaded = false;

    static {
        try {
            LOGGER.info("Loading Hostel DB configuration...");
            Properties prop = new Properties();
            try (InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
                if (input == null) {
                    LOGGER.severe("Unable to find application.properties");
                    throw new RuntimeException("Unable to find application.properties");
                }
                prop.load(input);
                DB_URL = prop.getProperty("db.url");
                DB_USER = prop.getProperty("db.user");
                DB_PASSWORD = prop.getProperty("db.password");

                if (DB_URL == null || DB_USER == null || DB_PASSWORD == null) {
                    LOGGER.severe("Hostel DB credentials not fully configured.");
                    throw new RuntimeException("Hostel DB credentials not fully configured.");
                }
                LOGGER.info("Hostel DB URL loaded: " + DB_URL);
            }

            LOGGER.info("Loading MySQL JDBC driver...");
            Class.forName("com.mysql.cj.jdbc.Driver");
            driverLoaded = true;
            LOGGER.info("MySQL JDBC driver loaded successfully.");

        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "Failed to load MySQL driver", e);
            throw new RuntimeException("Failed to load MySQL driver", e);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load hostel DB configuration", e);
            throw new RuntimeException("Failed to load hostel DB configuration", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            throw new SQLException("JDBC Driver not loaded.");
        }
        LOGGER.fine("Attempting to establish hostel DB connection to " + DB_URL);
        Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        if (connection != null && !connection.isClosed()) {
            LOGGER.fine("Hostel DB connection established.");
        } else {
            LOGGER.warning("Failed to establish hostel DB connection.");
        }
        return connection;
    }
}