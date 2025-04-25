const AdministratorProfile = () => {
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);

    const profileData = {
        name: 'John Doe',
        email: 'johndoe@college.edu',
        role: 'Administrator',
        employeeNumber: '22000846',
        mobileNumber: '07123456789',
        birthDate: '05-08-2002',
        state: 'Colombo'
    };

    const styles = {
        profileHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            padding: theme.spacing.md
        },
        avatar: {
            width: '72px',
            height: '72px',
            borderRadius: '50%'
        },
        infoContainer: {
            display: 'grid',
            gap: theme.spacing.md,
            padding: theme.spacing.lg
        },
        infoRow: {
            display: 'flex',
            padding: `${theme.spacing.sm} 0`,
            borderBottom: `1px solid ${theme.colors.border}`
        },
        label: {
            width: '50%',
            color: theme.colors.textSecondary,
            fontWeight: '800'
        },
        value: {
            width: '50%',
            color: theme.colors.textPrimary
        },
        actionsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl
        }
    };

    const profileDetails = [
        { label: 'Name', value: profileData.name },
        { label: 'Email', value: profileData.email },
        { label: 'Role', value: profileData.role },
        { label: 'Employee Number', value: profileData.employeeNumber },
        { label: 'Mobile Number', value: profileData.mobileNumber },
        { label: 'Birth Date', value: profileData.birthDate },
        { label: 'State', value: profileData.state }
    ];

    return {
        type: 'div',
        props: {
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: theme.spacing.lg
            },
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: styles.profileHeader,
                                    children: [
                                        {
                                            type: 'img',
                                            props: {
                                                src: '/api/placeholder/72/72',
                                                style: styles.avatar,
                                                alt: 'Profile'
                                            }
                                        },
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
                            {
                                type: 'div',
                                props: {
                                    style: styles.infoContainer,
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
                },
       
                showEditModal && {
                    type: Modal,
                    props: {
                        isOpen: true,
                        onClose: () => setShowEditModal(false),
                        title: 'Edit Profile',
                        children: [
                            {
                                type: AdministratorProfileEdit,
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
            ].filter(Boolean)
        }
    };
};

window.AdministratorProfile = AdministratorProfile;