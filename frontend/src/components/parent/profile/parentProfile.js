// components/parent/profile/ParentProfile.js
const ParentProfile = () => {
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);

    const profileData = {
        name: 'John Doe',
        email: 'johndoe@college.edu',
        role: 'Parent',
        mobileNumber: '01234566789',
        address: 'Colombo',
        occupation: 'Engineer',
        relationship: 'Father',
        children: [
            {
                name: 'Jane Doe',
                grade: '10th',
                studentId: 'ST2024001'
            },
            {
                name: 'Jack Doe',
                grade: '8th',
                studentId: 'ST2024002'
            }
        ]
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
            boxShadow: theme.shadows.md,
            marginBottom: theme.spacing.lg
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
        avatar: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: `2px solid ${theme.colors.primary}`,
            objectFit: 'cover'
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
        },
        childrenTable: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            padding: theme.spacing.md,
            fontWeight: 'bold',
            textAlign: 'left',
            borderBottom: `2px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundAlt
        },
        tableCell: {
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`
        },
        sectionTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.md,
            padding: theme.spacing.md
        }
    };

    const profileDetails = [
        { label: 'Name', value: profileData.name },
        { label: 'Email', value: profileData.email },
        { label: 'Role', value: profileData.role },
        { label: 'Mobile Number', value: profileData.mobileNumber },
        { label: 'Address', value: profileData.address },
        { label: 'Occupation', value: profileData.occupation },
        { label: 'Relationship', value: profileData.relationship }
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
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: theme.spacing.lg,
                        },
                        children: ['Parent Profile']
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
                                                            children: [profileData.name ? profileData.name.charAt(0).toUpperCase() : 'P']
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
                                                                        children: [profileData.name]
                                                                    }
                                                                },
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: styles.role,
                                                                        children: [profileData.role]
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
                // Children Information Card
                {
                    type: Card,
                    props: {
                        style: styles.profileCard,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: styles.sectionTitle,
                                    children: ['Children Information']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.infoContainer,
                                    children: [
                                        {
                                            type: 'table',
                                            props: {
                                                style: styles.childrenTable,
                                                children: [
                                                    {
                                                        type: 'thead',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'tr',
                                                                    props: {
                                                                        children: [
                                                                            {
                                                                                type: 'th',
                                                                                props: {
                                                                                    style: styles.tableHeader,
                                                                                    children: ['Name']
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'th',
                                                                                props: {
                                                                                    style: styles.tableHeader,
                                                                                    children: ['Grade']
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'th',
                                                                                props: {
                                                                                    style: styles.tableHeader,
                                                                                    children: ['Student ID']
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'th',
                                                                                props: {
                                                                                    style: styles.tableHeader,
                                                                                    children: ['Action']
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'tbody',
                                                        props: {
                                                            children: profileData.children.map(child => ({
                                                                type: 'tr',
                                                                props: {
                                                                    children: [
                                                                        {
                                                                            type: 'td',
                                                                            props: {
                                                                                style: styles.tableCell,
                                                                                children: [child.name]
                                                                            }
                                                                        },
                                                                        {
                                                                            type: 'td',
                                                                            props: {
                                                                                style: styles.tableCell,
                                                                                children: [child.grade]
                                                                            }
                                                                        },
                                                                        {
                                                                            type: 'td',
                                                                            props: {
                                                                                style: styles.tableCell,
                                                                                children: [child.studentId]
                                                                            }
                                                                        },
                                                                        {
                                                                            type: 'td',
                                                                            props: {
                                                                                style: styles.tableCell,
                                                                                children: [
                                                                                    {
                                                                                        type: Button,
                                                                                        props: {
                                                                                            variant: 'secondary',
                                                                                            size: 'sm',
                                                                                            onClick: () => navigation.navigate(`children/${child.studentId}`),
                                                                                            children: 'View Details'
                                                                                        }
                                                                                    }
                                                                                ]
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
                                type: ParentProfileEdit,
                                props: {
                                    profileData,
                                    onSave: (updatedData) => {
                                        console.log('Updated data:', updatedData);
                                        setShowEditModal(false);
                                    },
                                    onCancel: () => setShowEditModal(false)
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.ParentProfile = ParentProfile;