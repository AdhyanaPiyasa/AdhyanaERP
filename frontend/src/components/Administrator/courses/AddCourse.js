// // components/Admin/courses/AddCourse.js
// const AddCourse = ({ onClose }) => {
//   const [formData, setFormData] = MiniReact.useState({
//     courseCode: "",
//     courseName: "",
//     year: "",
//     semester: "",
//     credits: "",
//     duration: "",
//   });

//   const [errors, setErrors] = MiniReact.useState({
//     year: "",
//     semester: "",
//     credits: "",
//     duration: "",
//   });

//   const validateYear = (value) => {
//     if (value && !["1", "2", "3", "4"].includes(value)) {
//       return "Year must be 1, 2, 3, or 4";
//     }
//     return "";
//   };

//   const validateSemester = (value) => {
//     if (value && !["1", "2"].includes(value)) {
//       return "Semester must be 1 or 2";
//     }
//     return "";
//   };

//   const validateNonNegativeInteger = (value, fieldName) => {
//     if (value) {
//       const parsedValue = parseInt(value, 10);
//       if (
//         isNaN(parsedValue) ||
//         parsedValue < 0 ||
//         parsedValue.toString() !== value
//       ) {
//         return `${fieldName} must be a non-negative integer`;
//       }
//     }
//     return "";
//   };

//   const handleChange = (field, value) => {
//     let errorMessage = "";

//     // Validate based on field type
//     if (field === "year") {
//       errorMessage = validateYear(value);
//     } else if (field === "semester") {
//       errorMessage = validateSemester(value);
//     } else if (field === "credits" || field === "duration") {
//       errorMessage = validateNonNegativeInteger(
//         value,
//         field.charAt(0).toUpperCase() + field.slice(1)
//       );
//     }

//     // Update errors state
//     setErrors({
//       ...errors,
//       [field]: errorMessage,
//     });

//     // Update form data
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   const handleSubmit = () => {
//     // Validate all fields before submission
//     const yearError = validateYear(formData.year);
//     const semesterError = validateSemester(formData.semester);
//     const creditsError = validateNonNegativeInteger(
//       formData.credits,
//       "Credits"
//     );
//     const durationError = validateNonNegativeInteger(
//       formData.duration,
//       "Duration"
//     );

//     const newErrors = {
//       year: yearError,
//       semester: semesterError,
//       credits: creditsError,
//       duration: durationError,
//     };

//     setErrors(newErrors);

//     // Check if there are any errors
//     const hasErrors = Object.values(newErrors).some((error) => error !== "");

//     if (!hasErrors) {
//       // Handle form submission if no errors
//       console.log("Form submitted:", formData);
//       onClose();
//     }
//   };

//   return {
//     type: Modal,
//     props: {
//       isOpen: true,
//       onClose: onClose,
//       title: "Add New Course",
//       children: [
//         {
//           type: "form",
//           props: {
//             children: [
//               {
//                 type: TextField,
//                 props: {
//                   label: "Course code",
//                   value: formData.courseCode,
//                   onChange: (e) =>
//                     setFormData({ ...formData, courseCode: e.target.value }),
//                 },
//               },
//               {
//                 type: TextField,
//                 props: {
//                   label: "Course Name",
//                   value: formData.courseName,
//                   onChange: (e) =>
//                     setFormData({ ...formData, courseName: e.target.value }),
//                 },
//               },
//               {
//                 type: TextField,
//                 props: {
//                   label: "Year",
//                   value: formData.year,
//                   onChange: (e) => handleChange("year", e.target.value),
//                   error: errors.year,
//                   helperText: errors.year || "Enter a value from 1 to 4",
//                 },
//               },
//               {
//                 type: TextField,
//                 props: {
//                   label: "Semester",
//                   value: formData.semester,
//                   onChange: (e) => handleChange("semester", e.target.value),
//                   error: errors.semester,
//                   helperText: errors.semester || "Enter either 1 or 2",
//                 },
//               },
//               {
//                 type: TextField,
//                 props: {
//                   label: "Credits",
//                   value: formData.credits,
//                   onChange: (e) => handleChange("credits", e.target.value),
//                   error: errors.credits,
//                   helperText: errors.credits || "Enter a non-negative integer",
//                 },
//               },
//               {
//                 type: TextField,
//                 props: {
//                   label: "Duration",
//                   value: formData.duration,
//                   onChange: (e) => handleChange("duration", e.target.value),
//                   error: errors.duration,
//                   helperText: errors.duration || "Enter a non-negative integer",
//                 },
//               },
//               {
//                 type: "div",
//                 props: {
//                   style: {
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: theme.spacing.md,
//                     marginTop: theme.spacing.xl,
//                   },
//                   children: [
//                     {
//                       type: Button,
//                       props: {
//                         variant: "secondary",
//                         onClick: onClose,
//                         children: "Cancel",
//                       },
//                     },
//                     {
//                       type: Button,
//                       props: {
//                         onClick: handleSubmit,
//                         children: "Create Course",
//                       },
//                     },
//                   ],
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   };
// };

// window.AddCourse = AddCourse;

// components / Admin / courses / AddCourse.js;

// components/Admin/courses/AddCourse.js
const AddCourse = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = MiniReact.useState({
    courseId: "",
    name: "",
    year: "",
    credits: "",
    duration: "",
  });

  const [errors, setErrors] = MiniReact.useState({
    courseId: "",
    name: "",
    year: "",
    credits: "",
    duration: "",
  });

  const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
  const [submitError, setSubmitError] = MiniReact.useState(null);

  const validateYear = (value) => {
    if (!value) return "Year is required";
    if (!["1", "2", "3", "4"].includes(value)) {
      return "Year must be 1, 2, 3, or 4";
    }
    return "";
  };

  const validateNonNegativeInteger = (value, fieldName) => {
    if (!value) return `${fieldName} is required`;
    const parsedValue = parseInt(value, 10);
    if (
      isNaN(parsedValue) ||
      parsedValue < 0 ||
      parsedValue.toString() !== value
    ) {
      return `${fieldName} must be a non-negative integer`;
    }
    return "";
  };

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return "";
  };

  const handleChange = (field, value) => {
    let errorMessage = "";

    // Validate based on field type
    if (field === "courseId") {
      errorMessage = validateRequired(value, "Course ID");
    } else if (field === "name") {
      errorMessage = validateRequired(value, "Course Name");
    } else if (field === "year") {
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
    const courseIdError = validateRequired(formData.courseId, "Course ID");
    const nameError = validateRequired(formData.name, "Course Name");
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
      courseId: courseIdError,
      name: nameError,
      year: yearError,
      credits: creditsError,
      duration: durationError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      // Submit the form data to create new course
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8081/api/courses/courseCore/",
          {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseId: formData.courseId,
              name: formData.name,
              year: parseInt(formData.year, 10),
              credits: parseInt(formData.credits, 10),
              duration: parseInt(formData.duration, 10),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          // Call onSuccess callback with the new course data
          if (onSuccess) {
            onSuccess(data.data);
          }
          onClose();
        } else {
          throw new Error(data.message || "Failed to create course");
        }
      } catch (error) {
        console.error("Error creating course:", error);
        setSubmitError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Add New Course",
      children: [
        {
          type: "form",
          props: {
            children: [
              // Error message if there was a submission error
              submitError && {
                type: "div",
                props: {
                  style: {
                    padding: theme.spacing.sm,
                    marginBottom: theme.spacing.md,
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                    borderRadius: theme.spacing.sm,
                  },
                  children: [submitError],
                },
              },
              {
                type: TextField,
                props: {
                  label: "Course ID",
                  value: formData.courseId,
                  onChange: (e) => handleChange("courseId", e.target.value),
                  error: Boolean(errors.courseId),
                  helperText:
                    errors.courseId || "Enter a unique course ID (e.g., CS101)",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Course Name",
                  value: formData.name,
                  onChange: (e) => handleChange("name", e.target.value),
                  error: Boolean(errors.name),
                  helperText: errors.name || "Enter the full course name",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Year",
                  value: formData.year,
                  onChange: (e) => handleChange("year", e.target.value),
                  error: Boolean(errors.year),
                  helperText: errors.year || "Enter a value from 1 to 4",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Credits",
                  value: formData.credits,
                  onChange: (e) => handleChange("credits", e.target.value),
                  error: Boolean(errors.credits),
                  helperText: errors.credits || "Enter a non-negative integer",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Duration",
                  value: formData.duration,
                  onChange: (e) => handleChange("duration", e.target.value),
                  error: Boolean(errors.duration),
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
                        disabled: isSubmitting,
                        children: "Cancel",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        onClick: handleSubmit,
                        disabled: isSubmitting,
                        children: isSubmitting
                          ? "Creating..."
                          : "Create Course",
                      },
                    },
                  ],
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
};

window.AddCourse = AddCourse;
