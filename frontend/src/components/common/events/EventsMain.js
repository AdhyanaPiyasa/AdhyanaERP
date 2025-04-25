const EventsMain = () => {
    const [showCalendarView, setShowCalendarView] = MiniReact.useState(true);
    const [events] = MiniReact.useState([
        {
            id: 1,
            title: "Orientation Day",
            date: "2025-02-15",
            description: "New student orientation program"
        },
        {
            id: 2,
            title: "Final Exams Begin",
            date: "2025-02-24",
            description: "Final examination period begins"
        }
    ]);

    return {
        type: 'div',
        props: {
            children: [
                // Main Header Card
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Events Calendar']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Events Content Card
                {
                    type: Card,
                    props: {
                        children: [
                            // Header with view toggle
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
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Upcoming Events']
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                display: 'flex',
                                                                gap: theme.spacing.sm
                                                            },
                                                            children: [
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        variant: showCalendarView ? 'secondary' : 'primary',
                                                                        onClick: () => setShowCalendarView(false),
                                                                        children: 'List View'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        variant: showCalendarView ? 'primary' : 'secondary',
                                                                        onClick: () => setShowCalendarView(true),
                                                                        children: 'Calendar View'
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
                            // Calendar or List view
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        showCalendarView ? {
                                            type: Calendar,
                                            props: {
                                                events: events
                                            }
                                        } : {
                                            type: EventList,
                                            props: {
                                                events: events
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


window.EventsMain = EventsMain;