// components/Administrator/other/scholarship/AdminScholarshipList.js
const AdminScholarshipList = () => {
    const [scholarships, setScholarships] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedScholarship, setSelectedScholarship] = MiniReact.useState(null);
    
    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
  };

    const fetchScholarships = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8081/api/api/students/scholarships/`, {
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
                    throw new Error("Invalid response format: expected an array of scholarships");
                }
                
                setScholarships(data.data);
            } else {
                setError(data.message || "Failed to fetch scholarship");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching scholarship:", error);
        } finally {
            setLoading(false);
        }
    };
    
      // Fetch scholarships on component mount
    MiniReact.useEffect(() => {
        fetchScholarships();
    }, []);

    const handleView = (scholarship) => {
        setSelectedScholarship(scholarship);
        setShowViewModal(true);
    };

    const handleEdit = (scholarship) => {
        setSelectedScholarship(scholarship);
        setShowEditModal(true);
    };

    const handleDelete = (scholarship) => {
        setSelectedScholarship(scholarship);
        setShowDeleteModal(true);
    };


    const handleDeleteConfirm = async () => {
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            // Make sure we have the selected student ID
            if (!selectedScholarship || !selectedScholarship.id) {
                throw new Error("No scholarship selected for deletion");
            }
            
            // Send DELETE request to the correct endpoint
            const response = await fetch(`http://localhost:8081/api/api/students/scholarships/${selectedScholarship.id}`, {
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
                setScholarships(scholarships.filter(scholarship => scholarship.id !== selectedScholarship.id));
                setShowDeleteModal(false);
            } else {
                setError(data.message || "Failed to delete scholarship");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error deleting scholarship:", error);
        }
    };

    // Handle successful add operation
    const handleAddSuccess = (newScholarship) => {
        setShowAddModal(false);
          
        // Refresh the page after successful addition
        setTimeout(refreshPage, 300);
      };

    // Handle successful edit operation
        const handleEditSuccess = (updatedscholarship) => {
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
            children: [
                  // Header Section with Title and Add Button
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
                                            type: 'h1',
                                            props: {
                                                children: ['Scholarship Management']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => setShowAddModal(true),
                                                children: ['+ Create New Scholarship']
                                            }
                                        },

                                    ]
                                }
                            }
                        ]
                    }
                },
                
                
                // Scholarships Table
                {
                    type: Card,
                    props: {
                        children: [
                             {
                                type: Table,
                                props: {
                                    headers: ['Name',  'Min GPA', 'Amount (Rs) ', 'Deadline', 'Actions'],
                                    data: scholarships.map(scholarship => ({
                                        'Name': scholarship.name,
                                        'Min GPA': scholarship.minGpa,
                                        'Amount':  scholarship.amount,
                                        'Deadline': scholarship.applicationDeadline,
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
                                                            onClick: () => handleView(scholarship),
                                                            variant: 'secondary',
                                                            size: 'small',
                                                            children: 'View'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => handleEdit(scholarship),
                                                            variant: 'secondary',
                                                            size: 'small',
                                                            children: ['Edit']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => handleDelete(scholarship),
                                                            variant: 'secondary',
                                                            size: 'small',
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
                
                // Create Scholarship Modal
                showAddModal && {
                    type: AdminCreateScholarship,
                    props: {
                        onClose: () => setShowAddModal(false),
                        onSuccess: handleAddSuccess
                    }
                },
                
                // view Scholarship Modal
                showViewModal &&  {
                    type: viewScholarship,
                    props: {
                        scholarship: selectedScholarship,
                        onClose: () => setShowViewModal(false)
                    }
                },

                // Edit Scholarship Modal
                showEditModal && {
                    type: AdminEditScholarship,
                    props: {
                        key: selectedScholarship?.id,
                        scholarship: selectedScholarship,
                        onClose: () => setShowEditModal(false),
                        onSuccess:handleEditSuccess
                    }
                },
                // delete Scholarship Modal
                showDeleteModal && {
                    type: ScholarshipDeleteConfirmation,
                    props: {
                        scholarship: selectedScholarship,
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm,
                    }
                }
            ]
        }
    };
};

window.AdminScholarshipList = AdminScholarshipList;