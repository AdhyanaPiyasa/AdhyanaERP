// components/student/exams/StudentReportsList.js
const StudentReportsList = () => {
    const [reports, setReports] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [selectedReport, setSelectedReport] = MiniReact.useState(null);
    const [showReportModal, setShowReportModal] = MiniReact.useState(false);

    // Mock data - this would be replaced with an API call to fetch reports
    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:8081/api/students/reports', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Reports data:', data);
            
            if (data.success) {
                // Assuming the API returns data in the expected format
                setReports(data.data || []);
                setError(null);
            } else {
                throw new Error(data.message || 'Failed to fetch reports');
            }
        } catch (error) {
            setError(error.message || 'Failed to load reports');
            console.error('Error fetching reports:', error);
            
            // Fallback to mock data in case of failure (for development)
            setReports(mockReports);
        } finally {
            setLoading(false);
        }
    };

    // Download report function
    const downloadReport = async (reportId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8081/api/students/reports/${reportId}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to download report: ${response.status}`);
            }
            
            // Handle the file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `report-${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again later.');
        }
    };
    const mockReports = [
        {
            id: 1,
            title: 'Spring 2024 Semester Report',
            type: 'Semester Report',
            date: '2024-06-30',
            status: 'Available',
            description: 'Comprehensive semester performance report for Spring 2024',
            content: {
                courses: [
                    { code: 'CS1205', name: 'Data Structures', grade: 'B+', credits: 3 },
                    { code: 'CS1206', name: 'Database Systems', grade: 'A', credits: 3 },
                    { code: 'CS1207', name: 'Web Development', grade: 'A-', credits: 3 }
                ],
                gpa: 3.67,
                comments: 'Excellent performance overall. Student demonstrates strong understanding of core computer science concepts.'
            }
        },
        {
            id: 2,
            title: 'Fall 2023 Semester Report',
            type: 'Semester Report',
            date: '2023-12-31',
            status: 'Available',
            description: 'Comprehensive semester performance report for Fall 2023',
            content: {
                courses: [
                    { code: 'CS1101', name: 'Introduction to Programming', grade: 'A', credits: 3 },
                    { code: 'CS1102', name: 'Discrete Mathematics', grade: 'B+', credits: 3 },
                    { code: 'CS1103', name: 'Computer Architecture', grade: 'A-', credits: 3 }
                ],
                gpa: 3.78,
                comments: 'Strong academic performance. Student shows excellent programming skills and good mathematical foundations.'
            }
        },
        {
            id: 3,
            title: 'CS1205 Course Report',
            type: 'Course Report',
            date: '2024-06-15',
            status: 'Available',
            description: 'Detailed performance report for Data Structures course',
            content: {
                course: { code: 'CS1205', name: 'Data Structures', grade: 'B+', credits: 3 },
                assignments: [
                    { title: 'Assignment 1', grade: '90%', weight: '10%' },
                    { title: 'Assignment 2', grade: '85%', weight: '10%' },
                    { title: 'Assignment 3', grade: '92%', weight: '10%' }
                ],
                exams: [
                    { title: 'Midterm Exam', grade: '88%', weight: '30%' },
                    { title: 'Final Exam', grade: '85%', weight: '40%' }
                ],
                comments: 'Student demonstrates good understanding of data structures concepts. Implementation skills are strong, but could improve on theoretical analysis.'
            }
        },
        {
            id: 4,
            title: 'Academic Progress Report',
            type: 'Progress Report',
            date: '2024-03-15',
            status: 'Available',
            description: 'Mid-semester progress evaluation',
            content: {
                courses: [
                    { code: 'CS1205', name: 'Data Structures', status: 'Good Standing', attendance: '92%' },
                    { code: 'CS1206', name: 'Database Systems', status: 'Excellent', attendance: '95%' },
                    { code: 'CS1207', name: 'Web Development', status: 'Good Standing', attendance: '90%' }
                ],
                comments: 'Student is making good progress in all courses. Regular attendance and active participation are commendable.'
            }
        }
    ];

    // Simulate API call to fetch reports
    MiniReact.useEffect(() => {
        // In a real implementation, you would fetch data from your API
        setTimeout(() => {
            setReports(mockReports);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter reports based on search term
    const filteredReports = reports.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        report.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort reports by date (newest first)
    const sortedReports = [...filteredReports].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Handle view report
    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowReportModal(true);
    };

    // Get color based on grade
    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return theme.colors.success;
        if (grade.startsWith('B')) return '#4f86f7'; // Bright blue
        if (grade.startsWith('C')) return '#f0ad4e'; // Orange-yellow
        if (grade.startsWith('D')) return theme.colors.warning;
        if (grade.startsWith('F')) return theme.colors.error;
        return theme.colors.textPrimary;
    };

    // Render grade badge
    const renderGradeBadge = (grade) => ({
        type: 'span',
        props: {
            style: {
                color: getGradeColor(grade),
                fontWeight: 'bold'
            },
            children: [grade]
        }
    });

    // Render status badge
    const renderStatusBadge = (status) => {
        let color;
        switch (status.toLowerCase()) {
            case 'available':
                color = theme.colors.success;
                break;
            case 'pending':
                color = theme.colors.warning;
                break;
            case 'not available':
                color = theme.colors.error;
                break;
            default:
                color = theme.colors.textSecondary;
        }

        return {
            type: 'span',
            props: {
                style: {
                    backgroundColor: color + '22',
                    color: color,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.sm,
                    fontWeight: '500',
                    fontSize: '14px'
                },
                children: [status]
            }
        };
    };

    // Render report modal
    const renderReportModal = () => {
        if (!selectedReport || !showReportModal) return null;

        const renderSemesterReport = (content) => ({
            type: 'div',
            props: {
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: 'h3',
                                    props: {
                                        children: ['Semester GPA']
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontSize: '24px',
                                            fontWeight: 'bold'
                                        },
                                        children: [content.gpa.toFixed(2)]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'h3',
                        props: {
                            style: { marginBottom: theme.spacing.sm },
                            children: ['Courses']
                        }
                    },
                    {
                        type: Table,
                        props: {
                            headers: ['Code', 'Course Name', 'Grade', 'Credits'],
                            data: content.courses.map(course => ({
                                'Code': course.code,
                                'Course Name': course.name,
                                'Grade': renderGradeBadge(course.grade),
                                'Credits': course.credits
                            }))
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                marginTop: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: 'h3',
                                    props: {
                                        style: { marginBottom: theme.spacing.sm },
                                        children: ['Faculty Comments']
                                    }
                                },
                                {
                                    type: 'p',
                                    props: {
                                        style: {
                                            fontStyle: 'italic',
                                            padding: theme.spacing.md,
                                            backgroundColor: '#f7f9fc',
                                            borderRadius: theme.borderRadius.md,
                                            borderLeft: `4px solid ${theme.colors.primary}`
                                        },
                                        children: [content.comments]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        const renderCourseReport = (content) => ({
            type: 'div',
            props: {
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: theme.spacing.lg,
                                backgroundColor: '#f7f9fc',
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md
                            },
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        children: [
                                            {
                                                type: 'h3',
                                                props: {
                                                    children: [content.course.name]
                                                }
                                            },
                                            {
                                                type: 'p',
                                                props: {
                                                    style: { color: theme.colors.textSecondary },
                                                    children: [content.course.code]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: { textAlign: 'right' },
                                        children: [
                                            {
                                                type: 'p',
                                                props: {
                                                    style: { color: theme.colors.textSecondary },
                                                    children: ['Final Grade']
                                                }
                                            },
                                            {
                                                type: 'div',
                                                props: {
                                                    style: {
                                                        fontSize: '24px',
                                                        fontWeight: 'bold',
                                                        color: getGradeColor(content.course.grade)
                                                    },
                                                    children: [content.course.grade]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'h3',
                        props: {
                            style: { marginBottom: theme.spacing.sm },
                            children: ['Assignments']
                        }
                    },
                    {
                        type: Table,
                        props: {
                            headers: ['Assignment', 'Grade', 'Weight'],
                            data: content.assignments.map(assignment => ({
                                'Assignment': assignment.title,
                                'Grade': assignment.grade,
                                'Weight': assignment.weight
                            }))
                        }
                    },
                    {
                        type: 'h3',
                        props: {
                            style: { margin: `${theme.spacing.lg} 0 ${theme.spacing.sm}` },
                            children: ['Exams']
                        }
                    },
                    {
                        type: Table,
                        props: {
                            headers: ['Exam', 'Grade', 'Weight'],
                            data: content.exams.map(exam => ({
                                'Exam': exam.title,
                                'Grade': exam.grade,
                                'Weight': exam.weight
                            }))
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                marginTop: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: 'h3',
                                    props: {
                                        style: { marginBottom: theme.spacing.sm },
                                        children: ['Instructor Comments']
                                    }
                                },
                                {
                                    type: 'p',
                                    props: {
                                        style: {
                                            fontStyle: 'italic',
                                            padding: theme.spacing.md,
                                            backgroundColor: '#f7f9fc',
                                            borderRadius: theme.borderRadius.md,
                                            borderLeft: `4px solid ${theme.colors.primary}`
                                        },
                                        children: [content.comments]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        const renderProgressReport = (content) => ({
            type: 'div',
            props: {
                children: [
                    {
                        type: 'h3',
                        props: {
                            style: { marginBottom: theme.spacing.sm },
                            children: ['Course Progress']
                        }
                    },
                    {
                        type: Table,
                        props: {
                            headers: ['Code', 'Course Name', 'Status', 'Attendance'],
                            data: content.courses.map(course => ({
                                'Code': course.code,
                                'Course Name': course.name,
                                'Status': course.status,
                                'Attendance': course.attendance
                            }))
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                marginTop: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: 'h3',
                                    props: {
                                        style: { marginBottom: theme.spacing.sm },
                                        children: ['Comments']
                                    }
                                },
                                {
                                    type: 'p',
                                    props: {
                                        style: {
                                            fontStyle: 'italic',
                                            padding: theme.spacing.md,
                                            backgroundColor: '#f7f9fc',
                                            borderRadius: theme.borderRadius.md,
                                            borderLeft: `4px solid ${theme.colors.primary}`
                                        },
                                        children: [content.comments]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        const renderReportContent = () => {
            switch (selectedReport.type) {
                case 'Semester Report':
                    return renderSemesterReport(selectedReport.content);
                case 'Course Report':
                    return renderCourseReport(selectedReport.content);
                case 'Progress Report':
                    return renderProgressReport(selectedReport.content);
                default:
                    return {
                        type: 'div',
                        props: {
                            children: ['Report content not available']
                        }
                    };
            }
        };

        return {
            type: Modal,
            props: {
                isOpen: showReportModal,
                onClose: () => setShowReportModal(false),
                title: selectedReport.title,
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                marginBottom: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: theme.spacing.lg,
                                            padding: theme.spacing.md,
                                            backgroundColor: '#f0f7ff',
                                            borderRadius: theme.borderRadius.md
                                        },
                                        children: [
                                            {
                                                type: 'div',
                                                props: {
                                                    children: [
                                                        {
                                                            type: 'span',
                                                            props: {
                                                                style: { 
                                                                    color: theme.colors.textSecondary,
                                                                    marginRight: theme.spacing.sm
                                                                },
                                                                children: ['Report Type:']
                                                            }
                                                        },
                                                        {
                                                            type: 'span',
                                                            props: {
                                                                style: { fontWeight: '500' },
                                                                children: [selectedReport.type]
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                type: 'div',
                                                props: {
                                                    children: [
                                                        {
                                                            type: 'span',
                                                            props: {
                                                                style: { 
                                                                    color: theme.colors.textSecondary,
                                                                    marginRight: theme.spacing.sm
                                                                },
                                                                children: ['Date:']
                                                            }
                                                        },
                                                        {
                                                            type: 'span',
                                                            props: {
                                                                style: { fontWeight: '500' },
                                                                children: [formatDate(selectedReport.date)]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                renderReportContent()
                            ]
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between'
                            },
                            children: [
                                {
                                    type: Button,
                                    props: {
                                        variant: 'secondary',
                                        onClick: () => setShowReportModal(false),
                                        children: ['Close']
                                    }
                                },
                                {
                                    type: Button,
                                    props: {
                                        onClick: () => {
                                            console.log('Download report:', selectedReport.id);
                                            // In a real implementation, this would trigger a download
                                        },
                                        children: ['Download Report']
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };
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
                                                placeholder: 'Search reports...',
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
                            } : sortedReports.length === 0 ? {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.lg,
                                        textAlign: 'center',
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['No reports found.']
                                }
                            } : {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: Table,
                                            props: {
                                                headers: ['Report Title', 'Type', 'Date', 'Status', 'Actions'],
                                                data: sortedReports.map(report => ({
                                                    'Report Title': report.title,
                                                    'Type': report.type,
                                                    'Date': formatDate(report.date),
                                                    'Status': renderStatusBadge(report.status),
                                                    'Actions': {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                display: 'flex',
                                                                gap: theme.spacing.sm
                                                            },
                                                            children: [
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        onClick: () => handleViewReport(report),
                                                                        children: ['View Report']
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        onClick: () => {
                                                                            console.log('Download report:', report.id);
                                                                            // In a real implementation, this would trigger a download
                                                                        },
                                                                        children: ['Download']
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                })),
                                                onRowClick: (row, index) => handleViewReport(sortedReports[index])
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                renderReportModal()
            ].filter(Boolean)
        }
    };
};

window.StudentReportsList = StudentReportsList;