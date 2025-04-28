// components/teacher/courses/TeacherCourseDetail/Materials/MaterialUpload.js
const MaterialUpload = () => {
    const [formData, setFormData] = MiniReact.useState({
        title: '',
        description: '',
        file: null
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        style: { marginBottom: theme.spacing.md },
                        children: ['Upload Study Material']
                    }
                },
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
                                    onChange: (e) => setFormData({...formData, title: e.target.value})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: "Description",
                                    placeholder: "Write a description of your study material",
                                    multiline: true,
                                    value: formData.description,
                                    onChange: (e) => setFormData({...formData, description: e.target.value})
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    style: { marginTop: theme.spacing.md, marginBottom: theme.spacing.lg },
                                    variant: 'secondary',
                                    children: ['Add a file']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.sm,
                                        marginTop: theme.spacing.xl
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => {/* Handle cancel */},
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
    };
};

window.MaterialUpload = MaterialUpload;