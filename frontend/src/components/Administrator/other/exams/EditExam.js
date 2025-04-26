// components/Admin/exams/EditExam.js
const EditExam = ({ exam, onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: exam.title || '',
        semester_id: exam.semester_id || '',
        exam_date: exam.exam_date || '',
        start_time: exam.start_time || '',
        end_time: exam.end_time || '',
        location: exam.location || '',
        type: exam.type || 'FINAL'
    });
    
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            
            // Validate form data
            if (!formData.title || !formData.semester_id || !formData.exam_date || 
                !formData.start_time || !formData.end_time || !formData.location || 
                !formData.type) {
                setError("All fields are required");
                setIsSubmitting(false);
                return;
            }
            
            // Format date and time for SQL compatibility if needed
            // Create the exam object to match backend expectations
            const examData = {
                title: formData.title,
                semester_id: formData.semester_id,
                exam_date: formData.exam_date, // browser date input format (YYYY-MM-DD) is SQL compatible
                start_time: formData.start_time, // browser time input format (HH:MM) is SQL compatible with proper settings
                end_time: formData.end_time,
                location: formData.location,
                type: formData.type,
                exam_id: exam.exam_id // Include ID in the body as well for reference
            };
            
            // Send data to backend API
            const response = await fetch(`/api/exams/${exam.exam_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(examData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update exam');
            }
            
            console.log('Exam updated successfully');
            onClose();
            
        } catch (err) {
            console.error('Error updating exam:', err);
            setError(err.message || 'An error occurred while updating the exam');
        } finally {
            setIsSubmitting(false);
        }
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
                            // Display error message if exists
                            error && {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        padding: theme.spacing.sm,
                                        marginBottom: theme.spacing.md,
                                        backgroundColor: `${theme.colors.error}15`,
                                        borderRadius: theme.borderRadius.sm
                                    },
                                    children: [error]
                                }
                            },
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
                                    label: 'Semester ID',
                                    value: formData.semester_id,
                                    placeholder: 'e.g., FALL2024',
                                    onChange: (e) => setFormData({...formData, semester_id: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Exam Date',
                                    value: formData.exam_date,
                                    type: 'date',
                                    onChange: (e) => setFormData({...formData, exam_date: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Start Time',
                                    placeholder: 'HH:MM:SS',
                                    value: formData.start_time,
                                    type: 'time',
                                    onChange: (e) => setFormData({...formData, start_time: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'End Time',
                                    placeholder: 'HH:MM:SS',
                                    value: formData.end_time,
                                    type: 'time',
                                    onChange: (e) => setFormData({...formData, end_time: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Location',
                                    value: formData.location,
                                    placeholder: 'e.g., Room 101',
                                    onChange: (e) => setFormData({...formData, location: e.target.value})
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Exam Type',
                                    value: formData.type,
                                    onChange: (e) => setFormData({...formData, type: e.target.value}),
                                    options: [
                                        { value: 'FINAL', label: 'Final Exam' },
                                        { value: 'MIDTERM', label: 'Midterm Exam' },
                                        { value: 'QUIZ', label: 'Quiz' },
                                        { value: 'OTHER', label: 'Other' }
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
                                                disabled: isSubmitting,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                loading: isSubmitting,
                                                disabled: isSubmitting,
                                                children: isSubmitting ? 'Saving...' : 'Save changes'
                                            }
                                        }
                                    ]
                                }
                            }
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };
};

window.EditExam = EditExam;