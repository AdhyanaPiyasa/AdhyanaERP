// components/Admin/courses/SemesterFocusPanel.js
const SemesterFocusPanel = ({ semester, onEdit, onDelete }) => {
  const styles = {
    focusPanel: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
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
    focusIcon: {
      marginRight: theme.spacing.sm,
      fontSize: "24px",
    },
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
    fieldValue: {
      width: "60%",
    },
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
    coursesTable: {
      width: "100%",
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderCollapse: "collapse",
    },
    tableHeader: {
      textAlign: "left",
      padding: "8px",
      borderBottom: `1px solid ${theme.colors.border}`,
      backgroundColor: "#f5f5f5",
    },
    tableCell: {
      padding: "8px",
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    statusText: (status) => ({
      color: status === "ongoing" ? "#4caf50" : "#9e9e9e",
      fontWeight: "bold",
    }),
  };

  // Function to render rating circles with special handling for ongoing semesters
  function renderRatingCircles(rating, isOngoing = false) {
    // For ongoing semesters, always show all grey circles
    if (isOngoing) {
      return {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
          },
          children: Array.from({ length: 5 }).map(() => ({
            type: "div",
            props: {
              style: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#e0e0e0", // All grey for ongoing semesters
              },
            },
          })),
        },
      };
    }

    // For past semesters, show colored ratings
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

  if (!semester) {
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
                  props: {
                    style: styles.focusIcon,
                    children: ["📅"],
                  },
                },
                "Focus",
              ],
            },
          },
          // No selection message
          {
            type: "div",
            props: {
              style: styles.noSelection,
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "48px",
                      marginBottom: theme.spacing.md,
                    },
                    children: ["📅"],
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

  const semesterFields = [
    { label: "Batch ID", value: semester.batchId },
    { label: "Year", value: semester.year },
    { label: "Semester", value: semester.semester },
    { label: "Started At", value: semester.startedAt },
    { label: "End At", value: semester.endAt },
    {
      label: "Status",
      value: {
        type: "span",
        props: {
          style: styles.statusText(semester.status),
          children: [
            semester.status.charAt(0).toUpperCase() + semester.status.slice(1),
          ],
        },
      },
    },
  ];

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
                props: {
                  style: styles.focusIcon,
                  children: ["📅"],
                },
              },
              "Focus",
            ],
          },
        },

        // Semester basic fields
        ...semesterFields.map((field) => ({
          type: "div",
          props: {
            style: styles.fieldRow,
            children: [
              {
                type: "div",
                props: {
                  style: styles.fieldLabel,
                  children: [field.label],
                },
              },
              {
                type: "div",
                props: {
                  style: styles.fieldValue,
                  children: [field.value],
                },
              },
            ],
          },
        })),

        // Courses table
        {
          type: "div",
          props: {
            style: {
              marginTop: theme.spacing.md,
              borderTop: `2px solid ${theme.colors.border}`,
              paddingTop: theme.spacing.md,
            },
            children: [
              {
                type: "h3",
                props: {
                  style: {
                    marginBottom: theme.spacing.sm,
                  },
                  children: ["Courses"],
                },
              },
              {
                type: "table",
                props: {
                  style: styles.coursesTable,
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
                                {
                                  type: "th",
                                  props: {
                                    style: styles.tableHeader,
                                    children: ["Course ID"],
                                  },
                                },
                                {
                                  type: "th",
                                  props: {
                                    style: styles.tableHeader,
                                    children: ["Teacher"],
                                  },
                                },
                                {
                                  type: "th",
                                  props: {
                                    style: styles.tableHeader,
                                    children: ["Rating"],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // Table body
                    {
                      type: "tbody",
                      props: {
                        children: semester.courses.map((course, index) => ({
                          type: "tr",
                          props: {
                            style: {
                              backgroundColor:
                                index % 2 === 0 ? "white" : "#f9f9f9",
                            },
                            children: [
                              {
                                type: "td",
                                props: {
                                  style: styles.tableCell,
                                  children: [course.courseId],
                                },
                              },
                              {
                                type: "td",
                                props: {
                                  style: styles.tableCell,
                                  children: [course.teacherName],
                                },
                              },
                              {
                                type: "td",
                                props: {
                                  style: styles.tableCell,
                                  children: [
                                    renderRatingCircles(
                                      course.teacherRating,
                                      semester.status === "ongoing"
                                    ),
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
              },
            ],
          },
        },

        // Button Row
        {
          type: "div",
          props: {
            style: styles.buttonRow,
            children: [
              {
                type: Button,
                props: {
                  variant: "secondary",
                  onClick: onEdit,
                  children: "Edit",
                },
              },
              {
                type: Button,
                props: {
                  variant: "error",
                  onClick: onDelete,
                  children: "Delete",
                },
              },
            ],
          },
        },
      ],
    },
  };
};

window.SemesterFocusPanel = SemesterFocusPanel;
