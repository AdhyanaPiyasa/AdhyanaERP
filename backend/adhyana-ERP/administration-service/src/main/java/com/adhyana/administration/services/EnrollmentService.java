package com.adhyana.administration.services;

import com.adhyana.administration.models.Student;
import com.adhyana.administration.models.HostelAssignmentRequest;
import com.adhyana.administration.utils.DatabaseConnection;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for handling student enrollment and related processes.
 * Orchestrates enrollment flow including user profile creation and hostel assignment.
 */
public class EnrollmentService {
    // URL for Hostel Service (would be configurable in production)
    private static final String HOSTEL_SERVICE_URL = "http://localhost:8083/hostel/assign";

    private final UserProfileService userProfileService;

    /**
     * Constructor
     */
    public EnrollmentService() {
        this.userProfileService = new UserProfileService();
    }

    /**
     * Get all enrolled students
     * @return List of all students
     */
    public List<Student> getAllStudents() throws Exception {
        List<Student> students = new ArrayList<>();
        String query = "SELECT * FROM students ORDER BY student_index";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Get student by index number
     * @param indexNumber Student index number
     * @return Student object or null if not found
     */
    public Student getStudentByIndex(int indexNumber) throws Exception {
        String query = "SELECT * FROM students WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, indexNumber);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToStudent(rs);
            }
        }
        return null;
    }

    /**
     * Get students in a batch
     * @param batchId Batch ID
     * @return List of students in the batch
     */
    public List<Student> getStudentsByBatch(String batchId) throws Exception {
        List<Student> students = new ArrayList<>();
        String query = "SELECT * FROM students WHERE batch_id = ? ORDER BY student_index";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Enroll a new student
     * @param student Student to enroll
     * @return Enrolled student with generated index number
     */
    public Student enrollStudent(Student student) throws Exception {
        // Validate data
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new Exception("Student name is required");
        }
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new Exception("Student email is required");
        }

        // Check if email already exists
        if (isEmailExists(student.getEmail())) {
            throw new Exception("Email already exists: " + student.getEmail());
        }

        // Generate a new index number for the student
        int newIndexNumber = getNextAvailableIndexNumber();
        student.setIndexNumber(newIndexNumber);

        // Generate registration number if not provided
        if (student.getRegistrationNumber() == null || student.getRegistrationNumber().trim().isEmpty()) {
            student.setRegistrationNumber(generateRegistrationNumber(student));
        }

        String query = "INSERT INTO students (student_index, registration_number, name, email, batch_id, gender, hostel_required) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, student.getIndexNumber());
            stmt.setString(2, student.getRegistrationNumber());
            stmt.setString(3, student.getName());
            stmt.setString(4, student.getEmail());
            stmt.setString(5, student.getBatchId());
            stmt.setString(6, student.getGender());
            stmt.setBoolean(7, student.isHostelRequired());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Enrolling student failed, no rows affected.");
            }

            // Improved error handling for user profile creation
            try {
                boolean profileCreated = userProfileService.createStudentUserProfile(student);
                if (!profileCreated) {
                    throw new Exception("Failed to create user profile for student: " + student.getName());
                }

//                // Create guardian user profile
//                if (student.getGuardianName() != null && student.getGuardianEmail() != null) {
//                    boolean guardianProfileCreated = userProfileService.createGuardianUserProfile(
//                            student.getGuardianName(),
//                            student.getGuardianEmail(),
//                            student.getIndexNumber());
//
//                    if (!guardianProfileCreated) {
//                        System.err.println("Warning: Failed to create guardian user profile for student: " + student.getName());
//                        // Continue with enrollment even if guardian profile creation fails
//                    }
//                }
            } catch (Exception e) {
                // Log the error and consider whether to roll back the student enrollment
                System.err.println("Error creating user profile: " + e.getMessage());
                // Uncomment this if you want to roll back the student enrollment when profile creation fails
                // throw new Exception("Failed to create user profile: " + e.getMessage());
            }

            // If hostel is required, send a request to the Hostel Service
            if (student.isHostelRequired()) {
                assignStudentToHostel(student);
            }

            return student;
        }
    }

    /**
     * Bulk enroll students from applications
     * @param batchId Batch ID to enroll students into
     * @return Number of students successfully enrolled
     */
    public int bulkEnrollStudents(String batchId) throws Exception {
        // Get all accepted applications that haven't been enrolled yet
        List<Student> studentsToEnroll = getAcceptedApplications();
        int enrolledCount = 0;

        // Validate batch exists
        BatchService batchService = new BatchService();
        if (batchService.getBatchById(batchId) == null) {
            throw new Exception("Batch not found with id: " + batchId);
        }

        // Enroll each student
        for (Student student : studentsToEnroll) {
            try {
                student.setBatchId(batchId);
                enrollStudent(student);
                enrolledCount++;
            } catch (Exception e) {
                System.err.println("Error enrolling student: " + student.getName() + " - " + e.getMessage());
                // Continue with next student
            }
        }

        return enrolledCount;
    }

    /**
     * Update a student
     * @param indexNumber Student index number
     * @param student Updated student data
     */
    public void updateStudent(int indexNumber, Student student) throws Exception {
        // Check if student exists
        if (getStudentByIndex(indexNumber) == null) {
            throw new Exception("Student not found with index number: " + indexNumber);
        }

        // Check if email already exists for a different student
        if (!student.getEmail().equals(getStudentByIndex(indexNumber).getEmail()) &&
                isEmailExists(student.getEmail())) {
            throw new Exception("Email already exists: " + student.getEmail());
        }

        String query = "UPDATE students SET name = ?, email = ?, batch_id = ?, gender = ?, " +
                "hostel_required = ? WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setString(3, student.getBatchId());
            stmt.setString(4, student.getGender());
            stmt.setBoolean(5, student.isHostelRequired());
            stmt.setInt(6, indexNumber);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Student not found with index number: " + indexNumber);
            }

            // Handle hostel assignment if needed
            Student oldStudent = getStudentByIndex(indexNumber);
            if (!oldStudent.isHostelRequired() && student.isHostelRequired()) {
                // Student now requires a hostel
                assignStudentToHostel(student);
            }
        }
    }

    /**
     * Assign a student to a batch
     * @param indexNumber Student index number
     * @param batchId Batch ID
     */
    public void assignStudentToBatch(int indexNumber, String batchId) throws Exception {
        // Check if student exists
        if (getStudentByIndex(indexNumber) == null) {
            throw new Exception("Student not found with index number: " + indexNumber);
        }

        // Check if batch exists
        BatchService batchService = new BatchService();
        if (batchService.getBatchById(batchId) == null) {
            throw new Exception("Batch not found with id: " + batchId);
        }

        String query = "UPDATE students SET batch_id = ? WHERE student_index = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, batchId);
            stmt.setInt(2, indexNumber);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new Exception("Student not found with index number: " + indexNumber);
            }
        }
    }

    /**
     * Get accepted applications that haven't been enrolled yet
     * @return List of students to be enrolled
     */
    private List<Student> getAcceptedApplications() throws Exception {
        List<Student> applications = new ArrayList<>();

        // Query to get accepted applications that haven't been enrolled yet
        String query = "SELECT sa.* FROM student_applications sa " +
                "LEFT JOIN students s ON sa.email = s.email " +
                "WHERE sa.status = 'Accepted' AND s.student_index IS NULL";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Student student = new Student();
                student.setName(rs.getString("name"));
                student.setEmail(rs.getString("email"));
                // Generate a registration number based on national ID
                student.setRegistrationNumber(rs.getString("applied_program").substring(0, 2).toUpperCase() +
                        rs.getString("national_id").substring(0, 6));
                student.setGender(rs.getString("gender"));
                student.setHostelRequired(rs.getBoolean("hostel_required"));

                applications.add(student);
            }
        }

        return applications;
    }

    /**
     * Assign a student to a hostel by communicating with the Hostel Service
     * @param student Student to assign to a hostel
     * @return true if successful, false otherwise
     */
    private boolean assignStudentToHostel(Student student) {
        try {
            // Create hostel assignment request
            HostelAssignmentRequest request = HostelAssignmentRequest.fromStudent(student);

            // Send request to Hostel Service
            URL url = new URL(HOSTEL_SERVICE_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            // Convert request to JSON
            String jsonRequest = request.toJson();

            // Send request
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonRequest.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Get response
            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK ||
                    responseCode == HttpURLConnection.HTTP_CREATED) {

                // Read response
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }

                    // Log success
                    System.out.println("Successfully assigned student to hostel: " + student.getIndexNumber());
                    return true;
                }
            } else {
                // Read error response
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8))) {
                    StringBuilder error = new StringBuilder();
                    String errorLine;
                    while ((errorLine = br.readLine()) != null) {
                        error.append(errorLine.trim());
                    }

                    // Log error
                    System.err.println("Failed to assign student to hostel: " + error.toString());
                }
                return false;
            }
        } catch (Exception e) {
            System.err.println("Error assigning student to hostel: " + e.getMessage());
            return false;
        }
    }

    /**
     * Check if email already exists
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    private boolean isEmailExists(String email) throws Exception {
        String query = "SELECT COUNT(*) FROM students WHERE email = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    /**
     * Generate a registration number for a student
     * @param student Student
     * @return Generated registration number
     */
    private String generateRegistrationNumber(Student student) {
        // Format: YYYYBBXXX where YYYY is year, BB is batch code, XXX is sequential number
        int year = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR);
        String batchCode = "00"; // Default

        if (student.getBatchId() != null && !student.getBatchId().isEmpty()) {
            // Extract first two characters of batch ID as batch code
            batchCode = student.getBatchId().substring(0, Math.min(2, student.getBatchId().length()));
        }

        // Get next sequential number
        int sequentialNumber = getNextSequentialNumber(year, batchCode);

        return String.format("%d%s%03d", year, batchCode, sequentialNumber);
    }

    /**
     * Get next sequential number for registration number
     * @param year Year
     * @param batchCode Batch code
     * @return Next sequential number
     */
    private int getNextSequentialNumber(int year, String batchCode) {
        try {
            String query = "SELECT MAX(CAST(SUBSTRING(registration_number, 7) AS UNSIGNED)) " +
                    "FROM students WHERE registration_number LIKE ?";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {

                stmt.setString(1, year + batchCode + "%");
                ResultSet rs = stmt.executeQuery();

                if (rs.next() && rs.getString(1) != null) {
                    return rs.getInt(1) + 1;
                }
            }
        } catch (Exception e) {
            System.err.println("Error getting next sequential number: " + e.getMessage());
        }

        return 1; // Start with 1 if no existing records or error
    }

    /**
     * Get next available index number for students
     * @return Next available index number
     */
    private int getNextAvailableIndexNumber() throws Exception {
        String query = "SELECT MAX(student_index) FROM students";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            if (rs.next() && rs.getObject(1) != null) {
                return rs.getInt(1) + 1;
            }
        }

        return 1; // Start with 1 if no existing records
    }

    /**
     * Map database result set to Student object
     * @param rs ResultSet
     * @return Student object
     */
    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        Student student = new Student();
        student.setIndexNumber(rs.getInt("student_index"));
        student.setRegistrationNumber(rs.getString("registration_number"));
        student.setName(rs.getString("name"));
        student.setEmail(rs.getString("email"));
        student.setBatchId(rs.getString("batch_id"));
        student.setGender(rs.getString("gender"));
        student.setHostelRequired(rs.getBoolean("hostel_required"));
        student.setCreatedAt(rs.getTimestamp("created_at"));
        student.setUpdatedAt(rs.getTimestamp("updated_at"));
        return student;
    }
}