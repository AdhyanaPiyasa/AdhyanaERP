// components/Administrator/other/exams/Assignments/EditAssignment.js
const EditAssignment = ({ assignment, onClose }) => {

    const refreshPage= () => {
        window.location.reload();
    };

    const [formData, setFormData] = MiniReact.useState({
        title: assignment?.title ||'',
        course: assignment?.course ||'',
        courseCode: assignment?.courseCode ||'',
        type: assignment?.type ||'',
        date: assignment?.date ||'',
        startTime: assignment?.startTime ||'',
        endTime: assignment?.endTime ||'',
        room: assignment?.room ||'',
        teacher: assignment?.teacher ||''
    });
    

    const resetForm = () => {
        setFormData({
            title: assignment?.title ||'',
            course: assignment?.course ||'',
            courseCode: assignment?.courseCode ||'',
            type: assignment?.type ||'',
            date: assignment?.date ||'',
            startTime: assignment?.startTime ||'',
            endTime: assignment?.endTime ||'',
            room: assignment?.room ||'',
            teacher: assignment?.teacher ||''
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

    const handleSubmit = async () => {
        console.log('Updating assignment:', assignment.id, formData);
        setLoading(true);
        setError('');
    
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:8081/api/api/exams/assignment/${assignment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {

           if (onSuccess) {
            onSuccess(data.message);
            }else{
            onClose();
           }
    
        setTimeout(refreshPage,300);
    }else{
        setError(data.message || 'Error updating assignment');
        }
    }catch (error) {
        console.error(error.message||'Error updating assignment');
        console.error('Error updating assignment:', error);
    }

    finally{
        setLoading(false);
    }
    };
        // Here you would make an API call to your backend
        // For example: assignmentService.updateAssignment(assignment.id, formData)
        
    

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
            title: 'Edit Assignment',
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
                                                children: 'Save Changes'
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

window.EditAssignment = EditAssignment;