// components/teacher/dashboard/RecentAssignments.js
const RecentAssignments = () => {
    const assignments = [
        {
            title: "Assignment 1",
            dueDate: "Due 10/15",
            batch: "Batch",
            subject: "Subject",
            timeLeft: "1 day"
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Upcoming']
                    }
                },
                ...assignments.map(assignment => ({
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    children: [assignment.title]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        `${assignment.dueDate} • ${assignment.batch} • ${assignment.subject} • ${assignment.timeLeft}`
                                    ]
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    };
};
window.RecentAssignments = RecentAssignments;