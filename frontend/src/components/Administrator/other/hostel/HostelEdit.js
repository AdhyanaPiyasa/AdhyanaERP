// components/Administrator/other/hostel/HostelEdit.js
const HostelEdit = ({ hostelId, hostelName, initialData, onClose, onSave }) => {
    // Initialize formData based on initialData prop matching backend model
    const [formData, setFormData] = MiniReact.useState({
        name: initialData?.name || '',
        capacity: initialData?.capacity || 0,
        // occupancy is managed by backend based on assignments
        gender: initialData?.gender || 'Mixed', // Default or fetch existing
        assistantName: initialData?.assistantName || '', // Use assistantName
        wifi: initialData?.wifi || false,
        kitchen: initialData?.kitchen || false,
        laundry: initialData?.laundry || false,
        studyArea: initialData?.studyArea || false, // Use studyArea
        // Removed rooms, vacancy, ac
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Construct payload matching backend requirements
        const payload = {
             name: formData.name,
             capacity: parseInt(formData.capacity, 10) || 0,
             gender: formData.gender,
             assistantName: formData.assistantName,
             wifi: formData.wifi,
             kitchen: formData.kitchen,
             laundry: formData.laundry,
             studyArea: formData.studyArea
             // Do not send occupancy - backend calculates this
        };
        onSave(hostelId, payload); // Pass ID and payload to parent handler
        // Parent (AdminHostelInfo) handles API call and closing modal
    };

    // --- Styles (keep existing styles or adapt) ---
    const styles = { /* ... existing styles ... */
        form: { display: 'flex', flexDirection: 'column', gap: theme.spacing.md },
        sectionTitle: { fontSize: theme.typography.h3.fontSize, fontWeight: 'bold', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
        facilityItem: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
        buttonsContainer: { display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.xl }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: `Edit Hostel: ${hostelName} (ID: ${hostelId})`,
            children: [
                {
                    type: 'form',
                    props: {
                        style: styles.form,
                        onSubmit: handleSubmit,
                        children: [
                            { // Edit Name
                                type: TextField,
                                props: {
                                    label: 'Hostel Name',
                                    value: formData.name,
                                    onChange: (e) => handleInputChange('name', e.target.value)
                                }
                            },
                            { // Edit Capacity instead of Rooms
                                type: TextField,
                                props: {
                                    label: 'Capacity', // Changed from Rooms
                                    type: 'number',
                                    value: formData.capacity,
                                    onChange: (e) => handleInputChange('capacity', e.target.value)
                                }
                            },
                            // Occupancy and Vacancy are removed - managed by backend
                            { // Edit Gender
                                type: Select,
                                props: {
                                    label: 'Gender',
                                    value: formData.gender,
                                    onChange: (e) => handleInputChange('gender', e.target.value),
                                    options: [
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Mixed', label: 'Mixed' } // Add Mixed option
                                    ]
                                }
                            },
                            { // Edit Assistant Name
                                type: TextField,
                                props: {
                                    label: 'Assistant Name', // Use assistantName
                                    value: formData.assistantName,
                                    onChange: (e) => handleInputChange('assistantName', e.target.value)
                                }
                            },
                            { type: 'div', props: { style: styles.sectionTitle, children: ['Facilities'] } },
                            // Facilities Checkboxes (using backend field names)
                            {
                                type: 'div', props: { style: styles.facilityItem, children: [
                                    { type: 'input', props: { type: 'checkbox', checked: formData.wifi, onChange: () => handleCheckboxChange('wifi') } },
                                    { type: 'label', props: { children: ['WiFi'] } }
                                ] }
                            },
                            {
                                type: 'div', props: { style: styles.facilityItem, children: [
                                    { type: 'input', props: { type: 'checkbox', checked: formData.kitchen, onChange: () => handleCheckboxChange('kitchen') } },
                                    { type: 'label', props: { children: ['Kitchen'] } }
                                ] }
                            },
                            {
                                type: 'div', props: { style: styles.facilityItem, children: [
                                    { type: 'input', props: { type: 'checkbox', checked: formData.laundry, onChange: () => handleCheckboxChange('laundry') } },
                                    { type: 'label', props: { children: ['Laundry'] } }
                                ] }
                            },
                            {
                                type: 'div', props: { style: styles.facilityItem, children: [
                                    { type: 'input', props: { type: 'checkbox', checked: formData.studyArea, onChange: () => handleCheckboxChange('studyArea') } }, // Use studyArea
                                    { type: 'label', props: { children: ['Study Area'] } }
                                ] }
                            },
                             // Removed AC checkbox
                            { // Buttons
                                type: 'div', props: { style: styles.buttonsContainer, children: [
                                    { type: Button, props: { variant: 'secondary', onClick: onClose, children: 'Cancel' } },
                                    { type: Button, props: { type: 'submit', children: 'Save Changes' } }
                                ] }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.HostelEdit = HostelEdit;