// components/Admin/courses/SemesterFocusPanel.js
const SemesterFocusPanel = ({ semester, onEditCourse, onEdit, onDelete }) => {
  console.log(
    "[SemesterFocusPanel] Rendering with semester prop:",
    JSON.stringify(semester, null, 2)
  );

  // State for modals
  const [isEditSemesterOpen, setIsEditSemesterOpen] = MiniReact.useState(false);
  const [isEditCoursesOpen, setIsEditCoursesOpen] = MiniReact.useState(false);

  // Add debugging for button handlers
  const handleEditClick = () => {
    console.log("[SemesterFocusPanel] Edit button clicked");
    // Ensure we have a semester selected before opening the edit modal
    if (semester) {
      setIsEditSemesterOpen(true);
    } else {
      console.warn("[SemesterFocusPanel] Cannot edit: No semester selected");
    }
  };

  const handleEditCourseClick = () => {
    console.log("[SemesterFocusPanel] EditCourse button clicked");
    // Ensure we have a semester selected before opening the edit courses modal
    if (semester) {
      setIsEditCoursesOpen(true);
    } else {
      console.warn(
        "[SemesterFocusPanel] Cannot edit courses: No semester selected"
      );
    }
  };

  const handleDeleteClick = () => {
    console.log("[SemesterFocusPanel] Delete button clicked, calling onDelete");
    // Ensure we have a semester selected before calling onDelete
    if (semester) {
      // Call the onDelete handler passed from parent
      if (typeof onDelete === "function") {
        onDelete(semester);
      } else {
        console.error(
          "[SemesterFocusPanel] onDelete is not a function:",
          onDelete
        );
      }
    } else {
      console.warn("[SemesterFocusPanel] Cannot delete: No semester selected");
    }
  };

  // Handle modal close events
  const handleEditSemesterClose = () => {
    setIsEditSemesterOpen(false);
  };

  const handleEditCoursesClose = () => {
    setIsEditCoursesOpen(false);
  };

  // Handle successful updates
  const handleSemesterUpdateSuccess = (updatedSemester) => {
    console.log(
      "[SemesterFocusPanel] Semester updated successfully:",
      updatedSemester
    );
    // Call the onEdit handler passed from parent if available
    if (typeof onEdit === "function") {
      onEdit(updatedSemester);
    }
    setIsEditSemesterOpen(false);
  };

  const handleCoursesUpdateSuccess = (updatedSemester) => {
    console.log(
      "[SemesterFocusPanel] Semester courses updated successfully:",
      updatedSemester
    );
    // Call the onEditCourse handler passed from parent if available
    if (typeof onEditCourse === "function") {
      onEditCourse(updatedSemester);
    }
    setIsEditCoursesOpen(false);
  };

  const styles = {
    focusPanel: { display: "flex", flexDirection: "column", height: "100%" },

    focusIcon: { marginRight: theme.spacing.sm, fontSize: "24px" },
    fieldRow: {
      display: "flex",
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: `${theme.spacing.sm} 0`,
    },
    fieldLabel: {
      width: "40%",
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    fieldValue: { width: "60%", wordBreak: "break-word" },
    buttonRow: {
      display: "flex",
      justifyContent: "space-between", // Changed from flex-end to space-between
      marginTop: "auto",
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md, // Added padding at the bottom
    },
    buttonGroup: {
      display: "flex",
      gap: theme.spacing.sm, // Reduced gap between buttons
    },
    noSelection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    statusText: (status) => ({
      color:
        status === "ONGOING"
          ? "#4caf50"
          : status === "PLANNED"
          ? "#2196f3"
          : status === "COMPLETED"
          ? "#ff9800"
          : status === "CANCELLED"
          ? "#f44336"
          : "#9e9e9e",
      fontWeight: "bold",
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      backgroundColor:
        status === "ONGOING"
          ? "rgba(76, 175, 80, 0.1)"
          : status === "PLANNED"
          ? "rgba(33, 150, 243, 0.1)"
          : status === "COMPLETED"
          ? "rgba(255, 152, 0, 0.1)"
          : status === "CANCELLED"
          ? "rgba(244, 67, 54, 0.1)"
          : "rgba(158, 158, 158, 0.1)",
      fontSize: "0.9em",
      textAlign: "center",
    }),
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: "bold",
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      borderTop: `2px solid ${theme.colors.border}`,
      paddingTop: theme.spacing.md,
      color: theme.colors.textPrimary,
    },
    offeringsTableContainer: {
      marginTop: theme.spacing.xs,
    },
    noOfferingsMessage: {
      padding: `${theme.spacing.sm} 0`,
      color: theme.colors.textSecondary,
    },
    // Adding button styles for better consistency
    actionButton: {
      minWidth: "140px", // Ensure buttons have consistent width
    },
  };

  if (!semester) {
    return {
      type: "div",
      props: {
        style: styles.focusPanel,
        children: [
          {
            type: "div",
            props: {
              style: styles.noSelection,
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: "48px", marginBottom: theme.spacing.md },
                    children: ["🎓"],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: theme.typography.h3.fontSize,
                      marginBottom: theme.spacing.sm,
                    },
                    children: ["No Semester Selected"],
                  },
                },
                {
                  type: "div",
                  props: {
                    children: [
                      "Click on a semester from the table to view details",
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString + "T00:00:00");
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString;
    }
  };

  const semesterFields = [
    { label: "Semester ID", value: semester.id || semester.semesterId },
    { label: "Batch ID", value: semester.batchId },
    { label: "Academic Year", value: semester.year },
    { label: "Semester No", value: semester.semester },
    { label: "Start Date", value: formatDate(semester.startedAt) },
    { label: "End Date", value: formatDate(semester.endAt) },
    {
      label: "Status",
      value: {
        type: "span",
        props: {
          style: styles.statusText(semester.status),
          children: [
            semester.status
              ? semester.status.charAt(0).toUpperCase() +
                semester.status.slice(1).toLowerCase()
              : "N/A",
          ],
        },
      },
    },
  ];

  const hasOfferings =
    semester &&
    semester.offerings &&
    Array.isArray(semester.offerings) &&
    semester.offerings.length > 0;
  console.log(
    `[SemesterFocusPanel] Checking for offerings. semester.offerings exists: ${!!semester.offerings}, isArray: ${Array.isArray(
      semester.offerings
    )}, length: ${semester.offerings?.length}. Result: ${hasOfferings}`
  );

  // Prepare table data for courses and teachers
  const prepareCoursesTableData = () => {
    if (!hasOfferings) return [];

    return semester.offerings.map((offering) => ({
      "Course Code": offering.courseId || "N/A",
      Teacher: offering.teacherName || "N/A",
    }));
  };

  return {
    type: "div",
    props: {
      style: styles.focusPanel,
      children: [
        // Semester basic fields
        ...semesterFields.map((field) => ({
          type: "div",
          props: {
            style: styles.fieldRow,
            key: field.label,
            children: [
              {
                type: "div",
                props: { style: styles.fieldLabel, children: [field.label] },
              },
              {
                type: "div",
                props: {
                  style: styles.fieldValue,
                  children: [field.value || "N/A"],
                },
              },
            ],
          },
        })),

        // Section for Courses & Teachers Table
        {
          type: "div",
          props: {
            style: { marginTop: theme.spacing.md },
            children: [
              {
                type: "h3",
                props: {
                  style: styles.sectionTitle,
                  children: ["Courses & Teachers"],
                },
              },
              // Container for the table or the 'no offerings' message
              {
                type: "div",
                props: {
                  style: styles.offeringsTableContainer,
                  children: [
                    hasOfferings
                      ? {
                          type: Table,
                          props: {
                            headers: ["Course Code", "Teacher"],
                            data: prepareCoursesTableData(),
                            // We don't need row click behavior for this table
                          },
                        }
                      : {
                          type: "div",
                          props: {
                            style: styles.noOfferingsMessage,
                            children: [
                              "No courses assigned to this semester yet.",
                            ],
                          },
                        },
                  ],
                },
              },
            ],
          },
        },

        // Button Row - Now with improved layout and styling
        {
          type: "div",
          props: {
            style: styles.buttonRow,
            children: [
              // Left side - can be empty or contain a back button if needed
              {
                type: "div",
                props: {
                  children: [], // Left empty for now, could add a back button here
                },
              },
              // Right side - action buttons grouped together
              {
                type: "div",
                props: {
                  style: styles.buttonGroup,
                  children: [
                    {
                      type: Button,
                      props: {
                        variant: "secondary",
                        onClick: handleEditCourseClick, // Now opens EditSemesterCourse modal
                        style: styles.actionButton,
                        children: "Edit Courses",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        variant: "secondary",
                        onClick: handleEditClick, // Now opens EditSemester modal
                        style: styles.actionButton,
                        children: "Edit Semester",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        variant: "error",
                        onClick: handleDeleteClick, // Existing delete functionality
                        style: styles.actionButton,
                        children: "Delete",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        // Edit Semester Modal
        isEditSemesterOpen
          ? {
              type: EditSemester,
              props: {
                semester: semester,
                onClose: handleEditSemesterClose,
                onSuccess: handleSemesterUpdateSuccess,
              },
            }
          : null,

        // Edit Semester Courses Modal
        isEditCoursesOpen
          ? {
              type: EditSemesterCourse,
              props: {
                semester: semester,
                onClose: handleEditCoursesClose,
                onSuccess: handleCoursesUpdateSuccess,
              },
            }
          : null,
      ].filter(Boolean),
    },
  };
};

window.SemesterFocusPanel = SemesterFocusPanel;
