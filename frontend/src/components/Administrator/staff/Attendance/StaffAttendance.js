// components/Administrator/staff/Attendance.js
const StaffAttendance = () => {
    const [selectedMonth, setSelectedMonth] = MiniReact.useState('');
    const [workingDays, setWorkingDays] = MiniReact.useState('');
    const [staffAttendance, setStaffAttendance] = MiniReact.useState([
        { id: '1001', name: 'Alice Smith', attendance: '20' },
        { id: '1001', name: 'Alice Smith', attendance: '15' },
        { id: '1001', name: 'Alice Smith', attendance: '10' },
        { id: '1001', name: 'Alice Smith', attendance: '05' },
        { id: '1001', name: 'Alice Smith', attendance: '18' },
        { id: '1001', name: 'Alice Smith', attendance: '16' }
    ]);

    const handleAttendanceChange = (index, value) => {
        const updatedAttendance = [...staffAttendance];
        updatedAttendance[index] = {
            ...updatedAttendance[index],
            attendance: value
        };
        setStaffAttendance(updatedAttendance);
    };

    const handleSubmit = () => {
        // Handle form submission
        console.log('Submitting attendance for', selectedMonth);
        console.log('Working days:', workingDays);
        console.log('Staff attendance:', staffAttendance);
        
    };

    const months = [
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' }
    ];

    // Prepare data for Table component
    const tableData = staffAttendance.map((staff, index) => ({
        'Staff No': staff.id,
        'Name': staff.name,
        'Attendance in the month': {
            type: TextField,
            props: {
                value: staff.attendance,
                onChange: (e) => handleAttendanceChange(index, e.target.value),
                style: { width: '50px', textAlign: 'center' }
            }
        }
    }));

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h1',
                    props: {
                        style: { margin: theme.spacing.md },
                        children: ['Staff Attendance']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            gap: theme.spacing.xl,
                            margin: theme.spacing.md,
                            alignItems: 'flex-end'
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { width: '200px' },
                                    children: [
                                        {
                                            type: 'label',
                                            props: {
                                                style: { 
                                                    display: 'block', 
                                                    marginBottom: theme.spacing.xs,
                                                    fontWeight: 'bold'
                                                },
                                                children: ['Month']
                                            }
                                        },
                                        {
                                            type: Select,
                                            props: {
                                                value: selectedMonth,
                                                onChange: (e) => setSelectedMonth(e.target.value),
                                                options: [
                                                    { value: '', label: 'Select Month' },
                                                    ...months
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { width: '250px' },
                                    children: [
                                        {
                                            type: 'label',
                                            props: {
                                                style: { 
                                                    display: 'block', 
                                                    marginBottom: theme.spacing.xs,
                                                    fontWeight: 'bold'
                                                },
                                                children: ['Working days in month']
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                type: 'number',
                                                placeholder: 'Type Number of working days in month',
                                                value: workingDays,
                                                onChange: (e) => setWorkingDays(e.target.value)
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Staff No', 'Name', 'Attendance in the month'],
                        data: tableData
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            margin: theme.spacing.lg
                        },
                        children: [
                            {
                                type: Button,
                                props: {
                                    onClick: handleSubmit,
                                    children: ['Submit attendance']
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.StaffAttendance = StaffAttendance;