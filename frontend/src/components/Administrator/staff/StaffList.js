const StaffList = () => {
    const [staffMembers, setStaffMembers] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedStaff, setSelectedStaff] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');

    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
    };

    const fetchStaff = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:8081/api/api/admin/staff', {
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
            console.log("Received staff data:", data);
            
            if (data.success) {
                // Ensure data.data exists and is an array
                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error("Invalid response format: expected an array of staff members");
                }
                
                setStaffMembers(data.data);
            } else {
                setError(data.message || "Failed to fetch staff members");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching staff members:", error);
        } finally {
            setLoading(false);
        }
    };

    MiniReact.useEffect(() => {
        fetchStaff();
    }, []);

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        setShowEditModal(true);
    };

    const handleDelete = (staff) => {
        setSelectedStaff(staff);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            // Make sure we have the selected staff ID
            if (!selectedStaff || !selectedStaff.staffId) {
                throw new Error("No staff member selected for deletion");
            }
            
            // Send DELETE request to the endpoint
            const response = await fetch(`http://localhost:8081/api/api/admin/staff/${selectedStaff.staffId}`, {
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
                // Remove the deleted staff member from the local state
                setStaffMembers(staffMembers.filter(staff => staff.staffId !== selectedStaff.staffId));
                setShowDeleteModal(false);
            } else {
                setError(data.message || "Failed to delete staff member");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error deleting staff member:", error);
        }
    };

    // Filter staff members based on search term
    const filteredStaff = staffMembers.filter(staff => 
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle successful add operation
    const handleAddSuccess = (newStaff) => {
        setShowAddModal(false);
        // Refresh the page after successful addition
        setTimeout(refreshPage, 300);
    };
    
    // Handle successful edit operation
    const handleEditSuccess = (updatedStaff) => {
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
                                                children: ['Staff Management']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['Manage staff members and their information']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Staff List Card
                {
                    type: Card,
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
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Staff Details']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowAddModal(true),
                                                            children: '+ Add Staff Member'
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                placeholder: "Search by name, position, department, or contact info...",
                                                value: searchTerm,
                                                onChange: (e) => setSearchTerm(e.target.value),
                                                style: { marginBottom: theme.spacing.md }
                                            }
                                        }
                                    ]
                                }
                            },

                            // Staff Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Name', 'Position', 'Department', 'Email', 'Phone', 'Actions'],
                                    data: filteredStaff.map(staff => ({
                                        'Name':staff.name,
                                        'Position': staff.position,
                                        'Department': staff.department,
                                        'Email': staff.email,
                                        'Phone': staff.phone,
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
                                                                        onClick: () => handleEdit(staff),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Edit'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleDelete(staff),
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
                    type: AddStaff,
                    props: {
                        onClose: () => setShowAddModal(false),
                        onSuccess: handleAddSuccess
                    }
                },
                showEditModal && {
                    type: EditStaff,
                    props: {
                        key: selectedStaff?.staffId,
                        staff: selectedStaff,
                        onClose: () => setShowEditModal(false),
                        onSuccess: handleEditSuccess
                    }
                },
                showDeleteModal && {
                    type: DeleteConfirmation,
                    props: {
                        staff: selectedStaff,
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm,
                    }
                }
            ]
        }
    };
};

window.StaffList = StaffList;