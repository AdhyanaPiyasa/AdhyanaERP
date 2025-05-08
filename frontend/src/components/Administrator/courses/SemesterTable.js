// components/Admin/courses/SemesterTable.js
const SemesterTable = ({ semesters, onRowClick, onAddClick }) => {
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");
  const [isSearching, setIsSearching] = MiniReact.useState(false);
  const [searchResults, setSearchResults] = MiniReact.useState(null);
  const [searchError, setSearchError] = MiniReact.useState(null);

  // UseEffect to trigger search when searchQuery changes (debounced)
  MiniReact.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults(null);
        setSearchError(null);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, searchField]);

  const searchFieldOptions = [
    { value: "all", label: "All Fields" },
    { value: "semesterId", label: "Semester ID" },
    { value: "batchId", label: "Batch ID" },
    { value: "academicYear", label: "Year" },
    { value: "semesterNum", label: "Semester No" },
    { value: "status", label: "Status" },
  ];

  function renderStatus(status) {
    const statusText = status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "Unknown";
    let color = "#9e9e9e",
      backgroundColor = "rgba(158, 158, 158, 0.1)";
    if (status) {
      switch (status.toUpperCase()) {
        case "ONGOING":
        case "ACTIVE":
          color = "#4caf50";
          backgroundColor = "rgba(76, 175, 80, 0.1)";
          break;
        case "PLANNED":
          color = "#2196f3";
          backgroundColor = "rgba(33, 150, 243, 0.1)";
          break;
        case "COMPLETED":
        case "FINISHED":
          color = "#ff9800";
          backgroundColor = "rgba(255, 152, 0, 0.1)";
          break;
        case "CANCELLED":
          color = "#f44336";
          backgroundColor = "rgba(244, 67, 54, 0.1)";
          break;
      }
    }
    return {
      type: "div",
      props: {
        style: {
          color,
          fontWeight: "bold",
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor,
          display: "inline-block",
          fontSize: "0.9em",
          textAlign: "center",
        },
        children: [statusText],
      },
    };
  }

  const performApiSearch = async (currentSearchQuery) => {
    const queryToSearch = currentSearchQuery.trim();

    if (!queryToSearch) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }
    if (isSearching) {
      console.log("[SemesterTable] Search already in progress, skipping.");
      return;
    }

    console.log(
      `[SemesterTable] Starting search for: "${queryToSearch}" in field: ${searchField}`
    );
    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:8081/api/api/courses/semesters/";
      const encodedQuery = encodeURIComponent(queryToSearch);

      if (searchField !== "all") {
        url += `${searchField}/${encodedQuery}`;
      } else {
        console.log(
          "[SemesterTable] 'All Fields' search selected. Fetching all for client-side filtering."
        );
      }

      console.log(`[SemesterTable] Fetching URL: ${url}`);

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        cache: "no-store",
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          /* Ignore */
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("[SemesterTable] Search API Response:", data);

      if (data.success) {
        const results = Array.isArray(data.data)
          ? data.data
          : data.data
          ? [data.data]
          : [];

        // Perform client-side filtering if 'all' fields were selected
        if (searchField === "all" && queryToSearch !== "") {
          const queryLower = queryToSearch.toLowerCase();
          const clientFilteredResults = results.filter((sem) =>
            Object.values(sem).some(
              (value) =>
                value && value.toString().toLowerCase().includes(queryLower)
            )
          );
          console.log(
            `[SemesterTable] Client-side filtered ${clientFilteredResults.length} results for 'all' search: "${queryToSearch}"`
          );
          setSearchResults(clientFilteredResults);
        } else {
          setSearchResults(results);
        }
      } else {
        throw new Error(data.message || "Semester search failed");
      }
    } catch (error) {
      console.error("[SemesterTable] Search error:", error.message);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log("[SemesterTable] Search finished.");
    }
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (newValue.trim() === "") {
      setSearchResults(null);
      setSearchError(null);
    }
  };

  const handleSearchFieldChange = (e) => {
    const newField = e.target.value;
    setSearchField(newField);
    setSearchResults(null);
    setSearchError(null);
    if (searchQuery.trim() !== "") {
      performApiSearch(searchQuery);
    }
  };

  const handleSearchSubmit = () => {
    if (isSearching) return;
    performApiSearch(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchError(null);
  };

  const prepareTableData = (semestersList) => {
    if (!Array.isArray(semestersList)) {
      console.warn(
        "[SemesterTable] prepareTableData received non-array:",
        semestersList
      );
      return [];
    }

    return semestersList
      .map((semester) => {
        if (!semester) return null;

        return {
          semester: semester, // Keep original object
          "Semester ID": semester.semesterId || "N/A",
          "Batch ID": semester.batchId || "N/A",
          Year: semester.year || semester.academicYear,
          "Semester No": semester.semester || semester.semesterNum,
          Status: renderStatus(semester.status),
        };
      })
      .filter((row) => row !== null);
  };

  const displayData = searchResults !== null ? searchResults : semesters;
  const filteredTableData = prepareTableData(displayData);

  const styles = {
    tableSection: { width: "100%" },
    searchBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    searchFieldSelect: { width: "130px", marginRight: theme.spacing.sm },
    searchInputWrapper: { position: "relative", flex: 1 },
    tableContent: { marginTop: theme.spacing.md },
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
                              placeholder: "Search semesters...",
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
                                    type: "button",
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
                                    onClick: handleSearchSubmit,
                                    type: "button",
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
              // Add semester button
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

        // Error message
        searchError && {
          type: "div",
          props: {
            style: styles.errorMessage,
            children: [`Error: ${searchError}`],
          },
        },

        // Semester Table
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
                    type: Table,
                    props: {
                      headers: [
                        "Semester ID",
                        "Batch ID",
                        "Year",
                        "Semester No",
                        "Status",
                      ],
                      data: filteredTableData.map((row) => ({
                        "Semester ID": row["Semester ID"],
                        "Batch ID": row["Batch ID"],
                        Year: row["Year"],
                        "Semester No": row["Semester No"],
                        Status: row["Status"],
                      })),
                      onRowClick: (_, index) => {
                        if (filteredTableData[index].semester) {
                          onRowClick(filteredTableData[index].semester);
                        }
                      },
                    },
                  },
              // Show message when no semesters found
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
                      searchResults !== null
                        ? "No semesters found matching your search criteria."
                        : "No semesters available.",
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

window.SemesterTable = SemesterTable;
