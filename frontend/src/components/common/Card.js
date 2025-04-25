const Card = ({ children }) => ({
    type: 'div',
    props: {
        style: {
            padding: theme.spacing.lg,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            margin: theme.spacing.md
        },
        children
    }
});