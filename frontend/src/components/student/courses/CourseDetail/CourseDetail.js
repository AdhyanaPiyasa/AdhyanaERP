// components/courses/CourseDetail.js
const CourseDetail = ({ courseId }) => {
  const [activeTab, setActiveTab] = MiniReact.useState("announcements");

  const course = {
    code: "1205",
    name: "Data Structures and Algorithm",
    credits: 3,
    lecturer: "Dr. John Smith",
    semester: "2023/24 Second Semester",
  };

  const tabs = [
    { id: "announcements", label: "📢 Course Announcements" },
    { id: "materials", label: "📚 Study Materials" },
    { id: "assignments", label: "📝 Assignments" },
    { id: "grades", label: "📊 Grades" },
  ];

  // Find the current active tab's label for the dropdown
  const getActiveTabLabel = () => {
    const activeTabObj = tabs.find((tab) => tab.id === activeTab);
    return activeTabObj ? activeTabObj.label : "Select Option";
  };

  const selectStyles = {
    selectContainer: {
      position: "relative",
      marginBottom: theme.spacing.lg,
    },
    select: {
      fontSize: "18px",
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
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
    customDropdownToggle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.primary}`,
      backgroundColor: "white",
      fontWeight: "500",
      cursor: "pointer",
      marginBottom: theme.spacing.lg,
      position: "relative",
      fontSize: "18px",
    },
    dropdownIcon: {
      width: "12px",
      height: "12px",
      transition: "transform 0.3s ease",
    },
  };

  const renderContent = () => {
    const components = {
      announcements: CourseAnnouncements,
      materials: StudyMaterials,
      assignments: Assignments,
      grades: CourseGrades,
    };

    const SelectedComponent = components[activeTab];
    return SelectedComponent
      ? {
          type: SelectedComponent,
          props: { courseId },
        }
      : null;
  };

  return {
    type: Card,
    props: {
      children: [
        // Course Info Card
        {
          type: Card,
          props: {
            children: [
              {
                type: "h2",
                props: {
                  children: [course.name],
                },
              },
              {
                type: Card,
                type: "h4",
                props: {
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { flex: 1 },
                              children: [`Course Code: CS${course.code}`],
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: { flex: 1 },
                              children: [`Credits: ${course.credits}`],
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { flex: 1 },
                              children: [`Lecturer: ${course.lecturer}`],
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: { flex: 1 },
                              children: [`Semester: ${course.semester}`],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Enhanced Dropdown Component with custom label
        {
          type: "div",
          props: {
            style: {
              marginBottom: theme.spacing.lg,
              position: "relative",
            },
            children: [
              {
                type: "select",
                props: {
                  style: {
                    ...selectStyles.select,
                    color: "#2c3e50",
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingLeft: "50px", // Space for the icon
                  },
                  value: activeTab,
                  onchange: (e) => setActiveTab(e.target.value),
                  children: tabs.map((tab) => ({
                    type: "option",
                    props: {
                      value: tab.id,
                      children: [tab.label],
                    },
                  })),
                },
              },
              // Icon overlay
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    pointerEvents: "none",
                  },
                  children: [
                    activeTab === "announcements"
                      ? "📢"
                      : activeTab === "materials"
                      ? "📚"
                      : activeTab === "assignments"
                      ? "📝"
                      : "📊",
                  ],
                },
              },
            ],
          },
        },
        renderContent(),
      ].filter(Boolean),
    },
  };
};

window.CourseDetail = CourseDetail;
