// components/reviewer/scholarships/AcceptScholarshipApplication.js
const AcceptScholarshipApplication = ({ application, onClose }) => {
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [success, setSuccess] = MiniReact.useState(false);

    // Function to handle scholarship application approval
    const handleAccept = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            
            const token = localStorage.getItem('token');

            // API call to update scholarship application status
            const response = await fetch(`http://localhost:8081/api/api/students/applications/status/${application.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'approved'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve scholarship application');
            }
            
            setSuccess(true);

            // Auto close after showing success message
            setTimeout(() => {
                onClose();
                // Force reload the page or component to show updated status
                window.location.reload();
            }, 2000);
            
        } catch (err) {
            console.error('Error approving scholarship application:', err);
            setError(err.message || 'An error occurred while approving the scholarship application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Approve Scholarship Application',
            children: [
                {
                    type: Card,
                    props: {
                        style: {
                            padding: theme.spacing.lg,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.lg,
                            border: `1px solid ${theme.colors.success}`
                        },
                        children: [
                            // Error message
                            error && {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#ffebee',
                                        borderRadius: theme.borderRadius.sm,
                                        marginBottom: theme.spacing.md,
                                        color: theme.colors.error
                                    },
                                    children: [error]
                                }
                            },
                            
                            // Success message
                            success && {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: theme.borderRadius.sm,
                                        marginBottom: theme.spacing.md,
                                        color: theme.colors.success
                                    },
                                    children: ['Scholarship application approved successfully!']
                                }
                            },
                            
                            // Confirmation message
                            !success && {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { 
                                                    color: theme.colors.success, 
                                                    marginBottom: theme.spacing.md 
                                                },
                                                children: ['Confirm Approval']
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [
                                                    `Are you sure you want to approve ${application.studentName}'s application for the ${application.scholarshipName || application.scholarshipId || 'selected'} scholarship?`
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Action buttons
                            !success && {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
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
                                                style: { backgroundColor: theme.colors.success },
                                                onClick: handleAccept,
                                                disabled: isSubmitting,
                                                children: [
                                                    isSubmitting ? 'Processing...' : 'Confirm Approval'
                                                ]
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

window.AcceptScholarshipApplication = AcceptScholarshipApplication;