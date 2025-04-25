// components/Admin/courses/AddCourse.js
const AddCourse = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        courseCode: '',
        courseName: '',
        semester: '',
        credits: '',
        teacher: '',
        duration: ''
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
            title: 'Add New Course',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Course code',
                                    value: formData.courseCode,
                                    onChange: (e) => setFormData({...formData, courseCode: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Course Name',
                                    value: formData.courseName,
                                    onChange: (e) => setFormData({...formData, courseName: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Semester',
                                    value: formData.semester,
                                    onChange: (e) => setFormData({...formData, semester: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Credits',
                                    value: formData.credits,
                                    onChange: (e) => setFormData({...formData, credits: e.target.value}),
                                    type: 'number'
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
                                type: TextField,
                                props: {
                                    label: 'Duration',
                                    value: formData.duration,
                                    onChange: (e) => setFormData({...formData, duration: e.target.value}),
                                    type: 'number'
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
                                                children: 'Create Course'
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

window.AddCourse = AddCourse;