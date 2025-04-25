// components/student/dashboard/Dashboard.js
const Dashboard = () => {
    const [stats] = MiniReact.useState({
        courses: 5,
        assignments: 3,
        announcements: 2,
        attendance: '85%',
        exams: 2,
        gpa: '3.7'
    });
    
    const iconStyle = {
        fontSize: '28px',
        marginBottom: theme.spacing.sm,
        display: 'block',
        textAlign: 'center'
    };
    
    const cardStyle = {
        textAlign: 'center',
        padding: theme.spacing.md,
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-4px)'
        }
    };
    
    const sectionStyle = {
        marginBottom: theme.spacing.xl
    };
    
    const sectionTitleStyle = {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: 'bold',
        marginBottom: theme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm
    };

    return {
        type: 'div',
        props: {
            style: {
                padding: theme.spacing.lg
            },
            children: [
                // Welcome section with user info and quick actions
                {
                    type: Card,
                    props: {
                        style: { 
                            marginBottom: theme.spacing.xl,
                            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'h1',
                                                        props: {
                                                            style: { 
                                                                color: theme.colors.primary, 
                                                                marginBottom: theme.spacing.xs 
                                                            },
                                                            children: ['Welcome back, John Doe!']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { color: theme.colors.textSecondary },
                                                            children: ['Computer Science • 2nd Year • Spring 2025']
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            onClick: () => navigation.navigate('communication'),
                                                            children: ['📧 Messages']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('courses'),
                                                            children: ['View Courses']
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
                
                // Stats Section
                {
                    type: 'div',
                    props: {
                        style: sectionStyle,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: sectionTitleStyle,
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['📊 Current Stats']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('courses'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['📚']
                                                        }
                                                    },
                                                    'Active Courses',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.primary },
                                                            children: [stats.courses]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('courses'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['📝']
                                                        }
                                                    },
                                                    'Pending Assignments',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.warning },
                                                            children: [stats.assignments]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('dashboard'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['📢']
                                                        }
                                                    },
                                                    'New Announcements',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.error },
                                                            children: [stats.announcements]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('other/attendance'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['📊']
                                                        }
                                                    },
                                                    'Attendance Rate',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.success },
                                                            children: [stats.attendance]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('other/exams'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['📅']
                                                        }
                                                    },
                                                    'Upcoming Exams',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.primary },
                                                            children: [stats.exams]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Card,
                                            props: {
                                                style: cardStyle,
                                                onClick: () => navigation.navigate('other/grades'),
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: iconStyle,
                                                            children: ['🎓']
                                                        }
                                                    },
                                                    'Current GPA',
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            style: { color: theme.colors.success },
                                                            children: [stats.gpa]
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
                // Attendance Chart Section
{
    type: 'div',
    props: {
        style: sectionStyle,
        children: [
            {
                type: AttendanceChart,
                props: {}
            }
        ]
    }
},
                
                // Timetable Section
                {
                    type: 'div',
                    props: {
                        style: sectionStyle,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: sectionTitleStyle,
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['⏰ Today\'s Schedule']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: Timetable,
                                props: {}
                            }
                        ]
                    }
                },
                
                // Main content section with Upcoming Events and Announcements
                {
                    type: 'div',
                    props: {
                        style: {
                            ...sectionStyle,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: theme.spacing.xl
                        },
                        children: [
                            // Upcoming Section
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: sectionTitleStyle,
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            children: ['⏳ Upcoming Deadlines']
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: ImprovedUpcomingEvents,
                                            props: {}
                                        }
                                    ]
                                }
                            },
                            
                            // Announcements Section
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: sectionTitleStyle,
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            children: ['📢 Recent Announcements']
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: ImprovedAnnouncementList,
                                            props: {}
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Quick Links Section
                {
                    type: 'div',
                    props: {
                        style: sectionStyle,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: sectionTitleStyle,
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['🔗 Quick Links']
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
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                    gap: theme.spacing.md,
                                                    padding: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('other/scholarship'),
                                                            children: ['🎓 Scholarships']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('other/hostel'),
                                                            children: ['🏠 Hostel Info']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('other/finance'),
                                                            children: ['💰 Finance']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('profile'),
                                                            children: ['👤 My Profile']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => navigation.navigate('events'),
                                                            children: ['📅 Calendar']
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
                }
            ]
        }
    };
};

window.Dashboard = Dashboard;
// const Dashboard = () => {
//     const [stats] = MiniReact.useState({
//         courses: 5,
//         assignments: 3,
//         announcements: 2,
//         attendance: '85%'
//     });

//     const iconStyle = {
//         fontSize: '28px',
//         marginBottom: theme.spacing.sm,
//         display: 'block'
//     };

//     return {
//         type: Card,
//         props: {
//             children: [
//                 {
//                     type: 'h1',
//                     props: {
//                         children: ['Welcome back, John Doe!']
//                     }
//                 },
//                 {
//                     type: 'div',
//                     props: {
//                         style: {
//                             display: 'grid',
//                             gridTemplateColumns: 'repeat(4, 1fr)',
//                             gap: theme.spacing.lg
//                         },
//                         children: [
//                             {
//                                 type: Card,
//                                 props: {
//                                     children: [
//                                         {
//                                             type: 'div',
//                                             props: {
//                                                 style: iconStyle,
//                                                 children: ['📚'] // Books icon for Courses
//                                             }
//                                         },
//                                         'Active Courses',
//                                         {
//                                             type: 'h2',
//                                             props: {
//                                                 style: { color: theme.colors.primary },
//                                                 children: [stats.courses]
//                                             }
//                                         }
//                                     ]
//                                 }
//                             },
//                             {
//                                 type: Card,
//                                 props: {
//                                     children: [
//                                         {
//                                             type: 'div',
//                                             props: {
//                                                 style: iconStyle,
//                                                 children: ['📝'] // Notepad icon for Assignments
//                                             }
//                                         },
//                                         'Pending Assignments',
//                                         {
//                                             type: 'h2',
//                                             props: {
//                                                 style: { color: theme.colors.warning },
//                                                 children: [stats.assignments]
//                                             }
//                                         }
//                                     ]
//                                 }
//                             },
//                             {
//                                 type: Card,
//                                 props: {
//                                     children: [
//                                         {
//                                             type: 'div',
//                                             props: {
//                                                 style: iconStyle,
//                                                 children: ['📢'] // Loudspeaker icon for Announcements
//                                             }
//                                         },
//                                         'New Announcements',
//                                         {
//                                             type: 'h2',
//                                             props: {
//                                                 style: { color: theme.colors.error },
//                                                 children: [stats.announcements]
//                                             }
//                                         }
//                                     ]
//                                 }
//                             },
//                             {
//                                 type: Card,
//                                 props: {
//                                     children: [
//                                         {
//                                             type: 'div',
//                                             props: {
//                                                 style: iconStyle,
//                                                 children: ['📊'] // Chart icon for Attendance
//                                             }
//                                         },
//                                         'Attendance Rate',
//                                         {
//                                             type: 'h2',
//                                             props: {
//                                                 style: { color: theme.colors.success },
//                                                 children: [stats.attendance]
//                                             }
//                                         }
//                                     ]
//                                 }
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     type: 'div',
//                     props: {
//                         style: {
//                             display: 'grid',
//                             gridTemplateColumns: '1fr 1fr',
//                             gap: theme.spacing.xl
//                         },
//                         children: [
//                             {
//                                 type: UpcomingEvents,
//                                 props: {}
//                             },
//                             // {
//                             //     type: Timetable,
//                             //     props: {}
//                             // },
//                             {
//                                 type: AnnouncementList,
//                                 props: {}
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     };
// };
// window.Dashboard = Dashboard;