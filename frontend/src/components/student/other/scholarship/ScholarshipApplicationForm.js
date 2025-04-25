// components/student/other/scholarship/ScholarshipApplicationForm.js
const ScholarshipApplicationForm = ({ scholarship, onClose, onSuccess }) => {
    const [formData, setFormData] = MiniReact.useState({
        studentId: 1, // Would typically get from current user context
        scholarshipId: scholarship.id,
        studentIndexNumber: '',
        studentBatch: '',
        studentDegree: '',
        studentGpa: '',
    });
    // Loading and error states to handle API interactions
    const [errors, setErrors] = MiniReact.useState({});
    const [loading, setLoading] = MiniReact.useState(false);
    const [submitSuccess, setSubmitSuccess] = MiniReact.useState(false);
    
    const validateForm = () => {
        const newErrors = {};

        if (!formData.studentIndexNumber) {
            newErrors.studentIndexNumber = 'Index number is required';
        }
        
        if (!formData.studentBatch) {
            newErrors.studentBatch = 'Batch is required';
        }
        
        if (!formData.studentDegree) {
            newErrors.studentDegree = 'Degree program is required';
        }
        
        if (!formData.studentGpa) {
            newErrors.studentGpa = 'GPA is required';
        } else if (isNaN(formData.studentGpa) || parseFloat(formData.studentGpa) < 0 || parseFloat(formData.studentGpa) > 4.0) {
            newErrors.studentGpa = 'GPA must be a number between 0 and 4.0';
        } 
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setErrors({});
        
        try {
            // Create a submission data structure that matches backend expectations
            const submissionData = {
                studentIndexNumber: formData.studentIndexNumber,
                scholarshipId: scholarship.id,
                studentBatch: formData.studentBatch,
                studentDegree: formData.studentDegree,
                studentGpa: formData.studentGpa
            };

            console.log("Submitting scholarship data:", submissionData);

            // Send POST request to the API endpoint
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/students/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Set success state first
                setSubmitSuccess(true);
                
                // Call onSuccess if provided
                if (onSuccess) {
                    onSuccess(data.data);
                }
                
                // No need to call onClose here as we show the success message
                // Wait a moment before calling refreshPage (if defined)
                if (typeof refreshPage === 'function') {
                    setTimeout(refreshPage, 3000);
                }
            } else {
                setErrors({ general: data.message || "Failed to create application" });
            }
        } catch (error) {
            setErrors({ general: error.message || "An error occurred while applying to the scholarship" });
            console.error("Error applying:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Clear error when field is changed
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };
    
    return {
        type: 'div',
        props: {
            children: [
                submitSuccess ? {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.lg,
                            backgroundColor: `${theme.colors.success}10`,
                            borderRadius: theme.borderRadius.md,
                            textAlign: 'center'
                        },
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        color: theme.colors.success,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Application Submitted Successfully!']
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    children: ['Your application has been received and is under review.']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: onClose,
                                    style: {
                                        marginTop: theme.spacing.md
                                    },
                                    children: ['Close']
                                }
                            }
                        ]
                    }
                } : {
                    type: 'form',
                    props: {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing.md
                        },
                        children: [
                            // Scholarship Information Section
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.md,
                                        padding: theme.spacing.md,
                                        backgroundColor: `${theme.colors.primary}10`,
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: {
                                                    color: theme.colors.primary,
                                                },
                                                children: ['Scholarship Information']
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Name: ${scholarship.name}`]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Amount: $${scholarship.amount}`]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Minimum GPA Required: ${scholarship.minGpa}`]
                                            }
                                        }
                                    ]
                                }
                            },
                            errors.general && {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        fontSize: theme.typography.caption.fontSize,
                                        marginTop: theme.spacing.xs,
                                        padding: theme.spacing.sm,
                                        backgroundColor: `${theme.colors.error}10`,
                                        borderRadius: theme.borderRadius.sm
                                    },
                                    children: [errors.general]
                                }
                            },
                            
                            // Student Information Fields
                            {
                                type: TextField,
                                props: {
                                    label: 'Index Number',
                                    name: 'studentIndexNumber',
                                    value: formData.studentIndexNumber,
                                    placeholder: 'e.g., 123456',
                                    onChange: handleChange,
                                    error: errors.studentIndexNumber
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Batch/Year',
                                    name: 'studentBatch',
                                    value: formData.studentBatch,
                                    placeholder: 'e.g., 2022',
                                    onChange: handleChange,
                                    error: errors.studentBatch
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Degree Program',
                                    name: 'studentDegree',
                                    value: formData.studentDegree,
                                    placeholder: 'e.g., Computer Science',
                                    onChange: handleChange,
                                    error: errors.studentDegree
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Current GPA',
                                    name: 'studentGpa',
                                    value: formData.studentGpa,
                                    placeholder: 'Enter your current GPA (0-4.0)',
                                    onChange: handleChange,
                                    error: errors.studentGpa
                                }
                            },

                            // Form Actions
                            {
                                type: 'div',
                                props: {
                                    style: {
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
                                                disabled: loading,
                                                children: ['Cancel']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: (e) => {
                                                    // Prevent default and stop propagation
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleSubmit();
                                                },
                                                disabled: loading,
                                                children: loading ? 'Submitting...' : 'Submit Application'
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

window.ScholarshipApplicationForm = ScholarshipApplicationForm;