// components/Admin/courses/CourseTable.js
const CourseTable = ({ courses, onRowClick, onAddClick }) => {
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");
  const [isSearching, setIsSearching] = MiniReact.useState(false);
  const [searchResults, setSearchResults] = MiniReact.useState(null);
  const [searchError, setSearchError] = MiniReact.useState(null);

  // Search field options
  const searchFieldOptions = [
    { value: "all", label: "All Fields" },
    { value: "courseId", label: "Course Code" },
    { value: "name", label: "Course Name" },
    { value: "year", label: "Year" },
    { value: "avgRating", label: "Rating" },
  ];

  // Generate rating circles component
  function renderRatingCircles(rating) {
    return {
      type: "div",
      props: {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
        },
        children: Array.from({ length: 5 }).map((_, i) => {
          let color = "#e0e0e0"; // Default empty color
          if (i < rating) {
            // Set color based on rating value
            color =
              rating <= 3 ? "#f44336" : rating <= 4 ? "#ff9800" : "#4caf50";
          }

          return {
            type: "div",
            props: {
              style: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: color,
              },
            },
          };
        }),
      },
    };
  }

  // Function to perform API search
  const performApiSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    // Prevent multiple concurrent searches
    if (isSearching) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const token = localStorage.getItem("token");
      let url = "";

      // Log input values for debugging
      console.log("Search field:", searchField);
      console.log("Search query:", searchQuery);

      // Format URL based on search field
      if (searchField === "courseId") {
        // Use the exact format requested: /courseCore/courseId/eng1002
        url = `http://localhost:8081/api/api/courses/courseCore/courseId/${encodeURIComponent(
          searchQuery
        )}`;
      } else if (searchField !== "all") {
        url = `http://localhost:8081/api/api/courses/courseCore/${searchField}/${encodeURIComponent(
          searchQuery
        )}`;
      } else {
        // Default search - maybe search all fields or just return all courses
        url = "http://localhost:8081/api/api/courses/courseCore/";
      }

      console.log("Searching with URL:", url);
      console.log("Auth token exists:", !!token);

      const headers = {
        "Content-Type": "application/json",
      };

      // Only add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Force a new fetch without caching to avoid stale responses
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        cache: "no-store", // Prevent caching of requests
      });

      console.log("Search response status:", response.status);

      if (!response.ok) {
        // Log more details about the error
        console.error(
          "Search request failed:",
          response.status,
          response.statusText
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSearchResults(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submission (e.g., when clicking the search button)
  const handleSearchSubmit = () => {
    // Prevent multiple concurrent searches
    if (isSearching) return;

    // Reset previous results before starting a new search
    setSearchResults(null);
    setSearchError(null);
    performApiSearch();
  };

  // Handle keydown to prevent Enter key from triggering search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent any form submission
      handleSearchSubmit(); // But still perform the search
      return false;
    }
  };

  // Create modified data for the table
  const prepareTableData = (coursesList) => {
    return coursesList.map((course) => ({
      course: course, // Store the whole course object
      Code: course.courseId || course.code,
      Title: course.name,
      Year: course.year,
      Rating: renderRatingCircles(course.avgRating || course.rating || 0),
    }));
  };

  // Get the appropriate data source
  const tableData = prepareTableData(courses);

  // Filter courses based on search query and selected field when not using API search
  const filteredTableData = searchResults
    ? prepareTableData(searchResults)
    : searchQuery.trim() === ""
    ? tableData
    : tableData.filter((item) => {
        const query = searchQuery.toLowerCase();
        const course = item.course;

        if (searchField === "all") {
          const code = course.courseId || course.code || "";
          const name = course.name || "";
          const year = course.year?.toString() || "";
          const rating = course.avgRating || course.rating || 0;

          return (
            code.toString().toLowerCase().includes(query) ||
            name.toLowerCase().includes(query) ||
            year.includes(query) ||
            Math.ceil(rating).toString().includes(query) // Use ceiling for rating
          );
        }

        // Handle specific field search
        if (searchField === "courseId" || searchField === "code") {
          const code = course.courseId || course.code || "";
          return code.toString().toLowerCase().includes(query);
        }

        if (searchField === "year") {
          return course.year?.toString().includes(query);
        }

        if (searchField === "avgRating" || searchField === "rating") {
          const rating = course.avgRating || course.rating || 0;
          // Use ceiling value for rating search
          return Math.ceil(rating).toString().includes(query);
        }

        // Default to name search
        return (course.name || "").toLowerCase().includes(query);
      });

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    // Reset search results when input is cleared manually
    if (newValue === "") {
      setSearchResults(null);
      setSearchError(null);
    }
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setSearchResults(null); // Reset results when changing search field
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchError(null);
    // No need to perform a new search as we're clearing it
  };

  const styles = {
    tableSection: {
      width: "100%",
    },
    searchBar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    searchFieldSelect: {
      width: "130px",
      marginRight: theme.spacing.sm,
    },
    searchInputWrapper: {
      position: "relative",
      flex: 1,
    },
    tableContent: {
      marginTop: theme.spacing.md,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "2px solid #e0e0e0",
      background: "#f5f5f5",
      fontWeight: "bold",
    },
    tr: (index) => ({
      cursor: "pointer",
      backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
      ":hover": {
        backgroundColor: "#f0f0f0",
      },
    }),
    td: {
      padding: "12px",
      borderBottom: "1px solid #e0e0e0",
    },
    errorMessage: {
      color: "#c62828",
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  };

  return {
    type: "div",
    props: {
      style: styles.tableSection,
      children: [
        // Search bar and add button
        {
          type: "div",
          props: {
            style: styles.searchBar,
            children: [
              {
                type: "div",
                props: {
                  style: styles.searchInput,
                  children: [
                    // Search field dropdown
                    {
                      type: Select,
                      props: {
                        value: searchField,
                        onChange: handleSearchFieldChange,
                        options: searchFieldOptions,
                        style: styles.searchFieldSelect,
                      },
                    },
                    // Search input with integrated icons
                    {
                      type: "div",
                      props: {
                        style: {
                          position: "relative",
                          flex: 1,
                        },
                        children: [
                          {
                            type: TextField,
                            props: {
                              placeholder: "Search courses...",
                              value: searchQuery,
                              onChange: handleSearchChange,
                              onKeyDown: handleKeyDown,
                              style: {
                                width: "100%",
                              },
                            },
                          },
                          // Both icons inside the search field
                          {
                            type: "div",
                            props: {
                              style: {
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-80%)",
                                display: "flex",
                                alignItems: "center",
                                zIndex: 2,
                              },
                              children: [
                                // Clear button (X) - only visible when there's a search query
                                searchQuery && {
                                  type: "button",
                                  props: {
                                    style: {
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#FF0000",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      padding: "3px 5px",
                                      marginRight: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    },
                                    onClick: handleClearSearch,
                                    type: "button", // Prevent form submission
                                    children: ["×"],
                                  },
                                },
                                // Magnifying glass icon
                                {
                                  type: "button",
                                  props: {
                                    style: {
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#555",
                                      fontSize: "16px",
                                      padding: "3px 5px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    },
                                    onClick: handleSearchSubmit, // This remains the same
                                    type: "button", // Prevent form submission
                                    children: ["🔍"],
                                  },
                                },
                              ].filter(Boolean),
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              // Add course button
              {
                type: Button,
                props: {
                  onClick: onAddClick,
                  children: "Create New Course",
                },
              },
            ],
          },
        },

        // Error message
        searchError && {
          type: "div",
          props: {
            style: styles.errorMessage,
            children: [`Error: ${searchError}`],
          },
        },

        // Course Table
        {
          type: "div",
          props: {
            style: styles.tableContent,
            children: [
              // Loading indicator when searching
              isSearching
                ? {
                    type: "div",
                    props: {
                      style: {
                        padding: theme.spacing.md,
                        textAlign: "center",
                        color: theme.colors.primary,
                      },
                      children: ["Searching..."],
                    },
                  }
                : {
                    type: "table",
                    props: {
                      style: styles.table,
                      children: [
                        // Table header
                        {
                          type: "thead",
                          props: {
                            children: [
                              {
                                type: "tr",
                                props: {
                                  children: [
                                    "Code",
                                    "Title",
                                    "Year",
                                    "Rating",
                                  ].map((header) => ({
                                    type: "th",
                                    props: {
                                      style: styles.th,
                                      children: [header],
                                    },
                                  })),
                                },
                              },
                            ],
                          },
                        },
                        // Table body
                        {
                          type: "tbody",
                          props: {
                            children: filteredTableData.map((row, index) => ({
                              type: "tr",
                              props: {
                                style: styles.tr(index),
                                onClick: () => {
                                  if (row.course) {
                                    onRowClick(row.course);
                                  }
                                },
                                children: [
                                  "Code",
                                  "Title",
                                  "Year",
                                  "Rating",
                                ].map((header) => ({
                                  type: "td",
                                  props: {
                                    style: styles.td,
                                    children: [row[header]],
                                  },
                                })),
                              },
                            })),
                          },
                        },
                      ],
                    },
                  },
              // Show message when no courses found
              !isSearching &&
                filteredTableData.length === 0 && {
                  type: "div",
                  props: {
                    style: {
                      textAlign: "center",
                      padding: theme.spacing.lg,
                      color: theme.colors.textSecondary,
                    },
                    children: [
                      "No courses found matching your search criteria.",
                    ],
                  },
                },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
};

window.CourseTable = CourseTable;
