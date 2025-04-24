CREATE DATABASE IF NOT EXISTS adhyana_student;
USE adhyana_student;

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

-- Insert sample student data
INSERT INTO students (name, email, degree_id,degree_program, index_number, registration_number, mobile_number, birth_date, state) VALUES
    ('John Doe', 'john.doe@university.com','CS2022' ,'Computer Science', 'CS2024001', 'REG2024001', '1234567890', '2000-01-15', 'Active'),
    ('Jane Smith', 'jane.smith@university.com','CS2022', 'Electrical Engineering', 'EE2024001', 'REG2024002', '9876543210', '1999-08-22', 'Active'),
    ('dinithi', 'dinithi@university.com','CS2022' ,'Computer Science', 'CS2024005', 'REG2024003', '9854632876', '2000-01-20', 'Active');

-- Table for storing individual attendance records
CREATE TABLE IF NOT EXISTS attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (student_id, course_code, date)
);


-- Insert sample attendance data (assuming student_id 1 and 2 exist from student_schema.sql)
INSERT INTO attendance (student_id, course_code, date, present, remarks) VALUES
    (1, 'CS101', '2025-04-15', true, ''),
    (2, 'CS101', '2025-04-15', true, ''),
    (1, 'CS101', '2025-04-17', true, ''),
    (2, 'CS101', '2025-04-17', false, 'Sick leave'),
    (1, 'MATH201', '2025-04-16', true, ''),
    (2, 'MATH201', '2025-04-16', true, '');

-- Table for storing course sessions
CREATE TABLE IF NOT EXISTS course_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_students INT DEFAULT 0,
    present_students INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_session (course_code, date)
);

-- Insert sample course session data
INSERT INTO course_sessions (course_code, course_name, date, total_students, present_students) VALUES
    ('CS101', 'Introduction to Computer Science', '2025-04-15', 25, 22),
    ('CS101', 'Introduction to Computer Science', '2025-04-17',  25, 20),
    ('MATH201', 'Calculus II', '2025-04-16',  18, 15);

-- Create courses table if it doesn't exist already
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample course data
INSERT INTO courses (code, name, description) VALUES
    ('CS101', 'Introduction to Computer Science', 'Fundamental concepts of computer science'),
    ('MATH201', 'Calculus II', 'Advanced calculus topics and applications'),
    ('ENG102', 'Technical Writing', 'Writing for technical and scientific documents');

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_gpa DOUBLE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    application_deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample scholarships
INSERT INTO scholarships (name, description, min_gpa, amount, application_deadline) VALUES
    ('Merit Scholarship', 'Scholarship for students with excellent academic performance', 3.5, 5000.00,  '2025-05-31'),
    ('Academic Excellence Scholarship', 'For students with outstanding academic performance', 3.8, 8000.00, '2025-05-31'),
    ('Financial Need Scholarship', 'For students requiring financial assistancee', 3, 3000.00, '2025-07-15'),
    ('Leadership Scholarship', 'For students who have demonstrated leadership qual...', 3.5, 4000.00, '2025-06-11');
-- Create the scholarship Application table
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id  INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT UNIQUE ,
    scholarship_id INT NOT NULL,
    studentBatch VARCHAR(20) NOT NULL ,
    studentDegree VARCHAR(50) NOT NULL ,
    studentGPA DOUBLE NOT NULL ,
    status ENUM('Pending','Approved','Rejected') NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE

);

-- Insert sample scholarship application data
INSERT INTO scholarship_applications (student_id, scholarship_id, studentBatch, studentDegree, studentGPA, status, comments) VALUES
    (1, 1, '2023', 'Computer Science', 3.8, 'Pending', 'Application submitted'),
    (2, 2, '2022', 'Electrical Engineering', 3.2, 'Pending', 'Application under review');


-- Table for student applications
CREATE TABLE IF NOT EXISTS student_applications (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
     email VARCHAR(100) NOT NULL,
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
     guardian_email VARCHAR(100) NOT NULL,

     hostel_required VARCHAR(5),
     status VARCHAR(20) NOT NULL DEFAULT 'Pending',

     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO student_applications (
    name, national_id, email, phone, gender, date_of_birth, address,
    applied_program, application_date,
    mathematics, science, english, computer_studies,
    guardian_name, guardian_national_id, guardian_relation, guardian_contact_number, guardian_email,
    hostel_required, status
) VALUES
      (
          'Raj Kumar', '9876543210V', 'raj.kumar@example.com', '0771234567', 'Male', '2005-06-15', '123 Main St, Colombo',
          'Computer Science', '2025-04-20',
          'A', 'B', 'A', 'A',
          'Sanjay Kumar', '7654321098V', 'Father', '0777654321', 'sanjay.kumar@example.com',
          'Yes', 'Pending'
      ),
      (
          'Amara Silva', '9865432109V', 'amara.silva@example.com', '0761234567', 'Female', '2006-03-22', '456 Park Ave, Kandy',
          'Information Systems', '2025-04-19',
          'A', 'A', 'B', 'A',
          'Nimal Silva', '7543210987V', 'Father', '0767654321', 'nimal.silva@example.com',
          'No', 'Pending'
      );