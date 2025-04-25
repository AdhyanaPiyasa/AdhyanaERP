const AdministratorStudentList = () => {
    const [students, setStudents] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedStudent, setSelectedStudent] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');

    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
  };
        
    // Get the degree ID from the route
    const route = navigation.getCurrentRoute();
    const degreeId = route.split('/')[1];

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');

            
            const response = await fetch(`http://localhost:8081/api/api/students/degree/${degreeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Received data:", data);
            
            if (data.success) {
                // Ensure data.data exists and is an array
                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error("Invalid response format: expected an array of students");
                }
                
                setStudents(data.data);
            } else {
                setError(data.message || "Failed to fetch students");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };


    
    MiniReact.useEffect(() => {
        fetchStudents();
    }, []);
    const handleView = (student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setShowEditModal(true);
    };

    const handleDelete = (student) => {
        setSelectedStudent(student);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            // Make sure we have the selected student ID
            if (!selectedStudent || !selectedStudent.id) {
                throw new Error("No student selected for deletion");
            }
            
            // Send DELETE request to the correct endpoint
            const response = await fetch(`http://localhost:8081/api/api/students/${selectedStudent.id}`, {
                method: 'DELETE',
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
                // Remove the deleted student from the local state
                setStudents(students.filter(student => student.id !== selectedStudent.id));
                setShowDeleteModal(false);
            } else {
                setError(data.message || "Failed to delete student");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error deleting student:", error);
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Current program details (in a real app, you would fetch this)
    const currentProgram = {
        name: degreeId ? (degreeId.substring(0, 2) === "CS" ? "Computer Science" : "Information Systems") : "All Programs",
        batch: degreeId ? `Y${degreeId.substring(2)}` : "All Batches"
    };

    // Handle successful add operation
    const handleAddSuccess = (newStudent) => {
    setShowAddModal(false);
      
    // Refresh the page after successful addition
    setTimeout(refreshPage, 300);
  };
    
  // Handle successful edit operation
  const handleEditSuccess = (updatedStudent) => {
    setShowEditModal(false);
      
    // Refresh the page after successful edit
    setTimeout(refreshPage, 300);
  };

    if (loading) {
        return {
            type: Card,
            props: {
                children: [{
                    type: LoadingSpinner,
                    props: {}
                }]
            }
        };
    }

    if (error) {
        return {
            type: Card,
            props: {
                children: [{
                    type: 'div',
                    props: {
                        style: { color: theme.colors.error },
                        children: [`Error: ${error}`]
                    }
                }]
            }
        };
    }

    return {
        type: 'div',
        props: {
            style: {
                padding: theme.spacing.lg,
                maxWidth: '1200px',
                margin: '0 auto'
            },
            children: [
                // Program Header Section
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
                                                style: {
                                                    marginBottom: theme.spacing.sm,
                                                },
                                                children: [currentProgram.name]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [`Batch: ${currentProgram.batch}`]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Student List Section
                {
                    type: Card,
                    props: {
                        children: [
                            // Header with Add Button
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
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
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Student Details']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowAddModal(true),
                                                            children: '+ Add New Student'
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                placeholder: "Search by name, email, or ID...",
                                                value: searchTerm,
                                                onChange: (e) => setSearchTerm(e.target.value),
                                                style: { marginBottom: theme.spacing.md }
                                            }
                                        }
                                    ]
                                }
                            },

                            // Student Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Index Number', 'Registration Number', 'Name',  'Actions'],
                                    data: filteredStudents.map(student => ({
                                        'Index Number': student.indexNumber,
                                        'Registration Number': student.registrationNumber,
                                        'Name': student.name,
                                        'Actions': {
                                            type: Card,
                                            props: {
                                                variant: 'ghost',
                                                noPadding: true,
                                                children: [
                                                    {
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
                                                                        onClick: () => handleView(student),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'View'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleEdit(student),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Edit'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleDelete(student),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Delete'
                                                                    }
                                                                }
                                                            ]
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
                    type: AddStudent,
                    props: {
                        degreeId: degreeId,
                        degreeProgram: currentProgram.name,
                        batch: currentProgram.batch,
                        onClose: () => setShowAddModal(false),
                        onSuccess: handleAddSuccess
                    }
                },
                showViewModal &&  {
                    type: ViewStudent,
                    props: {
                        student: selectedStudent,
                        onClose: () => setShowViewModal(false)
                    }
                },
                showEditModal &&{
                    type: EditStudent,
                    props: {
                        key: selectedStudent?.id,
                        student: selectedStudent,
                        onClose: () => setShowEditModal(false),
                        onSuccess: handleEditSuccess
                    }
                },
                showDeleteModal && {
                    type: studentsDeleteConfirmation,
                    props: {
                        student: selectedStudent,
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm,
                    }
                }
            ]
        }
    };
};

window.AdministratorStudentList = AdministratorStudentList;