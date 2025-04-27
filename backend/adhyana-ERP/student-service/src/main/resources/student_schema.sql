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
                                                 student_index INT PRIMARY KEY AUTO_INCREMENT,
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
                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
                                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- No FK here to avoid cross-db constraints
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
                                                        student_index INT NOT NULL, -- Changed from VARCHAR, Removed UNIQUE
                                                        scholarship_id INT NOT NULL,
                                                        student_batch VARCHAR(20) NULL, -- Denormalized for convenience, but can get from student_index
                                                        student_degree VARCHAR(50) NULL, -- Denormalized
                                                        student_gpa DOUBLE NOT NULL, -- GPA at time of application
                                                        status ENUM('Pending','Approved','Rejected') NOT NULL ,
                                                        comments TEXT,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

-- Sample Data Insertion (Student Schema) --

-- Re-insert sample student/course data (for reference, assuming not live linked)
INSERT INTO students (student_index, registration_number, name, email, batch_id) VALUES
                                                                                    (20240001, '2024CS001','Janith Perera' ,'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                    (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'CS24F'),
                                                                                    (20230010, '2023BM010','Ravi Sharma' ,'ravi.s@student.adhyana.lk', 'BM23S')
ON DUPLICATE KEY UPDATE student_index=student_index; -- Avoid error if already exists


-- Sample data to enrolled_students table
INSERT INTO enrolled_students (registration_number, batch_id, name, national_id, email, phone, gender, date_of_birth, address, guardian_name, guardian_national_id, guardian_relation, guardian_contact_number, guardian_email, hostel_required) VALUES
        ('2024CS001', 'CS24F', 'Janith Perera', '19980515234V', 'janith.p@student.adhyana.lk', '0771234567', 'Male', '1998-05-15', '123 Main Street, Colombo', 'Kamal Perera', '19701020567V', 'Father', '0719876543', 'kamal.p@example.com', 'No'),
        ('2024CS002', 'CS24F', 'Aisha Khan', '20001102876V', 'aisha.k@student.adhyana.lk', '0765432109', 'Female', '2000-11-02', '45 Flower Road, Kandy', 'Farah Khan', '19750318901V', 'Mother', '0721122334', 'farah.k@example.com', 'Yes'),
        ('2023BM010', 'BM23S', 'Ravi Sharma', '19990728123V', 'ravi.s@student.adhyana.lk', '0759876543', 'Male', '1999-07-28', '78 Lake View Avenue, Galle', 'Priya Sharma', '19730905432V', 'Mother', '0705556667', 'priya.s@example.com', 'No');



INSERT INTO courses (course_id, name, year, credits, duration) VALUES
                                                                   ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                                   ('CS2101', 'Data Structures', 1, 4, 60),
                                                                   ('ENG1001', 'Calculus I', 1, 3, 45)
ON DUPLICATE KEY UPDATE course_id=course_id; -- Avoid error if already exists

-- Insert sample attendance data
INSERT INTO attendance (student_index, course_id, date, present) VALUES
                                                                             (20240001, 'CS1101', '2025-04-15', true),
                                                                             (20240001, 'CS1101', '2025-04-17', true),
                                                                             (20240002, 'CS1101', '2025-04-15', false),
                                                                             (20240001, 'ENG1001', '2025-04-16', true);

-- Insert sample scholarships
INSERT INTO scholarships (scholarship_id, name, description, min_gpa, amount, application_deadline) VALUES
                                                                                                        (1, 'Merit Scholarship', 'Scholarship for students with excellent academic performance in Year 1', 3.7, 50000.00, '2025-08-31'),
                                                                                                        (2, 'Academic Excellence Scholarship', 'For students maintaining outstanding academic performance (overall)', 3.8, 80000.00, '2025-08-31'),
                                                                                                        (3, 'Financial Need Bursary', 'For students requiring financial assistance (proof required)', 3.0, 30000.00, '2025-07-15'),
                                                                                                        (4, 'Leadership Award', 'For students demonstrating significant leadership qualities', 3.5, 40000.00, '2025-08-15');

-- Insert sample scholarship application data
INSERT INTO scholarship_applications (student_index, scholarship_id, student_batch, student_degree, student_gpa, status, comments) VALUES
                                                                                                                                       (20240001, 1, 'CS24F', 'Computer Science', 3.85, 'Pending', 'Attaching Year 1 results transcript.'), -- Use existing student
                                                                                                                                       (20240002, 3, 'CS24F', 'Computer Science', 3.60, 'Pending', 'Submitting financial need documentation separately.'); -- Use existing student