// components/Admin/exams/RoomAssignments.js
const RoomAssignments = () => {
    const [searchTerm, setSearchTerm] = MiniReact.useState('');

    const assignments = [
        {
            room: 'Room 1',
            date: '2024-09-30',
            timeSlot: '8.00am -10.00am',
            exam: 'Exam 1'
        },
        {
            room: 'Room 2',
            date: '-',
            timeSlot: '-',
            exam: '-'
        },
        {
            room: 'Room 3',
            date: '2024-09-29',
            timeSlot: '8.00am -10.00am',
            exam: 'Exam 2'
        }
    ];

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Check room Assignmnets']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['Manage exam room assignmnets and other information']
                                            }
                                        }
                                    ]
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
                                type: Table,
                                props: {
                                    headers: ['Room', 'Date', 'Time Slot', 'Exam'],
                                    data: assignments.filter(assignment => 
                                        assignment.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        assignment.exam.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.RoomAssignments = RoomAssignments;