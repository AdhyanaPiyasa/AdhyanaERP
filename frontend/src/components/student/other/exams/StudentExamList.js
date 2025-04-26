// components/student/exams/StudentExamList.js
const StudentExamList = () => {
    const [exams, setExams] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');

    // Mock data - this would be replaced with an API call to fetch exams
    const mockExams = [
        {
            id: 1,
            title: 'Midterm Exam',
            course: 'Data Structures',
            courseCode: 'CS1205',
            date: '2024-05-20',
            startTime: '09:00 AM',
            endTime: '11:00 AM',
            room: 'Auditorium 1',
            teacher: 'Dr. John Doe'
        },
        {
            id: 2,
            title: 'Final Exam',
            course: 'Database Systems',
            courseCode: 'CS1206',
            date: '2024-06-15',
            startTime: '02:00 PM',
            endTime: '04:00 PM',
            room: 'Room 2B',
            teacher: 'Prof. Jane Smith'
        },
        {
            id: 3,
            title: 'Quiz 2',
            course: 'Web Development',
            courseCode: 'CS1207',
            date: '2024-05-10',
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            room: 'Lab 3',
            teacher: 'Dr. Bob Johnson'
        }
    ];

    // Simulate API call to fetch exams
    MiniReact.useEffect(() => {
        // In a real implementation, you would fetch data from your API
        setTimeout(() => {
            setExams(mockExams);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter exams based on search term
    const filteredExams = exams.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exam.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort exams by date (upcoming first)
    const sortedExams = [...filteredExams].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    // Determine if an exam is upcoming (today or in the future)
    const isUpcoming = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(dateString);
        examDate.setHours(0, 0, 0, 0);
        return examDate >= today;
    };

    // Format date to more readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'default',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                placeholder: 'Search exams by title, course or code...',
                                                value: searchTerm,
                                                onChange: (e) => setSearchTerm(e.target.value)
                                            }
                                        }
                                    ]
                                }
                            },
                            loading ? {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: theme.spacing.xl
                                    },
                                    children: [
                                        {
                                            type: LoadingSpinner,
                                            props: {}
                                        }
                                    ]
                                }
                            } : error ? {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        padding: theme.spacing.lg,
                                        textAlign: 'center'
                                    },
                                    children: [error]
                                }
                            } : sortedExams.length === 0 ? {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.lg,
                                        textAlign: 'center',
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['No exams found.']
                                }
                            } : {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: {
                                                    marginBottom: theme.spacing.md,
                                                    fontSize: theme.typography.h2.fontSize
                                                },
                                                children: ['Upcoming Exams']
                                            }
                                        },
                                        {
                                            type: Table,
                                            props: {
                                                headers: ['Exam Title', 'Course', 'Date', 'Time', 'Room', 'Teacher'],
                                                data: sortedExams
                                                    .filter(exam => isUpcoming(exam.date))
                                                    .map(exam => ({
                                                        'Exam Title': exam.title,
                                                        'Course': `${exam.course} (${exam.courseCode})`,
                                                        'Date': formatDate(exam.date),
                                                        'Time': `${exam.startTime} - ${exam.endTime}`,
                                                        'Room': exam.room,
                                                        'Teacher': exam.teacher
                                                    }))
                                            }
                                        },
                                        {
                                            type: 'h2',
                                            props: {
                                                style: {
                                                    margin: `${theme.spacing.xl} 0 ${theme.spacing.md}`,
                                                    fontSize: theme.typography.h2.fontSize
                                                },
                                                children: ['Past Exams']
                                            }
                                        },
                                        {
                                            type: Table,
                                            props: {
                                                headers: ['Exam Title', 'Course', 'Date', 'Time', 'Room', 'Teacher'],
                                                data: sortedExams
                                                    .filter(exam => !isUpcoming(exam.date))
                                                    .map(exam => ({
                                                        'Exam Title': exam.title,
                                                        'Course': `${exam.course} (${exam.courseCode})`,
                                                        'Date': formatDate(exam.date),
                                                        'Time': `${exam.startTime} - ${exam.endTime}`,
                                                        'Room': exam.room,
                                                        'Teacher': exam.teacher
                                                    }))
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.StudentExamList = StudentExamList;