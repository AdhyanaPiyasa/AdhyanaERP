
-- course-service/src/main/resources/course_schema.sql
CREATE DATABASE IF NOT EXISTS adhyana_course;
USE adhyana_course;

CREATE TABLE IF NOT EXISTS courses (
                                       code VARCHAR(7) PRIMARY KEY,
                                       name VARCHAR(100) NOT NULL,
                                       year INT NOT NULL,
                                       credits INT NOT NULL,
                                       duration INT NOT NULL,
                                       avg_rating DECIMAL(3,2) DEFAULT NULL,  -- Added avg_rating column
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample courses
INSERT INTO courses (code, name, year, credits, duration) VALUES
                                                              ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                              ('CS2101', 'Data Structures', 1, 4, 60),
                                                              ('ENG1001', 'Calculus I', 2, 3, 45);


CREATE TABLE batch_courses (
                               batch_id VARCHAR(7) NOT NULL,
                               course_id VARCHAR(7) NOT NULL,
                               PRIMARY KEY (batch_id, course_id),
                               FOREIGN KEY (course_id) REFERENCES courses(code) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO batch_courses (batch_id, course_id) VALUES
                                                                                                         ('CSE2025', 'CS1101');



CREATE TABLE IF NOT EXISTS students (
                                        index_number INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(50) NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample student data
INSERT INTO students (index_number, registration_number, name, email, batch_id) VALUES
                                                            ('202500001', '2025CSE001','John Doe' ,'john.doe@email.com', 'CSE2025');



-- Staff table
CREATE TABLE staff (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       phone VARCHAR(15),
                       department VARCHAR(50),
                       position VARCHAR(50),
                       hire_date DATE,
                       status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- First make sure we have the right staff members with unique emails
INSERT INTO staff (name, email, phone, department, position, hire_date) VALUES
                                                                                                         ('Dr. Robert Johnson', 'robert.johnson@email.com', '1234567890', 'Computer Science', 'teacher', '2020-01-15');


-- Feedback table for course-related feedback
CREATE TABLE IF NOT EXISTS feedbacks (
                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                         course_code INT NOT NULL,
                                         student_index INT, -- NULL if anonymous
                                         semester_id VARCHAR(5) NOT NULL,
                                         rating_content TINYINT CHECK (rating_content BETWEEN 1 AND 5),
                                         rating_instructor TINYINT CHECK (rating_instructor BETWEEN 1 AND 5),
                                         comment TEXT,
                                         is_anonymous BOOLEAN DEFAULT FALSE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE,
                                         FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS announcements(
                                            id        INT PRIMARY KEY AUTO_INCREMENT,
                                            course_id  INT,
                                            title     VARCHAR(100),
                                            content   TEXT NOT NULL,
                                            author    VARCHAR(100),
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                            FOREIGN KEY (course_id) REFERENCES courses(code) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS semesters (
                                         id         VARCHAR(5) PRIMARY KEY,
                                         batch_id    INT NOT NULL,
                                         course_code   INT NOT NULL,
                                         teacher_id  INT NOT NULL,
                                         year       TINYINT CHECK (year BETWEEN 1 AND 4),
                                         semester   TINYINT CHECK (semester BETWEEN 1 AND 2),
                                         started_at DATE,
                                         ended_at   DATE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (batch_id) REFERENCES batch_courses(batch_id) ON DELETE CASCADE,
                                         FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE,
                                         FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE CASCADE
);


-- Insert sample courses
INSERT INTO courses (code, name, year, semester, credits, duration) VALUES
                                                                        (101, 'Introduction to Programming', 1, 1, 3, 45),
                                                                        (201, 'Data Structures', 1, 2, 4, 60),
                                                                        (301, 'Calculus I', 2, 1, 3, 45),
                                                                        (401, 'Physics I', 2, 2, 4, 60),
                                                                        (501, 'English Composition', 3, 1, 3, 45);

-- Insert sample announcements
INSERT INTO announcements (courseId, title, content, author) VALUES
                                                                 (2, 'assignment', 'Your new assignment is scheduled to february first week', 'Dr. Robert Johnson'),
                                                                 (1, 'Inclass', 'Your next inclass is scheduled to february 5th', 'Dr. John Smith'),
                                                                 (4, 'Tutorial', 'tutorials on 30th January has been cancelled', 'Prof. William Brown');



-- Insert sample data into feedbacks table
INSERT INTO feedbacks (courseCode, studentId, year, semester, teacher, rating_content, rating_instructor, rating_lms, comment, is_anonymous) VALUES
                                                                                                                                                 (101, 1, 1, 1, 'Dr. Robert Johnson', 4, 5, 3, 'Great course content, but the LMS could use some improvements.', FALSE),
                                                                                                                                                 (101, 2, 1, 1, 'Dr. Robert Johnson', 5, 5, 4, 'Excellent teaching and content. Highly recommended!', FALSE),
                                                                                                                                                 (201, 1, 1, 2, 'Dr. John Smith', 3, 4, 4, 'The data structures course was challenging but very informative.', FALSE),
                                                                                                                                                 (301, 3, 2, 1, 'Prof. William Brown', 4, 3, 4, 'The calculus course was well-structured, but sometimes the instructor went too fast.', FALSE),
                                                                                                                                                 (401, 2, 2, 2, 'Dr. Emily Davis', 5, 5, 5, 'Physics course was perfect in every aspect!', FALSE),
                                                                                                                                                 (501, NULL, 3, 1, 'Dr. Sarah Thompson', 2, 3, 3, 'The English composition course needs more practical examples.', TRUE),
                                                                                                                                                 (201, 3, 1, 2, 'Dr. John Smith', 4, 5, 4, 'Great teaching style and very helpful instructor.', FALSE),
                                                                                                                                                 (301, 1, 2, 1, 'Prof. William Brown', 3, 3, 2, 'The LMS for calculus needs significant improvements.', FALSE),
                                                                                                                                                 (401, 3, 2, 2, 'Dr. Emily Davis', 4, 4, 4, 'Consistently good quality throughout the physics course.', FALSE),
                                                                                                                                                 (101, NULL, 1, 1, 'Dr. Robert Johnson', 2, 2, 1, 'Not satisfied with this programming course overall.', TRUE);
-- Then insert the semesters with valid teacher IDs
INSERT INTO semesters (batchId, courseId, teacherId, year, semester, started_at, ended_at) VALUES
                                                                                               (1, 1, 1, 1, 1, '2024-01-15', '2024-05-30'),
                                                                                               (1, 2, 2, 1, 2, '2024-06-15', '2024-10-30'),
                                                                                               (2, 3, 3, 2, 1, '2023-09-01', '2024-01-15'),
                                                                                               (2, 4, 1, 2, 2, '2024-02-01', '2024-06-15'),
                                                                                               (3, 5, 2, 3, 1, '2023-03-15', '2023-07-30'),
                                                                                               (1, 3, 3, 1, 1, '2024-01-15', '2024-05-30'),
                                                                                               (2, 1, 1, 1, 1, '2023-09-01', '2024-01-15'),
                                                                                               (3, 2, 2, 2, 1, '2023-03-15', '2023-07-30'),
                                                                                               (1, 4, 3, 1, 2, '2024-06-15', '2024-10-30'),
                                                                                               (2, 5, 1, 2, 2, '2024-02-01', '2024-06-15');


-- Create a function to calculate average rating for a course
DELIMITER //
CREATE FUNCTION calculate_course_avg_rating(course_code INT)
    RETURNS DECIMAL(3,2)
    READS SQL DATA
BEGIN
    DECLARE avg_rating DECIMAL(3,2);

    SELECT AVG(rating_content) INTO avg_rating
    FROM feedbacks
    WHERE courseCode = course_code;

    RETURN avg_rating;
END //
DELIMITER ;

-- Create triggers for insert, update, and delete operations on feedbacks

-- Insert trigger
DELIMITER //
CREATE TRIGGER after_feedback_insert
    AFTER INSERT ON feedbacks
    FOR EACH ROW
BEGIN
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(NEW.courseCode)
    WHERE code = NEW.courseCode;
END //
DELIMITER ;

-- Update trigger
DELIMITER //
CREATE TRIGGER after_feedback_update
    AFTER UPDATE ON feedbacks
    FOR EACH ROW
BEGIN
    -- If the courseId has changed, update both old and new courses
    IF OLD.courseCode <> NEW.courseCode THEN
        UPDATE courses
        SET avg_rating = calculate_course_avg_rating(OLD.courseCode)
        WHERE code = OLD.courseCode;
    END IF;

    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(NEW.courseCode)
WHERE code = NEW.courseCode;
END //
DELIMITER ;

-- Delete trigger
DELIMITER //
CREATE TRIGGER after_feedback_delete
    AFTER DELETE ON feedbacks
    FOR EACH ROW
BEGIN
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(OLD.courseCode)
    WHERE code = OLD.courseCode;
END //
DELIMITER ;

-- Initialize existing courses with their average ratings
UPDATE courses c
SET c.avg_rating = (
    SELECT AVG(rating_content)
    FROM feedbacks f
    WHERE f.courseCode = c.code
);
