// components/teacher/courses/TeacherCourseDetail/Announcements/AnnouncementActions/EditAnnouncement.js
const EditAnnouncement = ({ announcement, onClose }) => {
  const [formData, setFormData] = MiniReact.useState({
    courseCode: announcement?.courseCode || "",
    title: announcement?.title || "",
    content: announcement?.content || "",
    author: announcement?.author || "",
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
      // Handle form submission if no errors
      console.log("Announcement updated:", formData);
      onClose();
    }
  };

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Edit Announcement",
      children: [
        {
          type: "form",
          props: {
            children: [
              {
                type: TextField,
                props: {
                  label: "Course Code",
                  value: formData.courseCode,
                  onChange: (e) => handleChange("courseCode", e.target.value),
                  error: errors.courseCode,
                  helperText: errors.courseCode || "Enter the course code",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Title",
                  value: formData.title,
                  onChange: (e) => handleChange("title", e.target.value),
                  error: errors.title,
                  helperText: errors.title || "Enter the announcement title",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Author",
                  value: formData.author,
                  onChange: (e) => handleChange("author", e.target.value),
                  error: errors.author,
                  helperText: errors.author || "Enter the author name",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Content",
                  value: formData.content,
                  onChange: (e) => handleChange("content", e.target.value),
                  error: errors.content,
                  helperText:
                    errors.content || "Enter the announcement content",
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
                        children: ["Save Changes"],
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

window.EditAnnouncement = EditAnnouncement;
