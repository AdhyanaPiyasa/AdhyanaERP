// components/teacher/courses/TeacherCourseDetail/Attendance/AttendanceRecords.js
const AttendanceRecords = ({ courseId, onBack }) => {
    const [records, setRecords] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);

    // Fetch attendance history for the course
    MiniReact.useEffect(() => {
        const fetchAttendanceHistory = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Get the auth token
                const token = localStorage.getItem('token');
                
                // Make the API request to get attendance history
                const response = await fetch(`http://localhost:8081/api/api/students/attendance/history/${courseId}`, {
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
                    // Map the backend data to our frontend format
                    const formattedRecords = data.data.map(session => ({
                        id: session.id,
                        date: formatDate(session.date),
                        percentage: calculatePercentage(session.presentStudents, session.totalStudents),
                        presentStudents: session.presentStudents,
                        totalStudents: session.totalStudents
                    }));
                    
                    setRecords(formattedRecords);
                } else {
                    setError(data.message || "Failed to fetch attendance records");
                    console.error("API error:", data.message);
                }
            } catch (error) {
                setError(`Error fetching attendance records: ${error.message}`);
                console.error("Error fetching attendance history:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAttendanceHistory();
    }, [courseId]);
    
    // Helper function to format date (YYYY-MM-DD to DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    
    // Helper function to calculate percentage
    const calculatePercentage = (present, total) => {
        if (!total || total === 0) return 0;
        return Math.round((present / total) * 100);
    };

    return {
        type: 'div',
        props: {
            children: [
                // Header with back button
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    onClick: onBack,
                                    variant: 'secondary',
                                    children: '← Back'
                                }
                            },
                            {
                                type: 'h2',
                                props: {
                                    style: {
                                        marginLeft: theme.spacing.lg
                                    },
                                    children: ['Attendance Records']
                                }
                            }
                        ]
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
                
                // Loading spinner or records table
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
                } : records.length === 0 ? {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.lg,
                            textAlign: 'center',
                            color: '#666'
                        },
                        children: ['No attendance records found for this course.']
                    }
                } : {
                    type: Table,
                    props: {
                        headers: ['Date', 'Present', 'Total', 'Attendance Percentage'],
                        data: records.map(record => ({
                            'Date': record.date,
                            'Present': record.presentStudents.toString(),
                            'Total': record.totalStudents.toString(),
                            'Attendance Percentage': `${record.percentage}%`
                        }))
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.AttendanceRecords = AttendanceRecords;