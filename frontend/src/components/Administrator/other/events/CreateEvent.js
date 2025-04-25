// components/Administrator/other/events/CreateEvent.js
const CreateEvent = ({ onClose, onSave }) => {
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        date: '',
        description: ''
    });

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Create Event',
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Event Name',
                                    value: formData.title,
                                    onChange: (e) => setFormData({...formData, title: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Date',
                                    type: 'date',
                                    value: formData.date,
                                    onChange: (e) => setFormData({...formData, date: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Description',
                                    value: formData.description,
                                    onChange: (e) => setFormData({...formData, description: e.target.value}),
                                    multiline: true
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '10px',
                                        marginTop: '20px'
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
                                                children: 'Create Event'
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

window.CreateEvent = CreateEvent;