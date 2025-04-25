// src/services/authService.js

const authService = {
    async login(username, password) {
        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');

        Object.assign(AppState, {
            isAuthenticated: false,
            token: null,
            userRole: null,
            currentUser: null
        });

        MiniReact.rerender();
        navigation.navigate('login');
    },

    async verifyToken() {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const response = await fetch('http://localhost:8081/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            return data.success;
        } catch {
            return false;
        }
    }
};

// Explicitly attach to window
window.authService = authService;
console.log('Auth service initialized and available globally');