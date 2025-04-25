// components/Admin/courses/EditCourse.js
const EditCourse = ({ course, onClose }) => {
  const [formData, setFormData] = MiniReact.useState({
    courseCode: course?.courseCode || "",
    courseName: course?.courseName || "",
    year: course?.year || "",
    semester: course?.semester || "",
    credits: course?.credits || "",
    duration: course?.duration || "",
  });

  const [errors, setErrors] = MiniReact.useState({
    year: "",
    semester: "",
    credits: "",
    duration: "",
  });

  const validateYear = (value) => {
    if (value && !["1", "2", "3", "4"].includes(value)) {
      return "Year must be 1, 2, 3, or 4";
    }
    return "";
  };

  const validateSemester = (value) => {
    if (value && !["1", "2"].includes(value)) {
      return "Semester must be 1 or 2";
    }
    return "";
  };

  const validateNonNegativeInteger = (value, fieldName) => {
    if (value) {
      const parsedValue = parseInt(value, 10);
      if (
        isNaN(parsedValue) ||
        parsedValue < 0 ||
        parsedValue.toString() !== value
      ) {
        return `${fieldName} must be a non-negative integer`;
      }
    }
    return "";
  };

  const handleChange = (field, value) => {
    let errorMessage = "";

    // Validate based on field type
    if (field === "year") {
      errorMessage = validateYear(value);
    } else if (field === "semester") {
      errorMessage = validateSemester(value);
    } else if (field === "credits" || field === "duration") {
      errorMessage = validateNonNegativeInteger(
        value,
        field.charAt(0).toUpperCase() + field.slice(1)
      );
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
    const yearError = validateYear(formData.year);
    const semesterError = validateSemester(formData.semester);
    const creditsError = validateNonNegativeInteger(
      formData.credits,
      "Credits"
    );
    const durationError = validateNonNegativeInteger(
      formData.duration,
      "Duration"
    );

    const newErrors = {
      year: yearError,
      semester: semesterError,
      credits: creditsError,
      duration: durationError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      // Handle form submission if no errors
      console.log("Form submitted:", formData);
      onClose();
    }
  };

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Edit Course",
      children: [
        {
          type: "form",
          props: {
            children: [
              {
                type: TextField,
                props: {
                  label: "Course code",
                  value: formData.courseCode,
                  onChange: (e) =>
                    setFormData({ ...formData, courseCode: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "Course Name",
                  value: formData.courseName,
                  onChange: (e) =>
                    setFormData({ ...formData, courseName: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "Year",
                  value: formData.year,
                  onChange: (e) => handleChange("year", e.target.value),
                  error: errors.year,
                  helperText: errors.year || "Enter a value from 1 to 4",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Semester",
                  value: formData.semester,
                  onChange: (e) => handleChange("semester", e.target.value),
                  error: errors.semester,
                  helperText: errors.semester || "Enter either 1 or 2",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Credits",
                  value: formData.credits,
                  onChange: (e) => handleChange("credits", e.target.value),
                  error: errors.credits,
                  helperText: errors.credits || "Enter a non-negative integer",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Duration",
                  value: formData.duration,
                  onChange: (e) => handleChange("duration", e.target.value),
                  error: errors.duration,
                  helperText: errors.duration || "Enter a non-negative integer",
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

window.EditCourse = EditCourse;
