// components/teacher/courses/TeacherCourseDetail/Materials/MaterialList.js
const MaterialList = () => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        description: '',
        file: null
    });

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        setShowAddModal(false);
    };

    const renderAddModal = () => ({
        type: Modal,
        props: {
            isOpen: showAddModal,
            onClose: () => setShowAddModal(false),
            title: "Add Study Material",
            children: [
                {
                    type: 'form',
                    props: {
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: "Title",
                                    placeholder: "Enter the title of your study material",
                                    value: formData.title,
                                    onChange: (e) => handleChange('title', e.target.value)
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: "Description",
                                    placeholder: "Write a description of your study material",
                                    multiline: true,
                                    value: formData.description,
                                    onChange: (e) => handleChange('description', e.target.value)
                                }
                            },
                            
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.sm,
                                        marginTop: theme.spacing.lg
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => setShowAddModal(false),
                                                children: ['Cancel']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: handleSubmit,
                                                children: ['Submit']
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
    });

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Study Materials']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowAddModal(true),
                                    children: ['Add Material']
                                }
                            }
                        ]
                    }
                },
                showAddModal && renderAddModal()
            ]
        }
    };
};

window.MaterialList = MaterialList;