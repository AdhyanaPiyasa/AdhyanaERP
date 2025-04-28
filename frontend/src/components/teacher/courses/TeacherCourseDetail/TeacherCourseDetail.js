// components/teacher/courses/TeacherCourseDetail/TeacherCourseDetail.js
const TeacherCourseDetail = () => {
  const [activeTab, setActiveTab] = MiniReact.useState("attendance");
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] =
    MiniReact.useState(false);

  const params = navigation.getParams();
  const courseId = params.id || "1205";

  // Get course code directly from URL path or params
  const getCourseCode = () => {
    try {
      // The URL has format: 127.0.0.1:5502/courses#courses/CS1205
      const urlPathParts = window.location.href.split("/");
      // Get the last part which should be CS1205
      return urlPathParts[urlPathParts.length - 1] || courseId;
    } catch (error) {
      console.error("Error extracting course code from URL:", error);
      return courseId;
    }
  };

  const courseCode = getCourseCode();
  console.log("Extracted course code:", courseCode);

  // Get course details from global teacher courses array
  const getCourseDetails = () => {
    // Try to find the course in the global teacherCourses array
    if (window.teacherCourses && Array.isArray(window.teacherCourses)) {
      const course = window.teacherCourses.find(
        (c) => c.id === courseId || c.code === courseId
      );
      if (course) return course;
    }

    // Fallback to default details if course not found
    return {
      id: courseId,
      code: courseCode,
      name: "Data Structures and Algorithm",
      credits: 3,
      rating: 4,
      year: 2,
      semester: 1,
      duration: 40,
      lecturer: "Dr. John Smith",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-15 14:30:22",
      updated_at: "2025-02-10 09:45:17",
    };
  };

  const courseDetails = getCourseDetails();

  const menuItems = [
    { id: "attendance", title: "Attendance" },
    { id: "materials", title: "Study Materials" },
    { id: "announcements", title: "Announcements" },
    { id: "assignments", title: "Assignments" }
  ];

  // Set active tab based on URL if available
  MiniReact.useEffect(() => {
    const route = navigation.getCurrentRoute();
    const tabMatch = route.match(/courses\/\w+\/(\w+)/);
    if (tabMatch && tabMatch[1]) {
      setActiveTab(tabMatch[1]);
    }
  }, []);

  // Handle create announcement button click
  const handleCreateAnnouncementClick = () => {
    setShowAddAnnouncementModal(true);
  };

  // Handle close announcement modal
  const handleCloseAnnouncementModal = () => {
    setShowAddAnnouncementModal(false);
  };

  // Styles for the detailed course information display
  const detailStyles = {
    container: {
      padding: "1.5rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      marginBottom: "1.5rem",
    },
    header: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      color: "#0066CC",
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "0.75rem",
    },
    fieldRow: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
      padding: "0.75rem 0",
    },
    fieldLabel: {
      width: "40%",
      fontWeight: "bold",
      color: "#6c757d",
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
      color: "#0066CC",
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
          children: [courseDetails.code],
        },
      },
    },
    { label: "Course Name", value: courseDetails.name },
    { label: "Credits", value: courseDetails.credits },
    { label: "Lecturer", value: courseDetails.lecturer },
    { label: "Semester", value: courseDetails.semesterText },
    { label: "Year", value: courseDetails.year },
    { label: "Duration (hours)", value: courseDetails.duration },
    { label: "Created At", value: courseDetails.created_at },
    { label: "Updated At", value: courseDetails.updated_at },
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
                    children: [renderRating(courseDetails.rating)],
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
    switch (activeTab) {
      case "attendance":
        return { type: AttendanceManager, props: { courseId } };
      case "grades":
        return { type: GradingSheet, props: { courseId } };
      case "materials":
        return { type: MaterialList, props: { courseId } };
      case "announcements":
        // Pass the create announcement handler to the AnnouncementList component
        return {
          type: "div",
          props: {
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  },
                  children: [
                    {
                      type: "h2",
                      props: {
                        children: ["Course Announcements"],
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: handleCreateAnnouncementClick,
                        children: ["Create Announcement"],
                      },
                    },
                  ],
                },
              },
              {
                type: AnnouncementList,
                props: { courseId },
              },
            ],
          },
        };
      case "assignments":
        return { type: AttendanceManager, props: { courseId } };
      default:
        return { type: AttendanceManager, props: { courseId } };
    }
  };

  const renderMenuItem = (item) => ({
    type: Card,
    props: {
      variant: activeTab === item.id ? "primary" : "default",
      onClick: () => {
        setActiveTab(item.id);
        // This is the key fix - use proper navigation path format
        navigation.navigate(`courses/${courseId}`);
      },
      children: [
        {
          type: "div",
          props: {
            children: [item.title],
          },
        },
      ],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      },
      children: [
        // Page Header with Course Name
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  },
                  children: [courseDetails.name],
                },
              },
            ],
          },
        },
        // Card with Course Details
        {
          type: Card,
          props: {
            children: [
              // Detailed Course Information Panel
              renderCourseDetails(),
            ],
          },
        },
        // Original menu items (preserved as requested)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            children: menuItems.map(renderMenuItem),
          },
        },
        // Content area based on active tab
        {
          type: Card,
          props: {
            children: [renderContent()],
          },
        },

        // Render AddAnnouncement modal conditionally
        showAddAnnouncementModal && {
          type: AddAnnouncement,
          props: {
            courseId: courseId,
            onClose: handleCloseAnnouncementModal,
          },
        },
      ].filter(Boolean),
    },
  };
};

window.TeacherCourseDetail = TeacherCourseDetail;

components / teacher / courses / TeacherCourseDetail / TeacherCourseDetail.js;
components / teacher / courses / TeacherCourseDetail / TeacherCourseDetail.js;
components / teacher / courses / TeacherCourseDetail / TeacherCourseDetail.js;
