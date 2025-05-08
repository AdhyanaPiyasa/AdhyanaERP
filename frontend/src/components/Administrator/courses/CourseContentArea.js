// Modified CourseContentArea with card-based layout
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

  // Define card-based layout styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.spacing.md,
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    cardsContainer: {
      display: "flex",
      gap: theme.spacing.md,
    },
    courseTableCard: {
      width: "60%",
      backgroundColor: "white",
      borderRadius: theme.spacing.sm,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    focusPanelCard: {
      width: "40%",
      backgroundColor: "white",
      borderRadius: theme.spacing.sm,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    cardHeader: {
      width: "100%",
      textAlign: "center",
      borderBottom: `1px solid ${theme.colors.border || "#eee"}`,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      fontSize: "18px",
      fontWeight: "bold",
    },
    cardContent: {
      padding: theme.spacing.md,
      width: "100%",
      height: "100%",
      overflow: "auto",
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

  // Create the card components
  const renderCards = () => {
    const cards = [
      // Course Table Card
      {
        type: "div",
        props: {
          style: styles.courseTableCard,
          children: [
            // Card header
            {
              type: "div",
              props: {
                style: styles.cardHeader,
                children: ["Course Listing"],
              },
            },
            // Card content - Course Table
            {
              type: "div",
              props: {
                style: styles.cardContent,
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
          ],
        },
      },

      // Course Focus Panel Card
      {
        type: "div",
        props: {
          style: styles.focusPanelCard,
          children: [
            // Card header
            {
              type: "div",
              props: {
                style: styles.cardHeader,
                children: ["Course Details"],
              },
            },
            // Card content - Focus Panel
            {
              type: "div",
              props: {
                style: styles.cardContent,
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
    ];

    return cards;
  };

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


        // Main content - loading or card layout
        loading
          ? {
              type: "div",
              props: {
                style: styles.loadingContainer,
                children: ["Loading courses..."],
              },
            }
          : {
              type: "div",
              props: {
                style: styles.cardsContainer,
                children: renderCards(),
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
