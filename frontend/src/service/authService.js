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
                // Use message from API response
                throw new Error(data.message || `Login failed with status: ${response.status}`);
            }

            if (data.success && data.data) {
                console.log("Login successful, received data:", data.data); 
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('userRole', data.data.role);
                localStorage.setItem('userId', data.data.userId); 

                // Assuming AppState exists and is globally accessible
                if (typeof AppState !== 'undefined') {
                     Object.assign(AppState, {
                        isAuthenticated: true,
                        token: data.data.token,
                        userRole: data.data.role,
                        userId: data.data.userId
                    });
                     console.log("AppState updated:", AppState);
                } else {
                    console.warn("AppState is not defined. Cannot update global state.");
                }

            } else {
                 // Handle cases where success is true but data is missing, or success is false
                 throw new Error(data.message || 'Login failed: No data received');
            }

            return data; // Return the full response data
        } catch (error) {
            console.error('Login error in authService:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');

         if (typeof AppState !== 'undefined') {
            Object.assign(AppState, {
                isAuthenticated: false,
                token: null,
                userRole: null,
                userId: null,
                currentUser: null
            });
            console.log("AppState after logout:", AppState);
         } else {
              console.warn("AppState is not defined. Cannot update global state.");
         }


        if (typeof MiniReact !== 'undefined' && typeof navigation !== 'undefined') {
            MiniReact.rerender();
            navigation.navigate('login');
        } else {
             console.warn("MiniReact or navigation is not defined. Cannot rerender or navigate.");
        }
    },

    async verifyToken() {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const response = await fetch('http://localhost:8081/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                     'Accept': 'application/json'
                }
            });

            // Check if response is ok before parsing JSON
             if (!response.ok) {
                 console.error(`Token verification failed with status: ${response.status}`);
                 // If unauthorized, potentially logout the user
                 if (response.status === 401) {
                     this.logout(); 
                 }
                 return false;
             }

            const data = await response.json();
            // Additionally store role/userId from verification if needed
            if (data.success && data.data) {
                 localStorage.setItem('userRole', data.data.role);
                 localStorage.setItem('userId', data.data.userId);
                  if (typeof AppState !== 'undefined') {
                       Object.assign(AppState, {
                            isAuthenticated: true,
                            token: data.data.token,
                            userRole: data.data.role,
                            userId: data.data.userId
                       });
                  }
            }
            return data.success;
        } catch (error) {
             console.error('Error verifying token:', error);
             // Potentially logout on network error etc.
             // this.logout();
            return false;
        }
    },

     // Helper to get current user info from localStorage
     getCurrentUser() {
        if (typeof AppState !== 'undefined' && AppState.isAuthenticated) {
            return {
                token: AppState.token,
                role: AppState.userRole,
                userId: AppState.userId
            };
        }
        // Fallback to localStorage if AppState isn't initialized yet
         const token = localStorage.getItem('token');
         if (token) {
             return {
                 token: token,
                 role: localStorage.getItem('userRole'),
                 userId: localStorage.getItem('userId')
             };
         }
         return null;
     }
};

// Explicitly attach to window if needed for global access
window.authService = authService;
console.log('Auth service initialized (with userId handling) and available globally');

// Initialize AppState if it doesn't exist (basic example)
if (typeof AppState === 'undefined') {
    console.log("Initializing global AppState");
    window.AppState = {
         isAuthenticated: !!localStorage.getItem('token'),
         token: localStorage.getItem('token'),
         userRole: localStorage.getItem('userRole'),
         userId: localStorage.getItem('userId'),
         currentUser: null 
    };
}