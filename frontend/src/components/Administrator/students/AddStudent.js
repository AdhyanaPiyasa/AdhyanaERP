// components/Admin/students/AddStudent.js
const AddStudent = ({ onClose, onSuccess,degreeID = '', degreeProgram = '', batch = '' }) => {

    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
    };
    // Initial state with empty values 
    const [formData, setFormData] = MiniReact.useState(() => ({
        name: '',
        email: '',
        degreeID: degreeID,
        degreeProgram: degreeProgram,
        indexNumber: '',
        registrationNumber: '',
        mobileNumber: '',
        birthDate: '',
        state: 'Active'
    }));

    // function to reset the form fields
    const resetForm = () => {
        setFormData({
          name: '',
          email: '',
          degreeID: degreeID || '',
          degreeProgram: degreeProgram || '',
          indexNumber: '',
          registrationNumber: '',
          mobileNumber: '',
          birthDate: '',
          state: 'Active'
        });
      };

    // Loading and error states to handle API interactions
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    // Handle form submission to API
    const handleSubmit = async () => {

        // Validate form data
        if (!formData.name || !formData.email ||!formData.degreeID || !formData.degreeProgram || 
            !formData.indexNumber || !formData.registrationNumber || 
            !formData.birthDate) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Format the birth date to YYYY-MM-DD if it's not already
            let formattedBirthDate = formData.birthDate;
            if (formData.birthDate && !formData.birthDate.includes('-')) {
                const date = new Date(formData.birthDate);
                formattedBirthDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            }

        // Create a submission data structure that matches backend expectations
        const submissionData = {
            name: formData.name,
            email: formData.email,
            degreeID: formData.degreeID ,
            // || degreeProgram.substring(0, 2) + batch.substring(1), // Create from props if not set
            degreeProgram: formData.degreeProgram,
            indexNumber: formData.indexNumber,
            registrationNumber: formData.registrationNumber,
            mobileNumber: formData.mobileNumber,
            birthDate: formattedBirthDate,
            state: formData.state
        };

            console.log("Submitting student data:", submissionData);

        // Send POST request to the API endpoint
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8081/api/api/students/', { // Added trailing slash
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
                setError(data.message || "Failed to create student");
            }
        } catch (error) {
            setError(error.message || "An error occurred while creating the student");
            console.error("Error creating student:", error);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        errorText: {
            color: theme.colors.error,
            fontSize: theme.typography.caption.fontSize,
            marginTop: theme.spacing.xs
        },
        buttonsContainer: {
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end',
            marginTop: theme.spacing.lg
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
            onClose: handleClose,
            title: 'Add New Student',
            children: [
                // Display error message if present
                error && {
                    type: 'div',
                    props: {
                        style: styles.errorText,
                        children: [error]
                    }
                },
                {
                    type: 'form',
                    props: {
                        children: [
                            // Personal Information Fields
                            {
                                type: TextField,
                                props: {
                                    label: 'Name',
                                    name: 'name',
                                    placeholder: 'Enter full name',
                                    required: true,
                                    value: formData.name,
                                    onChange: (e) => setFormData({...formData, name: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Email',
                                    value: formData.email,
                                    name: 'email',
                                    placeholder: 'Enter email address',
                                    required: true,
                                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                                    type: 'email'
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Degree ID',
                                    name: 'degreeID',
                                    placeholder: 'Enter degree ID',
                                    required: true,
                                    value: formData.degreeID,
                                    onChange: (e) => setFormData({...formData, degreeID: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Degree Program',
                                    name: 'degreeProgram',
                                    placeholder: 'Enter degree program',
                                    required: true,
                                    value: formData.degreeProgram,
                                    onChange: (e) => setFormData({...formData, degreeProgram: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Index Number',
                                    name: 'indexNumber',
                                    placeholder: 'Enter index number',
                                    required: true,
                                    value: formData.indexNumber,
                                    onChange: (e) => setFormData({...formData, indexNumber: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Registration Number',
                                    name: 'registrationNumber',
                                    placeholder: 'Enter registration number',
                                    required: true,
                                    value: formData.registrationNumber,
                                    onChange: (e) => setFormData({...formData, registrationNumber: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Mobile Number',
                                    name: 'mobileNumber',
                                    placeholder: 'Enter mobile number',
                                    required: true,
                                    value: formData.mobileNumber,
                                    onChange: (e) => setFormData({...formData, mobileNumber: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Birth Date',
                                    name: 'birthDate',
                                    placeholder: 'Enter birth date',
                                    required: true,
                                    value: formData.birthDate,
                                    onChange: (e) => setFormData({...formData, birthDate: e.target.value}),
                                    type: 'date'
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
                                    ]
                                }
                            },
                            // Action Buttons
                            {
                                type: 'div',
                                props: {
                                    style: styles.buttonsContainer,
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
                                                children: loading ? 'Adding...' : 'Add Student'
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

window.AddStudent = AddStudent;