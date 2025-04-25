// components/Administrator/batches/BatchDetails.js
const batchDetails = ({ batchId }) => {
    const route = navigation.getCurrentRoute();
    
    // If batchId is not passed directly as a prop, extract it from the route
    if (!batchId) {
        batchId = route.split('/')[2]; // Extract the batch ID from the route pattern other/batch/ID
    }
    
    // Mock data for batch details
    const batchData = {
        'CS2023': {
            id: 'CS2023',
            year: '2023',
            name: 'Computer Science',
            courses: [
                { code: 'CS101', name: 'Introduction to Computer Science', credits: 3, semester: 1 },
                { code: 'CS102', name: 'Programming Fundamentals', credits: 3, semester: 1 },
                { code: 'CS201', name: 'Data Structures', credits: 4, semester: 2 },
                { code: 'CS202', name: 'Algorithms', credits: 4, semester: 2 }
            ]
        },
        'IT2023': {
            id: 'IT2023',
            year: '2023',
            name: 'Information Technology',
            courses: [
                { code: 'IT101', name: 'IT Fundamentals', credits: 3, semester: 1 },
                { code: 'IT102', name: 'Introduction to Networking', credits: 3, semester: 1 },
                { code: 'IT201', name: 'Database Management', credits: 4, semester: 2 },
                { code: 'IT202', name: 'Web Technologies', credits: 4, semester: 2 }
            ]
        },
        'CS2022': {
            id: 'CS2022',
            year: '2022',
            name: 'Computer Science',
            courses: [
                { code: 'CS101', name: 'Introduction to Computer Science', credits: 3, semester: 1 },
                { code: 'CS102', name: 'Programming Fundamentals', credits: 3, semester: 1 },
                { code: 'CS201', name: 'Data Structures', credits: 4, semester: 2 },
                { code: 'CS202', name: 'Algorithms', credits: 4, semester: 2 },
                { code: 'CS301', name: 'Database Systems', credits: 3, semester: 3 },
                { code: 'CS302', name: 'Web Development', credits: 3, semester: 3 }
            ]
        },
        'IT2022': {
            id: 'IT2022',
            year: '2022',
            name: 'Information Technology',
            courses: [
                { code: 'IT101', name: 'IT Fundamentals', credits: 3, semester: 1 },
                { code: 'IT102', name: 'Introduction to Networking', credits: 3, semester: 1 },
                { code: 'IT201', name: 'Database Management', credits: 4, semester: 2 },
                { code: 'IT202', name: 'Web Technologies', credits: 4, semester: 2 },
                { code: 'IT301', name: 'System Administration', credits: 3, semester: 3 },
                { code: 'IT302', name: 'Cybersecurity Fundamentals', credits: 3, semester: 3 }
            ]
        }
    };

    // Get current batch data
    const batch = batchData[batchId] || { 
        id: 'Unknown',
        year: 'Unknown', 
        name: 'Unknown Program', 
        courses: [] 
    };

    return {
        type: 'div',
        props: {
            style: { 
                padding: theme.spacing.lg,
                maxWidth: '1200px',
                margin: '0 auto'
            },
            children: [
                // Back button and Header Section
                {
                    type: 'div',
                    props: {
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
                                                            style: {
                                                                marginBottom: theme.spacing.sm,
                                                            },
                                                            children: [batch.name]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [`Batch: ${batch.year}`]
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

                // Courses List Section
                {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.lg },
                        children: [
                            // Header with Add Button
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Courses in this Batch']
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Courses Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Course Code', 'Course Name'],
                                    data: batch.courses.map(course => ({
                                        'Course Code': {
                                            type: 'span',
                                            props: {
                                                style: { fontWeight: 'bold' },
                                                children: [course.code]
                                            }
                                        },
                                        'Course Name': course.name,
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

window.batchDetails = batchDetails;