// components/courses/CourseDetail.js
const CourseDetail = ({ courseId, routeParams }) => {
  // Set initial active tab to "announcements"
  const [activeTab, setActiveTab] = MiniReact.useState("announcements");

  // Find the current active tab's label for the dropdown
  const getActiveTabLabel = () => {
    const activeTabObj = tabs.find((tab) => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : "📢 Course Announcements"; // Default to announcements
  };

  // Get the active tab icon - ensure this matches exactly with the labels
  const getActiveTabIcon = () => {
    // Find the icon from the label itself for consistency
    const activeTabObj = tabs.find((tab) => tab.id === activeTab);
    if (activeTabObj && activeTabObj.label) {
      // Extract the emoji at the beginning of the label
      const match = activeTabObj.label.match(
        /^([\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}])/u
      );
      if (match && match[1]) {
        return match[1];
      }
    }

    // Fallback to hardcoded values if we couldn't extract from the label
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
      // The URL has format: 127.0.0.1:5502/courses#courses/CS1205
      const urlPathParts = window.location.href.split("/");
      // Get the last part which should be CS1205
      return urlPathParts[urlPathParts.length - 1] || "Unknown";
    } catch (error) {
      console.error("Error extracting course code from URL:", error);

      // Try alternate methods if the first approach fails
      if (routeParams && routeParams.course && routeParams.course.code) {
        return routeParams.course.code;
      }

      if (courseId) {
        return courseId;
      }

      return "Unknown";
    }
  };

  const courseCode = getCourseCode();
  console.log("Extracted course code:", courseCode);

  // Predefined course data with the correct code from URL
  const course = {
    id: courseCode,
    code: courseCode, // Use the code we obtained
    name: "Sample Course",
    credits: 3,
    lecturer: "Dr. John Smith",
    semesterText: "2023/24 Second Semester",
    year: 1,
    semester: 2,
    duration: 40,
    rating: 4,
    created_at: "2025-01-15 14:30:22",
    updated_at: "2025-01-15 14:30:22",
  };

  const tabs = [
    { id: "announcements", label: " Course Announcements" },
    { id: "materials", label: " Study Materials" },
    { id: "assignments", label: " Assignments" },
    { id: "grades", label: " Grades" },
    { id: "feedback", label: " Feedback" },
  ];

  const selectStyles = {
    select: {
      fontSize: "18px",
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.primary}`,
      backgroundColor: "white",
      fontWeight: "500",
      cursor: "pointer",
      width: "100%",
      outline: "none",
      appearance: "none",
      backgroundImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px top 50%",
      backgroundSize: "12px auto",
      paddingRight: "30px",
    },
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
    highlightCode: {
      fontWeight: "bold",
      color: theme.colors.primary,
      fontSize: "1.2em",
    },
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < rating) {
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

  // Course information fields to display
  const courseFields = [
    {
      label: "Course Code",
      value: {
        type: "span",
        props: {
          style: detailStyles.highlightCode,
          children: [courseCode], // Using the directly extracted course code
        },
      },
    },
    { label: "Course Name", value: course.name },
    { label: "Credits", value: course.credits },
    { label: "Lecturer", value: course.lecturer },
    { label: "Semester", value: course.semesterText },
    { label: "Year", value: course.year },
    { label: "Duration (hours)", value: course.duration },
    { label: "Created At", value: course.created_at },
    { label: "Updated At", value: course.updated_at },
  ];

  const renderCourseDetails = () => {
    return {
      type: "div",
      props: {
        style: detailStyles.container,
        children: [
          // Section Header
          {
            type: "div",
            props: {
              style: detailStyles.header,
              children: ["Course Details"],
            },
          },

          // Course fields displayed line by line
          ...courseFields.map((field) => ({
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
                    children: [field.value],
                  },
                },
              ],
            },
          })),

          // Rating field with stars
          {
            type: "div",
            props: {
              style: detailStyles.fieldRow,
              children: [
                {
                  type: "div",
                  props: {
                    style: detailStyles.fieldLabel,
                    children: ["Rating"],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: detailStyles.fieldValue,
                    children: [renderRating(course.rating)],
                  },
                },
              ],
            },
          },
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
      feedback: Feedback, // Add Feedback component to the components mapping
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

  // Force initialize to announcements
  MiniReact.useEffect(() => {
    // This will ensure announcements is selected on initial load
    setActiveTab("announcements");
    console.log("Component mounted: activeTab set to announcements");
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
        // Page header - just the course title, no back button
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
                  children: [course.name],
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
              // Course Details Panel (Always visible at the top)
              renderCourseDetails(),

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
                          // We use a timeout to ensure the event completes properly
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
