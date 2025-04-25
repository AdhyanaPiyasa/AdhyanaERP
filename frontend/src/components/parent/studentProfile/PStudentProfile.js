const PStudentProfile = () => {
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
        // value: {
        //     width: '60%',
        //     color: theme.colors.textPrimary
        // },
        quickAccess: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl
        }
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
                                                src: 'src/assets/profile.jpeg',
                                                style: styles.avatar,
                                                alt: 'Profile'
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
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: PStudentCourseProfile,
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.quickAccess,
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => navigation.navigate('student/other/grades'),
                                                variant: 'secondary',
                                                children: 'Grade Book'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => navigation.navigate('student/other/attendance'),
                                                variant: 'secondary',
                                                children: 'Attendance'
                                            }
                                        }
                                        
                                    ]
                                }
                            }
                        ]
                    }
                } 
            ].filter(Boolean)
        }
    };
};


window.PStudentProfile = PStudentProfile;