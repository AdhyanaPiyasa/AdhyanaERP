// Improved Announcements component
const ImprovedAnnouncementList = () => {
    const [announcements] = MiniReact.useState([
        {
            title: 'Scholarship Applications',
            description: 'Scholarship applications are now open for the next year. Please check the student portal for more details.',
            timestamp: '2024-03-09T14:30:00',
            status: 'unread',
            source: 'Student Affairs'
        },
        {
            title: 'Examination Schedule',
            description: 'The examination schedule for the upcoming semester has been released. Please check your email for details.',
            timestamp: '2024-03-09T10:15:00',
            status: 'read',
            source: 'Examination Department'
        }
    ]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return {
        type: Card,
        props: {
            variant: 'elevated',
            children: announcements.map(announcement => ({
                type: Card,
                props: {
                    variant: 'outlined',
                    style: {
                        marginBottom: theme.spacing.sm,
                        borderLeft: announcement.status === 'unread' ? `4px solid ${theme.colors.primary}` : undefined,
                        backgroundColor: announcement.status === 'unread' ? `${theme.colors.primary}0a` : undefined
                    },
                    children: [
                        {
                            type: 'div',
                            props: {
                                style: {
                                    padding: theme.spacing.sm
                                },
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: theme.spacing.sm
                                            },
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            fontWeight: 'bold',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: theme.spacing.xs
                                                        },
                                                        children: [
                                                            announcement.title,
                                                            announcement.status === 'unread' && {
                                                                type: 'span',
                                                                props: {
                                                                    style: {
                                                                        display: 'inline-block',
                                                                        width: '8px',
                                                                        height: '8px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: theme.colors.primary
                                                                    }
                                                                }
                                                            }
                                                        ].filter(Boolean)
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: {
                                                            fontSize: theme.typography.caption.fontSize,
                                                            color: theme.colors.textSecondary
                                                        },
                                                        children: [formatDate(announcement.timestamp)]
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        type: 'p',
                                        props: {
                                            style: {
                                                margin: `${theme.spacing.sm} 0`,
                                                color: theme.colors.textPrimary
                                            },
                                            children: [announcement.description]
                                        }
                                    },
                                    {
                                        type: 'div',
                                        props: {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: theme.spacing.sm,
                                                fontSize: theme.typography.caption.fontSize,
                                                color: theme.colors.textSecondary
                                            },
                                            children: [
                                                {
                                                    type: 'span',
                                                    props: {
                                                        children: [`From: ${announcement.source}`]
                                                    }
                                                },
                                                {
                                                    type: Button,
                                                    props: {
                                                        variant: 'text',
                                                        size: 'small',
                                                        children: ['View Details']
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
            }))
        }
    };
};

// Make sure the original components are available in case they're referenced elsewhere

window.AnnouncementList = ImprovedAnnouncementList;
