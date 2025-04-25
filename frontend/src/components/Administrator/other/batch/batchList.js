// components/Administrator/batches/BatchList.js
const batchList = () => {
    const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
    
    const batches = [
        {
            id: "CS2023",
            year: "2023",
            name: "Computer Science"
        },
        {
            id: "IT2023",
            year: "2023",
            name: "Information Technology"
        },
        {
            id: "CS2022",
            year: "2022",
            name: "Computer Science"
        },
        {
            id: "IT2022",
            year: "2022",
            name: "Information Technology"
        }
    ];

    const styles = {
        container: {
            padding: theme.spacing.lg
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        batchGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: theme.spacing.lg,
        },
        icon: {
            marginRight: theme.spacing.xs,
            fontSize: '1.2rem'
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
                        style: styles.headerContainer,
                        children: [
                            {
                                type: 'h1',
                                props: { 
                                    children: ['All Batches']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowCreateModal(true),
                                    children: '+ Create Batch'
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.batchGrid,
                        children: batches.map(batch => ({
                            type: Card,
                            props: {
                                variant: 'outlined',
                                onClick: () => navigation.navigate(`other/batch/${batch.id}`),
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: styles.batchYear,
                                            children: [batch.year]
                                        }
                                    },
                                    {
                                        type: 'h3',
                                        props: {
                                            style: { display: 'flex', alignItems: 'center' },
                                            children: [
                                                {
                                                    type: 'span',
                                                    props: {
                                                        style: styles.icon,
                                                        children: ['🎓']
                                                    }
                                                },
                                                batch.name
                                            ]
                                        }
                                    }
                                ]
                            }
                        }))
                    }
                },
                showCreateModal && {
                    type: CreateBatch,
                    props: {
                        onClose: () => setShowCreateModal(false)
                    }
                }
            ]
        }
    };
};

window.batchList = batchList;