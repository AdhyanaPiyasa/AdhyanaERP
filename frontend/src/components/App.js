// src/components/App.js
const App = () => {
    if (!AppState.isAuthenticated || !AppState.userRole) {
        return {
            type: Login,
            props: {}
        };
    }

    
    // Your existing App implementation for authenticated users
    const getContent = () => {
        const route = navigation.getCurrentRoute();
        if (route === 'apply') {
            return {
                type: ApplicationPage,
                props: {}
            };
        }
        const role = AppState.userRole;
        const params = navigation.getParams();

        // Common routes for all roles
        if (route === 'profile') {
            // Correctly format the component name based on role
            const componentName = role.charAt(0).toUpperCase() + 
                                role.slice(1) + 'Profile';
            return {
                type: window[componentName], // Use window to access globally registered component
                props: params
            };
        }

        // Role-specific routing
        switch (role) {
            case 'student':
                return getStudentContent(route, params);
            case 'teacher':
                return getTeacherContent(route, params);
            case 'parent':
                return getParentContent(route, params);
            case 'admin':
                return getAdminContent(route, params);
            case 'reviewer':
                return getReviewerContent(route, params);
            default:
                return { type: 'div', props: { children: ['Invalid role'] } };
        }
    };

    // Role-specific content getters
    const getStudentContent = (route, params) => {
        switch (route) {
            case 'dashboard':
                return { type: Dashboard };
            case 'courses':
                return { type: CourseList };
            case (route.match(/^courses\/\w+$/) || {}).input:
                return { type: CourseDetail, props: params };
            case 'events':
                return { type: Calendar };
            case 'communication':
                return { type: EmailList };
            case 'other':
                return { type: OtherPage };
            case 'other/finance':
                return { type: Finance };
            case 'other/scholarship':
                return { type: ScholarshipList };
            case 'other/hostel':
                return { type: HostelInfo };
            case 'other/attendance':
                return { type: AttendanceTracker };
            case 'other/grades':
                return { type: GradeBook };
            default:
                return { type: Dashboard };
        }
    };
    const getTeacherContent = (route, params) => {
        switch (route) {
            case 'dashboard':
                return { type: TeacherDashboard };
            case 'courses':
                return { type: TeacherCourseList };
            case (route.match(/^courses\/\w+$/) || {}).input:
                return { type: TeacherCourseDetail, props: params };
            case 'timetable':
                return { type: CourseSchedule };
            case 'calendar':
                return { type: Calendar };
            case 'communication':
                return { type: EmailList };
            default:
                return { type: TeacherDashboard };
        }
    };


    const getParentContent = (route, params) => {
        switch (route) {
            case 'dashboard':
                return { type: ParentDashboard };
            case 'studentProfile':
                return { type: PStudentProfile };
            case 'events':
                return { type: Calendar  };
            case 'hostel':
                return { type: PHostelInfo };
            // case 'courses':
            //     return { type: CourseList};
            // case (route.match(/^courses\/\w+$/) || {}).input:
            //     return { type: CourseDetail, props: params };
            case (route.match(/^children\/\w+$/) || {}).input:
                return { type: StudentDetails, props: params };
            default:
                return { type: ParentDashboard };
        }
    };
    
    const getAdminContent = (route, params) => {
        // const route = route.split('/')[0];
        switch (route) {
            case 'dashboard':
                return { type: AdministratorDashboard };
            case 'students':
                return { type: StudentMain};
            case 'students/StudentDegree':
                return { type: StudentDegree };
            case 'students/applicants':
                return { type: ApplicantList };
            case (route.match(/^students\/applicants\/\w+$/) || {}).input:
                return { type: ApplicantDetail };
            case (route.match(/^students\/\w+$/) || {}).input:
                return { type: AdministratorStudentList, props: params };
            case 'courses':
                    return { type: AdministratorDegreeList };
            case (route.match(/^courses\/\w+$/) || {}).input:
                    return { type: AdministratorCourseList, props: params };
            case 'staff':
                return { type: StaffMain };
                case 'staff/Attendance':
                return { type: StaffAttendance };
                case 'staff/Payroll':
                return { type: Payroll };
                case 'staff/StaffList':
                return { type: StaffList };
            case 'other':
                return { type: OtherMain }; 
                case 'other/batch':
                    return { type: batchList };
                case (route.match(/^other\/batch\/\w+$/) || {}).input:
                    const batchId = route.split('/')[2];
                    return { type: batchDetails, props: { batchId: batchId } };
                case 'other/exams':
                return { type: ExamMain };
                case 'other/exams/RoomAssignments':
                return { type: RoomAssignments };
                case 'other/exams/CreateExam':
                return { type: CreateExam };
                case 'other/exams/FinalTimetable':
                return { type: FinalTimetable };                                       
                case 'other/events':
                    return { type:EventsMain};
                case 'other/announcements':
                   return { type: AannouncementList };
            case 'other/hostel':
                    return { type: AdminHostelInfo };
            case 'other/scholarship':
                return { type: ScholarshipMain };
            case 'other/scholarship/applications':
                return { type: AdminApplicationsList };
            default:
                return { type: AdministratorDashboard };
        }
    };

    // Add getReviewerContent
    const getReviewerContent = (route, params) => {
        switch (route) {
            // case 'dashboard':
            //     return { type: ReviewerDashboard };
            case 'applications':
                return { type: ApplicationsList };
            case 'profile':
                return { type: ReviewerProfile };
            default:
                return { type: ApplicationsList };
        }
    };

    // Get the appropriate layout based on user role
    const getLayout = () => {
        switch (navigation.currentRole) {
            case 'student':
                return { type: StudentLayout };
            case 'teacher':
                return { type: TeacherLayout};
            case 'parent':
                return { type: parentLayout };
            case 'admin':
                return { type: AdministratorLayout };
            case 'reviewer':
                return { type: ReviewerLayout };
            default:
                return { type: AdministratorLayout };
        }
    };

    return {
        type: getLayout().type,
        props: {
            children: [getContent()]
        }
    };
};