// components/Administrator/staff/Payroll.js
// Main Payroll dashboard with integrated components
const PayrollDashboard = () => {
    // State for managing payroll data
    const [payrollData, setPayrollData] = MiniReact.useState([]);
    const [staffList, setStaffList] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    
    // Fetch staff list from backend
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
            if (data.success) {
                setStaffList(data.data || []);
            } else {
                setError(data.message || "Failed to fetch staff list");
            }
        } catch (error) {
            setError("Error fetching staff data: " + error.message);
            console.error("Error fetching staff data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch payroll data from backend
    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = 'http://localhost:8081/api/api/admin/payroll';
            
            const response = await fetch(url, {
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
            if (data.success) {
                setPayrollData(data.data || []);
            } else {
                setError(data.message || "Failed to fetch payroll data");
            }
        } catch (error) {
            setError("Error fetching payroll data: " + error.message);
            console.error("Error fetching payroll data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch staff list and payroll data on component mount
    MiniReact.useEffect(() => {
        fetchStaffList();
        fetchPayrollData();
    }, []);
    
    if (loading) {
        return {
            type: Card,
            props: {
                children: [{
                    type: LoadingSpinner,
                    props: {}
                }]
            }
        };
    }
    
    return {
        type: 'div',
        props: {
            style: {
                padding: theme.spacing.lg,
                maxWidth: '1200px',
                margin: '0 auto'
            },
            children: [
                // Header Section
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
                                                children: ['Payroll Dashboard']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: ['Manage and monitor staff payroll processing and payments']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Error message if present
                error && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.error,
                            padding: theme.spacing.md,
                            marginTop: theme.spacing.md,
                            backgroundColor: '#ffebee',
                            borderRadius: theme.borderRadius.md
                        },
                        children: [error]
                    }
                },
                
                // Dashboard Sections
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: theme.spacing.lg,
                            marginTop: theme.spacing.lg
                        },
                        children: [
                            // Summary Section
                            {
                                type: PayrollSummary,
                                props: {
                                    payrollData,
                                    staffList
                                }
                            },
                            // Chart Section
                            {
                                type: PayrollStatusChart,
                                props: {
                                    payrollData
                                }
                            }
                        ]
                    }
                },
                
                // Payroll Management Component
                {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.lg },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: { 
                                        margin: theme.spacing.md,
                                        marginBottom: theme.spacing.sm
                                    },
                                    children: ['Payroll Management']
                                }
                            },
                            {
                                type: Payroll,
                                props: {}
                            }
                        ]
                    }
                }
            ]
        }
    };
};

const Payroll = () => {
    // State for managing payroll data
    const [payrollData, setPayrollData] = MiniReact.useState([]);
    const [staffList, setStaffList] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    
    // State for filtering and pagination
    const [currentStaff, setCurrentStaff] = MiniReact.useState(null);
    const [selectedMonth, setSelectedMonth] = MiniReact.useState('');
    const [selectedYear, setSelectedYear] = MiniReact.useState(new Date().getFullYear().toString());
    
    // Modal states
    const [showProcessModal, setShowProcessModal] = MiniReact.useState(false);
    const [showBulkProcessModal, setShowBulkProcessModal] = MiniReact.useState(false);
    const [showViewModal, setShowViewModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [showMarkPaidModal, setShowMarkPaidModal] = MiniReact.useState(false);
    
    // Selected payroll for operations
    const [selectedPayroll, setSelectedPayroll] = MiniReact.useState(null);
    const [selectedPayrolls, setSelectedPayrolls] = MiniReact.useState([]);
    
    // Fetch staff list from backend
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
            if (data.success) {
                setStaffList(data.data || []);
            } else {
                setError(data.message || "Failed to fetch staff list");
            }
        } catch (error) {
            setError("Error fetching staff data: " + error.message);
            console.error("Error fetching staff data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch payroll data from backend
    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = 'http://localhost:8081/api/payroll';
            
            if (currentStaff) {
                url = `http://localhost:8081/api/api/admin/payroll/staff/${currentStaff}`;
            }
            
            const response = await fetch(url, {
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
            if (data.success) {
                setPayrollData(data.data || []);
            } else {
                setError(data.message || "Failed to fetch payroll data");
            }
        } catch (error) {
            setError("Error fetching payroll data: " + error.message);
            console.error("Error fetching payroll data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch staff list and payroll data on component mount
    MiniReact.useEffect(() => {
        fetchStaffList();
        fetchPayrollData();
    }, []);
    
    // Process payroll for a staff member
    const processPayroll = async (staffId, month) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/admin/payroll/process', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    staffId: staffId,
                    month: month
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                // Refresh payroll data after processing
                fetchPayrollData();
            } else {
                setError(data.message || "Failed to process payroll");
            }
        } catch (error) {
            setError("Error processing payroll: " + error.message);
            console.error("Error processing payroll:", error);
        } finally {
            setLoading(false);
            setShowProcessModal(false);
        }
    };
    
    // Process bulk payroll for all active staff
    const processBulkPayroll = async (month) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/admin/payroll/process-bulk', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    month: month
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                // Refresh payroll data after processing
                fetchPayrollData();
            } else {
                setError(data.message || "Failed to process bulk payroll");
            }
        } catch (error) {
            setError("Error processing bulk payroll: " + error.message);
            console.error("Error processing bulk payroll:", error);
        } finally {
            setLoading(false);
            setShowBulkProcessModal(false);
        }
    };
    
    // Mark payroll as paid
    const markPayrollAsPaid = async (payrollIds) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8081/api/api/admin/payroll/mark-paid', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payrollIds: Array.isArray(payrollIds) ? payrollIds : [payrollIds],
                    paymentDate: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                // Refresh payroll data after marking as paid
                fetchPayrollData();
            } else {
                setError(data.message || "Failed to mark payroll as paid");
            }
        } catch (error) {
            setError("Error marking payroll as paid: " + error.message);
            console.error("Error marking payroll as paid:", error);
        } finally {
            setLoading(false);
            setShowMarkPaidModal(false);
        }
    };
    
    // Update pending payroll
    const updatePayroll = async (payrollId, payrollData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/api/admin/payroll/${payrollId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payrollData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                // Refresh payroll data after updating
                fetchPayrollData();
            } else {
                setError(data.message || "Failed to update payroll");
            }
        } catch (error) {
            setError("Error updating payroll: " + error.message);
            console.error("Error updating payroll:", error);
        } finally {
            setLoading(false);
            setShowEditModal(false);
        }
    };
    
    // Delete pending payroll
    const deletePayroll = async (payrollId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/api/admin/payroll/${payrollId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                // Refresh payroll data after deleting
                fetchPayrollData();
            } else {
                setError(data.message || "Failed to delete payroll");
            }
        } catch (error) {
            setError("Error deleting payroll: " + error.message);
            console.error("Error deleting payroll:", error);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };
    
    // Handle staff selection change
    const handleStaffChange = (e) => {
        setCurrentStaff(e.target.value);
        // Fetch payroll data for selected staff
        if (e.target.value) {
            fetchPayrollData();
        }
    };
    
    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };
    
    // Format date values
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Filter years for dropdown
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        years.push({ value: i.toString(), label: i.toString() });
    }
    
    // Filter months for dropdown
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];
    
    // Generate month-year string for processing
    const getMonthYearString = () => {
        return `${selectedYear}-${selectedMonth}-01`;
    };
    
    // Prepare data for Table component
    const tableData = payrollData.map(payroll => {
        // Find staff name from staff list
        const staff = staffList.find(s => s.id === payroll.staffId);
        const staffName = staff ? staff.name : `Staff #${payroll.staffId}`;
        
        return {
            'ID': payroll.payrollId,
            'Staff': staffName,
            'Month': formatDate(payroll.salaryMonth),
            'Basic Salary': formatCurrency(payroll.basicSalary),
            'Allowances': formatCurrency(payroll.allowances),
            'Deductions': formatCurrency(payroll.deductions),
            'Net Salary': formatCurrency(payroll.netSalary),
            'Status': payroll.paymentStatus,
            'Actions': {
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
                                    gap: theme.spacing.sm
                                },
                                children: [
                                    {
                                        type: Button,
                                        props: {
                                            onClick: () => {
                                                setSelectedPayroll(payroll);
                                                setShowViewModal(true);
                                            },
                                            variant: 'secondary',
                                            size: 'small',
                                            children: 'View'
                                        }
                                    },
                                    payroll.paymentStatus === 'PENDING' && {
                                        type: Button,
                                        props: {
                                            onClick: () => {
                                                setSelectedPayroll(payroll);
                                                setShowEditModal(true);
                                            },
                                            variant: 'secondary',
                                            size: 'small',
                                            children: 'Edit'
                                        }
                                    },
                                    payroll.paymentStatus === 'PENDING' && {
                                        type: Button,
                                        props: {
                                            onClick: () => {
                                                setSelectedPayroll(payroll);
                                                setShowDeleteModal(true);
                                            },
                                            variant: 'secondary',
                                            size: 'small',
                                            children: 'Delete'
                                        }
                                    },
                                    payroll.paymentStatus === 'PENDING' && {
                                        type: Button,
                                        props: {
                                            onClick: () => {
                                                setSelectedPayroll(payroll);
                                                setShowMarkPaidModal(true);
                                            },
                                            variant: 'secondary',
                                            size: 'small',
                                            children: 'Mark Paid'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        };
    });
    
    if (loading) {
        return {
            type: Card,
            props: {
                children: [{
                    type: LoadingSpinner,
                    props: {}
                }]
            }
        };
    }
    
    return {
        type: 'div',
        props: {
            style: {
                padding: theme.spacing.lg,
                maxWidth: '1200px',
                margin: '0 auto'
            },
            children: [
                // Header Section
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
                                                children: ['Payroll Management']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: ['Manage staff payroll processing and payments']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Filter and Actions Section
                {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.md },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        // Filter controls
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    gap: theme.spacing.md,
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    {
                                                        type: Select,
                                                        props: {
                                                            label: 'Staff',
                                                            value: currentStaff || '',
                                                            onChange: handleStaffChange,
                                                            options: [
                                                                { value: '', label: 'All Staff' },
                                                                ...staffList.map(staff => ({
                                                                    value: staff.staffId,
                                                                    label: staff.name
                                                                }))
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        
                                        // Action buttons
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowProcessModal(true),
                                                            children: '+ Process Payroll'
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowBulkProcessModal(true),
                                                            variant: 'secondary',
                                                            children: 'Bulk Process'
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
                
                // Error message if present
                error && {
                    type: 'div',
                    props: {
                        style: { 
                            color: theme.colors.error,
                            padding: theme.spacing.md,
                            marginTop: theme.spacing.md,
                            backgroundColor: '#ffebee',
                            borderRadius: theme.borderRadius.md
                        },
                        children: [error]
                    }
                },
                
                // Payroll Table
                {
                    type: Card,
                    props: {
                        style: { marginTop: theme.spacing.md },
                        children: [
                            {
                                type: Table,
                                props: {
                                    headers: ['ID', 'Staff', 'Month', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Actions'],
                                    data: tableData
                                }
                            }
                        ]
                    }
                },
                
                // Modals
                
                // Process Payroll Modal
                showProcessModal && {
                    type: Modal,
                    props: {
                        isOpen: showProcessModal,
                        onClose: () => setShowProcessModal(false),
                        title: 'Process Payroll',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [
                                        {
                                            type: Select,
                                            props: {
                                                label: 'Staff',
                                                value: currentStaff || '',
                                                onChange: (e) => setCurrentStaff(e.target.value),
                                                options: staffList.map(staff => ({
                                                    value: staff.staffId,
                                                    label: staff.name
                                                }))
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex', 
                                                    gap: theme.spacing.md,
                                                    marginTop: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: Select,
                                                        props: {
                                                            label: 'Month',
                                                            value: selectedMonth,
                                                            onChange: (e) => setSelectedMonth(e.target.value),
                                                            options: months
                                                        }
                                                    },
                                                    {
                                                        type: Select,
                                                        props: {
                                                            label: 'Year',
                                                            value: selectedYear,
                                                            onChange: (e) => setSelectedYear(e.target.value),
                                                            options: years
                                                        }
                                                    }
                                                ]
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
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => setShowProcessModal(false),
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => processPayroll(currentStaff, getMonthYearString()),
                                                disabled: !currentStaff || !selectedMonth || !selectedYear,
                                                children: 'Process'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Bulk Process Modal
                showBulkProcessModal && {
                    type: Modal,
                    props: {
                        isOpen: showBulkProcessModal,
                        onClose: () => setShowBulkProcessModal(false),
                        title: 'Bulk Process Payroll',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['This will process payroll for all active staff members for the selected month.']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'flex', 
                                                    gap: theme.spacing.md 
                                                },
                                                children: [
                                                    {
                                                        type: Select,
                                                        props: {
                                                            label: 'Month',
                                                            value: selectedMonth,
                                                            onChange: (e) => setSelectedMonth(e.target.value),
                                                            options: months
                                                        }
                                                    },
                                                    {
                                                        type: Select,
                                                        props: {
                                                            label: 'Year',
                                                            value: selectedYear,
                                                            onChange: (e) => setSelectedYear(e.target.value),
                                                            options: years
                                                        }
                                                    }
                                                ]
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
                                        gap: theme.spacing.md,
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => setShowBulkProcessModal(false),
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => processBulkPayroll(getMonthYearString()),
                                                disabled: !selectedMonth || !selectedYear,
                                                children: 'Process All'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // View Payroll Modal
                showViewModal && selectedPayroll && {
                    type: Modal,
                    props: {
                        isOpen: showViewModal,
                        onClose: () => setShowViewModal(false),
                        title: 'Payroll Details',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: theme.spacing.md,
                                        marginBottom: theme.spacing.lg
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Payroll ID:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [selectedPayroll.payrollId]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Staff:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [
                                                                (staffList.find(s => s.staffId === selectedPayroll.staffId)?.name || 
                                                                `Staff #${selectedPayroll.staffId}`)
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Month:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [formatDate(selectedPayroll.salaryMonth)]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Status:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [selectedPayroll.paymentStatus]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { 
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        padding: theme.spacing.md,
                                        marginBottom: theme.spacing.lg
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { 
                                                    marginBottom: theme.spacing.md,
                                                    borderBottom: `1px solid ${theme.colors.border}`,
                                                    paddingBottom: theme.spacing.sm
                                                },
                                                children: ['Salary Details']
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { 
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: theme.spacing.md
                                                },
                                                children: [
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Basic Salary:']
                                                                    }
                                                                },
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        children: [formatCurrency(selectedPayroll.basicSalary)]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Allowances:']
                                                                    }
                                                                },
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        children: [formatCurrency(selectedPayroll.allowances)]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Deductions:']
                                                                    }
                                                                },
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        children: [formatCurrency(selectedPayroll.deductions)]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            children: [
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        style: { fontWeight: 'bold' },
                                                                        children: ['Net Salary:']
                                                                    }
                                                                },
                                                                {
                                                                    type: 'p',
                                                                    props: {
                                                                        style: { fontWeight: 'bold', color: theme.colors.success },
                                                                        children: [formatCurrency(selectedPayroll.netSalary)]
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
                            
                            // Notes and additional information
                            selectedPayroll.notes && {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.lg },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: ['Notes']
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [selectedPayroll.notes]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Payment details if paid
                            selectedPayroll.paymentStatus === 'PAID' && selectedPayroll.paymentDate && {
                                type: 'div',
                                props: {
                                    style: { 
                                        marginBottom: theme.spacing.lg,
                                        padding: theme.spacing.md,
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'h3',
                                            props: {
                                                style: { marginBottom: theme.spacing.sm },
                                                children: ['Payment Information']
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Paid on: ${formatDate(selectedPayroll.paymentDate)}`]
                                            }
                                        }
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
                                        marginTop: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => setShowViewModal(false),
                                                children: 'Close'
                                            }
                                        },
                                        selectedPayroll.paymentStatus === 'PENDING' && {
                                            type: Button,
                                            props: {
                                                onClick: () => {
                                                    setShowViewModal(false);
                                                    setShowEditModal(true);
                                                },
                                                children: 'Edit'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Edit Payroll Modal
                showEditModal && selectedPayroll && {
                    type: PayrollEditModal,
                    props: {
                        payroll: selectedPayroll,
                        onClose: () => setShowEditModal(false),
                        onSave: (updatedPayroll) => {
                            updatePayroll(selectedPayroll.payrollId, updatedPayroll);
                        }
                    }
                },
                
                // Delete Confirmation Modal
                showDeleteModal && selectedPayroll && {
                    type: Modal,
                    props: {
                        isOpen: showDeleteModal,
                        onClose: () => setShowDeleteModal(false),
                        title: 'Confirm Deletion',
                        children: [
                            {
                                type: 'p',
                                props: {
                                    style: { marginBottom: theme.spacing.lg },
                                    children: ['Are you sure you want to delete this payroll record? This action cannot be undone.']
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
                                                onClick: () => setShowDeleteModal(false),
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => deletePayroll(selectedPayroll.payrollId),
                                                style: { backgroundColor: theme.colors.error },
                                                children: 'Delete'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                
                // Mark as Paid Modal
                showMarkPaidModal && selectedPayroll && {
                    type: Modal,
                    props: {
                        isOpen: showMarkPaidModal,
                        onClose: () => setShowMarkPaidModal(false),
                        title: 'Mark Payroll as Paid',
                        children: [
                            {
                                type: 'p',
                                props: {
                                    style: { marginBottom: theme.spacing.lg },
                                    children: [
                                        `Are you sure you want to mark this payroll record for ${
                                            staffList.find(s => s.staffId === selectedPayroll.staffId)?.name || 
                                            `Staff #${selectedPayroll.staffId}`
                                        } as paid? This action will record the payment date as today.`
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
                                                onClick: () => setShowMarkPaidModal(false),
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => markPayrollAsPaid(selectedPayroll.payrollId),
                                                children: 'Mark as Paid'
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
    };
};

window.Payroll = Payroll;
window.PayrollDashboard = PayrollDashboard;