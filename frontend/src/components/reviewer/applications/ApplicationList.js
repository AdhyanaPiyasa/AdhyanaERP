// components/reviewer/applications/ApplicationsList.js
const ApplicationsList = () => {
    const [applications, setApplications] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [selectedApplication, setSelectedApplication] = MiniReact.useState(null);
    const [filterStatus, setFilterStatus] = MiniReact.useState('all');

   

    // Fetch applications from the API
      const fetchApplications = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8081/api/api/students/newapplications`, {
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
                    throw new Error("Invalid response format: expected an array of applications");
                }
                
                setApplications(data.data);
            } else {
                setError(data.message || "Failed to fetch applications");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    MiniReact.useEffect(() => {
        fetchApplications();
    }, []);

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowViewModal(true);
    };

    const handleAccept = (application) => {
        console.log('Accepted application:', application.id);
        setShowViewModal(false);
        // Here you would update the application status in a real system
    };

    const handleReject = (application) => {
        console.log('Rejected application:', application.id);
        setShowViewModal(false);
        // Here you would update the application status in a real system
    };

    // Map backend status values to frontend values
    const getFilteredStatus = (backendStatus) => {
        // Default to 'pending' for null/undefined
        if (!backendStatus) return 'pending';
    
        // Convert to lowercase
        const status = backendStatus.toLowerCase();
    
        // Map different potential statuses
        if (status.includes('pend') || status === 'new' || status === 'submitted') 
            return 'pending';
        if (status.includes('accept') || status === 'approved')
            return 'accepted';
        if (status.includes('reject') || status === 'denied')
            return 'rejected';
        
        return status; // Use as-is if no mapping found
    };

const filteredApplications = applications.filter(application => {
    const appStatus = getFilteredStatus(application.status);
    return filterStatus === 'all' || appStatus === filterStatus;
});
    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted':
                return { color: theme.colors.success };
            case 'rejected':
                return { color: theme.colors.error };
            case 'pending':
                return { color: theme.colors.warning };
            default:
                return {};
        }
    };

    return {
        type: 'div',
        props: {
            children: [
                // Header and Filters
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: ['New Applications']
                                }
                            },
                            // Search and filter controls
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing.md,
                                        marginBottom: theme.spacing.lg
                                    },
                                    children: [

                                        {
                                            type: 'div',
                                            props: {
                                                children: ['Status:']
                                            }
                                        },
                                        {
                                            type: 'select',
                                            props: {
                                                value: filterStatus,
                                                onchange: (e) => setFilterStatus(e.target.value),
                                                style: {
                                                    padding: theme.spacing.sm,
                                                    borderRadius: theme.borderRadius.sm,
                                                    border: `1px solid ${theme.colors.border}`
                                                },
                                                children: [
                                                    {
                                                        type: 'option',
                                                        props: {
                                                            value: 'all',
                                                            children: ['All Applications']
                                                        }
                                                    },
                                                    {
                                                        type: 'option',
                                                        props: {
                                                            value: 'pending',
                                                            children: ['Pending']
                                                        }
                                                    },
                                                    {
                                                        type: 'option',
                                                        props: {
                                                            value: 'accepted',
                                                            children: ['Accepted']
                                                        }
                                                    },
                                                    {
                                                        type: 'option',
                                                        props: {
                                                            value: 'rejected',
                                                            children: ['Rejected']
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

                // Applications Table
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: Table,
                                props: {
                                    headers: ['Application ID', 'Name', 'Program', 'Submitted Date', 'Status', 'Actions'],
                                    data: filteredApplications.map(application => ({
                                        'Application ID': application.id,
                                        'Name': application.name,
                                        'Program': application.appliedProgram,
                                        'Submitted Date': application.applicationDate,
                                        'Status': {
                                            type: 'span',
                                            props: {
                                                style: getStatusStyle(application.status),
                                                children: [application.status.charAt(0).toUpperCase() + application.status.slice(1)]
                                            }
                                        },
                                        'Actions': {
                                            type: Button,
                                            props: {
                                                onClick: () => handleViewApplication(application),
                                                variant: 'secondary',
                                                size: 'small',
                                                children: 'View'
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // View Application Modal
                showViewModal && {
                    type: ViewApplication,
                    props: {
                        application: selectedApplication,
                        onClose: () => setShowViewModal(false),
                        onAccept: () => handleAccept(selectedApplication),
                        onReject: () => handleReject(selectedApplication)
                    },
                }
            ]
        }
    };
};

window.ApplicationsList = ApplicationsList;