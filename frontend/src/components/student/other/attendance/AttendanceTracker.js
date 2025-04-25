// components/other/attendance/AttendanceTracker.js
const AttendanceTracker = () => {
    const attendance = {
        totalSessions: 45,
        attendedSessions: 38,
        percentage: 84.4,
        recentSessions: [
            {
                date: '2024-01-21',
                subject: 'Data Structures',
                status: 'present',
                time: '09:00 AM'
            },
            {
                date: '2024-01-20',
                subject: 'Algorithm Design',
                status: 'absent',
                time: '11:00 AM'
            },
            {
                date: '2024-01-19',
                subject: 'Database Systems',
                status: 'present',
                time: '02:00 PM'
            }
        ]
    };

    const renderStatCard = (value, label) => ({
        type: Card,
        props: {
            variant: 'outlined',
            children: [
                {
                    type: 'div',
                    props: {
                        children: [value]
                    }
                },
                {
                    type: 'div',
                    props: {
                        children: [label]
                    }
                }
            ]
        }
    });

    const renderSummaryCards = () => [
        renderStatCard(`${attendance.percentage}%`, 'Attendance Rate'),
        renderStatCard(attendance.attendedSessions, 'Sessions Attended'),
        renderStatCard(attendance.totalSessions, 'Total Sessions')
    ];

    const sessionData = attendance.recentSessions.map(session => ({
        Subject: session.subject,
        DateTime: `${session.date} ${session.time}`,
        Status: session.status.toUpperCase()
    }));

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h1',
                    props: {
                        children: ['Attendance Tracker']
                    }
                },
                {
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: renderSummaryCards()
                    }
                },
                {
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Recent Sessions']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Subject', 'DateTime', 'Status'],
                                    data: sessionData
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.AttendanceTracker = AttendanceTracker;