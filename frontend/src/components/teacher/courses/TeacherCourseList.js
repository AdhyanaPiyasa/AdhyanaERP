// components/teacher/courses/TeacherCourseList.js
const TeacherCourseList = () => {
  // State for search functionality
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");

  // Enhanced course data with more information
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
      year: 2,
      semester: 1,
      duration: 30,
      lecturer: "Dr. Jane Doe",
      semesterText: "2024/25 First Semester",
      created_at: "2025-01-20 10:15:43",
      updated_at: "2025-03-05 11:20:35",
    },
    {
      id: "CS1207",
      code: "CS1207",
      name: "Machine Learning Fundamentals",
      credits: 4,
      rating: 3,
      year: 3,
      semester: 2,
      duration: 45,
      lecturer: "Prof. Michael Johnson",
      semesterText: "2024/25 Second Semester",
      created_at: "2025-01-22 09:30:12",
      updated_at: "2025-01-22 09:30:12",
    },
  ];

  // Filter courses based on search criteria
  const filteredCourses =
    searchQuery.trim() === ""
      ? courses
      : courses.filter((course) => {
          const query = searchQuery.toLowerCase();

          if (searchField === "all") {
            return (
              (course.code && course.code.toLowerCase().includes(query)) ||
              (course.name && course.name.toLowerCase().includes(query))
            );
          }

          // Safety check to ensure the field exists
          if (course[searchField] === undefined) {
            return false;
          }

          // Handle both string and non-string types
          const fieldValue = course[searchField].toString().toLowerCase();
          return fieldValue.includes(query);
        });

  // Define pattern backgrounds for course cards
  const patterns = [
    "linear-gradient(135deg,rgb(175, 175, 179) 0%,rgb(173, 175, 248) 100%)",
    "linear-gradient(135deg,rgb(181, 162, 162) 0%,rgb(248, 190, 190) 100%)",
    "linear-gradient(135deg,rgb(163, 197, 163) 0%,rgb(195, 242, 195) 100%)",
    "linear-gradient(135deg,rgb(234, 227, 206) 0%,rgb(247, 221, 153) 100%)",
    "linear-gradient(135deg,rgb(156, 187, 187) 0%,rgb(176, 243, 243) 100%)",
    "linear-gradient(135deg,rgb(207, 176, 207) 0%,rgb(230, 180, 230) 100%)",
  ];

  // Store courses in global context for access from CourseDetail
  window.teacherCourses = courses;

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
      color: "rgb(5, 30, 68)",
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
    metaContainer: {
      marginTop: "auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    yearInfo: {
      fontSize: "0.875rem",
      color: "#495057",
    },
    noResultsMessage: {
      width: "100%",
      padding: "2rem",
      textAlign: "center",
      color: "#6c757d",
      fontSize: "1.25rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      marginTop: "1rem",
    },
  };

  // Handle select field change
  const handleSearchFieldChange = (e) => {
    const newValue = e.target.value;
    console.log("Search field changed to:", newValue);
    setSearchField(newValue);
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const newValue = e.target.value;
    console.log("Search query changed to:", newValue);
    setSearchQuery(newValue);
  };

  // Handle keydown to prevent Enter key from triggering search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter key pressed - preventing default behavior");
      return false;
    }
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    const inputElement = document.querySelector(
      'input[type="text"][placeholder="Search courses..."]'
    );
    if (inputElement) {
      const value = inputElement.value;
      console.log("Executing search with query:", value);
      setSearchQuery(value);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    console.log("Clearing search");
    setSearchQuery("");

    // Also clear the input field
    const inputElement = document.querySelector(
      'input[type="text"][placeholder="Search courses..."]'
    );
    if (inputElement) {
      inputElement.value = "";
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

  // Navigate to course detail
  const handleCourseClick = (course) => {
    console.log(`Navigating to course: ${course.code}`);

    // Store selected course for CourseDetail to access
    window.selectedTeacherCourse = course;

    // Navigate to course detail page
    if (typeof navigation !== "undefined" && navigation.navigate) {
      navigation.navigate(`courses/${course.id}`);
    }
  };

  return {
    type: "div",
    props: {
      style: styles.container,
      // Prevent the entire container from acting like a form
      onclick: (e) => e.stopPropagation(),
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
                  children: ["My Teaching Courses"],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "select",
                      props: {
                        style: {
                          padding: "0.5rem",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          marginRight: "0.5rem",
                        },
                        value: searchField,
                        children: [
                          {
                            type: "option",
                            props: {
                              value: "all",
                              selected: searchField === "all",
                              children: ["All Fields"],
                            },
                          },
                          {
                            type: "option",
                            props: {
                              value: "code",
                              selected: searchField === "code",
                              children: ["Course Code"],
                            },
                          },
                          {
                            type: "option",
                            props: {
                              value: "name",
                              selected: searchField === "name",
                              children: ["Course Name"],
                            },
                          },
                        ],
                        onchange: handleSearchFieldChange,
                        onclick: (e) => {
                          // Prevent default to avoid dropdown closing before selection
                          e.stopPropagation();
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                        },
                        children: [
                          {
                            type: "input",
                            props: {
                              type: "text",
                              placeholder: "Search courses...",
                              value: searchQuery,
                              style: {
                                padding: "0.5rem",
                                border: "1px solid #e0e0e0",
                                borderRadius: "4px",
                                width: "250px",
                                paddingRight: "60px", // Make room for both icons
                              },
                              onchange: handleSearchInputChange,
                              // Explicitly prevent Enter key from submitting
                              onkeydown: handleKeyDown,
                            },
                          },
                          // Magnifying glass icon (always visible)
                          {
                            type: "button",
                            props: {
                              style: {
                                position: "absolute",
                                right: "8px", // Position on the right
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#555",
                                padding: "0",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                              },
                              // Prevent button from submitting any parent form
                              type: "button",
                              children: ["🔍"],
                              onclick: handleSearchButtonClick,
                            },
                          },
                          // Cross icon (only visible when there's a search query)
                          searchQuery
                            ? {
                                type: "button",
                                props: {
                                  style: {
                                    position: "absolute",
                                    right: "35px", // Position to the left of the search button
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#999",
                                    padding: "0",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  },
                                  // Prevent button from submitting any parent form
                                  type: "button",
                                  children: ["×"],
                                  onclick: handleClearSearch,
                                },
                              }
                            : null,
                        ].filter(Boolean),
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        // Course Grid or No Results Message
        filteredCourses.length > 0
          ? {
              type: "div",
              props: {
                style: styles.courseGrid,
                children: filteredCourses.map((course, index) => ({
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
                    onclick: () => handleCourseClick(course),
                    onmouseover: handleMouseOver,
                    onmouseout: handleMouseOut,
                    children: [
                      {
                        type: "div",
                        props: {
                          style: styles.cardContent,
                          children: [
                            // Top pattern section
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
                                  // Year and semester info
                                  {
                                    type: "div",
                                    props: {
                                      style: styles.metaContainer,
                                      children: [
                                        {
                                          type: "div",
                                          props: {
                                            style: styles.yearInfo,
                                            children: [
                                              `Year ${course.year}, Semester ${course.semester}`,
                                            ],
                                          },
                                        },
                                        {
                                          type: "div",
                                          props: {
                                            style: {
                                              fontSize: "0.875rem",
                                              color: "#6c757d",
                                            },
                                            children: [
                                              `${course.credits} Credits`,
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
                      },
                    ],
                  },
                })),
              },
            }
          : {
              type: "div",
              props: {
                style: styles.noResultsMessage,
                children: ["No courses found matching your search criteria."],
              },
            },
      ],
    },
  };
};

window.TeacherCourseList = TeacherCourseList;
