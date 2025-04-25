-- exam_schema.sql
CREATE DATABASE IF NOT EXISTS adhyana_exam;
USE adhyana_exam;

CREATE TABLE IF NOT EXISTS exams (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     title VARCHAR(100) NOT NULL,
                                     course VARCHAR(100) NOT NULL,
                                     course_code INT NOT NULL,
                                     date DATE NOT NULL,
                                     start_time VARCHAR(50) NOT NULL,
                                     end_time VARCHAR(50) NOT NULL,
                                     room VARCHAR(20) NOT NULL,
                                     teacher VARCHAR(100) NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample exam data
INSERT INTO exams (title, course, course_code, date, start_time, end_time, room, teacher) VALUES
                                                                                              ('Mid Term Examination', 'Computer Science', 101, '2024-03-15', '09:00:00', '11:00:00', 'A-101', 'Dr. Smith'),
                                                                                              ('Final Examination', 'Advanced Programming', 201, '2024-04-20', '14:00:00', '17:00:00', 'B-201', 'Dr. Johnson'),
                                                                                              ('Quiz 1', 'Mathematics', 101, '2024-03-10', '10:00:00', '11:00:00', 'C-301', 'Prof. Williams'),
                                                                                              ('Lab Exam', 'Physics', 101, '2024-03-25', '13:00:00', '15:00:00', 'Lab-101', 'Dr. Brown');


CREATE TABLE IF NOT EXISTS assignments (
                                           Aid INT PRIMARY KEY AUTO_INCREMENT,
                                           title VARCHAR(100) NOT NULL,
                                           course VARCHAR(100) NOT NULL,
                                           course_code INT NOT NULL,
                                           type VARCHAR(100) NOT NULL ,
                                           date DATE NOT NULL,
                                           start_time VARCHAR(50) NOT NULL,
                                           end_time VARCHAR(50) NOT NULL,
                                           room VARCHAR(20) NOT NULL,
                                           teacher VARCHAR(100) NOT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);

INSERT INTO assignments(title, course, course_code,type, date, start_time, end_time, room, teacher) VALUES
                                                                                                        ('Mid Term Examination', 'Computer Science', 101, 'online','2024-03-15', '09:00:00', '11:00:00', 'A-101', 'Dr. Smith'),
                                                                                                        ('Final Examination', 'Advanced Programming', 201, 'inclass','2024-04-20', '14:00:00', '17:00:00', 'B-201', 'Dr. Johnson'),
                                                                                                        ('Quiz 1', 'Mathematics', 101, 'inclass','2024-03-10','10:00:00', '11:00:00', 'C-301', 'Prof. Williams'),
                                                                                                        ('Lab Exam', 'Physics', 101, 'online','2024-03-25', '13:00:00', '15:00:00', 'Lab-101', 'Dr. Brown');




CREATE TABLE IF NOT EXISTS grades(
                                     Gid INT PRIMARY KEY AUTO_INCREMENT,
                                     Index_No INT NOT NULL,
                                     Name VARCHAR(100) NOT NULL,
                                     courseCode INT NOT NULL,
                                     courseName VARCHAR(100) NOT NULL,
                                     grade VARCHAR(100) NOT NULL

);
INSERT INTO grades (Gid, Index_No, Name, courseCode, courseName, grade) VALUES
    (1,22,'Shashika',010,'DSA','A+');

CREATE TABLE  IF NOT EXISTS reports(
                                       reportId INT PRIMARY KEY AUTO_INCREMENT,
                                       course_name VARCHAR(100) NOT NULL ,
                                       exam_name VARCHAR(100)NOT NULL ,
                                       name VARCHAR(100) NOT NULL ,
                                       date DATE NOT NULL

);
INSERT INTO reports(reportId, course_name, exam_name, name, date) VALUES
    (1,'DSA','AY21SEM2','Shashika','2025-04-11');

CREATE TABLE IF NOT EXISTS reportfile(
    reportNo INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL ,
    indexNo INT NOT NULL ,
    examName VARCHAR(100) NOT NULL ,
    semester VARCHAR(100) not null,
    courseName VARCHAR(100) NOT NULL ,
    courseCode INT NOT NULL ,
    grade VARCHAR(50) NOT NULL

);
INSERT INTO reportfile VALUES (1,'Shashika',221049,'AY1','sem1','DSA',2211,'A');