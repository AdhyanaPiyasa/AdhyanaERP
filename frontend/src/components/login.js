// src/components/login.js

const Login = () => {
    const [formState, setFormState] = MiniReact.useState({
        username: '',
        password: '',
        error: '',
        isLoading: false
    });

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
        },
        formContainer: {
            width: '100%',
            maxWidth: '400px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '0.5rem'
        },
        subtitle: {
            fontSize: '14px',
            color: '#666'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        error: {
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '0.5rem'
        },
        button: {
            backgroundColor: '#0066CC',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            width: '100%'
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed'
        },
        input: {
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box'
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: e.target.value,
            error: '' 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formState.isLoading) return;

        const { username, password } = formState;

        // Basic validation
        if (!username || !password) {
            setFormState(prevState => ({
                ...prevState,
                error: 'Please enter both username and password'
            }));
            return;
        }

        try {
            setFormState(prevState => ({
                ...prevState,
                isLoading: true,
                error: ''
            }));

            const responseData = await authService.login(username, password);

            if (typeof AppState !== 'undefined' && AppState.isAuthenticated) {
                console.log('Login component: AppState updated with user:', AppState.userId, AppState.userRole);

                // Set navigation role before rerender 
                if (typeof navigation !== 'undefined') {
                    navigation.setRole(AppState.userRole); 
                } else {
                    console.warn("Navigation object not found.");
                }

                // Trigger rerender 
                if (typeof MiniReact !== 'undefined') {
                     MiniReact.rerender(); 
                } else {
                     console.warn("MiniReact object not found.");
                }

            } else {
                 console.error("Login component: Login succeeded but AppState not updated or auth failed.");
                 // Use the message from the response if available
                 const errorMessage = responseData?.message || 'Login failed unexpectedly after API call.';
                 setFormState(prevState => ({
                    ...prevState,
                    error: errorMessage,
                    isLoading: false
                }));
            }

        } catch (err) {
            console.error('Login component error:', err);
            // Display the error message
            setFormState(prevState => ({
                ...prevState,
                error: err.message || 'An error occurred during login',
                isLoading: false
            }));
        }
    };

    const { username, password, error, isLoading } = formState;

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [{
                type: 'div',
                props: {
                    style: styles.formContainer,
                    children: [
                        {
                            type: 'div',
                            props: {
                                style: styles.header,
                                children: [
                                    {
                                        type: 'h1',
                                        props: {
                                            style: styles.title,
                                            children: ['ADHYANA']
                                        }
                                    },
                                    {
                                        type: 'p',
                                        props: {
                                            style: styles.subtitle,
                                            children: ['Sign in to your account']
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            type: 'form',
                            props: {
                                onSubmit: handleSubmit,
                                style: styles.form,
                                children: [
                                    {
                                        type: 'input',
                                        props: {
                                            type: 'text',
                                            placeholder: 'Username',
                                            value: username,
                                            disabled: isLoading,
                                            required: true,
                                            style: styles.input,
                                            onChange: handleInputChange('username')
                                        }
                                    },
                                    {
                                        type: 'input',
                                        props: {
                                            type: 'password',
                                            placeholder: 'Password',
                                            value: password,
                                            disabled: isLoading,
                                            required: true,
                                            style: styles.input,
                                            onChange: handleInputChange('password')
                                        }
                                    },
                                    error && {
                                        type: 'div',
                                        props: {
                                            style: styles.error,
                                            children: [error]
                                        }
                                    },
                                    {
                                        type: 'button',
                                        props: {
                                            type: 'submit',
                                            disabled: isLoading,
                                            style: {
                                                ...styles.button,
                                                ...(isLoading ? styles.buttonDisabled : {})
                                            },
                                            children: [isLoading ? 'Signing in...' : 'Sign in']
                                        }
                                    }
                                ].filter(Boolean)
                            }
                        }
                    ]
                }
            }]
        }
    };
};

window.Login = Login;