// components/parent/dashboard/ChildrenOverview.js
const ChildrenOverview = () => {
    const childrenData = [
        {
            name: 'Jane Doe',
            grade: '10th',
            attendance: '95%',
            GPA: '3.5'
        },
        {
            name: 'Jack Doe',
            grade: '8th',
            attendance: '92%',
            GPA: '3.7'
            
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'div',
                    props: {
                        className: 'flex justify-between items-center mb-4',
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    className: 'text-xl font-bold',
                                    children: ['Children Overview']
                                }
                            }
                        ]
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Name', 'Grade', 'Attendance','GPA'],
                        data: childrenData.map(child => ({
                            name: child.name,
                            grade: child.grade,
                            attendance: child.attendance,
                            GPA: child.GPA
                        })),
                        onRowClick: (row) => navigation.navigate(`/children/${row.name}`)
                    }
                }
            ]
        }
    };
};

window.ChildrenOverview = ChildrenOverview;