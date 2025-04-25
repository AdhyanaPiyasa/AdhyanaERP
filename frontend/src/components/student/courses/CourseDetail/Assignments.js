// components/courses/CourseDetail/Assignments.js
const Assignments = ({ courseId }) => {
    const [showModal, setShowModal] = MiniReact.useState(false);
    const [selectedAssignment, setSelectedAssignment] = MiniReact.useState(null);

    const assignments = [
        {
            id: 1,
            title: "Assignment 01",
            dueDate: "03-09-2024",
            status: "Pending"
        },
        {
            id: 2,
            title: "Assignment 02",
            dueDate: "03-09-2024",
            status: "Submitted"
        }
    ];

    const handleAssignmentClick = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: Table,
                    props: {
                        headers: ['Title', 'Due Date', 'Status'],
                        data: assignments,
                        onRowClick: handleAssignmentClick
                    }
                },
                showModal && {
                    type: Modal,
                    props: {
                        isOpen: showModal,
                        onClose: () => setShowModal(false),
                        title: 'Assignment Details',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'outlined',
                                    children: [
                                        `Title: ${selectedAssignment?.title}`,
                                        `Due Date: ${selectedAssignment?.dueDate}`,
                                        `Status: ${selectedAssignment?.status}`
                                    ]
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.Assignments = Assignments;