// components/Administrator/other/exams/Grades/EditGradeForm.js
const EditGradeForm = ({ grade, onClose }) => {
    const refreshPage = () => {
        window.location.reload();
    };
    const [formData, setFormData] = MiniReact.useState({
        indexNo: grade.indexNo,
        name: grade.name,
        courseCode: grade.courseCode.toString(),
        courseName: grade.courseName,
        grade: grade.grade
    });
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

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
        console.log('Updating grade:', grade.gid, formData);
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:8081/api/api/exams/grade/${grade.gid}`, {
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
                } else {
                    onClose();
                }
                
                setTimeout(refreshPage, 300);
            } else {
                setError(data.message || 'Error updating grade');
            }
        } catch (error) {
            console.error(error.message || 'Error updating grade');
            console.error('Error updating grade:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Edit Grade',
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
                                    value: formData.indexNo,
                                    onChange: handleChange,
                                    disabled: true // Student ID shouldn't be editable
                                }
                            },
                            
                            // Student Name
                            {
                                type: TextField,
                                props: {
                                    label: 'Student Name',
                                    name: 'name',
                                    value: formData.name,
                                    onChange: handleChange,
                                    disabled: true // Student name shouldn't be editable
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
                                    disabled: true, // Course shouldn't be editable when updating a grade
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
                                    placeholder: 'Additional comments about the grade change',
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
                                                disabled: !formData.grade,
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

window.EditGradeForm = EditGradeForm;