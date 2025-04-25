// components/common/Modal.js
const Modal = ({ isOpen, onClose, title, children }) => {
    console.log("Modal rendering with isOpen:", isOpen, "and title:", title);
    
    // Track first render
    const [isInitialRender, setIsInitialRender] = MiniReact.useState(true);
    
    // Effect to handle mounting/unmounting
    MiniReact.useEffect(() => {
        // Mark that we've rendered
        setIsInitialRender(false);
        
        // Cleanup function for when modal unmounts
        return () => {
            console.log("Modal unmounting:", title);
        };
    }, []);

    // Safety check at the beginning
    if (isOpen === undefined) {
        console.warn(`Modal with title "${title || 'Untitled'}" has undefined isOpen prop. Defaulting to closed.`);
        return null;
    }

    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.xl,
            width: '80vw', 
            height: '80vh', 
            maxWidth: '1000px',
            overflow: 'auto',
            position: 'relative'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        title: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: theme.colors.textSecondary
        }
    };
    
    // Create a proper close handler
    const handleClose = (e) => {
        // Prevent event bubbling if from a button click
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Call the provided onClose function
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.overlay,
            onclick: (e) => {
                if (e.target === e.currentTarget) handleClose(e);
            },
            children: [{
                type: 'div',
                props: {
                    style: styles.modal,
                    children: [
                        {
                            type: 'div',
                            props: {
                                style: styles.header,
                                children: [
                                    {
                                        type: 'h2',
                                        props: {
                                            style: styles.title,
                                            children: [title]
                                        }
                                    },
                                    {
                                        type: 'button',
                                        props: {
                                            style: styles.closeButton,
                                            onclick: handleClose,
                                            children: ['×']
                                        }
                                    }
                                ]
                            }
                        },
                        ...children
                    ]
                }
            }]
        }
    };
};

window.Modal = Modal;