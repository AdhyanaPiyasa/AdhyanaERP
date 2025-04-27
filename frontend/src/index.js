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
    // userRole: 'administrator'
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

        // Clear any existing content
        root.innerHTML = '';

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
    // const userRole = 'administrator';

    if (token && userRole) {
        // Verify token first
        try {
            const isValid = await authService.verifyToken();
            if (!isValid) {
                authService.logout();
                return;
            }

            AppState.isAuthenticated = true;
            AppState.token = token;
            AppState.userRole = userRole;
            
            AppState.currentUser = {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: userRole
            };

            navigation.setRole(userRole);
        } catch (error) {
            console.error('Token verification failed:', error);
            authService.logout();
        }
    } else {
        AppState.isAuthenticated = false;
        AppState.token = null;
        AppState.userRole = null;
        AppState.currentUser = null;
    }
};

const handleLogout = () => {
    authService.logout();
};

const handleError = (error) => {
    console.error('Application Error:', error);
    AppState.error = error.message;
    AppState.isLoading = false;
    MiniReact.rerender();
};

// Handle storage changes
window.addEventListener('storage', (event) => {
    if (event.key === 'token' || event.key === 'userRole') {
        checkAuthStatus();
    }
});
// Make handleLogout available globally
 window.handleLogout = handleLogout;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);


//////////////////////////////////////


// // src/index.js
// const AppState = {
//     currentUser: null,
//     isLoading: false,
//     error: null,
//     notifications: [],
//     // isAuthenticated: false,
//     // token: localStorage.getItem('token') || null,
//     // userRole: localStorage.getItem('userRole') || null
//     isAuthenticated: true,
//     token: 'dev-token',
//     userRole: 'admin'

// };
// const initializeApp = async () => {
//     try {
//         AppState.isLoading = true;
//         MiniReact.rerender();

//         // Initialize navigation
//         navigation.init();

//         // Set up error boundaries
//         window.onerror = handleError;
//         window.onunhandledrejection = (event) => handleError(event.reason);

//         // Check authentication status
//         await checkAuthStatus();

//         // Initial render
//         const root = document.getElementById('root');
//         if (!root) throw new Error('Root element not found');

//         MiniReact.currentComponent = {
//             hooks: [],
//             hookIndex: 0,
//             element: App,
//             container: root
//         };

//         MiniReact.render(App(), root);

//     } catch (error) {
//         handleError(error);
//     } finally {
//         AppState.isLoading = false;
//         MiniReact.rerender();
//     }
// };
// const checkAuthStatus = async () => {
//     // const token = localStorage.getItem('token');
//     // const userRole = localStorage.getItem('userRole');

//     const token = 'dev-token';
//     const userRole = 'admin';


//     if (token && userRole) {
//         AppState.isAuthenticated = true;
//         AppState.token = token;
//         AppState.userRole = userRole;
        
//         //You could verify token with backend here if needed
//         // const isValidToken = await verifyToken(token);
//         // if (!isValidToken) handleLogout();

//         // Set user data
//         AppState.currentUser = {
//             id: '1',
//             name: 'John Doe',
//             email: 'john@example.com',
//             role: AppState.userRole
//         };

//         // Set navigation role
//         navigation.setRole(userRole);
//     } else {
//         AppState.isAuthenticated = false;
//     }
// };

// const handleError = (error) => {
//     console.error('Application Error:', error);
//     AppState.error = error.message;
//     AppState.isLoading = false;
//     MiniReact.rerender();
// };

// const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     AppState.isAuthenticated = false;
//     AppState.currentUser = null;
//     AppState.token = null;
//     AppState.userRole = null;
//     MiniReact.rerender();
// };

// // Handle auth token changes
// window.addEventListener('storage', (event) => {
//     if (event.key === 'token' && !event.newValue) {
//         handleLogout();
//     }
// });

// // Make handleLogout available globally
//  window.handleLogout = handleLogout;

// // Initialize when DOM is ready
// document.addEventListener('DOMContentLoaded', initializeApp);