// components/Admin/courses/EditSemester.js
const EditSemester = ({ semester, onClose, onSuccess }) => {
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

  const [errors, setErrors] = MiniReact.useState({
    batchId: "",
    academicYear: "",
    semesterNum: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const [loading, setLoading] = MiniReact.useState(false);

  const refreshPage = () => {
    window.location.reload();
  };

  const validateSemesterNum = (value) => {
    if (value && !["1", "2"].includes(value)) {
      return "Semester number must be 1 or 2";
    }
    return "";
  };

  const validateAcademicYear = (value) => {
    if (value) {
      const year = parseInt(value, 10);
      if (isNaN(year) || year < 2000 || year > 2100) {
        return "Academic year must be between 2000 and 2100";
      }
    }
    return "";
  };

  const validateDate = (value, fieldName) => {
    if (!value) {
      return `${fieldName} is required`;
    }

    // Check if it's in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return `${fieldName} must be in YYYY-MM-DD format`;
    }

    return "";
  };

  const validateStatus = (value) => {
    const validStatuses = ["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(value)) {
      return "Status must be one of: PLANNED, ONGOING, COMPLETED, CANCELLED";
    }
    return "";
  };

  const handleChange = (field, value) => {
    let errorMessage = "";

    // Validate based on field type
    if (field === "semesterNum") {
      errorMessage = validateSemesterNum(value);
    } else if (field === "academicYear") {
      errorMessage = validateAcademicYear(value);
    } else if (field === "startDate") {
      errorMessage = validateDate(value, "Start date");
    } else if (field === "endDate") {
      errorMessage = validateDate(value, "End date");
    } else if (field === "status") {
      errorMessage = validateStatus(value);
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
    const semesterNumError = validateSemesterNum(formData.semesterNum);
    const academicYearError = validateAcademicYear(formData.academicYear);
    const startDateError = validateDate(formData.startDate, "Start date");
    const endDateError = validateDate(formData.endDate, "End date");
    const statusError = validateStatus(formData.status);

    const newErrors = {
      semesterNum: semesterNumError,
      academicYear: academicYearError,
      startDate: startDateError,
      endDate: endDateError,
      status: statusError,
    };

    setErrors(newErrors);

    // Check if there are any errors in semester data
    const hasSemesterErrors = Object.values(newErrors).some(
      (error) => error !== ""
    );

    if (!hasSemesterErrors) {
      setLoading(true);
      try {
        // Prepare data for the API - semester data only
        const semesterData = {
          semesterId: formData.semesterId,
          batchId: formData.batchId,
          academicYear: parseInt(formData.academicYear, 10),
          semesterNum: parseInt(formData.semesterNum, 10),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          // Note: We're not including offerings here
          // as that's handled in the EditSemesterCourse component
        };

        console.log("Submitting semester data:", semesterData);

        const token = localStorage.getItem("token");
        const url = `http://localhost:8081/api/api/courses/semesters/${encodeURIComponent(
          formData.semesterId
        )}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(semesterData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Could not update semester");
        }

        const result = await response.json();
        setLoading(false);
        onSuccess(result.data);
        onClose();
        setTimeout(refreshPage, 300);
      } catch (error) {
        setLoading(false);
        setErrors({ ...errors, form: error.message || "An error occurred" });
        console.error("Error updating semester:", error);
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
      h3: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
  };

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Edit Semester",
      children: [
        {
          type: "form",
          props: {
            children: [
              // Semester Details Section
              {
                type: "div",
                props: {
                  children: [
                    {
                      type: "h3",
                      props: {
                        style: {
                          marginBottom: theme.spacing.md,
                          borderBottom: `1px solid ${theme.colors.border}`,
                          paddingBottom: theme.spacing.sm,
                        },
                        children: ["Semester Details"],
                      },
                    },
                    {
                      type: TextField,
                      props: {
                        label: "Semester ID",
                        value: formData.semesterId,
                        disabled: true,
                      },
                    },
                    {
                      type: TextField,
                      props: {
                        label: "Batch ID",
                        value: formData.batchId,
                        onChange: (e) =>
                          handleChange("batchId", e.target.value),
                        error: errors.batchId,
                        helperText: errors.batchId,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          gap: theme.spacing.md,
                        },
                        children: [
                          {
                            type: TextField,
                            props: {
                              label: "Academic Year",
                              value: formData.academicYear,
                              onChange: (e) =>
                                handleChange("academicYear", e.target.value),
                              error: errors.academicYear,
                              helperText:
                                errors.academicYear ||
                                "Enter a year (e.g. 2024)",
                              style: { flex: 1 },
                            },
                          },
                          {
                            type: TextField,
                            props: {
                              label: "Semester Number",
                              value: formData.semesterNum,
                              onChange: (e) =>
                                handleChange("semesterNum", e.target.value),
                              error: errors.semesterNum,
                              helperText: errors.semesterNum || "Enter 1 or 2",
                              style: { flex: 1 },
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          gap: theme.spacing.md,
                        },
                        children: [
                          {
                            type: TextField,
                            props: {
                              label: "Start Date",
                              type: "date",
                              value: formData.startDate,
                              onChange: (e) =>
                                handleChange("startDate", e.target.value),
                              error: errors.startDate,
                              helperText: errors.startDate || "YYYY-MM-DD",
                              style: { flex: 1 },
                            },
                          },
                          {
                            type: TextField,
                            props: {
                              label: "End Date",
                              type: "date",
                              value: formData.endDate,
                              onChange: (e) =>
                                handleChange("endDate", e.target.value),
                              error: errors.endDate,
                              helperText: errors.endDate || "YYYY-MM-DD",
                              style: { flex: 1 },
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          marginBottom: theme.spacing.lg,
                        },
                        children: [
                          {
                            type: "label",
                            props: {
                              style: {
                                display: "block",
                                marginBottom: theme.spacing.xs,
                                fontSize: "14px",
                              },
                              children: ["Status"],
                            },
                          },
                          {
                            type: "select",
                            props: {
                              value: formData.status,
                              onChange: (e) =>
                                handleChange("status", e.target.value),
                              style: {
                                width: "100%",
                                padding: "8px",
                                borderRadius: theme.shape.borderRadius.sm,
                                border: `1px solid ${
                                  errors.status
                                    ? theme.colors.error
                                    : theme.colors.border
                                }`,
                              },
                              children: [
                                {
                                  type: "option",
                                  props: {
                                    value: "PLANNED",
                                    children: ["Planned"],
                                  },
                                },
                                {
                                  type: "option",
                                  props: {
                                    value: "ONGOING",
                                    children: ["Ongoing"],
                                  },
                                },
                                {
                                  type: "option",
                                  props: {
                                    value: "COMPLETED",
                                    children: ["Completed"],
                                  },
                                },
                                {
                                  type: "option",
                                  props: {
                                    value: "CANCELLED",
                                    children: ["Cancelled"],
                                  },
                                },
                              ],
                            },
                          },
                          errors.status
                            ? {
                                type: "div",
                                props: {
                                  style: {
                                    color: theme.colors.error,
                                    fontSize: "12px",
                                    marginTop: "4px",
                                  },
                                  children: [errors.status],
                                },
                              }
                            : null,
                        ],
                      },
                    },
                  ],
                },
              },

              // Error message for the whole form
              errors.form
                ? {
                    type: "div",
                    props: {
                      style: {
                        color: theme.colors.error,
                        marginBottom: theme.spacing.md,
                        padding: theme.spacing.sm,
                        backgroundColor: `${theme.colors.error}15`,
                        borderRadius: theme.shape.borderRadius.sm,
                      },
                      children: [errors.form],
                    },
                  }
                : null,

              // Action Buttons
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
            ].filter(Boolean),
          },
        },
      ],
    },
  };
};

window.EditSemester = EditSemester;
