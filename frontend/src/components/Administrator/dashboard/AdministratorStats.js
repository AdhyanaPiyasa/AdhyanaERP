// components/Admin/dashboard/Stats.js
const AdministratorStats = ({ layout = '1x4' }) => {
    const stats = [
        { label: 'Total Students', value: '1,200', icon: '👨‍🎓' }, // Student icon
        { label: 'Upcoming Exams', value: '45', icon: '📝' },      // Exam/Note icon
        { label: 'Upcoming Events', value: '3', icon: '📅' },      // Calendar icon
        { label: 'Hostel Students', value: '400', icon: '🏠' }     // House icon
    ];

    const iconStyle = {
        fontSize: '32px',
        marginBottom: '10px',
        display: 'block'
    };

    // Determine grid layout based on the layout prop
    const gridTemplateColumns = layout === '2x2' 
        ? 'repeat(2, 1fr)'  // 2x2 grid
        : 'repeat(4, 1fr)'; // 1x4 grid (default)

    return {
        type: 'div',
        props: {
            style: { 
                display: 'grid', 
                gridTemplateColumns: gridTemplateColumns, 
                gap: '1rem',
                height: '100%'  // Fill available height
            },
            children: stats.map(stat => ({
                type: Card,
                props: {
                    variant: 'default',
                    style: { 
                        height: '200px',
                        backgroundColor: '#f8f8ff',
                    
                    },
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
                                            children: [stat.icon]
                                        }
                                    },
                                    {
                                        type: 'h2',
                                        props: {
                                            children: [stat.value]
                                        }
                                    },
                                    {
                                        type: 'p',
                                        props: {
                                            children: [stat.label]
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

window.AdministratorStats = AdministratorStats;