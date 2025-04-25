// components/courses/CourseList.js
const CourseList = () => {
  // Enhanced course data
  const courses = [
    {
      id: "CS1205",
      code: "CS1205",
      name: "Data Structures and Algorithms",
      credits: 3,
      rating: 4,
      year: 1,
      semester: 2,
      duration: 40,
      lecturer: "Dr. John Smith",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-15 14:30:22",
      updated_at: "2025-02-10 09:45:17",
    },
    {
      id: "CS1206",
      code: "CS1206",
      name: "Advanced Database Systems",
      credits: 4,
      rating: 5,
      year: 1,
      semester: 2,
      duration: 30,
      lecturer: "Dr. Jane Doe",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-20 10:15:43",
      updated_at: "2025-03-05 11:20:35",
    },
    {
      id: "CS1207",
      code: "CS1207",
      name: "Machine Learning Fundamentals",
      credits: 4,
      rating: 3,
      year: 1,
      semester: 2,
      duration: 45,
      lecturer: "Prof. Michael Johnson",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-22 09:30:12",
      updated_at: "2025-01-22 09:30:12",
    },
    {
      id: "CS1208",
      code: "CS1208",
      name: "Web Development",
      credits: 3,
      rating: 5,
      year: 1,
      semester: 2,
      duration: 40,
      lecturer: "Dr. Sarah Williams",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-24 16:45:33",
      updated_at: "2025-01-24 16:45:33",
    },
    {
      id: "CS1209",
      code: "CS1209",
      name: "Computer Networks",
      credits: 3,
      rating: 4,
      year: 1,
      semester: 2,
      duration: 35,
      lecturer: "Prof. Robert Brown",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-27 11:20:54",
      updated_at: "2025-01-27 11:20:54",
    },
    {
      id: "CS1210",
      code: "CS1210",
      name: "Artificial Intelligence",
      credits: 4,
      rating: 5,
      year: 1,
      semester: 2,
      duration: 45,
      lecturer: "Dr. Emily Chen",
      semesterText: "2023/24 Second Semester",
      created_at: "2025-01-30 14:15:22",
      updated_at: "2025-01-30 14:15:22",
    },
  ];

  // Store courses in global context for access from CourseDetail
  window.allCourses = courses;

  // Define pattern backgrounds for course cards
  const patterns = [
    "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
    "linear-gradient(135deg, #FF6B6B 0%, #FF0000 100%)",
    "linear-gradient(135deg, #6BFF6B 0%, #00FF00 100%)",
    "linear-gradient(135deg, #FFDA6B 0%, #FFB800 100%)",
    "linear-gradient(135deg, #6BFFFF 0%, #00FFFF 100%)",
    "linear-gradient(135deg, #FF6BFF 0%, #FF00FF 100%)",
  ];

  const styles = {
    container: {
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      color: "#2c3e50",
    },
    courseGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    cardContent: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    patternTop: {
      height: "120px",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "24px",
    },
    contentBottom: {
      padding: "1rem",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    courseCode: {
      fontSize: "0.875rem",
      color: "#6c757d",
      marginBottom: "0.5rem",
    },
    courseName: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#2c3e50",
      textAlign: "center",
    },
    creditsContainer: {
      marginTop: "auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    credits: {
      fontSize: "0.875rem",
      color: "#495057",
    },
    rating: {
      display: "flex",
      justifyContent: "flex-end",
    },
    star: {
      color: "#FFD700",
    },
    emptyStar: {
      color: "#e0e0e0",
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
            style: styles.star,
            children: ["★"],
          },
        });
      } else {
        stars.push({
          type: "span",
          props: {
            style: styles.emptyStar,
            children: ["☆"],
          },
        });
      }
    }

    return stars;
  };

  // Fixed handleCourseClick function - using specific framework's navigation
  const handleCourseClick = (course) => {
    console.log(`Navigating to course: ${course.code}`);

    // Store selected course for CourseDetail to access
    window.selectedCourse = course;

    // IMPORTANT: Use the navigation method appropriate for your framework
    // Option 1: For basic navigation if using a simple framework like React
    // window.location.href = `/courses/${course.code}`;

    // Option 2: For custom routing in your MiniReact framework
    if (typeof navigation !== "undefined" && navigation.navigate) {
      navigation.navigate(`courses/${course.code}`, { course });
    } else {
      // Fallback - Try to find a custom router in your framework
      if (window.router && window.router.navigate) {
        window.router.navigate(`courses/${course.code}`, { course });
      } else if (window.app && window.app.navigate) {
        window.app.navigate(`courses/${course.code}`, { course });
      } else {
        // Last resort - direct location change with course data in sessionStorage
        sessionStorage.setItem("selectedCourse", JSON.stringify(course));
        window.location.href = `/courses/${course.code}`;
      }
    }

    // TESTING: If nothing else works, try to directly render CourseDetail here
    if (window.CourseDetail && typeof renderComponent === "function") {
      const container = document.getElementById("app") || document.body;
      renderComponent(
        window.CourseDetail,
        { courseId: course.id, course },
        container
      );
    }
  };

  // Manual hover handlers for custom hover effect
  const handleMouseOver = (e) => {
    const card = e.currentTarget;
    card.style.transform = "translateY(-4px)";
    card.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
    card.style.transition = "all 0.2s ease";
  };

  const handleMouseOut = (e) => {
    const card = e.currentTarget;
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    card.style.transition = "all 0.2s ease";
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
                  children: ["Available Courses"],
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: styles.courseGrid,
            children: courses.map((course, index) => ({
              type: "div", // Wrapper div with hover events
              props: {
                style: {
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                },
                onclick: () => handleCourseClick(course), // Pass the full course
                onmouseover: handleMouseOver,
                onmouseout: handleMouseOut,
                children: [
                  {
                    type: "div",
                    props: {
                      style: styles.cardContent,
                      children: [
                        // Top pattern section (40% of card)
                        {
                          type: "div",
                          props: {
                            style: {
                              ...styles.patternTop,
                              background: patterns[index % patterns.length],
                            },
                            children: [course.code],
                          },
                        },
                        // Bottom content section
                        {
                          type: "div",
                          props: {
                            style: styles.contentBottom,
                            children: [
                              // Course name (centered and bold)
                              {
                                type: "h3",
                                props: {
                                  style: styles.courseName,
                                  children: [course.name],
                                },
                              },
                              // Credits and rating in bottom right
                              {
                                type: "div",
                                props: {
                                  style: styles.creditsContainer,
                                  children: [
                                    {
                                      type: "div",
                                      props: {
                                        style: styles.credits,
                                        children: [
                                          `Credits: ${course.credits}`,
                                        ],
                                      },
                                    },
                                    {
                                      type: "div",
                                      props: {
                                        style: styles.rating,
                                        children: renderRating(course.rating),
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
                ],
              },
            })),
          },
        },
      ],
    },
  };
};

window.CourseList = CourseList;
