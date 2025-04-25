// components/common/TextField.js
const Select = ({ 
    label, 
    name,
    value, 
    onChange, 
    options, 
    error, 
    disabled = false 
}) => {
    const styles = {
        container: {
            marginBottom: theme.spacing.md
        },
        label: {
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: error ? 
                theme.colors.error : 
                theme.colors.textPrimary,
            fontWeight: 'bold'
        },
        select: {
            width: '100%',
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            border: `1px solid ${error ? 
                theme.colors.error : 
                theme.colors.border}`,
            backgroundColor: disabled ? 
                theme.colors.background : 
                'white',
            cursor: disabled ? 'not-allowed' : 'pointer'
        },
        error: {
            color: theme.colors.error,
            fontSize: theme.typography.caption.fontSize,
            marginTop: theme.spacing.xs
        }
    };

    const handleChange = (e) => {
        // Stop the original event from propagating further
        e.stopPropagation();
        
        // Create and pass a clean synthetic event
        if (onChange) {
            onChange({ 
                target: { 
                    name: name, 
                    value: e.target.value 
                },
                // Prevent any default behaviors
                preventDefault: () => {},
                stopPropagation: () => {}
            });
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                label && {
                    type: 'label',
                    props: {
                        style: styles.label,
                        children: [label]
                    }
                },
                {
                    type: 'select',
                    props: {
                        style: styles.select,
                        name: name,
                        value: value || '',
                        onchange:handleChange,
                        disabled: disabled,
                        children: options.map(option => ({
                            type: 'option',
                            props: {
                                value: option.value,
                                selected: option.value === value,
                                children: [option.label]
                            }
                        }))
                    }
                },
                error && {
                    type: 'div',
                    props: {
                        style: styles.error,
                        children: [error]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.Select = Select