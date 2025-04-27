// components/Admin/courses/CourseFocusPanel.js
const CourseFocusPanel = ({ course, onEdit, onDelete }) => {
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
  };

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

  if (!course) {
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
                    children: ["📚"],
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
                    children: ["📚"],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: theme.typography.h3.fontSize,
                      marginBottom: theme.spacing.sm,
                    },
                    children: ["No Course Selected"],
                  },
                },
                {
                  type: "div",
                  props: {
                    children: [
                      "Click on a course from the table to view details",
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

  const courseFields = [
    { label: "Code", value: course.code },
    { label: "Name", value: course.name },
    { label: "Year", value: course.year },
    { label: "Credits", value: course.credits },
    { label: "Duration", value: course.duration },
    { label: "Created At", value: course.created_at },
    { label: "Updated At", value: course.updated_at },
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
                  children: ["📚"],
                },
              },
              "Focus",
            ],
          },
        },

        // Course fields
        ...courseFields.map((field) => ({
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

        // Rating field with circles
        {
          type: "div",
          props: {
            style: styles.fieldRow,
            children: [
              {
                type: "div",
                props: {
                  style: styles.fieldLabel,
                  children: ["Rating"],
                },
              },
              {
                type: "div",
                props: {
                  style: styles.fieldValue,
                  children: [renderRatingCircles(course.rating)],
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

window.CourseFocusPanel = CourseFocusPanel;

components / Admin / courses / CourseFocusPanel.js;
components / Admin / courses / CourseFocusPanel.js;

components / Admin / courses / CourseFocusPanel.js;
