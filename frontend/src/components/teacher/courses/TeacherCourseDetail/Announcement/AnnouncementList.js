// components/teacher/courses/TeacherCourseDetail/Announcements/AnnouncementList.js
const AnnouncementList = ({ courseId }) => {
  const [showEditModal, setShowEditModal] = MiniReact.useState(false);
  const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    MiniReact.useState(null);
  const [showDetailsModal, setShowDetailsModal] = MiniReact.useState(false);

  // Sample announcements data
  const announcements = [
    {
      id: 1,
      courseId: courseId,
      courseCode: "CS1205",
      title: "Midterm Exam Date Announced",
      content:
        "The midterm examination for this course will be held on May 15, 2025 from 10:00 AM to 12:00 PM in Room B201. The exam will cover all material from Weeks 1-6.",
      author: "Dr. Sarah Johnson",
      createdAt: "2025-04-20 14:30:00",
    },
    {
      id: 2,
      courseId: courseId,
      courseCode: "CS1205",
      title: "Assignment 2 Deadline Extended",
      content:
        "Due to the technical issues experienced with the submission portal last weekend, the deadline for Assignment 2 has been extended by 48 hours. The new submission deadline is April 28, 2025 at 11:59 PM.",
      author: "Prof. Michael Chen",
      createdAt: "2025-04-22 09:15:00",
    },
    {
      id: 3,
      courseId: courseId,
      courseCode: "CS1205",
      title: "Guest Lecture Next Week",
      content:
        "We are excited to announce that Dr. Emily Rodriguez, a leading researcher in the field, will be giving a guest lecture next Thursday (May 2) during our regular class time. Attendance is mandatory.",
      author: "Dr. Sarah Johnson",
      createdAt: "2025-04-23 16:45:00",
    },
  ];

  const handleDetailsClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailsModal(true);
  };

  const handleEditClick = (e, announcement) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e, announcement) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
    setSelectedAnnouncement(null);
  };

  const handleDeleteConfirm = () => {
    console.log(`Deleting announcement with ID: ${selectedAnnouncement.id}`);
    // Here you would call an API to delete the announcement
    handleCloseModals();
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Prepare table data with actions
  const tableData = announcements.map((announcement) => {
    return {
      courseCode: announcement.courseCode,
      title: announcement.title,
      author: announcement.author,
      preview:
        announcement.content.length > 35
          ? announcement.content.substring(0, 35) + "..."
          : announcement.content,
      date: formatDate(announcement.createdAt),
      actions: {
        type: "div",
        props: {
          style: {
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          },
          children: [
            {
              type: Button,
              props: {
                variant: "secondary",
                size: "small",
                onClick: (e) => handleEditClick(e, announcement),
                children: ["Edit"],
              },
            },
            {
              type: Button,
              props: {
                variant: "danger",
                size: "small",
                onClick: (e) => handleDeleteClick(e, announcement),
                children: ["Delete"],
              },
            },
          ],
        },
      },
    };
  });

  return {
    type: Card,
    props: {
      children: [
        {
          type: Table,
          props: {
            headers: [
              "Course Code",
              "Title",
              "Author",
              "Preview",
              "Date",
              "Actions",
            ],
            data: tableData,
            onRowClick: (_, index) => handleDetailsClick(announcements[index]),
          },
        },

        // Conditionally render modals
        showEditModal && {
          type: EditAnnouncement,
          props: {
            announcement: selectedAnnouncement,
            onClose: handleCloseModals,
          },
        },

        showDeleteModal && {
          type: DeleteAnnouncement,
          props: {
            onClose: handleCloseModals,
            onConfirm: handleDeleteConfirm,
          },
        },

        showDetailsModal && {
          type: Modal,
          props: {
            isOpen: showDetailsModal,
            onClose: handleCloseModals,
            title: "Announcement Details",
            children: [
              {
                type: Card,
                props: {
                  variant: "outlined",
                  children: [
                    {
                      type: "h3",
                      props: {
                        style: {
                          marginBottom: "12px",
                          color: "#2c3e50",
                          fontSize: "20px",
                        },
                        children: [selectedAnnouncement?.title],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                          color: "#666",
                          fontSize: "14px",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: [
                                `Author: ${selectedAnnouncement?.author}`,
                              ],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              children: [
                                `Posted: ${formatDate(
                                  selectedAnnouncement?.createdAt
                                )}`,
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          lineHeight: "1.6",
                          fontSize: "16px",
                          padding: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "6px",
                        },
                        children: [selectedAnnouncement?.content],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
};

window.AnnouncementList = AnnouncementList;
