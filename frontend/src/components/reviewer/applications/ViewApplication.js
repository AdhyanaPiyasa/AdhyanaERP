// components/reviewer/applications/ViewApplication.js
const ViewApplication = ({ application, onClose }) => {
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

    const renderDocumentsSection = () => ({
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
                        children: ['Submitted Documents']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: theme.spacing.md,
                            padding: theme.spacing.md
                        },
                        children: (application.documents || []).map(doc => ({
                            type: 'div',
                            props: {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: theme.spacing.sm,
                                    backgroundColor: theme.colors.background,
                                    borderRadius: theme.borderRadius.sm,
                                    gap: theme.spacing.sm
                                },
                                children: [
                                    {
                                        type: 'span',
                                        props: {
                                            style: { fontSize: '20px' },
                                            children: ['📄']
                                        }
                                    },
                                    {
                                        type: 'span',
                                        props: {
                                            children: [doc]
                                        }
                                    },
                                    {
                                        type: Button,
                                        props: {
                                            variant: 'text',
                                            size: 'small',
                                            children: ['View']
                                        }
                                    }
                                ]
                            }
                        }))
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
                                    children: ['← Back to Applications']
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
                                            : (application.status || '').toLowerCase() === 'accepted'
                                                ? '#e8f5e9' // Light green for accepted
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
                        children: [`Application Review: ${application.id || 'New Application'}`]
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
                        children: [`Submitted on: ${application.submittedDate || application.applicationDate || 'N/A'}`]
                    }
                },
                
                // Two column layout for information
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: theme.spacing.lg,
                            marginBottom: theme.spacing.xl
                        },
                        children: [
                            // Left column
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        // Personal Information
                                        renderInfoSection('Personal Information', [
                                            ['Applicant ID', application.id],
                                            ['Name', application.name],
                                            ['National ID', application.nationalId],
                                            ['Email', application.email],
                                            ['Phone', application.phone],
                                            ['Gender', application.gender],
                                            ['Date of Birth', application.dateOfBirth],
                                            ['Address', application.address]
                                        ]),
                                        
                                        // Guardian Information
                                        renderInfoSection('Guardian Information', [
                                            ['Name', application.guardianName],
                                            ['National ID', application.guardianNationalId],
                                            ['Relation', application.guardianRelation],
                                            ['Contact Number', application.guardianContactNumber],
                                            ['Email', application.guardianEmail]
                                        ])
                                    ]
                                }
                            },
                            
                            // Right column
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        // Applied Program Information
                                        renderInfoSection('Applied Degree Program', [
                                            ['Applied Program', application.appliedProgram],
                                            ['Application Date', application.applicationDate],
                                        ]),
                                        
                                        // Academic Records
                                        renderInfoSection('Academic Records', [
                                            ['Mathematics', application.mathematics],
                                            ['Science', application.science],
                                            ['English', application.english],
                                            ['Computer Studies', application.computerStudies],
                                        ]),
                                        
                                        // Hostel Information
                                        renderInfoSection('Hostel Required', [
                                            ['Do you hope to apply for hostels?', application.hostelRequired]
                                        ])
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Documents section (full width)
                application.documents && renderDocumentsSection(),
                
                // Accept/Reject Modals
                showAcceptModal && {
                    type: AcceptApplication,
                    props: {
                        application: application,
                        onClose: () => setShowAcceptModal(false)
                    }
                },
                
                showRejectModal && {
                    type: RejectApplication,
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
                                    children: ['Accept Application']
                                }
                            }
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };
};

window.ViewApplication = ViewApplication;