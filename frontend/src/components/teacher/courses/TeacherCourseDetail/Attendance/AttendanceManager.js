// components/teacher/courses/TeacherCourseDetail/Attendance/AttendanceManager.js
const AttendanceManager = ({ courseId }) => {
    const [selectedDate, setSelectedDate] = MiniReact.useState(new Date().toISOString().split('T')[0]);
    const [showRecords, setShowRecords] = MiniReact.useState(false);
    const [attendancePercentage, setAttendancePercentage] = MiniReact.useState(null);
    const [loading, setLoading] = MiniReact.useState(false);
    const [submitLoading, setSubmitLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [success, setSuccess] = MiniReact.useState(null);
    
    // Students data state
    const [students, setStudents] = MiniReact.useState([
        { id: 1001, name: "Alice Smith", attendance: "present" },
        { id: 1002, name: "Bob Johnson", attendance: "present" },
        { id: 1003, name: "Charlie Brown", attendance: "present" },
        { id: 1004, name: "Diana Prince", attendance: "present" },
        { id: 1005, name: "Edward Clark", attendance: "present" },
        { id: 1006, name: "Fiona Martinez", attendance: "present" }
    ]);

    // Fetch students with attendance status for the selected date and course
    const fetchStudentsForSession = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Get the auth token
            const token = localStorage.getItem('token');
            
            // Construct API URL - format: /attendance/mark/{courseCode}/{date}
            const url = `http://localhost:8081/api/api/students/attendance/mark/${courseId}/${selectedDate}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Map the backend data structure to our frontend structure
                const mappedStudents = data.data.map(student => ({
                    id: student.studentIndex,
                    name: student.studentName || `Student ${student.studentIndex}`, // Use a fallback if name not provided
                    attendance: student.present ? "present" : "absent"
                }));
                
                setStudents(mappedStudents);
            } else {
                setError(data.message || "Failed to fetch student attendance data");
                console.error("API error:", data.message);
            }
        } catch (error) {
            setError(`Error fetching student data: ${error.message}`);
            console.error("Error fetching students for session:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch students when date or courseId changes
    MiniReact.useEffect(() => {
        fetchStudentsForSession();
    }, [selectedDate, courseId]);
    
    // Handle attendance change for a student
    const handleAttendanceChange = (studentId, value) => {
        const updatedStudents = students.map(student => 
            student.id === studentId ? { ...student, attendance: value } : student
        );
        setStudents(updatedStudents);
    };

    // Submit attendance data to the backend
    const handleSubmit = async () => {
        setSubmitLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            // Get the auth token
            const token = localStorage.getItem('token');
            
            // Format the attendance data for the backend
            const studentAttendanceData = students.map(student => ({
                index: student.id,
                present: student.attendance === "present"
            }));
            
            const submissionData = {
                courseCode: courseId,
                date: selectedDate,
                students: studentAttendanceData
            };
            
            // Send the POST request to submit attendance
            const response = await fetch('http://localhost:8081/api/api/students/attendance/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess("Attendance submitted successfully!");
                // Optionally update attendance percentage after submission
                if (data.data && data.data.presentStudents !== undefined && data.data.totalStudents !== undefined) {
                    const percentage = Math.round((data.data.presentStudents / data.data.totalStudents) * 100);
                    setAttendancePercentage(percentage);
                }
            } else {
                setError(data.message || "Failed to submit attendance");
            }
        } catch (error) {
            setError(`Error submitting attendance: ${error.message}`);
            console.error("Error submitting attendance:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Calculate attendance percentage from current state
    const calculateAttendancePercentage = () => {
        const presentCount = students.filter(s => s.attendance === "present").length;
        const percentage = Math.round((presentCount / students.length) * 100);
        setAttendancePercentage(percentage);
    };

    // If we're showing the attendance records view
    if (showRecords) {
        return {
            type: AttendanceRecords,
            props: {
                courseId,
                onBack: () => setShowRecords(false)
            }
        };
    }

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Attendance']
                    }
                },
                
                // Error message
                error && {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.md,
                            backgroundColor: '#ffebee',
                            color: theme.colors.error,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.md
                        },
                        children: [error]
                    }
                },
                
                // Success message
                success && {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.md,
                            backgroundColor: '#e8f5e9',
                            color: theme.colors.success,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.md
                        },
                        children: [success]
                    }
                },
                
                // Date input
                {
                    type: 'div',
                    props: {
                        style: {
                            marginBottom: theme.spacing.lg,
                            backgroundColor: '#f5f5f5',
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md
                        },
                        children: [
                            {
                                type: 'input',
                                props: {
                                    type: 'date',
                                    value: selectedDate,
                                    onChange: (e) => setSelectedDate(e.target.value),
                                    style: {
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        border: '1px solid #ccc',
                                        borderRadius: theme.borderRadius.sm,
                                        fontSize: '16px'
                                    }
                                }
                            }
                        ]
                    }
                },
                
                // Loading spinner or attendance table
                loading ? {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            padding: theme.spacing.lg
                        },
                        children: [{
                            type: LoadingSpinner,
                            props: {}
                        }]
                    }
                } : {
                    type: Table,
                    props: {
                        headers: ['Index Number', 'Name', 'Status'],
                        data: students.map(student => ({
                            'Index Number': student.id.toString(),
                            'Name': student.name,
                            'Status': {
                                type: Select,
                                props: {
                                    value: student.attendance,
                                    onChange: (e) => handleAttendanceChange(student.id, e.target.value),
                                    options: [
                                        { value: 'present', label: 'Present' },
                                        { value: 'absent', label: 'Absent' }
                                    ]
                                }
                            }
                        }))
                    }
                },
                
                // Action Buttons
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: theme.spacing.md
                        },
                        children: [
                            // Button group at right
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end', 
                                        alignItems: 'center',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                       // View records button
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => setShowRecords(true),
                                                children: 'Attendance records'
                                            }
                                        },
                                        // Calculate percentage button
                                        {
                                            type: Button,
                                            props: {
                                                onClick: calculateAttendancePercentage,
                                                children: 'Total percentage today'
                                            }
                                        },
                                        // Submit button
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                disabled: submitLoading,
                                                children: submitLoading ? 'Submitting...' : 'Submit today Attendance'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Attendance percentage display
                attendancePercentage !== null && {
                    type: 'div',
                    props: {
                        style: {
                            marginTop: theme.spacing.lg,
                            padding: theme.spacing.md,
                            backgroundColor: '#f5f5f5',
                            borderRadius: theme.borderRadius.md,
                            textAlign: 'center'
                        },
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: [`Attendance Percentage: ${attendancePercentage}%`]
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.AttendanceManager = AttendanceManager;