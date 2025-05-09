// src/components/App.js

const App = () => {
  const currentRoute = navigation.getCurrentRoute(); 

  if (currentRoute === navigation.routes.APPLICATION_FORM) {
     return {
      type: PublicLayout, // Use the new layout
      props: {
          children: [
              { // Pass the form component as children to the layout
                  type: StudentApplicationForm,
                  props: { isStandalone: true },
              }
          ]
      }
  };
     
  }

  if (!AppState.isAuthenticated || !AppState.userRole) {
      if (currentRoute !== 'login') {
      }
      return {
          type: Login,
          props: {},
      };
  }

  const getContent = () => {
      const route = currentRoute;

      const role = AppState.userRole;
      const params = navigation.getParams();

      switch (role) {
        case "student":
          return getStudentContent(route, params);
        case "teacher":
          return getTeacherContent(route, params);
        case "parent":
          return getParentContent(route, params);
        case "admin":
          return getAdminContent(route, params);
        case "reviewer":
          return getReviewerContent(route, params);
        default:
           console.error("Invalid role:", role);
           return { type: "div", props: { children: ["Invalid role."] } };
      }
  };

  // Role-specific content getters
  const getStudentContent = (route, params) => {
    switch (route) {
      case "dashboard":
        return { type: Dashboard };
      case "profile":
        return { type: StudentProfile };
      case "courses":
        return { type: CourseList };
      case (route.match(/^courses\/\w+$/) || {}).input:
        return { type: CourseDetail, props: params };
      case "events":
        return { type: Calendar };
      case "announcements":
        return { type: AnnouncementView };
      case "other":
        return { type: OtherPage };
      case "other/exams/StudentExamDashboard":
        return { type: StudentExamDashboard };

      case "other/scholarship":
        return { type: ScholarshipList };
      case "other/hostel":
        return { type: HostelInfo };
      case "other/grades":
        return { type: GradeBook };
      default:
        return { type: Dashboard };
    }
  };
  const getTeacherContent = (route, params) => {
    switch (route) {
      case "dashboard":
        return { type: TeacherCourseList };
      case "profile":
        return { type: TeacherProfile };
      case "courses":
        return { type: TeacherCourseList };
      case (route.match(/^courses\/\w+$/) || {}).input:
        return { type: TeacherCourseDetail, props: params };
      case "timetable":
        return { type: CourseSchedule };
      case "calendar":
        return { type: Calendar };
      case "communication":
        return { type: EmailList };
      default:
        return { type: TeacherCourseList };
    }
  };

  const getParentContent = (route, params) => {
    switch (route) {
      case "dashboard":
        return { type: ParentDashboard };
      case "profile":
        return { type: ParentProfile };
      case "studentProfile":
        return { type: PStudentProfile };
      case "events":
        return { type: Calendar };
      case "hostel":
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
      case "dashboard":
        return { type: AdministratorDashboard };
      case "profile":
        return { type: AdministratorProfile };
      case "students":
        return { type: StudentMain };
      case "students/StudentDegree":
        return { type: StudentDegree };
      case "students/applicants":
        return { type: ApplicantList };
      case (route.match(/^students\/applicants\/\w+$/) || {}).input:
        return { type: ApplicantDetail };
      case (route.match(/^students\/\w+$/) || {}).input:
        return { type: AdministratorStudentList, props: params };
      case "courses":
        return { type: AdministratorCourseList };
      case (route.match(/^courses\/\w+$/) || {}).input:
        return { type: AdministratorCourseList, props: params };
      case "staff":
        return { type: StaffMain };
      case "staff/Attendance":
        return { type: StaffAttendance };
      case "staff/Payroll":
        return { type: PayrollDashboard };
      case "staff/StaffList":
        return { type: StaffList };
      case "other":
        return { type: OtherMain };
      case "other/batch":
        return { type: batchList };
      case (route.match(/^other\/batch\/\w+$/) || {}).input:
        const batchId = route.split("/")[2];
        return { type: batchDetails, props: { batchId: batchId } };
      case "other/exams":
        return { type: ExamMain };
      case "other/exams/RoomAssignments":
        return { type: RoomAssignments };
      case "other/exams/ExamList":
        return { type: ExamList };
      case "other/exams/FinalTimetable":
        return { type: FinalTimetable };
      case "other/events":
        return { type: EventsMain };
      case "other/announcements":
        return { type: AannouncementList };
      case "other/hostel":
        return { type: AdminHostelInfo };
        case 'other/hostel/applications':  // New route for applications
        return { type: HostelApplicationsList };
      case "other/scholarship":
        return { type: ScholarshipMain };
      case "other/scholarship/applications":
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
      case "applications":
        return { type: ApplicationsList };
      case "profile":
        return { type: ReviewerProfile };
      default:
        return { type: ApplicationsList };
    }
  };

  // Get the appropriate layout based on user role
  const getLayout = () => {
    switch (navigation.currentRole) {
      case "student":
        return { type: StudentLayout };
      case "teacher":
        return { type: TeacherLayout };
      case "parent":
        return { type: parentLayout };
      case "admin":
        return { type: AdministratorLayout };
      case "reviewer":
        return { type: ReviewerLayout };
      default:
        return { type: AdministratorLayout };
    }
  };

  return {
    type: getLayout().type,
    props: {
      children: [getContent()],
    },
  };
};
