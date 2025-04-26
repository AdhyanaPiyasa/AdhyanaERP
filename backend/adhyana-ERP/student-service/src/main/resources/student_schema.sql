-- =============================================
-- Schema: adhyana_student
-- Purpose: Student-specific data like attendance, scholarships
-- =============================================

CREATE DATABASE IF NOT EXISTS adhyana_student;
USE adhyana_student;

-- Shared Table: Students (Reference Only - Data Managed by Admin)
CREATE TABLE IF NOT EXISTS students (
                                        index_number INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- No FK here to avoid cross-db constraints, app logic ensures consistency
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
                                                    gender ENUM('Male', 'Female', 'Other') NOT NULL,
                                                    date_of_birth DATE NOT NULL,
                                                    address TEXT NOT NULL,
                                                    applied_program VARCHAR(100) NOT NULL,
                                                    application_date DATE NOT NULL DEFAULT (CURDATE()),
                                                    mathematics VARCHAR(5) NOT NULL,
                                                    science VARCHAR(5) NOT NULL,
                                                    english VARCHAR(5) NOT NULL,
                                                    computer_studies VARCHAR(5) NOT NULL,
                                                    guardian_name VARCHAR(100) NOT NULL,
                                                    guardian_national_id VARCHAR(20) NOT NULL,
                                                    guardian_relation VARCHAR(20) NOT NULL,
                                                    guardian_contact_number VARCHAR(20) NOT NULL,
                                                    guardian_email VARCHAR(100),
                                                    hostel_required BOOLEAN DEFAULT FALSE,
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
                                          attendance_id BIGINT PRIMARY KEY AUTO_INCREMENT, -- Use surrogate key
                                          student_index INT NOT NULL,
                                          course_id VARCHAR(10) NOT NULL,
                                          session_date DATE NOT NULL,
                                          session_time TIME NULL, -- Optional: Specific time if multiple sessions/day
                                          present BOOLEAN DEFAULT FALSE,
                                          notes VARCHAR(255) NULL, -- e.g., 'Medical Leave Approved'
                                          recorded_by INT NULL, -- Could link to staff ID if needed
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE, -- Cascade OK?
    -- FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE, -- Cascade OK?
                                          UNIQUE KEY uk_student_course_session (student_index, course_id, session_date, session_time) -- Prevent duplicates
);

-- Student Specific: Scholarships Master List
CREATE TABLE IF NOT EXISTS scholarships (
                                            scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
                                            name VARCHAR(100) NOT NULL UNIQUE,
                                            description TEXT,
                                            eligibility_criteria TEXT NULL, -- More flexible than just GPA
                                            min_gpa DECIMAL(3,2) NULL, -- GPA might be just one criterion
                                            amount DECIMAL(10,2) NOT NULL,
                                            amount_type ENUM('FIXED', 'PERCENTAGE', 'TUITION_WAIVER') DEFAULT 'FIXED',
                                            application_deadline DATE NOT NULL,
                                            status ENUM('ACTIVE', 'INACTIVE', 'CLOSED') DEFAULT 'ACTIVE',
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student Specific: Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarship_applications (
                                                        scholarship_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                        student_index INT NOT NULL, -- Changed from VARCHAR, Removed UNIQUE
                                                        scholarship_id INT NOT NULL,
                                                        application_date DATE DEFAULT (CURDATE()),
                                                        student_batch VARCHAR(20) NULL, -- Denormalized for convenience, but can get from student_index
                                                        student_degree VARCHAR(50) NULL, -- Denormalized
                                                        student_gpa DECIMAL(3,2) NULL, -- GPA at time of application
                                                        status ENUM('Pending','Approved','Rejected', 'Waitlisted') NOT NULL DEFAULT 'Pending',
                                                        comments TEXT,
                                                        supporting_documents_path VARCHAR(255) NULL, -- Link to stored documents
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE, -- If scholarship deleted, apps are void
                                                        UNIQUE KEY uk_student_scholarship (student_index, scholarship_id) -- Student can apply only once per scholarship
);

-- Sample Data Insertion (Student Schema) --

-- Re-insert sample student/course data (for reference, assuming not live linked)
INSERT INTO students (index_number, registration_number, name, email, batch_id) VALUES
                                                                                    (20240001, '2024CS001','Janith Perera' ,'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                    (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'CS24F'),
                                                                                    (20230010, '2023BM010','Ravi Sharma' ,'ravi.s@student.adhyana.lk', 'BM23S')
ON DUPLICATE KEY UPDATE index_number=index_number; -- Avoid error if already exists

INSERT INTO courses (course_id, name, year, credits, duration) VALUES
                                                                   ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                                   ('CS2101', 'Data Structures', 1, 4, 60),
                                                                   ('ENG1001', 'Calculus I', 1, 3, 45)
ON DUPLICATE KEY UPDATE course_id=course_id; -- Avoid error if already exists

-- Insert sample attendance data
INSERT INTO attendance (student_index, course_id, session_date, present) VALUES
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