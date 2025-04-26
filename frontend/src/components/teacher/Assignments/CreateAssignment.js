// components/Administrator/other/exams/Assignments/CreateAssignment.js
const CreateAssignment = ({ onClose,onSuccess }) => {
    const refreshPage = () => {
        window.location.reload(false);
    };
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        course: '',
        courseCode: '',
        type: '',
        date: '',
        startTime: '',
        endTime: '',
        room: '',
        teacher: ''
    });
    const resetForm = () => {
        setFormData({
            title: '',
            course: '',
            courseCode: '',
            type: '',
            date: '',
            startTime: '',
            endTime: '',
            room: '',
            teacher: ''
        });
    };
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    

    const assignmentTypes = [
        { value: 'individual', label: 'Individual Assignment' },
        { value: 'group', label: 'Group Project' },
        { value: 'takehome', label: 'Take Home' },
        { value: 'inclass', label: 'In-Class Assignment' },
        { value: 'presentation', label: 'Presentation' }
    ];

    const handleSubmit = async() => {
        if(!formData.title || !formData.course || !formData.courseCode || !formData.type || !formData.date || 
            !formData.startTime || !formData.endTime || !formData.room || !formData.teacher) {
                setError('Please fill in all fields.');
                return;
        }
        setLoading(true);
        setError(null);
        try {
            const SubmissionData = {
                title: formData.title,
                course: formData.course,
                courseCode: formData.courseCode,
                type: formData.type,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                room: formData.room,
                teacher: formData.teacher

            };
            console.log('Assignment data:', SubmissionData);

            const tokken = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/exams/assignments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokken}`
                },
                body: JSON.stringify(SubmissionData)
            });
            if (!response.ok) {
                throw new Error('Failed to create assignment. Please try again.');
            }
            const data = await response.json();
            if (data.success) {
                if (onSuccess) {
                    onSuccess(data.data); // Pass the created
        }else {
            onClose();
        }
        setTimeout(refreshPage, 300);
        } else {
            setError(data.message||'Failed to create assignment. Please try again.');
           }
         } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Create New Assignment',
            children: [
                {
                    type: 'form',
                    props: {
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: theme.spacing.md,
                            maxHeight: '60vh',
                            overflowY: 'auto'
                        },
                        children: [
                            // Title field (spans two columns)
                            {
                                type: 'div',
                                props: {
                                    style: { gridColumn: '1 / span 2' },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Assignment Title',
                                                name: 'title',
                                                placeholder: 'Enter assignment title',
                                                value: formData.title,
                                                onChange: handleChange
                                            }
                                        }
                                    ]
                                }
                            },
                            // Course field
                            {
                                type: TextField,
                                props: {
                                    label: 'Course',
                                    name: 'course',
                                    placeholder: 'Course name',
                                    value: formData.course,
                                    onChange: handleChange
                                }
                            },
                            // Course code field
                            {
                                type: TextField,
                                props: {
                                    label: 'Course Code',
                                    name: 'courseCode',
                                    placeholder: 'Course code',
                                    value: formData.courseCode,
                                    onChange: handleChange
                                }
                            },
                            // Assignment type field
                            {
                                type: Select,
                                props: {
                                    label: 'Assignment Type',
                                    name: 'type',
                                    value: formData.type,
                                    onChange: handleChange,
                                    options: [
                                        { value: '', label: 'Select assignment type' },
                                        ...assignmentTypes
                                    ]
                                }
                            },
                            // Date field
                            {
                                type: TextField,
                                props: {
                                    label: 'Due Date',
                                    name: 'date',
                                    type: 'date',
                                    value: formData.date,
                                    onChange: handleChange
                                }
                            },
                            // Start time field
                            {
                                type: TextField,
                                props: {
                                    label: 'Start Time',
                                    name: 'startTime',
                                    placeholder: 'e.g., 09:00 AM',
                                    value: formData.startTime,
                                    onChange: handleChange
                                }
                            },
                            // End time field
                            {
                                type: TextField,
                                props: {
                                    label: 'End Time',
                                    name: 'endTime',
                                    placeholder: 'e.g., 11:00 AM',
                                    value: formData.endTime,
                                    onChange: handleChange
                                }
                            },
                            // Room field
                            {
                                type: TextField,
                                props: {
                                    label: 'Room/Location',
                                    name: 'room',
                                    placeholder: 'Room or location',
                                    value: formData.room,
                                    onChange: handleChange
                                }
                            },
                            // Teacher field
                            {
                                type: TextField,
                                props: {
                                    label: 'Teacher',
                                    name: 'teacher',
                                    placeholder: 'Teacher name',
                                    value: formData.teacher,
                                    onChange: handleChange
                                }
                            },
                            // Description field (spans two columns)
                            {
                                type: 'div',
                                props: {
                                    style: { gridColumn: '1 / span 2' },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Assignment Description',
                                                name: 'description',
                                                placeholder: 'Enter detailed instructions for the assignment...',
                                                multiline: true,
                                                style: { height: '100px' }
                                            }
                                        }
                                    ]
                                }
                            },
                            // Button section (spans two columns)
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        gridColumn: '1 / span 2',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
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
                                                children: 'Create Assignment'
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

window.CreateAssignment = CreateAssignment;