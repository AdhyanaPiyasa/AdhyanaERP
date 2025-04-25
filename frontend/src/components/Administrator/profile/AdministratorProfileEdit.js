// components/profile/ProfileEdit.js
const AdministratorProfileEdit = ({ profileData, onCancel, onSave }) => {
    const [formData, setFormData] = MiniReact.useState(profileData);

    const styles = {
        form: {
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.xl,
            boxShadow: theme.shadows.sm
        },
        buttons: {
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'flex-end',
            marginTop: theme.spacing.xl
        }
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return {
        type: 'div',
        props: {
            style: styles.form,
            children: [
                {
                    type: TextField,
                    props: {
                        label: 'Name',
                        value: formData.name,
                        onChange: (e) => setFormData({ ...formData, name: e.target.value })
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: 'Email',
                        value: formData.email,
                        type: 'email',
                        onChange: (e) => setFormData({ ...formData, email: e.target.value })
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: 'Mobile Number',
                        value: formData.mobileNumber,
                        onChange: (e) => setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: 'State',
                        value: formData.state,
                        onChange: (e) => setFormData({ ...formData, state: e.target.value })
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.buttons,
                        children: [
                            {
                                type: Button,
                                props: {
                                    onClick: onCancel,
                                    variant: 'secondary',
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
    };
};
window.AdministratorProfileEdit = AdministratorProfileEdit;
