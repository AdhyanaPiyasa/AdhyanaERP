
-- course-service/src/main/resources/course_schema.sql
CREATE DATABASE IF NOT EXISTS adhyana_course;
USE adhyana_course;

CREATE TABLE IF NOT EXISTS courses (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       code INT NOT NULL UNIQUE,
                                       name VARCHAR(100) NOT NULL,
                                       year INT NOT NULL,
                                       semester INT NOT NULL,
                                       credits INT NOT NULL,
                                       duration INT NOT NULL,
                                       avg_rating DECIMAL(3,2) DEFAULT NULL,  -- Added avg_rating column
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




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
-- Insert into batches table
INSERT INTO batches (batch_name, start_date, end_date, course_id, capacity, status) VALUES
                                                                                        ('CS-2024-F', '2024-02-15', '2025-02-14', 101, 50, 'ACTIVE'), -- Assuming course_id 101 is Computer Science Full Time
                                                                                        ('BM-2023-P', '2023-09-01', '2025-08-31', 205, 40, 'ACTIVE'), -- Assuming course_id 205 is Business Management Part Time
                                                                                        ('ENG-2023-F', '2023-03-01', '2024-02-28', 310, 60, 'COMPLETED'), -- Assuming course_id 310 is Engineering Full Time
                                                                                        ('IT-2024-SUM', '2024-06-01', '2024-08-31', 102, 30, 'CANCELLED'); -- Assuming course_id 102 is IT Summer Course


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

INSERT INTO students (name, email, degree_id,degree_program, index_number, registration_number, mobile_number, birth_date, state) VALUES
                                                                                                                                      ('John Doe', 'john.doe@university.com','CS2022' ,'Computer Science', 'CS2024001', 'REG2024001', '1234567890', '2000-01-15', 'Active'),
                                                                                                                                      ('Jane Smith', 'jane.smith@university.com','CS2022', 'Electrical Engineering', 'EE2024001', 'REG2024002', '9876543210', '1999-08-22', 'Active'),
                                                                                                                                      ('dinithi', 'dinithi@university.com','CS2022' ,'Computer Science', 'CS2024005', 'REG2024003', '9854632876', '2000-01-20', 'Active');




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
INSERT INTO staff (first_name, last_name, email, phone, department, position, hire_date, status) VALUES
                                                                                                     ('Bimal', 'Silva', 'bimal.s@adhyana.lk', '0719876543', 'Academics', 'Lecturer', '2021-05-20', 'ACTIVE'),
                                                                                                     ('Bimal', 'Silva', 'bimal.s@adhyana.lk', '0719876543', 'Academics', 'Lecturer', '2021-05-20', 'ACTIVE'),
                                                                                                     ('Bimal', 'Silva', 'bimal.s@adhyana.lk', '0719876543', 'Academics', 'Lecturer', '2021-05-20', 'ACTIVE');







-- Feedback table for course-related feedback
CREATE TABLE IF NOT EXISTS feedbacks (
                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                         courseId INT NOT NULL,
                                         studentId INT, -- NULL if anonymous
                                         teacher VARCHAR(100) NOT NULL,
                                         rating_content TINYINT CHECK (rating_content BETWEEN 1 AND 5),
                                         rating_instructor TINYINT CHECK (rating_instructor BETWEEN 1 AND 5),
                                         rating_lms TINYINT CHECK (rating_lms BETWEEN 1 AND 5),
                                         comment TEXT,
                                         is_anonymous BOOLEAN DEFAULT FALSE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
                                         FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS announcements(
                                            id INT PRIMARY KEY AUTO_INCREMENT,
                                            courseId INT,
                                            title VARCHAR(100),
                                            content TEXT NOT NULL,
                                            author VARCHAR(100),
                                            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS semesters (
                                         id INT PRIMARY KEY AUTO_INCREMENT,
                                         batchId INT NOT NULL,
                                         courseId INT NOT NULL,
                                         teacherId INT NOT NULL,
                                         year INT NOT NULL,
                                         semester INT NOT NULL,
                                         rating DECIMAL(3,2) DEFAULT NULL,  -- Added avg_rating column
                                         started_at DATE,
                                         ended_at DATE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (batchId) REFERENCES batches(id) ON DELETE CASCADE,
                                         FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
                                         FOREIGN KEY (teacherId) REFERENCES staff(id) ON DELETE CASCADE
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

-- Insert sample feedbacks
INSERT INTO feedbacks (courseId, studentId, teacher, rating_content, rating_instructor, rating_lms, comment, is_anonymous) VALUES
                                                                                                                               (1, 1, 'Nimal Perera', 5, 5, 4, 'Very informative course. The instructor was great!', false),
                                                                                                                               (2, 2, 'Dr. Robert Johnson', 4, 4, 3, 'Helpful content, but the platform was a bit slow.', false),
                                                                                                                               (3, NULL, 'Nimal Perera', 3, 4, 5, 'Good course. Preferred more examples though.', true),
                                                                                                                               (4, 1, 'Dr. John Smith', 5, 5, 5, 'Excellent explanation and resources.', false),
                                                                                                                               (5, NULL, 'Prof. William Brown', 4, 3, 4, 'Instructor was okay, content could be clearer.', true);

-- Create a function to calculate average rating for a course
DELIMITER //
CREATE FUNCTION calculate_course_avg_rating(course_id INT)
    RETURNS DECIMAL(3,2)
    READS SQL DATA
BEGIN
    DECLARE avg_rating DECIMAL(3,2);

    SELECT AVG(rating_content) INTO avg_rating
    FROM feedbacks
    WHERE courseId = course_id;

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
    SET avg_rating = calculate_course_avg_rating(NEW.courseId)
    WHERE id = NEW.courseId;
END //
DELIMITER ;

-- Update trigger
DELIMITER //
CREATE TRIGGER after_feedback_update
    AFTER UPDATE ON feedbacks
    FOR EACH ROW
BEGIN
    -- If the courseId has changed, update both old and new courses
    IF OLD.courseId <> NEW.courseId THEN
        UPDATE courses
        SET avg_rating = calculate_course_avg_rating(OLD.courseId)
        WHERE id = OLD.courseId;
    END IF;

    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(NEW.courseId)
    WHERE id = NEW.courseId;
END //
DELIMITER ;

-- Delete trigger
DELIMITER //
CREATE TRIGGER after_feedback_delete
    AFTER DELETE ON feedbacks
    FOR EACH ROW
BEGIN
    UPDATE courses
    SET avg_rating = calculate_course_avg_rating(OLD.courseId)
    WHERE id = OLD.courseId;
END //
DELIMITER ;

-- Initialize existing courses with their average ratings
UPDATE courses c
SET c.avg_rating = (
    SELECT AVG(rating_content)
    FROM feedbacks f
    WHERE f.courseId = c.id
);
