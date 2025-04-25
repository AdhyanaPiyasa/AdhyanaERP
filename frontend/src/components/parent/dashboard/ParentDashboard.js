// components/parent/dashboard/Dashboard.js
const ParentDashboard = () => {
    const stats = [
        { title: "New Announcements", value: "1" },
        { title: "Report Cards", value: "2" },
        { title: "Upcoming exams", value: "0" },
        { title: "Hostel Stay", value: "10 Months" }
    ];

    return {
        type: 'div',
        props: {
            className: 'space-y-6 p-6',
            children: [
                // Stats Overview
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
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: theme.spacing.lg
                                    },
                                    children: stats.map(stat => ({
                                        type: Card,
                                        props: {
                                            variant: 'elevated',
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            marginBottom: theme.spacing.sm
                                                        },
                                                        children: [
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: {
                                                                        color: theme.colors.textSecondary
                                                                    },
                                                                    children: [stat.title]
                                                                }
                                                            },
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    style: {
                                                                        fontSize: theme.typography.h2.fontSize,
                                                                        fontWeight: 'bold',
                                                                        marginTop: theme.spacing.xs
                                                                    },
                                                                    children: [stat.value]
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
                },

                // Main Content Grid
                {
                    type: 'div',
                    props: {
                        className: 'grid grid-cols-2 gap-6',
                        children: [
                            {
                                type: ChildrenOverview,
                                props: {}
                            },
                            {
                                type: AttendanceOverview,
                                props: {}
                            }
                            
                        ]
                    }
                }
            ]
        }
    };
};

window.ParentDashboard = ParentDashboard;