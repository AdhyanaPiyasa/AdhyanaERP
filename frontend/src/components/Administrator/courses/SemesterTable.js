// components/Admin/courses/SemesterTable.js
const SemesterTable = ({ semesters, onRowClick, onAddClick }) => {
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");

  // Create modified data for the table
  const tableData = semesters.map((semester) => ({
    semester: semester, // Store the whole semester object
    BatchId: semester.batchId,
    Year: semester.year,
    Semester: semester.semester,
    Status: {
      type: "div",
      props: {
        style: {
          color: semester.status === "ongoing" ? "#4caf50" : "#9e9e9e",
          fontWeight: "bold",
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor:
            semester.status === "ongoing"
              ? "rgba(76, 175, 80, 0.1)"
              : "rgba(158, 158, 158, 0.1)",
          display: "inline-block",
        },
        children: [
          semester.status.charAt(0).toUpperCase() + semester.status.slice(1),
        ],
      },
    },
  }));

  // Search field options
  const searchFieldOptions = [
    { value: "all", label: "All Fields" },
    { value: "batchId", label: "Batch ID" },
    { value: "year", label: "Year" },
    { value: "semester", label: "Semester" },
    { value: "status", label: "Status" },
  ];

  // Filter semesters based on search query and selected field
  const filteredTableData =
    searchQuery.trim() === ""
      ? tableData
      : tableData.filter((item) => {
          const query = searchQuery.toLowerCase();
          const semester = item.semester;

          if (searchField === "all") {
            return (
              semester.batchId.toLowerCase().includes(query) ||
              semester.year.toString().includes(query) ||
              semester.semester.toString().includes(query) ||
              semester.status.toLowerCase().includes(query)
            );
          }

          // Handle specific field search
          if (searchField === "year" || searchField === "semester") {
            return semester[searchField].toString().includes(query);
          }

          return semester[searchField].toLowerCase().includes(query);
        });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
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
      width: "120px",
      marginRight: theme.spacing.sm,
    },
    tableContent: {
      marginTop: theme.spacing.md,
    },
  };

  // Simple table component
  const SimpleTable = ({ headers, data, onRowClick }) => {
    return {
      type: "table",
      props: {
        style: {
          width: "100%",
          borderCollapse: "collapse",
        },
        children: [
          // Table header
          {
            type: "thead",
            props: {
              children: [
                {
                  type: "tr",
                  props: {
                    children: headers.map((header) => ({
                      type: "th",
                      props: {
                        style: {
                          padding: "12px",
                          textAlign: "left",
                          borderBottom: "2px solid #e0e0e0",
                          background: "#f5f5f5",
                        },
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
              children: data.map((row, index) => ({
                type: "tr",
                props: {
                  style: {
                    cursor: "pointer",
                    backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  },
                  onClick: () => {
                    if (onRowClick && row.semester) {
                      onRowClick(row.semester);
                    }
                  },
                  children: headers.map((header) => ({
                    type: "td",
                    props: {
                      style: {
                        padding: "12px",
                        borderBottom: "1px solid #e0e0e0",
                      },
                      children: [row[header]],
                    },
                  })),
                },
              })),
            },
          },
        ],
      },
    };
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
                    {
                      type: Select,
                      props: {
                        value: searchField,
                        onChange: handleSearchFieldChange,
                        options: searchFieldOptions,
                        style: styles.searchFieldSelect,
                      },
                    },
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
                              placeholder: "Search...",
                              value: searchQuery,
                              onChange: handleSearchChange,
                              style: { width: "100%" },
                            },
                          },
                          searchQuery && {
                            type: "button",
                            props: {
                              style: {
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
                              onClick: () => setSearchQuery(""),
                              children: ["×"],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: Button,
                props: {
                  onClick: onAddClick,
                  children: "Create New Semester",
                },
              },
            ],
          },
        },

        // Semester Table
        {
          type: "div",
          props: {
            style: styles.tableContent,
            children: [
              {
                type: SimpleTable,
                props: {
                  headers: ["BatchId", "Year", "Semester", "Status"],
                  data: filteredTableData,
                  onRowClick: onRowClick,
                },
              },
            ],
          },
        },
      ],
    },
  };
};

window.SemesterTable = SemesterTable;
