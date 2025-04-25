// components/Admin/layout/Layout.js
const AdministratorLayout = ({ children }) => {
    return {
        type: 'div',
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: AdministratorHeader,
                                props: {}
                            }
                        ]
                    }
                },
                {
                    type: 'main',
                    props: {
                        style: {
                            marginTop: '80px',
                            marginBottom: '80px', // To account for fixed header
                            padding: '24px',
                            boxSizing: 'border-box',
                            width: '100%',
                            maxWidth: '1200px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        
                        },
                        children: [
                            {
                                type: Card,
                                props: {
                                    children
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};
    

window.AdministratorLayout = AdministratorLayout;