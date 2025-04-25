// components/Administrator/students/StudentMain.js
const StudentMain = () => {
    // Statistics data for applicants and enrolled students
    const applicantStats = {
        totalApplications: 45,
        approvedApplications: 20,
        rejectedApplications: 30
    };

    const enrollmentStats = {
        totalDegreePrograms: 10,
        totalBatches: 5,
        totalStudents: 1000
    };

    // Cards data
    const cardItems = [
        {
            id: 'applicants',
            title: 'New Applicants',
            path: 'students/applicants',
            icon: '👨‍🎓',
            stats: [
                { label: 'Total Applications', value: applicantStats.totalApplications },
                { label: 'Approved Applications', value: applicantStats.approvedApplications },
                { label: 'Rejected Applications', value: applicantStats.rejectedApplications }
            ]
        },
        {
            id: 'studentDegree',
            title: 'Enrolled students',
            path: 'students/StudentDegree',
            icon: '🎓',
            stats: [
                { label: 'Total Degree Programs', value: enrollmentStats.totalDegreePrograms },
                { label: 'Total Batches', value: enrollmentStats.totalBatches },
                { label: 'Total Students', value: enrollmentStats.totalStudents }
            ]
        }
    ];

    // Create the cards using common Card component
    const renderStatCards = () => cardItems.map(item => ({
        type: Card,
        props: {
            variant: 'elevated',
            onClick: () =>{
                if (navigation.getCurrentRoute() !== item.path) {
                    navigation.navigate(item.path);
                }
            },
            style: {
                margin: theme.spacing.md,
            },
            children: [
                // Card header with title
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        noPadding: true,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                    children: [
                                        // Icon
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    fontSize: '48px',
                                                },
                                                children: [item.icon]
                                            }
                                        },
                                        // Title
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
                            }
                        ]
                    }
                },
                
                // Stats items
                ...item.stats.map(stat => ({
                    type: Card,
                    props: {
                        variant: 'ghost',
                        style: {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    },
                                    children: [
                                        // Label
                                        {
                                            type: 'span',
                                            props: {
                                                style: {
                                                    fontWeight: 'bold',
                                                    color: theme.colors.textSecondary
                                                },
                                                children: [`${stat.label} :`]
                                            }
                                        },
                                        // Value
                                        {
                                            type: 'span',
                                            props: {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 'bold'
                                                },
                                                children: [stat.value]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }))
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