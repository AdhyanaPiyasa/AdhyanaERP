const Calendar = ({ events = [] }) => {
    const [currentDate, setCurrentDate] = MiniReact.useState(new Date());

    // Style for events
    const eventStyles = {
        event: {
            fontSize: '11px',
            padding: '2px 4px',
            marginBottom: '2px',
            backgroundColor: '#E3F2FD',
            borderRadius: '2px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        },
        cell: {
            padding: '8px',
            border: '1px solid #eee',
            verticalAlign: 'top',
            height: '100px'
        },
        dateNumber: {
            fontSize: '14px',
            marginBottom: '4px'
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const weeks = [];
        let days = [];

        // Empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            days.push({
                type: 'td',
                props: {
                    style: {
                        ...eventStyles.cell,
                        backgroundColor: '#fafafa'
                    }
                }
            });
        }

        // Fill days
        for (let day = 1; day <= daysInMonth; day++) {
            // Format the date string to match event date (YYYY-MM-DD)
            const paddedMonth = (month + 1).toString().padStart(2, '0');
            const paddedDay = day.toString().padStart(2, '0');
            const dateStr = `${year}-${paddedMonth}-${paddedDay}`;

            // Find events for this date
            const dayEvents = events.filter(event => event.date === dateStr);

            days.push({
                type: 'td',
                props: {
                    style: eventStyles.cell,
                    children: [
                        {
                            type: 'div',
                            props: {
                                children: [
                                    // Date number
                                    {
                                        type: 'div',
                                        props: {
                                            style: eventStyles.dateNumber,
                                            children: [day]
                                        }
                                    },
                                    // Events
                                    ...dayEvents.map(event => ({
                                        type: 'div',
                                        props: {
                                            style: eventStyles.event,
                                            children: [event.title]
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

        // Fill remaining days
        if (days.length > 0) {
            while (days.length < 7) {
                days.push({
                    type: 'td',
                    props: {
                        style: {
                            ...eventStyles.cell,
                            backgroundColor: '#fafafa'
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
                // Navigation
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
                // Calendar grid
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
window.Calendar = Calendar;