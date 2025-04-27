// components/student/profile/StudentProfile.js
const StudentProfile = () => {
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);

    const profileData = {
        name: 'John Doe',
        email: 'johndoe@college.edu',
        degreeProg: 'Computer Science',
        indexNumber: '22000846',
        regNumber: '2022/CS/86',
        mobileNumber: '07123456789',
        birthDate: '05-08-2002',
        state: 'Colombo'
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
        // Removed course profile and quick access styles as they're no longer needed
    };

    const profileDetails = [
        { label: 'Name', value: profileData.name },
        { label: 'Email', value: profileData.email },
        { label: 'Degree Program', value: profileData.degreeProg },
        { label: 'Index Number', value: profileData.indexNumber },
        { label: 'Registration Number', value: profileData.regNumber },
        { label: 'Mobile Number', value: profileData.mobileNumber },
        { label: 'Birth Date', value: profileData.birthDate },
        { label: 'State', value: profileData.state }
    ];
    // Removed quickAccessItems since we're not showing them anymore

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
                        children: ['Student Profile']
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
                                                            children: [profileData.name ? profileData.name.charAt(0).toUpperCase() : 'A']
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
                                                                        children: ['Student']
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
                                type: StudentProfileEdit,
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

window.StudentProfile = StudentProfile;