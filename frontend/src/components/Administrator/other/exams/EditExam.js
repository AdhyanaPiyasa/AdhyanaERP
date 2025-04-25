// components/Admin/exams/EditExam.js
const EditExam = ({ exam, onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        course: exam.course,
        courseCode: exam.courseCode,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        room: exam.room,
        teacher: exam.teacher
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        onClose();
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Edit Exam',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
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
                                    onChange: (e) => setFormData({...formData, date: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Start time',
                                    value: formData.startTime,
                                    onChange: (e) => setFormData({...formData, startTime: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'End time',
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
                                props:  {
                                    style: {
                                        display: 'flex',
                                        gap: theme.spacing.sm
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
                                                children: 'Save changes'
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

window.EditExam = EditExam;