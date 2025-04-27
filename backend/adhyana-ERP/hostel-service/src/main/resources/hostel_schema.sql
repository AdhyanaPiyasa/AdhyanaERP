-- ==============================================================
-- Schema for Hostel Management Service (adhyana_hostel)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS adhyana_hostel;
USE adhyana_hostel;

-- Shared Table: Students (Reference Only - Data managed by Admin/DDBMS)
-- This ensures referential integrity if possible, otherwise handled by application logic.
-- Consider using the DDBMS connection if available.
CREATE TABLE IF NOT EXISTS students (
                                        student_index INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    batch_id VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Hostel Information Table
CREATE TABLE IF NOT EXISTS hostels (
                                       hostel_id INT PRIMARY KEY AUTO_INCREMENT,
                                       name VARCHAR(100) NOT NULL UNIQUE,
    capacity INT NOT NULL DEFAULT 0,
    occupancy INT NOT NULL DEFAULT 0,
    gender ENUM('Male', 'Female', 'Mixed') NOT NULL,
    assistant_name VARCHAR(100),
    wifi BOOLEAN DEFAULT FALSE,
    kitchen BOOLEAN DEFAULT FALSE,
    laundry BOOLEAN DEFAULT FALSE,
    study_area BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Hostel Applications Table
CREATE TABLE IF NOT EXISTS hostel_applications (
                                                   application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                   student_index INT NOT NULL,
                                                   application_date DATE NOT NULL DEFAULT (CURDATE()),
    status ENUM('Pending', 'Approved', 'Rejected', 'Waitlisted') NOT NULL DEFAULT 'Pending',
    preferred_hostel_id INT NULL, -- Optional preference
    notes TEXT NULL, -- For admin comments on rejection/waitlisting
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE, -- Link to student
    FOREIGN KEY (preferred_hostel_id) REFERENCES hostels(hostel_id) ON DELETE SET NULL,
    UNIQUE KEY uk_student_application (student_index) -- Ensure one active application per student
    );

-- Hostel Assignments Table (Tracks current residents)
CREATE TABLE IF NOT EXISTS hostel_assignments (
                                                  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
                                                  student_index INT NOT NULL UNIQUE, -- Each student can only have one active assignment
                                                  hostel_id INT NOT NULL,
    -- room_number VARCHAR(10) NULL, -- Add if managing specific rooms later
                                                  assigned_date DATE NOT NULL DEFAULT (CURDATE()),
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active', -- To track current vs past residents
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE, -- Link to student
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE -- If hostel removed, assignment invalid
    );

-- Sample Data --
INSERT INTO hostels (name, capacity, gender, assistant_name, wifi, kitchen, laundry, study_area) VALUES
                                                                                                     ('Block G (Girls)', 40, 'Female', 'Ms. Perera', TRUE, FALSE, TRUE, TRUE),
                                                                                                     ('Block H (Boys)', 50, 'Male', 'Mr. Silva', TRUE, TRUE, TRUE, TRUE),
                                                                                                     ('Block J (Mixed)', 30, 'Mixed', 'Mr. Fernando', FALSE, FALSE, TRUE, FALSE);

-- Insert sample student reference (assuming student 20240002 exists)
INSERT INTO students (student_index, registration_number, name, email, gender) VALUES
                                                                (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'Female');

-- Insert sample application
INSERT INTO hostel_applications (student_index, preferred_hostel_id) VALUES
                                                                (20240002, (SELECT hostel_id FROM hostels WHERE name = 'Block G (Girls)'));