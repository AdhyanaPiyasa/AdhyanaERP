// components/Administrator/other/scholarship/ScholarshipMain.js
const ScholarshipMain = () => {
    const [activeTab, setActiveTab] = MiniReact.useState('scholarships'); // 'scholarships' or 'applications'
    
    const renderContent = () => {
        switch (activeTab) {
            case 'scholarships':
                return {
                    type: AdminScholarshipList,
                    props: {}
                };
            case 'applications':
                return {
                    type: AdminApplicationsList,
                    props: {}
                };
            default:
                return {
                    type: AdminScholarshipList,
                    props: {}
                };
        }
    };
    
    return {
        type: 'div',
        props: {
            children: [
                // Tab Navigation
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            gap: theme.spacing.md,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    variant: activeTab === 'scholarships' ? 'primary' : 'secondary',
                                    onClick: () => setActiveTab('scholarships'),
                                    children: ['Manage Scholarships']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    variant: activeTab === 'applications' ? 'primary' : 'secondary',
                                    onClick: () => setActiveTab('applications'),
                                    children: ['Review Applications']
                                }
                            }
                        ]
                    }
                },
                
                // Content Area
                renderContent()
            ]
        }
    };
};

window.ScholarshipMain = ScholarshipMain;