// components/Administrator/other/exams/Grades/GradeDashboard.js
const GradeDashboard = () => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedGrade, setSelectedGrade] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [selectedCourse, setSelectedCourse] = MiniReact.useState('all');

    const refreshPage = () => {
        window.location.reload();
    };

    const route = navigation.getCurrentRoute();
    const gradeId = route.split('/')[1];

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8081/api/api/exams/grades`, {
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
            console.log('Grades data:', data);

            if (data.success) {
                // Assuming the API returns an array of grades
                if(!data.data || !Array.isArray(data.data)){
                    throw new Error('Invalid data format received from API');
                }
                setGrades(data.data);
            } else {
                setError(data.message || 'Failed to fetch grades data');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching grades:', error);
        } finally {
            setLoading(false);
        }
    };    

    MiniReact.useEffect(() => {
        fetchGrades();
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');

            if(!selectedGrade || !selectedGrade.gid){
                throw new Error("Invalid grade ID");
            }
            const response = await fetch(`http://localhost:8081/api/api/exams/grades/${selectedGrade.gid}`, {
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
                setGrades(grades.filter(grade => grade.gid !== selectedGrade.gid));
                setShowDeleteModal(false);
            } else {
                setError(data.message || 'Failed to delete grade');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error deleting grade:', error);
        }
    };
    

    // Mock course data
    const courses = [
        { value: 'all', label: 'All Courses' },
        { value: 'cs101', label: 'Introduction to Computer Science (CS101)' },
        { value: 'math204', label: 'Advanced Mathematics (MATH204)' },
        { value: 'eng301', label: 'Technical Communication (ENG301)' },
        { value: 'db202', label: 'Database Systems (DB202)' }
    ];

    // Mock grades data
    const gradesData = [
        {
            gid: 1,
            indexNo: "IT19001234",
            name: "John Smith",
            courseCode: 101,
            courseName: "Introduction to Computer Science",
            grade: "A"
        },
        {
            gid: 2,
            indexNo: "IT19005678",
            name: "Emily Johnson",
            courseCode: 101,
            courseName: "Introduction to Computer Science",
            grade: "B+"
        },
        {
            gid: 3,
            indexNo: "IT19009012",
            name: "Michael Brown",
            courseCode: 204,
            courseName: "Advanced Mathematics",
            grade: "A-"
        },
        {
            gid: 4,
            indexNo: "IT19003456",
            name: "Sarah Williams",
            courseCode: 204,
            courseName: "Advanced Mathematics",
            grade: "B"
        },
        {
            gid: 5,
            indexNo: "IT19007890",
            name: "David Miller",
            courseCode: 301,
            courseName: "Technical Communication",
            grade: "A"
        },
        {
            gid: 6,
            indexNo: "IT19002345",
            name: "Jennifer Davis",
            courseCode: 301,
            courseName: "Technical Communication",
            grade: "C+"
        },
        {
            gid: 7,
            indexNo: "IT19006789",
            name: "James Wilson",
            courseCode: 202,
            courseName: "Database Systems",
            grade: "A+"
        },
        {
            gid: 8,
            indexNo: "IT19000123",
            name: "Emma Taylor",
            courseCode: 202,
            courseName: "Database Systems",
            grade: "B-"
        }
    ];

    // Filter grades based on search and course filter
    const filteredGrades = gradesData.filter(grade => {
        const matchesSearch = 
            grade.indexNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.grade.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCourse = selectedCourse === 'all' || 
            grade.courseCode.toString() === selectedCourse.replace(/\D/g, '');
        
        return matchesSearch && matchesCourse;
    });

    // Statistics calculation
    const calculateStats = () => {
        // Count grades by letter for the selected course
        const gradeCounts = {};
        let totalStudents = 0;
        
        filteredGrades.forEach(grade => {
            const letterGrade = grade.grade.charAt(0); // Get just the letter part (A, B, C, etc.)
            gradeCounts[letterGrade] = (gradeCounts[letterGrade] || 0) + 1;
            totalStudents++;
        });
        
        // Format for chart component
        return Object.keys(gradeCounts).map(letter => ({
            label: `${letter} Grades`,
            value: gradeCounts[letter]
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const handleEdit = (grade) => {
        setSelectedGrade(grade);
        setShowEditModal(true);
    };

    const handleDelete = (grade) => {
        setSelectedGrade(grade);
        setShowDeleteModal(true);
    };

    // const handleDeleteConfirm = () => {
    //     console.log('Deleting grade record:', selectedGrade);
    //     // API call would go here
    //     setShowDeleteModal(false);
    // };

    const quickLinks = [
        { title: 'Add New Grade', action: () => setShowAddModal(true) },
        { title: 'Generate Grade Report', action: () => console.log('Generating grade report') },
        { title: 'Grade Distribution Analysis', action: () => navigation.navigate('other/exams/Grades/Analysis') }
    ];

    return {
        type: 'div',
        props: {
            children: [
                // Header Card
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
                                                children: ['Grade Management Dashboard']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['View, add, and manage student grades across all courses']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Quick Links and Statistics Section
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: theme.spacing.lg,
                            marginTop: theme.spacing.lg,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            // Quick Links Card
                            {
                                type: Card,
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Quick Actions']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: theme.spacing.md
                                                },
                                                children: quickLinks.map(link => ({
                                                    type: Button,
                                                    props: {
                                                        onClick: link.action,
                                                        style: { width: '100%' },
                                                        children: link.title
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
                                                children: ['Grade Distribution']
                                            }
                                        },
                                        {
                                            type: BarChart,
                                            props: {
                                                data: calculateStats(),
                                                height: 200
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
                            // Course Filter
                            {
                                type: Select,
                                props: {
                                    label: 'Filter by Course',
                                    value: selectedCourse,
                                    onChange: (e) => setSelectedCourse(e.target.value),
                                    options: courses,
                                    style: { width: '300px' }
                                }
                            },
                            
                            // Search Box
                            {
                                type: TextField,
                                props: {
                                    placeholder: 'Search by name, ID, or grade...',
                                    value: searchTerm,
                                    onChange: (e) => setSearchTerm(e.target.value),
                                    style: { width: '300px' }
                                }
                            }
                        ]
                    }
                },

                // Grades Table
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
                                                children: ['Student Grades']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => setShowAddModal(true),
                                                children: '+ Add New Grade'
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Student ID', 'Name', 'Course', 'Grade', 'Actions'],
                                    data: filteredGrades.map(grade => ({
                                        'Student ID': grade.indexNo,
                                        'Name': grade.name,
                                        'Course': `${grade.courseName} (${grade.courseCode})`,
                                        'Grade': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: grade.grade.startsWith('A') ? '#e6f7e6' : 
                                                                    grade.grade.startsWith('B') ? '#e6f0ff' : 
                                                                    grade.grade.startsWith('C') ? '#fff9e6' : 
                                                                    grade.grade.startsWith('D') ? '#ffe6e6' : '#f8f8f8'
                                                },
                                                children: [grade.grade]
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
                                                            onClick: () => handleEdit(grade),
                                                            children: 'Edit'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            size: 'small',
                                                            onClick: () => handleDelete(grade),
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
                showAddModal && {
                    type: AddGradeForm,
                    props: {
                        onClose: () => setShowAddModal(false)
                    }
                },
                showEditModal && {
                    type: EditGradeForm,
                    props: {
                        grade: selectedGrade,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: GradeDeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.GradeDashboard = GradeDashboard;