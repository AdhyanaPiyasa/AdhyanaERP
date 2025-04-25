// components/Admin/dashboard/Dashboard.js
const AdministratorDashboard = () => {
    const quickActions = [
        { title: 'Exam Schedule', onClick: () => navigation.navigate('other/exams'), icon: '📝' },
        { title: 'Event Calendar', onClick: () => navigation.navigate('other/events'), icon: '📅' },
        { title: 'Announcements', onClick: () => navigation.navigate('other/announcements'), icon: '📢' },
        { title: 'Payroll', onClick: () => navigation.navigate('staff/payroll'), icon: '💰' },
    ];
    
    const iconStyle = {
        fontSize: '25px',
        marginBottom: '10px',
        display: 'block'
    };

    return {
        type: 'div',
        props: {
            style: { padding: '1rem' },
            children: [
                // Top Section with Stats and Chart side by side
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '1rem',
                            marginBottom: '2rem'
                        },
                        children: [
                            // Left side - Stats in 2x2 grid
                            {
                                type: AdministratorStats,
                                props: { layout: '2x2' }  // Pass a prop to indicate the 2x2 layout
                            },
                            // Right side - Chart
                            {
                                type: StudentStatistics,
                                props: {}
                            }
                        ]
                    }
                },

                // Quick Actions Section
                {
                    type: 'div',
                    props: {
                        style: { marginTop: '2rem' },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Quick Actions']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(4, 1fr)', 
                                        gap: '1rem',
                                        marginTop: '1rem'
                                    },
                                    children: quickActions.map(action => ({
                                        type: Card,
                                        props: {
                                            variant: 'default',
                                            style: {
                                                height: '100px',
                                                backgroundColor: '#f0f7ff',
                                                transition: 'all 0.2s ease',

                                            },
                                            onClick: action.onClick,
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: { textAlign: 'center' },
                                                        children: [
                                                            
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: iconStyle,
                                                                    children: [action.icon]
                                                                }
                                                            },
                                                            {
                                                                type: 'h3',
                                                                props: {
                                                                    children: [action.title]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.AdministratorDashboard = AdministratorDashboard;