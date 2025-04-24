CREATE DATABASE IF NOT EXISTS adhyana_auth;
USE adhyana_auth;

CREATE TABLE IF NOT EXISTS users (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES
                                                 ('admin', 'nqzva123', 'ADMIN'),
                                                 ('teacher1', 'grnpure123', 'TEACHER'),
                                                 ('student1', 'fghqrag123', 'STUDENT'),
                                                 ('parent1', 'cnerag123', 'PARENT');