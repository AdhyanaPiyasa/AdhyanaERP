// src/utils/theme.js
const theme = {
    colors: {
        primary: '#1976d2',
        secondary: '#dc004e',
        error: '#f44336',
        warning: '#ff9800',
        success: '#4caf50',
        background: '#f5f5f5',
        surface: '#ffffff',
        textPrimary: '#333333',
        textSecondary: '#666666',
        border: '#e0e0e0',
        hover: '#f5f5f5',
        divider: '#e0e0e0'
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px'
    },
    typography: {
        h1: {
            fontSize: '24px',
            fontWeight: '600',
            lineHeight: '1.2'
        },
        h2: {
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '1.3'
        },
        h3: {
            fontSize: '18px',
            fontWeight: '500',
            lineHeight: '1.4'
        },
        body1: {
            fontSize: '16px',
            lineHeight: '1.5'
        },
        body2: {
            fontSize: '14px',
            lineHeight: '1.5'
        },
        caption: {
            fontSize: '12px',
            lineHeight: '1.4'
        }
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
    },
    shadows: {
        sm: '0 1px 3px rgba(0,0,0,0.12)',
        md: '0 2px 4px rgba(0,0,0,0.1)',
        lg: '0 4px 6px rgba(0,0,0,0.1)',
        xl: '0 8px 12px rgba(0,0,0,0.1)'
    },
    transitions: {
        default: '0.3s ease',
        fast: '0.15s ease',
        slow: '0.45s ease'
    },
    zIndex: {
        modal: 1000,
        overlay: 900,
        dropdown: 800,
        header: 700
    }
};

window.theme = theme;