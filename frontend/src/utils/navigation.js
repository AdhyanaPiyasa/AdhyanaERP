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
        ADMIN_PROFILE:'profile',

        // Reviewer Routes
        REVIEWER_APPLICATIONS: 'applications',

        APPLICATION_FORM: 'apply',
    },


    menuItems: {
        student: [
            { label: 'Dashboard', path: 'courses' },
            { label: 'Courses', path: 'courses' },
            { label: 'Events', path: 'events' },
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
            { label: 'Calendar', path: 'calendar' }
        ],
        parent: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Student Profile', path: 'studentProfile' },
            { label: 'Hostel', path: 'hostel' },
            { label: 'Events', path: 'events' }
        ],
        admin: [
            { label: 'Dashboard', path: 'dashboard' },
            { label: 'Students', path: 'students' },
            { label: 'Courses', path: 'courses' },
            { 
                label: 'Staff', 
                path: 'Staff'
            },
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
            { label: 'Profile', path: 'profile' }
        ],
    },



    protectedRoutes: {
        student: ['dashboard', 'courses', 'events', 'communication', 'other', 'profile'],
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
        const hash = window.location.hash.slice(1); // Get initial hash
        
        if (hash === this.routes.APPLICATION_FORM) { // Check if it's the public apply route
            this.currentRoute = hash;
            this.currentRole = null; // No role needed for public route
        } else {
            // Not the public apply route, check for user role
            if (!userRole) {
                // No role, redirect to login
                this.currentRoute = 'login';
            } else {
                // Role exists, set it internally first
                this.currentRole = userRole; // Set the role

                // Now check if the requested hash (if any) is accessible by this role
                if (hash && this.canAccess(hash)) {
                    this.currentRoute = hash;
                } else {
                    // No hash, or hash not accessible for this role
                    // Default to dashboard, with a fallback to login if dashboard isn't accessible
                    this.currentRoute = this.routes.DASHBOARD; // Default to dashboard
                    if (!this.canAccess(this.currentRoute)) {
                        console.warn(`Role ${userRole} cannot access default dashboard, redirecting to login.`);
                        this.currentRoute = 'login'; // Fallback to login
                    }
                    // Log if a specific inaccessible hash was initially requested
                    if (hash && !this.canAccess(hash)) {
                        console.warn(`Role ${userRole} cannot access requested route '${hash}', redirecting to '${this.currentRoute}'.`);
                    }
                }
            }
        }
        console.log(`Navigation Init: Initial route determined as: ${this.currentRoute}, Role: ${this.currentRole}`);

        // --- End Corrected Logic ---


        // 2. Add the popstate listener (handles browser back/forward)
        window.addEventListener('popstate', (event) => {
            const targetRoute = event.state?.route || '';
            const targetParams = event.state?.params || {};
            console.log(`Popstate event: Navigating to ${targetRoute}`);

            // Get the current role from storage *at the time of the event*
            const currentRoleOnPop = localStorage.getItem('userRole');
            this.currentRole = currentRoleOnPop; // Update internal role state

            if (targetRoute === this.routes.APPLICATION_FORM) {
                // Always allow navigating to the public 'apply' route
                this.currentRoute = targetRoute;
                this.params = targetParams;
                this.currentRole = null; // Ensure role is null for public route
                console.log(`Popstate: Allowed public route ${targetRoute}`);
            } else if (currentRoleOnPop && this.canAccess(targetRoute)) {
                // Role exists and can access the target protected route
                this.currentRoute = targetRoute;
                this.params = targetParams;
                console.log(`Popstate: Allowed protected route ${targetRoute} for role ${currentRoleOnPop}`);
            } else {
                // No role OR cannot access the target route
                console.warn(`Popstate: Cannot access ${targetRoute} (Role: ${currentRoleOnPop}), redirecting to login.`);
                this.currentRoute = 'login';
                this.params = {};
            }
            MiniReact.rerender(); // Re-render the UI based on the new route/state
        });
    }
 };

  // In your navigation.js or routing configuration for the applicants
const publicRoutes = [
    { path: '/apply', component: StudentApplicationForm }
  ];


 
 window.navigation = navigation;