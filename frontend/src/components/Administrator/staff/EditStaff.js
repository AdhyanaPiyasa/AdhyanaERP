// components/Admin/other/Staff/EditStaff.js
const EditStaff = ({ staff, onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        name: staff.name,
        position: staff.position,
        department: staff.department,
        email: staff.email,
        phone: staff.phone
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        onClose();
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Edit Staff Member',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
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
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                children: 'Save Changes'
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

window.EditStaff = EditStaff;