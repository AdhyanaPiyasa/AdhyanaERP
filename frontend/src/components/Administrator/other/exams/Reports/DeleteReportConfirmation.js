// components/Administrator/other/exams/Reports/DeleteReportConfirmation.js
const DeleteReportConfirmation = ({ onClose, onConfirm }) => {
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Confirm Report Deletion',
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
                                    children: ['Are you sure you want to delete this report? This action cannot be undone.']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        backgroundColor: theme.colors.warning + '20',
                                        padding: theme.spacing.md,
                                        borderRadius: theme.borderRadius.md,
                                        marginBottom: theme.spacing.lg
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: theme.colors.warning
                                                },
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                marginRight: theme.spacing.sm,
                                                                fontSize: '1.2rem'
                                                            },
                                                            children: ['⚠️']
                                                        }
                                                    },
                                                    'Deleting this report will remove it from all dashboards and archives. Any references to this report will no longer work.'
                                                ]
                                            }
                                        }
                                    ]
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

window.DeleteReportConfirmation = DeleteReportConfirmation;