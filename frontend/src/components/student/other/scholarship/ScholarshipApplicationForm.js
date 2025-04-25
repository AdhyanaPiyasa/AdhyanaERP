// components/student/other/scholarship/ScholarshipApplicationForm.js
const ScholarshipApplicationForm = ({ scholarship, onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        studentId: 1, // Would typically get from current user context
        scholarshipId: scholarship.id,
        studentBatch: '',
        studentDegree: '',
        studentGpa: '',
        personalStatement: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = MiniReact.useState({});
    const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
    const [submitSuccess, setSubmitSuccess] = MiniReact.useState(false);
    
    const validateForm = () => {
        const newErrors = {};
        
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
        } else if (parseFloat(formData.studentGpa) < scholarship.minGpa) {
            newErrors.studentGpa = `GPA does not meet the minimum requirement of ${scholarship.minGpa}`;
        }
        
        if (!formData.personalStatement) {
            newErrors.personalStatement = 'Personal statement is required';
        } else if (formData.personalStatement.length < 100) {
            newErrors.personalStatement = 'Personal statement must be at least 100 characters';
        }
        
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // In a real implementation, this would be an API call
            // const response = await fetch('/api/students/applications', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         studentId: formData.studentId,
            //         scholarshipId: formData.scholarshipId,
            //         studentBatch: formData.studentBatch,
            //         studentDegree: formData.studentDegree,
            //         studentGpa: parseFloat(formData.studentGpa)
            //     })
            // });
            
            // For demo purposes, simulate API call
        } catch (err) {
            setIsSubmitting(false);
            setErrors({ submit: 'Failed to submit application. Please try again.' });
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
                            
                            // Student Information Fields
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
                            {
                                type: TextField,
                                props: {
                                    label: 'Personal Statement',
                                    name: 'personalStatement',
                                    value: formData.personalStatement,
                                    placeholder: 'Explain why you deserve this scholarship...',
                                    multiline: true,
                                    onChange: handleChange,
                                    error: errors.personalStatement
                                }
                            },

                            // Submit Error (if any)
                            errors.submit && {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        padding: theme.spacing.sm,
                                        backgroundColor: `${theme.colors.error}10`,
                                        borderRadius: theme.borderRadius.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: [errors.submit]
                                }
                            },
                            
                            // Form Actions
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: onClose,
                                                disabled: isSubmitting,
                                                children: ['Cancel']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                disabled: isSubmitting,
                                                loading: isSubmitting,
                                                children: [isSubmitting ? 'Submitting...' : 'Submit Application']
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