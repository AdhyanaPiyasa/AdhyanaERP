// components/Administrator/other/hostel/HostelApplicationsList.js
const HostelApplicationsList = () => {
    const [applications, setApplications] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [processingAll, setProcessingAll] = MiniReact.useState(false);
    const [successMessage, setSuccessMessage] = MiniReact.useState(null);

    // Fetch applications from the API
    const fetchApplications = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8081/api/api/hostel/applications`, {
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
                setError(data.message || "Failed to fetch hostel applications");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching hostel applications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all hostel applications from the server
    MiniReact.useEffect(() => {
        fetchApplications();
    }, []);

    // Admit all pending students to hostels
    const handleAdmitAllToHostel = async () => {
        try {
            setProcessingAll(true);
            setError(null);
            setSuccessMessage(null);
            
            // Filter applications with "Pending" status
            const pendingApplications = applications.filter(app => 
                app.status && app.status.toLowerCase() === 'pending'
            );
            
            if (pendingApplications.length === 0) {
                setError("No pending applications found to process");
                setProcessingAll(false);
                return;
            }
            
            console.log("Processing applications:", pendingApplications.length);
            
            // Process each application one by one
            const token = localStorage.getItem('token');
            let processedCount = 0;
            let failedCount = 0;
            
            for (const app of pendingApplications) {
                try {
                    const response = await fetch(`http://localhost:8081/api/api/hostel/applications/${app.applicationId}/approve`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    
                    if (!response.ok) {
                        console.error(`Failed to approve application ID ${app.applicationId}: ${response.status}`);
                        failedCount++;
                        continue;
                    }
                    
                    const data = await response.json();
                    console.log(`Processed application ID ${app.applicationId}:`, data);
                    processedCount++;
                } catch (err) {
                    console.error(`Error processing application ID ${app.applicationId}:`, err);
                    failedCount++;
                }
            }
            
            // Show success message
            if (processedCount > 0) {
                setSuccessMessage(`Successfully admitted ${processedCount} students to hostels.${failedCount > 0 ? ` ${failedCount} applications failed.` : ''}`);
                // After all processing is complete, refresh the applications list
                await fetchApplications();
            } else {
                setError("Failed to process any applications");
            }
            
        } catch (err) {
            setError('Failed to process applications: ' + err.message);
            console.error('Error processing applications:', err);
        } finally {
            setProcessingAll(false);
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
                                type: 'div',
                                props: {
                                    style: { 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'h1',
                                                        props: {
                                                            style: { marginBottom: theme.spacing.xs },
                                                            children: ['Hostel Applications']
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: { color: theme.colors.textSecondary },
                                                            children: ['Manage student hostel applications']
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        // Admit All to Hostel Button
                                        {
                                            type: Button,
                                            props: {
                                                onClick: (e) => {
                                                    // Prevent default and stop propagation
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAdmitAllToHostel();
                                                }, 
                                            
                                                disabled: loading || processingAll || !applications.some(app => app.status && app.status.toLowerCase() === 'pending'),
                                                children: [processingAll ? 'Processing...' : 'Admit All to Hostel']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Success Message (if any)
                successMessage && {
                    type: Card,
                    props: {
                        style: { backgroundColor: '#e8f5e9', marginTop: theme.spacing.md },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        color: '#2e7d32', 
                                        padding: theme.spacing.md 
                                    },
                                    children: [successMessage]
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
                                    style: { 
                                        color: theme.colors.error,
                                        padding: theme.spacing.md
                                    },
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
                        style: { marginTop: theme.spacing.md, textAlign: 'center', padding: theme.spacing.lg },
                        children: [
                            {
                                type: LoadingSpinner,
                                props: {}
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { marginTop: theme.spacing.md },
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
                            applications.length === 0 ? 
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        padding: theme.spacing.lg,
                                        textAlign: 'center',
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['No hostel applications found']
                                }
                            } :
                            {
                                type: Table,
                                props: {
                                    headers: ['Application ID', 'Student Index', 'Student Name', 'Gender', 'Status', 'Application Date'],
                                    data: applications.map(app => ({
                                        'Application ID': app.applicationId,
                                        'Student Index': app.studentIndex,
                                        'Student Name': app.studentName || 'N/A',
                                        'Gender': app.studentGender || 'N/A',
                                        'Status': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                                    borderRadius: theme.borderRadius.sm,
                                                    display: 'inline-block',
                                                    backgroundColor: app.status?.toLowerCase() === 'approved' ? '#e8f5e9' : 
                                                                   app.status?.toLowerCase() === 'rejected' ? '#ffebee' : '#fff9c4',
                                                    color: app.status?.toLowerCase() === 'approved' ? '#2e7d32' : 
                                                          app.status?.toLowerCase() === 'rejected' ? '#c62828' : '#f57f17'
                                                },
                                                children: [app.status || 'Unknown']
                                            }
                                        },
                                        'Application Date': app.applicationDate || 'N/A'
                                    }))
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.HostelApplicationsList = HostelApplicationsList;