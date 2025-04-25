// components/courses/CourseDetail/CourseGrades.js
const CourseGrades = ({ courseId }) => {
    const [selectedGrade, setSelectedGrade] = MiniReact.useState(null);
    
    const grades = [
        {
            item: "Assignment 1",
            grade: "A",
            feedback: "Good work"
        },
        {
            item: "Quiz 1",
            grade: "A-",
            feedback: "Well done"
        }
    ];

    const handleGradeClick = (grade) => {
        setSelectedGrade(grade);
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: Table,
                    props: {
                        headers: ['Item', 'Grade', 'Feedback'],
                        data: grades,
                        onRowClick: handleGradeClick
                    }
                },
                selectedGrade && {
                    type: Modal,
                    props: {
                        isOpen: !!selectedGrade,
                        onClose: () => setSelectedGrade(null),
                        title: 'Grade Details',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'outlined',
                                    children: [
                                        `Item: ${selectedGrade.item}`,
                                        `Grade: ${selectedGrade.grade}`,
                                        `Feedback: ${selectedGrade.feedback}`
                                    ]
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.CourseGrades = CourseGrades;