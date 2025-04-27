// components/courses/CourseDetail/Feedback.js
const Feedback = ({ courseId }) => {
  const [feedback, setFeedback] = MiniReact.useState(null);
  const [showAddModal, setShowAddModal] = MiniReact.useState(false);
  const [showEditModal, setShowEditModal] = MiniReact.useState(false);
  const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);

  // Fetch feedback data - in a real app, this would come from an API
  MiniReact.useEffect(() => {
    // Simulating API call to get feedback for the current course
    // For now, we'll use a placeholder with no feedback
    setFeedback(null);
  }, [courseId]);

  const handleAddFeedback = (newFeedback) => {
    setFeedback(newFeedback);
    setShowAddModal(false);
  };

  const handleEditFeedback = (updatedFeedback) => {
    setFeedback(updatedFeedback);
    setShowEditModal(false);
  };

  const handleDeleteFeedback = () => {
    setFeedback(null);
    setShowDeleteModal(false);
  };

  const styles = {
    container: {
      padding: "1.5rem",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      color: theme.colors.primary,
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: "0.75rem",
    },
    fieldRow: {
      display: "flex",
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: "0.75rem 0",
    },
    fieldLabel: {
      width: "40%",
      fontWeight: "bold",
      color: theme.colors.textSecondary,
    },
    fieldValue: {
      width: "60%",
    },
    notAvailable: {
      fontStyle: "italic",
      color: "#999",
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
    stars: {
      display: "flex",
      gap: "4px",
    },
    star: {
      color: "#FFD700",
    },
    emptyStar: {
      color: "#e0e0e0",
    },
  };

  // Render star rating
  const renderRating = (rating) => {
    if (!rating && rating !== 0) {
      return {
        type: "span",
        props: {
          style: styles.notAvailable,
          children: ["Not available"],
        },
      };
    }

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push({
          type: "span",
          props: {
            style: styles.star,
            children: ["★"],
          },
        });
      } else {
        stars.push({
          type: "span",
          props: {
            style: styles.emptyStar,
            children: ["☆"],
          },
        });
      }
    }

    return {
      type: "div",
      props: {
        style: styles.stars,
        children: stars,
      },
    };
  };

  // Field definitions for the feedback data display
  const feedbackFields = [
    {
      label: "Course Content Rating",
      value: feedback ? feedback.rating_content : null,
      renderer: renderRating,
    },
    {
      label: "Instructor Rating",
      value: feedback ? feedback.rating_instructor : null,
      renderer: renderRating,
    },
    {
      label: "Materials Rating",
      value: feedback ? feedback.rating_materials : null,
      renderer: renderRating,
    },
    {
      label: "LMS Rating",
      value: feedback ? feedback.rating_lms : null,
      renderer: renderRating,
    },
    {
      label: "Comment",
      value: feedback ? feedback.comment : null,
      renderer: (value) => {
        if (!value) {
          return {
            type: "span",
            props: {
              style: styles.notAvailable,
              children: ["Not available"],
            },
          };
        }
        return value;
      },
    },
    {
      label: "Created At",
      value: feedback ? feedback.created_at : null,
      renderer: (value) => {
        if (!value) {
          return {
            type: "span",
            props: {
              style: styles.notAvailable,
              children: ["Not available"],
            },
          };
        }
        // Format date for display
        const date = new Date(value);
        return date.toLocaleString();
      },
    },
    {
      label: "Updated At",
      value: feedback ? feedback.updated_at : null,
      renderer: (value) => {
        if (!value) {
          return {
            type: "span",
            props: {
              style: styles.notAvailable,
              children: ["Not available"],
            },
          };
        }
        // Format date for display
        const date = new Date(value);
        return date.toLocaleString();
      },
    },
  ];

  return {
    type: Card,
    props: {
      children: [
        // Feedback Data Section
        {
          type: "div",
          props: {
            style: styles.container,
            children: [
              // Section Header
              {
                type: "div",
                props: {
                  style: styles.title,
                  children: ["Feedback"],
                },
              },

              // Feedback fields display
              ...feedbackFields.map((field) => ({
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
                        children: [field.renderer(field.value)],
                      },
                    },
                  ],
                },
              })),

              // Action Buttons
              {
                type: "div",
                props: {
                  style: styles.buttonsContainer,
                  children: [
                    // Delete button - only show if feedback exists
                    feedback && {
                      type: Button,
                      props: {
                        variant: "error",
                        onClick: () => setShowDeleteModal(true),
                        children: ["Delete"],
                      },
                    },
                    // Create/Edit button
                    {
                      type: Button,
                      props: {
                        onClick: () => {
                          if (feedback) {
                            setShowEditModal(true);
                          } else {
                            setShowAddModal(true);
                          }
                        },
                        children: [
                          feedback ? "Edit Feedback" : "Create Feedback",
                        ],
                      },
                    },
                  ].filter(Boolean),
                },
              },
            ],
          },
        },

        // Modals
        showAddModal && {
          type: window.AddFeedback,
          props: {
            courseId: courseId,
            onClose: () => setShowAddModal(false),
            onSave: handleAddFeedback,
          },
        },
        showEditModal && {
          type: window.EditFeedback,
          props: {
            courseId: courseId,
            feedback: feedback,
            onClose: () => setShowEditModal(false),
            onSave: handleEditFeedback,
          },
        },
        showDeleteModal && {
          type: window.DeleteConfirmation,
          props: {
            onClose: () => setShowDeleteModal(false),
            onConfirm: handleDeleteFeedback,
          },
        },
      ].filter(Boolean),
    },
  };
};

window.Feedback = Feedback;

components / courses / CourseDetail / Feedback.js;
