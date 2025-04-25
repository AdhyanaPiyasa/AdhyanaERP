const StaffList = () => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedStaff, setSelectedStaff] = MiniReact.useState(null);

    const staffMembers = [
        {
            id: 1,
            name: 'John Doe',
            position: 'Administrator',
            department: 'Administration',
            email: 'john@example.com',
            phone: '1234567890'
        }
    ];

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        setShowEditModal(true);
    };

    const handleDelete = (staff) => {
        setSelectedStaff(staff);
        setShowDeleteModal(true);
    };

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
                                        }
                                    ]
                                }
                            },

                            // Staff Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Name', 'Position', 'Department', 'Email', 'Phone', 'Actions'],
                                    data: staffMembers.map(staff => ({
                                        'Name': {
                                            type: 'span',
                                            props: {
                                                style: { fontWeight: 'bold', color: theme.colors.primary },
                                                children: [staff.name]
                                            }
                                        },
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
                        onClose: () => setShowAddModal(false)
                    }
                },
                showEditModal && {
                    type: EditStaff,
                    props: {
                        staff: selectedStaff,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: DeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: () => {
                            console.log('Deleting staff:', selectedStaff);
                            setShowDeleteModal(false);
                        }
                    }
                }
            ]
        }
    };
};

window.StaffList = StaffList;