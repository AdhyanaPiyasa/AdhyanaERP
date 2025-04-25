// components/Admin/students/DeleteConfirmation.js
const studentsDeleteConfirmation = ({ onClose, onConfirm }) => {
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Confirm the deletion of student record',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'p',
                                props: {
                                    children: ['Record of the student will be permanently remove !!!']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                onClick: onClose,
                                                variant: 'secondary',
                                                size: 'medium',
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
                                                    onConfirm();
                                                },
                                                size: 'medium',
                                                children: 'Delete'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.studentsDeleteConfirmation = studentsDeleteConfirmation;