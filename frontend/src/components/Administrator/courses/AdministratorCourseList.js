const AdministratorCourseList = ({ courseId }) => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedCourse, setSelectedCourse] = MiniReact.useState(null);

    const route = navigation.getCurrentRoute();
    const degreeId = route.split('/')[1];

    // Mock data structure remains the same
    const degreePrograms = {
        'CS2022': {
            name: 'Computer Science',
            duration: 4,
            courses: [
                {
                    courseCode: 'CS1205',
                    courseName: 'Data Structures and algorithm',
                    semester: 'Semester 01',
                    credits: 3,
                    teacher: 'prof. Dr.John Doe',
                    duration: 15
                },
                {
                    courseCode: 'CS1206',
                    courseName: 'Database Systems',
                    semester: 'Semester 01',
                    credits: 3,
                    teacher: 'prof. Dr.John Doe',
                    duration: 15
                }
            ]
        },
        'IS2022': {
            name: 'Information Systems',
            duration: 3,
            courses: []
        }
    };

    const currentProgram = degreePrograms[degreeId] || { name: 'Unknown Program', duration: 0, courses: [] };
    const courses = currentProgram.courses;

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setShowEditModal(true);
    };

    const handleDelete = (course) => {
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        console.log('Deleting course:', selectedCourse);
        setShowDeleteModal(false);
    };

    return {
        type: 'div',
        props: {
            children: [
                // Program Information Card
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: [currentProgram.name]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'strong',
                                                        props: {
                                                            children: ['Duration: ']
                                                        }
                                                    },
                                                    `${currentProgram.duration} Years`
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Course List Card
                {
                    type: Card,
                    props: {
                        children: [
                            // Header Section with Title and Add Button
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Course Details']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowAddModal(true),
                                                            children: '+ Add New Course'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Course Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Course Code', 'Course Name', 'Semester', 'Credits', 'Teacher', 'Duration (Weeks)', 'Actions'],
                                    data: courses.map(course => ({
                                        'Course Code': course.courseCode,
                                        'Course Name': course.courseName,
                                        'Semester': course.semester,
                                        'Credits': course.credits,
                                        'Teacher': course.teacher,
                                        'Duration (Weeks)': course.duration,
                                        'Actions': {
                                            type: Card,
                                            props: {
                                                variant: 'ghost',
                                                noPadding: true,
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                display: 'flex',
                                                                gap: theme.spacing.sm
                                                            },
                                                            children: [
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleEdit(course),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Edit'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleDelete(course),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Delete'
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // Modals
                showAddModal && {
                    type: AddCourse,
                    props: {
                        onClose: () => setShowAddModal(false)
                    }
                },
                showEditModal && {
                    type: EditCourse,
                    props: {
                        course: selectedCourse,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: coursesDeleteConfirmation,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.AdministratorCourseList = AdministratorCourseList;