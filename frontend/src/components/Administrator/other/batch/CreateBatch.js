// components/Administrator/batches/CreateBatch.js
const CreateBatch = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        year: '',
        program: '',
        courses: []
    });

    // Mock courses that could be added to a batch
    const availableCourses = [
        { id: 'CS101', name: 'Introduction to Computer Science', credits: 3 },
        { id: 'CS102', name: 'Programming Fundamentals', credits: 3 },
        { id: 'CS201', name: 'Data Structures', credits: 4 },
        { id: 'CS202', name: 'Algorithms', credits: 4 },
        { id: 'CS301', name: 'Database Systems', credits: 3 },
        { id: 'CS302', name: 'Web Development', credits: 3 },
        { id: 'CS401', name: 'Artificial Intelligence', credits: 4 },
        { id: 'CS402', name: 'Machine Learning', credits: 4 }
    ];

    // List of available degree programs
    const degreePrograms = [
        { value: 'CS', label: 'Computer Science' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'SE', label: 'Software Engineering' },
        { value: 'IS', label: 'Information Systems' }
    ];

    const [selectedCourses, setSelectedCourses] = MiniReact.useState({});

    const toggleCourseSelection = (courseId) => {
        setSelectedCourses(prevState => ({
            ...prevState,
            [courseId]: !prevState[courseId]
        }));
    };

    const handleSubmit = () => {
        // Process the selected courses into an array of IDs
        const selectedCourseIds = Object.entries(selectedCourses)
            .filter(([_, isSelected]) => isSelected)
            .map(([id, _]) => id);

        const newBatch = {
            ...formData,
            courses: selectedCourseIds
        };

        console.log('New batch data:', newBatch);
        onClose();
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Create New Batch',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Year',
                                    placeholder: 'e.g., 2025',
                                    value: formData.year,
                                    onChange: (e) => setFormData({...formData, year: e.target.value})
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Degree Program',
                                    value: formData.program,
                                    onChange: (e) => setFormData({...formData, program: e.target.value}),
                                    options: [
                                        { value: '', label: 'Select a program' },
                                        ...degreePrograms
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.md },
                                                children: ['Select Courses']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    maxHeight: '300px', 
                                                    overflowY: 'auto',
                                                    border: `1px solid ${theme.colors.border}`,
                                                    borderRadius: theme.borderRadius.md,
                                                    padding: theme.spacing.md
                                                },
                                                children: availableCourses.map(course => ({
                                                    type: 'div',
                                                    props: {
                                                        style: { 
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: theme.spacing.sm,
                                                            marginBottom: theme.spacing.sm,
                                                            borderBottom: `1px solid ${theme.colors.border}`
                                                        },
                                                        children: [
                                                            {
                                                                type: 'input',
                                                                props: {
                                                                    type: 'checkbox',
                                                                    checked: selectedCourses[course.id] || false,
                                                                    onChange: () => toggleCourseSelection(course.id),
                                                                    style: { marginRight: theme.spacing.sm }
                                                                }
                                                            },
                                                            {
                                                                type: 'div',
                                                                props: {
                                                                    children: [
                                                                        {
                                                                            type: 'strong',
                                                                            props: {
                                                                                children: [`${course.id}: `]
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
                                                children: 'Create Batch'
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

window.CreateBatch = CreateBatch;