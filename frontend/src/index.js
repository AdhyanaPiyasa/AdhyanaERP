// src/index.js
const AppState = {
    currentUser: null,
    isLoading: false,
    error: null,
    notifications: [],
    isAuthenticated: false,
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null
    // isAuthenticated: true,
    // token: 'dev-token',
    // userRole: 'teacher'

};
const initializeApp = async () => {
    try {
        AppState.isLoading = true;
        MiniReact.rerender();

        // Initialize navigation
        navigation.init();

        // Set up error boundaries
        window.onerror = handleError;
        window.onunhandledrejection = (event) => handleError(event.reason);

        // Check authentication status
        await checkAuthStatus();

        // Initial render
        const root = document.getElementById('root');
        if (!root) throw new Error('Root element not found');

        MiniReact.currentComponent = {
            hooks: [],
            hookIndex: 0,
            element: App,
            container: root
        };

        MiniReact.render(App(), root);

    } catch (error) {
        handleError(error);
    } finally {
        AppState.isLoading = false;
        MiniReact.rerender();
    }
};
const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // const token = 'dev-token';
    // const userRole = 'teacher';


    if (token && userRole) {
        AppState.isAuthenticated = true;
        AppState.token = token;
        AppState.userRole = userRole;
        
        // //You could verify token with backend here if needed
        // const isValidToken = await verifyToken(token);
        // if (!isValidToken) handleLogout();

        // Set user data
        AppState.currentUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: AppState.userRole
        };

        // Set navigation role
        navigation.setRole(userRole);
    } else {
        AppState.isAuthenticated = false;
    }
};

const handleError = (error) => {
    console.error('Application Error:', error);
    AppState.error = error.message;
    AppState.isLoading = false;
    MiniReact.rerender();
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    AppState.isAuthenticated = false;
    AppState.currentUser = null;
    AppState.token = null;
    AppState.userRole = null;
    MiniReact.rerender();
};

// Handle auth token changes
window.addEventListener('storage', (event) => {
    if (event.key === 'token' && !event.newValue) {
        handleLogout();
    }
});

// Make handleLogout available globally
 window.handleLogout = handleLogout;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
