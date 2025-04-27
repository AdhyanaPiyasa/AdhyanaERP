// components/teacher/courses/TeacherCourseDetail/Announcements/AnnouncementActions/AddAnnouncement.js
const AddAnnouncement = ({ courseId, onClose }) => {
  const [formData, setFormData] = MiniReact.useState({
    courseCode: courseId || "",
    title: "",
    content: "",
    author: "",
  });

  const [errors, setErrors] = MiniReact.useState({
    courseCode: "",
    title: "",
    content: "",
    author: "",
  });

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return "";
  };

  const handleChange = (field, value) => {
    // Validate field
    let errorMessage = validateRequired(
      value,
      field.charAt(0).toUpperCase() + field.slice(1)
    );

    // Update errors state
    setErrors({
      ...errors,
      [field]: errorMessage,
    });

    // Update form data
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Validate all fields before submission
    const courseCodeError = validateRequired(
      formData.courseCode,
      "Course Code"
    );
    const titleError = validateRequired(formData.title, "Title");
    const contentError = validateRequired(formData.content, "Content");
    const authorError = validateRequired(formData.author, "Author");

    const newErrors = {
      courseCode: courseCodeError,
      title: titleError,
      content: contentError,
      author: authorError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      // Create new announcement object with current date
      const newAnnouncement = {
        id: Math.floor(Math.random() * 10000), // Generate temporary ID
        courseId: courseId,
        courseCode: formData.courseCode,
        title: formData.title,
        content: formData.content,
        author: formData.author,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 19), // Format: YYYY-MM-DD HH:MM:SS
      };

      console.log("New announcement created:", newAnnouncement);
      onClose();
    }
  };

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Create New Announcement",
      children: [
        {
          type: "form",
          props: {
            children: [
              {
                type: TextField,
                props: {
                  label: "Course Code",
                  placeholder: "Enter course code",
                  value: formData.courseCode,
                  onChange: (e) => handleChange("courseCode", e.target.value),
                  error: errors.courseCode,
                  helperText:
                    errors.courseCode ||
                    "Enter the course code for this announcement",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Title",
                  placeholder: "Enter announcement title",
                  value: formData.title,
                  onChange: (e) => handleChange("title", e.target.value),
                  error: errors.title,
                  helperText: errors.title || "Enter a clear and concise title",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Author",
                  placeholder: "Enter your name",
                  value: formData.author,
                  onChange: (e) => handleChange("author", e.target.value),
                  error: errors.author,
                  helperText: errors.author || "Enter your name as the author",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Content",
                  placeholder: "Enter announcement content",
                  value: formData.content,
                  onChange: (e) => handleChange("content", e.target.value),
                  error: errors.content,
                  helperText:
                    errors.content || "Enter the detailed announcement content",
                  multiline: true,
                  rows: 6,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: theme.spacing.md,
                    marginTop: theme.spacing.xl,
                  },
                  children: [
                    {
                      type: Button,
                      props: {
                        variant: "secondary",
                        onClick: onClose,
                        children: ["Cancel"],
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: handleSubmit,
                        children: ["Create Announcement"],
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

window.AddAnnouncement = AddAnnouncement;
