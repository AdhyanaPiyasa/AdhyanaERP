// components/common/Button.js
const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    fullWidth = false,
    type = 'button',
    icon = null,
    loading = false
}) => {
    const getVariantStyles = () => {
        const variants = {
            primary: {
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                ':hover': {
                    backgroundColor: theme.colors.primary + 'dd'
                }
            },
            secondary: {
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                ':hover': {
                    backgroundColor: theme.colors.primary + '11'
                }
            },
            error: {
                backgroundColor: theme.colors.error,
                color: 'white',
                border: 'none',
                ':hover': {
                    backgroundColor: theme.colors.error + 'dd'
                }
            },
            success: {
                backgroundColor: theme.colors.success,
                color: 'white',
                border: 'none',
                ':hover': {
                    backgroundColor: theme.colors.success + 'dd'
                }
            },
            text: {
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: 'none',
                ':hover': {
                    backgroundColor: theme.colors.primary + '11'
                }
            }
        };
        return variants[variant] || variants.primary;
    };

    const getSizeStyles = () => {
        const sizes = {
            small: {
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: '0.875rem',
                minHeight: '32px'
            },
            medium: {
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: '1rem',
                minHeight: '40px'
            },
            large: {
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: '1.125rem',
                minHeight: '48px'
            }
        };
        return sizes[size] || sizes.medium;
    };

    const baseStyles = {
        borderRadius: theme.borderRadius.sm,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        transition: 'all 0.2s ease',
        fontWeight: 500,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        textTransform: 'none',
        boxShadow: variant === 'primary' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
    };

    const loadingSpinner = {
        type: 'div',
        props: {
            style: {
                width: '16px',
                height: '16px',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginRight: theme.spacing.sm
            }
        }
    };

    return {
        type: 'button',
        props: {
            type,
            disabled: disabled || loading,
            onClick: disabled || loading ? undefined : onClick,
            style: {
                ...baseStyles,
                ...getVariantStyles(),
                ...getSizeStyles()
            },
            children: [
                loading && loadingSpinner,
                icon && {
                    type: 'span',
                    props: {
                        style: { marginRight: children ? theme.spacing.sm : 0 },
                        children: [icon]
                    }
                },
                ...(Array.isArray(children) ? children : [children])
            ].filter(Boolean)
        }
    };
};

window.Button = Button;