const TextField = ({ value, onChange, label, type = 'text', placeholder }) => {
    const styles = {
        container: {
            marginBottom: theme.spacing.md
        },
        label: {
            display: 'block',
            marginBottom: theme.spacing.sm,
            fontWeight: 'bold'
        },
        input: {
            padding: theme.spacing.sm,
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%'
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                {
                    type: 'label',
                    props: {
                        style: styles.label,
                        children: [label]
                    }
                },
                {
                    type: 'input',
                    props: {
                        type: type,
                        style: styles.input,
                        value: value,
                        onchange: onChange,
                        placeholder: placeholder
                    }
                }
            ]
        }
    };
};

window.TextField = TextField;