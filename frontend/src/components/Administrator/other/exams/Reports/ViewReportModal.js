// components/Administrator/other/exams/Reports/ViewReportModal.js
const ViewReportModal = ({ report, onClose }) => {
    const [isDownloading, setIsDownloading] = MiniReact.useState(false);
    const [isPrinting, setIsPrinting] = MiniReact.useState(false);
    const [isEditing, setIsEditing] = MiniReact.useState(false);
    const [isSaving, setIsSaving] = MiniReact.useState(false);
    const [formData, setFormData] = MiniReact.useState({
        title: report.title,
        courseName: report.courseName,
        examName: report.examName,
        type: report.type,
        summary: "",
        sections: []
    });
    const [error, setError] = MiniReact.useState(null);
    
    // Mock data for report content - in a real app, you would fetch this from an API
    const reportContent = {
        summary: "This report provides a comprehensive analysis of student performance in the specified course and examination. It includes statistical data, grade distribution, and comparative analysis with previous semesters.",
        sections: [
            {
                title: "Executive Summary",
                content: "Overall performance indicates a 72% pass rate with an average grade of B-. This represents a 5% improvement over the previous semester."
            },
            {
                title: "Grade Distribution",
                content: "A: 15%, B: 35%, C: 30%, D: 12%, F: 8%. The distribution shows a normal curve with a slight positive skew."
            },
            {
                title: "Performance by Topic",
                content: "Students performed best in database design (avg 85%) and worst in normalization concepts (avg 65%)."
            },
            {
                title: "Recommendations",
                content: "Increase focus on normalization concepts and provide additional practice exercises for struggling students."
            }
        ]
    };

    // Initialize form data with report content on component mount
    MiniReact.useEffect(() => {
        setFormData({
            ...formData,
            summary: reportContent.summary,
            sections: [...reportContent.sections]
        });
    }, []);

    // Function to simulate downloading the report
    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            console.log('Downloading report:', report.title);
            setIsDownloading(false);
        }, 1500);
    };

    // Function to simulate printing the report
    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            console.log('Printing report:', report.title);
            setIsPrinting(false);
        }, 1500);
    };

    // Function to handle publishing a draft report
    const handlePublish = () => {
        console.log('Publishing report:', report.title);
        onClose();
    };

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Function to handle changes in section content
    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...formData.sections];
        updatedSections[index] = {
            ...updatedSections[index],
            [field]: value
        };
        
        setFormData({
            ...formData,
            sections: updatedSections
        });
    };

    // Function to save report changes
    const handleSaveChanges = async () => {
        setIsSaving(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            const updatedReport = {
                ...report,
                title: formData.title,
                courseName: formData.courseName,
                examName: formData.examName,
                type: formData.type,
                content: {
                    summary: formData.summary,
                    sections: formData.sections
                }
            };
            
            const response = await fetch(`https://localhost:8081/api/api/exams/reports/${report.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedReport)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                setIsEditing(false);
                // Here you would update the report data with the response
                console.log('Report updated successfully:', data);
            } else {
                setError(data.message || 'Error updating report');
            }
        } catch (error) {
            console.error('Error updating report:', error);
            setError('Failed to update report. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: isEditing ? 'Edit Report' : report.title,
            children: [
                error && {
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.sm,
                            marginBottom: theme.spacing.md,
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            borderRadius: theme.borderRadius.sm
                        },
                        children: [error]
                    }
                },
                {
                    type: Card,
                    props: {
                        variant: 'default',
                        children: [
                            // Report header information
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.lg,
                                        padding: theme.spacing.md,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: theme.borderRadius.md,
                                        border: '1px solid #e9ecef'
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    // Left column
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                // Title (editable in edit mode)
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Title: ']
                                                                                }
                                                                            },
                                                                            isEditing ? {
                                                                                type: TextField,
                                                                                props: {
                                                                                    name: 'title',
                                                                                    value: formData.title,
                                                                                    onChange: handleChange,
                                                                                    fullWidth: true
                                                                                }
                                                                            } : formData.title
                                                                        ]
                                                                    }
                                                                },
                                                                // Course (editable in edit mode)
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Course: ']
                                                                                }
                                                                            },
                                                                            isEditing ? {
                                                                                type: TextField,
                                                                                props: {
                                                                                    name: 'courseName',
                                                                                    value: formData.courseName,
                                                                                    onChange: handleChange,
                                                                                    fullWidth: true
                                                                                }
                                                                            } : report.courseName
                                                                        ]
                                                                    }
                                                                },
                                                                // Exam (editable in edit mode)
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Exam: ']
                                                                                }
                                                                            },
                                                                            isEditing ? {
                                                                                type: TextField,
                                                                                props: {
                                                                                    name: 'examName',
                                                                                    value: formData.examName,
                                                                                    onChange: handleChange,
                                                                                    fullWidth: true
                                                                                }
                                                                            } : report.examName
                                                                        ]
                                                                    }
                                                                },
                                                                // Type (editable in edit mode)
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Type: ']
                                                                                }
                                                                            },
                                                                            isEditing ? {
                                                                                type: Select,
                                                                                props: {
                                                                                    name: 'type',
                                                                                    value: formData.type,
                                                                                    onChange: handleChange,
                                                                                    options: [
                                                                                        { value: 'midterm', label: 'Midterm' },
                                                                                        { value: 'final', label: 'Final' },
                                                                                        { value: 'semester', label: 'Semester' },
                                                                                        { value: 'performance', label: 'Performance' }
                                                                                    ]
                                                                                }
                                                                            } : {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { textTransform: 'capitalize' },
                                                                                    children: [report.type]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    // Right column
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Date: ']
                                                                                }
                                                                            },
                                                                            report.date
                                                                        ]
                                                                    }
                                                                },
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Creator: ']
                                                                                }
                                                                            },
                                                                            report.creator
                                                                        ]
                                                                    }
                                                                },
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: { marginBottom: theme.spacing.sm },
                                                                        children: [
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: { fontWeight: 'bold' },
                                                                                    children: ['Status: ']
                                                                                }
                                                                            },
                                                                            {
                                                                                type: 'span',
                                                                                props: {
                                                                                    style: {
                                                                                        display: 'inline-block',
                                                                                        padding: '2px 6px',
                                                                                        borderRadius: '4px',
                                                                                        backgroundColor: report.status === 'published' ? '#e6f7e6' : '#fff9e6',
                                                                                        color: report.status === 'published' ? '#2e7d32' : '#f59f00',
                                                                                        textTransform: 'capitalize'
                                                                                    },
                                                                                    children: [report.status]
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
                                        }
                                    ]
                                }
                            },
                            
                            // Report content
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.lg
                                    },
                                    children: [
                                        // Summary (editable in edit mode)
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    isEditing ? {
                                                        type: TextField,
                                                        props: {
                                                            name: 'summary',
                                                            label: 'Summary',
                                                            value: formData.summary,
                                                            onChange: handleChange,
                                                            multiline: true,
                                                            fullWidth: true,
                                                            rows: 3
                                                        }
                                                    } : {
                                                        type: 'p',
                                                        props: {
                                                            style: {
                                                                fontStyle: 'italic',
                                                                color: theme.colors.textSecondary
                                                            },
                                                            children: [formData.summary]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Sections (editable in edit mode)
                                        ...formData.sections.map((section, index) => ({
                                            type: 'div',
                                            props: {
                                                style: {
                                                    marginBottom: theme.spacing.md
                                                },
                                                children: [
                                                    isEditing ? [
                                                        {
                                                            type: TextField,
                                                            props: {
                                                                label: `Section ${index + 1} Title`,
                                                                value: section.title,
                                                                onChange: (e) => handleSectionChange(index, 'title', e.target.value),
                                                                fullWidth: true,
                                                                style: { marginBottom: theme.spacing.sm }
                                                            }
                                                        },
                                                        {
                                                            type: TextField,
                                                            props: {
                                                                label: `Section ${index + 1} Content`,
                                                                value: section.content,
                                                                onChange: (e) => handleSectionChange(index, 'content', e.target.value),
                                                                multiline: true,
                                                                fullWidth: true,
                                                                rows: 3
                                                            }
                                                        }
                                                    ] : [
                                                        {
                                                            type: 'h3',
                                                            props: {
                                                                style: {
                                                                    fontSize: '1.1rem',
                                                                    marginBottom: theme.spacing.sm,
                                                                    borderBottom: `1px solid ${theme.colors.border}`,
                                                                    paddingBottom: theme.spacing.xs
                                                                },
                                                                children: [section.title]
                                                            }
                                                        },
                                                        {
                                                            type: 'p',
                                                            props: {
                                                                children: [section.content]
                                                            }
                                                        }
                                                    ]
                                                ]
                                            }
                                        }))
                                    ]
                                }
                            },
                            
                            // Action buttons
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: theme.spacing.md,
                                        borderTop: `1px solid ${theme.colors.border}`,
                                        paddingTop: theme.spacing.md
                                    },
                                    children: [
                                        // Edit/Save buttons
                                        isEditing ? {
                                            type: Button,
                                            props: {
                                                variant: 'primary',
                                                onClick: handleSaveChanges,
                                                disabled: isSaving,
                                                children: isSaving ? 'Saving...' : 'Save Changes'
                                            }
                                        } : {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: toggleEditMode,
                                                children: 'Edit Report'
                                            }
                                        },
                                        
                                        // Cancel button (only in edit mode)
                                        isEditing && {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: toggleEditMode,
                                                children: 'Cancel'
                                            }
                                        },
                                        
                                        // Show other buttons only when not in edit mode
                                        !isEditing && [
                                            // Show Publish button only for draft reports
                                            report.status === 'draft' && {
                                                type: Button,
                                                props: {
                                                    variant: 'primary',
                                                    onClick: handlePublish,
                                                    children: 'Publish Report'
                                                }
                                            },
                                            {
                                                type: Button,
                                                props: {
                                                    variant: 'secondary',
                                                    onClick: handlePrint,
                                                    disabled: isPrinting,
                                                    children: isPrinting ? 'Printing...' : 'Print'
                                                }
                                            },
                                            {
                                                type: Button,
                                                props: {
                                                    variant: 'secondary',
                                                    onClick: handleDownload,
                                                    disabled: isDownloading,
                                                    children: isDownloading ? 'Downloading...' : 'Download PDF'
                                                }
                                            }
                                        ],
                                        
                                        // Close button
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: onClose,
                                                children: 'Close'
                                            }
                                        }
                                    ].filter(Boolean).flat()
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.ViewReportModal = ViewReportModal;