// components/Administrator/students/StudentMain.js
const StudentMain = () => {
    // Cards data
    const cardItems = [
        {
            id: 'applicants',
            title: 'New Applicants',
            path: 'students/applicants',
            icon: '👨‍🎓'
        },
        {
            id: 'studentDegree',
            title: 'Enrolled students',
            path: 'students/StudentDegree',
            icon: '🎓'
        }
    ];

    // Create the cards using common Card component
    const renderStatCards = () => cardItems.map(item => ({
        type: Card,
        props: {
            variant: 'elevated',
            onClick: () => {
                if (navigation.getCurrentRoute() !== item.path) {
                    navigation.navigate(item.path);
                }
            },
            style: {
                margin: theme.spacing.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: theme.spacing.lg
            },
            children: [
                // Card header with title
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        noPadding: true,
                        style: {
                            width: '100%'
                        },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: {
                                        textAlign: 'center',
                                        borderBottom: '2px solid #eee',
                                        paddingBottom: theme.spacing.sm,
                                        width: '100%'
                                    },
                                    children: [item.title]
                                }
                            }
                        ]
                    }
                },
                
                // Large centered icon
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: theme.spacing.xl,
                            height: '250px',
                            width: '100%'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '100px',
                                        textAlign: 'center'
                                    },
                                    children: [item.icon]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }));

    return {
        type: Card,
        props: {
            children: [
                // Header
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Student Management'],
                                }
                            }
                        ]
                    }
                },
                // Cards container
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: theme.spacing.xl,
                        },
                        children: renderStatCards()
                    }
                }
            ]
        }
    };
};

window.StudentMain = StudentMain;