// components/Administrator/students/ApplicantList.js
const ApplicantList = () => {
    const [approvedApplicants, setApprovedApplicants] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [selectedApplication, setSelectedApplication] = MiniReact.useState(null);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [showEnrollModal, setShowEnrollModal] = MiniReact.useState(false);
    const [selectedApplicants, setSelectedApplicants] = MiniReact.useState([]);
    const [selectedBatchId, setSelectedBatchId] = MiniReact.useState('');
    const [availableBatches, setAvailableBatches] = MiniReact.useState([]);
    const [enrollmentLoading, setEnrollmentLoading] = MiniReact.useState(false);
    const [enrollmentError, setEnrollmentError] = MiniReact.useState(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = MiniReact.useState('');
    
    const fetchApprovedApplicants = async () => {
        setLoading(true);
        try {
            // Get the stored auth token
            const token = localStorage.getItem('token');

            
            const response = await fetch(`http://localhost:8081/api/api/students/newapplications/status/accepted`, {
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
                    throw new Error("Invalid response format: expected an array of approved applications");
                }
                
                setApprovedApplicants(data.data);
            } else {
                setError(data.message || "Failed to fetch approved applicants");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching approved applications:", error);
        } finally {
            setLoading(false);
        }
    };

    

    MiniReact.useEffect(() => {
        fetchApprovedApplicants();
    }, []);

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowViewModal(true);
    };
    

    // // Toggle selection of all applicants
    // const toggleSelectAll = (e) => {
    //     if (e.target.checked) {
    //         setSelectedApplicants(applicants.map(app => app.id));
    //     } else {
    //         setSelectedApplicants([]);
    //     }
    // };

    // // Toggle selection of a single applicant
    // const toggleSelectApplicant = (applicantId) => {
    //     if (selectedApplicants.includes(applicantId)) {
    //         setSelectedApplicants(selectedApplicants.filter(id => id !== applicantId));
    //     } else {
    //         setSelectedApplicants([...selectedApplicants, applicantId]);
    //     }
    // };

    // Open enrollment modal
    const handleEnrollClick = () => {
        // if (selectedApplicants.length === 0) {
        //     alert("Please select at least one applicant to enroll");
        //     return;
        // }
        setShowEnrollModal(true);
    };

    return {
        type: 'div',
        props: {
            style: {
            },
            children: [
                // Header Card
                {
                    type: Card,
                    props: {
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
                                                children: ['Approved Applicants']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Applicants List Card
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
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'h2',
                                                                    props: {
                                                                        children: ['Applicant List']
                                                                    }
                                                                },
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: handleEnrollClick,
                                                            children: ['+ Add Students to New Batch']
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // // Select All Checkbox
                            // {
                            //     type: 'div',
                            //     props: {
                            //         style: {
                            //             marginBottom: theme.spacing.md,
                            //             display: 'flex',
                            //             alignItems: 'center'
                            //         },
                            //         children: [
                            //             {
                            //                 type: 'input',
                            //                 props: {
                            //                     type: 'checkbox',
                            //                     id: 'select-all',
                            //                     checked: selectedApplicants.length === approvedApplicants.length,
                            //                     onChange: toggleSelectAll,
                            //                     style: { marginRight: theme.spacing.sm }
                            //                 }
                            //             },
                            //             {
                            //                 type: 'label',
                            //                 props: {
                            //                     htmlFor: 'select-all',
                            //                     children: ['Select All']
                            //                 }
                            //             }
                            //         ]
                            //     }
                            // },

                            // Applicants Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Applicant ID', 'Name', 'Applied Program', 'Application Date', 'Actions'],
                                    data: approvedApplicants.map(applicant => ({
                                        'Applicant ID': ("APP0"+ applicant.student_application_id),
                                        'Name': applicant.name,
                                        'Applied Program': applicant.appliedProgram,
                                        'Application Date': applicant.applicationDate,
                                        'Actions': {
                                            type: Button,
                                            props: {
                                                onClick: () => handleViewApplication(applicant),
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

                showViewModal && {
                    type: ApplicantDetail,
                    props: {
                        application: selectedApplication,
                        onClose: () => setShowViewModal(false),                    }
                },
                // Add EnrollStudents modal when showEnrollModal is true
                showEnrollModal && {
                    type: EnrollStudents,
                    props: {
                        selectedApplicants: selectedApplicants,
                        onClose: () => setShowEnrollModal(false)
                    }
                }
            ]
        }
    };
};

window.ApplicantList = ApplicantList;