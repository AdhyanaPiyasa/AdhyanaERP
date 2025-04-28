// components/Admin/courses/SemesterTable.js
const SemesterTable = ({ semesters, onRowClick, onAddClick }) => {
  const [searchQuery, setSearchQuery] = MiniReact.useState("");
  const [searchField, setSearchField] = MiniReact.useState("all");
  const [isSearching, setIsSearching] = MiniReact.useState(false);
  const [searchResults, setSearchResults] = MiniReact.useState(null);
  const [searchError, setSearchError] = MiniReact.useState(null);

  // UseEffect to trigger search when searchQuery changes (debounced)
  // This helps avoid the double-click issue by decoupling search execution
  // from the direct click handler and ensuring state is updated first.
  MiniReact.useEffect(() => {
    // Simple debounce implementation
    const handler = setTimeout(() => {
      // Trigger search only if query is not empty and user isn't manually clearing
      // Search triggered automatically on type (after debounce) or field change
      // Search button click will now primarily handle cases where debounce didn't fire
      // or user explicitly wants to re-search the same term.
      // Let's refine: only search automatically if query has content. Button press needed otherwise.
      if (searchQuery.trim() !== "") {
        // We might not want to auto-search on every keystroke.
        // Let's keep the explicit button press for now and fix the state issue there.
        // console.log("Debounced search trigger for:", searchQuery);
        // performApiSearch(searchQuery.trim()); // Pass current query
      } else {
        // Clear results if query is empty
        setSearchResults(null);
        setSearchError(null);
      }
    }, 300); // 300ms debounce

    // Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, searchField]); // Re-run effect if query or field changes

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

  // --- FIX START: Pass the current query value directly to avoid state closure issues ---
  const performApiSearch = async (currentSearchQuery) => {
    // --- FIX END ---
    const queryToSearch = currentSearchQuery.trim(); // Use the passed value

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
    setSearchResults(null); // Clear previous results

    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:8081/api/api/courses/semesters/";
      const encodedQuery = encodeURIComponent(queryToSearch); // Use trimmed query

      if (searchField !== "all") {
        url += `${searchField}/${encodedQuery}`;
      } else {
        // Backend needs to handle 'all' or we fetch all and filter
        console.log(
          "[SemesterTable] 'All Fields' search selected. Fetching all for client-side filtering."
        );
        // URL remains the base URL to fetch all
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
          // Otherwise, use the results directly from the API
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
    // If input is cleared, also clear results immediately
    if (newValue.trim() === "") {
      setSearchResults(null);
      setSearchError(null);
    }
  };

  const handleSearchFieldChange = (e) => {
    const newField = e.target.value;
    setSearchField(newField);
    // Clear results when field changes, new search needed
    setSearchResults(null);
    setSearchError(null);
    // Trigger search immediately if there's a query
    if (searchQuery.trim() !== "") {
      performApiSearch(searchQuery); // Pass current query
    }
  };

  // --- FIX START: Pass current searchQuery state to performApiSearch ---
  const handleSearchSubmit = () => {
    if (isSearching) return;
    // Pass the current value from the state directly
    performApiSearch(searchQuery);
  };
  // --- FIX END ---

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(); // Uses the fixed handler
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchError(null);
  };

  // --- FIX START: Use property names from SemesterContentArea's formatting ---
  const prepareTableData = (semestersList) => {
    if (!Array.isArray(semestersList)) {
      console.warn(
        "[SemesterTable] prepareTableData received non-array:",
        semestersList
      );
      return [];
    }

    // The `semestersList` here is the result of `formattedSemesters` from SemesterContentArea
    return semestersList
      .map((semester) => {
        if (!semester) return null;

        // Access properties as named in SemesterContentArea's mapping:
        // year: semester.academicYear -> semester.year
        // semester: semester.semesterNum -> semester.semester
        return {
          semester: semester, // Keep original object
          "Semester ID": semester.semesterId || "N/A",
          "Batch ID": semester.batchId || "N/A",
          Year: semester.year, // Access the 'year' property created in SemesterContentArea
          "Semester No": semester.semester, // Access the 'semester' property created in SemesterContentArea
          Status: renderStatus(semester.status),
        };
      })
      .filter((row) => row !== null);
  };
  // --- FIX END ---

  const displayData = searchResults !== null ? searchResults : semesters;
  // Added console log to check the data being passed to prepareTableData
  // console.log("[SemesterTable] Data being passed to prepareTableData:", displayData);
  const filteredTableData = prepareTableData(displayData);
  // Added console log to check the final table data
  // console.log("[SemesterTable] Final data for table rendering:", filteredTableData);

  const styles = {
    tableSection: { width: "100%" },
    searchBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    searchInputGroup: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    searchFieldSelect: { width: "130px", marginRight: theme.spacing.sm },
    searchInputWrapper: { position: "relative", flex: 1 },
    tableContent: { marginTop: theme.spacing.md, overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "2px solid #e0e0e0",
      background: "#f5f5f5",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
    tr: (index) => ({
      cursor: "pointer",
      backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
      ":hover": { backgroundColor: "#f0f0f0" },
    }),
    td: {
      padding: "12px",
      borderBottom: "1px solid #e0e0e0",
      whiteSpace: "nowrap",
      // --- FIX START: Ensure text is visible ---
      color: "#333", // Added default text color
      // --- FIX END ---
    },
    errorMessage: {
      color: "#c62828",
      padding: theme.spacing.sm,
      backgroundColor: "#ffebee",
      borderRadius: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    loadingMessage: {
      padding: theme.spacing.md,
      textAlign: "center",
      color: theme.colors.primary,
    },
    noResultsMessage: {
      textAlign: "center",
      padding: theme.spacing.lg,
      color: theme.colors.textSecondary,
    },
    searchIconsContainer: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      zIndex: 2,
    },
    iconButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "3px 5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
    },
    clearIcon: { color: "#FF0000", fontWeight: "bold", marginRight: "2px" },
    searchIcon: { color: "#555" },
  };

  const SimpleTable = ({ headers, data, onRowClick }) => {
    return {
      type: "table",
      props: {
        style: styles.table,
        children: [
          {
            type: "thead",
            props: {
              children: [
                {
                  type: "tr",
                  props: {
                    children: headers.map((header) => ({
                      type: "th",
                      props: { style: styles.th, children: [header] },
                    })),
                  },
                },
              ],
            },
          },
          {
            type: "tbody",
            props: {
              children: data.map((row, index) => ({
                type: "tr",
                props: {
                  style: styles.tr(index),
                  onClick: () => {
                    if (onRowClick && row.semester) onRowClick(row.semester);
                  },
                  children: headers.map((header) => ({
                    type: "td",
                    props: { style: styles.td, children: [row[header] ?? ""] },
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
                  style: styles.searchInputGroup,
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
                        style: styles.searchInputWrapper,
                        children: [
                          {
                            type: TextField,
                            props: {
                              placeholder: "Search semesters...",
                              value: searchQuery,
                              onChange: handleSearchChange,
                              onKeyDown: handleKeyDown,
                              style: { width: "100%" },
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: styles.searchIconsContainer,
                              children: [
                                searchQuery && {
                                  type: "button",
                                  props: {
                                    style: {
                                      ...styles.iconButton,
                                      ...styles.clearIcon,
                                    },
                                    onClick: handleClearSearch,
                                    type: "button",
                                    children: ["×"],
                                  },
                                },
                                {
                                  type: "button",
                                  props: {
                                    style: {
                                      ...styles.iconButton,
                                      ...styles.searchIcon,
                                    },
                                    onClick: handleSearchSubmit, // Uses fixed handler
                                    type: "button",
                                    disabled: isSearching,
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
              {
                type: Button,
                props: { onClick: onAddClick, children: "Create New Semester" },
              },
            ],
          },
        },

        searchError && {
          type: "div",
          props: {
            style: styles.errorMessage,
            children: [`Search Error: ${searchError}`],
          },
        },

        {
          type: "div",
          props: {
            style: styles.tableContent,
            children: [
              isSearching
                ? {
                    type: "div",
                    props: {
                      style: styles.loadingMessage,
                      children: ["Searching..."],
                    },
                  }
                : filteredTableData.length > 0
                ? {
                    type: SimpleTable,
                    props: {
                      headers: [
                        "Semester ID",
                        "Batch ID",
                        "Year",
                        "Semester No",
                        "Status",
                      ],
                      data: filteredTableData,
                      onRowClick: onRowClick,
                    },
                  }
                : !isSearching &&
                  (searchResults !== null ||
                    (searchResults === null && semesters.length === 0)) && {
                    type: "div",
                    props: {
                      style: styles.noResultsMessage,
                      children: [
                        searchResults !== null
                          ? "No semesters found matching your criteria."
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
