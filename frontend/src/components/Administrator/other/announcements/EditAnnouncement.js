// components/Administrator/other/announcements/EditAnnouncement.js
const EditAnnouncement = ({ announcement, onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: announcement.title,
        content: announcement.content,
        targetAudience: {
            students: announcement.targetAudience.includes('Students'),
            teachers: announcement.targetAudience.includes('Teachers'),
            staff: announcement.targetAudience.includes('Staff')
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
            title: 'Edit Announcement',
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

window.EditAnnouncement = EditAnnouncement;