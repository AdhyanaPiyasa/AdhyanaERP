// components/Admin/exams/CreateExam.js
const CreateExam = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        course: '',
        courseCode: '',
        date: '',
        startTime: '',
        endTime: '',
        room: '',
        teacher: ''
    });

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted:', formData);
        onClose();
    };


    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Create Exam',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Title',
                                    placeholder: 'Midterm exam',
                                    value: formData.title,
                                    onChange: (e) => setFormData({...formData, title: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Course',
                                    value: formData.course,
                                    onChange: (e) => setFormData({...formData, course: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Course Code',
                                    value: formData.courseCode,
                                    onChange: (e) => setFormData({...formData, courseCode: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Date',
                                    value: formData.date,
                                    type: 'date',
                                    onChange: (e) => setFormData({...formData, date: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Start time',
                                    placeholder: '00:00 AM/PM',
                                    value: formData.startTime,
                                    onChange: (e) => setFormData({...formData, startTime: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'End time',
                                    placeholder: '00:00 AM/PM',
                                    value: formData.endTime,
                                    onChange: (e) => setFormData({...formData, endTime: e.target.value})
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Room',
                                    value: formData.room,
                                    onChange: (e) => setFormData({...formData, room: e.target.value}),
                                    options: [
                                        { value: '', label: 'Select room' },
                                        { value: 'room1', label: 'Room 1' },
                                        { value: 'room2', label: 'Room 2' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Teacher',
                                    value: formData.teacher,
                                    onChange: (e) => setFormData({...formData, teacher: e.target.value})
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.xl
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: onClose,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                children: 'Create Exam'
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

window.CreateExam = CreateExam;