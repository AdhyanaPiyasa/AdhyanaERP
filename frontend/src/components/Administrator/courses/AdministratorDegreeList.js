// components/Admin/courses/AdministratorDegreeList.js
const AdministratorDegreeList = () => {
    const degrees = [
        {
            id: "CS2022",
            Degree: "Computer science",
            Batch: "Y2022",
            Duration: 3
        },
        {
            id: "CS2022",
            Degree: "Computer science",
            Batch: "Y2022",
            Duration: 3
        },{
            id: "CS2022",
            Degree: "Computer science",
            Batch: "Y2022",
            Duration: 3
        },{
            id: "CS2022",
            Degree: "Computer science",
            Batch: "Y2022",
            Duration: 3
        },
        {
            id: "IS2022",
            Degree: "Information Systems",
            Batch: "Y2022",
            Duration: 3
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
                                    children: ['Degree Programs'],
                                    
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
                                            onClick: () =>navigation.navigate(`courses/${degree.id}`),
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
                                                        style: styles.metaInfo,
                                                        children: [`Batch: ${degree.Batch}`]
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: styles.metaInfo,
                                                        children: [`Duration: ${degree.Duration} years`]
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

window.AdministratorDegreeList = AdministratorDegreeList;