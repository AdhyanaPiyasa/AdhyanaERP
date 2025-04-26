// components/Administrator/other/exams/Reports/CreateReportForm.js
const CreateReportForm = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        type: '',
        courseCode: '',
        courseName: '',
        examName: '',
        date: '',
        description: '',
        status: 'draft'
    });
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    // Report types for dropdown
    const reportTypes = [
        { value: 'exam', label: 'Exam Report' },
        { value: 'course', label: 'Course Report' },
        { value: 'student', label: 'Student Report' },
        { value: 'faculty', label: 'Faculty Report' }
    ];

    // Status options for dropdown
    const statusOptions = [
        { value: 'draft', label: 'Save as Draft' },
        { value: 'published', label: 'Publish Immediately' }
    ];

    // Available courses for dropdown
    const courses = [
        { value: '101', label: 'Introduction to Computer Science (CS101)' },
        { value: '204', label: 'Advanced Mathematics (MATH204)' },
        { value: '301', label: 'Technical Communication (ENG301)' },
        { value: '202', label: 'Database Systems (DB202)' },
        { value: 'all', label: 'All Courses' }
    ];

    // Available exams for dropdown (would be filtered by course in a real implementation)
    const exams = [
        { value: 'mid1', label: 'Midterm Exam 1' },
        { value: 'mid2', label: 'Midterm Exam 2' },
        { value: 'final', label: 'Final Exam' },
        { value: 'quiz1', label: 'Quiz 1' },
        { value: 'quiz2', label: 'Quiz 2' },
        { value: 'na', label: 'Not Applicable' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'courseCode') {
            // Find the corresponding course name
            const selectedCourse = courses.find(course => course.value === value);
            const courseName = selectedCourse ? selectedCourse.label.split(' (')[0] : '';
            
            setFormData({
                ...formData,
                courseCode: value,
                courseName: courseName
            });
        } else if (name === 'type') {
            // Reset exam name if the report type is not exam-related
            if (value !== 'exam') {
                setFormData({
                    ...formData,
                    [name]: value,
                    examName: 'N/A'
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.type || !formData.courseCode) {
            setError('Please fill in all required fields.');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Add creator information before submission
            const reportToSubmit = {
                ...formData,
                creator: 'Dr. John Doe', // In a real app, this would come from the logged-in user
                date: formData.date || new Date().toISOString().split('T')[0] // Use today if no date provided
            };
            
            console.log('Creating new report:', reportToSubmit);
            
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/exams/reports/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reportToSubmit)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create report. Please try again.');
            }
            
            const data = await response.json();
            if (data.success) {
                if (onSuccess) {
                    onSuccess(data.data); // Pass the created report data back
                } else {
                    onClose();
                }
                setTimeout(refreshPage, 300);
            } else {
                setError(data.message || 'Failed to create report. Please try again.');
            }
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Create New Report',
            children: [
                {
                    type: 'form',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: theme.spacing.md,
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        },
                        children: [
                            // Report Title (spans two columns)
                            {
                                type: 'div',
                                props: {
                                    style: { gridColumn: '1 / span 2' },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Report Title',
                                                name: 'title',
                                                placeholder: 'Enter report title',
                                                value: formData.title,
                                                onChange: handleChange
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Report Type
                            {
                                type: Select,
                                props: {
                                    label: 'Report Type',
                                    name: 'type',
                                    value: formData.type,
                                    onChange: handleChange,
                                    options: [
                                        { value: '', label: 'Select report type' },
                                        ...reportTypes
                                    ]
                                }
                            },
                            
                            // Status
                            {
                                type: Select,
                                props: {
                                    label: 'Status',
                                    name: 'status',
                                    value: formData.status,
                                    onChange: handleChange,
                                    options: statusOptions
                                }
                            },
                            
                            // Course selection
                            {
                                type: Select,
                                props: {
                                    label: 'Course',
                                    name: 'courseCode',
                                    value: formData.courseCode,
                                    onChange: handleChange,
                                    options: [
                                        { value: '', label: 'Select a course' },
                                        ...courses
                                    ]
                                }
                            },
                            
                            // Exam selection (only enabled for exam reports)
                            {
                                type: Select,
                                props: {
                                    label: 'Exam',
                                    name: 'examName',
                                    value: formData.examName,
                                    onChange: handleChange,
                                    disabled: formData.type !== 'exam',
                                    options: [
                                        { value: '', label: 'Select an exam' },
                                        ...exams
                                    ]
                                }
                            },
                            
                            // Date
                            {
                                type: TextField,
                                props: {
                                    label: 'Report Date',
                                    name: 'date',
                                    type: 'date',
                                    value: formData.date,
                                    onChange: handleChange
                                }
                            },
                            
                            // Report Parameters (placeholder, would be dynamic based on report type)
                            {
                                type: Select,
                                props: {
                                    label: 'Report Parameters',
                                    name: 'parameters',
                                    options: [
                                        { value: 'default', label: 'Default Parameters' },
                                        { value: 'detailed', label: 'Detailed Analysis' },
                                        { value: 'summary', label: 'Summary Only' }
                                    ]
                                }
                            },
                            
                            // Description (spans two columns)
                            {
                                type: 'div',
                                props: {
                                    style: { gridColumn: '1 / span 2' },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Report Description',
                                                name: 'description',
                                                placeholder: 'Enter a detailed description of this report...',
                                                multiline: true,
                                                value: formData.description,
                                                onChange: handleChange,
                                                style: { height: '100px' }
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Form actions
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        gridColumn: '1 / span 2',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.lg
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
                                                disabled: !formData.title || !formData.type || !formData.courseCode,
                                                children: formData.status === 'draft' ? 'Save as Draft' : 'Create & Publish'
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

window.CreateReportForm = CreateReportForm;