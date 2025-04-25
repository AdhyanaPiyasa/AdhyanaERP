// components/student/other/HostelEdit.js
const HostelEdit = ({ block, onClose, onSave }) => {
    const [formData, setFormData] = MiniReact.useState({
        rooms: block.rooms,
        occupancy: block.occupancy,
        vacancy: block.vacancy,
        gender: block.gender,
        assistant: block.assistant,
        facilities: {
            wifi: block.facilities.wifi,
            kitchen: block.facilities.kitchen,
            laundry: block.facilities.laundry,
            ac: block.facilities.ac,
            studyArea: block.facilities.studyArea
        }
    });

    const handleFacilityChange = (facility) => {
        setFormData({
            ...formData,
            facilities: {
                ...formData.facilities,
                [facility]: !formData.facilities[facility]
            }
        });
    };

    const handleSubmit = () => {
        onSave(block.name, formData);
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
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm
        },
        facilityItem: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.sm
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
            title: `Edit ${block.name}`,
            children: [
                {
                    type: 'form',
                    props: {
                        style: styles.form,
                        onSubmit: (e) => {
                            e.preventDefault();
                            handleSubmit();
                        },
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: 'Number of Rooms',
                                    type: 'number',
                                    value: formData.rooms,
                                    onChange: (e) => setFormData({...formData, rooms: parseInt(e.target.value, 10) || 0})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Occupancy',
                                    type: 'number',
                                    value: formData.occupancy,
                                    onChange: (e) => setFormData({...formData, occupancy: parseInt(e.target.value, 10) || 0})
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Vacancy',
                                    type: 'number',
                                    value: formData.vacancy,
                                    onChange: (e) => setFormData({...formData, vacancy: parseInt(e.target.value, 10) || 0})
                                }
                            },
                            {
                                type: Select,
                                props: {
                                    label: 'Gender',
                                    value: formData.gender,
                                    onChange: (e) => setFormData({...formData, gender: e.target.value}),
                                    options: [
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' }
                                    ]
                                }
                            },
                            {
                                type: TextField,
                                props: {
                                    label: 'Assistant',
                                    value: formData.assistant,
                                    onChange: (e) => setFormData({...formData, assistant: e.target.value})
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.sectionTitle,
                                    children: ['Facilities']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.facilityItem,
                                    children: [
                                        {
                                            type: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: formData.facilities.wifi,
                                                onChange: () => handleFacilityChange('wifi')
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: ['WiFi']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.facilityItem,
                                    children: [
                                        {
                                            type: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: formData.facilities.kitchen,
                                                onChange: () => handleFacilityChange('kitchen')
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: ['Kitchen']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.facilityItem,
                                    children: [
                                        {
                                            type: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: formData.facilities.laundry,
                                                onChange: () => handleFacilityChange('laundry')
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: ['Laundry']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.facilityItem,
                                    children: [
                                        {
                                            type: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: formData.facilities.ac,
                                                onChange: () => handleFacilityChange('ac')
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: ['AC']
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.facilityItem,
                                    children: [
                                        {
                                            type: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: formData.facilities.studyArea,
                                                onChange: () => handleFacilityChange('studyArea')
                                            }
                                        },
                                        {
                                            type: 'label',
                                            props: {
                                                children: ['Study Area']
                                            }
                                        }
                                    ]
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
                                                type: 'submit',
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

window.HostelEdit = HostelEdit;