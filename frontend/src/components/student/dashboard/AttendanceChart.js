// components/student/dashboard/AttendanceChart.js
const AttendanceChart = () => {
    // Mock data for student's course attendance
    // In a real implementation, this would come from an API call
    const [attendanceData, setAttendanceData] = MiniReact.useState([
        { label: "Data Structures and Algorithms", value: 85 },
        { label: "Database Systems", value: 92 },
        { label: "Web Development", value: 78 },
        { label: "Software Engineering", value: 88 },
        { label: "Computer Networks", value: 80 }
    ]);

    // Function to determine color based on attendance percentage
    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return theme.colors.success; // Green for excellent attendance
        if (percentage >= 75) return theme.colors.primary; // Blue for good attendance
        if (percentage >= 60) return theme.colors.warning; // Orange for borderline attendance
        return theme.colors.error; // Red for poor attendance
    };

    // Add color information to each data point
    const colorizedData = attendanceData.map(course => ({
        ...course,
        color: getAttendanceColor(course.value)
    }));

    return {
        type: Card,
        props: {
            variant: 'elevated',
            style: { 
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.xl
            },
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md
                        },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing.sm,
                                        fontSize: theme.typography.h2.fontSize,
                                        fontWeight: 'bold'
                                    },
                                    children: [
                                        '📊 Attendance Overview'
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing.sm
                                    },
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                style: {
                                                    fontSize: theme.typography.caption.fontSize,
                                                    color: theme.colors.textSecondary
                                                },
                                                children: ['Updated: Today']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'text',
                                                size: 'small',
                                                onClick: () => navigation.navigate('other/attendance'),
                                                children: ['View Details']
                                            }
                                        }
                                    ]
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: theme.spacing.md
                        },
                        children: [
                            {
                                type: BarChart,
                                props: {
                                    data: colorizedData,
                                    width: 750,
                                    height: 300,
                                    title: ""  // We already have a title in the card header
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
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: `1px solid ${theme.colors.border}`,
                            paddingTop: theme.spacing.md,
                            marginTop: theme.spacing.sm
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        gap: theme.spacing.md
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
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: theme.colors.success,
                                                                borderRadius: '2px'
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                fontSize: theme.typography.caption.fontSize
                                                            },
                                                            children: ['≥ 90% (Excellent)']
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
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: theme.colors.primary,
                                                                borderRadius: '2px'
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                fontSize: theme.typography.caption.fontSize
                                                            },
                                                            children: ['75-89% (Good)']
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
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: theme.colors.warning,
                                                                borderRadius: '2px'
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                fontSize: theme.typography.caption.fontSize
                                                            },
                                                            children: ['60-74% (Warning)']
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
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: theme.colors.error,
                                                                borderRadius: '2px'
                                                            }
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                fontSize: theme.typography.caption.fontSize
                                                            },
                                                            children: ['< 60% (Critical)']
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: theme.typography.caption.fontSize,
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['* Minimum required attendance: 75%']
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

// Add to global window object
window.AttendanceChart = AttendanceChart;