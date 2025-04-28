// components/Administrator/staff/Attendance.js
const StaffAttendance = () => {
    const [selectedMonth, setSelectedMonth] = MiniReact.useState('');
    const [workingDays, setWorkingDays] = MiniReact.useState('');
    const [staffAttendance, setStaffAttendance] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [success, setSuccess] = MiniReact.useState(null);

   

    // Fetch staff list from the backend
    const fetchStaffList = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:8081/api/api/admin/staff', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Received staff data:", data);
            
            if (data.success) {
                // Transform staff data into attendance format
                const attendanceData = data.data.map(staff => ({
                    id: staff.staffId,
                    name: staff.name,
                    attendance: ''  // Empty initially
                }));
                setStaffAttendance(attendanceData);
            } else {
                setError(data.message || "Failed to fetch staff list");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching staff list:", error);
        } finally {
            setLoading(false);
        }
    };

        // Fetch staff list when component mounts
        MiniReact.useEffect(() => {
            fetchStaffList();
        }, []);
    

    const handleAttendanceChange = (index, value) => {
        const updatedAttendance = [...staffAttendance];
        updatedAttendance[index] = {
            ...updatedAttendance[index],
            attendance: value
        };
        setStaffAttendance(updatedAttendance);
    };

 
    const handleSubmit = async () => {
        // Validate inputs
        if (!selectedMonth) {
            setError("Please select a month");
            return;
        }
        if (!workingDays || workingDays <= 0) {
            setError("Please enter a valid number of working days");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const token = localStorage.getItem('token');
            
            // Convert month name to Date object for the first day of the month
            const monthDate = new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`);
            
            // Record attendance for each staff member
            const attendancePromises = staffAttendance.map(async (staff) => {
                if (!staff.attendance) {
                    return null; // Skip staff without attendance entered
                }
                
                const attendanceData = {
                    staffId: staff.id,
                    month: monthDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    workingDays: parseInt(workingDays),
                    presentDays: parseInt(staff.attendance),
                    status: "PENDING"
                };
                
                console.log(`Submitting attendance for staff ${staff.id}:`, attendanceData);
                
                const response = await fetch(`http://localhost:8081/api/api/admin/staff/${staff.id}/attendance`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(attendanceData)
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to record attendance for ${staff.name}`);
                }
                
                const responseData = await response.json();
                return responseData;
            });
            
            // Wait for all attendance records to be submitted
            const results = await Promise.all(attendancePromises.filter(p => p !== null));
            
            setSuccess(`Successfully recorded attendance for ${results.length} staff members`);
            
            // Reset form
            setStaffAttendance(staffAttendance.map(staff => ({
                ...staff,
                attendance: ''
            })));
            
        } catch (error) {
            setError(error.message);
            console.error("Error submitting attendance:", error);
        } finally {
            setLoading(false);
        }
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
                type: 'number',
                style: { width: '80px', textAlign: 'center' }
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
                
                // Error and success messages
                error && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.error, 
                            padding: theme.spacing.md,
                            backgroundColor: `${theme.colors.error}10`,
                            borderRadius: theme.borderRadius.sm,
                            marginBottom: theme.spacing.md
                        },
                        children: [error]
                    }
                },
                
                success && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.success, 
                            padding: theme.spacing.md,
                            backgroundColor: `${theme.colors.success}10`,
                            borderRadius: theme.borderRadius.sm,
                            marginBottom: theme.spacing.md
                        },
                        children: [success]
                    }
                },
                
                // Month and Working days inputs
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
                
                // Loading spinner
                loading ? {
                    type: 'div',
                    props: {
                        style: { 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: theme.spacing.xl 
                        },
                        children: [{
                            type: LoadingSpinner,
                            props: {}
                        }]
                    }
                } : {
                    type: Table,
                    props: {
                        headers: ['Staff No', 'Name', 'Attendance in the month'],
                        data: tableData
                    }
                },
                
                // Submit button
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
                                    disabled: loading,
                                    children: [loading ? 'Submitting...' : 'Submit attendance']
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.StaffAttendance = StaffAttendance;