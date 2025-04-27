// src/utils/navigation.js
const navigation = {
    routes: {
        // Common Routes
        DASHBOARD: 'dashboard',
        PROFILE: 'profile',
       

        // Student Routes
        COURSES: 'courses',
        COURSE_DETAIL: 'courses/:id',
        EVENTS: 'events',
        COMMUNICATION: 'common/communication',
        OTHER: 'other',
        FINANCE: 'other/finance',
        SCHOLARSHIP: 'other/scholarship',
        HOSTEL: 'other/hostel',
        ATTENDANCE: 'other/attendance',
        GRADES: 'other/grades',

        // Teacher Routes
        TEACHER_COURSES: 'courses',
        TEACHER_TIMETABLE: 'timetable',
        TEACHER_CALENDAR: 'calendar',

        // Parent Routes
        STUDENT_PROFILE: 'studentProfile',
        CHILD_DETAIL: 'children/:id',
        PAYMENTS: 'payments',
        EVENTS: 'events',
        HOSTEL: 'hostel',

        // Admin Routes (Hostel Focus)
        HOSTEL_MANAGEMENT: 'hostel',
        ASSIGN_ROOM: 'hostel/assign',
        LEAVING_REQUESTS: 'hostel/leaving-requests',
        ROOM_INFO: 'hostel/room-information',

        // Admin Routes (Full System)
        ADMIN_COURSES: 'courses',
        ADMIN_COURSE_DETAILS: 'courses/:id',
        ADMIN_STUDENTS: 'students',
        ADMIN_STUDENT_DETAILS: 'students/:id',
        ADMIN_OTHER: 'other',
        ADMIN_EXAMS: 'other/exams',
        ADMIN_FACULTY: 'other/faculty',
        ADMIN_STAFF: 'staff',

        // Reviewer Routes
        REVIEWER_APPLICATIONS: 'applications',

        APPLICATION_FORM: 'apply',
    },


    menuItems: {
        student: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Courses', path: 'courses' },
            { label: 'Events', path: 'events' },
            { label: 'Announcements', path: 'announcements' },
            { label: 'Profile', path: 'profile' },
            { 
                label: 'Other', 
                path: 'other',
                subItems: [
                    { label: 'Finance', path: 'other/finance' },
                    { label: 'Scholarship', path: 'other/scholarship' },
                    { label: 'Hostel', path: 'other/hostel' },
                    { label: 'Attendance', path: 'other/attendance' },
                    { label: 'Grades', path: 'other/grades' }
                ]
            }
        ],
        teacher: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Courses', path: 'courses' },
            { label: 'Timetable', path: 'timetable' },
            { label: 'Calendar', path: 'calendar' },
            { label: 'Profile', path: 'profile' },
        ],
        parent: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Student Profile', path: 'studentProfile' },
            { label: 'Hostel', path: 'hostel' },
            { label: 'Events', path: 'events' },
            { label: 'Profile', path: 'profile' },
        ],
        admin: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Students', path: 'students' },
            { label: 'Courses', path: 'courses' },
            { label: 'Staff', path: 'Staff' },
            { label: 'Profile', path: 'profile' },
            { 
                label: 'Other', 
                path: 'other',
                subItems: [
                    { label: 'Batch', path: 'other/batch' },
                    { label: 'Exams', path: 'other/exams' },
                    { label: 'Calendar', path: 'other/events' },
                    { label: 'Announcements', path: 'other/announcements' },
                    { label: 'Staff', path: 'other/hostel' },
                    { label: 'Hostel', path: 'other/scholarship' }
                ]
            }
        ],
        reviewer:[
            // { label: 'Dashboard', path: 'dashboard' },
            { label: 'Applications', path: 'applications' },
        ],
    },



    protectedRoutes: {
        student: ['dashboard', 'courses', 'events', 'announcements', 'other', 'profile'],
        teacher: ['dashboard', 'courses', 'timetable', 'communication', 'calendar', 'profile'],
        parent: ['dashboard', 'studentProfile', 'hostel', 'events', 'profile'],
        admin: ['dashboard', 'students', 'courses','staff', 'other', 'profile'],
        reviewer: [ 'applications'],
    },
 
    currentRoute: 'dashboard',
    currentRole: null,
    params: {},
 
    setRole(role) {
        if (['student', 'teacher', 'parent', 'admin', 'reviewer'].includes(role)) {
            this.currentRole = role;
            localStorage.setItem('userRole', role);
            MiniReact.rerender();
        }
    },
 
    canAccess(path) {

        // Add a special case for the application form
    if (path === 'apply') {
        return true; // Always accessible
    }

        const userRole = this.currentRole;
        const allowedRoutes = this.protectedRoutes[userRole] || [];
        
        // Check if the path matches any allowed route or its sub-routes
        return allowedRoutes.some(allowed => {
            // Exact match
            if (path === allowed) return true;
            
            // Check if path starts with allowed route and is followed by '/'
            // This handles sub-routes like 'courses/CS1205'
            if (path.startsWith(allowed + '/')) return true;
            
            return false;
        });
    },
 
    // navigate(path, params = {}) {
    //     console.log("Navigating to:", path, "from:", this.currentRoute);
    //     if (!this.canAccess(path)) {
    //         // Change from redirecting to login.html
    //         this.currentRoute = 'login';
    //         MiniReact.rerender();
    //         return;
    //     }
 
    //     this.currentRoute = path;
    //     this.params = params;
    //     window.history.pushState({ route: path, params }, '', `#${path}`);
    //     MiniReact.rerender();
    // },

    // In navigation.js
navigate(path, params = {}) {
    console.log("Navigating to:", path, "from:", this.currentRoute);
    // Add this check at the beginning of the navigate function
    if (this.currentRoute === path) {
        return; // Skip navigation if already on this exact path
    }
    
    // Rest of your original navigation function
    if (!this.canAccess(path)) {
        this.currentRoute = 'login';
        MiniReact.rerender();
        return;
    }

    this.currentRoute = path;
    this.params = params;
    window.history.pushState({ route: path, params }, '', `#${path}`);
    MiniReact.rerender();
},
 
    // logout() {
    //     localStorage.removeItem('userRole');
    //     window.location.href = '/login.html';
    // },
 

    getCurrentRoute() {
        return this.currentRoute;
    },

    getParams() {
        return this.params;
    },

    getRouteParams() {
        // Add this helper method to extract route parameters
        const route = this.currentRoute;
        const parts = route.split('/');
        if (parts.length >= 2) {
            return parts[1];
        }
        return null;
    },

    getMenuItems() {
        return this.menuItems[this.currentRole] || [];
    },

    findMenuItem(path) {
        const items = this.getMenuItems();
        for (const item of items) {
            if (item.path === path) return item;
            if (item.subItems) {
                const subItem = item.subItems.find(sub => sub.path === path);
                if (subItem) return subItem;
            }
        }
        return null;
    },

    init() {
        const userRole = localStorage.getItem('userRole');
        
        if (!userRole) {
            // Change from redirecting to login.html
            this.currentRoute = 'login';
            MiniReact.rerender();
            return;
        }
 
        this.setRole(userRole);
 
        window.addEventListener('popstate', (event) => {
            if (event.state?.route && this.canAccess(event.state.route)) {
                this.currentRoute = event.state.route;
                this.params = event.state.params || {};
                MiniReact.rerender();
            } else {
                // Change from redirecting to login.html
                this.currentRoute = 'login';
                MiniReact.rerender();
            }
        });
 
        const hash = window.location.hash.slice(1);
        if (hash) {
            if (!this.canAccess(hash)) {
                // Change from redirecting to login.html
                this.currentRoute = 'login';
                MiniReact.rerender();
            } else {
                this.currentRoute = hash;
            }
        }
    }
 };

  // In your navigation.js or routing configuration for the applicants
const publicRoutes = [
    { path: '/apply', component: StudentApplicationForm }
  ];


 
 window.navigation = navigation;