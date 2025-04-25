const FinalTimetable = () => {
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedExam, setSelectedExam] = MiniReact.useState(null);

    const examSchedule = [
        {
            course: 'Course1',
            code: '2210',
            date: 'May 11',
            startTime: '8:00 AM',
            endTime: '9:45 AM',
            room: 'Auditorium',
            teacher: 'Dr. Jane Smith'
        }
    ];

    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setShowEditModal(true);
    };

    const handleDelete = (exam) => {
        setSelectedExam(exam);
        setShowDeleteModal(true);
    };

    const handleGeneratePDF = () => {
        console.log('Generating PDF for exam schedule');
    };

    return {
        type: 'div',
        props: {
            children: [
                // Header Section
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
                                                children: ['Final Exam Timetable']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Exam Schedule Section
                {
                    type: Card,
                    props: {
                        children: [
                            // Header with Generate PDF Button
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
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Exam Schedule']
                                                        }
                                                    }
                                                   
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Exam Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Course', 'Code', 'Date', 'Start Time', 'End Time', 'Room', 'Teacher', 'Actions'],
                                    data: examSchedule.map(exam => ({
                                        'Course': exam.course,
                                        'Code': {
                                            type: 'span',
                                            props: {
                                                style: { fontWeight: '500' },
                                                children: [exam.code]
                                            }
                                        },
                                        'Date': exam.date,
                                        'Start Time': exam.startTime,
                                        'End Time': exam.endTime,
                                        'Room': exam.room,
                                        'Teacher': exam.teacher,
                                        'Actions': {
                                            type: Card,
                                            props: {
                                                variant: 'ghost',
                                                noPadding: true,
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                display: 'flex',
                                                                gap: theme.spacing.sm
                                                            },
                                                            children: [
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleEdit(exam),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Edit'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleDelete(exam),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Delete'
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // Modals
                showEditModal && {
                    type: EditExam,
                    props: {
                        exam: selectedExam,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: examsDeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: () => {
                            console.log('Deleting exam:', selectedExam);
                            setShowDeleteModal(false);
                        }
                    }
                }
            ]
        }
    };
};

window.FinalTimetable = FinalTimetable;