// components/Administrator/other/scholarship/AdminEditScholarship.js
const AdminEditScholarship = ({ scholarship, onClose, onSuccess }) => {

    // Add this after your useState declarations
    const refreshPage = () => {
        window.location.reload();
    };
    
    // Initialize form with selected scholarship data
    const [formData, setFormData] = MiniReact.useState(() => ({
        id: scholarship.id ,
        name: scholarship.name || '',
        description: scholarship.description || '',
        minGpa: scholarship.minGpa || '',
        amount: scholarship.amount || '',
        applicationDeadline: scholarship.applicationDeadline || ''
    }));

    // function to reset form data to original student values
    const resetForm = () => {
        setFormData({
        name: scholarship?.name || '',
        description: scholarship?.description || '',
        minGpa: scholarship?.minGpa || '',
        applicationDeadline: scholarship?.applicationDeadline || 'Active'
        });
    };   
    
    // States for handling API operations
    const [loading, setLoading] = MiniReact.useState(false);
    const [errors, setErrors] = MiniReact.useState({});
    
    //validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Scholarship name is required';
        }
        
        if (!formData.description) {
            newErrors.description = 'Description is required';
        }
        
        if (!formData.minGpa && formData.minGpa !== 0) {
            newErrors.minGpa = 'Minimum GPA is required';
        } else if (isNaN(formData.minGpa) || parseFloat(formData.minGpa) < 0 || parseFloat(formData.minGpa) > 4.0) {
            newErrors.minGpa = 'GPA must be a number between 0 and 4.0';
        }
        
        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        }
        
        if (!formData.applicationDeadline) {
            newErrors.applicationDeadline = 'Application deadline is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setErrors('');
        
        try {
            // Send PUT request to update scholarship
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/api/students/scholarships/${scholarship.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    minGpa: parseFloat(formData.minGpa),
                    amount: parseFloat(formData.amount),
                    applicationDeadline: formData.applicationDeadline
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            
            if (data.success) {
                // Call the success callback if provided
                if (onSuccess) {
                    onSuccess(data.data);
                } else {
                    onClose(); // Fallback to just closing the modal
                }
                
                // Add this line to refresh the page after success
                setTimeout(refreshPage, 300);
            } else {
                setErrors( data.message || 'Failed to update scholarship' );
            }
        } catch (error) {
            setErrors(error.message || "Failed to update scholarship. Please try again.");
            console.error("Error updating student:", error);
        } finally {
            setLoading(false);
        }
    };

    // Create a custom close handler
    const handleClose = () => {
        resetForm(); // Reset form data first
        onClose();   // Then call the parent's onClose
        };
    
    
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: handleClose,
            title: 'Edit Scholarship',
            children: [
                 // Display error message if present
                errors && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.error,
                            marginBottom: theme.spacing.md
                        },
                        children: [errors]
                    }
                },
                {
                    type: 'form',
                    props: {
                        // style: {
                        //     display: 'flex',
                        //     flexDirection: 'column',
                        //     gap: theme.spacing.md
                        // },
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Scholarship Name',
                                    value: formData.name,
                                    onChange: (e) => setFormData({...formData, name: e.target.value}),                                    
                                    disabled: loading,
                                    error: errors.name
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Description',
                                    value: formData.description,
                                    placeholder: 'Enter scholarship description',
                                    onChange: (e) => setFormData({...formData, description: e.target.value}),                                    
                                    disabled: loading,
                                    error: errors.description
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Minimum GPA',
                                    value: formData.minGpa,
                                    placeholder: 'Enter minimum GPA',
                                    onChange: (e) => setFormData({...formData, minGpa: e.target.value}),                                    
                                    disabled: loading,
                                    error: errors.minGpa
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Amount',
                                    value: formData.amount,
                                    placeholder: 'Enter scholarship amount',
                                    onChange: (e) => setFormData({...formData, amount: e.target.value}),                                    
                                    disabled: loading,
                                    error: errors.amount
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Application Deadline',
                                    value: formData.applicationDeadline,
                                    placeholder: 'Enter application deadline',
                                    type: 'date',
                                    onChange: (e) => setFormData({...formData, applicationDeadline: e.target.value}),                                    
                                    disabled: loading,
                                    error: errors.applicationDeadline
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
                                                onClick: () => {
                                                    onClose();
                                                    setTimeout(refreshPage, 300); // Refresh on cancel too
                                                },
                                                disabled: loading,
                                                children: 'Cancel'
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
                                                children: loading ? 'Saving...' : 'Save Changes'
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

window.AdminEditScholarship = AdminEditScholarship;