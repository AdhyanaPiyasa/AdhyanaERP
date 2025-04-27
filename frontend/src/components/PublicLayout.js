// src/components/layout/PublicLayout.js
const PublicLayout = ({ children }) => {
    const styles = {
        container: {
            padding: '24px',             
            maxWidth: '960px',           
            margin: '40px auto',         
            boxSizing: 'border-box',
            width: '100%'
        },
        cardWrapper: {
            backgroundColor: '#ffffff',
            borderRadius: theme.borderRadius.md || '8px', 
            boxShadow: theme.shadows ? theme.shadows.sm : '0 1px 3px rgba(0,0,0,0.1)', 
            padding: theme.spacing ? theme.spacing.lg : '24px' 
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
               {
                   
                   type: 'div', 
                   props: {
                       style: styles.cardWrapper,
                       children 
                   }
               }
            ]
        }
    };
};

window.PublicLayout = PublicLayout;