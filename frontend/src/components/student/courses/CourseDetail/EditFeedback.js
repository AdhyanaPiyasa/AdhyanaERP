// components/courses/CourseDetail/EditFeedback.js
const EditFeedback = ({ courseId, feedback, onClose, onSave }) => {
  const [formData, setFormData] = MiniReact.useState({
    rating_content: feedback.rating_content.toString(),
    rating_instructor: feedback.rating_instructor.toString(),
    rating_materials: feedback.rating_materials.toString(),
    rating_lms: feedback.rating_lms.toString(),
    comment: feedback.comment || "",
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
      // Create an updated feedback object
      const updatedFeedback = {
        ...feedback,
        ...formData,
        rating_content: parseInt(formData.rating_content, 10),
        rating_instructor: parseInt(formData.rating_instructor, 10),
        rating_materials: parseInt(formData.rating_materials, 10),
        rating_lms: parseInt(formData.rating_lms, 10),
        updated_at: new Date().toISOString(),
      };

      // Pass the updated feedback back to the parent component
      onSave(updatedFeedback);
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
      title: "Edit Feedback",
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
                        children: "Save Changes",
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

window.EditFeedback = EditFeedback;

components / courses / CourseDetail / EditFeedback.js;
