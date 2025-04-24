-- Create the DDBMS database
CREATE DATABASE IF NOT EXISTS adhyana_ddbms;
USE adhyana_ddbms;

-- Table to store service information
CREATE TABLE IF NOT EXISTS services (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        service_name VARCHAR(50) NOT NULL UNIQUE,
                                        endpoint_url VARCHAR(255) NOT NULL,
                                        api_key VARCHAR(100) NOT NULL,
                                        active BOOLEAN DEFAULT TRUE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table to store table mappings (which tables belong to which services)
CREATE TABLE IF NOT EXISTS table_mappings (
                                              id INT PRIMARY KEY AUTO_INCREMENT,
                                              table_name VARCHAR(100) NOT NULL,
                                              service_id INT NOT NULL,
                                              is_primary BOOLEAN DEFAULT FALSE, -- Indicates if this service is the primary owner
                                              FOREIGN KEY (service_id) REFERENCES services(id),
                                              UNIQUE KEY unique_table_service (table_name, service_id)
);

-- Table to track sync operations
CREATE TABLE IF NOT EXISTS sync_operations (
                                               id INT PRIMARY KEY AUTO_INCREMENT,
                                               source_service_id INT NOT NULL,
                                               target_service_id INT,
                                               table_name VARCHAR(100) NOT NULL,
                                               record_id INT NOT NULL,
                                               operation_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
                                               status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
                                               error_message TEXT,
                                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               completed_at TIMESTAMP NULL,
                                               FOREIGN KEY (source_service_id) REFERENCES services(id),
                                               FOREIGN KEY (target_service_id) REFERENCES services(id)
);

-- Insert service information
INSERT INTO services (service_name, endpoint_url, api_key, active) VALUES
                                                                       ('student-service', 'http://localhost:8083/api/sync', 'student-service-api-key', TRUE),
                                                                       ('administration-service', 'http://localhost:8087/api/sync', 'admin-service-api-key', TRUE),
                                                                       ('course-service', 'http://localhost:8084/api/sync', 'course-service-api-key', TRUE),
                                                                       ('exam-service', 'http://localhost:8085/api/sync', 'exam-service-api-key', TRUE),
                                                                       ('auth-service', 'http://localhost:8082/api/sync', 'auth-service-api-key', TRUE);

-- Define table mappings
-- Student Service Tables
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
                                                                    ('students', 1, TRUE),
                                                                    ('attendance', 1, TRUE),
                                                                    ('course_sessions', 1, TRUE),
                                                                    ('scholarships', 1, TRUE),
                                                                    ('scholarship_applications', 1, TRUE);

-- Administration Service Tables
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
                                                                    ('staff', 2, TRUE),
                                                                    ('staff_roles', 2, TRUE),
                                                                    ('payroll', 2, TRUE),
                                                                    ('batches', 2, TRUE),
                                                                    ('batch_faculty_assignments', 2, TRUE),
                                                                    ('announcements', 2, TRUE),
                                                                    ('academic_calendar', 2, TRUE);

-- Course Service Tables
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
                                                                    ('courses', 3, TRUE),
                                                                    ('teachers', 3, TRUE),
                                                                    ('feedbacks', 3, TRUE),
                                                                    ('batch_courses', 3, TRUE),
                                                                    ('student_courses', 3, TRUE);

-- Add Course Service as secondary for students
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
    ('students', 3, FALSE);

-- Exam Service Tables
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
                                                                    ('exams', 4, TRUE),
                                                                    ('assignments', 4, TRUE),
                                                                    ('grades', 4, TRUE),
                                                                    ('reports', 4, TRUE);

-- Add Exam Service as secondary for students
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
    ('students', 4, FALSE);

-- Auth Service Tables
INSERT INTO table_mappings (table_name, service_id, is_primary) VALUES
    ('users', 5, TRUE);

-- This script should be executed AFTER all the other schema scripts from individual services
-- have been executed, since we need to create copies of their tables in the central DDBMS

-- STUDENT SERVICE TABLES

-- Students table
CREATE TABLE IF NOT EXISTS students (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        degree_id VARCHAR(50) NOT NULL,
                                        degree_program VARCHAR(100) NOT NULL,
                                        index_number VARCHAR(20) NOT NULL UNIQUE,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        mobile_number VARCHAR(20),
                                        birth_date DATE NOT NULL,
                                        state VARCHAR(50) NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
                                          id INT PRIMARY KEY AUTO_INCREMENT,
                                          student_id INT NOT NULL,
                                          course_code VARCHAR(20) NOT NULL,
                                          date DATE NOT NULL,
                                          present BOOLEAN DEFAULT FALSE,
                                          remarks VARCHAR(255),
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          UNIQUE KEY unique_attendance (student_id, course_code, date)
);

-- Course sessions table
CREATE TABLE IF NOT EXISTS course_sessions (
                                               id INT PRIMARY KEY AUTO_INCREMENT,
                                               course_code VARCHAR(20) NOT NULL,
                                               course_name VARCHAR(100) NOT NULL,
                                               date DATE NOT NULL,
                                               total_students INT DEFAULT 0,
                                               present_students INT DEFAULT 0,
                                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                               UNIQUE KEY unique_session (course_code, date)
);

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
                                            id INT PRIMARY KEY AUTO_INCREMENT,
                                            name VARCHAR(100) NOT NULL,
                                            description TEXT,
                                            min_gpa DOUBLE NOT NULL,
                                            amount DECIMAL(10,2) NOT NULL,
                                            application_deadline DATE NOT NULL,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Scholarship applications table
CREATE TABLE IF NOT EXISTS scholarship_applications (
                                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                                        student_id INT UNIQUE,
                                                        scholarship_id INT NOT NULL,
                                                        studentBatch VARCHAR(20) NOT NULL,
                                                        studentDegree VARCHAR(50) NOT NULL,
                                                        studentGPA DOUBLE NOT NULL,
                                                        status ENUM('Pending','Approved','Rejected') NOT NULL,
                                                        comments TEXT,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ADMINISTRATION SERVICE TABLES

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     first_name VARCHAR(50) NOT NULL,
                                     last_name VARCHAR(50) NOT NULL,
                                     email VARCHAR(100) UNIQUE NOT NULL,
                                     phone VARCHAR(15),
                                     department VARCHAR(50),
                                     position VARCHAR(50),
                                     hire_date DATE,
                                     status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff roles table
CREATE TABLE IF NOT EXISTS staff_roles (
                                           id INT PRIMARY KEY AUTO_INCREMENT,
                                           staff_id INT NOT NULL,
                                           role VARCHAR(50) NOT NULL,
                                           assigned_date DATE NOT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       staff_id INT NOT NULL,
                                       salary_month DATE NOT NULL,
                                       basic_salary DECIMAL(10,2) NOT NULL,
                                       allowances DECIMAL(10,2),
                                       deductions DECIMAL(10,2),
                                       net_salary DECIMAL(10,2) NOT NULL,
                                       payment_status ENUM('PENDING', 'PROCESSED', 'PAID') DEFAULT 'PENDING',
                                       payment_date DATE,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Batch table
CREATE TABLE IF NOT EXISTS batches (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       batch_name VARCHAR(50) NOT NULL,
                                       start_date DATE,
                                       end_date DATE,
                                       course_id INT,
                                       capacity INT,
                                       status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Batch-Faculty assignments table
CREATE TABLE IF NOT EXISTS batch_faculty_assignments (
                                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                                         batch_id INT NOT NULL,
                                                         staff_id INT NOT NULL,
                                                         subject VARCHAR(100),
                                                         assignment_date DATE NOT NULL,
                                                         end_date DATE,
                                                         status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
                                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
                                             id INT PRIMARY KEY AUTO_INCREMENT,
                                             title VARCHAR(200) NOT NULL,
                                             content TEXT NOT NULL,
                                             category ENUM('GENERAL', 'ACADEMIC', 'EMERGENCY') DEFAULT 'GENERAL',
                                             posted_by INT,
                                             valid_from DATE,
                                             valid_until DATE,
                                             status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Academic Calendar table
CREATE TABLE IF NOT EXISTS academic_calendar (
                                                 id INT PRIMARY KEY AUTO_INCREMENT,
                                                 event_title VARCHAR(200) NOT NULL,
                                                 description TEXT,
                                                 event_date DATE NOT NULL,
                                                 event_type ENUM('HOLIDAY', 'EXAM', 'ADMISSION', 'OTHER') NOT NULL,
                                                 created_by INT,
                                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- COURSE SERVICE TABLES

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
                                        id INT PRIMARY KEY AUTO_INCREMENT,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) UNIQUE NOT NULL,
                                        phone VARCHAR(15),
                                        department VARCHAR(100),
                                        designation VARCHAR(50),
                                        joined_at DATE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       code INT NOT NULL UNIQUE,
                                       name VARCHAR(100) NOT NULL,
                                       semester VARCHAR(20) NOT NULL,
                                       credits INT NOT NULL,
                                       teacher VARCHAR(100) NOT NULL,
                                       duration INT NOT NULL,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                         courseId INT NOT NULL,
                                         studentId INT,
                                         teacher VARCHAR(100) NOT NULL,
                                         rating_content TINYINT CHECK (rating_content BETWEEN 1 AND 5),
                                         rating_instructor TINYINT CHECK (rating_instructor BETWEEN 1 AND 5),
                                         rating_lms TINYINT CHECK (rating_lms BETWEEN 1 AND 5),
                                         comment TEXT,
                                         is_anonymous BOOLEAN DEFAULT FALSE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Batch courses table
CREATE TABLE IF NOT EXISTS batch_courses (
                                             id INT PRIMARY KEY AUTO_INCREMENT,
                                             batch_id INT NOT NULL,
                                             course_id INT NOT NULL,
                                             semester VARCHAR(10),
                                             academic_year VARCHAR(10),
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student courses table
CREATE TABLE IF NOT EXISTS student_courses (
                                               id INT PRIMARY KEY AUTO_INCREMENT,
                                               student_id INT NOT NULL,
                                               course_id INT NOT NULL,
                                               enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXAM SERVICE TABLES

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     title VARCHAR(100) NOT NULL,
                                     course VARCHAR(100) NOT NULL,
                                     course_code INT NOT NULL,
                                     date DATE NOT NULL,
                                     start_time VARCHAR(50) NOT NULL,
                                     end_time VARCHAR(50) NOT NULL,
                                     room VARCHAR(20) NOT NULL,
                                     teacher VARCHAR(100) NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
                                           Aid INT PRIMARY KEY AUTO_INCREMENT,
                                           title VARCHAR(100) NOT NULL,
                                           course VARCHAR(100) NOT NULL,
                                           course_code INT NOT NULL,
                                           type VARCHAR(100) NOT NULL,
                                           date DATE NOT NULL,
                                           start_time VARCHAR(50) NOT NULL,
                                           end_time VARCHAR(50) NOT NULL,
                                           room VARCHAR(20) NOT NULL,
                                           teacher VARCHAR(100) NOT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
                                      Gid INT PRIMARY KEY AUTO_INCREMENT,
                                      Index_No INT NOT NULL,
                                      Name VARCHAR(100) NOT NULL,
                                      courseCode INT NOT NULL,
                                      courseName VARCHAR(100) NOT NULL,
                                      grade VARCHAR(100) NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
                                       reportId INT PRIMARY KEY AUTO_INCREMENT,
                                       course_name VARCHAR(100) NOT NULL,
                                       exam_name VARCHAR(100) NOT NULL,
                                       name VARCHAR(100) NOT NULL,
                                       date DATE NOT NULL
);

-- AUTH SERVICE TABLES

-- Users table
CREATE TABLE IF NOT EXISTS users (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(50) NOT NULL UNIQUE,
                                     password VARCHAR(100) NOT NULL,
                                     role VARCHAR(20) NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);