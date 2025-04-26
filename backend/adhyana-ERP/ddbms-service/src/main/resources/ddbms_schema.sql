-- =============================================
-- ADHYANA GRAND SCHEMA
-- Purpose: Combined schema for distributed DBMS
-- =============================================

CREATE DATABASE IF NOT EXISTS adhyana_grand;
USE adhyana_grand;

-- ================ CENTRAL/ADMIN TABLES ================

-- Staff Table (Primary Source)
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

-- Courses Table (Primary Source)
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

-- Batches Table (Primary Source)
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

-- Batch Courses (Junction Table - Primary Source)
CREATE TABLE IF NOT EXISTS batch_courses (
                                             batch_id VARCHAR(10) NOT NULL,
                                             course_id VARCHAR(10) NOT NULL,
                                             FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                             PRIMARY KEY (batch_id, course_id)
);

-- Students (Primary Source)
CREATE TABLE IF NOT EXISTS students (
                                        index_number INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Student Applications (Primary Source)
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

-- Hostel Applications (Primary Source)
CREATE TABLE IF NOT EXISTS hostel_applications (
                                                   hostel_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                   student_index INT NOT NULL,
                                                   application_date DATE NOT NULL DEFAULT (CURDATE()),
                                                   status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                   FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE
);

-- ================ ADMIN SPECIFIC TABLES ================

-- Payroll
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

-- Announcements (General/System-wide)
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

-- Academic Calendar
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

-- ================ STUDENT SPECIFIC TABLES ================

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
                                          attendance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          student_index INT NOT NULL,
                                          course_id VARCHAR(10) NOT NULL,
                                          session_date DATE NOT NULL,
                                          session_time TIME NULL,
                                          present BOOLEAN DEFAULT FALSE,
                                          notes VARCHAR(255) NULL,
                                          recorded_by INT NULL,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                          FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                          UNIQUE KEY uk_student_course_session (student_index, course_id, session_date, session_time)
);

-- Scholarships Master List
CREATE TABLE IF NOT EXISTS scholarships (
                                            scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
                                            name VARCHAR(100) NOT NULL UNIQUE,
                                            description TEXT,
                                            eligibility_criteria TEXT NULL,
                                            min_gpa DECIMAL(3,2) NULL,
                                            amount DECIMAL(10,2) NOT NULL,
                                            amount_type ENUM('FIXED', 'PERCENTAGE', 'TUITION_WAIVER') DEFAULT 'FIXED',
                                            application_deadline DATE NOT NULL,
                                            status ENUM('ACTIVE', 'INACTIVE', 'CLOSED') DEFAULT 'ACTIVE',
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarship_applications (
                                                        scholarship_application_id INT PRIMARY KEY AUTO_INCREMENT,
                                                        student_index INT NOT NULL,
                                                        scholarship_id INT NOT NULL,
                                                        application_date DATE DEFAULT (CURDATE()),
                                                        student_batch VARCHAR(20) NULL,
                                                        student_degree VARCHAR(50) NULL,
                                                        student_gpa DECIMAL(3,2) NULL,
                                                        status ENUM('Pending','Approved','Rejected', 'Waitlisted') NOT NULL DEFAULT 'Pending',
                                                        comments TEXT,
                                                        supporting_documents_path VARCHAR(255) NULL,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                        FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE,
                                                        UNIQUE KEY uk_student_scholarship (student_index, scholarship_id)
);

-- ================ COURSE SPECIFIC TABLES ================

-- Semesters (Defines offering of a course in a specific period)
CREATE TABLE IF NOT EXISTS semesters (
                                         semester_id VARCHAR(20) PRIMARY KEY,
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

-- Feedback
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
                                         FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE SET NULL
);

-- Course Announcements
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

-- ================ EXAM SPECIFIC TABLES ================

-- Exams (Formal Scheduled Exams)
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

-- Assignments
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

-- Grades
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
                                      FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                      FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                      FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                      UNIQUE KEY uk_student_component (student_index, component_id, component_type)
);

-- Reports
CREATE TABLE IF NOT EXISTS generated_reports (
                                                 report_id INT PRIMARY KEY AUTO_INCREMENT,
                                                 report_type VARCHAR(50) NOT NULL,
                                                 generated_for_type ENUM('STUDENT', 'BATCH', 'COURSE', 'SEMESTER') NULL,
                                                 generated_for_id VARCHAR(20) NULL,
                                                 generated_by INT NULL,
                                                 generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                 FOREIGN KEY (generated_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- ================ FUNCTIONS AND TRIGGERS ================

-- Function to calculate average rating
DELIMITER //
CREATE FUNCTION IF NOT EXISTS calculate_course_avg_rating(p_course_id VARCHAR(10))
    RETURNS DECIMAL(3,2)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);

    SELECT AVG( (rating_content + rating_instructor + rating_materials + rating_lms) / 4.0 )
    INTO avg_rating
    FROM feedbacks
    WHERE course_id = p_course_id;

    RETURN COALESCE(avg_rating, 0.00);
END //
DELIMITER ;

-- Trigger after feedback insert
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_feedback_insert
    AFTER INSERT ON feedbacks
    FOR EACH ROW
BEGIN
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(NEW.course_id)
    WHERE course_id = NEW.course_id;
END //
DELIMITER ;

-- Trigger after feedback update
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_feedback_update
    AFTER UPDATE ON feedbacks
    FOR EACH ROW
BEGIN
    -- Update old course if course_id changed
    IF OLD.course_id <> NEW.course_id THEN
        UPDATE courses
        SET avg_rating = calculate_course_avg_rating(OLD.course_id)
        WHERE course_id = OLD.course_id;
    END IF;
    -- Update new/current course
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(NEW.course_id)
    WHERE course_id = NEW.course_id;
END //
DELIMITER ;

-- Trigger after feedback delete
DELIMITER //
CREATE TRIGGER IF NOT EXISTS after_feedback_delete
    AFTER DELETE ON feedbacks
    FOR EACH ROW
BEGIN
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(OLD.course_id)
    WHERE course_id = OLD.course_id;
END //
DELIMITER ;

-- ================ SAMPLE DATA INSERTION ================

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
                                                                                                                                                                                                                                                                                                                     ('Raj Kumar', '9876543210V', 'raj.kumar@email.com', '0771234567', 'Male', '2005-06-15', '123 Main St, Colombo', 'Computer Science', '2024-03-20', 'A', 'B', 'A', 'A', 'Sanjay Kumar', '7654321098V', 'Father', '0777654321', 'sanjay.kumar@email.com', TRUE, 'Accepted'),
                                                                                                                                                                                                                                                                                                                     ('Amara Silva', '9865432109V', 'amara.silva@email.com', '0761234567', 'Female', '2006-03-22', '456 Park Ave, Kandy', 'Information Systems', '2024-03-19', 'A', 'A', 'B', 'A', 'Nimal Silva', '7543210987V', 'Father', '0767654321', 'nimal.silva@email.com', FALSE, 'Pending');

-- Insert into payroll table
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
                                                                                                                      ('Portal Maintenance Schedule', 'Please note that the student/staff portal will undergo maintenance on 2025-04-28 from 11 PM to 1 AM (2025-04-29).', 'ADMINISTRATIVE', 5, 'ALL', '2025-04-26 11:00:00', '2025-04-29 01:00:00', 'DRAFT');

-- Insert into academic_calendar
INSERT INTO academic_calendar (event_title, description, start_date, end_date, event_type, created_by) VALUES
                                                                                                           ('Labour Day', 'Public Holiday. Institute Closed.', '2025-05-01', NULL, 'HOLIDAY', 1),
                                                                                                           ('Mid-Semester Exam Period (Tentative)', 'Mid-semester examinations for Year 1/Semester 2.', '2025-06-16', '2025-06-20', 'EXAM_PERIOD', 3),
                                                                                                           ('Vesak Full Moon Poya Day', 'Public Holiday. Institute Closed.', '2025-05-14', NULL, 'HOLIDAY', 1),
                                                                                                           ('Admission Deadline - Fall 2025 Intake', 'Last date to submit applications for the Fall 2025 intake.', '2025-07-31', NULL, 'DEADLINE', 1),
                                                                                                           ('Faculty Development Workshop', 'Workshop on modern assessment techniques.', '2025-05-28', NULL, 'EVENT', 3);

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
                                                                                                                                       (20240001, 1, 'CS24F', 'Computer Science', 3.85, 'Pending', 'Attaching Year 1 results transcript.'),
                                                                                                                                       (20240002, 3, 'CS24F', 'Computer Science', 3.60, 'Pending', 'Submitting financial need documentation separately.');

-- Insert sample semesters
INSERT INTO semesters (semester_id, batch_id, course_id, staff_id, academic_year, semester_num, start_date, end_date, status) VALUES
                                                                                                                                  ('CS24F-CS1101-S1', 'CS24F', 'CS1101', 2, 2024, 1, '2024-09-15', '2025-01-31', 'COMPLETED'),
                                                                                                                                  ('CS24F-ENG1001-S1', 'CS24F', 'ENG1001', 3, 2024, 1, '2024-09-15', '2025-01-31', 'COMPLETED'),
                                                                                                                                  ('CS24F-CS2101-S2', 'CS24F', 'CS2101', 2, 2025, 2, '2025-02-10', '2025-06-20', 'ONGOING'),
                                                                                                                                  ('CS24F-PHY1001-S2', 'CS24F', 'PHY1001', 3, 2025, 2, '2025-02-10', '2025-06-20', 'ONGOING');

-- Insert sample course announcements
INSERT INTO course_announcements (course_id, semester_id, title, content, posted_by) VALUES
                                                                                         ('CS2101', 'CS24F-CS2101-S2', 'Assignment 2 Posted', 'Assignment 2 (Linked Lists) has been posted on the LMS. Due date: 2025-05-15.', 2),
                                                                                         ('PHY1001', 'CS24F-PHY1001-S2', 'Lab Session Change', 'This week\'s lab session (April 29th) is rescheduled to Friday, May 2nd, same time.', 3),
                                                                                         ('CS1101', 'CS24F-CS1101-S1', 'Final Grades Released', 'Final grades for CS1101 (Fall 2024) are now available on the portal.', 2);

-- Insert sample data into feedbacks table
INSERT INTO feedbacks (course_id, semester_id, student_index, rating_content, rating_instructor, rating_materials, rating_lms, comment, is_anonymous) VALUES
                                                                                                                                                          ('CS1101', 'CS24F-CS1101-S1', 20240001, 4, 5, 4, 3, 'Great intro course! Instructor was very clear. LMS quizzes were helpful.', FALSE),
                                                                                                                                                          ('CS1101', 'CS24F-CS1101-S1', 20240002, 5, 5, 5, 4, 'Excellent teaching and very engaging content. Highly recommended!', FALSE),
                                                                                                                                                          ('ENG1001', 'CS24F-ENG1001-S1', 20240001, 4, 3, 4, 4, 'Calculus was challenging but well-structured. Sometimes the pace was a bit fast.', FALSE),
                                                                                                                                                          ('CS1101', 'CS24F-CS1101-S1', NULL, 2, 3, 3, 2, 'Needs more practical coding examples related to theory.', TRUE);

-- Insert sample exams
INSERT INTO exams (title, semester_id, exam_date, start_time, end_time, location, type) VALUES
                                                                                            ('Midterm Exam', 'CS24F-CS2101-S2', '2025-04-10', '09:00:00', '11:00:00', 'Hall C', 'Midterm'),
                                                                                            ('Final Exam', 'CS24F-CS1101-S1', '2025-01-20', '14:00:00', '17:00:00', 'Hall A', 'Final');

-- Insert sample assignments
INSERT INTO assignments (title, course_id, semester_id, type, due_date, due_time, max_marks, posted_by) VALUES
                                                                                                            ('Assignment 1: Arrays', 'CS1101', 'CS24F-CS1101-S1', 'Homework', '2024-10-15', '23:59:00', 100, 2),
                                                                                                            ('Project Proposal', 'CS2101', 'CS24F-CS2101-S2', 'Project', '2025-04-30', '17:00:00', 25, 2),
                                                                                                            ('Quiz 3: Derivatives', 'ENG1001', 'CS24F-ENG1001-S1', 'Quiz', '2024-11-20', '10:00:00', 20, 3);

-- Insert sample grades
INSERT INTO grades (student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, graded_by) VALUES
                                                                                                                               (20240001, 'CS1101', 'CS24F-CS1101-S1', 1, 'ASSIGNMENT', 85.00, 'A', 2),
                                                                                                                               (20240002, 'CS1101', 'CS24F-CS1101-S1', 1, 'ASSIGNMENT', 92.50, 'A+', 2),
                                                                                                                               (20240001, 'CS1101', 'CS24F-CS1101-S1', 2, 'EXAM', 78.00, 'A-', 2),
                                                                                                                               (20240001, 'CS2101', 'CS24F-CS2101-S2', 1, 'EXAM', NULL, NULL, NULL);

-- Insert sample generated report metadata
INSERT INTO generated_reports (report_type, generated_for_type, generated_for_id, generated_by) VALUES
                                                                                                    ('SemesterResult', 'STUDENT', '20240001', 1),
                                                                                                    ('ExamAttendance', 'SEMESTER', 'CS24F-CS2101-S2', 1);

-- Initialize existing courses with their average ratings
UPDATE courses c
SET c.avg_rating = calculate_course_avg_rating(c.course_id)
WHERE c.course_id IN (SELECT DISTINCT course_id FROM feedbacks);