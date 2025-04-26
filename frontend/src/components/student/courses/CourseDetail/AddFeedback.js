// components/courses/CourseDetail/AddFeedback.js
const AddFeedback = ({ courseId, onClose, onSave }) => {
  const [formData, setFormData] = MiniReact.useState({
    rating_content: "3",
    rating_instructor: "3",
    rating_materials: "3",
    rating_lms: "3",
    comment: "",
  });

  const [errors, setErrors] = MiniReact.useState({
    rating_content: "",
    rating_instructor: "",
    rating_materials: "",
    rating_lms: "",
    comment: "",
  });

  const validateRating = (value, fieldName) => {
    if (!value) {
      return `${fieldName} is required`;
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 5) {
      return `${fieldName} must be between 1 and 5`;
    }

    return "";
  };

  const handleChange = (field, value) => {
    let errorMessage = "";

    // Validate ratings
    if (
      [
        "rating_content",
        "rating_instructor",
        "rating_materials",
        "rating_lms",
      ].includes(field)
    ) {
      const fieldLabel = field.replace("rating_", "").replace("_", " ");
      const formattedFieldName =
        fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1) + " rating";
      errorMessage = validateRating(value, formattedFieldName);
    }

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
    const contentError = validateRating(
      formData.rating_content,
      "Content rating"
    );
    const instructorError = validateRating(
      formData.rating_instructor,
      "Instructor rating"
    );
    const materialsError = validateRating(
      formData.rating_materials,
      "Materials rating"
    );
    const lmsError = validateRating(formData.rating_lms, "LMS rating");

    const newErrors = {
      rating_content: contentError,
      rating_instructor: instructorError,
      rating_materials: materialsError,
      rating_lms: lmsError,
      comment: "", // Comment is optional
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      // Create a new feedback object with timestamps
      const now = new Date().toISOString();
      const newFeedback = {
        ...formData,
        course_id: courseId,
        student_index: 12345, // Placeholder - in a real app, this would be the current user's ID
        created_at: now,
        updated_at: now,
      };

      // Convert string ratings to numbers
      newFeedback.rating_content = parseInt(newFeedback.rating_content, 10);
      newFeedback.rating_instructor = parseInt(
        newFeedback.rating_instructor,
        10
      );
      newFeedback.rating_materials = parseInt(newFeedback.rating_materials, 10);
      newFeedback.rating_lms = parseInt(newFeedback.rating_lms, 10);

      // Pass the new feedback back to the parent component
      onSave(newFeedback);
    }
  };

  const ratingOptions = [
    { value: "1", label: "1 - Poor" },
    { value: "2", label: "2 - Fair" },
    { value: "3", label: "3 - Good" },
    { value: "4", label: "4 - Very Good" },
    { value: "5", label: "5 - Excellent" },
  ];

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Create Feedback",
      children: [
        {
          type: "form",
          props: {
            children: [
              {
                type: Select,
                props: {
                  label: "Course Content Rating",
                  name: "rating_content",
                  value: formData.rating_content,
                  onChange: (e) =>
                    handleChange("rating_content", e.target.value),
                  options: ratingOptions,
                  error: errors.rating_content,
                },
              },
              {
                type: Select,
                props: {
                  label: "Instructor Rating",
                  name: "rating_instructor",
                  value: formData.rating_instructor,
                  onChange: (e) =>
                    handleChange("rating_instructor", e.target.value),
                  options: ratingOptions,
                  error: errors.rating_instructor,
                },
              },
              {
                type: Select,
                props: {
                  label: "Materials Rating",
                  name: "rating_materials",
                  value: formData.rating_materials,
                  onChange: (e) =>
                    handleChange("rating_materials", e.target.value),
                  options: ratingOptions,
                  error: errors.rating_materials,
                },
              },
              {
                type: Select,
                props: {
                  label: "LMS Rating",
                  name: "rating_lms",
                  value: formData.rating_lms,
                  onChange: (e) => handleChange("rating_lms", e.target.value),
                  options: ratingOptions,
                  error: errors.rating_lms,
                },
              },
              {
                type: TextField,
                props: {
                  label: "Comment",
                  name: "comment",
                  value: formData.comment,
                  onChange: (e) =>
                    setFormData({ ...formData, comment: e.target.value }),
                  multiline: true,
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
                        children: "Cancel",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: handleSubmit,
                        children: "Save Feedback",
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

window.AddFeedback = AddFeedback;

components / courses / CourseDetail / AddFeedback.js;
