// components/Admin/courses/SemesterDeleteConfirmation.js
const SemesterDeleteConfirmation = ({ onClose, onConfirm }) => {
  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Confirm the deletion of semester",
      children: [
        {
          type: Card,
          props: {
            children: [
              {
                type: "p",
                props: {
                  children: [
                    "Record of the semester will be permanently removed !!!",
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

window.SemesterDeleteConfirmation = SemesterDeleteConfirmation;
