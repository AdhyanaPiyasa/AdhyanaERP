-- =============================================
-- Schema: adhyana_course
-- Purpose: Course details, content, feedback, course-specific announcements
-- =============================================

CREATE DATABASE IF NOT EXISTS adhyana_course;
USE adhyana_course;

-- Shared Table: Courses (Reference Only - Data Managed by Admin)
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

-- Shared Table: Students (Reference Only - Data Managed by Admin)
CREATE TABLE IF NOT EXISTS students (
                                        index_number INT PRIMARY KEY,
                                        registration_number VARCHAR(20) NOT NULL UNIQUE,
                                        name VARCHAR(100) NOT NULL,
                                        email VARCHAR(100) NOT NULL UNIQUE,
                                        batch_id VARCHAR(10) NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shared Table: Staff (Reference Only - Data Managed by Admin)
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

-- Shared Table: Batches (Reference Only - Data Managed by Admin)
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


-- Shared Table: Batch Courses (Junction Table - Reference Only)
CREATE TABLE IF NOT EXISTS batch_courses (
                                             batch_id VARCHAR(10) NOT NULL,
                                             course_id VARCHAR(10) NOT NULL,
                                             PRIMARY KEY (batch_id, course_id)
    -- No FKs here to avoid cross-db constraints
);



-- Modified Table Structures with NOT NULL constraints
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


CREATE TABLE IF NOT EXISTS semester_offerings (
                                                  semester_id VARCHAR(5) NOT NULL,
                                                  course_id VARCHAR(10) NOT NULL,
                                                  staff_id INT NOT NULL,
                                                  PRIMARY KEY (semester_id, course_id, staff_id),
                                                  FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                                  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                                                  FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS student_semester_courses (
                                                        student_index INT NOT NULL,
                                                        semester_id VARCHAR(5) NOT NULL,
                                                        course_id VARCHAR(10) NOT NULL,
                                                        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        PRIMARY KEY (student_index, semester_id, course_id),
                                                        FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                                        FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
                                                        FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);





-- Course Specific: Feedback
CREATE TABLE IF NOT EXISTS feedbacks (
                                         feedback_id INT PRIMARY KEY AUTO_INCREMENT,
                                         course_id VARCHAR(10) NOT NULL,
                                         semester_id VARCHAR(5) NULL, -- Link to specific offering if possible
                                         student_index INT NULL, -- NULL if anonymous
                                         rating_content TINYINT CHECK (rating_content BETWEEN 1 AND 5),
                                         rating_instructor TINYINT CHECK (rating_instructor BETWEEN 1 AND 5),
                                         rating_materials TINYINT CHECK (rating_materials BETWEEN 1 AND 5), -- Added
                                         rating_lms TINYINT CHECK (rating_lms BETWEEN 1 AND 5), -- Added this column
                                         comment TEXT,
                                         is_anonymous BOOLEAN DEFAULT FALSE,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    -- FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL,
    -- FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE SET NULL -- Keep feedback if student leaves
);




-- Course Specific: Announcements (e.g., Assignment due dates for a course)
CREATE TABLE IF NOT EXISTS course_announcements ( -- Renamed from announcements
                                                    course_announcement_id INT PRIMARY KEY AUTO_INCREMENT,
                                                    course_id VARCHAR(10) NOT NULL,
                                                    semester_id VARCHAR(5) NULL, -- Link to specific offering if needed
                                                    title VARCHAR(200) NOT NULL,
                                                    content TEXT NOT NULL,
                                                    posted_by INT NULL, -- Staff ID
                                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    -- FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL,
    -- FOREIGN KEY (posted_by) REFERENCES staff(staff_id) ON DELETE SET NULL
);






-- Sample Data Insertion (Course Schema) --

-- Re-insert sample data (for reference)
INSERT INTO courses (course_id, name, year, credits, duration) VALUES
                                                                   ('CS1101', 'Introduction to Programming', 1, 3, 45),
                                                                   ('CS2101', 'Data Structures', 1, 4, 60),
                                                                   ('ENG1001', 'Calculus I', 1, 3, 45),
                                                                   ('PHY1001', 'Physics I', 1, 4, 60),
                                                                   ('ENG1002', 'English Composition', 1, 3, 45)
ON DUPLICATE KEY UPDATE course_id=course_id;

INSERT INTO staff (staff_id, name, email, position) VALUES
                                                        (1, 'Aruna Perera', 'aruna.p@adhyana.lk', 'Admin Officer'),
                                                        (2, 'Bimal Silva', 'bimal.s@adhyana.lk', 'Lecturer'),
                                                        (3, 'Chandra Fernando', 'chandra.f@adhyana.lk', 'Senior Lecturer')
ON DUPLICATE KEY UPDATE staff_id=staff_id;

INSERT INTO students (index_number, registration_number, name, email, batch_id) VALUES
                                                                                    (20240001, '2024CS001','Janith Perera' ,'janith.p@student.adhyana.lk', 'CS24F'),
                                                                                    (20240002, '2024CS002','Aisha Khan' ,'aisha.k@student.adhyana.lk', 'CS24F')
ON DUPLICATE KEY UPDATE index_number=index_number;

INSERT INTO batches (batch_id, batch_name, start_date, end_date) VALUES
                                                                     ('CS24F', 'CS-2024-Fall', '2024-09-15', '2028-08-31'),
                                                                     ('BM23S', 'BM-2023-Spring', '2023-02-01', '2027-01-31')
ON DUPLICATE KEY UPDATE batch_id=batch_id;

INSERT INTO batch_courses (batch_id, course_id) VALUES
                                                    ('CS24F', 'CS1101'), ('CS24F', 'ENG1001')
ON DUPLICATE KEY UPDATE batch_id=batch_id, course_id=course_id;



-- Insert data into semesters table
INSERT INTO semesters (semester_id, batch_id, academic_year, semester_num, start_date, end_date, status) VALUES
                                                                                                             ('y24s1', 'CS24F', 2024, 1, '2024-09-15', '2024-12-20', 'ONGOING'),
                                                                                                             ('y24s2', 'CS24F', 2024, 2, '2025-01-10', '2025-05-10', 'PLANNED'),
                                                                                                             ('y25s1', 'CS24F', 2025, 1, '2025-09-15', '2025-12-20', 'PLANNED'),
                                                                                                             ('y23s1', 'BM23S', 2023, 1, '2023-02-01', '2023-06-30', 'COMPLETED');

-- Insert data into semester_offerings table
INSERT INTO semester_offerings (semester_id, course_id, staff_id) VALUES
                                                                      ('y24s1', 'CS1101', 2),
                                                                      ('y24s2', 'ENG1001', 2),
                                                                      ('y25s1', 'CS2101', 3),
                                                                      ('y23s1', 'ENG1002', 3);

-- Insert data into student_semester_courses table
INSERT INTO student_semester_courses (student_index, semester_id, course_id) VALUES
                                                                                 (20240001, 'y24s1', 'CS1101'),
                                                                                 (20240001, 'y24s2', 'ENG1001'),
                                                                                 (20240002, 'y25s1', 'CS2101'),
                                                                                 (20240002, 'y23s1', 'ENG1002');





-- Insert sample course announcements
INSERT INTO course_announcements (course_id, semester_id, title, content, posted_by) VALUES
                                                                                         ('CS2101', 'y24s2', 'Assignment 2 Posted', 'Assignment 2 (Linked Lists) has been posted on the LMS. Due date: 2025-05-15.', 2),
                                                                                         ('PHY1001', 'y24s2', 'Lab Session Change', 'This week\'s lab session (April 29th) is rescheduled to Friday, May 2nd, same time.', 3),
                                                                                         ('CS1101', 'y24s1', 'Final Grades Released', 'Final grades for CS1101 (Fall 2024) are now available on the portal.', 2);

-- Insert sample data into feedbacks table (using correct course_id and student_index)
INSERT INTO feedbacks (course_id, semester_id, student_index, rating_content, rating_instructor, rating_materials, rating_lms, comment, is_anonymous) VALUES
                                                                                                                                                          ('CS1101', 'y24s1', 20240001, 4, 5, 4, 3, 'Great intro course! Instructor was very clear. LMS quizzes were helpful.', FALSE),
                                                                                                                                                          ('CS1101', 'y24s1', 20240002, 5, 5, 5, 4, 'Excellent teaching and very engaging content. Highly recommended!', FALSE),
                                                                                                                                                          ('ENG1001', 'y24s1', 20240001, 4, 3, 4, 4, 'Calculus was challenging but well-structured. Sometimes the pace was a bit fast.', FALSE),
                                                                                                                                                          ('CS1101', 'y24s1', NULL, 2, 3, 3, 2, 'Needs more practical coding examples related to theory.', TRUE); -- Anonymous

-- Trigger/Function Definitions (Adjusted for standardized names)

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

    RETURN COALESCE(avg_rating, 0.00); -- Return 0 if no ratings yet
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
    -- Update old course if course_id changed (unlikely but possible)
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

-- Initialize existing courses with their average ratings (Run once after setup)
UPDATE courses c
SET c.avg_rating = calculate_course_avg_rating(c.course_id)
WHERE c.course_id IN (SELECT DISTINCT course_id FROM feedbacks);


DELIMITER //

-- =============================================
-- Final Semester Triggers
-- Purpose: Manage student_semester_courses records when semesters change
-- =============================================

DELIMITER //

-- Trigger when a semester is deleted
CREATE TRIGGER after_semester_delete
    AFTER DELETE ON semesters
    FOR EACH ROW
BEGIN
    -- Remove all related course enrollments when a semester is deleted
    DELETE FROM student_semester_courses
    WHERE semester_id = OLD.semester_id;
END //

-- Trigger when a semester is updated
CREATE TRIGGER after_semester_update
    AFTER UPDATE ON semesters
    FOR EACH ROW
BEGIN
    -- Update semester_id references if it changes
    IF OLD.semester_id <> NEW.semester_id THEN
        UPDATE student_semester_courses
        SET semester_id = NEW.semester_id
        WHERE semester_id = OLD.semester_id;
    END IF;
END //

-- Trigger when a new semester is created
CREATE TRIGGER after_semester_insert
    AFTER INSERT ON semesters
    FOR EACH ROW
BEGIN
    -- Get students from the batch associated with this semester
    -- and courses offered in this semester
    INSERT INTO student_semester_courses (student_index, semester_id, course_id)
    SELECT
        s.index_number,
        NEW.semester_id,
        bc.course_id
    FROM
        students s
            JOIN
        batch_courses bc ON s.batch_id = bc.batch_id
            JOIN
        semester_offerings so ON so.semester_id = NEW.semester_id AND so.course_id = bc.course_id
    WHERE
        s.batch_id = NEW.batch_id
      AND NOT EXISTS (
        -- Avoid duplicate enrollments
        SELECT 1 FROM student_semester_courses ssc
        WHERE ssc.student_index = s.index_number
          AND ssc.semester_id = NEW.semester_id
          AND ssc.course_id = bc.course_id
    );

    -- Note: enrollment_date will be automatically set to CURRENT_TIMESTAMP
    -- by the default value in the table definition
END //

DELIMITER ;