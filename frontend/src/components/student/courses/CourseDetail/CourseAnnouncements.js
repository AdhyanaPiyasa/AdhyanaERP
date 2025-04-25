// components/courses/CourseDetail/CourseAnnouncements.js
const CourseAnnouncements = ({ courseId }) => {
  const [showModal, setShowModal] = MiniReact.useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    MiniReact.useState(null);

  // Sample announcements data with the new schema
  const announcements = [
    {
      id: 1,
      courseId: courseId,
      title: "Midterm Exam Date Announced",
      content:
        "The midterm examination for this course will be held on May 15, 2025 from 10:00 AM to 12:00 PM in Room B201. The exam will cover all material from Weeks 1-6.",
      author: "Dr. Sarah Johnson",
      createdAt: "2025-04-20 14:30:00",
    },
    {
      id: 2,
      courseId: courseId,
      title: "Assignment 2 Deadline Extended",
      content:
        "Due to the technical issues experienced with the submission portal last weekend, the deadline for Assignment 2 has been extended by 48 hours. The new submission deadline is April 28, 2025 at 11:59 PM.",
      author: "Prof. Michael Chen",
      createdAt: "2025-04-22 09:15:00",
    },
    {
      id: 3,
      courseId: courseId,
      title: "Guest Lecture Next Week",
      content:
        "We are excited to announce that Dr. Emily Rodriguez, a leading researcher in the field, will be giving a guest lecture next Thursday (May 2) during our regular class time. Attendance is mandatory.",
      author: "Dr. Sarah Johnson",
      createdAt: "2025-04-23 16:45:00",
    },
  ];

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  // Format the date for display in the table
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Prepare data for table display - keeping the content short in the table
  // IMPORTANT: We're creating a new array with ONLY the visible table data
  const tableData = announcements.map((announcement) => {
    return {
      title: announcement.title,
      author: announcement.author,
      // Keep a shorter preview of content
      preview:
        announcement.content.length > 35
          ? announcement.content.substring(0, 35) + "..."
          : announcement.content,
      date: formatDate(announcement.createdAt),
    };
  });

  return {
    type: Card,
    props: {
      children: [
        {
          type: Table,
          props: {
            headers: ["Title", "Author", "Preview", "Date"],
            data: tableData,
            // Use the index to get the original announcement from the announcements array
            onRowClick: (_, index) =>
              handleAnnouncementClick(announcements[index]),
          },
        },
        showModal && {
          type: Modal,
          props: {
            isOpen: showModal,
            onClose: () => setShowModal(false),
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
                                selectedAnnouncement?.createdAt
                                  ? `Posted: ${formatDate(
                                      selectedAnnouncement.createdAt
                                    )}`
                                  : "",
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

window.CourseAnnouncements = CourseAnnouncements;
