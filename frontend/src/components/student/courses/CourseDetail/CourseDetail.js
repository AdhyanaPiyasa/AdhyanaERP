const CourseDetail = ({ courseId, routeParams }) => {
  // Set initial states
  const [activeTab, setActiveTab] = MiniReact.useState("announcements");
  const [course, setCourse] = MiniReact.useState(null);
  const [semesterDetails, setSemesterDetails] = MiniReact.useState([]);
  const [loading, setLoading] = MiniReact.useState(true);
  const [error, setError] = MiniReact.useState(null);
  // Add state for teacher information
  const [instructorInfo, setInstructorInfo] = MiniReact.useState({});

  // Find the current active tab's label for the dropdown
  const getActiveTabLabel = () => {
    const activeTabObj = tabs.find((tab) => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : "📢 Course Announcements"; // Default to announcements
  };

  // Get the active tab icon
  const getActiveTabIcon = () => {
    const activeTabObj = tabs.find((tab) => tab.id === activeTab);
    if (activeTabObj && activeTabObj.label) {
      const match = activeTabObj.label.match(
        /^([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}])/u
      );
      if (match && match[1]) {
        return match[1];
      }
    }

    // Fallback to hardcoded values
    switch (activeTab) {
      case "announcements":
        return "📢";
      case "materials":
        return "📚";
      case "assignments":
        return "📝";
      case "grades":
        return "📊";
      case "feedback":
        return "⭐";
      default:
        return "📄";
    }
  };

  // Get course code directly from URL path
  const getCourseCode = () => {
    try {
      const urlPathParts = window.location.href.split("/");
      return urlPathParts[urlPathParts.length - 1] || "Unknown";
    } catch (error) {
      console.error("Error extracting course code from URL:", error);

      if (routeParams && routeParams.course && routeParams.course.code) {
        return routeParams.course.code;
      }

      if (courseId) {
        return courseId;
      }

      return "Unknown";
    }
  };

  // Get userId from localStorage
  const getUserId = () => {
    try {
      // First try to get the user object
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.studentIndex) {
          return user.studentIndex;
        } else if (user.id) {
          return user.id;
        }
      }

      // If user object doesn't have the needed property, try userId directly
      const userId = localStorage.getItem("userId");
      if (userId) {
        return userId;
      }

      return null;
    } catch (error) {
      console.error("Error getting user ID from localStorage:", error);
      return null;
    }
  };

  // Fetch course details from the API
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const extractedCourseId = getCourseCode();
      console.log("Fetching details for course:", extractedCourseId);

      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8081/api/api/courses/courseCore/${extractedCourseId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch course details: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch course details");
      }

      console.log("Course details fetched successfully:", data.data);
      setCourse(data.data);

      // After successful course fetch, get semester details
      fetchSemesterDetails(extractedCourseId);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch semester offerings (teacher/staff details)
  const fetchSemesterOfferings = async (semesterId) => {
    try {
      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8081/api/api/courses/semesters/${semesterId}`;

      console.log(`Fetching offerings for semester: ${semesterId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch semester offerings: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch semester offerings");
      }

      console.log(`Semester offerings fetched for ${semesterId}:`, data.data);

      // Extract instructor info from offerings
      if (data.data && data.data.offerings && data.data.offerings.length > 0) {
        const extractedCourseId = getCourseCode();
        const courseOffering = data.data.offerings.find(
          (offering) => offering.courseId === extractedCourseId
        );

        if (courseOffering) {
          console.log(
            `Found offering for course ${extractedCourseId} in semester ${semesterId}:`,
            courseOffering
          );

          // Update instructor info state
          setInstructorInfo((prevState) => ({
            ...prevState,
            [semesterId]: courseOffering.teacherName,
          }));
        } else {
          console.log(
            `No offering found for course ${extractedCourseId} in semester ${semesterId}`
          );
        }
      }
    } catch (err) {
      console.error(
        `Error fetching offerings for semester ${semesterId}:`,
        err
      );
    }
  };

  // Fetch semester details for this student and course
  const fetchSemesterDetails = async (extractedCourseId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      console.log(
        `Fetching semester details for student ${userId} and course ${extractedCourseId}`
      );

      const token = localStorage.getItem("token") || "";
      const url = `http://localhost:8081/api/api/courses/studentCourses/student/${userId}/course/${extractedCourseId}/semesters`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch semester details: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch semester details");
      }

      console.log("Semester details fetched successfully:", data.data);
      setSemesterDetails(data.data);

      // After getting semester details, fetch offerings for each semester to get teacher info
      if (data.data && data.data.length > 0) {
        data.data.forEach((semester) => {
          fetchSemesterOfferings(semester.semesterId);
        });
      }
    } catch (err) {
      console.error("Error fetching semester details:", err);
      // Not setting error state here as we still want to show course details
      // even if semester details fail to load
    }
  };

  const courseCode = getCourseCode();
  console.log("Extracted course code:", courseCode);

  const tabs = [
    { id: "announcements", label: "📢 Course Announcements" },
    { id: "materials", label: "📚 Study Materials" },
    { id: "assignments", label: "📝 Assignments" },
    { id: "grades", label: "📊 Grades" },
    { id: "feedback", label: "⭐ Feedback" },
  ];

  const selectStyles = {
    dropdownBox: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "2px solid #0066CC",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      cursor: "pointer",
      position: "relative",
    },
    dropdownText: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#2c3e50",
      marginLeft: "10px",
      flex: 1,
    },
    dropdownArrow: {
      color: "#0066CC",
      fontSize: "12px",
      marginLeft: "auto",
    },
    hiddenSelect: {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
    },
  };

  // Styles for the detailed course information display
  const detailStyles = {
    container: {
      padding: "1.5rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      marginBottom: theme.spacing.lg,
    },
    pageHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    header: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      color: theme.colors.primary,
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: "0.75rem",
    },
    fieldRow: {
      display: "flex",
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: "0.75rem 0",
    },
    fieldLabel: {
      width: "40%",
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    fieldValue: {
      width: "60%",
      display: "flex",
      alignItems: "center",
    },
    rating: {
      display: "flex",
      gap: "4px",
    },
    star: {
      color: "#FFD700",
    },
    emptyStar: {
      color: "#e0e0e0",
    },
    statusChip: (status) => ({
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "16px",
      fontSize: "0.8rem",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor:
        status === "ACTIVE"
          ? "#4CAF50"
          : status === "COMPLETED"
          ? "#2196F3"
          : status === "PLANNED"
          ? "#FF9800"
          : "#9E9E9E",
    }),
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const ratingValue = rating || 0;

    for (let i = 0; i < 5; i++) {
      if (i < ratingValue) {
        stars.push({
          type: "span",
          props: {
            style: detailStyles.star,
            children: ["★"],
          },
        });
      } else {
        stars.push({
          type: "span",
          props: {
            style: detailStyles.emptyStar,
            children: ["☆"],
          },
        });
      }
    }

    return {
      type: "div",
      props: {
        style: detailStyles.rating,
        children: stars,
      },
    };
  };

  // Combined render function for course and semester details
  const renderCourseAndSemesterDetails = () => {
    if (loading) {
      return {
        type: "div",
        props: {
          style: detailStyles.container,
          children: [
            {
              type: "div",
              props: {
                style: { textAlign: "center", padding: "1rem" },
                children: ["Loading course details..."],
              },
            },
          ],
        },
      };
    }

    if (error && !course) {
      return {
        type: "div",
        props: {
          style: detailStyles.container,
          children: [
            {
              type: "div",
              props: {
                style: { color: "red", textAlign: "center", padding: "1rem" },
                children: [`Error loading course: ${error}`],
              },
            },
          ],
        },
      };
    }

    if (!course) {
      return {
        type: "div",
        props: {
          style: detailStyles.container,
          children: [
            {
              type: "div",
              props: {
                style: { textAlign: "center", padding: "1rem" },
                children: ["No course details available."],
              },
            },
          ],
        },
      };
    }

    // Create all fields in a single array
    const allFields = [
      { label: "Course Code", value: course.courseId },
      { label: "Course Name", value: course.name },
      { label: "Duration (hours)", value: course.duration },
      { label: "Credits", value: course.credits },
      { label: "Year", value: course.year },
    ];

    // Add semester fields if available
    if (semesterDetails && semesterDetails.length > 0) {
      semesterDetails.forEach((semester, index) => {
        allFields.push(
          {
            label: "Semester Number",
            value: semester.semesterNum,
          },
          {
            label: "Academic Year ",
            value: semester.academicYear,
          },
          {
            label: "Start Date ",
            value: formatDate(semester.startDate),
          },
          {
            label: "End Date ",
            value: formatDate(semester.endDate),
          },
          {
            label: "Instructor ",
            value: instructorInfo[semester.semesterId] || "Loading...",
          },
          {
            label: "Status ",
            value: {
              type: "span",
              props: {
                style: detailStyles.statusChip(semester.status),
                children: [semester.status],
              },
            },
          }
        );
      });
    } else {
      // Add a placeholder if no semester data
      allFields.push({
        label: "Semester Enrollment",
        value: "No semester enrollment data available",
      });
    }
    allFields.push({ label: "Rating", value: renderRating(course.avgRating) });

    return {
      type: "div",
      props: {
        style: detailStyles.container,
        children: [
          // SINGLE HEADER FOR ALL DETAILS
          {
            type: "div",
            props: {
              style: detailStyles.header,
              children: ["Course Information"],
            },
          },

          // All fields in one list
          ...allFields.map((field) => ({
            type: "div",
            props: {
              style: detailStyles.fieldRow,
              children: [
                {
                  type: "div",
                  props: {
                    style: detailStyles.fieldLabel,
                    children: [field.label],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: detailStyles.fieldValue,
                    children:
                      typeof field.value === "object"
                        ? [field.value]
                        : [field.value],
                  },
                },
              ],
            },
          })),
        ],
      },
    };
  };

  const renderContent = () => {
    // Log the current activeTab for debugging
    console.log("Current activeTab:", activeTab);

    const components = {
      announcements: CourseAnnouncements,
      materials: StudyMaterials,
      assignments: Assignments,
      grades: CourseGrades,
      feedback: Feedback,
    };

    // Check if component exists
    const SelectedComponent = components[activeTab];
    console.log(
      "Selected component:",
      SelectedComponent
        ? SelectedComponent.name || "Component exists"
        : "Component not found"
    );

    if (!SelectedComponent && activeTab === "announcements") {
      console.log("Fallback to CourseAnnouncements via window object");
      return {
        type: window.CourseAnnouncements,
        props: { courseId },
      };
    }

    // Try to fetch from window object if component not found in local scope
    if (
      !SelectedComponent &&
      window[activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]
    ) {
      console.log(`Fallback to ${activeTab} via window object`);
      return {
        type: window[activeTab.charAt(0).toUpperCase() + activeTab.slice(1)],
        props: { courseId },
      };
    }

    return SelectedComponent
      ? {
          type: SelectedComponent,
          props: { courseId },
        }
      : null;
  };

  // Force initialize to announcements and fetch course data
  MiniReact.useEffect(() => {
    // This will ensure announcements is selected on initial load
    setActiveTab("announcements");
    // Fetch course details
    fetchCourseDetails();
    console.log(
      "Component mounted: activeTab set to announcements and fetching course data"
    );
  }, []);

  return {
    type: "div",
    props: {
      style: {
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      },
      children: [
        // Page header - just the course title
        {
          type: "div",
          props: {
            style: detailStyles.pageHeader,
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  },
                  children: [course ? course.name : "Loading course..."],
                },
              },
            ],
          },
        },

        // Card wrapper for main content
        {
          type: Card,
          props: {
            children: [
              // Combined Course Details & Semester Details Panel
              renderCourseAndSemesterDetails(),

              // Custom Dropdown with Hidden Select
              {
                type: "div",
                props: {
                  style: selectStyles.dropdownBox,
                  children: [
                    // Visible dropdown display
                    {
                      type: "span",
                      props: {
                        children: [getActiveTabIcon()],
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: selectStyles.dropdownText,
                        children: [getActiveTabLabel()],
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: selectStyles.dropdownArrow,
                        children: ["▼"],
                      },
                    },
                    // Hidden but functional select element
                    {
                      type: "select",
                      props: {
                        style: selectStyles.hiddenSelect,
                        value: activeTab,
                        onchange: (e) => {
                          // Explicitly log the selected value for debugging
                          console.log("Selected tab:", e.target.value);

                          // Force a re-render by setting state
                          setTimeout(() => {
                            setActiveTab(e.target.value);
                          }, 0);
                        },
                        onclick: (e) => {
                          // Prevent any event bubbling issues
                          e.stopPropagation();
                        },
                        children: tabs.map((tab) => ({
                          type: "option",
                          props: {
                            value: tab.id,
                            selected:
                              activeTab === tab.id ||
                              (activeTab === "" && tab.id === "announcements"),
                            children: [tab.label],
                          },
                        })),
                      },
                    },
                  ],
                },
              },

              // Tab Content
              renderContent(),
            ].filter(Boolean),
          },
        },
      ],
    },
  };
};

window.CourseDetail = CourseDetail;
