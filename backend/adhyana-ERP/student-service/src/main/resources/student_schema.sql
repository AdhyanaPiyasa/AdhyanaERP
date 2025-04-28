-- =============================================
-- Schema: adhyana_student
-- Purpose: Student-specific data like attendance, scholarships
-- =============================================

CREATE DATABASE IF NOT EXISTS adhyana_student;
USE adhyana_student;

-- Shared Table: Students (Reference Only - Data Managed by Admin)
CREATE TABLE IF NOT EXISTS students (
                                        student_index INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- No FK here to avoid cross-db constraints, app logic ensures consistency
);

-- Shared Table: Enrolled_Students
CREATE TABLE IF NOT EXISTS enrolled_students (
                                                 student_index INT PRIMARY KEY, -- Removed AUTO_INCREMENT to match students table
                                                 registration_number VARCHAR(20) NOT NULL UNIQUE,
                                                 batch_id VARCHAR(10) NULL,
                                                 name VARCHAR(100) NOT NULL,
                                                 national_id VARCHAR(20) NOT NULL UNIQUE,
                                                 email VARCHAR(100) NOT NULL UNIQUE,
                                                 phone VARCHAR(20) NOT NULL,
                                                 gender VARCHAR(10) NOT NULL,
                                                 date_of_birth DATE NOT NULL,
                                                 address TEXT NOT NULL,
                                                 guardian_name VARCHAR(100) NOT NULL,
                                                 guardian_national_id VARCHAR(20) NOT NULL,
                                                 guardian_relation VARCHAR(20) NOT NULL,
                                                 guardian_contact_number VARCHAR(20) NOT NULL,
                                                 guardian_email VARCHAR(100),
                                                 hostel_required VARCHAR(5),
                                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                 FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE
);

-- Shared Table: Batches (Reference Only - Data Managed by Admin)
CREATE TABLE IF NOT EXISTS batches (
                                       batch_id VARCHAR(10) PRIMARY KEY,
                                       batch_name VARCHAR(50) NOT NULL UNIQUE,
                                       start_date DATE,
                                       end_date DATE,
                                       status ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
                                         semester_id VARCHAR(5) PRIMARY KEY,
                                         batch_id VARCHAR(10) NOT NULL,
                                         academic_year SMALLINT NOT NULL,
                                         semester_num TINYINT NOT NULL CHECK (semester_num BETWEEN 1 AND 2),
                                         start_date DATE NOT NULL,
                                         end_date DATE NOT NULL,
                                         status ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE
);

-- Shared Table: Courses (Reference Only - Data Managed by Admin/Course Service)
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

-- Shared Table: Student Applications (Reference Only - Data Managed by Admin)
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

-- Shared Table: Hostel Applications (Reference Only - Data Managed by Admin)
CREATE TABLE IF NOT EXISTS hostel_applications (
                                                   hostel_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                   student_index INT NOT NULL,
                                                   application_date DATE NOT NULL DEFAULT (CURDATE()),
                                                   status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                   FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE
);

-- Student Specific: Attendance
CREATE TABLE IF NOT EXISTS attendance (
                                          attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                                          student_index INT NOT NULL,
                                          course_id VARCHAR(20) NOT NULL,
                                          date DATE NOT NULL,
                                          present BOOLEAN DEFAULT FALSE,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                          UNIQUE KEY (student_index, course_id, date)
);

-- Student Specific: Scholarships Master List
CREATE TABLE IF NOT EXISTS scholarships (
                                            scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
                                            name VARCHAR(100) NOT NULL,
                                            description TEXT,
                                            min_gpa DOUBLE NOT NULL,
                                            amount DECIMAL(10,2) NOT NULL,
                                            application_deadline DATE NOT NULL,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student Specific: Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarship_applications (
                                                        scholarship_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                        student_index INT NOT NULL,
                                                        scholarship_id INT NOT NULL,
                                                        student_batch VARCHAR(20) NULL,
                                                        student_degree VARCHAR(50) NULL,
                                                        student_gpa DOUBLE NOT NULL,
                                                        status ENUM('Pending','Approved','Rejected') NOT NULL,
                                                        comments TEXT,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                        FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_semester_courses (
                                                        student_index INT NOT NULL,
                                                        semester_id VARCHAR(5) NOT NULL,
                                                        course_id VARCHAR(10) NOT NULL,
                                                        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        PRIMARY KEY (student_index, semester_id, course_id),
                                                        FOREIGN KEY (student_index) REFERENCES students(student_index) ON DELETE CASCADE,
                                                        FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                                        FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- =============================================
-- Insert batches data
-- =============================================
INSERT INTO batches (batch_id, batch_name, start_date, end_date, status) VALUES
                                                                             ('CS24F', 'CS-2024-Fall', '2024-09-15', '2028-08-31', 'ACTIVE'),
                                                                             ('BM23S', 'BM-2023-Spring', '2023-02-01', '2027-01-31', 'ACTIVE');

-- =============================================
-- Insert semesters data (missing in original schema)
-- =============================================
INSERT INTO semesters (semester_id, batch_id, academic_year, semester_num, start_date, end_date, status) VALUES
                                                                                                             ('y24s1', 'CS24F', 2024, 1, '2024-09-15', '2025-01-31', 'ONGOING'),
                                                                                                             ('y24s2', 'CS24F', 2024, 2, '2025-02-01', '2025-06-30', 'PLANNED'),
                                                                                                             ('y25s1', 'CS24F', 2025, 1, '2025-09-01', '2026-01-31', 'PLANNED');

-- =============================================
-- Insert courses data
-- =============================================
INSERT INTO courses (course_id, name, year, credits, duration) VALUES
                                                                   ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                                   ('CS2101', 'Data Structures', 1, 4, 60),
                                                                   ('ENG1001', 'Calculus I', 1, 3, 45);

-- =============================================
-- Insert students data with consistent IDs
-- =============================================
INSERT INTO students (student_index, registration_number, name, email, batch_id) VALUES
                                                                                     (2024001, '2024CS001', 'Janith Perera', 'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                     (2024002, '2024CS002', 'Aisha Khan', 'aisha.k@student.adhyana.lk', 'CS24F'),
                                                                                     (2023010, '2023BM010', 'Ravi Sharma', 'ravi.s@student.adhyana.lk', 'BM23S');

-- =============================================
-- Insert enrolled_students data with matching student_index
-- =============================================
INSERT INTO enrolled_students (student_index, registration_number, batch_id, name, national_id, email, phone, gender, date_of_birth, address, guardian_name, guardian_national_id, guardian_relation, guardian_contact_number, guardian_email, hostel_required) VALUES
                                                                                                                                                                                                                                                                    (2024001, '2024CS001', 'CS24F', 'Janith Perera', '19980515234V', 'janith.p@student.adhyana.lk', '0771234567', 'Male', '1998-05-15', '123 Main Street, Colombo', 'Kamal Perera', '19701020567V', 'Father', '0719876543', 'kamal.p@example.com', 'No'),
                                                                                                                                                                                                                                                                    (2024002, '2024CS002', 'CS24F', 'Aisha Khan', '20001102876V', 'aisha.k@student.adhyana.lk', '0765432109', 'Female', '2000-11-02', '45 Flower Road, Kandy', 'Farah Khan', '19750318901V', 'Mother', '0721122334', 'farah.k@example.com', 'Yes'),
                                                                                                                                                                                                                                                                    (2023010, '2023BM010', 'BM23S', 'Ravi Sharma', '19990728123V', 'ravi.s@student.adhyana.lk', '0759876543', 'Male', '1999-07-28', '78 Lake View Avenue, Galle', 'Priya Sharma', '19730905432V', 'Mother', '0705556667', 'priya.s@example.com', 'No');

-- =============================================
-- Insert student_semester_courses data with consistent student_index values
-- =============================================
INSERT INTO student_semester_courses (student_index, semester_id, course_id) VALUES
                                                                                 (2024001, 'y24s1', 'CS1101'),
                                                                                 (2024001, 'y24s2', 'ENG1001'),
                                                                                 (2024002, 'y25s1', 'CS2101'),
                                                                                 (2023010, 'y24s1', 'CS1101'),
                                                                                 (2024002, 'y24s1', 'CS1101');

-- =============================================
-- Insert attendance data with consistent student_index values
-- =============================================
INSERT INTO attendance (student_index, course_id, date, present) VALUES
                                                                     (2024001, 'CS1101', '2025-04-15', true),
                                                                     (2024001, 'CS1101', '2025-04-17', true),
                                                                     (2024002, 'CS1101', '2025-04-15', false),
                                                                     (2024001, 'ENG1001', '2025-04-16', true);

-- =============================================
-- Insert scholarships data
-- =============================================
INSERT INTO scholarships (name, description, min_gpa, amount, application_deadline) VALUES
                                                                                        ('Merit Scholarship', 'Scholarship for students with excellent academic performance in Year 1', 3.7, 50000.00, '2025-08-31'),
                                                                                        ('Academic Excellence Scholarship', 'For students maintaining outstanding academic performance (overall)', 3.8, 80000.00, '2025-08-31'),
                                                                                        ('Financial Need Bursary', 'For students requiring financial assistance (proof required)', 3.0, 30000.00, '2025-07-15'),
                                                                                        ('Leadership Award', 'For students demonstrating significant leadership qualities', 3.5, 40000.00, '2025-08-15');

-- =============================================
-- Insert scholarship_applications data with consistent student_index values
-- =============================================
INSERT INTO scholarship_applications (student_index, scholarship_id, student_batch, student_degree, student_gpa, status, comments) VALUES
                                                                                                                                       (2024001, 1, 'CS24F', 'Computer Science', 3.85, 'Pending', 'Attaching Year 1 results transcript.'),
                                                                                                                                       (2024002, 3, 'CS24F', 'Computer Science', 3.60, 'Pending', 'Submitting financial need documentation separately.');