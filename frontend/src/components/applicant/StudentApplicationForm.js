// components/student/application/StudentApplicationForm.js
const StudentApplicationForm = ({ onClose, onSuccess, isStandalone = false }) => {
    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
    };

    // State for application submission success
    const [isSubmitted, setIsSubmitted] = MiniReact.useState(false);
    const [applicantId, setApplicationId] = MiniReact.useState('');

    // Initial state with empty values
    const [formData, setFormData] = MiniReact.useState({
        // Personal Information
        name: '',
        nationalId: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        
        // Applied Degree Program
        appliedProgram: '',
        applicationDate: new Date().toISOString().split('T')[0], // Current date as default
        
        // Academic Records
        mathematics: '',
        science: '',
        english: '',
        computerStudies: '',
        
        // Guardian Information
        guardianName: '',
        guardianNationalId: '',
        guardianRelation: '',
        guardianContactNumber: '',
        guardianEmail: '',
        
        // Hostel Required
        hostelRequired: ''
    });

    // Function to reset the form fields
    const resetForm = () => {
        setFormData({
            name: '',
            nationalId: '',
            email: '',
            phone: '',
            gender: '',
            dateOfBirth: '',
            address: '',
            appliedProgram: '',
            applicationDate: new Date().toISOString().split('T')[0],
            mathematics: '',
            science: '',
            english: '',
            computerStudies: '',
            guardianName: '',
            guardianNationalId: '',
            guardianRelation: '',
            guardianContactNumber: '',
            guardianEmail: '',
            hostelRequired: ''
        });
    };

    // Loading and error states to handle API interactions
    const [errors, setErrors] = MiniReact.useState({});
    const [loading, setLoading] = MiniReact.useState(false);

    // Form validations
    const validateForm = () => {
        const newErrors = {};
        
        // Personal Information validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.nationalId) {
            newErrors.nationalId = 'National ID is required';
        } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(formData.nationalId)) {
            newErrors.nationalId = 'Invalid National ID format';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{9,10}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }
        
        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }
        
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            
            if (age < 16 || age > 60) {
                newErrors.dateOfBirth = 'Age must be between 16 and 60';
            }
        }
        
        if (!formData.address) {
            newErrors.address = 'Address is required';
        }
        
        // Applied Program validation
        if (!formData.appliedProgram) {
            newErrors.appliedProgram = 'Applied program is required';
        }
        
        // Academic Records validation
        if (!formData.mathematics) {
            newErrors.mathematics = 'Mathematics grade is required';
        }
        
        if (!formData.science) {
            newErrors.science = 'Science grade is required';
        }
        
        if (!formData.english) {
            newErrors.english = 'English grade is required';
        }
        
        if (!formData.computerStudies) {
            newErrors.computerStudies = 'Computer Studies grade is required';
        }
        
        // Guardian Information validation
        if (!formData.guardianName) {
            newErrors.guardianName = 'Guardian name is required';
        }
        
        if (!formData.guardianNationalId) {
            newErrors.guardianNationalId = 'Guardian National ID is required';
        } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(formData.guardianNationalId)) {
            newErrors.guardianNationalId = 'Invalid Guardian National ID format';
        }
        
        if (!formData.guardianRelation) {
            newErrors.guardianRelation = 'Guardian relation is required';
        }
        
        if (!formData.guardianContactNumber) {
            newErrors.guardianContactNumber = 'Guardian contact number is required';
        } else if (!/^[0-9]{9,10}$/.test(formData.guardianContactNumber)) {
            newErrors.guardianContactNumber = 'Invalid guardian contact number format';
        }
        
        if (!formData.guardianEmail) {
            newErrors.guardianEmail = 'Guardian email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.guardianEmail)) {
            newErrors.guardianEmail = 'Invalid guardian email format';
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
        setErrors({});

        try {
            // Create a submission data structure that matches backend expectations
            const submissionData = {
                personalInfo: {
            
                    name: formData.name,
                    nationalId: formData.nationalId,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    address: formData.address
                },
                appliedProgram: {
                    program: formData.appliedProgram,
                    applicationDate: formData.applicationDate
                },
                academicRecords: {
                    mathematics: formData.mathematics,
                    science: formData.science,
                    english: formData.english,
                    computerStudies: formData.computerStudies
                },
                guardianInfo: {
                    name: formData.guardianName,
                    nationalId: formData.guardianNationalId,
                    relation: formData.guardianRelation,
                    contactNumber: formData.guardianContactNumber,
                    email: formData.guardianEmail
                },
                hostelRequired: formData.hostelRequired,
                status: 'Pending' // Default status
            };

            console.log("Submitting application data:", submissionData);

            const token = localStorage.getItem('token');

            // Send POST request to the API endpoint - remove auth token for public access
            const response = await fetch('http://localhost:8081/api/api/students/newapplications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    // No Authorization header for public access
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Set application as submitted and store the application ID
                setIsSubmitted(true);
                setApplicationId(data.data.applicantId || 'APP001'); // Use the ID from response or a default
                
                // If onSuccess callback is provided, call it with the application ID
                if (onSuccess) {
                    onSuccess(data.data.applicantId || 'APP001');
                }
            } else {
                setErrors({ general: data.message || "Failed to submit application" });
            }
        } catch (error) {
            setErrors({ general: error.message || "An error occurred while submitting the application" });
            console.error("Error submitting application:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleClose = () => {
        resetForm(); // Reset form data first
        if (onClose) {
            onClose();   // Then call the parent's onClose if provided
        }
    };

    // Success message content
    const successContent = {
        type: 'div',
        props: {
            style: {
                textAlign: 'center',
                padding: theme.spacing.lg
            },
            children: [
                {
                    type: 'h2',
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
                        style: {
                            marginBottom: theme.spacing.lg
                        },
                        children: ['Thank you for submitting your application. Your application has been received and is being processed.']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.md,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            {
                                type: 'p',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.sm
                                    },
                                    children: ['Your Application ID:']
                                }
                            },
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        color: theme.colors.primary
                                    },
                                    children: [applicationId]
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'p',
                    props: {
                        style: {
                            marginBottom: theme.spacing.lg
                        },
                        children: ['Please keep your Application ID for future reference. You will receive further communication regarding your application via email.']
                    }
                },
                {
                    type: Button,
                    props: {
                        onClick: () => {
                            handleClose();
                            setTimeout(refreshPage, 300);
                        },
                        children: 'Close'
                    }
                }
            ]
        }
    };

    // Form content
    const formContent = {
        type: 'form',
        props: {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md
            },
            children: [
                // Display general error message if present
                errors.general && {
                    type: 'div',
                    props: {
                        style: {
                            color: theme.colors.error,
                            backgroundColor: `${theme.colors.error}10`,
                            padding: theme.spacing.sm,
                            borderRadius: theme.borderRadius.sm,
                            marginBottom: theme.spacing.md
                        },
                        children: [errors.general]
                    }
                },
                // Personal Information Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Personal Information']
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Full Name',
                                    value: formData.name,
                                    placeholder: 'Enter your full name',
                                    onChange: (e) => setFormData({...formData, name: e.target.value}),
                                    error: errors.name
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'National ID',
                                    value: formData.nationalId,
                                    placeholder: 'Enter your National ID',
                                    onChange: (e) => setFormData({...formData, nationalId: e.target.value}),
                                    error: errors.nationalId
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Email',
                                    type: 'email',
                                    value: formData.email,
                                    placeholder: 'Enter your email address',
                                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                                    error: errors.email
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Phone',
                                    value: formData.phone,
                                    placeholder: 'Enter your phone number',
                                    onChange: (e) => setFormData({...formData, phone: e.target.value}),
                                    error: errors.phone
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Gender',
                                    value: formData.gender,
                                    placeholder: 'Select',
                                    onChange: (e) => setFormData({...formData, gender: e.target.value}),
                                    error: errors.gender,
                                    options: [
                                        { value: '', label: 'Select Gender' },
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Other', label: 'Other' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Date of Birth',
                                    type: 'date',
                                    value: formData.dateOfBirth,
                                    placeholder: 'Enter your date of birth',
                                    onChange: (e) => setFormData({...formData, dateOfBirth: e.target.value}),
                                    error: errors.dateOfBirth
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Address',
                                    value: formData.address,
                                    placeholder: 'Enter your address',
                                    onChange: (e) => setFormData({...formData, address: e.target.value}),
                                    error: errors.address,
                                }
                            }
                        ]
                    }
                },
                
                // Applied Degree Program Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Applied Degree Program']
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Applied Program',
                                    value: formData.appliedProgram,
                                    onChange: (e) => setFormData({...formData, appliedProgram: e.target.value}),
                                    error: errors.appliedProgram,
                                    options: [
                                        { value: '', label: 'Select Program' },
                                        { value: 'Computer Science', label: 'Computer Science' },
                                        { value: 'Information Systems', label: 'Information Systems' },
                                        { value: 'Software Engineering', label: 'Software Engineering' },
                                        { value: 'Data Science', label: 'Data Science' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Application Date',
                                    type: 'date',
                                    value: formData.applicationDate,
                                    onChange: (e) => setFormData({...formData, applicationDate: e.target.value}),
                                    error: errors.applicationDate,
                                    disabled: true
                                }
                            }
                        ]
                    }
                },

                // Academic Records Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Academic Records']
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Mathematics',
                                    value: formData.mathematics,
                                    onChange: (e) => setFormData({...formData, mathematics: e.target.value}),
                                    error: errors.mathematics,
                                    options: [
                                        { value: '', label: 'Select Grade' },
                                        { value: 'A', label: 'A' },
                                        { value: 'B', label: 'B' },
                                        { value: 'C', label: 'C' },
                                        { value: 'S', label: 'S' },

                                    ]
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Science',
                                    value: formData.science,
                                    onChange: (e) => setFormData({...formData, science: e.target.value}),
                                    error: errors.science,
                                    options: [
                                        { value: '', label: 'Select Grade' },
                                        { value: 'A', label: 'A' },
                                        { value: 'B', label: 'B' },
                                        { value: 'C', label: 'C' },
                                        { value: 'S', label: 'S' },
                                    ]
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'English',
                                    value: formData.english,
                                    onChange: (e) => setFormData({...formData, english: e.target.value}),
                                    error: errors.english,
                                    options: [
                                        { value: '', label: 'Select Grade' },
                                        { value: 'A', label: 'A' },
                                        { value: 'B', label: 'B' },
                                        { value: 'C', label: 'C' },
                                        { value: 'S', label: 'S' },
                                    ]
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Computer Studies',
                                    value: formData.computerStudies,
                                    onChange: (e) => setFormData({...formData, computerStudies: e.target.value}),
                                    error: errors.computerStudies,
                                    options: [
                                        { value: '', label: 'Select Grade' },
                                        { value: 'A', label: 'A' },
                                        { value: 'B', label: 'B' },
                                        { value: 'C', label: 'C' },
                                        { value: 'S', label: 'S' },
                                    ]
                                }
                            }
                        ]
                    }
                },
                    
                // Guardian Information Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Guardian Information']
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Guardian Name',
                                    value: formData.guardianName,
                                    placeholder: 'Enter guardian name',
                                    onChange: (e) => setFormData({...formData, guardianName: e.target.value}),
                                    error: errors.guardianName
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Guardian National ID',
                                    value: formData.guardianNationalId,
                                    placeholder: 'Enter guardian National ID',
                                    onChange: (e) => setFormData({...formData, guardianNationalId: e.target.value}),
                                    error: errors.guardianNationalId
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Relation',
                                    value: formData.guardianRelation,
                                    placeholder: 'Select Relation',
                                    onChange: (e) => setFormData({...formData, guardianRelation: e.target.value}),
                                    error: errors.guardianRelation,
                                    options: [
                                        { value: '', label: 'Select Relation' },
                                        { value: 'Father', label: 'Father' },
                                        { value: 'Mother', label: 'Mother' },
                                        { value: 'Guardian', label: 'Guardian' },
                                        { value: 'Other', label: 'Other' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Guardian Contact Number',
                                    value: formData.guardianContactNumber,
                                    placeholder: 'Enter guardian contact number',
                                    onChange: (e) => setFormData({...formData, guardianContactNumber: e.target.value}),
                                    error: errors.guardianContactNumber
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Guardian Email',
                                    type: 'email',
                                    value: formData.guardianEmail,
                                    placeholder: 'Enter guardian email address',
                                    onChange: (e) => setFormData({...formData, guardianEmail: e.target.value}),
                                    error: errors.guardianEmail
                                }
                            }
                        ]
                    }
                },
                
                // Hostel Required Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        borderBottom: `1px solid ${theme.colors.border}`,
                                        paddingBottom: theme.spacing.sm,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Hostel Required']
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Do you hope to apply for hostel?',
                                    value: formData.hostelRequired,
                                    placeholder: 'Yes/No',
                                    onChange: (e) => setFormData({...formData, hostelRequired: e.target.value}),
                                    error: errors.hostelRequired
                                }
                            },
                        ]
                    }
                },
                
                // Action buttons
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
                            onClose && {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    onClick: handleClose,
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
                                    children: loading ? 'Submitting...' : 'Submit Application'
                                }
                            }
                        ].filter(Boolean) // Filter out null values if onClose is not provided
                    }
                }
            ].filter(Boolean) // Filter out null values for errors if not present
        }
    };

    // Render logic for success state
    if (isSubmitted) {
        if (isStandalone) {
            // For standalone mode, return success content directly
            return successContent;
        } else {
            // For modal mode, wrap success content in modal
            return {
                type: Modal,
                props: {
                    isOpen: true,
                    onClose: handleClose,
                    title: 'Application Submitted Successfully',
                    children: [
                        {
                            type: Card,
                            props: {
                                children: [successContent]
                            }
                        }
                    ]
                }
            };
        }
    }

    // Render logic for form state
    if (isStandalone) {
        // For standalone mode, return form content directly
        return formContent;
    } else {
        // For modal mode, wrap form content in modal
        return {
            type: Modal,
            props: {
                isOpen: true,
                onClose: handleClose,
                title: 'Student Application Form',
                children: [formContent]
            }
        };
    }
};

window.StudentApplicationForm = StudentApplicationForm;