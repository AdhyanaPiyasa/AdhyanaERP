const TeacherDashboard = () => {
    const [showAssignment, setShowassignment] = MiniReact.useState(false);
    const [showGrade, setShowGrade] = MiniReact.useState(false);

    
    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: theme.spacing.xl
        },
        fullWidth: {
            gridColumn: '1 / -1'
        },
        quickActionCard: {
            marginBottom: theme.spacing.lg
        },
        buttonContainer: {
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'space-between'
        }
    };
    if (showAssignment) {
        return {
            type: AssignmentDashboard,
            props: {
                
                onBack: () => setShowassignment(false)
            }
        };
    }
    if (showGrade) {
        return {
            type: GradeDashboard,
            props: {
                
                onBack: () => setShowGrade(false)
            }
        };
    }

    

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                // New Quick Actions Card (full width, at the top)
                {
                    type: 'div',
                    props: {
                        style: styles.fullWidth,
                        children: [
                            {
                                type: Card,
                                props: {
                                    style: styles.quickActionCard,
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                children: ['Quick Actions']
                                            }
                                        },
                                     
                                    ]
                                }
                            }
                        ]
                    }
                },
                // Original content starts here
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: TeacherAnnouncements,
                                props: {}
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: CourseSchedule,
                                props: {}
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.fullWidth,
                        children: [{
                            type: RecentAssignments,
                            props: {}
                        }]
                    }
                },   {
                                            type: 'div',
                                            props: {
                                                style: styles.buttonContainer,
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowassignment(true),
                                                            children: 'Assignments'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowGrade(true),
                                                            children: 'Grades'
                                                        }
                                                    },
                                                //     {
                                                //         type: Button,
                                                //         props: {
                                                //             onClick: () => console.log('Create Report clicked'),
                                                //             children: 'Create Report'
                                                //         }
                                                //     }
                                                ]
                                            }
                                        }
            ]
        }
    };
};

window.TeacherDashboard = TeacherDashboard;