// components/Admin/students/ViewStudent.js
const ViewStudent = ({ student, onClose }) => {
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
    const studentInfo = [
        { label: 'Name', value: student.name },
        { label: 'Email', value: student.email },
        { label: 'Index Number', value: student.indexNumber },
        { label: 'Registration Number', value: student.registrationNumber },
        { label: 'Mobile Number', value: student.mobileNumber }
    ];

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Student Profile',
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
                                        // Profile image (placeholder)
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg,
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                width: '64px',
                                                                height: '64px',
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.colors.primary + '20',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '24px',
                                                                color: theme.colors.primary
                                                            },
                                                            children: [student.name ? student.name.charAt(0).toUpperCase() : 'S']
                                                        }
                                                    },
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: {
                                                                fontSize: theme.typography.h2.fontSize,
                                                                fontWeight: 'bold'
                                                            },
                                                            children: [student.name]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Basic Information Section
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.sectionTitle,
                                                children: ['Basic Information']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.infoGrid,
                                                children: studentInfo.map(info => ({
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

window.ViewStudent = ViewStudent;