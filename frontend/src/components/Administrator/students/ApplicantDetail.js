// components/Administrator/students/ApplicantDetail.js
const ApplicantDetail = ({ application,onClose }) => {

    const renderInfoSection = (title, items) => ({
        type: Card,
        props: {
            variant: 'outlined',
            children: [
                {
                    type: 'h3',
                    props: {
                        style: { 
                            borderBottom: `1px solid ${theme.colors.border}`,
                            marginBottom: theme.spacing.md
                        },
                        children: [title]
                    }
                },
                ...items.map(([label, value]) => ({
                    type: 'div',
                    props: {
                        style: { 
                            display: 'flex', 
                            marginBottom: theme.spacing.sm 
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        width: '30%', 
                                        fontWeight: 'bold',
                                        color: theme.colors.textSecondary
                                    },
                                    children: [label]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [value]
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    });

    return {
        type: Card,
        props: {
            style: { padding: theme.spacing.lg },
            children: [
                // Header with back button and status
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    onClick: onClose,
                                    children: ['← Back to Applicants']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                        backgroundColor: theme.colors.success + '20',
                                        color: theme.colors.success,
                                        fontWeight: 'bold'
                                    },
                                    children: [application.status]
                                }
                            }
                        ]
                    }
                },
                
                // Personal information section
                renderInfoSection('Personal Information', [
                    ['Applicant ID', application.id],
                    ['Name', application.name],
                    ['National ID', application.nationalId],
                    ['Email', application.email],
                    ['Phone', application.phone],
                    ['Gender', application.gender],
                    ['Date of Birth', application.dateOfBirth],
                    ['Address', application.address]
                ]),
                
                // Academic information section
                renderInfoSection('Applied Degree Program ', [
                    ['Applied Program', application.appliedProgram],
                    ['Application Date', application.applicationDate]
                ]),

                // Academic Records
                renderInfoSection('Academic Records', [
                    ['Mathematics', application.mathematics],
                    ['Science', application.science],
                    ['English', application.english],
                    ['Computer Studies', application.computerStudies],
                ]),
                

                // parent section
                renderInfoSection('Guardian Information', [
                    ['Name', application.guardianName],
                    ['National ID', application.guardianNationalId],
                    ['Relation', application.guardianRelation],
                    ['Contact Number', application.guardianContactNumber],
                    ['Email', application.guardianEmail],
                ]),

                renderInfoSection('Hostel Required', [
                    ['Do you hope to apply for hostels?', application.hostelRequired],
                ]),
                
            ]
        }
    };
};

window.ApplicantDetail = ApplicantDetail;