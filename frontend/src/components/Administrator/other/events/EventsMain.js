// components/Administrator/other/events/EventsMain.js
const EventsMain = () => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedEvent, setSelectedEvent] = MiniReact.useState(null);
    const [showCalendarView, setShowCalendarView] = MiniReact.useState(true);
    const [events, setEvents] = MiniReact.useState([
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

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setShowEditModal(true);
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        console.log('Deleting event:', selectedEvent);
        setShowDeleteModal(false);
    };

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
                                                children: ['Events']
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
                            // Header Section with Title and Buttons
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
                                                            children: ['Event Details']
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
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => setShowAddModal(true),
                                                                        children: '+ Add New Event'
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

                            // Main Content Section
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        showCalendarView ? {
                                            type: AdministratorEventCalendar,
                                            props: {
                                                events: events,
                                                onEditEvent: handleEdit,
                                                onDeleteEvent: handleDelete
                                            }
                                        } : {
                                            type: AdministratorEventList,
                                            props: {
                                                events: events,
                                                onEditEvent: handleEdit,
                                                onDeleteEvent: handleDelete
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Modals
                showAddModal && {
                    type: CreateEvent,
                    props: {
                        onClose: () => setShowAddModal(false),
                        onSave: (newEvent) => {
                            setEvents([...events, { ...newEvent, id: events.length + 1 }]);
                            setShowAddModal(false);
                        }
                    }
                },
                showEditModal && {
                    type: EditEvent,
                    props: {
                        event: selectedEvent,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: eventDeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.EventsMain = EventsMain;