// // components/Admin/courses/AdministratorCourseList.js
// const AdministratorCourseList = () => {
//   const [activeTab, setActiveTab] = MiniReact.useState("courses");
//   const [currentCourseState, setCurrentCourseState] = MiniReact.useState({
//     showAddModal: false,
//     showEditModal: false,
//     showDeleteModal: false,
//     selectedCourse: null,
//   });
//   const [currentSemesterState, setCurrentSemesterState] = MiniReact.useState({
//     showAddModal: false,
//     showEditModal: false,
//     showDeleteModal: false,
//     selectedSemester: null,
//   });

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);

//     if (tab === "courses") {
//       setCurrentSemesterState({
//         ...currentSemesterState,
//         showAddModal: false,
//         showEditModal: false,
//         showDeleteModal: false,
//       });
//     } else if (tab === "semesters") {
//       setCurrentCourseState({
//         ...currentCourseState,
//         showAddModal: false,
//         showEditModal: false,
//         showDeleteModal: false,
//       });
//     }
//   };

//   const styles = {
//     container: {
//       display: "flex",
//       flexDirection: "column",
//       height: "100%",
//     },
//     header: {
//       display: "flex",
//       justifyContent: "space-between", // Left & right spacing
//       alignItems: "center",
//       borderBottom: `1px solid ${theme.colors.border}`,
//       paddingBottom: theme.spacing.md,
//     },
//     title: {
//       fontSize: theme.typography.h1.fontSize,
//       fontWeight: theme.typography.h1.fontWeight,
//     },
//     tabsContainer: {
//       display: "flex",
//       alignItems: "center",
//       gap: theme.spacing.md,
//     },
//     tab: (isActive) => ({
//       padding: `${theme.spacing.sm} ${theme.spacing.md}`,
//       cursor: "pointer",
//       borderBottom: isActive ? `2px solid ${theme.colors.primary}` : "none",
//       color: isActive ? theme.colors.primary : theme.colors.textSecondary,
//       fontWeight: isActive ? "bold" : "normal",
//       transition: "all 0.2s",
//     }),
//     contentArea: {
//       flex: 1,
//       marginTop: theme.spacing.md,
//     },
//   };

//   return {
//     type: "div",
//     props: {
//       style: styles.container,
//       children: [
//         {
//           type: "div",
//           props: {
//             style: styles.header,
//             children: [
//               {
//                 type: "h1",
//                 props: {
//                   style: styles.title,
//                   children: ["Course Management"],
//                 },
//               },
//               {
//                 type: "div",
//                 props: {
//                   style: styles.tabsContainer,
//                   children: [
//                     {
//                       type: "div",
//                       props: {
//                         style: styles.tab(activeTab === "courses"),
//                         onClick: () => handleTabChange("courses"),
//                         children: ["Courses"],
//                       },
//                     },
//                     {
//                       type: "div",
//                       props: {
//                         style: styles.tab(activeTab === "semesters"),
//                         onClick: () => handleTabChange("semesters"),
//                         children: ["Semesters"],
//                       },
//                     },
//                   ],
//                 },
//               },
//             ],
//           },
//         },

//         {
//           type: "div",
//           props: {
//             style: styles.contentArea,
//             children: [
//               activeTab === "courses" && {
//                 type: CourseContentArea,
//                 props: {
//                   state: currentCourseState,
//                   setState: setCurrentCourseState,
//                 },
//               },
//               activeTab === "semesters" && {
//                 type: SemesterContentArea,
//                 props: {
//                   state: currentSemesterState,
//                   setState: setCurrentSemesterState,
//                 },
//               },
//             ].filter(Boolean),
//           },
//         },
//       ],
//     },
//   };
// };

// window.AdministratorCourseList = AdministratorCourseList;

// components/Admin/courses/AdministratorCourseList.js
const AdministratorCourseList = () => {
  const [activeTab, setActiveTab] = MiniReact.useState("courses");
  const [currentCourseState, setCurrentCourseState] = MiniReact.useState({
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    selectedCourse: null,
  });
  // --- FIX START: Removed lastUpdated ---
  // We will control fetching directly within SemesterContentArea based on activeTab
  const [currentSemesterState, setCurrentSemesterState] = MiniReact.useState({
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    selectedSemester: null,
    // lastUpdated: new Date().getTime(), // REMOVED: No longer needed here
  });
  // --- FIX END ---

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Reset modal states when switching tabs
    if (tab === "courses") {
      setCurrentSemesterState((prevState) => ({
        ...prevState, // Keep selectedSemester if needed
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
      }));
    } else if (tab === "semesters") {
      setCurrentCourseState((prevState) => ({
        ...prevState, // Keep selectedCourse if needed
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
      }));
      // --- FIX START: Removed lastUpdated update ---
      // Reset semester modals state as well
      setCurrentSemesterState((prevState) => ({
        ...prevState,
        showAddModal: false,
        showEditModal: false,
        showDeleteModal: false,
        // lastUpdated: new Date().getTime(), // REMOVED
      }));
      // --- FIX END ---
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between", // Left & right spacing
      alignItems: "center",
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
    },
    tabsContainer: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    tab: (isActive) => ({
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      cursor: "pointer",
      borderBottom: isActive ? `2px solid ${theme.colors.primary}` : "none",
      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
      fontWeight: isActive ? "bold" : "normal",
      transition: "all 0.2s",
    }),
    contentArea: {
      flex: 1,
      marginTop: theme.spacing.md,
    },
  };

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
        {
          type: "div",
          props: {
            style: styles.header,
            children: [
              {
                type: "h1",
                props: {
                  style: styles.title,
                  children: ["Course Management"],
                },
              },
              {
                type: "div",
                props: {
                  style: styles.tabsContainer,
                  children: [
                    {
                      type: "div",
                      props: {
                        style: styles.tab(activeTab === "courses"),
                        onClick: () => handleTabChange("courses"),
                        children: ["Courses"],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: styles.tab(activeTab === "semesters"),
                        onClick: () => handleTabChange("semesters"),
                        children: ["Semesters"],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        {
          type: "div",
          props: {
            style: styles.contentArea,
            children: [
              activeTab === "courses" && {
                type: CourseContentArea,
                props: {
                  state: currentCourseState,
                  setState: setCurrentCourseState,
                  // Pass activeTab info if CourseContentArea needs it
                  isActive: activeTab === "courses",
                },
              },
              activeTab === "semesters" && {
                type: SemesterContentArea,
                props: {
                  state: currentSemesterState,
                  setState: setCurrentSemesterState,
                  // Pass activeTab info to control fetching
                  isActive: activeTab === "semesters",
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
};

window.AdministratorCourseList = AdministratorCourseList;
