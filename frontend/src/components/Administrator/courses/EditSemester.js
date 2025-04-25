// components/Admin/courses/EditSemester.js
const EditSemester = ({ semester, onClose }) => {
  const [formData, setFormData] = MiniReact.useState({
    batchId: semester?.batchId || "",
    year: semester?.year || "",
    semester: semester?.semester || "",
    startedAt: semester?.startedAt || "",
    endAt: semester?.endAt || "",
    status: semester?.status || "upcoming",
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
  };

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "past", label: "Past" },
  ];

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
              {
                type: TextField,
                props: {
                  label: "Batch ID",
                  value: formData.batchId,
                  onChange: (e) =>
                    setFormData({ ...formData, batchId: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "Year",
                  value: formData.year,
                  onChange: (e) =>
                    setFormData({ ...formData, year: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "Semester",
                  value: formData.semester,
                  onChange: (e) =>
                    setFormData({ ...formData, semester: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "Start Date",
                  value: formData.startedAt,
                  onChange: (e) =>
                    setFormData({ ...formData, startedAt: e.target.value }),
                },
              },
              {
                type: TextField,
                props: {
                  label: "End Date",
                  value: formData.endAt,
                  onChange: (e) =>
                    setFormData({ ...formData, endAt: e.target.value }),
                },
              },
              {
                type: Select,
                props: {
                  label: "Status",
                  value: formData.status,
                  options: statusOptions,
                  onChange: (e) =>
                    setFormData({ ...formData, status: e.target.value }),
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

window.EditSemester = EditSemester;
