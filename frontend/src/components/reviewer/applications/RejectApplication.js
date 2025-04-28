// components/reviewer/applications/RejectApplication.js
const RejectApplication = ({ application, onClose }) => {
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [success, setSuccess] = MiniReact.useState(false);

    // Function to handle application rejection
    const handleReject = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            
            const token = localStorage.getItem('token');

            // API call to update application status
            const response = await fetch(`http://localhost:8081/api/api/students/newapplications/status/${application.student_application_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'rejected'

                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject application');
            }
            
            setSuccess(true);
            
            // Auto close after showing success message
            setTimeout(() => {
                onClose();
                // Force reload the page or component to show updated status
                window.location.reload();
            }, 2000);
            
        } catch (err) {
            console.error('Error rejecting application:', err);
            setError(err.message || 'An error occurred while rejecting the application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Reject Application',
            children: [
                {
                    type: Card,
                    props: {
                        style: {
                            padding: theme.spacing.lg,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.lg,
                            border: `1px solid ${theme.colors.error}`
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
                                    children: ['Application rejected successfully!']
                                }
                            },
                            
                            // Rejection form
                            !success && {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { 
                                                    color: theme.colors.error, 
                                                    marginBottom: theme.spacing.md 
                                                },
                                                children: ['Confirm Rejection']
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: [
                                                    `Please provide a reason for rejecting ${application.name}'s application:`
                                                ]
                                            }
                                        },
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
                                                style: { 
                                                    backgroundColor: theme.colors.error 
                                                },
                                                onClick: handleReject,
                                                disabled: isSubmitting ,
                                                children: [
                                                    isSubmitting ? 'Processing...' : 'Confirm Reject'
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

window.RejectApplication = RejectApplication;