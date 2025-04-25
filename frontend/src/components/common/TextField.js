// components/common/TextField.js
const TextField = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    error, 
    placeholder,
    disabled = false,
    multiline = false,
    name
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
        input: {
            width: '100%',
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            border: `1px solid ${error ? 
                theme.colors.error : 
                theme.colors.border}`,
            backgroundColor: disabled ? 
                theme.colors.background : 
                'white'
        },
        error: {
            color: theme.colors.error,
            fontSize: theme.typography.caption.fontSize,
            marginTop: theme.spacing.xs
        }
    };

    const handleChange = (e) => {
        // Immediately extract values from the event
        const newValue = e.target.value;
        
        // Call onChange with a synthetic event that won't be reused/pooled
        if (onChange) {
            onChange({ 
                target: { 
                    value: newValue, 
                    name: name // Pass name explicitly
                } 
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
                    type: multiline ? 'textarea' : 'input',
                    props: {
                        type: type,
                        style: styles.input,
                        value: value || '',
                        name: name,  // Add default value
                        onchange: handleChange,  // Note: lowercase 'onchange'
                        placeholder: placeholder,
                        disabled: disabled
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

window.TextField = TextField;