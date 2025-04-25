CREATE DATABASE IF NOT EXISTS adhyana_student;
USE adhyana_student;

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


-- Table for storing individual attendance records
CREATE TABLE IF NOT EXISTS attendance (
                                          student_index INT NOT NULL,
                                          course_code VARCHAR(20) NOT NULL,
                                          date DATE NOT NULL,
                                          present BOOLEAN DEFAULT FALSE,
                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE,
                                          FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE,
                                          PRIMARY KEY (student_index, course_code, date)
);


-- Insert sample attendance data (assuming student_id 1 and 2 exist from student_schema.sql)
INSERT INTO attendance (student_index, course_code, date, present) VALUES
                                                                             (202500001, 'CS1101', '2025-04-15', true);

-- Create courses table if it doesn't exist already
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
                                                        student_index VARCHAR(10) UNIQUE ,
                                                        scholarship_id INT NOT NULL ,
                                                        studentBatch VARCHAR(20) NOT NULL ,
                                                        studentDegree VARCHAR(50) NOT NULL ,
                                                        studentGPA DOUBLE NOT NULL ,
                                                        status ENUM('Pending','Approved','Rejected') NOT NULL,
                                                        comments TEXT,
                                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                        FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE

);

-- Insert sample scholarship application data
INSERT INTO scholarship_applications (student_index, scholarship_id, studentBatch, studentDegree, studentGPA, status, comments) VALUES
                                                                                                                                          (220008441, 1, '2023', 'Computer Science', 3.8, 'Pending', 'This scholarship will be help for me'),
                                                                                                                                          (22000552, 2, '2022', 'Electrical Engineering', 3.2, 'Pending', ' I have completed the requirements'),
                                                                                                                                          (22000458, 1, '2021', 'Computer Science', 3.7, 'Pending', ' I have completed the requirements');

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

-- Table for Hostel applications
CREATE TABLE IF NOT EXISTS hostel_applications (
                                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                                    student_index INT NOT NULL,
                                                    application_date DATE NOT NULL,
                                                    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                    FOREIGN KEY (student_index) REFERENCES students(index_number) ON DELETE CASCADE
);