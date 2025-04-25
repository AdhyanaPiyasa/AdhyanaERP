// components/reviewer/scholarships/ScholarshipApplicationView.js
const ViewScholarshipApplication = ({ application, onClose }) => {
    const [showAcceptModal, setShowAcceptModal] = MiniReact.useState(false);
    const [showRejectModal, setShowRejectModal] = MiniReact.useState(false);

    const handleAcceptClick = () => {
        setShowAcceptModal(true);
    };

    const handleRejectClick = () => {
        setShowRejectModal(true);
    };

    const renderInfoSection = (title, items) => ({
        type: Card,
        props: {
            variant: 'outlined',
            style: { marginBottom: theme.spacing.lg },
            children: [
                {
                    type: 'h3',
                    props: {
                        style: { 
                            borderBottom: `1px solid ${theme.colors.border}`,
                            marginBottom: theme.spacing.md,
                            color: theme.colors.primary,
                            padding: `${theme.spacing.sm} 0`
                        },
                        children: [title]
                    }
                },
                ...items.map(([label, value]) => ({
                    type: 'div',
                    props: {
                        style: { 
                            display: 'flex', 
                            marginBottom: theme.spacing.sm,
                            padding: `${theme.spacing.xs} 0`,
                            borderBottom: `1px solid ${theme.colors.border}0D` // very light border
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        width: '30%', 
                                        fontWeight: 'bold',
                                        color: theme.colors.textSecondary
                                    },
                                    children: [label]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { width: '70%' },
                                    children: [value || '-']
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    });

    const renderPersonalStatement = () => ({
        type: Card,
        props: {
            variant: 'outlined',
            style: { marginBottom: theme.spacing.lg },
            children: [
                {
                    type: 'h3',
                    props: {
                        style: { 
                            borderBottom: `1px solid ${theme.colors.border}`,
                            marginBottom: theme.spacing.md,
                            color: theme.colors.primary,
                            padding: `${theme.spacing.sm} 0`
                        },
                        children: ['Personal Statement']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.md,
                            backgroundColor: '#f9f9f9',
                            borderRadius: theme.borderRadius.md,
                            borderLeft: '4px solid ' + theme.colors.primary
                        },
                        children: [application.comments || '-']
                    }
                }
            ]
        }
    });

    // Main page layout
    return {
        type: 'div',
        props: {
            style: { 
                maxWidth: '1200px', 
                margin: '0 auto',
                padding: theme.spacing.lg
            },
            children: [
                // Header with back button and status
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
                            // Back button
                            {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    onClick: onClose,
                                    children: ['← Back to Scholarship Applications']
                                }
                            },
                            // Application status badge
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                        backgroundColor: (application.status || 'pending').toLowerCase() === 'pending' 
                                            ? '#fff9c4' // Light yellow for pending
                                            : (application.status || '').toLowerCase() === 'approved'
                                                ? '#e8f5e9' // Light green for approved
                                                : '#ffebee', // Light red for rejected
                                        borderRadius: theme.borderRadius.sm,
                                        fontWeight: 'bold'
                                    },
                                    children: [application.status ? application.status.toUpperCase() : 'PENDING']
                                }
                            }
                        ]
                    }
                },
                
                // Main title
                {
                    type: 'h1',
                    props: {
                        style: { 
                            marginBottom: theme.spacing.lg,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: theme.colors.textPrimary
                        },
                        children: [`Scholarship Application: ${application.scholarshipId || 'Scholarship'}`]
                    }
                },
                
                // Application submission info
                {
                    type: 'div',
                    props: {
                        style: {
                            marginBottom: theme.spacing.lg,
                            color: theme.colors.textSecondary,
                            fontSize: '14px'
                        },
                        children: [`Submitted on: ${application.applicationDate || 'N/A'}`]
                    }
                },
                
                // Two column layout for information
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(1, 1fr)',
                            gap: theme.spacing.lg,
                            marginBottom: theme.spacing.xl
                        },
                        children: [
                            {// Left column
                                type: 'div',
                                props: {
                                    children: [
                                        // Student Information
                                        renderInfoSection('Student Information', [
                                            ['Student ID', application.studentId],
                                            ['Scholarship ID', application.scholarshipId],
                                            ['GPA', application.studentGpa],
                                            ['Degree Program', application.studentDegree],
                                            ['Batch', application.studentBatch],
                                        ])
                                    ]
                                }
                            }

                        ]
                    }
                },
                
                // Personal Statement (full width)
                renderPersonalStatement(),
                
                
                // Accept/Reject Modals
                showAcceptModal && {
                    type: AcceptScholarshipApplication,
                    props: {
                        application: application,
                        onClose: () => setShowAcceptModal(false)
                    }
                },
                
                showRejectModal && {
                    type: RejectScholarshipApplication,
                    props: {
                        application: application,
                        onClose: () => setShowRejectModal(false)
                    }
                },
                
                // Action Buttons (full width)
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        style: {
                            padding: theme.spacing.lg,
                            marginTop: theme.spacing.xl,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: theme.spacing.lg
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    onClick: onClose,
                                    children: ['Close']
                                }
                            },
                            // Only show if status is pending or not set
                            (!application.status || application.status.toLowerCase() === 'pending') && {
                                type: Button,
                                props: {
                                    style: { backgroundColor: '#ffebee', color: theme.colors.error },
                                    onClick: handleRejectClick,
                                    children: ['Reject Application']
                                }
                            },
                            (!application.status || application.status.toLowerCase() === 'pending') && {
                                type: Button,
                                props: {
                                    style: { backgroundColor: theme.colors.success },
                                    onClick: handleAcceptClick,
                                    children: ['Approve Application']
                                }
                            }
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };
};

window.ViewScholarshipApplication = ViewScholarshipApplication;