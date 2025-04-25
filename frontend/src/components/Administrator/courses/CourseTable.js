// components/Admin/courses/CourseTable.js
const CourseTable = ({ courses, onRowClick, onAddClick }) => {
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");

  // Search field options
  const searchFieldOptions = [
    { value: "all", label: "All Fields" },
    { value: "id", label: "ID" },
    { value: "code", label: "Course Code" },
    { value: "name", label: "Course Name" },
    { value: "year", label: "Year" },
    { value: "rating", label: "Rating" },
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
            color = rating < 3 ? "#f44336" : rating < 4 ? "#ff9800" : "#4caf50";
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

  // Create modified data for the table
  const tableData = courses.map((course) => ({
    course: course, // Store the whole course object
    ID: course.id,
    Code: course.code,
    Title: course.name,
    Year: course.year,
    Rating: renderRatingCircles(course.rating),
  }));

  // Filter courses based on search query and selected field
  const filteredTableData =
    searchQuery.trim() === ""
      ? tableData
      : tableData.filter((item) => {
          const query = searchQuery.toLowerCase();
          const course = item.course;

          if (searchField === "all") {
            return (
              course.id.toString().includes(query) ||
              course.code.toString().includes(query) ||
              course.name.toLowerCase().includes(query) ||
              course.year.toString().includes(query) ||
              course.rating.toString().includes(query)
            );
          }

          // Handle specific field search
          if (
            searchField === "id" ||
            searchField === "code" ||
            searchField === "rating" ||
            searchField === "year"
          ) {
            return course[searchField].toString().includes(query);
          }

          return course[searchField].toLowerCase().includes(query);
        });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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
    clearButton: {
      position: "absolute",
      right: "10px",
      top: "30%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#FF0000",
      fontSize: "16px",
      fontWeight: "bold",
      padding: "0",
      zIndex: 10,
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
                    // Search input with clear button
                    {
                      type: "div",
                      props: {
                        style: styles.searchInputWrapper,
                        children: [
                          {
                            type: TextField,
                            props: {
                              placeholder: "Search courses...",
                              value: searchQuery,
                              onChange: handleSearchChange,
                              style: { width: "100%" },
                            },
                          },
                          searchQuery && {
                            type: "button",
                            props: {
                              style: styles.clearButton,
                              onClick: handleClearSearch,
                              children: ["×"],
                            },
                          },
                        ].filter(Boolean),
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

        // Course Table
        {
          type: "div",
          props: {
            style: styles.tableContent,
            children: [
              {
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
                                "ID",
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
                              "ID",
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
              filteredTableData.length === 0 && {
                type: "div",
                props: {
                  style: {
                    textAlign: "center",
                    padding: theme.spacing.lg,
                    color: theme.colors.textSecondary,
                  },
                  children: ["No courses found matching your search criteria."],
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
