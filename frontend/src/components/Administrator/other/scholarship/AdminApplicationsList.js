// components/Administrator/scholarship/ScholarshipApplicationsList.js
const AdminApplicationsList = () => {
    const [applications, setApplications] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [selectedApplication, setSelectedApplication] = MiniReact.useState(null);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);

 

    // Fetch applications from the API
    const fetchApplications = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8081/api/api/students/applications/`, {
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

       // Fetch all scholarship applications from the server
       MiniReact.useEffect(() => {
        fetchApplications();
    }, []);

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowViewModal(true);
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
    };

// Process all pending applications across all scholarships
const handleProcessApplications = async () => {
    try {
        setLoading(true);
        setError(null);
        
        // Extract unique scholarship IDs from pending applications
        const pendingApplications = applications.filter(app => 
            app.status && app.status.toLowerCase() === 'pending'
        );
        
        // Get unique scholarship IDs
        const uniqueScholarshipIds = [...new Set(pendingApplications.map(app => app.scholarshipId))];
        
        console.log("Processing scholarships with IDs:", uniqueScholarshipIds);
        
        if (uniqueScholarshipIds.length === 0) {
            console.log("No pending applications found");
            return;
        }
        
        // Process each scholarship one by one
        const token = localStorage.getItem('token');
        let processedCount = 0;
        
        for (const scholarshipId of uniqueScholarshipIds) {
            try {
                const response = await fetch(`http://localhost:8081/api/api/students/scholarships/process/${scholarshipId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                if (!response.ok) {
                    console.error(`Failed to process scholarship ID ${scholarshipId}: ${response.status}`);
                    continue; // Continue with next scholarship even if this one fails
                }
                
                const data = await response.json();
                console.log(`Processed scholarship ID ${scholarshipId}:`, data);
                processedCount++;
            } catch (err) {
                console.error(`Error processing scholarship ID ${scholarshipId}:`, err);
                // Continue with next scholarship even if this one fails
            }
        }
        
        // Show success message
        if (processedCount > 0) {
            // After all processing is complete, refresh the applications list
            await fetchApplications();
        } else {
            setError("Failed to process any scholarships");
        }
        
    } catch (err) {
        setError('Failed to process applications: ' + err.message);
        console.error('Error processing applications:', err);
    } finally {
        setLoading(false);
    }
};

    // Get status color based on application status
    const getStatusColor = (status) => {
        // Check if status exists before calling toLowerCase()
        if (!status) {
            // Return a default style for undefined/null status
            return { backgroundColor: '#f5f5f5', color: '#757575' }; // Light gray
        }
        
        switch(status.toLowerCase()) {
            case 'approved':
                return { backgroundColor: '#e8f5e9', color: '#2e7d32' }; // Light green
            case 'rejected':
                return { backgroundColor: '#ffebee', color: '#c62828' }; // Light red
            case 'pending':
            default:
                return { backgroundColor: '#fff9c4', color: '#f57f17' }; // Light yellow
        }
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
                                                children: ['Scholarship Applications']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['Applications are automatically processed based on GPA requirements']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Error Message (if any)
                error && {
                    type: Card,
                    props: {
                        style: { backgroundColor: '#ffebee', marginTop: theme.spacing.md },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { color: theme.colors.error },
                                    children: [error]
                                }
                            }
                        ]
                    }
                },

                // Loading Indicator
                loading && {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.md, textAlign: 'center' },
                        children: [
                            {
                                type: LoadingSpinner,
                                props: {}
                            },
                            {
                                type: 'div',
                                props: {
                                    children: ['Loading applications...']
                                }
                            }
                        ]
                    }
                },

                // Applications Table
                !loading && !error && {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.md },
                        children: [
                            // Table view of applications
                            {
                                type: Table,
                                props: {
                                    headers: ['ID', 'Student ID', 'Scholarship', 'GPA', 'Degree', 'Application Date', 'Status', 'Actions'],
                                    data: applications.map(app => ({
                                        'ID': app.id,
                                        'Student ID': app.studentIndexNumber,
                                        'Scholarship': app.scholarshipId,
                                        'GPA': app.studentGpa,
                                        'Degree': app.studentDegree,
                                        'Application Date': app.applicationDate,
                                        'Status': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                                    borderRadius: theme.borderRadius.sm,
                                                    display: 'inline-block',
                                                    ...getStatusColor(app.status)
                                                },
                                                children: [app.status]
                                            }
                                        },
                                        'Actions': {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                size: 'small',
                                                onClick: () => handleViewApplication(app),
                                                children: ['View']
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // Process Applications Button (for any pending applications)
                !loading && applications.some(app => app.status && app.status.toLowerCase() === 'pending') && {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.md },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['There are pending applications that need to be processed automatically based on GPA requirements.']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: (e) => {
                                                    // Prevent default and stop propagation
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleProcessApplications();
                                                },
                                                children: ['Process Pending Applications']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // View Application Modal
                showViewModal && {
                    type: ViewScholarshipApplication,
                    props: {
                        application: selectedApplication,
                        onClose: handleCloseModal
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.AdminApplicationsList = AdminApplicationsList;