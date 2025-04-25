// components/Admin/students/StudentDegree.js
const StudentDegree = () => {
    const degrees = [
        {
            id: "CS2022",
            Degree: "Computer science",
            Batch: "Y2022",
        },
        {
            id: "IS2022",
            Degree: "Information Systems",
            Batch: "Y2022",
        },
        {
            id: "IS2023",
            Degree: "Information Systems",
            Batch: "Y2023",
        },
        {
            id: "CS2023",
            Degree: "Computer science",
            Batch: "Y2023",
        },
        {
            id: "IS2024",
            Degree: "Information Systems",
            Batch: "Y2024",
        },
        {
            id: "CS2024",
            Degree: "Computer science",
            Batch: "Y2024",
        }
    ];

    const styles = {
        container: {
            padding: theme.spacing.lg
        },
        cardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: theme.spacing.lg,
        },
        degreeInfo: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.sm
        },
        batchInfo: {
            color: theme.colors.textSecondary
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h1',
                                props: { 
                                    children: ['Student Degree Programs'],
                                    style: { marginBottom: theme.spacing.md }
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.cardGrid,
                                    children: degrees.map(degree => ({
                                        type: Card,
                                        props: {
                                            variant: 'outlined',
                                            onClick: () =>{
                                                if (navigation.getCurrentRoute() !==`students/${degree.id}`) {
                                                    navigation.navigate(`students/${degree.id}`);
                                                }
                                            },
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: styles.degreeInfo,
                                                        children: [degree.Degree]
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: styles.batchInfo,
                                                        children: [`Batch: ${degree.Batch}`]
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
    };
};

window.StudentDegree = StudentDegree;