// components/Admin/courses/SemesterFocusPanel.js
const SemesterFocusPanel = ({ semester, onEdit, onDelete }) => {
  console.log(
    "[SemesterFocusPanel] Rendering with semester prop:",
    JSON.stringify(semester, null, 2)
  );

  // Add debugging for button handlers
  const handleEditClick = () => {
    console.log("[SemesterFocusPanel] Edit button clicked, calling onEdit");
    // Ensure we have a semester selected before calling onEdit
    if (semester) {
      // Call the onEdit handler passed from parent
      if (typeof onEdit === "function") {
        onEdit(semester);
      } else {
        console.error("[SemesterFocusPanel] onEdit is not a function:", onEdit);
      }
    } else {
      console.warn("[SemesterFocusPanel] Cannot edit: No semester selected");
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

  const styles = {
    focusPanel: { display: "flex", flexDirection: "column", height: "100%" },
    focusHeader: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: "bold",
      marginBottom: theme.spacing.md,
      color: theme.colors.primary,
      display: "flex",
      alignItems: "center",
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: theme.spacing.sm,
    },
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
      justifyContent: "flex-end",
      gap: theme.spacing.md,
      marginTop: "auto",
      paddingTop: theme.spacing.lg,
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
    offeringsTable: {
      width: "100%",
      borderCollapse: "collapse",
      border: `1px solid ${theme.colors.border}`,
    },
    offeringsTh: {
      padding: theme.spacing.sm,
      textAlign: "left",
      borderBottom: `2px solid ${theme.colors.border}`,
      backgroundColor: "#f5f5f5",
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    offeringsTd: {
      padding: theme.spacing.sm,
      borderBottom: `1px solid ${theme.colors.border}`,
      verticalAlign: "top",
    },
    offeringsTr: (index) => ({
      backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
    }),
    noOfferingsMessage: {
      padding: `${theme.spacing.sm} 0`,
      color: theme.colors.textSecondary,
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
              style: styles.focusHeader,
              children: [
                {
                  type: "span",
                  props: { style: styles.focusIcon, children: ["🎓"] },
                },
                "Focus",
              ],
            },
          },
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

  return {
    type: "div",
    props: {
      style: styles.focusPanel,
      children: [
        // Focus Header
        {
          type: "div",
          props: {
            style: styles.focusHeader,
            children: [
              {
                type: "span",
                props: { style: styles.focusIcon, children: ["🎓"] },
              },
              "Semester Details",
            ],
          },
        },

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
                          type: "table",
                          props: {
                            style: styles.offeringsTable,
                            children: [
                              // Table Header
                              {
                                type: "thead",
                                props: {
                                  children: [
                                    {
                                      type: "tr",
                                      props: {
                                        children: [
                                          {
                                            type: "th",
                                            props: {
                                              style: styles.offeringsTh,
                                              children: ["Course Code"],
                                            },
                                          },
                                          {
                                            type: "th",
                                            props: {
                                              style: styles.offeringsTh,
                                              children: ["Teacher"],
                                            },
                                          },
                                        ],
                                      },
                                    },
                                  ],
                                },
                              },
                              // Table Body
                              {
                                type: "tbody",
                                props: {
                                  children: semester.offerings.map(
                                    (offering, index) => ({
                                      type: "tr",
                                      props: {
                                        style: styles.offeringsTr(index),
                                        key: `${offering.courseId}-${index}`,
                                        children: [
                                          {
                                            type: "td",
                                            props: {
                                              style: styles.offeringsTd,
                                              children: [
                                                offering.courseId || "N/A",
                                              ],
                                            },
                                          },
                                          {
                                            type: "td",
                                            props: {
                                              style: styles.offeringsTd,
                                              children: [
                                                offering.teacherName || "N/A",
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                    })
                                  ),
                                },
                              },
                            ],
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

        // Button Row - Using our new handler functions instead of directly calling props
        {
          type: "div",
          props: {
            style: styles.buttonRow,
            children: [
              {
                type: Button,
                props: {
                  variant: "secondary",
                  onClick: handleEditClick, // Use our new handler
                  children: "Edit Semester",
                },
              },
              {
                type: Button,
                props: {
                  variant: "error",
                  onClick: handleDeleteClick, // Use our new handler
                  children: "Delete Semester",
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
};

window.SemesterFocusPanel = SemesterFocusPanel;
