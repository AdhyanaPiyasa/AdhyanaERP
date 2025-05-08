// // components/Admin/courses/EditCourse.js
const EditCourse = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = MiniReact.useState({
    courseId: course?.id || course?.code || "",
    name: course?.name || "",
    year: course?.year?.toString() || "",
    credits: course?.credits?.toString() || "",
    duration: course?.duration?.toString() || "",
  });

  const [errors, setErrors] = MiniReact.useState({
    name: "",
    year: "",
    credits: "",
    duration: "",
  });

  const [loading, setLoading] = MiniReact.useState(false); // Changed isSubmitting to loading
  const refreshPage = () => {
    window.location.reload();
  };

  const validateYear = (value) => {
    if (value && !["1", "2", "3", "4"].includes(value)) {
      return "Year must be 1, 2, 3, or 4";
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

  const handleSubmit = async () => {
    // Validate all fields before submission
    const yearError = validateYear(formData.year);
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
      credits: creditsError,
      duration: durationError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      setLoading(true); // set loading to true
      try {
        // Prepare data for the API
        const courseData = {
          courseId: formData.courseId, // Use courseId
          name: formData.name,
          year: parseInt(formData.year, 10),
          credits: parseInt(formData.credits, 10),
          duration: parseInt(formData.duration, 10),
        };

        console.log("Submitting course data:", courseData); //debugging

        const token = localStorage.getItem("token"); //get token
        // Construct the URL as in CourseTable.js
        const url = `http://localhost:8081/api/api/courses/courseCore/${encodeURIComponent(
          formData.courseId
        )}`;
        const response = await fetch(
          url, // Use constructed URL
          {
            method: "PUT", // Changed to PUT
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token
            },
            body: JSON.stringify(courseData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Could not update course");
        }

        const result = await response.json();
        setLoading(false); // set loading to false
        onSuccess(result.data);
        onClose();
        setTimeout(refreshPage, 300);
      } catch (error) {
        setLoading(false); // set loading to false on error
        setErrors({ ...errors, form: error.message || "An error occurred" });
        console.error("Error updating course:", error); //log
      }
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(refreshPage, 300);
  };

  const theme = {
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
    shape: {
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      error: "#dc3545",
      background: "#f8f9fa",
      textSecondary: "#6c757d",
      border: "#dee2e6",
    },
    typography: {
      h2: {
        fontSize: "24px",
      },
      // ... other typography styles
    },
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
                  label: "Course Code",
                  value: formData.courseId,
                  onChange: (e) => handleChange("courseId", e.target.value),
                  disabled: true,
                },
              },
              {
                type: TextField,
                props: {
                  label: "Course Name",
                  value: formData.name,
                  onChange: (e) => handleChange("name", e.target.value),
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
                        onClick: handleClose,
                        disabled: loading,
                        children: "Cancel",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: handleSubmit,
                        disabled: loading,
                        children: loading ? "Saving..." : "Save Changes",
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
