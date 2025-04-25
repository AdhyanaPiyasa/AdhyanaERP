// components/student/other/scholarship/ScholarshipList.js
const ScholarshipList = () => {
    // State for storing scholarships data
    const [scholarships, setScholarships] = MiniReact.useState([]);
    const [isLoading, setIsLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showDetailModal, setShowDetailModal] = MiniReact.useState(false);
    const [selectedScholarship, setSelectedScholarship] = MiniReact.useState(null);
    const [showApplyModal, setShowApplyModal] = MiniReact.useState(false);
    
    
    
    const fetchScholarships = async () => {
        setIsLoading(true);
        try {
            // In a real implementation, this would be an API call
            // const response = await fetch('/api/students/scholarships');
            // const data = await response.json();
            
            // For demo purposes, we'll use mock data
            setTimeout(() => {
                const mockData = [
                    {
                        id: 1,
                        name: "Academic Excellence Scholarship",
                        description: "For students with outstanding academic performance",
                        minGpa: 3.8,
                        amount: 5000,
                        applicationDeadline: "2025-06-30",
                        status: "Apply"
                    },
                    {
                        id: 2,
                        name: "Financial Need Scholarship",
                        description: "For students requiring financial assistance",
                        minGpa: 3.0,
                        amount: 3000,
                        applicationDeadline: "2025-07-15",
                        status: "Apply"
                    },
                    {
                        id: 3,
                        name: "Improve Leadership Scholarship",
                        description: "For students who have demonstrated leadership qualities",
                        minGpa: 3.5,
                        amount: 4000,
                        applicationDeadline: "2025-06-15",
                        status: "Apply"
                    }
                ];
                setScholarships(mockData);
                setIsLoading(false);
            }, 800);
        } catch (err) {
            setError("Failed to load scholarships");
            setIsLoading(false);
        }
    };

    // Fetch scholarships on component mount
    MiniReact.useEffect(() => {
        fetchScholarships();
    }, []);
    
    const handleViewDetails = (scholarship) => {
        setSelectedScholarship(scholarship);
        setShowDetailModal(true);
    };
    
    const handleApply = (scholarship) => {
        setSelectedScholarship(scholarship);
        setShowApplyModal(true);
    };
    
    // Render scholarship card
    const renderScholarshipCard = (scholarship) => ({
        type: Card,
        props: {
            onClick: () => handleViewDetails(scholarship),
            children: [
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: {
                                                    marginBottom: theme.spacing.xs
                                                },
                                                children: [scholarship.name]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    backgroundColor: "#e0ffff ",
                                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,

                                                },
                                                children: [`$${scholarship.amount}`]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderTop: `1px solid ${theme.colors.border}`,
                                        paddingTop: theme.spacing.sm,
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Deadline: ']
                                                        }
                                                    },
                                                    scholarship.applicationDeadline
                                                ]
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                size: 'small',
                                                onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleApply(scholarship);
                                                },
                                                children: ['Apply']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    });
    
    return {
        type: 'div',
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Available Scholarships']
                                }
                            },
                             {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                        gap: theme.spacing.lg
                                    },
                                    children: scholarships.map(renderScholarshipCard)
                                }
                            }
                        ]
                    }
                },
                
                // Scholarship Detail Modal
                showDetailModal && selectedScholarship && {
                    type: Modal,
                    props: {
                        isOpen: showDetailModal,
                        onClose: () => setShowDetailModal(false),
                        title: selectedScholarship.name,
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'outlined',
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: [
                                                    {
                                                        type: 'h3',
                                                        props: {
                                                            children: ['Description']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [selectedScholarship.description]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: [
                                                    {
                                                        type: 'h3',
                                                        props: {
                                                            children: ['Requirements']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [`Minimum GPA: ${selectedScholarship.minGpa}`]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: [
                                                    {
                                                        type: 'h3',
                                                        props: {
                                                            children: ['Award Amount']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [`$${selectedScholarship.amount}`]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { marginBottom: theme.spacing.lg },
                                                children: [
                                                    {
                                                        type: 'h3',
                                                        props: {
                                                            children: ['Application Deadline']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [selectedScholarship.applicationDeadline]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            variant: 'secondary',
                                                            onClick: () => setShowDetailModal(false),
                                                            children: ['Close']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => {
                                                                setShowDetailModal(false);
                                                                setShowApplyModal(true);
                                                            },
                                                            children: ['Apply Now']
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Scholarship Application Modal
                showApplyModal && selectedScholarship && {
                    type: Modal,
                    props: {
                        isOpen: showApplyModal,
                        onClose: () => setShowApplyModal(false),
                        title: `Apply for ${selectedScholarship.name}`,
                        children: [
                            {
                                type: ScholarshipApplicationForm,
                                props: {
                                    scholarship: selectedScholarship,
                                    onClose: () => setShowApplyModal(false)
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.ScholarshipList = ScholarshipList;