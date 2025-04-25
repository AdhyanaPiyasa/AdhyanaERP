const OtherMain = () => {
    const options = [
        {
            id: 'exams',
            title: 'Exams',
            path: 'other/exams',
            icon: '✍️'
        },
        {
            id: 'calendar',
            title: 'Calendar',
            path: 'other/events',
            icon: '📅'
        },
        {   
            id: 'announcements',
            title: 'Announcement',
            path: 'other/announcements',
            icon: '📢'
        },
        {
            id: 'hostel',
            title: 'Hostel',
            path: 'other/hostel',
            icon: '🏠'
        },
        {
            id: 'scholarship',
            title: 'Scholarship',
            path: 'other/scholarship',
            icon: '🎓'
        }
        
    ];
    const iconStyle = {
        fontSize: '40px',
        marginRight: theme.spacing.md,
        display: 'inline-block',
        verticalAlign: 'middle'
    };

    const renderMenuItem = (option) => ({
        type: Card,
        props: {
            variant: 'outlined',
            onClick: () =>navigation.navigate(option.path),
            children: [
                {
                    type: 'h3',
                    props: {
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        },
                        children: [
                            {
                                type: 'span',
                                props: {
                                    style: iconStyle,
                                    children: [option.icon]
                                }
                            },
                            option.title
                        ]
                    }
                }    
            ]
        }
    });

    return {
        type: Card,
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Other Services']
                                }
                            }
                        ]
                    }
                },
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        children: options.map(renderMenuItem)
                    }
                }
            ]
        }
    };
};

window.OtherMain = OtherMain;