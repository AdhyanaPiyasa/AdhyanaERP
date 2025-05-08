// components/Admin/courses/SemesterContentArea.js

const SemesterContentArea = ({ state, setState, isActive }) => {
  const showAddModal = state?.showAddModal || false;
  const showEditModal = state?.showEditModal || false;
  const showDeleteModal = state?.showDeleteModal || false;
  const selectedSemester = state?.selectedSemester || null;

  const [semesters, setSemesters] = MiniReact.useState([]);
  const [loading, setLoading] = MiniReact.useState(true);
  const [error, setError] = MiniReact.useState(null);

  const updateState = (updates) => {
    if (setState) {
      // --- LOGGING: Log state update request ---
      console.log("[SemesterContentArea] updateState called with:", updates);
      // --- END LOGGING ---
      setState((prevState) => ({
        ...prevState,
        ...updates,
      }));
    } else {
      console.warn("[SemesterContentArea] setState function not provided.");
    }
  };

  const fetchSemesters = async () => {
    console.log("[SemesterContentArea] fetchSemesters called");
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "http://localhost:8081/api/api/courses/semesters";
      console.log(`[SemesterContentArea] Fetching from: ${apiUrl}`);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      if (!token) delete headers.Authorization;
      const response = await fetch(apiUrl, { method: "GET", headers: headers });
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
      console.log(
        "[SemesterContentArea] Raw API Response Data:",
        JSON.stringify(data, null, 2)
      );
      if (data.success) {
        const formattedSemesters = data.data.map((semester) => ({
          id: semester.semesterId,
          semesterId: semester.semesterId,
          batchId: semester.batchId,
          year: semester.academicYear,
          semester: semester.semesterNum,
          status: semester.status,
          startedAt: semester.startDate,
          endAt: semester.endDate,
          created_at: semester.createdAt,
          updated_at: semester.updatedAt,
          offerings: semester.offerings || [],
        }));
        console.log(
          "[SemesterContentArea] Formatted semesters (first item):",
          JSON.stringify(formattedSemesters[0], null, 2)
        );
        setSemesters(formattedSemesters);
        if (selectedSemester) {
          const updatedSelectedSemester = formattedSemesters.find(
            (s) => s.id === selectedSemester.id
          );
          console.log(
            "[SemesterContentArea] Attempting to update selected semester. Found:",
            JSON.stringify(updatedSelectedSemester, null, 2)
          );
          updateState({
            selectedSemester: updatedSelectedSemester,
          }); /* Update with found or null */
        }
      } else {
        console.error("[SemesterContentArea] API Error:", data.message);
        setError(data.message || "Failed to fetch semesters");
      }
    } catch (error) {
      console.error("[SemesterContentArea] Error in fetchSemesters:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("Failed to fetch. Check network/server/CORS.");
      } else {
        setError(error.message || "Failed to fetch semesters");
      }
    } finally {
      setLoading(false);
      console.log("[SemesterContentArea] fetchSemesters finished.");
    }
  };

  MiniReact.useEffect(() => {
    console.log(`[SemesterContentArea] isActive changed to: ${isActive}`);
    if (isActive) {
      console.log("[SemesterContentArea] Component is active, fetching data.");
      fetchSemesters();
    } else {
      console.log("[SemesterContentArea] Component is inactive.");
    }
  }, [isActive]);

  const handleEdit = () => {
    console.log(
      "[SemesterContentArea] handleEdit called. Selected semester:",
      selectedSemester
    );
    if (selectedSemester) {
      updateState({ showEditModal: true }); // Request parent to show modal
    } else {
      console.warn(
        "[SemesterContentArea] Edit clicked but no semester selected."
      );
    }
  };

  const handleDelete = () => {
    if (selectedSemester) updateState({ showDeleteModal: true });
  };

  const handleRowClick = (semester) => {
    console.log(
      "[SemesterContentArea] Row clicked. Semester data:",
      JSON.stringify(semester, null, 2)
    );
    updateState({ selectedSemester: semester });
  };

  const handleAddClick = () => {
    updateState({ showAddModal: true });
  };

  const handleAddSuccess = (addedSem) => {
    console.log("Add Success, refreshing", addedSem);
    updateState({ showAddModal: false });
    fetchSemesters();
  };

  const handleEditSuccess = (updatedSem) => {
    console.log("Edit Success, refreshing", updatedSem);
    updateState({ showEditModal: false, selectedSemester: updatedSem });
    fetchSemesters();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSemester || !selectedSemester.id) return;
    console.log(
      "[SemesterContentArea] Confirming delete for:",
      selectedSemester.id
    );
    try {
      const token = localStorage.getItem("token");
      const deleteUrl = `http://localhost:8081/api/api/courses/semesters/${selectedSemester.id}`;
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }
      console.log(
        "[SemesterContentArea] Semester deleted successfully:",
        selectedSemester.id
      );
      updateState({ showDeleteModal: false, selectedSemester: null });
      fetchSemesters();
    } catch (error) {
      console.error("[SemesterContentArea] Error deleting semester:", error);
      setError(`Delete failed: ${error.message}`);
      updateState({ showDeleteModal: false });
    }
  };

  // Define card-based layout styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.spacing.md,
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    cardsContainer: {
      display: "flex",
      gap: theme.spacing.md,
    },
    semesterTableCard: {
      width: "60%",
      backgroundColor: "white",
      borderRadius: theme.spacing.sm,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    focusPanelCard: {
      width: "40%",
      backgroundColor: "white",
      borderRadius: theme.spacing.sm,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    cardHeader: {
      width: "100%",
      textAlign: "center",
      borderBottom: `1px solid ${theme.colors.border || "#eee"}`,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      fontSize: "18px",
      fontWeight: "bold",
    },
    cardContent: {
      padding: theme.spacing.md,
      width: "100%",
      height: "100%",
      overflow: "auto",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      padding: theme.spacing.xl,
    },
    errorContainer: {
      padding: theme.spacing.md,
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  };

  // Create the card components
  const renderCards = () => {
    const cards = [
      // Semester Table Card
      {
        type: "div",
        props: {
          style: styles.semesterTableCard,
          children: [
            // Card header
            {
              type: "div",
              props: {
                style: styles.cardHeader,
                children: ["Semester Listing"],
              },
            },
            // Card content - Semester Table
            {
              type: "div",
              props: {
                style: styles.cardContent,
                children: [
                  {
                    type: SemesterTable,
                    props: {
                      semesters: semesters,
                      onRowClick: handleRowClick,
                      onAddClick: handleAddClick,
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      // Semester Focus Panel Card
      {
        type: "div",
        props: {
          style: styles.focusPanelCard,
          children: [
            // Card header
            {
              type: "div",
              props: {
                style: styles.cardHeader,
                children: ["Semester Details"],
              },
            },
            // Card content - Focus Panel
            {
              type: "div",
              props: {
                style: styles.cardContent,
                children: [
                  {
                    type: SemesterFocusPanel,
                    props: {
                      semester: selectedSemester,
                      onEdit: handleEdit,
                      onDelete: handleDelete,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    return cards;
  };

  // --- LOGGING: Check modal state before rendering ---
  console.log(
    `[SemesterContentArea] Rendering. isActive: ${isActive}, showAddModal: ${showAddModal}, showEditModal: ${showEditModal}, showDeleteModal: ${showDeleteModal}`
  );
  // --- END LOGGING ---
  console.log(
    "[SemesterContentArea] Rendering. Selected Semester State:",
    JSON.stringify(selectedSemester, null, 2)
  );

  if (!isActive) {
    return null; // Don't render if not active
  }

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
        // Error message if there is one
        error && {
          type: "div",
          props: {
            style: styles.errorContainer,
            children: [`Error: ${error}`],
          },
        },

        // Main content - loading or card layout
        loading
          ? {
              type: "div",
              props: {
                style: styles.loadingContainer,
                children: ["Loading semesters..."],
              },
            }
          : {
              type: "div",
              props: {
                style: styles.cardsContainer,
                children: renderCards(),
              },
            },

        // Modals
        showAddModal && {
          type: AddSemester,
          props: {
            onClose: () => updateState({ showAddModal: false }),
            onSuccess: handleAddSuccess,
          },
        },
        showEditModal && {
          type: EditSemester,
          props: {
            semester: selectedSemester,
            onClose: () => updateState({ showEditModal: false }),
            onSuccess: handleEditSuccess,
          },
        },
        showDeleteModal && {
          type: SemesterDeleteConfirmation,
          props: {
            semester: selectedSemester,
            onClose: () => updateState({ showDeleteModal: false }),
            onConfirm: handleDeleteConfirm,
          },
        },
      ].filter(Boolean),
    },
  };
};

window.SemesterContentArea = SemesterContentArea;
