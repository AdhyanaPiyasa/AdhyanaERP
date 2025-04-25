// components/Administrator/other/announcements/CreateAnnouncement.js
const CreateAnnouncement = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        content: '',
        targetAudience: {
            students: true,
            teachers: false,
            staff: false
        },
        scheduling: 'immediately',
        notifyByEmail: false
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
            title: 'Create Announcement',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Title',
                                    value: formData.title,
                                    onChange: (e) => setFormData({...formData, title: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Content',
                                    value: formData.content,
                                    onChange: (e) => setFormData({...formData, content: e.target.value}),
                                    multiline: true
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                children: ['Target audience']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { display: 'flex', gap: '16px' },
                                                children: [
                                                    {
                                                        type: 'label',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'input',
                                                                    props: {
                                                                        type: 'checkbox',
                                                                        checked: formData.targetAudience.students,
                                                                        onChange: (e) => setFormData({
                                                                            ...formData,
                                                                            targetAudience: {
                                                                                ...formData.targetAudience,
                                                                                students: e.target.checked
                                                                            }
                                                                        })
                                                                    }
                                                                },
                                                                ' Students'
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'label',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'input',
                                                                    props: {
                                                                        type: 'checkbox',
                                                                        checked: formData.targetAudience.teachers,
                                                                        onChange: (e) => setFormData({
                                                                            ...formData,
                                                                            targetAudience: {
                                                                                ...formData.targetAudience,
                                                                                teachers: e.target.checked
                                                                            }
                                                                        })
                                                                    }
                                                                },
                                                                ' Teachers'
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'label',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'input',
                                                                    props: {
                                                                        type: 'checkbox',
                                                                        checked: formData.targetAudience.staff,
                                                                        onChange: (e) => setFormData({
                                                                            ...formData,
                                                                            targetAudience: {
                                                                                ...formData.targetAudience,
                                                                                staff: e.target.checked
                                                                            }
                                                                        })
                                                                    }
                                                                },
                                                                ' Staff'
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                children: ['Scheduling']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { display: 'flex', gap: '16px' },
                                                children: [
                                                    {
                                                        type: 'label',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'input',
                                                                    props: {
                                                                        type: 'radio',
                                                                        name: 'scheduling',
                                                                        value: 'immediately',
                                                                        checked: formData.scheduling === 'immediately',
                                                                        onChange: (e) => setFormData({
                                                                            ...formData,
                                                                            scheduling: e.target.value
                                                                        })
                                                                    }
                                                                },
                                                                ' Send immediately'
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'label',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'input',
                                                                    props: {
                                                                        type: 'radio',
                                                                        name: 'scheduling',
                                                                        value: 'schedule',
                                                                        checked: formData.scheduling === 'schedule',
                                                                        onChange: (e) => setFormData({
                                                                            ...formData,
                                                                            scheduling: e.target.value
                                                                        })
                                                                    }
                                                                },
                                                                ' Schedule for later'
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'h4',
                                            props: {
                                                children: ['Notifications']
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'input',
                                                        props: {
                                                            type: 'checkbox',
                                                            checked: formData.notifyByEmail,
                                                            onChange: (e) => setFormData({
                                                                ...formData,
                                                                notifyByEmail: e.target.checked
                                                            })
                                                        }
                                                    },
                                                    ' Notify recipients by email'
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' },
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
                                                children: 'Create Announcement'
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

window.CreateAnnouncement = CreateAnnouncement;