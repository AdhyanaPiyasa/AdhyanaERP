// components/Admin/other/Staff/AddStaff.js
const AddStaff = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = MiniReact.useState({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        profilePicture: null
    });

    const [imagePreview, setImagePreview] = MiniReact.useState(null);
    const [imageError, setImageError] = MiniReact.useState('');
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    // Helper function for page refresh
    const refreshPage = () => {
        window.location.reload();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setImageError('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size should be less than 5MB');
                return;
            }

            setImageError('');
            setFormData({ ...formData, profilePicture: file });

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        // Validate form data
        if (!formData.name || !formData.position || !formData.department || !formData.email) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            console.log('Submitting staff data:', formData);

            // Send POST request to the API endpoint
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/admin/staff/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Note: Don't set Content-Type header when sending FormData
                },
                body: submitData
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
                setError(data.message || "Failed to add staff member");
            }
        } catch (error) {
            setError(error.message || "An error occurred while adding staff member");
            console.error("Error adding staff member:", error);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        imageUploadContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg
        },
        previewContainer: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: `2px dashed ${theme.colors.border}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: theme.colors.background
        },
        previewImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        uploadButton: {
            position: 'relative',
            overflow: 'hidden'
        },
        fileInput: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
        },
        errorText: {
            color: theme.colors.error,
            fontSize: theme.typography.caption.fontSize,
            marginTop: theme.spacing.xs
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
        },
        buttonContainer: {
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end',
            marginTop: theme.spacing.lg
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Add Staff Member',
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
                        style: styles.formContainer,
                        children: [
                            // Image Upload Section
                            {
                                type: 'div',
                                props: {
                                    style: styles.imageUploadContainer,
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.previewContainer,
                                                children: [
                                                    imagePreview ? {
                                                        type: 'img',
                                                        props: {
                                                            src: imagePreview,
                                                            alt: 'Profile Preview',
                                                            style: styles.previewImage
                                                        }
                                                    } : {
                                                        type: 'span',
                                                        props: {
                                                            children: ['Upload Photo']
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.uploadButton,
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            children: 'Choose Profile Picture'
                                                        }
                                                    },
                                                    {
                                                        type: 'input',
                                                        props: {
                                                            type: 'file',
                                                            accept: 'image/*',
                                                            style: styles.fileInput,
                                                            onChange: handleImageChange
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        imageError && {
                                            type: 'div',
                                            props: {
                                                style: styles.errorText,
                                                children: [imageError]
                                            }
                                        }
                                    ]
                                }
                            },
                            // Form Fields
                            {
                                type: TextField,
                                props: {
                                    label: 'Name',
                                    value: formData.name,
                                    required: true,
                                    placeholder: 'Enter full name',
                                    onChange: (e) => setFormData({...formData, name: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Position',
                                    value: formData.position,
                                    required: true,
                                    placeholder: 'Enter staff position',
                                    onChange: (e) => setFormData({...formData, position: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Department',
                                    value: formData.department,
                                    required: true,
                                    placeholder: 'Enter department',
                                    onChange: (e) => setFormData({...formData, department: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Email',
                                    value: formData.email,
                                    required: true,
                                    placeholder: 'Enter email address',
                                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                                    type: 'email'
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Phone',
                                    value: formData.phone,
                                    placeholder: 'Enter phone number',
                                    onChange: (e) => setFormData({...formData, phone: e.target.value})
                                }
                            },
                            // Action Buttons
                            {
                                type: 'div',
                                props: {
                                    style: styles.buttonContainer,
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
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleSubmit();
                                                },
                                                disabled: loading,
                                                children: loading ? 'Adding...' : 'Add Staff'
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

window.AddStaff = AddStaff;