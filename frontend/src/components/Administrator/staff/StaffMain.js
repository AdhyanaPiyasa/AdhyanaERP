// components/other/OtherPage.js
const StaffMain = () => {
    const options = [
        {
            id: 'Attendance',
            title: 'Attendance',
            path: 'staff/Attendance',
            icon: '📋'
        },
        {
            id: 'Payroll',
            title: 'Payroll',
            path: 'staff/Payroll',
            icon: '💰'
        },
        
        {
            id: 'StaffList',
            title: 'Staff Details',
            path: 'staff/StaffList',
            icon: '👥'
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
            onClick: () => navigation.navigate(option.path),
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
                                    children: ['Staff']
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

window.StaffMain = StaffMain;

