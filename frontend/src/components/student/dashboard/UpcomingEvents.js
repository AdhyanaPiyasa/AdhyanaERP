// Improved Upcoming Events component
const ImprovedUpcomingEvents = () => {
    const [events] = MiniReact.useState([
        {
            title: 'Assignment 1',
            course: 'Data Structures and Algorithm',
            dueDate: '3/15/2024',
            remainingDays: 1,
            type: 'assignment'
        },
        {
            title: 'Quiz 1',
            course: 'Data Structures and Algorithm',
            dueDate: '3/20/2024',
            remainingDays: 6,
            type: 'quiz'
        },
        {
            title: 'Project Proposal',
            course: 'Software Engineering',
            dueDate: '3/25/2024',
            remainingDays: 11,
            type: 'project'
        },
        {
            title: 'Midterm Exam',
            course: 'Database Systems',
            dueDate: '4/05/2024',
            remainingDays: 22,
            type: 'exam'
        }
    ]);

    const getTypeIcon = (type) => {
        switch(type) {
            case 'assignment': return '📝';
            case 'quiz': return '✍️';
            case 'project': return '🔍';
            case 'exam': return '📚';
            default: return '📌';
        }
    };

    return {
        type: Card,
        props: {
            variant: 'elevated',
            children: events.map(event => ({
                type: Card,
                props: {
                    variant: 'outlined',
                    style: {
                        marginBottom: theme.spacing.sm,
                        borderLeft: `4px solid ${event.remainingDays <= 3 ? theme.colors.error : (event.remainingDays <= 7 ? theme.colors.warning : theme.colors.primary)}`
                    },
                    children: [
                        {
                            type: 'div',
                            props: {
                                style: { 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: theme.spacing.sm
                                },
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: theme.spacing.sm,
                                                            fontWeight: 'bold'
                                                        },
                                                        children: [
                                                            getTypeIcon(event.type),
                                                            event.title
                                                        ]
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            fontSize: theme.typography.caption.fontSize,
                                                            color: theme.colors.textSecondary,
                                                            marginTop: theme.spacing.xs
                                                        },
                                                        children: [event.course]
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        type: 'div',
                                        props: {
                                            style: {
                                                textAlign: 'right',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end'
                                            },
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            fontWeight: 'bold',
                                                            color: event.remainingDays <= 3 ? theme.colors.error : 
                                                                  (event.remainingDays <= 7 ? theme.colors.warning : theme.colors.primary)
                                                        },
                                                        children: [`${event.remainingDays} day${event.remainingDays !== 1 ? 's' : ''}`]
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            fontSize: theme.typography.caption.fontSize,
                                                            color: theme.colors.textSecondary,
                                                            marginTop: theme.spacing.xs
                                                        },
                                                        children: [`Due: ${event.dueDate}`]
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
            }))
        }
    };
};
window.UpcomingEvents = ImprovedUpcomingEvents;