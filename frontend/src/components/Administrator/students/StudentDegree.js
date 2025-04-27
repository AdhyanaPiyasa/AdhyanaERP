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


// // components/Admin/students/StudentDegree.js
// const StudentDegree = () => {
//     // State for storing degrees data
//     const [degrees, setDegrees] = MiniReact.useState([]);
//     const [loading, setLoading] = MiniReact.useState(true);
//     const [error, setError] = MiniReact.useState(null);

//     const fetchDegrees = async () => {
//         setLoading(true);
//         try {
//             // Get the stored auth token
//             const token = localStorage.getItem('token');
            
//             const response = await fetch(`http://localhost:8081/api/admin/degrees/`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
    
//             console.log("Response status:", response.status);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
            
//             const data = await response.json();
//             console.log("Received data:", data);
            
//             if (data.success) {
//                 // Ensure data.data exists and is an array
//                 if (!data.data || !Array.isArray(data.data)) {
//                     throw new Error("Invalid response format: expected an array of degrees");
//                 }
                
//                 setDegrees(data.data);
//             } else {
//                 setError(data.message || "Failed to fetch degrees");
//             }
//         } catch (error) {
//             setError(error.message);
//             console.error("Error fetching degrees:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch degrees on component mount
//     MiniReact.useEffect(() => {
//         fetchDegrees();
//     }, []);

//     // Fallback data in case API fails or for development
//     const fallbackDegrees = [
//         {
//             id: "CS2022",
//             Degree: "Computer science",
//             Batch: "Y2022",
//         },
//         {
//             id: "IS2022",
//             Degree: "Information Systems",
//             Batch: "Y2022",
//         },
//         {
//             id: "IS2023",
//             Degree: "Information Systems",
//             Batch: "Y2023",
//         },
//         {
//             id: "CS2023",
//             Degree: "Computer science",
//             Batch: "Y2023",
//         },
//         {
//             id: "IS2024",
//             Degree: "Information Systems",
//             Batch: "Y2024",
//         },
//         {
//             id: "CS2024",
//             Degree: "Computer science",
//             Batch: "Y2024",
//         }
//     ];

//     // Use fetched data if available, otherwise fallback to hardcoded data
//     const degreesToDisplay = degrees.length > 0 ? degrees : fallbackDegrees;

//     const styles = {
//         container: {
//             padding: theme.spacing.lg
//         },
//         cardGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: theme.spacing.lg,
//         },
//         degreeInfo: {
//             fontSize: theme.typography.h3.fontSize,
//             fontWeight: 'bold',
//             marginBottom: theme.spacing.sm
//         },
//         batchInfo: {
//             color: theme.colors.textSecondary
//         },
//         errorMessage: {
//             color: 'red',
//             padding: theme.spacing.md,
//             marginBottom: theme.spacing.md
//         },
//         loadingContainer: {
//             padding: theme.spacing.lg,
//             textAlign: 'center'
//         }
//     };

//     return {
//         type: 'div',
//         props: {
//             style: styles.container,
//             children: [
//                 {
//                     type: Card,
//                     props: {
//                         children: [
//                             {
//                                 type: 'h1',
//                                 props: { 
//                                     children: ['Student Degree Programs'],
//                                     style: { marginBottom: theme.spacing.md }
//                                 }
//                             },
//                             // Show loading indicator
//                             loading && {
//                                 type: 'div',
//                                 props: {
//                                     style: styles.loadingContainer,
//                                     children: ['Loading degree programs...']
//                                 }
//                             },
//                             // Show error message if there is one
//                             error && {
//                                 type: 'div',
//                                 props: {
//                                     style: styles.errorMessage,
//                                     children: [`Error: ${error}`]
//                                 }
//                             },
//                             // Display degrees once loaded
//                             !loading && !error && {
//                                 type: 'div',
//                                 props: {
//                                     style: styles.cardGrid,
//                                     children: degreesToDisplay.map(degree => ({
//                                         type: Card,
//                                         props: {
//                                             variant: 'outlined',
//                                             onClick: () =>{
//                                                 if (navigation.getCurrentRoute() !==`students/${degree.id}`) {
//                                                     navigation.navigate(`students/${degree.id}`);
//                                                 }
//                                             },
//                                             children: [
//                                                 {
//                                                     type: 'div',
//                                                     props: {
//                                                         style: styles.degreeInfo,
//                                                         children: [degree.Degree]
//                                                     }
//                                                 },
//                                                 {
//                                                     type: 'div',
//                                                     props: {
//                                                         style: styles.batchInfo,
//                                                         children: [`Batch: ${degree.Batch}`]
//                                                     }
//                                                 }
//                                             ]
//                                         }
//                                     }))
//                                 }
//                             }
//                         ].filter(Boolean)
//                     }
//                 }
//             ]
//         }
//     };
// };

// window.StudentDegree = StudentDegree;