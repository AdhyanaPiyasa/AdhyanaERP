// components/Administrator/students/EnrollStudents.js
const EnrollStudents = ({ onClose, selectedApplicants = [] }) => {
    const [formData, setFormData] = MiniReact.useState({
        batch: ''
    });
    
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [batches, setBatches] = MiniReact.useState([]);

    // Function to fetch batches from the server
    const fetchBatches = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/api/admin/batch', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch batches');
            }
            
            const data = await response.json();
            
            if (data.success && Array.isArray(data.data)) {
                setBatches(data.data.map(batch => ({
                    id: batch.batchId,
                    name: batch.batchName
                })));
            } else {
                console.error('Invalid batch data format:', data);
                setBatches([]);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            setBatches([]);
        }
    };

    // Fetch available batches when component mounts
    MiniReact.useEffect(() => {
        fetchBatches();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        if (e.target && e.target.name && typeof e.target.value !== 'undefined') {
            const { name, value } = e.target;
            
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!formData.batch) {
            setError("Please select a batch");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare the applicant IDs for bulk enrollment
            const applicantIds = selectedApplicants.map(applicant => 
                applicant.id || applicant.applicantId
            );

            // API call to enroll students to the selected batch
            const response = await fetch(`http://localhost:8081/api/api/admin/batch/${formData.batch}/enrollment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({ applicantIds })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to enroll students');
            }

            const result = await response.json();
            console.log('Bulk enrollment successful:', result);
            setShowSuccessMessage(true);
        } catch (error) {
            console.error('Error enrolling students:', error);
            setError(error.message || 'Failed to enroll students');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Enroll Students to Batch',
            children: [
                showSuccessMessage ? 
                // Success message
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        style: {
                            backgroundColor: theme.colors.success + '20',
                            padding: theme.spacing.lg,
                            textAlign: 'center'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '40px',
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['✅']
                                }
                            },
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        color: theme.colors.success,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Enrollment Successful!']
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    children: [`${selectedApplicants.length} students have been successfully enrolled to ${batches.find(b => b.id === formData.batch)?.name || formData.batch}`]
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: onClose,
                                    children: ['Close']
                                }
                            }
                        ]
                    }
                } :
                // Enrollment form
                {
                    type: 'form',
                    props: {
                        onSubmit: (e) => { e.preventDefault(); handleSubmit(); },
                        children: [
                            // Error message if exists
                            error && {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        marginBottom: theme.spacing.md,
                                        padding: theme.spacing.sm,
                                        backgroundColor: theme.colors.error + '10',
                                        borderRadius: '4px'
                                    },
                                    children: [error]
                                }
                            },
                            
                            // Select Batch
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [                                        
                                        {
                                            type: Select,
                                            props: {
                                                name: 'batch',
                                                label: 'Batch *',
                                                value: formData.batch,
                                                onChange: handleChange,
                                                options: [
                                                    { value: '', label: 'Select Batch' },
                                                    ...batches.map(batch => ({
                                                        value: batch.id,
                                                        label: batch.name
                                                    }))
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Selected Applicants Summary
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.lg },
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                style: { marginBottom: theme.spacing.xs },
                                                children: [`Selected Applicants (${selectedApplicants.length})`]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    padding: theme.spacing.sm,
                                                    border: `1px solid ${theme.colors.border}`,
                                                    borderRadius: '4px',
                                                    maxHeight: '150px',
                                                    overflowY: 'auto'
                                                },
                                                children: selectedApplicants.length > 0 ?
                                                    selectedApplicants.map(applicant => ({
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                padding: `${theme.spacing.xs} 0`,
                                                                borderBottom: `1px solid ${theme.colors.border}10`
                                                            },
                                                            children: [applicant.name || `Applicant #${applicant.id || applicant.applicantId}`]
                                                        }
                                                    })) : 
                                                    [{
                                                        type: 'div',
                                                        props: {
                                                            style: { fontStyle: 'italic', color: theme.colors.textSecondary },
                                                            children: ['No applicants selected']
                                                        }
                                                    }]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Action Buttons
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.xl
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: onClose,
                                                disabled: isSubmitting,
                                                children: ['Cancel']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                disabled: isSubmitting,
                                                onClick: handleSubmit,
                                                children: [isSubmitting ? 'Enrolling...' : 'Enroll Students']
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
    };
};

window.EnrollStudents = EnrollStudents;