// components/student/exams/StudentAssignmentList.js
const StudentAssignmentList = () => {
    const [assignments, setAssignments] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [showDetailModal, setShowDetailModal] = MiniReact.useState(false);
    const [selectedAssignment, setSelectedAssignment] = MiniReact.useState(null);

    // Mock data - this would be replaced with an API call to fetch assignments
    const mockAssignments = [
        {
            id: 1,
            title: 'Programming Assignment 1',
            course: 'Data Structures',
            courseCode: 'CS1205',
            type: 'Individual',
            date: '2024-05-15',
            startTime: '09:00 AM',
            endTime: '11:59 PM',
            room: 'Online Submission',
            teacher: 'Dr. John Doe',
            description: 'Implement a balanced binary search tree and analyze its performance.',
            status: 'Pending'
        },
        {
            id: 2,
            title: 'Database Design Project',
            course: 'Database Systems',
            courseCode: 'CS1206',
            type: 'Group',
            date: '2024-06-10',
            startTime: '08:00 AM',
            endTime: '11:59 PM',
            room: 'Online Submission',
            teacher: 'Prof. Jane Smith',
            description: 'Design and implement a database for a university management system.',
            status: 'Submitted'
        },
        {
            id: 3,
            title: 'Web Application Development',
            course: 'Web Development',
            courseCode: 'CS1207',
            type: 'Individual',
            date: '2024-05-05',
            startTime: '09:00 AM',
            endTime: '11:59 PM',
            room: 'Online Submission',
            teacher: 'Dr. Bob Johnson',
            description: 'Create a responsive web application using HTML, CSS, and JavaScript.',
            status: 'Graded'
        }
    ];

    // Simulate API call to fetch assignments
    MiniReact.useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/exams/assignment', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${AppState.token || 'dev-token'}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch assignments: ${response.status} ${response.statusText}`);
                }
                
                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    console.log('Response text:', responseText);
                    throw new Error('Invalid response format');
                }
                
                if (!data.success) {
                    throw new Error(data.message || 'Failed to fetch assignments');
                }
                
                // Transform the API data format to match our component's expected format
                const formattedAssignments = (data.data || []).map(assignment => ({
                    id: assignment.id,
                    title: assignment.title,
                    course: assignment.course,
                    courseCode: assignment.courseCode,
                    type: assignment.type || 'Individual',
                    date: assignment.date,
                    startTime: assignment.startTime,
                    endTime: assignment.endTime,
                    room: assignment.room || 'Online Submission',
                    teacher: assignment.teacher,
                    description: assignment.description || 'No description provided.',
                    status: assignment.status || 'Pending'
                }));
                
                setAssignments(formattedAssignments);
                setError(null);
            } catch (err) {
                console.error('Error fetching assignments:', err);
                setError('Failed to load assignments. Please try again later.');
                // Fallback to mock data for demo/development purposes
                setAssignments([
                    {
                        id: 1,
                        title: 'Programming Assignment 1',
                        course: 'Data Structures',
                        courseCode: 'CS1205',
                        type: 'Individual',
                        date: '2024-05-15',
                        startTime: '09:00 AM',
                        endTime: '11:59 PM',
                        room: 'Online Submission',
                        teacher: 'Dr. John Doe',
                        description: 'Implement a balanced binary search tree and analyze its performance.',
                        status: 'Pending'
                    },
                    {
                        id: 2,
                        title: 'Database Design Project',
                        course: 'Database Systems',
                        courseCode: 'CS1206',
                        type: 'Group',
                        date: '2024-06-10',
                        startTime: '08:00 AM',
                        endTime: '11:59 PM',
                        room: 'Online Submission',
                        teacher: 'Prof. Jane Smith',
                        description: 'Design and implement a database for a university management system.',
                        status: 'Submitted'
                    },
                    {
                        id: 3,
                        title: 'Web Application Development',
                        course: 'Web Development',
                        courseCode: 'CS1207',
                        type: 'Individual',
                        date: '2024-05-05',
                        startTime: '09:00 AM',
                        endTime: '11:59 PM',
                        room: 'Online Submission',
                        teacher: 'Dr. Bob Johnson',
                        description: 'Create a responsive web application using HTML, CSS, and JavaScript.',
                        status: 'Graded'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Fetch a specific assignment by ID
    const fetchAssignmentDetails = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/exams/assignment/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AppState.token || 'dev-token'}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch assignment details: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch assignment details');
            }
            
            // Format the assignment details
            const formattedAssignment = {
                id: data.data.id,
                title: data.data.title,
                course: data.data.course,
                courseCode: data.data.courseCode,
                type: data.data.type || 'Individual',
                date: data.data.date,
                startTime: data.data.startTime,
                endTime: data.data.endTime,
                room: data.data.room || 'Online Submission',
                teacher: data.data.teacher,
                description: data.data.description || 'No description provided.',
                status: data.data.status || 'Pending'
            };
            
            setSelectedAssignment(formattedAssignment);
            setShowDetailModal(true);
        } catch (err) {
            console.error('Error fetching assignment details:', err);
            // If we already have the assignment in our list, use that instead
            const foundAssignment = assignments.find(a => a.id === id);
            if (foundAssignment) {
                setSelectedAssignment(foundAssignment);
                setShowDetailModal(true);
            } else {
                setError('Failed to load assignment details. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle submitting an assignment
    const handleSubmitAssignment = async (assignmentId) => {
        try {
            // This is a stub for the actual submission functionality
            // In a real implementation, you might open a file upload dialog
            // and then send the file to an endpoint
            console.log('Submitting assignment:', assignmentId);
            
            // Here you would typically call your backend API to submit the assignment
            // For example:
            
            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('assignmentId', assignmentId);
            
            const response = await fetch('http://localhost:8080/api/students/assignments/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AppState.token || 'dev-token'}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit assignment');
            }
            
            const data = await response.json();
            if (data.success) {
                // Update the assignment status in the local state
                setAssignments(prevAssignments => 
                    prevAssignments.map(a => 
                        a.id === assignmentId 
                            ? {...a, status: 'Submitted'} 
                            : a
                    )
                );
                // Also update the selected assignment if it's currently being viewed
                if (selectedAssignment && selectedAssignment.id === assignmentId) {
                    setSelectedAssignment({...selectedAssignment, status: 'Submitted'});
                }
                alert('Assignment submitted successfully!');
            } else {
                throw new Error(data.message || 'Failed to submit assignment');
            }
            
            
            // For now, we'll just simulate a successful submission
            alert('Assignment submission functionality would be implemented here.');
        } catch (err) {
            console.error('Error submitting assignment:', err);
            alert('Failed to submit assignment. Please try again later.');
        }
    };

    // Filter assignments based on search term
    const filteredAssignments = assignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort assignments by date (upcoming first)
    const sortedAssignments = [...filteredAssignments].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    // Determine if an assignment is upcoming (today or in the future)
    const isUpcoming = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const assignmentDate = new Date(dateString);
        assignmentDate.setHours(0, 0, 0, 0);
        return assignmentDate >= today;
    };

    // Format date to more readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return theme.colors.warning;
            case 'submitted':
                return theme.colors.primary;
            case 'graded':
                return theme.colors.success;
            default:
                return theme.colors.textSecondary;
        }
    };

    const handleViewDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setShowDetailModal(true);
    };

    const renderStatusBadge = (status) => ({
        type: 'span',
        props: {
            style: {
                backgroundColor: getStatusColor(status) + '22',
                color: getStatusColor(status),
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
                fontWeight: '500',
                fontSize: '14px'
            },
            children: [status]
        }
    });

    const renderAssignmentDetailModal = () => {
        if (!selectedAssignment || !showDetailModal) return null;

        return {
            type: Modal,
            props: {
                isOpen: showDetailModal,
                onClose: () => setShowDetailModal(false),
                title: selectedAssignment.title,
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
                                        style: { marginBottom: theme.spacing.md },
                                        children: [
                                            {
                                                type: 'h3',
                                                props: {
                                                    style: { 
                                                        marginBottom: theme.spacing.xs,
                                                        color: theme.colors.textSecondary
                                                    },
                                                    children: ['Course']
                                                }
                                            },
                                            {
                                                type: 'p',
                                                props: {
                                                    children: [`${selectedAssignment.course} (${selectedAssignment.courseCode})`]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: { 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: theme.spacing.md
                                        },
                                        children: [
                                            {
                                                type: 'div',
                                                props: {
                                                    children: [
                                                        {
                                                            type: 'h3',
                                                            props: {
                                                                style: { 
                                                                    marginBottom: theme.spacing.xs,
                                                                    color: theme.colors.textSecondary
                                                                },
                                                                children: ['Due Date']
                                                            }
                                                        },
                                                        {
                                                            type: 'p',
                                                            props: {
                                                                children: [formatDate(selectedAssignment.date)]
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
                                                            type: 'h3',
                                                            props: {
                                                                style: { 
                                                                    marginBottom: theme.spacing.xs,
                                                                    color: theme.colors.textSecondary
                                                                },
                                                                children: ['Submission Time']
                                                            }
                                                        },
                                                        {
                                                            type: 'p',
                                                            props: {
                                                                children: [`Before ${selectedAssignment.endTime}`]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: { 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: theme.spacing.md
                                        },
                                        children: [
                                            {
                                                type: 'div',
                                                props: {
                                                    children: [
                                                        {
                                                            type: 'h3',
                                                            props: {
                                                                style: { 
                                                                    marginBottom: theme.spacing.xs,
                                                                    color: theme.colors.textSecondary
                                                                },
                                                                children: ['Type']
                                                            }
                                                        },
                                                        {
                                                            type: 'p',
                                                            props: {
                                                                children: [selectedAssignment.type]
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
                                                            type: 'h3',
                                                            props: {
                                                                style: { 
                                                                    marginBottom: theme.spacing.xs,
                                                                    color: theme.colors.textSecondary
                                                                },
                                                                children: ['Status']
                                                            }
                                                        },
                                                        renderStatusBadge(selectedAssignment.status)
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: { marginBottom: theme.spacing.md },
                                        children: [
                                            {
                                                type: 'h3',
                                                props: {
                                                    style: { 
                                                        marginBottom: theme.spacing.xs,
                                                        color: theme.colors.textSecondary
                                                    },
                                                    children: ['Description']
                                                }
                                            },
                                            {
                                                type: 'p',
                                                props: {
                                                    children: [selectedAssignment.description]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: { marginBottom: theme.spacing.md },
                                        children: [
                                            {
                                                type: 'h3',
                                                props: {
                                                    style: { 
                                                        marginBottom: theme.spacing.xs,
                                                        color: theme.colors.textSecondary
                                                    },
                                                    children: ['Instructor']
                                                }
                                            },
                                            {
                                                type: 'p',
                                                props: {
                                                    children: [selectedAssignment.teacher]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: theme.spacing.lg
                            },
                            children: [
                                {
                                    type: Button,
                                    props: {
                                        variant: 'secondary',
                                        onClick: () => setShowDetailModal(false),
                                        children: ['Close']
                                    }
                                },
                                selectedAssignment.status === 'Pending' && {
                                    type: Button,
                                    props: {
                                        onClick: () => console.log('Submit assignment:', selectedAssignment.id),
                                        children: ['Submit Assignment']
                                    }
                                }
                            ].filter(Boolean)
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
                                                placeholder: 'Search assignments by title, course or code...',
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
                            } : sortedAssignments.length === 0 ? {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.lg,
                                        textAlign: 'center',
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['No assignments found.']
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
                                                children: ['Upcoming Assignments']
                                            }
                                        },
                                        {
                                            type: Table,
                                            props: {
                                                headers: ['Title', 'Course', 'Due Date', 'Type', 'Status', 'Actions'],
                                                data: sortedAssignments
                                                    .filter(assignment => isUpcoming(assignment.date))
                                                    .map(assignment => ({
                                                        'Title': assignment.title,
                                                        'Course': `${assignment.course} (${assignment.courseCode})`,
                                                        'Due Date': `${formatDate(assignment.date)} by ${assignment.endTime}`,
                                                        'Type': assignment.type,
                                                        'Status': renderStatusBadge(assignment.status),
                                                        'Actions': {
                                                            type: Button,
                                                            props: {
                                                                variant: 'secondary',
                                                                size: 'small',
                                                                onClick: () => handleViewDetails(assignment),
                                                                children: ['View Details']
                                                            }
                                                        }
                                                    })),
                                                onRowClick: (row, index) => handleViewDetails(sortedAssignments.filter(a => isUpcoming(a.date))[index])
                                            }
                                        },
                                        {
                                            type: 'h2',
                                            props: {
                                                style: {
                                                    margin: `${theme.spacing.xl} 0 ${theme.spacing.md}`,
                                                    fontSize: theme.typography.h2.fontSize
                                                },
                                                children: ['Past Assignments']
                                            }
                                        },
                                        {
                                            type: Table,
                                            props: {
                                                headers: ['Title', 'Course', 'Due Date', 'Type', 'Status', 'Actions'],
                                                data: sortedAssignments
                                                    .filter(assignment => !isUpcoming(assignment.date))
                                                    .map(assignment => ({
                                                        'Title': assignment.title,
                                                        'Course': `${assignment.course} (${assignment.courseCode})`,
                                                        'Due Date': `${formatDate(assignment.date)} by ${assignment.endTime}`,
                                                        'Type': assignment.type,
                                                        'Status': renderStatusBadge(assignment.status),
                                                        'Actions': {
                                                            type: Button,
                                                            props: {
                                                                variant: 'secondary',
                                                                size: 'small',
                                                                onClick: () => handleViewDetails(assignment),
                                                                children: ['View Details']
                                                            }
                                                        }
                                                    })),
                                                onRowClick: (row, index) => handleViewDetails(sortedAssignments.filter(a => !isUpcoming(a.date))[index])
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                renderAssignmentDetailModal()
            ].filter(Boolean)
        }
    };
};

window.StudentAssignmentList = StudentAssignmentList;