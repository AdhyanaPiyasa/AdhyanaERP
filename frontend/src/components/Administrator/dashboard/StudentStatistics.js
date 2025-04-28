const StudentStatistics = () => {
    const getDegreeStatistics = () => {
        const programCounts = {
            "Computer Science Y2022": 20,
            "Information Systems Y2022": 30,
            "Computer Science Y2023": 35,
            "Information Systems Y2023": 15,
            "Computer Science Y2024": 35,
            "Information Systems Y2024": 25
        };

        return Object.entries(programCounts).map(([program, count]) => ({
            label: program,
            value: count
        }));
    };

    const chartData = getDegreeStatistics();

    return {
        type: 'div',
        props: {
            style: {
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                width: '100%',
                height: '100%', // Fill available height
                margin: '0'     // Remove auto margins
            },
            children: [
                {
                    type: 'h2',
                    props: {
                        style: {
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontSize: '22px',
                            color: '#333'
                        },
                        children: ['Student Distribution by Program']
                    }
                },
                {
                    type: BarChart,
                    props: {
                        data: chartData,
                        width: 500,
                        height: 400,
                        title: 'Program Enrollment'
                    }
                }
            ]
        }
    };
};

window.StudentStatistics = StudentStatistics;