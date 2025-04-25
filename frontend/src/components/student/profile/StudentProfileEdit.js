// components/profile/ProfileEdit.js
const StudentProfileEdit = ({ profileData, onCancel, onSave }) => {
    const [formData, setFormData] = MiniReact.useState(profileData);
    // const [formData, setFormData] = MiniReact.useState({
    //     email: profileData?.email || '',
    //     mobileNumber: profileData?.mobileNumber || '',
    //     state: profileData?.state || ''
    // });
    // const [isLoading, setIsLoading] = MiniReact.useState(false);
    // const [error, setError] = MiniReact.useState('');
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

    // const handleSubmit = async () => {
    //     if (isLoading) return;
    //     setIsLoading(true);
    //     setError('');

    //     // Basic validation using the existing validators utility
    //     if (!validators.email(formData.email)) {
    //         setError('Please enter a valid email');
    //         setIsLoading(false);
    //         return;
    //     }

    //     if (!validators.phone(formData.mobileNumber)) {
    //         setError('Please enter a valid mobile number');
    //         setIsLoading(false);
    //         return;
    //     }

    //     try {
    //         // Mock API call - replace with actual implementation
    //         const mockResponse = {
    //             ok: true,
    //             json: () => Promise.resolve(formData)
    //         };

    //         const response = mockResponse;
    //         const data = await response.json();
            
    //         if (response.ok) {
    //             onSave(data);
    //         } else {
    //             setError('Failed to update profile');
    //         }
    //     } catch (err) {
    //         setError('An error occurred while updating profile');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return {
        type: 'div',
        props: {
            style: styles.form,
            children: [
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

// return {
//     type: Card,
//     props: {
//         children: [
//             {
//                 type: 'h2',
//                 props: {
//                     style: {
//                         fontSize: theme.typography.h2.fontSize,
//                         marginBottom: theme.spacing.lg
//                     },
//                     children: ['Edit Profile']
//                 }
//             },
//             error && {
//                 type: 'div',
//                 props: {
//                     style: {
//                         color: theme.colors.error,
//                         marginBottom: theme.spacing.md,
//                         padding: theme.spacing.sm,
//                         backgroundColor: `${theme.colors.error}10`,
//                         borderRadius: theme.borderRadius.sm
//                     },
//                     children: [error]
//                 }
//             },
//             {
//                 type: TextField,
//                 props: {
//                     label: 'Email',
//                     value: formData.email,
//                     type: 'email',
//                     disabled: isLoading,
//                     onChange: (e) => setFormData({
//                         ...formData,
//                         email: e.target.value
//                     })
//                 }
//             },
//             {
//                 type: TextField,
//                 props: {
//                     label: 'Mobile Number',
//                     value: formData.mobileNumber,
//                     disabled: isLoading,
//                     onChange: (e) => setFormData({
//                         ...formData,
//                         mobileNumber: e.target.value
//                     })
//                 }
//             },
//             {
//                 type: TextField,
//                 props: {
//                     label: 'State',
//                     value: formData.state,
//                     disabled: isLoading,
//                     onChange: (e) => setFormData({
//                         ...formData,
//                         state: e.target.value
//                     })
//                 }
//             },
//             {
//                 type: 'div',
//                 props: {
//                     style: {
//                         display: 'flex',
//                         justifyContent: 'flex-end',
//                         gap: theme.spacing.md,
//                         marginTop: theme.spacing.xl
//                     },
//                     children: [
//                         {
//                             type: Button,
//                             props: {
//                                 variant: 'secondary',
//                                 onClick: onCancel,
//                                 disabled: isLoading,
//                                 children: 'Cancel'
//                             }
//                         },
//                         {
//                             type: Button,
//                             props: {
//                                 onClick: handleSubmit,
//                                 disabled: isLoading,
//                                 children: [
//                                     isLoading && {
//                                         type: LoadingSpinner,
//                                         props: {
//                                             size: 'small',
//                                             color: 'white'
//                                         }
//                                     },
//                                     isLoading ? 'Saving...' : 'Save Changes'
//                                 ]
//                             }
//                         }
//                     ]
//                 }
//             }
//         ].filter(Boolean)
//     }
// };
// };
window.StudentProfileEdit = StudentProfileEdit;


