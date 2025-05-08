// components/courses/CourseList.js
const CourseList = () => {
  // State for managing courses and UI
  const [courses, setCourses] = MiniReact.useState([]);
  const [loading, setLoading] = MiniReact.useState(true);
  const [error, setError] = MiniReact.useState(null);
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");

  // Fetch enrolled courses for a student
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);

      // Get student ID from localStorage, fallback to test ID if not found
      const studentId = localStorage.getItem("userId") || "20240001";
      const token = localStorage.getItem("token") || "";

      // API endpoint that gets courses by student ID only (no semester)
      const url = `http://localhost:8081/api/api/courses/studentCourses/student/${studentId}`;

      console.log("Fetching enrolled courses for student:", studentId);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch courses: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      console.log("Courses fetched successfully:", data.data);
      setCourses(data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load courses when component mounts
  MiniReact.useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Filter courses based on search criteria
  const filteredCourses =
    searchQuery.trim() === ""
      ? courses
      : courses.filter((course) => {
          const query = searchQuery.toLowerCase();
          const courseCode = (course.code || course.courseId || "")
            .toString()
            .toLowerCase();
          const courseName = (course.name || "").toString().toLowerCase();
          const courseYear = (course.year || "").toString().toLowerCase();

          if (searchField === "all") {
            return (
              courseCode.includes(query) ||
              courseName.includes(query) ||
              courseYear.includes(query)
            );
          } else if (searchField === "code" || searchField === "courseId") {
            return courseCode.includes(query);
          } else if (searchField === "name") {
            return courseName.includes(query);
          } else if (searchField === "year") {
            return courseYear.includes(query);
          }

          return false;
        });

  // Handle course card click - navigate to course details
  const handleCourseClick = (course) => {
    const courseId = course.courseId || course.code;
    console.log(`Navigating to course: ${courseId}`);

    // Store selected course for CourseDetail to access
    window.selectedCourse = course;

    // Use navigation if available, otherwise fallback to direct URL change
    if (typeof navigation !== "undefined" && navigation.navigate) {
      navigation.navigate(`courses/${courseId}`, { course });
    } else {
      // Store course data in sessionStorage for access by CourseDetail
      sessionStorage.setItem("selectedCourse", JSON.stringify(course));
      window.location.href = `/courses/${courseId}`;
    }
  };

  // Course card gradient patterns
  const cardPatterns = [
    "linear-gradient(135deg,rgb(175, 175, 179) 0%,rgb(173, 175, 248) 100%)",
    "linear-gradient(135deg,rgb(181, 162, 162) 0%,rgb(248, 190, 190) 100%)",
    "linear-gradient(135deg,rgb(163, 197, 163) 0%,rgb(195, 242, 195) 100%)",
    "linear-gradient(135deg,rgb(234, 227, 206) 0%,rgb(247, 221, 153) 100%)",
    "linear-gradient(135deg,rgb(156, 187, 187) 0%,rgb(176, 243, 243) 100%)",
    "linear-gradient(135deg,rgb(207, 176, 207) 0%,rgb(230, 180, 230) 100%)",
  ];

  // Render star rating (0-5 stars)
  const renderRating = (rating) => {
    if (!rating && rating !== 0) return [];

    const numericRating =
      typeof rating === "string" ? parseFloat(rating) : rating;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push({
        type: "span",
        props: {
          style: {
            color: i < numericRating ? "#FFD700" : "#e0e0e0",
            marginRight: "2px",
          },
          children: [i < numericRating ? "★" : "☆"],
        },
      });
    }

    return stars;
  };

  // Styles for the component
  const styles = {
    container: {
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      color: "#2c3e50",
      margin: 0,
    },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    searchSelect: {
      padding: "0.5rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#f8f9fa",
    },
    searchInput: {
      padding: "0.5rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      width: "200px",
    },
    courseGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    card: {
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
      height: "100%",
    },
    cardHeader: {
      height: "120px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#051e44",
      fontWeight: "bold",
      fontSize: "24px",
    },
    cardBody: {
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      height: "calc(100% - 120px)",
    },
    courseName: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      textAlign: "center",
      color: "#2c3e50",
    },
    courseDetail: {
      fontSize: "0.875rem",
      color: "#495057",
      marginBottom: "0.5rem",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
    },
    rating: {
      marginTop: "auto",
      display: "flex",
      justifyContent: "center",
    },
    statusMessage: {
      width: "100%",
      padding: "2rem",
      textAlign: "center",
      color: "#6c757d",
      fontSize: "1.25rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
    },
    errorMessage: {
      width: "100%",
      padding: "2rem",
      textAlign: "center",
      color: "#dc3545",
      fontSize: "1.25rem",
      backgroundColor: "#f8d7da",
      borderRadius: "8px",
    },
  };

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
        // Header with title and search
        {
          type: "div",
          props: {
            style: styles.header,
            children: [
              // Title
              {
                type: "h1",
                props: {
                  style: styles.title,
                  children: ["My Enrolled Courses"],
                },
              },
              // Search controls
              {
                type: "div",
                props: {
                  style: styles.searchContainer,
                  children: [
                    // Search field selector
                    {
                      type: "select",
                      props: {
                        style: styles.searchSelect,
                        value: searchField,
                        onchange: (e) => setSearchField(e.target.value),
                        children: [
                          {
                            type: "option",
                            props: { value: "all", children: ["All Fields"] },
                          },
                          {
                            type: "option",
                            props: { value: "code", children: ["Course Code"] },
                          },
                          {
                            type: "option",
                            props: { value: "name", children: ["Course Name"] },
                          },
                          {
                            type: "option",
                            props: { value: "year", children: ["Year"] },
                          },
                        ],
                      },
                    },
                    // Search input
                    {
                      type: "input",
                      props: {
                        type: "text",
                        placeholder: "Search courses...",
                        style: styles.searchInput,
                        value: searchQuery,
                        onchange: (e) => setSearchQuery(e.target.value),
                        onkeydown: (e) =>
                          e.key === "Enter" && e.preventDefault(),
                      },
                    },
                    // Clear search button
                    searchQuery
                      ? {
                          type: "button",
                          props: {
                            style: {
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#6c757d",
                              fontSize: "1rem",
                            },
                            onclick: () => setSearchQuery(""),
                            children: ["✕"],
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
            ],
          },
        },

        // Loading state
        loading
          ? {
              type: "div",
              props: {
                style: styles.statusMessage,
                children: ["Loading your courses..."],
              },
            }
          : null,

        // Error state
        error
          ? {
              type: "div",
              props: {
                style: styles.errorMessage,
                children: [error],
              },
            }
          : null,

        // Course grid
        !loading && !error && filteredCourses.length > 0
          ? {
              type: "div",
              props: {
                style: styles.courseGrid,
                children: filteredCourses.map((course, index) => {
                  const courseId = course.courseId || course.code;

                  return {
                    type: "div",
                    props: {
                      style: styles.card,
                      onclick: () => handleCourseClick(course),
                      // onmouseover: (e) => {
                      //   e.currentTarget.style.transform = "translateY(-4px)";
                      //   e.currentTarget.style.boxShadow =
                      //     "0 8px 16px rgba(0,0,0,0.1)";
                      // },
                      // onmouseout: (e) => {
                      //   e.currentTarget.style.transform = "translateY(0)";
                      //   e.currentTarget.style.boxShadow =
                      //     "0 4px 8px rgba(0,0,0,0.1)";
                      // },
                      children: [
                        // Card header with course code
                        {
                          type: "div",
                          props: {
                            style: {
                              ...styles.cardHeader,
                              background:
                                cardPatterns[index % cardPatterns.length],
                            },
                            children: [courseId],
                          },
                        },
                        // Card body with course details
                        {
                          type: "div",
                          props: {
                            style: styles.cardBody,
                            children: [
                              // Course name
                              {
                                type: "h3",
                                props: {
                                  style: styles.courseName,
                                  children: [course.name],
                                },
                              },
                              // Course details
                              {
                                type: "div",
                                props: {
                                  style: styles.detailRow,
                                  children: [
                                    {
                                      type: "span",
                                      props: {
                                        style: styles.courseDetail,
                                        children: [`Year: ${course.year}`],
                                      },
                                    },
                                    {
                                      type: "span",
                                      props: {
                                        style: styles.courseDetail,
                                        children: [
                                          `Credits: ${course.credits}`,
                                        ],
                                      },
                                    },
                                  ],
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: styles.courseDetail,
                                  children: [
                                    `Duration: ${course.duration} hours`,
                                  ],
                                },
                              },
                              // Rating stars
                              {
                                type: "div",
                                props: {
                                  style: styles.rating,
                                  children: renderRating(
                                    course.avgRating || course.rating || 0
                                  ),
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  };
                }),
              },
            }
          : null,

        // No courses message
        !loading && !error && filteredCourses.length === 0
          ? {
              type: "div",
              props: {
                style: styles.statusMessage,
                children: ["You aren't enrolled in any courses."],
              },
            }
          : null,
      ].filter(Boolean),
    },
  };
};

window.CourseList = CourseList;
