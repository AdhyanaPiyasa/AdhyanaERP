const Select = ({ value, onChange, options, label }) => {
    const styles = {
        container: {
            marginBottom: theme.spacing.md
        },
        label: {
            display: 'block',
            marginBottom: theme.spacing.sm,
            fontWeight: 'bold'
        },
        select: {
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
                    type: 'select',
                    props: {
                        style: styles.select,
                        value: value,
                        onchange: onChange,
                        children: options.map(option => ({
                            type: 'option',
                            props: {
                                value: option.value,
                                children: [option.label]
                            }
                        }))
                    }
                }
            ]
        }
    };
};

window.Select = Select;