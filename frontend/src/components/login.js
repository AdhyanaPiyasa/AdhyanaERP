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
        setFormState({
            ...formState,
            [field]: e.target.value,
            error: '' // Clear error when user types
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formState.isLoading) return;

        const { username, password } = formState;

        // Basic validation
        if (!username || !password) {
            setFormState({
                ...formState,
                error: 'Please enter both username and password'
            });
            return;
        }

        try {
            setFormState({
                ...formState,
                isLoading: true,
                error: ''
            });

            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.success && data.data) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('userRole', data.data.role);
                
                Object.assign(AppState, {
                    isAuthenticated: true,
                    token: data.data.token,
                    userRole: data.data.role
                });

                // Set navigation role before rerender
                navigation.setRole(data.data.role);
                
                MiniReact.rerender();
            }
        } catch (err) {
            console.error('Login error:', err);
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