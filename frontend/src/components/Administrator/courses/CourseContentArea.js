// components/Admin/courses/CourseContentArea.js
const CourseContentArea = ({ state, setState }) => {
  // Use state from props or fallback to local state if not provided
  const showAddModal = state?.showAddModal || false;
  const showEditModal = state?.showEditModal || false;
  const showDeleteModal = state?.showDeleteModal || false;
  const selectedCourse = state?.selectedCourse || null;

  // Function to update parent state
  const updateState = (updates) => {
    if (setState) {
      setState((prevState) => ({
        ...prevState,
        ...updates,
      }));
    }
  };

  // Sample course data with ratings
  const courses = [
    {
      id: 1,
      code: 101,
      name: "Introduction to Programming",
      year: 1,
      semester: 1,
      credits: 3,
      duration: 45,
      rating: 4,
      created_at: "2025-01-15 14:30:22",
      updated_at: "2025-02-10 09:45:17",
    },
    {
      id: 2,
      code: 201,
      name: "Data Structures",
      year: 2,
      semester: 1,
      credits: 4,
      duration: 60,
      rating: 5,
      created_at: "2025-01-20 10:15:43",
      updated_at: "2025-03-05 11:20:35",
    },
    {
      id: 3,
      code: 301,
      name: "Calculus I",
      year: 1,
      semester: 2,
      credits: 3,
      duration: 45,
      rating: 3,
      created_at: "2025-01-25 08:45:11",
      updated_at: "2025-01-25 08:45:11",
    },
    {
      id: 4,
      code: 401,
      name: "Physics I",
      year: 2,
      semester: 2,
      credits: 4,
      duration: 60,
      rating: 4,
      created_at: "2025-01-25 08:45:11",
      updated_at: "2025-01-25 08:45:11",
    },
  ];

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

  const styles = {
    container: {
      display: "flex",
      height: "100%",
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
  };

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
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

        // Modals
        showAddModal && {
          type: AddCourse,
          props: {
            onClose: () => updateState({ showAddModal: false }),
          },
        },
        showEditModal && {
          type: EditCourse,
          props: {
            course: selectedCourse,
            onClose: () => updateState({ showEditModal: false }),
          },
        },
        showDeleteModal && {
          type: coursesDeleteConfirmation,
          props: {
            onClose: () => updateState({ showDeleteModal: false }),
            onConfirm: () => {
              console.log("Deleting course:", selectedCourse);
              updateState({ showDeleteModal: false, selectedCourse: null });
            },
          },
        },
      ].filter(Boolean),
    },
  };
};

window.CourseContentArea = CourseContentArea;
