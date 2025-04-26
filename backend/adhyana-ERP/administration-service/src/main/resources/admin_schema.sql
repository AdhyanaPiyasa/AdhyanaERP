-- =============================================
-- Schema: adhyana_admin
-- Purpose: Central administration, staff, core academic structures
-- =============================================
CREATE DATABASE IF NOT EXISTS adhyana_admin;
USE adhyana_admin;

-- Shared Table: Staff (Primary Source)
CREATE TABLE IF NOT EXISTS staff (
                                     staff_id INT PRIMARY KEY AUTO_INCREMENT,
                                     name VARCHAR(100) NOT NULL, -- Increased length slightly
                                     email VARCHAR(100) UNIQUE NOT NULL,
                                     phone VARCHAR(20), -- Increased length slightly
                                     department VARCHAR(50),
                                     position VARCHAR(50),
                                     hire_date DATE,
                                     status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shared Table: Courses (Primary Source)
CREATE TABLE IF NOT EXISTS courses (
                                       course_id VARCHAR(10) PRIMARY KEY, -- Slightly increased length for flexibility
                                       name VARCHAR(100) NOT NULL,
                                       year INT NOT NULL,
                                       credits INT NOT NULL,
                                       duration INT NOT NULL, -- Duration in hours or standard units
                                       avg_rating DECIMAL(3,2) DEFAULT NULL,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shared Table: Batches (Primary Source)
CREATE TABLE IF NOT EXISTS batches (
                                       batch_id VARCHAR(10) PRIMARY KEY, -- Slightly increased length for flexibility
                                       batch_name VARCHAR(50) NOT NULL UNIQUE, -- Added unique constraint
                                       start_date DATE,
                                       end_date DATE,
                                       capacity INT,
                                       status ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED', -- Added 'PLANNED'
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shared Table: Batch Courses (Junction Table - Primary Source)
CREATE TABLE IF NOT EXISTS batch_courses (
                                             batch_id VARCHAR(10) NOT NULL,
                                             course_id VARCHAR(10) NOT NULL,
                                             FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             PRIMARY KEY (batch_id, course_id)
);

-- Shared Table: Students (Primary Source)
CREATE TABLE IF NOT EXISTS students (
                                        student_index INT PRIMARY KEY, -- Using INT as it seems to be numeric identifier
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL, -- Can be null initially, assigned later
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL ON UPDATE CASCADE -- Student remains if batch deleted
);

-- Shared Table: Student Applications (Primary Source)
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

-- Shared Table: Hostel Applications (Primary Source)
CREATE TABLE IF NOT EXISTS hostel_applications (
                                                   hostel_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                   student_index INT NOT NULL, -- References the student who is ALREADY accepted/registered
                                                   application_date DATE NOT NULL DEFAULT (CURDATE()),
                                                   status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Consider ENUM ('Pending', 'Approved', 'Rejected', 'Waitlisted')
                                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                   FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE -- If student leaves, hostel app is irrelevant
);

-- Admin Specific: Payroll
CREATE TABLE IF NOT EXISTS payroll (
                                       payroll_id INT PRIMARY KEY AUTO_INCREMENT,
                                       staff_id INT NOT NULL,
                                       salary_month DATE NOT NULL, -- Represents the month (e.g., 'YYYY-MM-01')
                                       basic_salary DECIMAL(12,2) NOT NULL, -- Increased precision
                                       allowances DECIMAL(12,2) DEFAULT 0.00,
                                       deductions DECIMAL(12,2) DEFAULT 0.00,
                                       net_salary DECIMAL(12,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED, -- Calculate automatically
                                       payment_status ENUM('PENDING', 'PROCESSED', 'PAID', 'FAILED') DEFAULT 'PENDING', -- Added 'FAILED'
                                       payment_date DATE NULL,
                                       notes TEXT NULL, -- Added notes field
                                       FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE RESTRICT, -- Prevent deleting staff with payroll history? Or CASCADE? Let's use RESTRICT first.
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       UNIQUE KEY uk_staff_month (staff_id, salary_month) -- Ensure one payroll entry per staff per month
);

-- Admin Specific: Announcements (General/System-wide)
CREATE TABLE IF NOT EXISTS announcements (
                                             announcement_id INT PRIMARY KEY AUTO_INCREMENT,
                                             title VARCHAR(200) NOT NULL,
                                             content TEXT NOT NULL,
                                             category ENUM('GENERAL', 'ACADEMIC', 'ADMINISTRATIVE', 'EMERGENCY', 'EVENTS') DEFAULT 'GENERAL', -- Expanded categories
                                             posted_by INT NULL, -- Staff who posted
                                             target_audience ENUM('ALL', 'STUDENTS', 'STAFF', 'BATCH') DEFAULT 'ALL', -- Specify audience
                                             target_batch_id VARCHAR(10) NULL, -- If target_audience is BATCH
                                             valid_from DATETIME NULL, -- Changed to DATETIME
                                             valid_until DATETIME NULL, -- Changed to DATETIME
                                             status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'EXPIRED') DEFAULT 'DRAFT', -- Added EXPIRED
                                             FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL, -- Keep announcement if staff leaves
                                             FOREIGN KEY (target_batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Specific: Academic Calendar
CREATE TABLE IF NOT EXISTS academic_calendar (
                                                 event_id INT PRIMARY KEY AUTO_INCREMENT,
                                                 event_title VARCHAR(200) NOT NULL,
                                                 description TEXT,
                                                 start_date DATE NOT NULL,
                                                 end_date DATE NULL, -- For events spanning multiple days
                                                 event_type ENUM('HOLIDAY', 'EXAM_PERIOD', 'ADMISSION', 'REGISTRATION', 'BREAK', 'EVENT', 'DEADLINE', 'OTHER') NOT NULL, -- Expanded types
                                                 created_by INT NULL,
                                                 FOREIGN KEY (created_by) REFERENCES staff(staff_id) ON DELETE SET NULL,
                                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data Insertion (Primary Data - Admin Schema) --

-- Insert into staff table
INSERT INTO staff (staff_id, name, email, phone, department, position, hire_date, status) VALUES
                                                                                              (1, 'Aruna Perera', 'aruna.p@adhyana.lk', '0771234567', 'Administration', 'Admin Officer', '2022-08-15', 'ACTIVE'),
                                                                                              (2, 'Bimal Silva', 'bimal.s@adhyana.lk', '0719876543', 'Academics', 'Lecturer', '2021-05-20', 'ACTIVE'),
                                                                                              (3, 'Chandra Fernando', 'chandra.f@adhyana.lk', '0765554321', 'Academics', 'Senior Lecturer', '2019-11-01', 'ACTIVE'),
                                                                                              (4, 'Dilhani Gamage', 'dilhani.g@adhyana.lk', '0701122334', 'Finance', 'Accountant', '2023-01-10', 'ACTIVE'),
                                                                                              (5, 'Eshan Jayawardena', 'eshan.j@adhyana.lk', '0758877665', 'IT Support', 'IT Technician', '2023-06-01', 'ACTIVE'),
                                                                                              (6, 'Fathima Rizwan', 'fathima.r@adhyana.lk', '0723344556', 'Academics', 'Assistant Lecturer', '2024-02-15', 'ACTIVE'),
                                                                                              (7, 'Gamini Herath', 'gamini.h@adhyana.lk', '0784455667', 'Administration', 'Registrar', '2018-03-01', 'INACTIVE');

-- Insert sample courses
INSERT INTO courses (course_id, name, year, credits, duration, avg_rating) VALUES
                                                                               ('CS1101', 'Introduction to Programming', 1, 3, 45, NULL),
                                                                               ('CS2101', 'Data Structures', 1, 4, 60, NULL),
                                                                               ('ENG1001', 'Calculus I', 1, 3, 45, NULL),
                                                                               ('PHY1001', 'Physics I', 1, 4, 60, NULL),
                                                                               ('ENG1002', 'English Composition', 1, 3, 45, NULL),
                                                                               ('BM2001', 'Business Management Fundamentals', 2, 3, 45, NULL),
                                                                               ('IT3001', 'Database Systems', 2, 4, 60, NULL);

-- Insert sample batches
INSERT INTO batches (batch_id, batch_name, start_date, end_date, capacity, status) VALUES
                                                                                       ('CS24F', 'CS-2024-Fall', '2024-09-15', '2028-08-31', 50, 'ACTIVE'),
                                                                                       ('BM23S', 'BM-2023-Spring', '2023-02-01', '2027-01-31', 40, 'ACTIVE'),
                                                                                       ('ENG23F', 'ENG-2023-Fall', '2023-09-01', '2027-08-31', 60, 'COMPLETED'),
                                                                                       ('IT24X', 'IT-2024-Summer-Cancelled', '2024-06-01', '2024-08-31', 30, 'CANCELLED');

-- Link courses to batches
INSERT INTO batch_courses (batch_id, course_id) VALUES
                                                    ('CS24F', 'CS1101'), ('CS24F', 'CS2101'), ('CS24F', 'ENG1001'), ('CS24F', 'PHY1001'), ('CS24F', 'ENG1002'),
                                                    ('BM23S', 'BM2001'), ('BM23S', 'ENG1002'),
                                                    ('ENG23F', 'ENG1001'), ('ENG23F', 'PHY1001'), ('ENG23F', 'CS1101');

-- Insert sample student data
INSERT INTO students (index_number, registration_number, name, email, batch_id) VALUES
                                                                                    (20240001, '2024CS001','Janith Perera' ,'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                    (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'CS24F'),
                                                                                    (20230010, '2023BM010','Ravi Sharma' ,'ravi.s@student.adhyana.lk', 'BM23S');

-- Insert sample student applications
INSERT INTO student_applications (name, national_id, email, phone, gender, date_of_birth, address, applied_program, application_date, mathematics, science, english, computer_studies, guardian_name, guardian_national_id, guardian_relation, guardian_contact_number, guardian_email, hostel_required, status) VALUES
                                                                                                                                                                                                                                                                                                                     ('Raj Kumar', '9876543210V', 'raj.kumar@email.com', '0771234567', 'Male', '2005-06-15', '123 Main St, Colombo', 'Computer Science', '2024-03-20', 'A', 'B', 'A', 'A', 'Sanjay Kumar', '7654321098V', 'Father', '0777654321', 'sanjay.kumar@email.com', TRUE, 'Accepted'), -- Assuming accepted
                                                                                                                                                                                                                                                                                                                     ('Amara Silva', '9865432109V', 'amara.silva@email.com', '0761234567', 'Female', '2006-03-22', '456 Park Ave, Kandy', 'Information Systems', '2024-03-19', 'A', 'A', 'B', 'A', 'Nimal Silva', '7543210987V', 'Father', '0767654321', 'nimal.silva@email.com', FALSE, 'Pending');

-- Insert into payroll table (Sample for a past month)
INSERT INTO payroll (staff_id, salary_month, basic_salary, allowances, deductions, payment_status, payment_date) VALUES
                                                                                                                     (1, '2025-03-01', 60000.00, 5000.00, 2500.00, 'PAID', '2025-03-31'),
                                                                                                                     (2, '2025-03-01', 85000.00, 7000.00, 4000.00, 'PAID', '2025-03-31'),
                                                                                                                     (3, '2025-03-01', 120000.00, 10000.00, 6000.00, 'PAID', '2025-03-31'),
                                                                                                                     (4, '2025-03-01', 70000.00, 4000.00, 3000.00, 'PAID', '2025-03-31'),
                                                                                                                     (5, '2025-03-01', 55000.00, 3000.00, 2000.00, 'PAID', '2025-03-31'),
                                                                                                                     (6, '2025-03-01', 75000.00, 5000.00, 3500.00, 'PAID', '2025-03-31');

-- Insert into general announcements
INSERT INTO announcements (title, content, category, posted_by, target_audience, valid_from, valid_until, status) VALUES
                                                                                                                      ('Mid-Semester Break Dates', 'The mid-semester break for all active batches will be from 2025-05-19 to 2025-05-23. Classes resume on 2025-05-26.', 'ACADEMIC', 1, 'ALL', '2025-04-25 09:00:00', '2025-05-26 00:00:00', 'PUBLISHED'),
                                                                                                                      ('Upcoming Workshop on AI Ethics', 'An online workshop on "Ethical Considerations in AI" will be held on 2025-06-05. Registration details forthcoming.', 'EVENTS', 3, 'ALL', '2025-04-26 10:00:00', '2025-06-06 00:00:00', 'PUBLISHED'),
                                                                                                                      ('Portal Maintenance Schedule', 'Please note that the student/staff portal will undergo maintenance on 2025-04-28 from 11 PM to 1 AM (2025-04-29).', 'ADMINISTRATIVE', 5, 'ALL', '2025-04-26 11:00:00', '2025-04-29 01:00:00', 'DRAFT'); -- Still Draft

-- Insert into academic_calendar
INSERT INTO academic_calendar (event_title, description, start_date, end_date, event_type, created_by) VALUES
                                                                                                           ('Labour Day', 'Public Holiday. Institute Closed.', '2025-05-01', NULL, 'HOLIDAY', 1),
                                                                                                           ('Mid-Semester Exam Period (Tentative)', 'Mid-semester examinations for Year 1/Semester 2.', '2025-06-16', '2025-06-20', 'EXAM_PERIOD', 3),
                                                                                                           ('Vesak Full Moon Poya Day', 'Public Holiday. Institute Closed.', '2025-05-14', NULL, 'HOLIDAY', 1),
                                                                                                           ('Admission Deadline - Fall 2025 Intake', 'Last date to submit applications for the Fall 2025 intake.', '2025-07-31', NULL, 'DEADLINE', 1),
                                                                                                           ('Faculty Development Workshop', 'Workshop on modern assessment techniques.', '2025-05-28', NULL, 'EVENT', 3);