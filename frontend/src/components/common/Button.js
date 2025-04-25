const Button = ({ onClick, children, variant = 'primary', disabled = false }) => {
    const getButtonStyles = () => ({
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        backgroundColor: variant === 'primary' ? theme.colors.primary : theme.colors.secondary,
        color: 'white'
    });

    return {
        type: 'button',
        props: {
            style: getButtonStyles(),
            onclick: onClick,
            disabled: disabled,
            children: [children]
        }
    };
};

window.Button = Button;