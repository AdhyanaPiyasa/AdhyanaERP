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


batchId,courseId,teacherId,year, semester, startAt,endAt,rating.
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
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                                         FOREIGN KEY (batchId) REFERENCES batches(id) ON DELETE CASCADE,
                                        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
                                        FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE
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