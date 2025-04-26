// components/courses/CourseDetail/DeleteConfirmation.js
const DeleteConfirmation = ({ onClose, onConfirm }) => {
  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Confirm Feedback Deletion",
      children: [
        {
          type: Card,
          props: {
            children: [
              {
                type: "p",
                props: {
                  style: {
                    marginBottom: theme.spacing.md,
                    fontSize: "16px",
                    lineHeight: "1.5",
                  },
                  children: [
                    "Are you sure you want to delete this feedback? This action cannot be undone.",
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: theme.spacing.md,
                    marginTop: theme.spacing.lg,
                  },
                  children: [
                    {
                      type: Button,
                      props: {
                        onClick: onClose,
                        variant: "secondary",
                        size: "medium",
                        children: "Cancel",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: (e) => {
                          // Prevent event bubbling/propagation
                          e.preventDefault();
                          e.stopPropagation();
                          onConfirm();
                        },
                        variant: "error",
                        size: "medium",
                        children: "Delete",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
};

window.DeleteConfirmation = DeleteConfirmation;
