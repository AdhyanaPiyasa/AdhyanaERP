// components/common/LoadingSpinner.js
const LoadingSpinner = ({ size = 'medium', color = theme.colors.primary }) => {
    const styles = {
        spinner: {
            width: size === 'small' ? '20px' : 
                size === 'large' ? '40px' : '30px',
            height: size === 'small' ? '20px' : 
                size === 'large' ? '40px' : '30px',
            borderRadius: '50%',
            border: `3px solid ${theme.colors.background}`,
            borderTopColor: color,
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
        },
        '@keyframes spin': {
            to: {
                transform: 'rotate(360deg)'
            }
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.spinner
        }
    };
};
window.LoadingSpinner = LoadingSpinner;