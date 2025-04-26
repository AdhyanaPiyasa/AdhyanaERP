// components/Administrator/other/exams/Grades/AddGradeForm.js
const AddGradeForm = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        indexNo: '',
        name: '',
        courseCode: '',
        courseName: '',
        grade: ''
    });

    // Available courses for dropdown
    const courses = [
        { value: '101', label: 'Introduction to Computer Science (CS101)' },
        { value: '204', label: 'Advanced Mathematics (MATH204)' },
        { value: '301', label: 'Technical Communication (ENG301)' },
        { value: '202', label: 'Database Systems (DB202)' }
    ];

    // Available grades for dropdown
    const grades = [
        { value: 'A+', label: 'A+' },
        { value: 'A', label: 'A' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B', label: 'B' },
        { value: 'B-', label: 'B-' },
        { value: 'C+', label: 'C+' },
        { value: 'C', label: 'C' },
        { value: 'C-', label: 'C-' },
        { value: 'D+', label: 'D+' },
        { value: 'D', label: 'D' },
        { value: 'F', label: 'F' }
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
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.indexNo || !formData.name || !formData.courseCode || !formData.grade) {
            setError('Please fill in all required fields.');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const submissionData = {
                indexNo: formData.indexNo,
                name: formData.name,
                courseCode: formData.courseCode,
                courseName: formData.courseName,
                grade: formData.grade
            };
            
            console.log('Grade data:', submissionData);
            
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/exams/grades/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to add grade. Please try again.');
            }
            
            const data = await response.json();
            if (data.success) {
                if (onSuccess) {
                    onSuccess(data.data); // Pass the created grade data back
                } else {
                    onClose();
                }
                setTimeout(refreshPage, 300);
            } else {
                setError(data.message || 'Failed to add grade. Please try again.');
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
            title: 'Add New Grade',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            // Student ID
                            {
                                type: TextField,
                                props: {
                                    label: 'Student ID',
                                    name: 'indexNo',
                                    placeholder: 'Enter student ID number',
                                    value: formData.indexNo,
                                    onChange: handleChange
                                }
                            },
                            
                            // Student Name
                            {
                                type: TextField,
                                props: {
                                    label: 'Student Name',
                                    name: 'name',
                                    placeholder: 'Enter student full name',
                                    value: formData.name,
                                    onChange: handleChange
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
                            
                            // Grade selection
                            {
                                type: Select,
                                props: {
                                    label: 'Grade',
                                    name: 'grade',
                                    value: formData.grade,
                                    onChange: handleChange,
                                    options: [
                                        { value: '', label: 'Select a grade' },
                                        ...grades
                                    ]
                                }
                            },
                            
                            // Comments (optional)
                            {
                                type: TextField,
                                props: {
                                    label: 'Comments (Optional)',
                                    name: 'comments',
                                    placeholder: 'Additional comments about the grade',
                                    multiline: true
                                }
                            },
                            
                            // Form actions
                            {
                                type: 'div',
                                props: {
                                    style: {
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
                                                disabled: !formData.indexNo || !formData.name || !formData.courseCode || !formData.grade,
                                                children: 'Add Grade'
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

window.AddGradeForm = AddGradeForm;