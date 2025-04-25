// components/Admin/other/Staff/AddStaff.js
const AddStaff = ({ onClose }) => {
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

    const handleSubmit = () => {
        // Create FormData for file upload
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        console.log('Form submitted:', formData);
        onClose();
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
                                    onChange: (e) => setFormData({...formData, name: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Position',
                                    value: formData.position,
                                    onChange: (e) => setFormData({...formData, position: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Department',
                                    value: formData.department,
                                    onChange: (e) => setFormData({...formData, department: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Email',
                                    value: formData.email,
                                    onChange: (e) => setFormData({...formData, email: e.target.value}),
                                    type: 'email'
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Phone',
                                    value: formData.phone,
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
                                                onClick: onClose,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                children: 'Add Staff'
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