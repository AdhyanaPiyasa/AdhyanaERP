// components/Administrator/other/scholarship/AdminCreateScholarship.js
const AdminCreateScholarship = ({ onClose, onSuccess }) => {
    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
    };

// Initial state with empty values
const [formData, setFormData] = MiniReact.useState({
    name: '',
    description: '',
    minGpa: '',
    amount: '',
    applicationDeadline: ''
});

    // function to reset the form fields
    const resetForm = () => {
        setFormData({
          name: '',
          description: '',
          minGpa: '',
          amount: '',
          applicationDeadline: '',
        });
      };

// Loading and error states to handle API interactions
const [errors, setErrors] = MiniReact.useState({});
const [loading, setLoading] = MiniReact.useState(false);

//form validations
const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
        newErrors.name = 'Scholarship name is required';
    }
    
    if (!formData.description) {
        newErrors.description = 'Description is required';
    }
    
    if (!formData.minGpa) {
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
    } else {
        const deadlineDate = new Date(formData.applicationDeadline);
        const today = new Date();
        if (deadlineDate < today) {
            newErrors.applicationDeadline = 'Deadline must be in the future';
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


// Handle form submission to API
const handleSubmit = async () => {

    // Validate form data
    if (!validateForm()) {
        return;
    }

    setLoading(true);
    setErrors(null);

    try {
    // Create a submission data structure that matches backend expectations
    const submissionData = {
        name: formData.name,
        description: formData.description,
        minGpa: formData.minGpa,
        amount: formData.amount,
        applicationDeadline: formData.applicationDeadline
    };

        console.log("Submitting scholarship data:", submissionData);

    // Send POST request to the API endpoint
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8081/api/api/students/scholarships', { // Added trailing slash
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
            // Close modal first
            if (onSuccess) {
                  onSuccess(data.data);
            } else {
                  onClose();
        }      
        // Refresh the page after closing modal
        setTimeout(refreshPage, 300);
        } else {
            setErrors(data.message || "Failed to create scholarship");
        }
    } catch (error) {
        setErrors(error.message || "An error occurred while creating the scholarship");
        console.error("Error creating student:", error);
    } finally {
        setLoading(false);
    }
};

const handleClose = () => {
    resetForm(); // Reset form data first
    onClose();   // Then call the parent's onClose
  };

    
return {
    type: Modal,
    props: {
        isOpen: true,
        onClose: onClose,
        title: 'Create New Scholarship',
        children: [
            // Display error message if present
            errors && {
                type: 'div',
                props: {
                    style:
                        {
                            color: theme.colors.error,
                            fontSize: theme.typography.caption.fontSize,
                            marginTop: theme.spacing.xs
                        },
                    children: [errors]
                }
            },
            {
                type: 'form',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.md
                    },
                    children: [
                        {
                            type: TextField,
                            props: {
                                label: 'Scholarship Name',
                                value: formData.name,
                                placeholder: 'Enter scholarship name',
                                onChange: (e) => setFormData({...formData, name: e.target.value}),                                }
                        },
                        {
                            type: TextField,
                            props: {
                                label: 'Description',
                                value: formData.description,
                                placeholder: 'Enter description of the scholarship',
                                onChange: (e) => setFormData({...formData, description: e.target.value}),                                }
                        },
                        {
                            type: TextField,
                            props: {
                                label: 'Minimum GPA',
                                value: formData.minGpa,
                                placeholder: 'Enter minimum GPA required (0-4.0)',
                                onChange: (e) => setFormData({...formData, minGpa: e.target.value}),                                }
                        },
                        {
                            type: TextField,
                            props: {
                                label: 'Amount',
                                value: formData.amount,
                                placeholder: 'Enter scholarship amount',
                                onChange: (e) => setFormData({...formData, amount: e.target.value}),                                }
                        },
                        {
                            type: TextField,
                            props: {
                                label: 'Application Deadline',
                                value: formData.applicationDeadline,
                                type: 'date',
                                onChange: (e) => setFormData({...formData, applicationDeadline: e.target.value}),                                }
                        },                                                        
                        // Actions buttons
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
                                            onClick:  () => {
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
                                            children: loading ? 'Creating...' : 'Create  Schilarship'
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

window.AdminCreateScholarship = AdminCreateScholarship;