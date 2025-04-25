// components/Administrator/scholarship/ScholarshipApplicationView.js
const ViewScholarshipApplication = ({ application, onClose }) => {
    if (!application) return null;

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
                                        width: '40%', 
                                        fontWeight: 'bold',
                                        color: theme.colors.textSecondary
                                    },
                                    children: [label]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { width: '60%' },
                                    children: [value || '-']
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    });

    const renderCommentsSection = () => ({
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
                        children: ['System Comments']
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
                        children: [application.comments || 'No comments available']
                    }
                }
            ]
        }
    });

    // Get status color for badge
    const getStatusColor = (status) => {
        switch((status || '').toLowerCase()) {
            case 'approved':
                return { backgroundColor: '#e8f5e9', color: '#2e7d32' }; // Light green
            case 'rejected':
                return { backgroundColor: '#ffebee', color: '#c62828' }; // Light red
            case 'pending':
            default:
                return { backgroundColor: '#fff9c4', color: '#f57f17' }; // Light yellow
        }
    };

    // Main page layout
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Scholarship Application Details',
            children: [
                // Main Content
                {
                    type: 'div',
                    props: {
                        style: { maxWidth: '100%' },
                        children: [
                            // Header with application ID and status
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
                                        // Application ID
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { fontWeight: 'bold' },
                                                children: [`Application #${application.id}`]
                                            }
                                        },
                                        // Application status badge
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                                    borderRadius: theme.borderRadius.sm,
                                                    fontWeight: 'bold',
                                                    ...getStatusColor(application.status)
                                                },
                                                children: [application.status ? application.status.toUpperCase() : 'PENDING']
                                            }
                                        }
                                    ]
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
                            
                            // Student Information
                            renderInfoSection('Student Information', [
                                ['Student ID', application.studentId],
                                ['Scholarship', application.scholarshipId],
                                ['GPA', application.studentGpa],
                                ['Degree Program', application.studentDegree],
                                ['Batch', application.studentBatch],
                            ]),
                            
                            // Comments Section (System feedback)
                            renderCommentsSection(),
                            
                            // Action Button (Close)
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        borderTop: `1px solid ${theme.colors.border}`
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                onClick: onClose,
                                                children: ['Close']
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

window.ViewScholarshipApplication = ViewScholarshipApplication;