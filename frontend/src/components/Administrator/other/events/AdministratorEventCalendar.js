// components/Administrator/other/events/AdministratorEventCalendar.js
const AdministratorEventCalendar = ({ events, onEditEvent, onDeleteEvent }) => {
    // Style constants for event display
    const eventStyles = {
        event: {
            fontSize: '11px',
            padding: '2px 4px',
            marginBottom: '2px',
            backgroundColor: '#E3F2FD',
            borderRadius: '2px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
        },
        cell: {
            padding: '4px',
            border: '1px solid #eee',
            verticalAlign: 'top',
            height: '100px',
            width: '14.28%'
        },
        dateNumber: {
            fontSize: '12px',
            marginBottom: '4px'
        }
    };
    const [currentDate, setCurrentDate] = MiniReact.useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const weeks = [];
        let days = [];

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            days.push({
                type: 'td',
                props: {
                    style: {
                        padding: '10px',
                        border: '1px solid #eee'
                    }
                }
            });
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            // Format the date to match the event date format (YYYY-MM-DD)
            const date = new Date(year, month, day);
            const dateString = date.toISOString().slice(0, 10); // This ensures format is YYYY-MM-DD
            
            // Filter events for this day
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year &&
                       eventDate.getMonth() === month &&
                       eventDate.getDate() === day;
            });

            days.push({
                type: 'td',
                props: {
                    style: {
                        ...eventStyles.cell
                    },
                    children: [
                        {
                            type: 'div',
                            props: {
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: eventStyles.dateNumber,
                                            children: [day.toString()]
                                        }
                                    },
                                    ...dayEvents.map(event => ({
                                        type: 'div',
                                        props: {
                                            style: eventStyles.event,
                                            onclick: () => onEditEvent(event),
                                            children: [
                                                event.title
                                            ]
                                        }
                                    }))
                                ]
                            }
                        }
                    ]
                }
            });

            if (days.length === 7) {
                weeks.push({
                    type: 'tr',
                    props: {
                        children: days
                    }
                });
                days = [];
            }
        }

        // Add remaining days to last week
        if (days.length > 0) {
            while (days.length < 7) {
                days.push({
                    type: 'td',
                    props: {
                        style: {
                            padding: '10px',
                            border: '1px solid #eee'
                        }
                    }
                });
            }
            weeks.push({
                type: 'tr',
                props: {
                    children: days
                }
            });
        }

        return weeks;
    };

    return {
        type: 'div',
        props: {
            children: [
                // Calendar navigation
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    onClick: () => {
                                        const newDate = new Date(currentDate);
                                        newDate.setMonth(newDate.getMonth() - 1);
                                        setCurrentDate(newDate);
                                    },
                                    children: 'Previous'
                                }
                            },
                            {
                                type: 'h3',
                                props: {
                                    children: [
                                        currentDate.toLocaleDateString('default', {
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                    ]
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => {
                                        const newDate = new Date(currentDate);
                                        newDate.setMonth(newDate.getMonth() + 1);
                                        setCurrentDate(newDate);
                                    },
                                    children: 'Next'
                                }
                            }
                        ]
                    }
                },
                // Calendar table
                {
                    type: 'table',
                    props: {
                        style: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        children: [
                            {
                                type: 'thead',
                                props: {
                                    children: [{
                                        type: 'tr',
                                        props: {
                                            children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
                                                type: 'th',
                                                props: {
                                                    style: {
                                                        padding: '10px',
                                                        backgroundColor: '#f5f5f5',
                                                        border: '1px solid #eee'
                                                    },
                                                    children: [day]
                                                }
                                            }))
                                        }
                                    }]
                                }
                            },
                            {
                                type: 'tbody',
                                props: {
                                    children: renderCalendar()
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.AdministratorEventCalendar = AdministratorEventCalendar;