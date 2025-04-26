// components/teacher/Assignments/AssignmentDashboard.js
const AssignmentDashboard = () => {
    const [assignment, setAssignment] = MiniReact.useState([]);   
    const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedAssignment, setSelectedAssignment] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [loading, setLoading] = MiniReact.useState(true);
    //helper function fro page refresh
    const refreshPage = () => {
        window.location.reload();
    };

    //get the assignment ID from the route
    const route = navigation.getCurrentRoute();
    const assignmentId = route.split('/')[1]; // Assuming the ID is the last part of the route

    const fetchAssignmentDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8081/api/api/exams/assignment/${assignmentId}`, {
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
            console.log('Assignment details:', data);

            if (data.success) {
                // Assuming the API returns an array of assignments
                if(!data.data|| !Array.isArray(data.data)){
                    throw new Error('Invalid data format received from API');
                }
                setAssignment(data.data);
            } else {
                setError(data.message||'Failed to fetch assignment details');
            }
        }catch (error) {
                setError(error.message);
                console.error('Error fetching assignment details:', error);
        }finally {
                setLoading(false);
        }
    };    

    MiniReact.useEffect(() => {
        fetchAssignmentDetails();
    }, []);

 const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');

            if(!selectedAssignment||!selectedAssignment.id){
                throw new Error("Invalid assignment ID");
            }
            const response = await fetch(`http://localhost:8081/api/api/exams/assignment/${selectedAssignment.id}`, {
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
                setAssignment(assignments.filter(assignment => assignment.id !== selectedAssignment.id));
                setShowDeleteModal(false);
            } else {
                setError(data.message||'Failed to delete assignment');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error deleting assignment:', error);
        }
    };

    

    

    // Mock assignments data
    const assignments = [
        {
            id: 1,
            title: "Research Paper",
            course: "Advanced Database Systems",
            courseCode: 3201,
            type: "Take home",
            date: "2025-05-10",
            startTime: "09:00 AM",
            endTime: "11:00 AM",
            room: "Online",
            teacher: "Dr. Sarah Johnson"
        },
        {
            id: 2,
            title: "Programming Project",
            course: "Software Engineering",
            courseCode: 2105,
            type: "Group project",
            date: "2025-05-15",
            startTime: "10:00 AM",
            endTime: "12:00 PM",
            room: "Lab 3",
            teacher: "Prof. Michael Chen"
        },
        {
            id: 3,
            title: "Case Study Analysis",
            course: "Business Information Systems",
            courseCode: 3105,
            type: "Individual",
            date: "2025-05-20",
            startTime: "02:00 PM",
            endTime: "04:00 PM",
            room: "Room 205",
            teacher: "Dr. Emily Rodriguez"
        }
    ];

    // Filter assignments based on search term
    const filteredAssignments = assignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setShowEditModal(true);
    };

    const handleDelete = (assignment) => {
        setSelectedAssignment(assignment);
        setShowDeleteModal(true);
    };

    // const handleDeleteConfirm = () => {
    //     console.log('Deleting assignment:', selectedAssignment);
    //     // API call would go here
    //     setShowDeleteModal(false);
    // };


    const quickLinks = [
        { title: 'Create Assignment', link: 'teacher/Assignments/Create' },
        { title: 'Past Assignments', link: 'teacher/exams/Assignments/Past' },
        { title: 'View Student Submissions', link: 'teacher/Assignments/Submissions' }
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
                                                children: ['Assignment Dashboard']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['Manage assignments, view submissions, and track student progress']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Quick Links Section
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: theme.spacing.md,
                            marginBottom: theme.spacing.lg
                        },
                        children: quickLinks.map(link => ({
                            type: Card,
                            props: {
                                variant: 'default',
                                style: {
                                    padding: theme.spacing.md,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    backgroundColor: '#f0f7ff'
                                },
                                onClick: () => navigation.navigate(link.link),
                                children: [
                                    {
                                        type: 'h3',
                                        props: {
                                            style: {
                                                fontSize: '1rem',
                                                color: theme.colors.primary
                                            },
                                            children: [link.title]
                                        }
                                    }
                                ]
                            }
                        }))
                    }
                },

                // Search and Add Button Section
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
                            {
                                type: TextField,
                                props: {
                                    placeholder: 'Search assignments...',
                                    value: searchTerm,
                                    onChange: (e) => setSearchTerm(e.target.value),
                                    style: { width: '60%' }
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowCreateModal(true),
                                    children: '+ Add New Assignment'
                                }
                            }
                        ]
                    }
                },

                // Assignments List
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Current Assignments']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Title', 'Course', 'Type', 'Date', 'Time', 'Room', 'Teacher', 'Actions'],
                                    data: filteredAssignments.map(assignment => ({
                                        'Title': assignment.title,
                                        'Course': `${assignment.course} (${assignment.courseCode})`,
                                        'Type': assignment.type,
                                        'Date': assignment.date,
                                        'Time': `${assignment.startTime} - ${assignment.endTime}`,
                                        'Room': assignment.room,
                                        'Teacher': assignment.teacher,
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
                                                            onClick: () => handleEdit(assignment),
                                                            children: 'Edit'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            size: 'small',
                                                            onClick: () => handleDelete(assignment),
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
                    type: CreateAssignment,
                    props: {
                        onClose: () => setShowCreateModal(false)
                    }
                },
                showEditModal && {
                    type: EditAssignment,
                    props: {
                        assignment: selectedAssignment,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: DeleteConfirmation,
                    props: {
                        title: "Confirm Assignment Deletion",
                        message: "Are you sure you want to delete this assignment? This action cannot be undone.",
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.AssignmentDashboard = AssignmentDashboard;