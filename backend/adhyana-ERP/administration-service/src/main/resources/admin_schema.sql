-- Create the administration service database
CREATE DATABASE IF NOT EXISTS adhyana_admin;
USE adhyana_admin;

-- Staff table
CREATE TABLE staff (
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
CREATE TABLE staff_roles (
                             id INT PRIMARY KEY AUTO_INCREMENT,
                             staff_id INT NOT NULL,
                             role VARCHAR(50) NOT NULL,
                             assigned_date DATE NOT NULL,
                             FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE, -- Added ON DELETE CASCADE
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payroll table
CREATE TABLE payroll (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         staff_id INT NOT NULL,
                         salary_month DATE NOT NULL, -- Changed to DATE for representing the month (e.g., 'YYYY-MM-01')
                         basic_salary DECIMAL(10,2) NOT NULL,
                         allowances DECIMAL(10,2),
                         deductions DECIMAL(10,2),
                         net_salary DECIMAL(10,2) NOT NULL,
                         payment_status ENUM('PENDING', 'PROCESSED', 'PAID') DEFAULT 'PENDING',
                         payment_date DATE,
                         FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE, -- Added ON DELETE CASCADE
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Batch table
CREATE TABLE batches (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         batch_name VARCHAR(50) NOT NULL,
                         start_date DATE,
                         end_date DATE,
                         course_id INT, -- Assuming this might relate to a separate 'courses' table (not defined here)
                         capacity INT,
                         status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Batch-Faculty assignments table
CREATE TABLE batch_faculty_assignments (
                                           id INT PRIMARY KEY AUTO_INCREMENT,
                                           batch_id INT NOT NULL,
                                           staff_id INT NOT NULL,
                                           subject VARCHAR(100),
                                           assignment_date DATE NOT NULL,
                                           end_date DATE,
                                           status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
                                           FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE, -- Added ON DELETE CASCADE
                                           FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE, -- Added ON DELETE CASCADE
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE announcements (
                               id INT PRIMARY KEY AUTO_INCREMENT,
                               title VARCHAR(200) NOT NULL,
                               content TEXT NOT NULL,
                               category ENUM('GENERAL', 'ACADEMIC', 'EMERGENCY') DEFAULT 'GENERAL',
                               posted_by INT,
                               valid_from DATE,
                               valid_until DATE,
                               status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
                               FOREIGN KEY (posted_by) REFERENCES staff(id) ON DELETE SET NULL, -- Changed to SET NULL
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Academic Calendar table
CREATE TABLE academic_calendar (
                                   id INT PRIMARY KEY AUTO_INCREMENT,
                                   event_title VARCHAR(200) NOT NULL,
                                   description TEXT,
                                   event_date DATE NOT NULL,
                                   event_type ENUM('HOLIDAY', 'EXAM', 'ADMISSION', 'OTHER') NOT NULL,
                                   created_by INT,
                                   FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL, -- Changed to SET NULL
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data Insertion --

-- Insert into staff table
INSERT INTO staff (first_name, last_name, email, phone, department, position, hire_date, status) VALUES
                                                                                                     ('Aruna', 'Perera', 'aruna.p@adhyana.lk', '0771234567', 'Administration', 'Admin Officer', '2022-08-15', 'ACTIVE'),
                                                                                                     ('Bimal', 'Silva', 'bimal.s@adhyana.lk', '0719876543', 'Academics', 'Lecturer', '2021-05-20', 'ACTIVE'),
                                                                                                     ('Chandra', 'Fernando', 'chandra.f@adhyana.lk', '0765554321', 'Academics', 'Senior Lecturer', '2019-11-01', 'ACTIVE'),
                                                                                                     ('Dilhani', 'Gamage', 'dilhani.g@adhyana.lk', '0701122334', 'Finance', 'Accountant', '2023-01-10', 'ACTIVE'),
                                                                                                     ('Eshan', 'Jayawardena', 'eshan.j@adhyana.lk', '0758877665', 'IT Support', 'IT Technician', '2023-06-01', 'ACTIVE'),
                                                                                                     ('Fathima', 'Rizwan', 'fathima.r@adhyana.lk', '0723344556', 'Academics', 'Assistant Lecturer', '2024-02-15', 'ACTIVE'),
                                                                                                     ('Gamini', 'Herath', 'gamini.h@adhyana.lk', '0784455667', 'Administration', 'Registrar', '2018-03-01', 'INACTIVE'); -- Example of an inactive staff member

-- Insert into staff_roles table
-- Assuming Aruna (1) is Admin, Bimal (2) is Faculty, Chandra (3) is Senior Faculty, Dilhani (4) is Finance Staff, Eshan (5) is IT Staff, Fathima (6) is Faculty, Gamini (7) was Registrar
INSERT INTO staff_roles (staff_id, role, assigned_date) VALUES
                                                            (1, 'ADMIN', '2022-08-15'),
                                                            (2, 'FACULTY', '2021-05-20'),
                                                            (3, 'FACULTY', '2019-11-01'),
                                                            (3, 'ACADEMIC_HEAD', '2022-01-01'), -- Chandra got an additional role
                                                            (4, 'FINANCE', '2023-01-10'),
                                                            (5, 'IT_SUPPORT', '2023-06-01'),
                                                            (6, 'FACULTY', '2024-02-15'),
                                                            (7, 'ADMIN', '2018-03-01'); -- Gamini's old role

-- Insert into payroll table
-- Payroll for April 2025 (assuming payment processed end of April)
INSERT INTO payroll (staff_id, salary_month, basic_salary, allowances, deductions, net_salary, payment_status, payment_date) VALUES
                                                                                                                                 (1, '2025-04-01', 60000.00, 5000.00, 2500.00, 62500.00, 'PROCESSED', NULL),
                                                                                                                                 (2, '2025-04-01', 85000.00, 7000.00, 4000.00, 88000.00, 'PROCESSED', NULL),
                                                                                                                                 (3, '2025-04-01', 120000.00, 10000.00, 6000.00, 124000.00, 'PAID', '2025-04-30'),
                                                                                                                                 (4, '2025-04-01', 70000.00, 4000.00, 3000.00, 71000.00, 'PAID', '2025-04-30'),
                                                                                                                                 (5, '2025-04-01', 55000.00, 3000.00, 2000.00, 56000.00, 'PENDING', NULL),
                                                                                                                                 (6, '2025-04-01', 75000.00, 5000.00, 3500.00, 76500.00, 'PENDING', NULL);
-- No payroll for inactive staff (Gamini - 7)

-- Insert into batches table
INSERT INTO batches (batch_name, start_date, end_date, course_id, capacity, status) VALUES
                                                                                        ('CS-2024-F', '2024-02-15', '2025-02-14', 101, 50, 'ACTIVE'), -- Assuming course_id 101 is Computer Science Full Time
                                                                                        ('BM-2023-P', '2023-09-01', '2025-08-31', 205, 40, 'ACTIVE'), -- Assuming course_id 205 is Business Management Part Time
                                                                                        ('ENG-2023-F', '2023-03-01', '2024-02-28', 310, 60, 'COMPLETED'), -- Assuming course_id 310 is Engineering Full Time
                                                                                        ('IT-2024-SUM', '2024-06-01', '2024-08-31', 102, 30, 'CANCELLED'); -- Assuming course_id 102 is IT Summer Course

-- Insert into batch_faculty_assignments table
-- Assigning faculty to active batches
INSERT INTO batch_faculty_assignments (batch_id, staff_id, subject, assignment_date, end_date, status) VALUES
                                                                                                           (1, 2, 'Introduction to Programming', '2024-02-15', '2024-06-30', 'ACTIVE'), -- Bimal teaching in CS-2024-F
                                                                                                           (1, 3, 'Data Structures and Algorithms', '2024-07-01', '2024-12-15', 'ACTIVE'), -- Chandra teaching in CS-2024-F
                                                                                                           (1, 6, 'Database Management Systems', '2025-01-10', '2025-02-14', 'ACTIVE'), -- Fathima teaching in CS-2024-F
                                                                                                           (2, 3, 'Principles of Management', '2023-09-01', '2024-02-28', 'COMPLETED'), -- Chandra taught in BM-2023-P (completed subject)
                                                                                                           (2, 2, 'Marketing Fundamentals', '2024-03-01', '2024-08-31', 'ACTIVE'); -- Bimal teaching in BM-2023-P

-- Insert into announcements table
INSERT INTO announcements (title, content, category, posted_by, valid_from, valid_until, status) VALUES
                                                                                                     ('Mid-Semester Break', 'The mid-semester break for all active batches will be from 2025-05-05 to 2025-05-09. Classes will resume on 2025-05-12.', 'ACADEMIC', 1, '2025-04-21', '2025-05-12', 'PUBLISHED'), -- Posted by Aruna (Admin)
                                                                                                     ('Upcoming Workshop on AI', 'A workshop on "Introduction to Artificial Intelligence" will be held on 2025-05-20. Registration details will follow.', 'GENERAL', 3, '2025-04-20', '2025-05-21', 'PUBLISHED'), -- Posted by Chandra (Senior Lecturer)
                                                                                                     ('System Maintenance', 'Please note that the student portal will be down for maintenance on 2025-04-25 from 10 PM to 12 AM.', 'GENERAL', 5, '2025-04-22', '2025-04-26', 'DRAFT'); -- Draft by Eshan (IT)

-- Insert into academic_calendar table
INSERT INTO academic_calendar (event_title, description, event_date, event_type, created_by) VALUES
                                                                                                 ('Labour Day', 'Public Holiday', '2025-05-01', 'HOLIDAY', 1), -- Created by Aruna (Admin)
                                                                                                 ('Mid-Semester Exam Week (CS-2024-F)', 'Mid-semester examinations for the CS-2024-F batch.', '2025-06-16', 'EXAM', 3), -- Created by Chandra (Academic Head)
                                                                                                 ('Vesak Full Moon Poya Day', 'Public Holiday', '2025-05-14', 'HOLIDAY', 1),
                                                                                                 ('Admission Deadline - Fall 2025 Intake', 'Last date to submit applications for the Fall 2025 intake.', '2025-07-31', 'ADMISSION', 1),
                                                                                                 ('Faculty Development Workshop', 'Workshop on new teaching methodologies.', '2025-05-28', 'OTHER', 3);

-- Create indexes for better query performance
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_payroll_staff_month ON payroll(staff_id, salary_month);
CREATE INDEX idx_batch_faculty ON batch_faculty_assignments(batch_id, staff_id);
CREATE INDEX idx_announcements_dates ON announcements(valid_from, valid_until);
CREATE INDEX idx_calendar_date ON academic_calendar(event_date);