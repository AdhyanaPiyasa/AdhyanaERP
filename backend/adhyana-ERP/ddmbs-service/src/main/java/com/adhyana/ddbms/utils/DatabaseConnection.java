package com.adhyana.ddbms.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Utility class for managing database connections to the DDBMS database
 */
public class DatabaseConnection {
    private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());
    private static final String URL = "jdbc:mysql://localhost:3306/adhyana_ddbms";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            LOGGER.info("MySQL driver loaded successfully");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "Failed to load MySQL driver", e);
            throw new RuntimeException("Failed to load MySQL driver", e);
        }
    }

    /**
     * Get a database connection to the DDBMS database
     * @return A connection to the DDBMS database
     * @throws SQLException If a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        try {
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            LOGGER.fine("Database connection established");
            return conn;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to establish database connection", e);
            throw e;
        }
    }
}