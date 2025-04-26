// // components/Admin/courses/DeleteConfirmation.js
// const coursesDeleteConfirmation = ({ onClose, onConfirm }) => {
//     return {
//         type: Modal,
//         props: {
//             isOpen: true,
//             onClose: onClose,
//             title: 'Confirm the deletion of course',
//             children: [
//                 {
//                     type: Card,
//                     props: {
//                         children: [
//                             {
//                                 type: 'p',
//                                 props: {
//                                     children: ['Record of the course will be permanently remove !!!']
//                                 }
//                             },
//                             {
//                                 type: 'div',
//                                 props: {
//                                     style: {
//                                         display: 'flex',
//                                         justifyContent: 'flex-end',
//                                         gap: theme.spacing.md
//                                     },
//                                     children: [
//                                         {
//                                             type: Button,
//                                             props: {
//                                                 onClick: onClose,
//                                                 variant: 'secondary',
//                                                 size: 'medium',
//                                                 children: 'Cancel'
//                                             }
//                                         },
//                                         {
//                                             type: Button,
//                                             props: {
//                                                 onClick: (e) => {
//                                                     // Prevent event bubbling/propagation
//                                                     e.preventDefault();
//                                                     e.stopPropagation();
//                                                     onConfirm();
//                                                 },
//                                                 size: 'medium',
//                                                 children: 'Delete'
//                                             }
//                                         }
//                                     ]
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     };
// };

// window.coursesDeleteConfirmation = coursesDeleteConfirmation;





// components/Admin/courses/DeleteConfirmation.js
const coursesDeleteConfirmation = ({ course, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);

    const handleDelete = async () => {
        if (!course) return;
        
        setIsDeleting(true);
        setError(null);
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:8081/api/courses/courseCore/${course.id}`,
                {
                    method: "DELETE",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                // Call onConfirm callback to update parent state
                if (onConfirm) {
                    onConfirm();
                }
            } else {
                throw new Error(data.message || "Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            setError(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Confirm Course Deletion',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'p',
                                props: {
                                    children: [
                                        `Are you sure you want to delete the course "${course?.name || ''}" (${course?.id || ''})? This action cannot be undone.`
                                    ]
                                }
                            },
                            error && {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.sm,
                                        marginTop: theme.spacing.md,
                                        marginBottom: theme.spacing.md,
                                        backgroundColor: "#ffebee",
                                        color: "#c62828",
                                        borderRadius: theme.spacing.sm,
                                    },
                                    children: [error]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                onClick: onClose,
                                                variant: 'secondary',
                                                size: 'medium',
                                                disabled: isDeleting,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: (e) => {
                                                    // Prevent event bubbling/propagation
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDelete();
                                                },
                                                variant: 'error',
                                                size: 'medium',
                                                disabled: isDeleting,
                                                children: isDeleting ? 'Deleting...' : 'Delete'
                                            }
                                        }
                                    ]
                                }
                            }
                        ].filter(Boolean)
                    }
                }
            ]
        }
    };
};

window.coursesDeleteConfirmation = coursesDeleteConfirmation;