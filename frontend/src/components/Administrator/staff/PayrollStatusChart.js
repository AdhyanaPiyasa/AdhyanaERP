// components/Administrator/staff/PayrollStatusChart.js
const PayrollStatusChart = ({ payrollData }) => {
    // Process data for charts
    const processChartData = () => {
        // Default data with zero counts
        const statusData = [
            { name: 'PENDING', value: 0, color: '#FFC107' },
            { name: 'PAID', value: 0, color: '#4CAF50' }
        ];
        
        // Skip if no data
        if (!payrollData || payrollData.length === 0) {
            return statusData;
        }
        
        // Count payroll by status
        const statusCounts = payrollData.reduce((counts, payroll) => {
            const status = payroll.paymentStatus || 'UNKNOWN';
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        }, {});
        
        // Update status data with actual counts
        return statusData.map(item => ({
            ...item,
            value: statusCounts[item.name] || 0
        }));
    };
    
    // Get month-wise payroll data (for last 6 months)
    const getMonthlyData = () => {
        // Skip if no data
        if (!payrollData || payrollData.length === 0) {
            return [];
        }
        
        // Get current date and calculate date 6 months ago
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // 6 months including current
        
        // Create empty data structure for each month
        const monthlyData = [];
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Generate last 6 months
        for (let i = 0; i < 6; i++) {
            const month = (currentMonth - i + 12) % 12; // Handle negative months
            const year = currentYear - Math.floor((i - currentMonth) / 12);
            const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'short' });
            
            monthlyData.push({
                name: `${monthName} ${year}`,
                pending: 0,
                paid: 0,
                month: month,
                year: year
            });
        }
        
        // Fill in data from payroll records
        payrollData.forEach(payroll => {
            if (!payroll.salaryMonth) return;
            
            const payrollDate = new Date(payroll.salaryMonth);
            const payrollMonth = payrollDate.getMonth();
            const payrollYear = payrollDate.getFullYear();
            
            // Check if this payroll is within the last 6 months
            const monthIndex = monthlyData.findIndex(
                item => item.month === payrollMonth && item.year === payrollYear
            );
            
            if (monthIndex !== -1) {
                // Increment count based on status
                if (payroll.paymentStatus === 'PENDING') {
                    monthlyData[monthIndex].pending += 1;
                } else if (payroll.paymentStatus === 'PAID') {
                    monthlyData[monthIndex].paid += 1;
                }
            }
        });
        
        // Reverse array to show months in chronological order
        return monthlyData.reverse();
    };
    
    // Status data for pie chart
    const statusData = processChartData();
    
    // Monthly data for bar chart
    const monthlyData = getMonthlyData();
    
    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        style: { 
                            marginBottom: theme.spacing.md,
                            fontSize: theme.typography.h2.fontSize,
                            fontWeight: theme.typography.h2.fontWeight
                        },
                        children: ['Payroll Analytics']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: theme.spacing.lg,
                            height: '300px'
                        },
                        children: [
                            // Payroll Status Pie Chart
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        padding: theme.spacing.md,
                                        height: '100%'
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { 
                                                    marginBottom: theme.spacing.sm,
                                                    fontSize: theme.typography.h3.fontSize,
                                                    textAlign: 'center'
                                                },
                                                children: ['Payroll Status']
                                            }
                                        },
                                        statusData.every(item => item.value === 0) ? 
                                        {
                                            // Display message when no data
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '80%',
                                                    color: theme.colors.textSecondary
                                                },
                                                children: ['No payroll data available']
                                            }
                                        } :
                                        {
                                            // Display pie chart with data
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '80%'
                                                },
                                                children: [
                                                    // Custom pie chart visualization
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: { 
                                                                width: '150px',
                                                                height: '150px',
                                                                position: 'relative',
                                                                borderRadius: '50%',
                                                                background: `conic-gradient(
                                                                    ${statusData[0].color} 0% ${statusData[0].value/(statusData[0].value + statusData[1].value)*100}%, 
                                                                    ${statusData[1].color} ${statusData[0].value/(statusData[0].value + statusData[1].value)*100}% 100%
                                                                )`
                                                            }
                                                        }
                                                    },
                                                    // Legend
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: { 
                                                                display: 'flex',
                                                                gap: theme.spacing.md,
                                                                marginTop: theme.spacing.md
                                                            },
                                                            children: statusData.map(item => ({
                                                                type: 'div',
                                                                props: {
                                                                    style: { 
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: theme.spacing.xs
                                                                    },
                                                                    children: [
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: { 
                                                                                    width: '12px',
                                                                                    height: '12px',
                                                                                    backgroundColor: item.color,
                                                                                    borderRadius: '2px'
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            type: 'span',
                                                                            props: {
                                                                                children: [`${item.name} (${item.value})`]
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
                            },
                            
                            // Monthly Payroll Trend
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        padding: theme.spacing.md,
                                        height: '100%'
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { 
                                                    marginBottom: theme.spacing.sm,
                                                    fontSize: theme.typography.h3.fontSize,
                                                    textAlign: 'center'
                                                },
                                                children: ['Monthly Payroll Trend']
                                            }
                                        },
                                        monthlyData.length === 0 || 
                                        monthlyData.every(month => month.pending === 0 && month.paid === 0) ?
                                        {
                                            // Display message when no data
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '80%',
                                                    color: theme.colors.textSecondary
                                                },
                                                children: ['No monthly trend data available']
                                            }
                                        } :
                                        {
                                            // Custom bar chart visualization
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: '80%'
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: { 
                                                                display: 'flex',
                                                                height: '80%',
                                                                alignItems: 'flex-end',
                                                                gap: '10px',
                                                                padding: '10px 0'
                                                            },
                                                            children: monthlyData.map(month => ({
                                                                type: 'div',
                                                                props: {
                                                                    style: { 
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        gap: '2px'
                                                                    },
                                                                    children: [
                                                                        // Paid bar
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: { 
                                                                                    width: '80%',
                                                                                    height: `${Math.min(month.paid * 20, 100)}%`,
                                                                                    backgroundColor: '#4CAF50',
                                                                                    transition: 'height 0.3s'
                                                                                }
                                                                            }
                                                                        },
                                                                        // Pending bar
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: { 
                                                                                    width: '80%',
                                                                                    height: `${Math.min(month.pending * 20, 100)}%`,
                                                                                    backgroundColor: '#FFC107',
                                                                                    transition: 'height 0.3s'
                                                                                }
                                                                            }
                                                                        },
                                                                        // Month label
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: { 
                                                                                    fontSize: '10px',
                                                                                    marginTop: '4px',
                                                                                    transform: 'rotate(-45deg)',
                                                                                    transformOrigin: 'top left',
                                                                                    whiteSpace: 'nowrap'
                                                                                },
                                                                                children: [month.name]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }))
                                                        }
                                                    },
                                                    // Legend
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: { 
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                gap: theme.spacing.md,
                                                                marginTop: theme.spacing.md
                                                            },
                                                            children: [
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { 
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: theme.spacing.xs
                                                                        },
                                                                        children: [
                                                                            {
                                                                                type: 'div',
                                                                                props: {
                                                                                    style: { 
                                                                                        width: '12px',
                                                                                        height: '12px',
                                                                                        backgroundColor: '#4CAF50',
                                                                                        borderRadius: '2px'
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    children: ['Paid']
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
                                                                            alignItems: 'center',
                                                                            gap: theme.spacing.xs
                                                                        },
                                                                        children: [
                                                                            {
                                                                                type: 'div',
                                                                                props: {
                                                                                    style: { 
                                                                                        width: '12px',
                                                                                        height: '12px',
                                                                                        backgroundColor: '#FFC107',
                                                                                        borderRadius: '2px'
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    children: ['Pending']
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
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.PayrollStatusChart = PayrollStatusChart;