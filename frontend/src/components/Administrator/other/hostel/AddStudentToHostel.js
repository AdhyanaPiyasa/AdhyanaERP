// components/Administrator/other/hostel/AddStudentToHostel.js
const AddStudentToHostel = ({ onClose }) => {
    const [formData, setFormData] = MiniReact.useState({
        blockName: '',
        roomNumber: '',
        studentId: '',
        assignDate: new Date().toISOString().split('T')[0] // Default to current date
    });

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted:', formData);
        onClose();
    };

    const styles = {
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
        },
        sectionTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.md
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Admit Student to Hostel',
            children: [
                {
                    type: 'form',
                    props: {
                        style: styles.form,
                        children: [
                            {
                                type: Select,
                                props: {
                                    label: 'Block Name',
                                    value: formData.blockName,
                                    onChange: (e) => setFormData({...formData, blockName: e.target.value}),
                                    options: [
                                        { value: '', label: 'Select a block' },
                                        { value: 'Block G', label: 'Block G' },
                                        { value: 'Block H', label: 'Block H' },
                                        { value: 'Block J', label: 'Block J' },
                                        { value: 'Block k', label: 'Block k' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Room Number',
                                    type: 'number',
                                    value: formData.roomNumber,
                                    onChange: (e) => setFormData({...formData, roomNumber: e.target.value}),
                                    placeholder: 'Enter room number'
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Student ID',
                                    value: formData.studentId,
                                    onChange: (e) => setFormData({...formData, studentId: e.target.value}),
                                    placeholder: 'Enter student ID'
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Assign Date',
                                    type: 'date',
                                    value: formData.assignDate,
                                    onChange: (e) => setFormData({...formData, assignDate: e.target.value})
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.buttonsContainer,
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
                                                children: 'Add Student'
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

window.AddStudentToHostel = AddStudentToHostel;