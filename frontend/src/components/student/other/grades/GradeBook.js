const GradeBook = () => {
    const [grades] = MiniReact.useState({
        currentGrades: [
            {
                course: "Course 01",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 3
            },
            {
                course: "Course 02",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 2
            },
            {
                course: "Course 03",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 3
            },
            {
                course: "Course 04",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 1
            },
            {
                course: "Course 05",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 2
            },
            {
                course: "Course 06",
                grade: "A",
                feedback: "Good. Keep it well",
                credits: 1
            }
        ],
        gpa: 3.5,
        totalCredits: 12
    });

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h1',
                    props: {
                        children: ['Grade Book']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: theme.spacing.lg
                        },
                        children: [
                            {
                                type: Card,
                                props: {
                                    children: [
                                        'Current GPA',
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { color: theme.colors.primary },
                                                children: [grades.gpa.toFixed(2)]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: Card,
                                props: {
                                    children: [
                                        'Total Credits',
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { color: theme.colors.primary },
                                                children: [grades.totalCredits]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Current Grades']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Course', 'Grade', 'Credits', 'Teacher\'s Feedback'],
                                    data: grades.currentGrades.map(grade => ({
                                        Course: grade.course,
                                        Grade: {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.primary },
                                                children: [grade.grade]
                                            }
                                        },
                                        Credits: grade.credits,
                                        "Teacher's Feedback": grade.feedback
                                    }))
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.GradeBook = GradeBook;