// components/teacher/courses/TeacherCourseDetail/Announcements/AnnouncementActions/DeleteAnnouncement.js
const DeleteAnnouncement = ({ onClose, onConfirm }) => {
  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Confirm Announcement Deletion",
      children: [
        {
          type: Card,
          props: {
            children: [
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "16px",
                    color: "#dc3545",
                    marginBottom: "16px",
                  },
                  children: [
                    "This announcement will be permanently deleted. This action cannot be undone.",
                  ],
                },
              },
              {
                type: "p",
                props: {
                  style: {
                    fontSize: "14px",
                    color: "#6c757d",
                    marginBottom: "24px",
                  },
                  children: ["Are you sure you want to proceed?"],
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
                        children: ["Cancel"],
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
                        variant: "danger",
                        size: "medium",
                        children: ["Delete"],
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

window.DeleteAnnouncement = DeleteAnnouncement;
