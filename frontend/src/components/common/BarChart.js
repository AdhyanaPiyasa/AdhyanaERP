const BarChart = ({ data, width = 500, height = 400, title = "" }) => {
    if (!data || data.length === 0) {
        return {
            type: 'div',
            props: {
                style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed #ccc',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #fafafa, #f0f0f0)',
                    color: '#aaa',
                    fontStyle: 'italic',
                    fontSize: '15px'
                },
                children: ['No data available']
            }
        };
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const colors = [
        '#FF6B6B', '#4ECDC4', '#F7B801', '#1A535C',
        '#FF9F1C', '#6A0572', '#9C27B0', '#5CDB95',
        '#05386B', '#EDF5E1', '#F67280', '#C06C84',
        '#8E44AD', '#2C3E50', '#3498DB'
    ];

    return {
        type: 'div',
        props: {
            style: {
                width: `${width}px`,
                height: `${height}px`,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                background: 'linear-gradient(145deg, #ffffff, #f2f2f2)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
            },
            children: [
                title && {
                    type: 'div',
                    props: {
                        style: {
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '16px',
                            color: '#2c3e50',
                            textTransform: 'capitalize',
                            textAlign: 'center'
                        },
                        children: [title]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            padding: '0 20px',
                            overflowY: 'auto'
                        },
                        children: data.map((item, index) => {
                            const barWidth = (item.value / maxValue) * 100;
                            const percentage = ((item.value / total) * 100).toFixed(1);

                            return {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px'
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    { type: 'span', props: { children: [item.label] } },
                                                    { type: 'span', props: { children: [`${item.value} (${percentage}%)`] } }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    height: '14px',
                                                    width: `${barWidth}%`,
                                                    backgroundColor: colors[index % colors.length],
                                                    borderRadius: '6px',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                    transition: 'width 0.3s ease-in-out'
                                                }
                                            }
                                        }
                                    ]
                                }
                            };
                        })
                    }
                }
            ].filter(Boolean)
        }
    };
};
    
window.BarChart = BarChart;
