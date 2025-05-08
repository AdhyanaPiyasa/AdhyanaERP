// components/Admin/courses/EditSemesterCourse.js
const EditSemesterCourse = ({ semester, onClose, onSuccess }) => {
  const [offerings, setOfferings] = MiniReact.useState(
    semester?.offerings?.map((offering) => ({
      courseId: offering.courseId || "",
      teacherId: offering.staffId || "",
      teacherName: offering.teacherName || "",
    })) || []
  );

  const [errors, setErrors] = MiniReact.useState({
    offerings: Array(semester?.offerings?.length || 0).fill({}),
    form: "",
  });

  const [loading, setLoading] = MiniReact.useState(false);
  const [courses, setCourses] = MiniReact.useState([]);
  const [teachers, setTeachers] = MiniReact.useState([]);

  // Fetch courses and teachers when component mounts
  MiniReact.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch courses
        const coursesResponse = await fetch(
          "http://localhost:8081/api/api/courses/courseCore",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData.data || []);
        }

        // Fetch teachers (staff)
        const teachersResponse = await fetch(
          "http://localhost:8081/api/api/staff",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json();
          setTeachers(teachersData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const refreshPage = () => {
    window.location.reload();
  };

  const handleOfferingChange = (index, field, value) => {
    const updatedOfferings = [...offerings];
    updatedOfferings[index] = {
      ...updatedOfferings[index],
      [field]: value,
    };

    setOfferings(updatedOfferings);

    // If changing teacherId, update the teacherName for display purposes
    if (field === "teacherId") {
      const teacher = teachers.find(
        (t) => t.staffId?.toString() === value?.toString()
      );
      if (teacher) {
        updatedOfferings[index].teacherName = teacher.name;
      }
    }
  };

  const addOffering = () => {
    setOfferings([
      ...offerings,
      { courseId: "", teacherId: "", teacherName: "" },
    ]);

    // Add a new empty error object to the offerings errors array
    setErrors({
      ...errors,
      offerings: [...errors.offerings, {}],
    });
  };

  const removeOffering = (index) => {
    const updatedOfferings = [...offerings];
    updatedOfferings.splice(index, 1);
    setOfferings(updatedOfferings);

    // Also remove the corresponding error object
    const updatedErrors = [...errors.offerings];
    updatedErrors.splice(index, 1);
    setErrors({
      ...errors,
      offerings: updatedErrors,
    });
  };

  const validateOfferings = () => {
    // Validate that no duplicate course offerings exist
    const courseIds = new Set();
    const offeringErrors = offerings.map((offering) => {
      const errors = {};

      if (!offering.courseId) {
        errors.courseId = "Course is required";
      } else if (courseIds.has(offering.courseId)) {
        errors.courseId = "Duplicate course";
      } else {
        courseIds.add(offering.courseId);
      }

      if (!offering.teacherId) {
        errors.teacherId = "Teacher is required";
      }

      return errors;
    });

    return offeringErrors;
  };

  const handleSubmit = async () => {
    const offeringErrors = validateOfferings();

    setErrors({
      ...errors,
      offerings: offeringErrors,
      form: "",
    });

    // Check if there are any errors in offerings
    const hasOfferingErrors = offeringErrors.some((offeringError) =>
      Object.values(offeringError).some((error) => error !== "")
    );

    if (!hasOfferingErrors) {
      setLoading(true);
      try {
        // Prepare data for the API - offerings data only
        const semesterData = {
          semesterId: semester.semesterId || semester.id,
          offerings: offerings.map((offering) => ({
            courseId: offering.courseId,
            staffId: parseInt(offering.teacherId, 10),
          })),
        };

        console.log("Submitting semester course data:", semesterData);

        const token = localStorage.getItem("token");
        const url = `http://localhost:8081/api/api/courses/semesters/${
          semester.semesterId || semester.id
        }/offerings`;

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
          throw new Error(
            errorData.message || "Could not update semester courses"
          );
        }

        const result = await response.json();
        setLoading(false);
        onSuccess(result.data);
        onClose();
        setTimeout(refreshPage, 300);
      } catch (error) {
        setLoading(false);
        setErrors({
          ...errors,
          form: error.message || "An error occurred",
        });
        console.error("Error updating semester courses:", error);
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

  const hasOfferings = Array.isArray(offerings) && offerings.length > 0;

  return {
    type: Modal,
    props: {
      isOpen: true,
      onClose: onClose,
      title: "Edit Semester Courses",
      children: [
        {
          type: "form",
          props: {
            children: [
              // Course Offerings Section
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
                        children: [
                          `Courses for ${semester.year || ""} - Semester ${
                            semester.semester || ""
                          }`,
                        ],
                      },
                    },

                    // Message if no offerings yet
                    !hasOfferings
                      ? {
                          type: "div",
                          props: {
                            style: {
                              marginBottom: theme.spacing.md,
                              padding: theme.spacing.md,
                              backgroundColor: theme.colors.background,
                              borderRadius: theme.shape.borderRadius.md,
                              textAlign: "center",
                              color: theme.colors.textSecondary,
                            },
                            children: [
                              "No courses assigned to this semester yet. Add your first course below.",
                            ],
                          },
                        }
                      : null,

                    // Course offerings list
                    ...offerings.map((offering, index) => ({
                      type: "div",
                      props: {
                        key: `offering-${index}`,
                        style: {
                          marginBottom: theme.spacing.md,
                          padding: theme.spacing.md,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: theme.shape.borderRadius.md,
                          position: "relative",
                        },
                        children: [
                          // Remove offering button
                          {
                            type: "button",
                            props: {
                              onClick: () => removeOffering(index),
                              style: {
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: theme.colors.error,
                                fontSize: "16px",
                              },
                              children: ["✕"],
                            },
                          },
                          // Course and Teacher Selection
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                gap: theme.spacing.md,
                                marginTop: theme.spacing.sm,
                              },
                              children: [
                                // Course Selection
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      flex: 1,
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
                                          children: ["Course"],
                                        },
                                      },
                                      {
                                        type: "select",
                                        props: {
                                          value: offering.courseId,
                                          onChange: (e) =>
                                            handleOfferingChange(
                                              index,
                                              "courseId",
                                              e.target.value
                                            ),
                                          style: {
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius:
                                              theme.shape.borderRadius.sm,
                                            border: `1px solid ${
                                              errors.offerings[index]?.courseId
                                                ? theme.colors.error
                                                : theme.colors.border
                                            }`,
                                          },
                                          children: [
                                            {
                                              type: "option",
                                              props: {
                                                value: "",
                                                children: ["Select a course"],
                                              },
                                            },
                                            ...courses.map((course) => ({
                                              type: "option",
                                              props: {
                                                key: course.courseId,
                                                value: course.courseId,
                                                children: [
                                                  `${course.courseId} - ${course.name}`,
                                                ],
                                              },
                                            })),
                                          ],
                                        },
                                      },
                                      errors.offerings[index]?.courseId
                                        ? {
                                            type: "div",
                                            props: {
                                              style: {
                                                color: theme.colors.error,
                                                fontSize: "12px",
                                                marginTop: "4px",
                                              },
                                              children: [
                                                errors.offerings[index]
                                                  .courseId,
                                              ],
                                            },
                                          }
                                        : null,
                                    ],
                                  },
                                },

                                // Teacher Selection
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      flex: 1,
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
                                          children: ["Teacher"],
                                        },
                                      },
                                      {
                                        type: "select",
                                        props: {
                                          value: offering.teacherId,
                                          onChange: (e) =>
                                            handleOfferingChange(
                                              index,
                                              "teacherId",
                                              e.target.value
                                            ),
                                          style: {
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius:
                                              theme.shape.borderRadius.sm,
                                            border: `1px solid ${
                                              errors.offerings[index]?.teacherId
                                                ? theme.colors.error
                                                : theme.colors.border
                                            }`,
                                          },
                                          children: [
                                            {
                                              type: "option",
                                              props: {
                                                value: "",
                                                children: ["Select a teacher"],
                                              },
                                            },
                                            ...teachers.map((teacher) => ({
                                              type: "option",
                                              props: {
                                                key: teacher.staffId,
                                                value: teacher.staffId,
                                                children: [teacher.name],
                                              },
                                            })),
                                          ],
                                        },
                                      },
                                      errors.offerings[index]?.teacherId
                                        ? {
                                            type: "div",
                                            props: {
                                              style: {
                                                color: theme.colors.error,
                                                fontSize: "12px",
                                                marginTop: "4px",
                                              },
                                              children: [
                                                errors.offerings[index]
                                                  .teacherId,
                                              ],
                                            },
                                          }
                                        : null,
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    })),

                    // Add Offering Button
                    {
                      type: "button",
                      props: {
                        onClick: addOffering,
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          padding: theme.spacing.sm,
                          backgroundColor: theme.colors.background,
                          border: `1px dashed ${theme.colors.border}`,
                          borderRadius: theme.shape.borderRadius.md,
                          cursor: "pointer",
                          color: theme.colors.primary,
                          marginBottom: theme.spacing.lg,
                        },
                        children: ["+ Add Course Offering"],
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

window.EditSemesterCourse = EditSemesterCourse;
