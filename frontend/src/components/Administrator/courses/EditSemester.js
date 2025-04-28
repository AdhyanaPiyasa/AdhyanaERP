// components/Admin/semesters/EditSemester.js
const EditSemester = ({ semester, onClose, onSuccess }) => {
  console.log(
    "[EditSemester] Initializing with semester:",
    JSON.stringify(semester, null, 2)
  );

  // Initialize form state with semester data or defaults
  const [formData, setFormData] = MiniReact.useState({
    semesterId: semester?.semesterId || semester?.id || "",
    batchId: semester?.batchId || "",
    academicYear:
      semester?.academicYear?.toString() || semester?.year?.toString() || "",
    semesterNum:
      semester?.semesterNum?.toString() || semester?.semester?.toString() || "",
    startDate: semester?.startDate || semester?.startedAt || "",
    endDate: semester?.endDate || semester?.endAt || "",
    status: semester?.status || "PLANNED",
  });

  // State for validation errors
  const [errors, setErrors] = MiniReact.useState({});

  // State for loading indicator during submission
  const [loading, setLoading] = MiniReact.useState(false);

  // Effect to update form data if the semester prop changes
  MiniReact.useEffect(() => {
    if (semester) {
      console.log(
        "[EditSemester] Semester prop changed, updating form data:",
        JSON.stringify(semester, null, 2)
      );

      // Create new form data object from semester
      const newFormData = {
        semesterId: semester.semesterId || semester.id || "",
        batchId: semester.batchId || "",
        academicYear:
          semester.academicYear?.toString() || semester.year?.toString() || "",
        semesterNum:
          semester.semesterNum?.toString() ||
          semester.semester?.toString() ||
          "",
        startDate: semester.startDate || semester.startedAt || "",
        endDate: semester.endDate || semester.endAt || "",
        status: semester.status || "PLANNED",
      };

      console.log(
        "[EditSemester] New form data:",
        JSON.stringify(newFormData, null, 2)
      );

      // Update form data state
      setFormData(newFormData);

      // Reset errors when semester changes
      setErrors({});
    } else {
      console.warn("[EditSemester] Received null/undefined semester prop");
    }
  }, [semester]);

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
    console.log(`[EditSemester] Field change: ${field} = ${value}`);

    let errorMessage = "";

    // Basic validation on change
    switch (field) {
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
    console.log("[EditSemester] Submit button clicked");

    // --- Final Validation Before Submission ---
    const currentErrors = {
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

        console.log("[EditSemester] Updating semester data:", semesterData); // For debugging

        const token = localStorage.getItem("token"); // Get auth token if needed
        // Construct URL with semester ID for PUT request
        const url = `http://localhost:8081/api/api/courses/semesters/${encodeURIComponent(
          formData.semesterId
        )}`;

        console.log(`[EditSemester] Sending PUT request to: ${url}`);

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(semesterData),
        });

        const result = await response.json(); // Always try to parse JSON
        console.log("[EditSemester] API response:", result);

        if (!response.ok) {
          // Use error message from backend if available, otherwise provide a generic one
          throw new Error(
            result.message || `HTTP error! status: ${response.status}`
          );
        }

        console.log("[EditSemester] Semester update success:", result);
        setLoading(false);

        // If the API response includes the updated semester data, use it
        // Otherwise, use our formData to construct the return object
        const updatedSemester = result.data || {
          id: formData.semesterId,
          semesterId: formData.semesterId,
          batchId: formData.batchId,
          year: parseInt(formData.academicYear, 10),
          academicYear: parseInt(formData.academicYear, 10),
          semester: parseInt(formData.semesterNum, 10),
          semesterNum: parseInt(formData.semesterNum, 10),
          startDate: formData.startDate,
          startedAt: formData.startDate,
          endDate: formData.endDate,
          endAt: formData.endDate,
          status: formData.status,
        };

        onSuccess(updatedSemester); // Pass updated semester data back
        onClose(); // Close modal
        setTimeout(refreshPage, 300); // Refresh page after a short delay
      } catch (error) {
        console.error("[EditSemester] Error updating semester:", error);
        setLoading(false); // Stop loading indicator on error
        // Display the error message (from backend or network error)
        setErrors({
          form:
            error.message || "An unexpected error occurred. Please try again.",
        });
      }
    } else {
      console.log("[EditSemester] Validation errors found:", currentErrors);
    }
  };

  // Handler for closing the modal with page refresh
  const handleClose = () => {
    console.log("[EditSemester] Close button clicked");
    onClose();
    setTimeout(refreshPage, 300);
  };

  // Basic theme structure (adjust as needed)
  const theme = {
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
    colors: { error: "#dc3545", border: "#dee2e6" },
    typography: { caption: { fontSize: "12px", color: "#dc3545" } }, // Style for error text
  };

  // --- JSX-like structure for the Modal ---
  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: handleClose,
      title: "Edit Semester",
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
                  disabled: true, // Make it non-editable
                  helperText: "Semester ID cannot be changed",
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
                  type: "number",
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
                  type: "date",
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
                // Status field
                type: TextField, // Replace with Select if available
                props: {
                  label: "Status",
                  value: formData.status,
                  onChange: (e) => handleChange("status", e.target.value),
                  error: !!errors.status,
                  helperText:
                    errors.status ||
                    "Status (e.g., PLANNED, ONGOING, COMPLETED)",
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
                    padding: theme.spacing.sm,
                    backgroundColor: "rgba(220, 53, 69, 0.1)",
                    borderRadius: "4px",
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
            ].filter(Boolean), // Filter out null/undefined elements (like conditional error message)
          },
        },
      ],
    },
  };
};
