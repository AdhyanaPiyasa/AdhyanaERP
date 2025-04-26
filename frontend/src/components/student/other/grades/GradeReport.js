// components/other/grades/GradeReport.js
const GradeReport = () => {
    const semesters = [
        {
            id: 1,
            name: "Year 1 - Semester 1",
            gpa: 3.7,
            courses: [
                {
                    code: "CS1101",
                    name: "Programming Fundamentals",
                    credits: 3,
                    grade: "A",
                    gradePoints: 4.0
                },
                {
                    code: "CS1102",
                    name: "Computer Architecture",
                    credits: 3,
                    grade: "A-",
                    gradePoints: 3.7
                }
            ]
        },
        {
            id: 2,
            name: "Year 1 - Semester 2",
            gpa: 3.8,
            courses: [
                {
                    code: "CS1201",
                    name: "Object Oriented Programming",
                    credits: 3,
                    grade: "A",
                    gradePoints: 4.0
                },
                {
                    code: "CS1202",
                    name: "Database Systems",
                    credits: 3,
                    grade: "A",
                    gradePoints: 4.0
                }
            ]
        }
    ];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xl
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        title: {
            fontSize: theme.typography.h2.fontSize,
            fontWeight: 'bold'
        },
        semesterCard: {
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.sm,
            overflow: 'hidden'
        },
        semesterHeader: {
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.primary + '0a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        semesterTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold'
        },
        gpa: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md
        },
        gpaLabel: {
            color: theme.colors.textSecondary
        },
        gpaValue: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            color: theme.colors.primary
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            padding: theme.spacing.md,
            textAlign: 'left',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
            color: theme.colors.textSecondary
        },
        td: {
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`
        },
        courseCode: {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.caption.fontSize
        },
        courseName: {
            fontWeight: 'bold'
        },
        grade: {
            fontWeight: 'bold',
            color: theme.colors.primary
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                {
                    type: 'div',
                    props: {
                        style: styles.header,
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    style: styles.title,
                                    children: ['Grade Report']
                                }
                            }
                        ]
                    }
                },
                ...semesters.map(semester => ({
                    type: 'div',
                    props: {
                        style: styles.semesterCard,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: styles.semesterHeader,
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: styles.semesterTitle,
                                                children: [semester.name]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: styles.gpa,
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: styles.gpaLabel,
                                                            children: ['GPA:']
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: styles.gpaValue,
                                                            children: [semester.gpa.toFixed(2)]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'table',
                                props: {
                                    style: styles.table,
                                    children: [
                                        {
                                            type: 'thead',
                                            props: {
                                                children: [{
                                                    type: 'tr',
                                                    props: {
                                                        children: [
                                                            {
                                                                type: 'th',
                                                                props: {
                                                                    style: styles.th,
                                                                    children: ['Course']
                                                                }
                                                            },
                                                            {
                                                                type: 'th',
                                                                props: {
                                                                    style: styles.th,
                                                                    children: ['Credits']
                                                                }
                                                            },
                                                            {
                                                                type: 'th',
                                                                props: {
                                                                    style: styles.th,
                                                                    children: ['Grade']
                                                                }
                                                            },
                                                            {
                                                                type: 'th',
                                                                props: {
                                                                    style: styles.th,
                                                                    children: ['Grade Points']
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }]
                                            }
                                        },
                                        {
                                            type: 'tbody',
                                            props: {
                                                children: semester.courses.map(course => ({
                                                    type: 'tr',
                                                    props: {
                                                        children: [
                                                            {
                                                                type: 'td',
                                                                props: {
                                                                    style: styles.td,
                                                                    children: [
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: styles.courseName,
                                                                                children: [course.name]
                                                                            }
                                                                        },
                                                                        {
                                                                            type: 'div',
                                                                            props: {
                                                                                style: styles.courseCode,
                                                                                children: [course.code]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            {
                                                                type: 'td',
                                                                props: {
                                                                    style: styles.td,
                                                                    children: [course.credits]
                                                                }
                                                            },
                                                            {
                                                                type: 'td',
                                                                props: {
                                                                    style: {...styles.td, ...styles.grade},
                                                                    children: [course.grade]
                                                                }
                                                            },
                                                            {
                                                                type: 'td',
                                                                props: {
                                                                    style: styles.td,
                                                                    children: [course.gradePoints.toFixed(1)]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }))
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    };
};

window.GradeReport = GradeReport;