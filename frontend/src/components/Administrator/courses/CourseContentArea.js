// // components/Admin/courses/CourseContentArea.js
// const CourseContentArea = ({ state, setState }) => {
//   // Use state from props or fallback to local state if not provided
//   const showAddModal = state?.showAddModal || false;
//   const showEditModal = state?.showEditModal || false;
//   const showDeleteModal = state?.showDeleteModal || false;
//   const selectedCourse = state?.selectedCourse || null;

//   // Function to update parent state
//   const updateState = (updates) => {
//     if (setState) {
//       setState((prevState) => ({
//         ...prevState,
//         ...updates,
//       }));
//     }
//   };

//   // Sample course data with ratings
//   const courses = [
//     {
//       id: 1,
//       code: 101,
//       name: "Introduction to Programming",
//       year: 1,
//       semester: 1,
//       credits: 3,
//       duration: 45,
//       rating: 4,
//       created_at: "2025-01-15 14:30:22",
//       updated_at: "2025-02-10 09:45:17",
//     },
//     {
//       id: 2,
//       code: 201,
//       name: "Data Structures",
//       year: 2,
//       semester: 1,
//       credits: 4,
//       duration: 60,
//       rating: 5,
//       created_at: "2025-01-20 10:15:43",
//       updated_at: "2025-03-05 11:20:35",
//     },
//     {
//       id: 3,
//       code: 301,
//       name: "Calculus I",
//       year: 1,
//       semester: 2,
//       credits: 3,
//       duration: 45,
//       rating: 3,
//       created_at: "2025-01-25 08:45:11",
//       updated_at: "2025-01-25 08:45:11",
//     },
//     {
//       id: 4,
//       code: 401,
//       name: "Physics I",
//       year: 2,
//       semester: 2,
//       credits: 4,
//       duration: 60,
//       rating: 4,
//       created_at: "2025-01-25 08:45:11",
//       updated_at: "2025-01-25 08:45:11",
//     },
//   ];

//   const handleEdit = () => {
//     if (selectedCourse) {
//       updateState({ showEditModal: true });
//     }
//   };

//   const handleDelete = () => {
//     if (selectedCourse) {
//       updateState({ showDeleteModal: true });
//     }
//   };

//   const handleRowClick = (course) => {
//     console.log("Row clicked, setting course:", course);
//     updateState({ selectedCourse: course });
//   };

//   const handleAddClick = () => {
//     updateState({ showAddModal: true });
//   };

//   const styles = {
//     container: {
//       display: "flex",
//       height: "100%",
//     },
//     tableSection: {
//       width: "60%",
//       paddingRight: theme.spacing.lg,
//     },
//     detailsSection: {
//       width: "40%",
//       borderLeft: `1px solid ${theme.colors.border}`,
//       paddingLeft: theme.spacing.lg,
//     },
//   };

//   return {
//     type: "div",
//     props: {
//       style: styles.container,
//       children: [
//         // Left side - Course Table
//         {
//           type: "div",
//           props: {
//             style: styles.tableSection,
//             children: [
//               {
//                 type: CourseTable,
//                 props: {
//                   courses: courses,
//                   onRowClick: handleRowClick,
//                   onAddClick: handleAddClick,
//                 },
//               },
//             ],
//           },
//         },

//         // Right side - Focus Panel
//         {
//           type: "div",
//           props: {
//             style: styles.detailsSection,
//             children: [
//               {
//                 type: CourseFocusPanel,
//                 props: {
//                   course: selectedCourse,
//                   onEdit: handleEdit,
//                   onDelete: handleDelete,
//                 },
//               },
//             ],
//           },
//         },

//         // Modals
//         showAddModal && {
//           type: AddCourse,
//           props: {
//             onClose: () => updateState({ showAddModal: false }),
//           },
//         },
//         showEditModal && {
//           type: EditCourse,
//           props: {
//             course: selectedCourse,
//             onClose: () => updateState({ showEditModal: false }),
//           },
//         },
//         showDeleteModal && {
//           type: coursesDeleteConfirmation,
//           props: {
//             onClose: () => updateState({ showDeleteModal: false }),
//             onConfirm: () => {
//               console.log("Deleting course:", selectedCourse);
//               updateState({ showDeleteModal: false, selectedCourse: null });
//             },
//           },
//         },
//       ].filter(Boolean),
//     },
//   };
// };

// window.CourseContentArea = CourseContentArea;

// components / Admin / courses / CourseContentArea.js;
// components / Admin / courses / CourseContentArea.js;
// components / Admin / courses / CourseContentArea.js;
// components / Admin / courses / CourseContentArea.js;

// components/Admin/courses/CourseContentArea.js
// components/Admin/courses/CourseContentArea.js

// const CourseContentArea = ({ state, setState }) => {
//   // Use state from props or fallback to local state if not provided
//   const showAddModal = state?.showAddModal || false;
//   const showEditModal = state?.showEditModal || false;
//   const showDeleteModal = state?.showDeleteModal || false;
//   const selectedCourse = state?.selectedCourse || null;

//   // Add state for courses data, loading and error
//   const [courses, setCourses] = MiniReact.useState([]);
//   const [loading, setLoading] = MiniReact.useState(true);
//   const [error, setError] = MiniReact.useState(null);

//   // Function to update parent state
//   const updateState = (updates) => {
//     if (setState) {
//       setState((prevState) => ({
//         ...prevState,
//         ...updates,
//       }));
//     }
//   };

//   // Function to fetch courses from the API
//   const fetchCourses = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Get the stored auth token (if authentication is required)
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "http://localhost:8081/api/api/courses/courseCore/",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         // Transform API data to match the format expected by the UI components
//         const formattedCourses = data.data.map((course) => ({
//           id: course.courseId,
//           code: course.courseId,
//           name: course.name,
//           year: course.year,
//           credits: course.credits,
//           duration: course.duration,
//           rating: course.avgRating || 0,
//           created_at: new Date().toISOString(), // These fields might not be in the API response
//           updated_at: new Date().toISOString(),
//         }));

//         setCourses(formattedCourses);

//         // If a course was previously selected, update its data
//         if (selectedCourse) {
//           const updatedSelectedCourse = formattedCourses.find(
//             (c) => c.id === selectedCourse.id || c.code === selectedCourse.code
//           );

//           if (updatedSelectedCourse) {
//             updateState({ selectedCourse: updatedSelectedCourse });
//           }
//         }
//       } else {
//         setError(data.message || "Failed to fetch courses");
//       }
//     } catch (error) {
//       setError(error.message);
//       console.error("Error fetching courses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch courses on component mount
//   MiniReact.useEffect(() => {
//     fetchCourses();
//   }, []);

//   const handleEdit = () => {
//     if (selectedCourse) {
//       updateState({ showEditModal: true });
//     }
//   };

//   const handleDelete = () => {
//     if (selectedCourse) {
//       updateState({ showDeleteModal: true });
//     }
//   };

//   const handleRowClick = (course) => {
//     console.log("Row clicked, setting course:", course);
//     updateState({ selectedCourse: course });
//   };

//   const handleAddClick = () => {
//     updateState({ showAddModal: true });
//   };

//   // Handle successful add operation
//   const handleAddSuccess = (newCourse) => {
//     updateState({ showAddModal: false });
//     fetchCourses(); // Refresh courses list
//   };

//   // Handle successful edit operation
//   const handleEditSuccess = (updatedCourse) => {
//     updateState({ showEditModal: false, selectedCourse: updatedCourse });
//     fetchCourses(); // Refresh courses list
//   };

//   // Handle successful delete operation
//   const handleDeleteSuccess = () => {
//     updateState({ showDeleteModal: false, selectedCourse: null });
//     fetchCourses(); // Refresh courses list
//   };

//   const styles = {
//     container: {
//       display: "flex",
//       flexDirection: "column",
//       height: "100%",
//     },
//     contentContainer: {
//       display: "flex",
//       flex: 1,
//     },
//     tableSection: {
//       width: "60%",
//       paddingRight: theme.spacing.lg,
//     },
//     detailsSection: {
//       width: "40%",
//       borderLeft: `1px solid ${theme.colors.border}`,
//       paddingLeft: theme.spacing.lg,
//     },
//     loadingContainer: {
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100%",
//       width: "100%",
//       padding: theme.spacing.xl,
//     },
//     errorContainer: {
//       padding: theme.spacing.md,
//       backgroundColor: "#ffebee",
//       color: "#c62828",
//       borderRadius: theme.spacing.sm,
//       marginBottom: theme.spacing.md,
//     },
//   };

//   return {
//     type: "div",
//     props: {
//       style: styles.container,
//       children: [
//         // Error message if there is one
//         error && {
//           type: "div",
//           props: {
//             style: styles.errorContainer,
//             children: [`Error: ${error}`],
//           },
//         },

//         // Main content
//         {
//           type: "div",
//           props: {
//             style: styles.contentContainer,
//             children: [
//               // Showing loading state
//               loading
//                 ? {
//                     type: "div",
//                     props: {
//                       style: styles.loadingContainer,
//                       children: ["Loading courses..."],
//                     },
//                   }
//                 : [
//                     // Left side - Course Table
//                     {
//                       type: "div",
//                       props: {
//                         style: styles.tableSection,
//                         children: [
//                           {
//                             type: CourseTable,
//                             props: {
//                               courses: courses,
//                               onRowClick: handleRowClick,
//                               onAddClick: handleAddClick,
//                             },
//                           },
//                         ],
//                       },
//                     },

//                     // Right side - Focus Panel
//                     {
//                       type: "div",
//                       props: {
//                         style: styles.detailsSection,
//                         children: [
//                           {
//                             type: CourseFocusPanel,
//                             props: {
//                               course: selectedCourse,
//                               onEdit: handleEdit,
//                               onDelete: handleDelete,
//                             },
//                           },
//                         ],
//                       },
//                     },
//                   ].filter(Boolean),
//             ],
//           },
//         },

//         // Modals
//         showAddModal && {
//           type: AddCourse,
//           props: {
//             onClose: () => updateState({ showAddModal: false }),
//             onSuccess: handleAddSuccess,
//           },
//         },
//         showEditModal && {
//           type: EditCourse,
//           props: {
//             course: selectedCourse,
//             onClose: () => updateState({ showEditModal: false }),
//             onSuccess: handleEditSuccess,
//           },
//         },
//         showDeleteModal && {
//           type: coursesDeleteConfirmation,
//           props: {
//             course: selectedCourse,
//             onClose: () => updateState({ showDeleteModal: false }),
//             onConfirm: handleDeleteSuccess,
//           },
//         },
//       ].filter(Boolean),
//     },
//   };
// };

// window.CourseContentArea = CourseContentArea;

// components/Admin/courses/CourseContentArea.js
const CourseContentArea = ({ state, setState }) => {
  // Use state from props or fallback to local state if not provided
  const showAddModal = state?.showAddModal || false;
  const showEditModal = state?.showEditModal || false;
  const showDeleteModal = state?.showDeleteModal || false;
  const selectedCourse = state?.selectedCourse || null;

  // Add state for courses data, loading and error
  const [courses, setCourses] = MiniReact.useState([]);
  const [loading, setLoading] = MiniReact.useState(true);
  const [error, setError] = MiniReact.useState(null);

  // Function to update parent state
  const updateState = (updates) => {
    if (setState) {
      setState((prevState) => ({
        ...prevState,
        ...updates,
      }));
    }
  };

  //Function to fetch courses from the API
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the stored auth token (if authentication is required)
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8081/api/api/courses/courseCore/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API Response:", data); // Debug log

      if (data.success) {
        // Transform API data to match the format expected by the UI components
        const formattedCourses = data.data.map((course) => ({
          code: course.courseId,
          name: course.name,
          year: course.year,
          credits: course.credits,
          duration: course.duration,
          rating: course.avgRating || 0,
          created_at: new Date().toISOString(), // These fields might not be in the API response
          updated_at: new Date().toISOString(),
        }));

        console.log("Formatted courses:", formattedCourses); // Debug log
        setCourses(formattedCourses);

        // If a course was previously selected, update its data
        if (selectedCourse) {
          const updatedSelectedCourse = formattedCourses.find(
            (c) => c.code === selectedCourse.code
          );

          if (updatedSelectedCourse) {
            updateState({ selectedCourse: updatedSelectedCourse });
          }
        }
      } else {
        setError(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message || "Failed to fetch courses");

      // // Fallback to sample data for development/testing
      // const sampleCourses = [
      //   {
      //     id: "CS101",
      //     code: "CS101",
      //     name: "Introduction to Programming",
      //     year: 1,
      //     semester: 1,
      //     credits: 3,
      //     duration: 45,
      //     rating: 4,
      //     created_at: "2025-01-15 14:30:22",
      //     updated_at: "2025-02-10 09:45:17",
      //   },
      //   {
      //     id: "CS201",
      //     code: "CS201",
      //     name: "Data Structures",
      //     year: 2,
      //     semester: 1,
      //     credits: 4,
      //     duration: 60,
      //     rating: 5,
      //     created_at: "2025-01-20 10:15:43",
      //     updated_at: "2025-03-05 11:20:35",
      //   },
      // ];

      // setCourses(sampleCourses);
      // console.log("Using sample data due to fetch error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount
  MiniReact.useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = () => {
    if (selectedCourse) {
      updateState({ showEditModal: true });
    }
  };

  const handleDelete = () => {
    if (selectedCourse) {
      updateState({ showDeleteModal: true });
    }
  };

  const handleRowClick = (course) => {
    console.log("Row clicked, setting course:", course);
    updateState({ selectedCourse: course });
  };

  const handleAddClick = () => {
    updateState({ showAddModal: true });
  };

  // Handle successful add operation
  const handleAddSuccess = (newCourse) => {
    updateState({ showAddModal: false });
    fetchCourses(); // Refresh courses list
  };

  // Handle successful edit operation
  const handleEditSuccess = (updatedCourse) => {
    updateState({ showEditModal: false, selectedCourse: updatedCourse });
    fetchCourses(); // Refresh courses list
  };

  // Handle successful delete operation
  const handleDeleteSuccess = () => {
    updateState({ showDeleteModal: false, selectedCourse: null });
    fetchCourses(); // Refresh courses list
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    contentContainer: {
      display: "flex",
      flex: 1,
    },
    tableSection: {
      width: "60%",
      paddingRight: theme.spacing.lg,
    },
    detailsSection: {
      width: "40%",
      borderLeft: `1px solid ${theme.colors.border}`,
      paddingLeft: theme.spacing.lg,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      padding: theme.spacing.xl,
    },
    errorContainer: {
      padding: theme.spacing.md,
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  };

  // Debug output
  console.log("Rendering CourseContentArea", {
    loading,
    error,
    coursesCount: courses.length,
    selectedCourse,
  });

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
        // Error message if there is one
        error && {
          type: "div",
          props: {
            style: styles.errorContainer,
            children: [`Error: ${error}. Using sample data for display.`],
          },
        },

        // Main content container
        {
          type: "div",
          props: {
            style: styles.contentContainer,
            children: loading
              ? [
                  // Loading state
                  {
                    type: "div",
                    props: {
                      style: styles.loadingContainer,
                      children: ["Loading courses..."],
                    },
                  },
                ]
              : [
                  // Left side - Course Table
                  {
                    type: "div",
                    props: {
                      style: styles.tableSection,
                      children: [
                        {
                          type: CourseTable,
                          props: {
                            courses: courses,
                            onRowClick: handleRowClick,
                            onAddClick: handleAddClick,
                          },
                        },
                      ],
                    },
                  },

                  // Right side - Focus Panel
                  {
                    type: "div",
                    props: {
                      style: styles.detailsSection,
                      children: [
                        {
                          type: CourseFocusPanel,
                          props: {
                            course: selectedCourse,
                            onEdit: handleEdit,
                            onDelete: handleDelete,
                          },
                        },
                      ],
                    },
                  },
                ],
          },
        },

        // Modals
        showAddModal && {
          type: AddCourse,
          props: {
            onClose: () => updateState({ showAddModal: false }),
            onSuccess: handleAddSuccess,
          },
        },
        showEditModal && {
          type: EditCourse,
          props: {
            course: selectedCourse,
            onClose: () => updateState({ showEditModal: false }),
            onSuccess: handleEditSuccess,
          },
        },
        showDeleteModal && {
          type: coursesDeleteConfirmation,
          props: {
            course: selectedCourse,
            onClose: () => updateState({ showDeleteModal: false }),
            onConfirm: handleDeleteSuccess,
          },
        },
      ].filter(Boolean),
    },
  };
};

window.CourseContentArea = CourseContentArea;
