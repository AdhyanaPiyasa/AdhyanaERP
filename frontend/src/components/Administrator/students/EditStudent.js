// components/Admin/students/EditStudent.js
const EditStudent = ({ student, onClose, onSuccess }) => {

    // Add this after your useState declarations
    const refreshPage = () => {
    window.location.reload();
};
    // Initialize form with selected student data
    const [formData, setFormData] = MiniReact.useState(() => ({
        name: student?.name || '',
        email: student?.email || '',
        mobileNumber: student?.mobileNumber || '',
        state: student?.state || 'Active'
    }));

    // function to reset the form fields
    const resetForm = () => {
        setFormData({
          name: student?.name || '',
          email: student?.email || '',
          mobileNumber: student?.mobileNumber || '',
          state: student?.state || 'Active'
        });
      };

    
    // States for handling API operations
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState('');

    // Handle form submission
    const handleSubmit = async () => {
        // Validate form data
        if (!formData.name || !formData.email) {
            setError("Name and email are required fields");
            return;
        }

        setLoading(true);
        setError('');

        try {
            
            // Send PUT request to update student
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/api/students/${student.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
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
            }else {
                setError(data.message || "Failed to update student");
            }
        } catch (error) {
            setError(error.message || "An error occurred while updating the student");
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
            title: 'Edit Student',
            children: [
                // Display error message if present
                error && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.error,
                            marginBottom: theme.spacing.md
                        },
                        children: [error]
                    }
                },
                {
                    type: 'form',
                    props: {
                        children: [
                            // Only include editable fields according to the API implementation
                            {
                                type: TextField,
                                props: {
                                    label: 'Name',
                                    name: 'name',
                                    placeholder: 'Enter student name',
                                    required: true,
                                    value: formData.name,
                                    onChange: (e) => setFormData({...formData, name: e.target.value}),
                                    disabled: loading
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Email',
                                    name: 'email',
                                    placeholder: 'Enter student email',
                                    required: true,
                                    value: formData.email,
                                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                                    type: 'email',
                                    disabled: loading
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Mobile Number',
                                    name: 'mobileNumber',
                                    placeholder: 'Enter student mobile number',
                                    value: formData.mobileNumber,
                                    onChange: (e) => setFormData({...formData, mobileNumber: e.target.value}),
                                    disabled: loading
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'State',
                                    value: formData.state,
                                    onChange: (e) => setFormData({...formData, state: e.target.value}),
                                    options: [
                                        { value: 'Active', label: 'Active' },
                                        { value: 'Inactive', label: 'Inactive' },
                                        { value: 'Graduated', label: 'Graduated' },
                                        { value: 'On Leave', label: 'On Leave' }
                                    ],
                                    disabled: loading
                                }
                            },
                            // Read-only information (displayed but not editable)
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        marginTop: theme.spacing.lg,
                                        padding: theme.spacing.md,
                                        backgroundColor: theme.colors.background,
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: ['Non-editable Information']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: [`Degree Program: ${student.degreeProgram}`]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: [`Index Number: ${student.indexNumber}`]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: [`Registration Number: ${student.registrationNumber}`]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [`Birth Date: ${student.birthDate}`]
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
                                        gap: theme.spacing.sm,
                                        justifyContent: 'flex-end',
                                        marginTop: theme.spacing.lg
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
                                                children: loading ? 'Saving...' : 'Save Changes'
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

window.EditStudent = EditStudent;