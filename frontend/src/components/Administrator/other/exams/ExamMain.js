// components/other/OtherPage.js
const ExamMain = () => {
    const options = [
        {
            id: 'RoomAssignments',
            title: 'Check room Assignments',
            path: 'other/exams/RoomAssignments',
            icon: '🏨' 
        },
        {
            id: 'CreateExam',
            title: 'Create Exams',
            path: 'other/exams/CreateExam',
            icon: '📄' 
        },
        
        {
            id: 'FinalTimetable',
            title: 'Generate Final Timetable',
            path: 'other/exams/FinalTimetable',
            icon: '✅' 
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
                                    children: ['Exams']
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

window.ExamMain = ExamMain;

