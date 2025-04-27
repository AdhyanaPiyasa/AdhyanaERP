// // components/Admin/courses/EditCourse.js
// const EditCourse = ({ course, onClose, onSuccess }) => {
//   // Initialize form state with course data or defaults
//   const [formData, setFormData] = MiniReact.useState({
//     courseId: course?.id || course?.code || "", // Use course.id or course.code
//     name: course?.name || "",
//     year: course?.year?.toString() || "",
//     credits: course?.credits?.toString() || "",
//     duration: course?.duration?.toString() || "",
//   });

//   // State for validation errors
//   const [errors, setErrors] = MiniReact.useState({
//     name: "",
//     year: "",
//     credits: "",
//     duration: "",
//   });

//   // State for submission status and API errors
//   const [isSubmitting, setIsSubmitting] = MiniReact.useState(false);
//   const [submitError, setSubmitError] = MiniReact.useState(null);

//   // Effect to update form data if the course prop changes
//   MiniReact.useEffect(() => {
//     if (course) {
//       setFormData({
//         courseId: course.id || course.code || "",
//         name: course.name || "",
//         year: course.year?.toString() || "",
//         credits: course.credits?.toString() || "",
//         duration: course.duration?.toString() || "",
//       });
//       // Reset errors when course changes
//       setErrors({ name: "", year: "", credits: "", duration: "" });
//       setSubmitError(null);
//     }
//   }, [course]); // Dependency array includes course

//   // --- Validation Functions ---
//   const validateYear = (value) => {
//     if (!value) return "Year is required";
//     if (!["1", "2", "3", "4"].includes(value)) {
//       return "Year must be 1, 2, 3, or 4";
//     }
//     return "";
//   };

//   const validateNonNegativeInteger = (value, fieldName) => {
//     if (value === null || value === undefined || value === "")
//       return `${fieldName} is required`; // Check for empty string too
//     const parsedValue = parseInt(value, 10);
//     if (
//       isNaN(parsedValue) ||
//       parsedValue < 0 ||
//       parsedValue.toString() !== value.trim() // Trim value before comparison
//     ) {
//       return `${fieldName} must be a non-negative integer`;
//     }
//     return "";
//   };

//   const validateRequired = (value, fieldName) => {
//     if (!value || value.trim() === "") {
//       return `${fieldName} is required`;
//     }
//     return "";
//   };

//   // --- Handle Input Change ---
//   const handleChange = (field, value) => {
//     let errorMessage = "";

//     // Validate based on field type
//     if (field === "name") {
//       errorMessage = validateRequired(value, "Course Name");
//     } else if (field === "year") {
//       errorMessage = validateYear(value);
//     } else if (field === "credits") {
//       errorMessage = validateNonNegativeInteger(value, "Credits");
//     } else if (field === "duration") {
//       errorMessage = validateNonNegativeInteger(value, "Duration");
//     }

//     // Update errors state
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: errorMessage,
//     }));

//     // Update form data
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [field]: value,
//     }));
//   };

//   // --- Handle Form Submission ---
//   const handleSubmit = async () => {
//     // Validate all fields before submission
//     const nameError = validateRequired(formData.name, "Course Name");
//     const yearError = validateYear(formData.year);
//     const creditsError = validateNonNegativeInteger(
//       formData.credits,
//       "Credits"
//     );
//     const durationError = validateNonNegativeInteger(
//       formData.duration,
//       "Duration"
//     );

//     const newErrors = {
//       name: nameError,
//       year: yearError,
//       credits: creditsError,
//       duration: durationError,
//     };

//     setErrors(newErrors);

//     // Check if there are any validation errors
//     const hasErrors = Object.values(newErrors).some((error) => error !== "");

//     if (!hasErrors) {
//       // If validation passes, proceed with API call
//       setIsSubmitting(true);
//       setSubmitError(null);

//       try {
//         const token = localStorage.getItem("token");

//         // Send PUT request to update course
//         const response = await fetch(
//           `http://localhost:8081/api/courses/courseCore/${formData.courseId}`, // Use formData.courseId for the URL
//           {
//             method: "PUT", // Ensure method is PUT
//             headers: {
//               ...(token ? { Authorization: `Bearer ${token}` } : {}), // Include token if available
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               // Send updated data in the body
//               name: formData.name.trim(), // Trim name before sending
//               year: parseInt(formData.year, 10),
//               credits: parseInt(formData.credits, 10),
//               duration: parseInt(formData.duration, 10),
//             }),
//           }
//         );

//         // Check if the response was not okay (status code outside 200-299)
//         if (!response.ok) {
//           let errorData;
//           try {
//             errorData = await response.json(); // Try to parse error message from response body
//           } catch (parseError) {
//             // If parsing fails, use the status text
//             throw new Error(
//               response.statusText || `HTTP error! Status: ${response.status}`
//             );
//           }
//           // Throw an error with the message from the server or a default message
//           throw new Error(
//             errorData.message || `HTTP error! Status: ${response.status}`
//           );
//         }

//         // Parse the successful JSON response
//         const data = await response.json();

//         // Check the success flag from the API response
//         if (data.success) {
//           // Create updated course object for the UI using formData
//           const updatedCourse = {
//             ...course, // Spread existing course data
//             id: formData.courseId, // Ensure ID is correct
//             code: formData.courseId, // Update code if it's the same as ID
//             name: formData.name,
//             year: parseInt(formData.year, 10),
//             credits: parseInt(formData.credits, 10),
//             duration: parseInt(formData.duration, 10),
//           };

//           // Call the success callback if provided, passing the updated data
//           if (onSuccess) {
//             onSuccess(updatedCourse); // Pass the updated course object
//           }
//           onClose(); // Close the modal on success
//           // Optional: Refresh page similar to AdminEditScholarship if needed
//           // setTimeout(() => window.location.reload(), 300);
//         } else {
//           // If API indicates failure, throw an error with the message
//           throw new Error(data.message || "Failed to update course");
//         }
//       } catch (error) {
//         // Catch any errors during fetch or processing
//         console.error("Error updating course:", error);
//         // Set the error message to be displayed in the UI
//         setSubmitError(
//           error.message || "An unexpected error occurred. Please try again."
//         );
//       } finally {
//         // Ensure loading state is turned off regardless of success or failure
//         setIsSubmitting(false);
//       }
//     }
//   };

//   // --- Render Component ---
//   return {
//     type: Modal,
//     props: {
//       isOpen: true,
//       onClose: onClose,
//       title: "Edit Course",
//       children: [
//         {
//           type: "form",
//           props: {
//             // Prevent default browser form submission
//             onSubmit: (e) => {
//               e.preventDefault();
//               handleSubmit();
//             },
//             children: [
//               // Display submission error message if present
//               submitError && {
//                 type: "div",
//                 props: {
//                   style: {
//                     padding: theme.spacing.sm,
//                     marginBottom: theme.spacing.md,
//                     backgroundColor: "#ffebee", // Light red background for errors
//                     color: "#c62828", // Darker red text
//                     borderRadius: theme.spacing.xs, // Use theme border radius
//                     border: `1px solid #ef9a9a`, // Lighter red border
//                   },
//                   children: [submitError],
//                 },
//               },
//               // Course ID (readonly)
//               {
//                 type: TextField,
//                 props: {
//                   label: "Course ID",
//                   value: formData.courseId,
//                   disabled: true, // Make it non-editable
//                   helperText: "Course ID cannot be changed",
//                 },
//               },
//               // Course Name
//               {
//                 type: TextField,
//                 props: {
//                   label: "Course Name",
//                   value: formData.name,
//                   onChange: (e) => handleChange("name", e.target.value),
//                   error: Boolean(errors.name), // Show error state if error exists
//                   helperText: errors.name || "Enter the full course name", // Show error message or default helper text
//                 },
//               },
//               // Year
//               {
//                 type: TextField,
//                 props: {
//                   label: "Year",
//                   value: formData.year,
//                   onChange: (e) => handleChange("year", e.target.value),
//                   error: Boolean(errors.year),
//                   helperText: errors.year || "Enter a value from 1 to 4",
//                   type: "number", // Suggest numeric input, though validation handles non-numeric
//                 },
//               },
//               // Credits
//               {
//                 type: TextField,
//                 props: {
//                   label: "Credits",
//                   value: formData.credits,
//                   onChange: (e) => handleChange("credits", e.target.value),
//                   error: Boolean(errors.credits),
//                   helperText: errors.credits || "Enter a non-negative integer",
//                   type: "number",
//                 },
//               },
//               // Duration
//               {
//                 type: TextField,
//                 props: {
//                   label: "Duration (Hours)", // Added units clarity
//                   value: formData.duration,
//                   onChange: (e) => handleChange("duration", e.target.value),
//                   error: Boolean(errors.duration),
//                   helperText:
//                     errors.duration ||
//                     "Enter total hours as a non-negative integer",
//                   type: "number",
//                 },
//               },
//               // Form Actions (Buttons)
//               {
//                 type: "div",
//                 props: {
//                   style: {
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: theme.spacing.md, // Use theme spacing
//                     marginTop: theme.spacing.xl, // Use theme spacing
//                   },
//                   children: [
//                     {
//                       type: Button,
//                       props: {
//                         variant: "secondary",
//                         onClick: onClose, // Use the passed onClose handler
//                         disabled: isSubmitting, // Disable while submitting
//                         children: "Cancel",
//                       },
//                     },
//                     {
//                       type: Button,
//                       props: {
//                         // Changed onClick to trigger the submit handler directly
//                         // Form's onSubmit will handle prevention of default page reload
//                         onClick: handleSubmit,
//                         disabled: isSubmitting || hasErrors, // Disable if submitting or if there are validation errors
//                         children: isSubmitting ? "Saving..." : "Save Changes",
//                       },
//                     },
//                   ],
//                 },
//               },
//             ].filter(Boolean), // Filter out null/undefined elements (like conditional error message)
//           },
//         },
//       ],
//     },
//   };
// };

// // Assign the component to the window object (if using MiniReact pattern)
// window.EditCourse = EditCourse;

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
