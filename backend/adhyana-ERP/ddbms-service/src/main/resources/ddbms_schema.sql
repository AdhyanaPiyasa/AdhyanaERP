-- =============================================
-- ADHYANA DDBMS SCHEMA
-- Purpose: Central schema and metadata for DDBMS service
-- =============================================

CREATE DATABASE IF NOT EXISTS adhyana_ddbms;
USE adhyana_ddbms;

-- ================ DDBMS METADATA TABLES ================

-- Table to store service information (endpoints for propagation)
CREATE TABLE IF NOT EXISTS services (
                                        service_id INT PRIMARY KEY AUTO_INCREMENT,
                                        service_name VARCHAR(50) NOT NULL UNIQUE,
                                        endpoint_url VARCHAR(255) NOT NULL,
    -- api_key VARCHAR(100) NULL, -- API key for sending requests *to* the service if needed
                                        active BOOLEAN DEFAULT TRUE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table to store table mappings (which services need updates for which tables)
CREATE TABLE IF NOT EXISTS table_mappings (
                                              mapping_id INT PRIMARY KEY AUTO_INCREMENT,
                                              table_name VARCHAR(100) NOT NULL,
                                              service_id INT NOT NULL, -- service that needs updates for this table
    -- is_primary BOOLEAN DEFAULT FALSE, -- Indicates if this service is the primary owner (optional metadata)
                                              FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE,
                                              INDEX idx_table_name (table_name), -- Index for faster lookup
                                              UNIQUE KEY unique_table_service (table_name, service_id)
);

-- ================ MERGED SCHEMA FROM ALL SERVICES ================
-- Execute the schema creation scripts from ALL other services here
-- to create the tables within the adhyana_ddbms database.
-- Example placeholders:

-- == FROM adhyana_admin ==
CREATE TABLE IF NOT EXISTS staff (
                                     staff_id INT PRIMARY KEY AUTO_INCREMENT,
                                     name VARCHAR(100) NOT NULL,
                                     email VARCHAR(100) UNIQUE NOT NULL,
                                     phone VARCHAR(20),
                                     department VARCHAR(50),
                                     position VARCHAR(50),
                                     hire_date DATE,
                                     status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
                                       course_id VARCHAR(10) PRIMARY KEY,
                                       name VARCHAR(100) NOT NULL,
                                       year INT NOT NULL,
                                       credits INT NOT NULL,
                                       duration INT NOT NULL,
                                       avg_rating DECIMAL(3,2) DEFAULT NULL,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batches (
                                       batch_id VARCHAR(10) PRIMARY KEY,
                                       batch_name VARCHAR(50) NOT NULL UNIQUE,
                                       start_date DATE,
                                       end_date DATE,
                                       capacity INT,
                                       status ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_courses (
                                             batch_id VARCHAR(10) NOT NULL,
                                             course_id VARCHAR(10) NOT NULL,
                                             FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             PRIMARY KEY (batch_id, course_id)
);

CREATE TABLE IF NOT EXISTS students (
                                        student_index INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        gender ENUM('Male', 'Female', 'Other'), -- Removed NOT NULL constraint if it comes from application
                                        hostel_required BOOLEAN DEFAULT FALSE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS student_applications (
                                                    student_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                    name VARCHAR(100) NOT NULL,
                                                    national_id VARCHAR(20) NOT NULL UNIQUE,
                                                    email VARCHAR(100) NOT NULL UNIQUE,
                                                    phone VARCHAR(20) NOT NULL,
                                                    gender VARCHAR(10) NOT NULL,
                                                    date_of_birth DATE NOT NULL,
                                                    address TEXT NOT NULL,
                                                    applied_program VARCHAR(100) NOT NULL,
                                                    application_date DATE NOT NULL,
                                                    mathematics VARCHAR(5) NOT NULL,
                                                    science VARCHAR(5) NOT NULL,
                                                    english VARCHAR(5) NOT NULL,
                                                    computer_studies VARCHAR(5) NOT NULL,
                                                    guardian_name VARCHAR(100) NOT NULL,
                                                    guardian_national_id VARCHAR(20) NOT NULL,
                                                    guardian_relation VARCHAR(20) NOT NULL,
                                                    guardian_contact_number VARCHAR(20) NOT NULL,
                                                    guardian_email VARCHAR(100),
                                                    hostel_required VARCHAR(5),
                                                    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_applications (
                                                   hostel_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                   student_index INT NOT NULL,
                                                   application_date DATE NOT NULL DEFAULT (CURDATE()),
                                                   status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                   FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payroll (
                                       payroll_id INT PRIMARY KEY AUTO_INCREMENT,
                                       staff_id INT NOT NULL,
                                       salary_month DATE NOT NULL,
                                       basic_salary DECIMAL(12,2) NOT NULL,
                                       allowances DECIMAL(12,2) DEFAULT 0.00,
                                       deductions DECIMAL(12,2) DEFAULT 0.00,
                                       net_salary DECIMAL(12,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
                                       payment_status ENUM('PENDING', 'PROCESSED', 'PAID', 'FAILED') DEFAULT 'PENDING',
                                       payment_date DATE NULL,
                                       notes TEXT NULL,
                                       FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE RESTRICT,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       UNIQUE KEY uk_staff_month (staff_id, salary_month)
);

CREATE TABLE IF NOT EXISTS announcements (
                                             announcement_id INT PRIMARY KEY AUTO_INCREMENT,
                                             title VARCHAR(200) NOT NULL,
                                             content TEXT NOT NULL,
                                             category ENUM('GENERAL', 'ACADEMIC', 'ADMINISTRATIVE', 'EMERGENCY', 'EVENTS') DEFAULT 'GENERAL',
                                             posted_by INT NULL,
                                             target_audience ENUM('ALL', 'STUDENTS', 'STAFF', 'BATCH') DEFAULT 'ALL',
                                             target_batch_id VARCHAR(10) NULL,
                                             valid_from DATETIME NULL,
                                             valid_until DATETIME NULL,
                                             status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'EXPIRED') DEFAULT 'DRAFT',
                                             FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL,
                                             FOREIGN KEY (target_batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_calendar (
                                                 event_id INT PRIMARY KEY AUTO_INCREMENT,
                                                 event_title VARCHAR(200) NOT NULL,
                                                 description TEXT,
                                                 start_date DATE NOT NULL,
                                                 end_date DATE NULL,
                                                 event_type ENUM('HOLIDAY', 'EXAM_PERIOD', 'ADMISSION', 'REGISTRATION', 'BREAK', 'EVENT', 'DEADLINE', 'OTHER') NOT NULL,
                                                 created_by INT NULL,
                                                 FOREIGN KEY (created_by) REFERENCES staff(staff_id) ON DELETE SET NULL,
                                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- == FROM adhyana_student ==
-- Note: students, courses, applications are already defined above from adhyana_admin
CREATE TABLE IF NOT EXISTS attendance (
                                          attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                                          student_index INT NOT NULL,
                                          course_id VARCHAR(10) NOT NULL, -- Match type in courses table
                                          date DATE NOT NULL,
                                          present BOOLEAN DEFAULT FALSE,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                          UNIQUE KEY (student_index, course_id, date)
);

CREATE TABLE IF NOT EXISTS scholarships (
                                            scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
                                            name VARCHAR(100) NOT NULL UNIQUE,
                                            description TEXT,
                                            min_gpa DOUBLE NOT NULL,
                                            amount DECIMAL(10,2) NOT NULL,
                                            application_deadline DATE NOT NULL,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scholarship_applications (
                                                        scholarship_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                        student_index INT NOT NULL,
                                                        scholarship_id INT NOT NULL,
                                                        student_batch VARCHAR(20) NULL,
                                                        student_degree VARCHAR(50) NULL,
                                                        student_gpa DOUBLE NOT NULL,
                                                        status ENUM('Pending','Approved','Rejected') NOT NULL ,
                                                        comments TEXT,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                        FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

-- == FROM adhyana_course ==
-- Note: courses, students, staff, batches already defined
CREATE TABLE IF NOT EXISTS semesters (
                                         semester_id VARCHAR(20) PRIMARY KEY, -- Increased length
                                         batch_id VARCHAR(10) NOT NULL,
                                         course_id VARCHAR(10) NOT NULL,
                                         staff_id INT NULL,
                                         academic_year SMALLINT NOT NULL,
                                         semester_num TINYINT CHECK (semester_num BETWEEN 1 AND 2),
                                         start_date DATE NULL,
                                         end_date DATE NULL,
                                         status ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
                                         FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                         FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS feedbacks (
                                         feedback_id INT PRIMARY KEY AUTO_INCREMENT,
                                         course_id VARCHAR(10) NOT NULL,
                                         semester_id VARCHAR(20) NULL,
                                         student_index INT NULL,
                                         rating_content TINYINT CHECK (rating_content BETWEEN 1 AND 5),
                                         rating_instructor TINYINT CHECK (rating_instructor BETWEEN 1 AND 5),
                                         rating_materials TINYINT CHECK (rating_materials BETWEEN 1 AND 5),
                                         rating_lms TINYINT CHECK (rating_lms BETWEEN 1 AND 5),
                                         comment TEXT,
                                         is_anonymous BOOLEAN DEFAULT FALSE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                         FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL,
                                         FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS course_announcements (
                                                    course_announcement_id INT PRIMARY KEY AUTO_INCREMENT,
                                                    course_id VARCHAR(10) NOT NULL,
                                                    semester_id VARCHAR(20) NULL,
                                                    title VARCHAR(200) NOT NULL,
                                                    content TEXT NOT NULL,
                                                    posted_by INT NULL,
                                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                                    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL,
                                                    FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- == FROM adhyana_exam ==
-- Note: courses, students, semesters already defined
CREATE TABLE IF NOT EXISTS exams (
                                     exam_id INT PRIMARY KEY AUTO_INCREMENT,
                                     title VARCHAR(100) NOT NULL,
                                     semester_id VARCHAR(20) NOT NULL,
                                     exam_date DATE NOT NULL,
                                     start_time TIME NOT NULL,
                                     end_time TIME NOT NULL,
                                     location VARCHAR(50) NOT NULL,
                                     type ENUM('Midterm', 'Final', 'Quiz', 'Lab', 'Other') DEFAULT 'Other',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
                                           assignment_id INT PRIMARY KEY AUTO_INCREMENT,
                                           title VARCHAR(100) NOT NULL,
                                           course_id VARCHAR(10) NOT NULL,
                                           semester_id VARCHAR(20) NOT NULL,
                                           type ENUM('Homework', 'Project', 'Quiz', 'Lab Report', 'Presentation', 'Online', 'Inclass') NOT NULL,
                                           due_date DATE NOT NULL,
                                           due_time TIME NULL,
                                           max_marks INT NULL,
                                           description TEXT NULL,
                                           posted_by INT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                           FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                           FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                           FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS grades (
                                      grade_id INT PRIMARY KEY AUTO_INCREMENT,
                                      student_index INT NOT NULL,
                                      course_id VARCHAR(10) NOT NULL,
                                      semester_id VARCHAR(20) NOT NULL,
                                      component_id INT NOT NULL,
                                      component_type ENUM('EXAM', 'ASSIGNMENT') NOT NULL,
                                      marks_obtained DECIMAL(5,2) NULL,
                                      grade VARCHAR(5) NULL,
                                      feedback TEXT NULL,
                                      graded_by INT NULL,
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                      FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                      FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                      FOREIGN KEY (graded_by) REFERENCES staff(staff_id) ON DELETE SET NULL,
                                      UNIQUE KEY uk_student_component (student_index, component_id, component_type)
);

CREATE TABLE IF NOT EXISTS generated_reports (
                                                 report_id INT PRIMARY KEY AUTO_INCREMENT,
                                                 report_type VARCHAR(50) NOT NULL,
                                                 generated_for_type ENUM('STUDENT', 'BATCH', 'COURSE', 'SEMESTER') NULL,
                                                 generated_for_id VARCHAR(20) NULL,
                                                 generated_by INT NULL,
                                                 generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 FOREIGN KEY (generated_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- == FROM adhyana_auth ==
CREATE TABLE IF NOT EXISTS users (
                                     user_id INT PRIMARY KEY AUTO_INCREMENT,
                                     username VARCHAR(50) NOT NULL UNIQUE,
                                     password VARCHAR(100) NOT NULL, -- Store hashed passwords
                                     role VARCHAR(20) NOT NULL,
                                     user_external_id VARCHAR(50), -- Link to staff_id or student_index
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================ INITIAL DDBMS METADATA ================

-- Insert service information (Adjust URLs and API keys as needed)
-- The endpoint_url here should be the URL *within* each service that listens for sync updates.
INSERT INTO services (service_name, endpoint_url, active) VALUES
                                                              ('student-service', 'http://localhost:8083/api/sync', TRUE),
                                                              ('course-service', 'http://localhost:8084/api/sync', TRUE),
                                                              ('exam-service', 'http://localhost:8085/api/sync', TRUE),
                                                              ('administration-service', 'http://localhost:8086/api/sync', TRUE),
                                                              ('auth-service', 'http://localhost:8082/api/sync', TRUE)
ON DUPLICATE KEY UPDATE endpoint_url=VALUES(endpoint_url), active=VALUES(active);

-- Define table mappings (Which service needs updates for which table?)
-- Example: Student updates need to go to Course and Exam services
DELETE FROM table_mappings; -- Clear existing mappings before inserting

-- Student table updates go to:
INSERT INTO table_mappings (table_name, service_id) VALUES ('students', (SELECT service_id FROM services WHERE service_name='course-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('students', (SELECT service_id FROM services WHERE service_name='exam-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('students', (SELECT service_id FROM services WHERE service_name='administration-service')); -- Admin needs student info too
INSERT INTO table_mappings (table_name, service_id) VALUES ('students', (SELECT service_id FROM services WHERE service_name='auth-service')); -- Auth might need student info

-- Course table updates go to:
INSERT INTO table_mappings (table_name, service_id) VALUES ('courses', (SELECT service_id FROM services WHERE service_name='student-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('courses', (SELECT service_id FROM services WHERE service_name='exam-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('courses', (SELECT service_id FROM services WHERE service_name='administration-service')); -- Admin needs course info

-- Add other necessary mappings based on your requirements
-- Example: Staff updates might need to go to Course Service if staff are lecturers
INSERT INTO table_mappings (table_name, service_id) VALUES ('staff', (SELECT service_id FROM services WHERE service_name='course-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('staff', (SELECT service_id FROM services WHERE service_name='exam-service')); -- If staff are examiners/graders

-- Example: Exam/Assignment updates might go to student service (e.g., for student dashboards)
INSERT INTO table_mappings (table_name, service_id) VALUES ('exams', (SELECT service_id FROM services WHERE service_name='student-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('assignments', (SELECT service_id FROM services WHERE service_name='student-service'));
INSERT INTO table_mappings (table_name, service_id) VALUES ('grades', (SELECT service_id FROM services WHERE service_name='student-service'));

-- Make sure all services that *keep a copy* of a table are listed in table_mappings for that table.