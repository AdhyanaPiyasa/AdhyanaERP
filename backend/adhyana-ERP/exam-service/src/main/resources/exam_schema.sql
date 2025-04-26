-- =============================================
-- Schema: adhyana_exam
-- Purpose: Exam scheduling, assignments, grades, reports
-- =============================================
CREATE DATABASE IF NOT EXISTS adhyana_exam;
USE adhyana_exam;

-- Shared Table: Courses (Reference Only)
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

-- Shared Table: Students (Reference Only)
CREATE TABLE IF NOT EXISTS students (
                                        index_number INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shared Table: Semesters (Reference Only)
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
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exam Specific: Exams (Formal Scheduled Exams)
CREATE TABLE IF NOT EXISTS exams (
                                     exam_id INT PRIMARY KEY AUTO_INCREMENT,
                                     title VARCHAR(100) NOT NULL, -- e.g., "Midterm Exam", "Final Exam"
                                     semester_id VARCHAR(15) NOT NULL, -- Links to the specific course offering
                                     exam_date DATE NOT NULL,
                                     start_time TIME NOT NULL,
                                     end_time TIME NOT NULL,
                                     location VARCHAR(50) NOT NULL, -- e.g., "Exam Hall A", "Online via LMS"
                                     type ENUM('Midterm', 'Final', 'Quiz', 'Lab', 'Other') DEFAULT 'Other',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE
);

-- Exam Specific: Assignments (Could include quizzes, projects, homework)
CREATE TABLE IF NOT EXISTS assignments (
                                           assignment_id INT PRIMARY KEY AUTO_INCREMENT, -- Changed Aid to assignment_id
                                           title VARCHAR(100) NOT NULL,
                                           course_id VARCHAR(10) NOT NULL, -- Changed course to course_id
                                           semester_id VARCHAR(15) NOT NULL, -- Added semester_id to link to offering
                                           type ENUM('Homework', 'Project', 'Quiz', 'Lab Report', 'Presentation', 'Online', 'Inclass') NOT NULL,
                                           due_date DATE NOT NULL,
                                           due_time TIME NULL,
                                           max_marks INT NULL,
                                           description TEXT NULL,
                                           posted_by INT NULL, -- Staff ID
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    -- FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
    -- FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL -- Assuming staff table is accessible ref
);

-- Exam Specific: Grades (Records marks/grades for assignments/exams)
CREATE TABLE IF NOT EXISTS grades (
                                      grade_id INT PRIMARY KEY AUTO_INCREMENT, -- Changed Gid to grade_id
                                      student_index INT NOT NULL, -- Changed Index_No
    -- name VARCHAR(100) NOT NULL, -- Removed name, can be fetched from student table
                                      course_id VARCHAR(10) NOT NULL, -- Changed course_code INT
                                      semester_id VARCHAR(15) NOT NULL, -- Added semester_id
    -- courseName VARCHAR(100) NOT NULL, -- Removed courseName, fetch from course table
                                      component_id INT NOT NULL, -- FK to either exams(exam_id) or assignments(assignment_id)
                                      component_type ENUM('EXAM', 'ASSIGNMENT') NOT NULL, -- To distinguish component_id source
                                      marks_obtained DECIMAL(5,2) NULL, -- Store actual marks if available
                                      grade VARCHAR(5) NULL, -- e.g., 'A+', 'B', 'Pass', 'Fail'
                                      feedback TEXT NULL, -- Instructor feedback on this specific grade
                                      graded_by INT NULL, -- Staff ID
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          -- FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                          -- FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                          -- FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                          -- Cannot directly FK component_id to two tables easily. App logic handles linking.
                                          -- Or use separate tables: exam_grades, assignment_grades
                                      UNIQUE KEY uk_student_component (student_index, component_id, component_type) -- Ensure one grade per student per component
);

-- Exam Specific: Reports (Meta-data about generated reports) - Simplified
CREATE TABLE IF NOT EXISTS generated_reports (
                                                 report_id INT PRIMARY KEY AUTO_INCREMENT,
                                                 report_type VARCHAR(50) NOT NULL, -- e.g., 'Transcript', 'SemesterResult', 'ExamAttendance'
                                                 generated_for_type ENUM('STUDENT', 'BATCH', 'COURSE', 'SEMESTER') NULL,
                                                 generated_for_id VARCHAR(20) NULL, -- e.g., student_index, batch_id, course_id, semester_id
                                                 generated_by INT NULL, -- Staff ID
                                                 generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Removed reportfile table as its purpose seems covered by grades and generated_reports

-- Sample Data Insertion (Exam Schema) --

-- Re-insert sample data (for reference)
INSERT INTO courses (course_id, name, year, credits, duration) VALUES
                                                                   ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                                   ('CS2101', 'Data Structures', 1, 4, 60),
                                                                   ('ENG1001', 'Calculus I', 1, 3, 45)
ON DUPLICATE KEY UPDATE course_id=course_id;

INSERT INTO students (index_number, registration_number, name, email, batch_id) VALUES
                                                                                    (20240001, '2024CS001','Janith Perera' ,'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                    (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'CS24F')
ON DUPLICATE KEY UPDATE index_number=index_number;

INSERT INTO semesters (semester_id, batch_id, course_id, academic_year, semester_num, status) VALUES
                                                                                                  ('CS24F-CS1101-S1', 'CS24F', 'CS1101', 2024, 1, 'COMPLETED'),
                                                                                                  ('CS24F-ENG1001-S1', 'CS24F', 'ENG1001', 2024, 1, 'COMPLETED'),
                                                                                                  ('CS24F-CS2101-S2', 'CS24F', 'CS2101', 2025, 2, 'ONGOING'),
                                                                                                  ('CS24F-PHY1001-S2', 'CS24F', 'PHY1001', 2025, 2, 'ONGOING')
ON DUPLICATE KEY UPDATE semester_id=semester_id;

-- Insert sample exams
INSERT INTO exams (title, semester_id, exam_date, start_time, end_time, location, type) VALUES
                                                                                            ('Midterm Exam', 'CS24F-CS2101-S2', '2025-04-10', '09:00:00', '11:00:00', 'Hall C', 'Midterm'),
                                                                                            ('Final Exam', 'CS24F-CS1101-S1', '2025-01-20', '14:00:00', '17:00:00', 'Hall A', 'Final');

-- Insert sample assignments
INSERT INTO assignments (title, course_id, semester_id, type, due_date, due_time, max_marks, posted_by) VALUES
                                                                                                            ('Assignment 1: Arrays', 'CS1101', 'CS24F-CS1101-S1', 'Homework', '2024-10-15', '23:59:00', 100, 2),
                                                                                                            ('Project Proposal', 'CS2101', 'CS24F-CS2101-S2', 'Project', '2025-04-30', '17:00:00', 25, 2),
                                                                                                            ('Quiz 3: Derivatives', 'ENG1001', 'CS24F-ENG1001-S1', 'Quiz', '2024-11-20', '10:00:00', 20, 3);

-- Insert sample grades (Link to existing students, courses, semesters, components)
-- Grade for Assignment 1 (ID 1)
INSERT INTO grades (student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, graded_by) VALUES
                                                                                                                               (20240001, 'CS1101', 'CS24F-CS1101-S1', 1, 'ASSIGNMENT', 85.00, 'A', 2),
                                                                                                                               (20240002, 'CS1101', 'CS24F-CS1101-S1', 1, 'ASSIGNMENT', 92.50, 'A+', 2);
-- Grade for Final Exam (ID 2)
INSERT INTO grades (student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, graded_by) VALUES
    (20240001, 'CS1101', 'CS24F-CS1101-S1', 2, 'EXAM', 78.00, 'A-', 2);
-- Grade for Midterm Exam (ID 1)
INSERT INTO grades (student_index, course_id, semester_id, component_id, component_type, marks_obtained, grade, graded_by) VALUES
    (20240001, 'CS2101', 'CS24F-CS2101-S2', 1, 'EXAM', NULL, NULL, NULL); -- Exam happened, not graded yet

-- Insert sample generated report metadata)
INSERT INTO generated_reports (report_type, generated_for_type, generated_for_id, generated_by) VALUES
                                                                                                    ('SemesterResult', 'STUDENT', '20240001', 1), -- Removed file path
                                                                                                    ('ExamAttendance', 'SEMESTER', 'CS24F-CS2101-Y2025S2', 1);          -- Removed file path
