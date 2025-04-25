// components/common/Card.js
const Card = ({ 
    children, 
    variant = 'default',
    noPadding = false,
    style = {},
    onClick,
    elevation = 1,
    hoverable = false
}) => {
    const getElevationStyle = (level) => {
        const elevations = {
            0: 'none',
            1: '0 2px 4px rgba(0,0,0,0.1)',
            2: '0 4px 8px rgba(0,0,0,0.1)',
            3: '0 8px 16px rgba(0,0,0,0.1)',
            4: '0 12px 24px rgba(0,0,0,0.1)'
        };
        return elevations[level] || elevations[1];
    };

    const getVariantStyles = () => {
        const variants = {
            default: {
                backgroundColor: 'white',
                boxShadow: getElevationStyle(elevation)
            },
            outlined: {
                backgroundColor: 'white',
                border: `1px solid ${theme.colors.border}`,
                boxShadow: 'none'
            },
            elevated: {
                backgroundColor: 'white',
                boxShadow: getElevationStyle(3)
            },
            ghost: {
                backgroundColor: 'transparent',
                boxShadow: 'none'
            }
        };
        return variants[variant] || variants.default;
    };

    const styles = {
        card: {
            padding: noPadding ? 0 : theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
            transition: 'all 0.2s ease',
            marginBottom: theme.spacing.md,
            cursor: onClick ? 'pointer' : 'auto',
            position: 'relative',
            overflow: 'hidden',
            ...getVariantStyles(),
            ...style
        }
    };

    if (hoverable) {
        styles.card.transform = 'translateY(0)';
        styles.card[':hover'] = {
            transform: 'translateY(-4px)',
            boxShadow: getElevationStyle(elevation + 1)
        };
    }

    const renderContent = () => {
        if (Array.isArray(children) && (children[0]?.type === 'h1' || children[0]?.type === 'h2')) {
            return [
                {
                    type: 'div',
                    props: {
                        style: {
                            padding: noPadding ? 0 : `${theme.spacing.md} ${theme.spacing.lg}`,
                            borderBottom: `1px solid ${theme.colors.border}`,
                            backgroundColor: theme.colors.background + '33'
                        },
                        children: [children[0]]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            padding: noPadding ? 0 : theme.spacing.lg
                        },
                        children: children.slice(1)
                    }
                }
            ];
        }
        return children;
    };

    return {
        type: 'div',
        props: {
            style: styles.card,
            onclick: onClick,
            children: renderContent()
        }
    };
};

window.Card = Card;