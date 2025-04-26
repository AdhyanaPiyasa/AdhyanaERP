// components/other/OtherPage.js
const OtherPage = () => {
    const options = [
        {
            id: 'exams',
            title: 'Exams',
            path: 'other/exams/',
            icon: '🎓' // Graduation cap for scholarship
        },
        {
            id: 'scholarship',
            title: 'Scholarship',
            path: 'other/scholarship',
            icon: '🎓' // Graduation cap for scholarship
        },
        {
            id: 'attendance',
            title: 'Attendance',
            path: 'other/attendance',
            icon: '📋' // Clipboard for attendance
        },
        {
            id: 'grades',
            title: 'Grade Book',
            path: 'other/grades',
            icon: '📊' // Chart for grades
        },
        {
            id: 'hostel',
            title: 'Hostel Information',
            path: 'other/hostel',
            icon: '🏠' // House for hostel
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

window.OtherPage = OtherPage;