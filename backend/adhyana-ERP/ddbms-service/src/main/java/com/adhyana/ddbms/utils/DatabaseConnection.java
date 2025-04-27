package com.adhyana.ddbms.utils;

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
            LOGGER.info("Loading DDBMS database configuration...");
            Properties prop = new Properties();
            // Ensure the path matches how resources are loaded in your environment
            try (InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
                if (input == null) {
                    LOGGER.severe("Unable to find application.properties in classpath");
                    throw new RuntimeException("Unable to find application.properties");
                }
                prop.load(input);
                DB_URL = prop.getProperty("db.url"); // Ensure property name matches
                DB_USER = prop.getProperty("db.user");
                DB_PASSWORD = prop.getProperty("db.password");

                if (DB_URL == null || DB_USER == null || DB_PASSWORD == null) {
                    LOGGER.severe("Database credentials (db.url, db.user, db.password) not fully configured in application.properties");
                    throw new RuntimeException("Database credentials not fully configured in application.properties");
                }
                LOGGER.info("Database URL loaded: " + DB_URL);
            }

            // Load database driver
            LOGGER.info("Loading MySQL JDBC driver...");
            Class.forName("com.mysql.cj.jdbc.Driver");
            driverLoaded = true;
            LOGGER.info("MySQL JDBC driver loaded successfully.");

        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "Failed to load MySQL driver", e);
            throw new RuntimeException("Failed to load MySQL driver", e);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load database configuration", e);
            throw new RuntimeException("Failed to load database configuration", e);
        }
    }

    public static Connection getConnection() throws Exception {
        if (!driverLoaded) {
            throw new SQLException("JDBC Driver not loaded.");
        }
        LOGGER.fine("Attempting to establish database connection to " + DB_URL);
        Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        if (connection != null && !connection.isClosed()) {
            LOGGER.fine("Database connection established successfully.");
        } else {
            LOGGER.warning("Failed to establish database connection.");
        }
        return connection;
    }
}