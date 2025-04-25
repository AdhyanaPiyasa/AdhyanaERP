// components/public/SuccessMessage.js
const SuccessMessage = ({ applicationId }) => {
    return {
        type: 'div',
        props: {
            style: {
                textAlign: 'center',
                padding: theme.spacing.xl,
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.md
            },
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            marginBottom: theme.spacing.xl
                        },
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    style: {
                                        color: theme.colors.success,
                                        fontSize: '28px',
                                        marginBottom: theme.spacing.md
                                    },
                                    children: ['Application Submitted Successfully']
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    style: {
                                        fontSize: '16px',
                                        color: theme.colors.textSecondary,
                                        lineHeight: '1.5'
                                    },
                                    children: ['Thank you for submitting your application to ADHYANA Learning Management System. Your application has been received and is being processed.']
                                }
                            }
                        ]
                    }
                },
                {
                    type: Card,
                    props: {
                        style: {
                            backgroundColor: theme.colors.background,
                            padding: theme.spacing.lg,
                            marginBottom: theme.spacing.xl
                        },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.md,
                                        fontSize: '18px'
                                    },
                                    children: ['Your Application ID:']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: theme.colors.primary,
                                        padding: theme.spacing.md,
                                        backgroundColor: 'white',
                                        border: `1px dashed ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        marginBottom: theme.spacing.md
                                    },
                                    children: [applicationId]
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    style: {
                                        fontWeight: 'bold',
                                        color: theme.colors.error
                                    },
                                    children: ['Please save this Application ID for future reference.']
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            marginBottom: theme.spacing.xl
                        },
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.md,
                                        fontSize: '18px'
                                    },
                                    children: ['Next Steps:']
                                }
                            },
                            {
                                type: 'ol',
                                props: {
                                    style: {
                                        textAlign: 'left',
                                        marginLeft: theme.spacing.xl,
                                        lineHeight: '1.6'
                                    },
                                    children: [
                                        {
                                            type: 'li',
                                            props: {
                                                children: ['You will receive a confirmation email shortly with your application details.']
                                            }
                                        },
                                        {
                                            type: 'li',
                                            props: {
                                                children: ['Your application will be reviewed by our admissions team.']
                                            }
                                        },
                                        {
                                            type: 'li',
                                            props: {
                                                children: ['You will be notified of your application status within 2-3 weeks.']
                                            }
                                        },
                                        {
                                            type: 'li',
                                            props: {
                                                children: ['If additional documents are required, we will contact you via email.']
                                            }
                                        }
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
                            marginTop: theme.spacing.xl,
                            borderTop: `1px solid ${theme.colors.border}`,
                            paddingTop: theme.spacing.lg,
                            color: theme.colors.textSecondary,
                            fontSize: '14px'
                        },
                        children: [
                            {
                                type: 'p',
                                props: {
                                    children: ['If you have any questions about your application, please contact our admissions office.']
                                }
                            },
                            {
                                type: 'p',
                                props: {
                                    children: ['Email: admissions@adhyana.edu | Phone: 0123-456-7890']
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.SuccessMessage = SuccessMessage;