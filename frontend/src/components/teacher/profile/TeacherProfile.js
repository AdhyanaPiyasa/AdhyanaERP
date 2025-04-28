// components/teacher/profile/Profile.js
const TeacherProfile = () => {
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);

    const teacherData = {
        name: AppState?.userData?.name || "John Doe",
        email: AppState?.userData?.email || "johndoe@college.edu",
        role: "Teacher",
        employeeNumber: "E200",
        mobileNumber: AppState?.userData?.phone || "0147258369",
        address: "Colombo"
    };

    const styles = {
        container: {
            padding: theme.spacing.lg,
            maxWidth: '800px',
            margin: '0 auto'
        },
        profileCard: {
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            boxShadow: theme.shadows.md
        },
        profileHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background
        },
        profileInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md
        },
        nameSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs
        },
        name: {
            fontSize: theme.typography.h2.fontSize,
            fontWeight: 'bold',
            color: theme.colors.textPrimary
        },
        role: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.colors.textSecondary
        },
        infoContainer: {
            padding: theme.spacing.lg
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing.md
        },
        infoRow: {
            display: 'flex',
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
            alignItems: 'center'
        },
        label: {
            width: '40%',
            fontWeight: 'bold',
            color: theme.colors.textSecondary
        },
        value: {
            width: '60%',
            color: theme.colors.textPrimary
        }
    };

    const profileDetails = [
        { label: 'Name', value: teacherData.name },
        { label: 'Email', value: teacherData.email },
        { label: 'Role', value: teacherData.role },
        { label: 'Employee Number', value: teacherData.employeeNumber },
        { label: 'Mobile Number', value: teacherData.mobileNumber },
        { label: 'Address', value: teacherData.address }
    ];

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                {
                    type: 'h1',
                    props: {
                        style: {
                            fontSize: '24 px',
                            fontWeight: 'bold',
                            marginBottom: theme.spacing.lg,
                        },
                        children: ['Teacher Profile']
                    }
                },
                // Profile Information Card
                {
                    type: Card,
                    props: {
                        style: styles.profileCard,
                        children: [
                            // Profile Header with Avatar and Edit Button
                            {
                                type: 'div',
                                props: {
                                    style: styles.profileHeader,
                                    children: [
                                        // Avatar and Name
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.profileInfo,
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                width: '80px',
                                                                height: '80px',
                                                                borderRadius: '50%',
                                                                backgroundColor: theme.colors.primary + '20',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '32px',
                                                                color: theme.colors.primary,
                                                                border: `2px solid ${theme.colors.primary}`
                                                            },
                                                            children: [teacherData.name ? teacherData.name.charAt(0).toUpperCase() : 'T']
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: styles.nameSection,
                                                            children: [
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: styles.name,
                                                                        children: [teacherData.name]
                                                                    }
                                                                },
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: styles.role,
                                                                        children: [teacherData.role]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        // Edit Profile Button
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => setShowEditModal(true),
                                                variant: 'primary',
                                                children: 'Edit Profile'
                                            }
                                        }
                                    ]
                                }
                            },
                            // Profile Details
                            {
                                type: 'div',
                                props: {
                                    style: styles.infoContainer,
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.infoGrid,
                                                children: profileDetails.map(item => ({
                                                    type: 'div',
                                                    props: {
                                                        style: styles.infoRow,
                                                        children: [
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: styles.label,
                                                                    children: [item.label]
                                                                }
                                                            },
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: styles.value,
                                                                    children: [item.value]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }))
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                // Edit Profile Modal
                showEditModal && {
                    type: Modal,
                    props: {
                        isOpen: true,
                        onClose: () => setShowEditModal(false),
                        title: 'Edit Profile',
                        children: [
                            {
                                type: 'div', // Replace with TeacherProfileEdit when available
                                props: {
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                children: ['Edit profile form would go here']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    gap: theme.spacing.md,
                                                    marginTop: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowEditModal(false),
                                                            variant: 'secondary',
                                                            children: 'Cancel'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowEditModal(false),
                                                            variant: 'primary',
                                                            children: 'Save'
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

window.TeacherProfile = TeacherProfile;