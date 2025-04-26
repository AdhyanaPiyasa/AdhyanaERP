// components/Administrator/other/exams/Reports/ReportsDashboard.js
const ReportsDashboard = () => {
    const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedReport, setSelectedReport] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [selectedType, setSelectedType] = MiniReact.useState('all');
    const [reports, setReports] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    const refreshPage = () => {
        window.location.reload();
    };

    // Mock report types for filtering
    const reportTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'exam', label: 'Exam Reports' },
        { value: 'course', label: 'Course Reports' },
        { value: 'student', label: 'Student Reports' },
        { value: 'faculty', label: 'Faculty Reports' }
    ];
    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8081/api/api/exams/reports`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Reports data:', data);

            if (data.success) {
                // Assuming the API returns an array of reports
                if(!data.data || !Array.isArray(data.data)){
                    throw new Error('Invalid data format received from API');
                }
                setReports(data.data);
            } else {
                setError(data.message || 'Failed to fetch reports data');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching reports:', error);
            // Fallback to mock data in case of error
            setReports(reportsData);
        } finally {
            setLoading(false);
        }
    };

    MiniReact.useEffect(() => {
        fetchReports();
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');

            if(!selectedReport || !selectedReport.reportId){
                throw new Error("Invalid report ID");
            }
            const response = await fetch(`http://localhost:8081/api/api/exams/reports/${selectedReport.reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if(data.success) {
                setReports(reports.filter(report => report.reportId !== selectedReport.reportId));
                setShowDeleteModal(false);
            } else {
                setError(data.message || 'Failed to delete report');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error deleting report:', error);
        }
    };

    // Mock reports data
    const reportsData = [
        {
            reportId: 1,
            title: "End of Semester Exam Results",
            courseName: "Introduction to Computer Science",
            examName: "Final Exam",
            type: "exam",
            date: "2025-01-15",
            creator: "Dr. Sarah Johnson",
            status: "published"
        },
        {
            reportId: 2,
            title: "Mid-term Progress Report",
            courseName: "Database Systems",
            examName: "Midterm Exam",
            type: "exam",
            date: "2025-02-10",
            creator: "Prof. Michael Chen",
            status: "draft"
        },
        {
            reportId: 3,
            title: "Course Completion Summary",
            courseName: "Software Engineering",
            examName: "N/A",
            type: "course",
            date: "2025-01-30",
            creator: "Dr. Emily Rodriguez",
            status: "published"
        },
        {
            reportId: 4,
            title: "Student Performance Analysis",
            courseName: "All Courses",
            examName: "N/A",
            type: "student",
            date: "2025-02-05",
            creator: "Dr. James Wilson",
            status: "published"
        },
        {
            reportId: 5,
            title: "Faculty Teaching Evaluation",
            courseName: "Various",
            examName: "N/A",
            type: "faculty",
            date: "2025-01-25",
            creator: "Dean Robert Brown",
            status: "draft"
        }
    ];

    // Filter reports based on search term and type filter
    const displayReports = reports.length > 0 ? reports : reportsData;

    // Filter reports based on search term and type filter
    const filteredReports = displayReports.filter(report => {
        const matchesSearch = 
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.examName && report.examName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            report.creator.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = selectedType === 'all' || report.type === selectedType;
        
        return matchesSearch && matchesType;
    });


    // Count reports by type for statistics
    const calculateStats = () => {
        const typeCounts = {};
        reportsData.forEach(report => {
            typeCounts[report.type] = (typeCounts[report.type] || 0) + 1;
        });
        
        return Object.keys(typeCounts).map(type => ({
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Reports`,
            value: typeCounts[type]
        }));
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const handleDeleteReport = (report) => {
        setSelectedReport(report);
        setShowDeleteModal(true);
    };

    // const handleDeleteConfirm = () => {
    //     console.log('Deleting report:', selectedReport);
    //     // API call would go here
    //     setShowDeleteModal(false);
    // };

    

    const generateReportOptions = [
        { label: 'Exam Results Report', icon: '📝', type: 'exam' },
        { label: 'Course Performance Report', icon: '📊', type: 'course' },
        { label: 'Student Progress Report', icon: '👨‍🎓', type: 'student' },
        { label: 'Faculty Evaluation Report', icon: '👨‍🏫', type: 'faculty' }
    ];

    return {
        type: 'div',
        props: {
            children: [
                // Header Section
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Reports Dashboard']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['Generate, view, and manage academic reports']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Statistics and Generate Reports Section 
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: theme.spacing.lg,
                            marginTop: theme.spacing.lg,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            // Generate Reports Card
                            {
                                type: Card,
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Generate New Report']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: theme.spacing.md
                                                },
                                                children: generateReportOptions.map(option => ({
                                                    type: Card,
                                                    props: {
                                                        variant: 'outlined',
                                                        style: {
                                                            padding: theme.spacing.md,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            textAlign: 'center',
                                                            height: '120px',
                                                            transition: 'all 0.2s ease',
                                                            backgroundColor: '#f8f8ff'
                                                        },
                                                        onClick: () => {
                                                            setShowCreateModal(true);
                                                            // We could pre-populate the form based on the type
                                                        },
                                                        children: [
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: { fontSize: '24px', marginBottom: theme.spacing.sm },
                                                                    children: [option.icon]
                                                                }
                                                            },
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: { fontWeight: 'bold' },
                                                                    children: [option.label]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }))
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Statistics Chart
                            {
                                type: Card,
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Reports Overview']
                                            }
                                        },
                                        {
                                            type: BarChart,
                                            props: {
                                                data: calculateStats(),
                                                height: 200
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginTop: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'span',
                                                                    props: {
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Total Reports: ']
                                                                    }
                                                                },
                                                                reportsData.length.toString()
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
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Published: ']
                                                                    }
                                                                },
                                                                reportsData.filter(r => r.status === 'published').length.toString()
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
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Drafts: ']
                                                                    }
                                                                },
                                                                reportsData.filter(r => r.status === 'draft').length.toString()
                                                            ]
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
                },

                // Filters Section
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md
                        },
                        children: [
                            // Report Type Filter
                            {
                                type: Select,
                                props: {
                                    label: 'Filter by Type',
                                    value: selectedType,
                                    onChange: (e) => setSelectedType(e.target.value),
                                    options: reportTypes,
                                    style: { width: '250px' }
                                }
                            },
                            
                            // Search Box
                            {
                                type: TextField,
                                props: {
                                    placeholder: 'Search reports...',
                                    value: searchTerm,
                                    onChange: (e) => setSearchTerm(e.target.value),
                                    style: { width: '300px' }
                                }
                            },
                            
                            // Create Report Button
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowCreateModal(true),
                                    children: '+ Create New Report'
                                }
                            }
                        ]
                    }
                },

                // Reports Table
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: ['Available Reports']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Title', 'Course', 'Type', 'Date', 'Creator', 'Status', 'Actions'],
                                    data: filteredReports.map(report => ({
                                        'Title': report.title,
                                        'Course': report.courseName,
                                        'Type': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    textTransform: 'capitalize'
                                                },
                                                children: [report.type]
                                            }
                                        },
                                        'Date': report.date,
                                        'Creator': report.creator,
                                        'Status': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: report.status === 'published' ? '#e6f7e6' : '#fff9e6',
                                                    color: report.status === 'published' ? '#2e7d32' : '#f59f00',
                                                    textTransform: 'capitalize'
                                                },
                                                children: [report.status]
                                            }
                                        },
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
                                                            children: 'View'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            size: 'small',
                                                            onClick: () => handleDeleteReport(report),
                                                            children: 'Delete'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // Modals
                showCreateModal && {
                    type: CreateReportForm,
                    props: {
                        onClose: () => setShowCreateModal(false)
                    }
                },
                showViewModal && {
                    type: ViewReportModal,
                    props: {
                        report: selectedReport,
                        onClose: () => setShowViewModal(false)
                    }
                },
                showDeleteModal && {
                    type: DeleteReportConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.ReportsDashboard = ReportsDashboard;