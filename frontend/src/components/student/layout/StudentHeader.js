// components/student/layout/StudentHeader.js
const StudentHeader = () => {
    const [showProfileMenu, setShowProfileMenu] = MiniReact.useState(false);
    const currentRoute = navigation.getCurrentRoute();

    const styles = {
        header: {
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            backgroundColor: '#a6e7ff ',
            height: '80px',
            borderBottom: `1px solid ${theme.colors.border}`,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        },
        brandSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        logo: {
            width: '60px',
            height: '60px'
        },
        brandName: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#0066CC'
        },
        mainSection: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            marginLeft: '48px'
        },
        nav: {
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginRight: '32px'
        },
        navItem: {
            padding: '8px',
            color: '#333',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        activeNavItem: {
            color: '#0066CC',
            fontWeight: '500'
        },
        activeIndicator: {
            position: 'absolute',
            bottom: '-1px',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#0066CC',
            borderRadius: '2px 2px 0 0'
        },
        icon: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '25px',
            width: '25px',
            height: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '200px',
            zIndex: 1000
        },
        dropdownItem: {
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333',
            transition: 'background-color 0.2s',
            display: 'block',
            width: '100%',
            textAlign: 'left',
            border: 'none',
            backgroundColor: 'transparent'
        },
        dropdownItemHover: {
            backgroundColor: '#f5f5f5'
        },
        logoutButton: {
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#dc2626',
            transition: 'background-color 0.2s',
            display: 'block',
            width: '100%',
            textAlign: 'left',
            border: 'none',
            backgroundColor: 'transparent',
            borderTop: '1px solid #eee'
        },
        profileButton: {
            backgroundColor: '#0066CC',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
    };

    // Navigation items with simple text-based icons
    const navItems = [
        { label: 'Dashboard', path: 'dashboard', icon: '⌂' }, 
        { label: 'Courses', path: 'courses', icon: '📚' },    
        { label: 'Events', path: 'events', icon: '📅' },      
        { label: 'Announcements', path: 'announcements', icon: '📢' },
        { label: 'Other', path: 'other', icon: '⋯' },
    ];

       // Handle click outside to close dropdown
       MiniReact.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfileMenu && !event.target.closest('.profile-menu')) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileMenu]);

    const handleProfileClick = (e) => {
        e.preventDefault();
        setShowProfileMenu(!showProfileMenu);
    };

    return {
        type: 'header',
        props: {
            style: styles.header,
            children: [
                {
                    type: 'div',
                    props: {
                        style: styles.brandSection,
                        children: [
                            {
                                type: 'img',
                                props: {
                                    src: 'src/assets/logo.png',
                                    alt: 'ADHYANA Logo',
                                    style: styles.logo
                                }
                            },
                            {
                                type: 'span',
                                props: {
                                    style: styles.brandName,
                                    children: ['ADHYANA']
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.mainSection,
                        children: [
                            {
                                type: 'nav',
                                props: {
                                    style: styles.nav,
                                    children: navItems.map(item => ({
                                        type: 'a',
                                        props: {
                                            style: {
                                                ...styles.navItem,
                                                ...(currentRoute === item.path ? styles.activeNavItem : {})
                                            },
                                            href: '#',
                                            onclick: (e) => {
                                                e.preventDefault();
                                                navigation.navigate(item.path);
                                            },
                                            children: [
                                                {
                                                    type: 'span',
                                                    props: {
                                                        style: styles.icon,
                                                        children: [item.icon]
                                                    }
                                                },
                                                item.label,
                                                currentRoute === item.path && {
                                                    type: 'div',
                                                    props: {
                                                        style: styles.activeIndicator
                                                    }
                                                }
                                            ].filter(Boolean)
                                        }
                                    }))
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    className: 'profile-menu',
                                    style: styles.profileSection,
                                    children: [
                                        {
                                            type: 'button',
                                            props: {
                                                style: styles.profileButton,
                                                onClick: handleProfileClick,
                                                children: [
                                                    'Profile',
                                                ]
                                            }
                                        },
                                        showProfileMenu && {
                                            type: 'div',
                                            props: {
                                                style: styles.dropdown,
                                                children: [
                                                    {
                                                        type: 'button',
                                                        props: {
                                                            style: styles.dropdownItem,
                                                            onClick: () => {
                                                                navigation.navigate('profile');
                                                                setShowProfileMenu(false);
                                                            },
                                                            children: ['View Profile']
                                                        }
                                                    },
                                                    {
                                                        type: 'button',
                                                        props: {
                                                            style: styles.logoutButton,
                                                            onClick: () => {
                                                                authService.logout();
                                                                setShowProfileMenu(false);
                                                            },
                                                            children: ['Logout']
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.StudentHeader = StudentHeader;