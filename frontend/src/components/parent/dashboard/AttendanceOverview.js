// components/parent/dashboard/AttendanceOverview.js
const AttendanceOverview = () => {
    const attendanceData = [
        {
            name: 'Jane Doe',
            totalDays: 120,
            present: 114,
            absent: 6,
            percentage: '95%',
            lastAttendance: '2024-03-28'
        },
        {
            name: 'Jack Doe',
            totalDays: 120,
            present: 110,
            absent: 10,
            percentage: '92%',
            lastAttendance: '2024-03-28'
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'div',
                    props: {
                        className: 'flex justify-between items-center mb-4',
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    className: 'text-xl font-bold',
                                    children: ['Attendance Overview']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    onClick: () => navigation.navigate('/attendance/details'),
                                    children: 'View Details'
                                }
                            }
                        ]
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Name', 'Total Days', 'Present', 'Absent', 'Percentage', 'Last Attendance'],
                        data: attendanceData.map(record => ({
                            name: record.name,
                            totalDays: record.totalDays,
                            present: record.present,
                            absent: record.absent,
                            percentage: record.percentage,
                            lastAttendance: new Date(record.lastAttendance).toLocaleDateString()
                        }))
                    }
                }
            ]
        }
    };
};

window.AttendanceOverview = AttendanceOverview;