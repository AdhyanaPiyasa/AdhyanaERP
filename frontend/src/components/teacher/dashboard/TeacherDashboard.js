// components/teacher/dashboard/TeacherDashboard.js
const TeacherDashboard = () => {
    const [showAssignment, setShowAssignment] = MiniReact.useState(false);
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
            justifyContent: 'space-between',
            marginTop: theme.spacing.lg
        }
    };

    // Handle display of different dashboard modes
    if (showAssignment) {
        return {
            type: AssignmentDashboard,
            props: {
                onBack: () => setShowAssignment(false)
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

    // Main dashboard layout
    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                // Quick Actions Card (full width, at the top)
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
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Left column - Announcements
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
                
                // Right column - Course Schedule
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
                
                // Full width - Assignments section
                {
                    type: 'div',
                    props: {
                        style: styles.fullWidth,
                        children: [
                            {
                                type: RecentAssignments,
                                props: {}
                            }
                        ]
                    }
                },
                
                // Action buttons at the bottom
                {
                    type: 'div',
                    props: {
                        style: styles.buttonContainer,
                        children: [
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowAssignment(true),
                                    children: 'Assignments'
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowGrade(true),
                                    children: 'Grades'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.TeacherDashboard = TeacherDashboard;