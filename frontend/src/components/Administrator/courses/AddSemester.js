// components/Admin/semesters/AddSemester.js
const AddSemester = ({ onClose, onSuccess }) => {
  // Initial state for semester form data
  const [formData, setFormData] = MiniReact.useState({
    semesterId: "", // E.g., "2024-S1"
    batchId: "", // E.g., "CSE-2022"
    academicYear: "", // E.g., 2024
    semesterNum: "", // E.g., 1 or 2
    startDate: "", // YYYY-MM-DD
    endDate: "", // YYYY-MM-DD
    status: "PLANNED", // Default status
  });

  // State for validation errors
  const [errors, setErrors] = MiniReact.useState({});
  // State for loading indicator during submission
  const [loading, setLoading] = MiniReact.useState(false);

  // Optional: Helper function for page refresh after success
  const refreshPage = () => {
    window.location.reload();
  };

  // --- Validation Functions ---

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return "";
  };

  const validateAcademicYear = (value) => {
    const requiredError = validateRequired(value, "Academic Year");
    if (requiredError) return requiredError;
    if (!/^\d{4}$/.test(value)) {
      return "Academic Year must be a 4-digit number";
    }
    return "";
  };

  const validateSemesterNum = (value) => {
    const requiredError = validateRequired(value, "Semester Number");
    if (requiredError) return requiredError;
    if (!/^[1-2]$/.test(value)) {
      // Assuming only 1 or 2 are valid
      return "Semester Number must be 1 or 2";
    }
    return "";
  };

  const validateDate = (value, fieldName) => {
    const requiredError = validateRequired(value, fieldName);
    if (requiredError) return requiredError;
    // Basic check for YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${fieldName} must be in YYYY-MM-DD format`;
    }
    // Check if it's a potentially valid date object
    if (isNaN(new Date(value).getTime())) {
      return `${fieldName} is not a valid date`;
    }
    return "";
  };

  const validateEndDate = (startDate, endDate) => {
    const endDateError = validateDate(endDate, "End Date");
    if (endDateError) return endDateError; // Don't compare if end date is invalid

    const startDateError = validateDate(startDate, "Start Date");
    if (startDateError) return ""; // Don't compare if start date is invalid

    if (new Date(endDate) <= new Date(startDate)) {
      return "End Date must be after Start Date";
    }
    return "";
  };

  // --- Event Handlers ---

  const handleChange = (field, value) => {
    let errorMessage = "";

    // Basic validation on change
    switch (field) {
      case "semesterId":
      case "batchId":
      case "status":
        errorMessage = validateRequired(
          value,
          field.charAt(0).toUpperCase() + field.slice(1)
        );
        break;
      case "academicYear":
        errorMessage = validateAcademicYear(value);
        break;
      case "semesterNum":
        errorMessage = validateSemesterNum(value);
        break;
      case "startDate":
        errorMessage = validateDate(value, "Start Date");
        // Re-validate end date if start date changes
        setErrors((prevErrors) => ({
          ...prevErrors,
          endDate: validateEndDate(value, formData.endDate),
        }));
        break;
      case "endDate":
        errorMessage = validateEndDate(formData.startDate, value);
        break;
      default:
        break;
    }

    // Update errors state for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));

    // Update form data
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    // --- Final Validation Before Submission ---
    const currentErrors = {
      semesterId: validateRequired(formData.semesterId, "Semester ID"),
      batchId: validateRequired(formData.batchId, "Batch ID"),
      academicYear: validateAcademicYear(formData.academicYear),
      semesterNum: validateSemesterNum(formData.semesterNum),
      startDate: validateDate(formData.startDate, "Start Date"),
      endDate: validateEndDate(formData.startDate, formData.endDate), // Validate end against start
      status: validateRequired(formData.status, "Status"),
    };

    setErrors(currentErrors);

    // Check if there are any validation errors
    const hasErrors = Object.values(currentErrors).some(
      (error) => error !== ""
    );

    if (!hasErrors) {
      setLoading(true); // Start loading indicator
      setErrors({}); // Clear previous form-level errors

      try {
        // Prepare data payload according to Semester.java and SemesterServlet
        const semesterData = {
          semesterId: formData.semesterId,
          batchId: formData.batchId,
          academicYear: parseInt(formData.academicYear, 10), // Ensure integer
          semesterNum: parseInt(formData.semesterNum, 10), // Ensure integer
          startDate: formData.startDate, // Backend expects YYYY-MM-DD string
          endDate: formData.endDate, // Backend expects YYYY-MM-DD string
          status: formData.status,
        };

        console.log("Submitting semester data:", semesterData); // For debugging

        const token = localStorage.getItem("token"); // Get auth token if needed
        const response = await fetch(
          "http://localhost:8081/api/api/courses/semesters/", // API endpoint from SemesterServlet
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Uncomment if authentication is required
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(semesterData),
          }
        );

        const result = await response.json(); // Always try to parse JSON

        if (!response.ok) {
          // Use error message from backend if available, otherwise provide a generic one
          throw new Error(
            result.message || `HTTP error! status: ${response.status}`
          );
        }

        console.log("Semester creation success:", result);
        setLoading(false);
        onSuccess(result.data); // Pass created semester data back
        onClose(); // Close modal
        // setTimeout(refreshPage, 300); // Optional: Refresh page after a short delay
      } catch (error) {
        console.error("Error creating semester:", error);
        setLoading(false); // Stop loading indicator on error
        // Display the error message (from backend or network error)
        setErrors({
          form:
            error.message || "An unexpected error occurred. Please try again.",
        });
      }
    } else {
      console.log("Validation errors:", currentErrors);
    }
  };

  // Handler for closing the modal
  const handleClose = () => {
    onClose();
    // Optional: Refresh if closing cancels the action and you want to reset state elsewhere
    // setTimeout(refreshPage, 300);
  };

  // Basic theme structure (adjust as needed)
  const theme = {
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
    colors: { error: "#dc3545", border: "#dee2e6" },
    typography: { caption: { fontSize: "12px", color: "#dc3545" } }, // Style for error text
  };

  // --- JSX-like structure for the Modal ---
  // Assuming Modal, TextField, Button are defined elsewhere (like in MiniReact context)
  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: handleClose, // Use handleClose for the modal's own close mechanism
      title: "Add New Semester",
      children: [
        {
          type: "form",
          props: {
            // Prevent default form submission which causes page reload
            onSubmit: (e) => {
              e.preventDefault();
              handleSubmit();
            },
            children: [
              // --- Input Fields ---
              {
                type: TextField,
                props: {
                  label: "Semester ID",
                  value: formData.semesterId,
                  onChange: (e) => handleChange("semesterId", e.target.value),
                  error: !!errors.semesterId, // Boolean check for error presence
                  helperText: errors.semesterId || "Example: 2024-S1",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Batch ID",
                  value: formData.batchId,
                  onChange: (e) => handleChange("batchId", e.target.value),
                  error: !!errors.batchId,
                  helperText: errors.batchId || "Example: CSE-2022",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Academic Year",
                  type: "number", // Use number type for better UX on some devices
                  value: formData.academicYear,
                  onChange: (e) => handleChange("academicYear", e.target.value),
                  error: !!errors.academicYear,
                  helperText:
                    errors.academicYear || "Enter a 4-digit year (e.g., 2024)",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Semester Number",
                  type: "number",
                  value: formData.semesterNum,
                  onChange: (e) => handleChange("semesterNum", e.target.value),
                  error: !!errors.semesterNum,
                  helperText: errors.semesterNum || "Enter 1 or 2",
                },
              },
              {
                type: TextField,
                props: {
                  label: "Start Date",
                  type: "date", // Use date type for calendar picker
                  value: formData.startDate,
                  onChange: (e) => handleChange("startDate", e.target.value),
                  error: !!errors.startDate,
                  helperText:
                    errors.startDate || "Select the start date (YYYY-MM-DD)",
                },
              },
              {
                type: TextField,
                props: {
                  label: "End Date",
                  type: "date",
                  value: formData.endDate,
                  onChange: (e) => handleChange("endDate", e.target.value),
                  error: !!errors.endDate,
                  helperText:
                    errors.endDate ||
                    "Select the end date (must be after start date)",
                },
              },
              {
                // Example using a Select/Dropdown if you have one, otherwise TextField
                type: TextField, // Replace with Select if available
                props: {
                  label: "Status",
                  value: formData.status,
                  onChange: (e) => handleChange("status", e.target.value),
                  // If using Select, options would be passed here:
                  // options: [{value: "PLANNED", label: "Planned"}, {value: "ONGOING", label: "Ongoing"}, {value: "COMPLETED", label: "Completed"}]
                  error: !!errors.status,
                  helperText: errors.status || "Initial status (e.g., PLANNED)",
                },
              },

              // --- Form-level Error Display ---
              errors.form && {
                type: "div",
                props: {
                  style: {
                    color: theme.colors.error,
                    marginTop: theme.spacing.md,
                    fontSize: theme.typography.caption.fontSize,
                  },
                  children: errors.form,
                },
              },

              // --- Action Buttons ---
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
                        onClick: handleClose, // Use specific close handler
                        disabled: loading,
                        children: "Cancel",
                      },
                    },
                    {
                      type: Button,
                      props: {
                        // Type submit triggers form onSubmit if needed, or use onClick directly
                        // type: "submit", // Optional: depends on form handling preference
                        onClick: handleSubmit, // Explicitly call submit handler
                        disabled: loading, // Disable button while submitting
                        children: loading ? "Creating..." : "Create Semester",
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

// Make component available globally or export as needed
window.AddSemester = AddSemester;
