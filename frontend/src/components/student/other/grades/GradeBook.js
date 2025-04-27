// components/student/grades/GradeBook.js
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
                // Header
                {
                    type: 'h1',
                    props: {
                        children: ['Grade Book']
                    }
                },
                
                // GPA and Credits Summary
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'flex',
                            marginBottom: '20px'
                        },
                        children: [
                            // GPA Card
                            {
                                type: Card,
                                props: {
                                    style: { marginRight: '20px', flex: 1 },
                                    children: [
                                        'Current GPA',
                                        {
                                            type: 'h2',
                                            props: {
                                                children: [grades.gpa.toFixed(2)]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Credits Card
                            {
                                type: Card,
                                props: {
                                    style: { flex: 1 },
                                    children: [
                                        'Total Credits',
                                        {
                                            type: 'h2',
                                            props: {
                                                children: [grades.totalCredits]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Grades Table
                {
                    type: 'div',
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
                                        'Course': grade.course,
                                        'Grade': grade.grade,
                                        'Credits': grade.credits,
                                        'Teacher\'s Feedback': grade.feedback
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