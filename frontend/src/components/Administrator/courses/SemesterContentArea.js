// components/Admin/courses/SemesterContentArea.js
const SemesterContentArea = ({ state, setState }) => {
  // Use state from props or fallback to local state if not provided
  const showAddModal = state?.showAddModal || false;
  const showEditModal = state?.showEditModal || false;
  const showDeleteModal = state?.showDeleteModal || false;
  const selectedSemester = state?.selectedSemester || null;

  // Function to update parent state
  const updateState = (updates) => {
    if (setState) {
      setState((prevState) => ({
        ...prevState,
        ...updates,
      }));
    }
  };

  // Sample semester data
  const semesters = [
    {
      id: 1,
      batchId: "CS2023",
      year: 1,
      semester: 1,
      status: "ongoing",
      startedAt: "August 2023",
      endAt: "December 2023",
      courses: [
        { courseId: "CS101", teacherName: "Dr. John Smith", teacherRating: 4 },
        {
          courseId: "CS102",
          teacherName: "Dr. Sarah Johnson",
          teacherRating: 5,
        },
        {
          courseId: "MATH101",
          teacherName: "Prof. Michael Brown",
          teacherRating: 3,
        },
      ],
    },
    {
      id: 2,
      batchId: "CS2023",
      year: 1,
      semester: 2,
      status: "ongoing",
      startedAt: "January 2024",
      endAt: "May 2024",
      courses: [
        { courseId: "CS201", teacherName: "Dr. Emma Wilson", teacherRating: 4 },
        {
          courseId: "CS202",
          teacherName: "Prof. Robert Taylor",
          teacherRating: 3,
        },
        {
          courseId: "MATH102",
          teacherName: "Dr. Lisa Anderson",
          teacherRating: 5,
        },
      ],
    },
    {
      id: 3,
      batchId: "CS2022",
      year: 2,
      semester: 1,
      status: "past",
      startedAt: "August 2022",
      endAt: "December 2022",
      courses: [
        {
          courseId: "CS301",
          teacherName: "Prof. David Clark",
          teacherRating: 4,
        },
        { courseId: "CS302", teacherName: "Dr. Emily White", teacherRating: 2 },
        {
          courseId: "MATH201",
          teacherName: "Prof. James Wilson",
          teacherRating: 5,
        },
      ],
    },
    {
      id: 4,
      batchId: "CS2022",
      year: 2,
      semester: 2,
      status: "past",
      startedAt: "January 2023",
      endAt: "May 2023",
      courses: [
        {
          courseId: "CS401",
          teacherName: "Dr. Linda Martinez",
          teacherRating: 4,
        },
        {
          courseId: "CS402",
          teacherName: "Prof. Thomas Johnson",
          teacherRating: 5,
        },
        {
          courseId: "MATH202",
          teacherName: "Dr. Kevin Davis",
          teacherRating: 3,
        },
      ],
    },
    {
      id: 5,
      batchId: "CS2021",
      year: 3,
      semester: 1,
      status: "past",
      startedAt: "August 2021",
      endAt: "December 2021",
      courses: [
        {
          courseId: "CS501",
          teacherName: "Prof. Richard Lee",
          teacherRating: 4,
        },
        {
          courseId: "CS502",
          teacherName: "Dr. Catherine Moore",
          teacherRating: 5,
        },
        {
          courseId: "MATH301",
          teacherName: "Prof. Jennifer Adams",
          teacherRating: 3,
        },
      ],
    },
    {
      id: 6,
      batchId: "CS2021",
      year: 3,
      semester: 2,
      status: "past",
      startedAt: "January 2022",
      endAt: "May 2022",
      courses: [
        {
          courseId: "CS601",
          teacherName: "Dr. Samuel Wilson",
          teacherRating: 4,
        },
        {
          courseId: "CS602",
          teacherName: "Prof. Elizabeth Taylor",
          teacherRating: 5,
        },
        {
          courseId: "MATH302",
          teacherName: "Dr. Andrew Brown",
          teacherRating: 3,
        },
      ],
    },
  ];

  const handleEdit = () => {
    if (selectedSemester) {
      updateState({ showEditModal: true });
    }
  };

  const handleDelete = () => {
    if (selectedSemester) {
      updateState({ showDeleteModal: true });
    }
  };

  const handleRowClick = (semester) => {
    console.log("Row clicked, setting semester:", semester);
    updateState({ selectedSemester: semester });
  };

  const handleAddClick = () => {
    updateState({ showAddModal: true });
  };

  const styles = {
    container: {
      display: "flex",
      height: "100%",
    },
    tableSection: {
      width: "60%",
      paddingRight: theme.spacing.lg,
    },
    detailsSection: {
      width: "40%",
      borderLeft: `1px solid ${theme.colors.border}`,
      paddingLeft: theme.spacing.lg,
    },
  };

  return {
    type: "div",
    props: {
      style: styles.container,
      children: [
        // Left side - Semester Table
        {
          type: "div",
          props: {
            style: styles.tableSection,
            children: [
              {
                type: SemesterTable,
                props: {
                  semesters: semesters,
                  onRowClick: handleRowClick,
                  onAddClick: handleAddClick,
                },
              },
            ],
          },
        },

        // Right side - Focus Panel
        {
          type: "div",
          props: {
            style: styles.detailsSection,
            children: [
              {
                type: SemesterFocusPanel,
                props: {
                  semester: selectedSemester,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                },
              },
            ],
          },
        },

        // Modals
        showAddModal && {
          type: AddSemester,
          props: {
            onClose: () => updateState({ showAddModal: false }),
          },
        },
        showEditModal && {
          type: EditSemester,
          props: {
            semester: selectedSemester,
            onClose: () => updateState({ showEditModal: false }),
          },
        },
        showDeleteModal && {
          type: SemesterDeleteConfirmation,
          props: {
            onClose: () => updateState({ showDeleteModal: false }),
            onConfirm: () => {
              console.log("Deleting semester:", selectedSemester);
              updateState({ showDeleteModal: false, selectedSemester: null });
            },
          },
        },
      ].filter(Boolean),
    },
  };
};

window.SemesterContentArea = SemesterContentArea;
