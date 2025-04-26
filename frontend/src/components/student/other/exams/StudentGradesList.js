// components/student/grades/StudentGradeList.js
const StudentGradeList = () => {
    const [grades, setGrades] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [searchTerm, setSearchTerm] = MiniReact.useState('');
    const [selectedSemester, setSelectedSemester] = MiniReact.useState('all');

    // Mock data for student grades
    const mockGrades = [
        {
            id: 1,
            courseCode: "CS1205",
            courseName: "Data Structures and Algorithms",
            semester: "Fall 2023",
            grade: "A",
            credits: 3,
            teacher: "Dr. John Doe"
        },
        {
            id: 2,
            courseCode: "CS1206",
            courseName: "Database Systems",
            semester: "Fall 2023",
            grade: "B+",
            credits: 3,
            teacher: "Prof. Jane Smith"
        },
        {
            id: 3,
            courseCode: "CS1207",
            courseName: "Web Development",
            semester: "Fall 2023",
            grade: "A-",
            credits: 3,
            teacher: "Dr. Bob Johnson"
        },
        {
            id: 4,
            courseCode: "CS2101",
            courseName: "Operating Systems",
            semester: "Spring 2024",
            grade: "B",
            credits: 4,
            teacher: "Dr. Sarah Williams"
        },
        {
            id: 5,
            courseCode: "CS2102",
            courseName: "Software Engineering",
            semester: "Spring 2024",
            grade: "A+",
            credits: 4,
            teacher: "Prof. Michael Brown"
        },
        {
            id: 6,
            courseCode: "CS2103",
            courseName: "Computer Networks",
            semester: "Spring 2024",
            grade: "B-",
            credits: 3,
            teacher: "Dr. Emily Davis"
        }
    ];

    // Available semesters for filtering
    const semesters = [
        { value: 'all', label: 'All Semesters' },
        { value: 'Fall 2023', label: 'Fall 2023' },
        { value: 'Spring 2024', label: 'Spring 2024' }
    ];

    // Simulate API call to fetch grades
    MiniReact.useEffect(() => {
        // In a real implementation, you would fetch data from your API
        // For example:
        const fetchGrades = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8081/api/students/grades', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setGrades(data.data);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch grades');
                console.error('Error fetching grades:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();

        // Using mock data for demonstration
        setTimeout(() => {
            setGrades(mockGrades);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter grades based on search term and selected semester
    const filteredGrades = grades.filter(grade => {
        const matchesSearch = 
            grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
            grade.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.teacher.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSemester = selectedSemester === 'all' || grade.semester === selectedSemester;
        
        return matchesSearch && matchesSemester;
    });

    // Calculate GPA for the filtered grades
    const calculateGPA = (gradesList) => {
        if (!gradesList || gradesList.length === 0) return 0;
        
        const gradePoints = {
            'A+': 4.0,
            'A': 4.0,
            'A-': 3.7,
            'B+': 3.3,
            'B': 3.0,
            'B-': 2.7,
            'C+': 2.3,
            'C': 2.0,
            'C-': 1.7,
            'D+': 1.3,
            'D': 1.0,
            'F': 0.0
        };
        
        let totalPoints = 0;
        let totalCredits = 0;
        
        gradesList.forEach(grade => {
            if (gradePoints[grade.grade] !== undefined) {
                totalPoints += gradePoints[grade.grade] * grade.credits;
                totalCredits += grade.credits;
            }
        });
        
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    };

    // Calculate statistics for grade distribution
    const calculateGradeDistribution = () => {
        const gradeCounts = {};
        
        filteredGrades.forEach(grade => {
            const letterGrade = grade.grade.charAt(0); // Get just the letter part (A, B, C, etc.)
            gradeCounts[letterGrade] = (gradeCounts[letterGrade] || 0) + 1;
        });
        
        return Object.keys(gradeCounts).map(letter => ({
            label: `${letter} Grades`,
            value: gradeCounts[letter]
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    return {
        type: 'div',
        props: {
            children: [
                // Header Card
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
                                                children: ['My Academic Record']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { color: theme.colors.textSecondary },
                                                children: ['View your academic performance and grades by semester']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // GPA Card and Grade Distribution
                {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: theme.spacing.lg,
                            marginTop: theme.spacing.lg,
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            // GPA Summary Card
                            {
                                type: Card,
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['GPA Summary']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                fontSize: '48px',
                                                                fontWeight: 'bold',
                                                                color: theme.colors.primary
                                                            },
                                                            children: [calculateGPA(filteredGrades)]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                marginTop: theme.spacing.md,
                                                                color: theme.colors.textSecondary
                                                            },
                                                            children: [
                                                                selectedSemester === 'all' 
                                                                    ? 'Cumulative GPA' 
                                                                    : `${selectedSemester} GPA`
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: {
                                                                marginTop: theme.spacing.lg,
                                                                fontWeight: 'bold'
                                                            },
                                                            children: [
                                                                `Total Credits: ${filteredGrades.reduce((sum, grade) => sum + grade.credits, 0)}`
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Grade Distribution Chart
                            {
                                type: Card,
                                props: {
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Grade Distribution']
                                            }
                                        },
                                        loading ? {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: theme.spacing.xl
                                                },
                                                children: [
                                                    {
                                                        type: LoadingSpinner,
                                                        props: {}
                                                    }
                                                ]
                                            }
                                        } : {
                                            type: BarChart,
                                            props: {
                                                data: calculateGradeDistribution(),
                                                height: 200
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Filter Section
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
                            // Semester Filter
                            {
                                type: Select,
                                props: {
                                    label: 'Semester',
                                    value: selectedSemester,
                                    onChange: (e) => setSelectedSemester(e.target.value),
                                    options: semesters,
                                    style: { width: '300px' }
                                }
                            },
                            
                            // Search Box
                            {
                                type: TextField,
                                props: {
                                    placeholder: 'Search by course name, code, or grade...',
                                    value: searchTerm,
                                    onChange: (e) => setSearchTerm(e.target.value),
                                    style: { width: '300px' }
                                }
                            }
                        ]
                    }
                },

                // Grades Table
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: ['Course Grades']
                                }
                            },
                            loading ? {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: theme.spacing.xl
                                    },
                                    children: [
                                        {
                                            type: LoadingSpinner,
                                            props: {}
                                        }
                                    ]
                                }
                            } : error ? {
                                type: 'div',
                                props: {
                                    style: {
                                        color: theme.colors.error,
                                        padding: theme.spacing.lg,
                                        textAlign: 'center'
                                    },
                                    children: [error]
                                }
                            } : filteredGrades.length === 0 ? {
                                type: 'div',
                                props: {
                                    style: {
                                        padding: theme.spacing.lg,
                                        textAlign: 'center',
                                        color: theme.colors.textSecondary
                                    },
                                    children: ['No grades found matching your criteria.']
                                }
                            } : {
                                type: Table,
                                props: {
                                    headers: ['Course Code', 'Course Name', 'Semester', 'Credits', 'Instructor', 'Grade'],
                                    data: filteredGrades.map(grade => ({
                                        'Course Code': grade.courseCode,
                                        'Course Name': grade.courseName,
                                        'Semester': grade.semester,
                                        'Credits': grade.credits,
                                        'Instructor': grade.teacher,
                                        'Grade': {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: grade.grade.startsWith('A') ? '#e6f7e6' : 
                                                                    grade.grade.startsWith('B') ? '#e6f0ff' : 
                                                                    grade.grade.startsWith('C') ? '#fff9e6' : 
                                                                    grade.grade.startsWith('D') ? '#ffe6e6' : '#f8f8f8',
                                                    color: grade.grade.startsWith('A') ? '#2e7d32' :
                                                            grade.grade.startsWith('B') ? '#1565c0' :
                                                            grade.grade.startsWith('C') ? '#f57c00' :
                                                            grade.grade.startsWith('D') ? '#c62828' : '#333333'
                                                },
                                                children: [grade.grade]
                                            }
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

window.StudentGradeList = StudentGradeList;