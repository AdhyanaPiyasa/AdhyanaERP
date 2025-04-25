// components/Admin/exams/DeleteConfirmation.js
const examsDeleteConfirmation = ({ onClose, onConfirm }) => {
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Confirm the deletion of exam',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'p',
                                props: {
                                    children: ['Record of the exam will be permanently remove !!!']
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
                                                variant: 'secondary',
                                                onClick: onClose,
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

window.examsDeleteConfirmation = examsDeleteConfirmation;