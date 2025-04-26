// components/Admin/exams/ExamList.js
const ExamList = () => {
    const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedExam, setSelectedExam] = MiniReact.useState(null);
    const [exams, setExams] = MiniReact.useState([]);
    const [isLoading, setIsLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);

    // Fetch exams from backend
    const fetchExams = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8081/api/exams/', { // Modified URL
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exams');
            }

            const data = await response.json();
            if (Array.isArray(data)) { // Assuming the backend now returns an array directly
                setExams(data);
            } else {
                setExams([]);
            }
        } catch (err) {
            console.error('Error fetching exams:', err);
            setError('Failed to load exams. Please try again later.');
            setExams([]);
        } finally {
            setIsLoading(false);
        }
    };

    MiniReact.useEffect(() => {
        fetchExams();
    }, []);

    const quickLinks = [
        { title: 'Check room Assignments', link: '/exams/room-assignments' },
        { title: 'Create Exams', link: '/exams/create' },
        { title: 'Generate Final Timetable', link: '/exams/timetable' }
    ];

    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setShowEditModal(true);
    };

    const handleDelete = (exam) => {
        setSelectedExam(exam);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/exams/${selectedExam.exam_id}`, { // Modified URL
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete exam');
            }

            // Refresh the exam list
            fetchExams();
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Error deleting exam:', err);
            // Show error message (you could add this to state)
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchExams(); // Refresh the list after creating
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchExams(); // Refresh the list after editing
    };

    // Transform the exams data for display
    const prepareExamsForDisplay = () => {
        return exams.map(exam => ({
            'Title': exam.title,
            'Semester': exam.semester_id,
            'Date': exam.exam_date,
            'Start Time': exam.start_time,
            'End Time': exam.end_time,
            'Location': exam.location,
            'Type': exam.type,
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
                                onClick: () => handleEdit(exam),
                                size: 'small',
                                children: 'Edit'
                            }
                        },
                        {
                            type: Button,
                            props: {
                                variant: 'secondary',
                                onClick: () => handleDelete(exam),
                                size: 'small',
                                children: 'Delete'
                            }
                        }
                    ]
                }
            }
        }));
    };

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Exams']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md,
                                        marginBottom: theme.spacing.lg,
                                    },
                                    children: quickLinks.map(link => ({
                                        type: Card,
                                        props: {
                                            onClick: () => navigation.navigate(link.link),
                                            children: [{
                                                type: 'h3',
                                                props: {
                                                    children: [link.title]
                                                }
                                            }]
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },
                {
                    type: Card,
                    props: {
                        children: [
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
                                            type: 'h2',
                                            props: {
                                                children: ['Exam Schedule']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => setShowCreateModal(true),
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: { marginRight: theme.spacing.xs },
                                                            children: ['+']
                                                        }
                                                    },
                                                    'Create New Exam'
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            error && {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        padding: theme.spacing.md,
                                        backgroundColor: `${theme.colors.error}15`,
                                        borderRadius: theme.borderRadius.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: [error]
                                }
                            },

                            isLoading ? {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: theme.spacing.xl
                                    },
                                    children: [{
                                        type: LoadingSpinner,
                                        props: {}
                                    }]
                                }
                            } : {
                                type: Table,
                                props: {
                                    headers: ['Title', 'Semester', 'Date', 'Start Time', 'End Time', 'Location', 'Type', 'Actions'],
                                    data: prepareExamsForDisplay()
                                }
                            }
                        ].filter(Boolean)
                    }
                },
                showCreateModal && {
                    type: CreateExam,
                    props: {
                        onClose: handleCreateSuccess
                    }
                },
                showEditModal && {
                    type: EditExam,
                    props: {
                        exam: selectedExam,
                        onClose: handleEditSuccess
                    }
                },
                showDeleteModal && {
                    type: DeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.ExamList = ExamList;