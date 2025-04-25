// components/Admin/students/ViewStudent.js
const viewScholarship = ({ scholarship, onClose }) => {
    const styles = {
        profileContainer: {
            padding: theme.spacing.lg
        },
        sectionTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.md,
            color: theme.colors.primary
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing.md
        },
        infoRow: {
            display: 'flex',
            borderBottom: `1px solid ${theme.colors.border}`,
            padding: `${theme.spacing.sm} 0`
        },
        infoLabel: {
            width: '180px',
            fontWeight: 'bold',
            color: theme.colors.textSecondary
        },
        actions: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: theme.spacing.xl,
            gap: theme.spacing.md
        }
    };

    // Format student info into clean field/value pairs
    const scholarshipInfo = [
        { label: 'Name', value: scholarship.name },
        { label: 'Description', value: scholarship.description },
        { label: 'Min GPA', value: scholarship.minGpa },
        { label: 'Amount', scholarship: scholarship.amount },
        { label: 'Application Deadline', value: scholarship.applicationDeadline }
    ];

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Scholarship details',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: styles.profileContainer,
                                    children: [
                                        // Basic Information Section
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.sectionTitle,
                                                children: ['Scholarship Information']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.infoGrid,
                                                children: scholarshipInfo.map(info => ({
                                                    type: 'div',
                                                    props: {
                                                        style: styles.infoRow,
                                                        children: [
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: styles.infoLabel,
                                                                    children: [info.label]
                                                                }
                                                            },
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: styles.infoValue,
                                                                    children: [info.value]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }))
                                            }
                                        },
                                        
                                        // Action buttons
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.actions,
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'primary',
                                                            onClick: onClose,
                                                            children: 'Close'
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
                }
            ]
        }
    };
};

window.viewScholarship = viewScholarship;