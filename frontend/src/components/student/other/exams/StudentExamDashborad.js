// components/student/exams/StudentExamDashboard.js
const StudentExamDashboard = () => {
    const [activeTab, setActiveTab] = MiniReact.useState('exams');

    const styles = {
        container: {
            padding: theme.spacing.lg
        },
        tabContainer: {
            display: 'flex',
            borderBottom: `1px solid ${theme.colors.border}`,
            marginBottom: theme.spacing.lg
        },
        tab: {
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            position: 'relative'
        },
        activeTab: {
            color: theme.colors.primary,
            fontWeight: 'bold'
        },
        activeIndicator: {
            position: 'absolute',
            bottom: '-1px',
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: theme.colors.primary,
            borderRadius: '3px 3px 0 0'
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'exams':
                return { type: StudentExamList, props: {} };
            case 'assignments':
                return { type: StudentAssignmentList, props: {} };
            case 'grades':
                return { type: StudentGradesList, props: {} };
            case 'reports':
                return { type: StudentReportsList, props: {} };
            default:
                return { type: StudentExamList, props: {} };
        }
    };

    const renderTab = (tabId, label) => ({
        type: 'div',
        props: {
            style: {
                ...styles.tab,
                ...(activeTab === tabId ? styles.activeTab : {})
            },
            onClick: () => setActiveTab(tabId),
            children: [
                label,
                activeTab === tabId && {
                    type: 'div',
                    props: {
                        style: styles.activeIndicator
                    }
                }
            ].filter(Boolean)
        }
    });

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Academic Progress']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['View your exams, assignments, grades, and academic reports']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.tabContainer,
                        children: [
                            renderTab('exams', 'Exams'),
                            renderTab('assignments', 'Assignments'),
                            renderTab('grades', 'Grades'),
                            renderTab('reports', 'Reports')
                        ],
                     
                    }
                
                },

                renderTabContent()
            ]
        }
    };
};

window.StudentExamDashboard = StudentExamDashboard;