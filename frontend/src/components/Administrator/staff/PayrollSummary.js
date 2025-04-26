// components/Administrator/staff/PayrollSummary.js
const PayrollSummary = ({ payrollData, staffList }) => {
    // Calculate summary metrics
    const calculateMetrics = () => {
        // Default values
        const metrics = {
            totalProcessed: 0,
            totalPending: 0,
            totalPaid: 0,
            totalAmount: 0,
            pendingAmount: 0,
            paidAmount: 0
        };
        
        // Skip if no data
        if (!payrollData || payrollData.length === 0) {
            return metrics;
        }
        
        // Calculate metrics from payroll data
        return payrollData.reduce((acc, payroll) => {
            // Count by status
            acc.totalProcessed++;
            
            if (payroll.paymentStatus === 'PENDING') {
                acc.totalPending++;
                acc.pendingAmount += parseFloat(payroll.netSalary) || 0;
            } else if (payroll.paymentStatus === 'PAID') {
                acc.totalPaid++;
                acc.paidAmount += parseFloat(payroll.netSalary) || 0;
            }
            
            // Total amount
            acc.totalAmount += parseFloat(payroll.netSalary) || 0;
            
            return acc;
        }, metrics);
    };
    
    // Format currency for display
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };
    
    // Get current month and year
    const getCurrentMonthYear = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long'
        });
    };
    
    // Calculate metrics from payroll data
    const metrics = calculateMetrics();
    
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
                        children: ['Payroll Summary']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: theme.spacing.lg,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            // Total Processed
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: theme.borderRadius.md,
                                        textAlign: 'center'
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: { 
                                                    fontSize: theme.typography.h1.fontSize,
                                                    fontWeight: 'bold',
                                                    color: theme.colors.primary
                                                },
                                                children: [metrics.totalProcessed]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: ['Total Payrolls']
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Pending Payrolls
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#fff8e1',
                                        borderRadius: theme.borderRadius.md,
                                        textAlign: 'center'
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: { 
                                                    fontSize: theme.typography.h1.fontSize,
                                                    fontWeight: 'bold',
                                                    color: theme.colors.warning
                                                },
                                                children: [metrics.totalPending]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: ['Pending Payrolls']
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Paid Payrolls
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.md,
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: theme.borderRadius.md,
                                        textAlign: 'center'
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: { 
                                                    fontSize: theme.typography.h1.fontSize,
                                                    fontWeight: 'bold',
                                                    color: theme.colors.success
                                                },
                                                children: [metrics.totalPaid]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: ['Paid Payrolls']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Financial Summary
                {
                    type: 'div',
                    props: {
                        style: {
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.md,
                            padding: theme.spacing.md,
                            marginBottom: theme.spacing.md
                        },
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: { 
                                        marginBottom: theme.spacing.md,
                                        fontSize: theme.typography.h3.fontSize,
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm
                                    },
                                    children: ['Financial Summary']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        // Total Amount
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Total Salary Amount:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { 
                                                                fontSize: '18px',
                                                                color: theme.colors.textPrimary
                                                            },
                                                            children: [formatCurrency(metrics.totalAmount)]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Pending Amount
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Pending Payments:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { 
                                                                fontSize: '18px',
                                                                color: theme.colors.warning
                                                            },
                                                            children: [formatCurrency(metrics.pendingAmount)]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Paid Amount
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Paid Amount:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { 
                                                                fontSize: '18px',
                                                                color: theme.colors.success
                                                            },
                                                            children: [formatCurrency(metrics.paidAmount)]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Current Month
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Current Month:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontSize: '18px' },
                                                            children: [getCurrentMonthYear()]
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
                
                // Staff Count Summary (if staff list is available)
                staffList && staffList.length > 0 && {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.md,border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.md
                        },
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: { 
                                        marginBottom: theme.spacing.md,
                                        fontSize: theme.typography.h3.fontSize,
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm
                                    },
                                    children: ['Staff Summary']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Total Staff: ${staffList.length}`]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [
                                                    `Active Staff: ${staffList.filter(staff => staff.status === 'ACTIVE').length}`
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

window.PayrollSummary = PayrollSummary;