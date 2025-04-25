// components/Administrator/students/EnrollStudents.js
const EnrollStudents = ({ onClose, selectedApplicants = [] }) => {
    const [formData, setFormData] = MiniReact.useState({
        degreeProgram: '',
        batch: '',
        courses: [],
        duration: 3
    });
    
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = MiniReact.useState(false);

    // Mock data for degree programs and courses
    const degreePrograms = [
        { id: 'CS', name: 'Computer Science' },
        { id: 'IS', name: 'Information Systems' },
        { id: 'SE', name: 'Software Engineering' }
    ];

    const availableCourses = [
        { id: 'CS1101', name: 'Introduction to Programming', credits: 3 },
        { id: 'CS1102', name: 'Data Structures and Algorithms', credits: 3 },
        { id: 'CS1103', name: 'Database Systems', credits: 3 },
        { id: 'CS1104', name: 'Computer Architecture', credits: 3 },
        { id: 'IS1101', name: 'Information Systems Fundamentals', credits: 3 },
        { id: 'IS1102', name: 'Business Process Modeling', credits: 3 },
        { id: 'SE1101', name: 'Software Engineering Principles', credits: 3 },
        { id: 'SE1102', name: 'Software Design and Architecture', credits: 3 }
    ];

    // Handle form input changes
    const handleChange = (e) => {
        console.log('Change event:', e);
        
        // Check if this is our synthetic event
        if (e.target && e.target.name && typeof e.target.value !== 'undefined') {
            const { name, value } = e.target;
            
            console.log(`Updating formData: ${name} = ${value}`);
            
            // Use the functional form of setState to ensure we're working with the latest state
            setFormData(prevData => {
                const newData = {
                    ...prevData,
                    [name]: value
                };
                console.log('New formData:', newData);
                return newData;
            });
        } else {
            console.log('Ignoring non-synthetic event:', e);
        }
    };

    const handleDegreeChange = (e) => {
        setFormData({
            ...formData,
            degreeProgram: e.target.value
        });
    };

    // Handle course selection
    const handleCourseSelection = (e) => {
        const courseId = e.target.value;
        const isChecked = e.target.checked;
        
        if (isChecked) {
            setFormData({
                ...formData,
                courses: [...formData.courses, courseId]
            });
        } else {
            setFormData({
                ...formData,
                courses: formData.courses.filter(id => id !== courseId)
            });
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        // Here you would typically send the data to your backend
        // You can use FormData to handle the file upload
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        console.log('Form submitted:', formData);
        onClose();
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Enroll Students to New Batch',
            children: [
                showSuccessMessage ? 
                // Success message
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        style: {
                            backgroundColor: theme.colors.success + '20',
                            padding: theme.spacing.lg,
                            textAlign: 'center'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '40px',
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['✅']
                                }
                            },
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        color: theme.colors.success,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Enrollment Successful!']
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    children: [`${selectedApplicants.length} students have been successfully enrolled to ${degreePrograms.find(dp => dp.id === formData.degreeProgram)?.name} - ${batches.find(b => b.id === formData.batch)?.name}`]
                                }
                            }
                        ]
                    }
                } :
                // Enrollment form
                {
                    type: 'form',
                    props: {
                        onSubmit: handleSubmit,
                        children: [
                            // Degree Program Selection
                            {
                                type: 'div',
                                props: {
                                    children: [                                        
                                        {
                                            type: Select,
                                            props: {
                                                name: 'degreeProgram',
                                                label: 'Degree Program *',
                                                value: formData.degreeProgram,
                                                onChange: handleChange,
                                                options: [
                                                    { value: '', label: 'Select Degree Program' },
                                                    ...degreePrograms.map(program => ({
                                                        value: program.id,
                                                        label: program.name
                                                    }))
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },                            
                            // Courses Selection
                            {
                                type: 'div',
                                props: {                                
                                    children: [
                                        {
                                            type: 'label',
                                            props: {
                                                style: {
                                                    marginBottom: theme.spacing.xs,
                                                    fontWeight: 'bold'
                                                },
                                                children: ['Courses *']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: theme.spacing.md,
                                                    border: `1px solid ${theme.colors.border}`,
                                                    padding: theme.spacing.md
                                                },
                                                children: availableCourses.map(course => ({
                                                    type: 'div',
                                                    props: {
                                                        children: [
                                                            {
                                                                type: 'label',
                                                                props: {                                                            
                                                                    children: [
                                                                        {
                                                                            type: 'input',
                                                                            props: {
                                                                                type: 'checkbox',
                                                                                value: course.id,
                                                                                checked: formData.courses.includes(course.id),
                                                                                onChange: handleCourseSelection,
                                                                                style: { marginRight: theme.spacing.sm }
                                                                            }
                                                                        },
                                                                        `${course.name} (${course.credits} credits)`
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }))
                                            }
                                        }
                                    ]
                                }
                            },

                            // Action Buttons
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
                                               // disabled: isSubmitting,
                                                children: ['Cancel']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                // type: 'submit',
                                                // disabled: isSubmitting,
                                                onClick: handleSubmit,
                                                children: ['Enroll Students']
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

window.EnrollStudents = EnrollStudents;