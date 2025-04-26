// components/Administrator/other/exams/Assignments/DeleteConfirmation.js
const DeleteConfirmation = ({ title, message, onClose, onConfirm }) => {

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: title || 'Confirm Deletion',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'p',
                                props: {
                                    style: {
                                        fontSize: '1rem',
                                        marginBottom: theme.spacing.lg,
                                        color: theme.colors.textPrimary
                                    },
                                    children: [message || 'Are you sure you want to delete this item? This action cannot be undone.']
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
                                                variant: 'error',
                                                onClick: onConfirm,
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

window.DeleteConfirmation = DeleteConfirmation;