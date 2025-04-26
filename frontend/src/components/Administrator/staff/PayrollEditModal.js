// components/Administrator/staff/PayrollEditModal.js
const PayrollEditModal = ({ payroll, onClose, onSave }) => {
    // Initialize form state with payroll data
    const [formData, setFormData] = MiniReact.useState({
        basicSalary: payroll.basicSalary.toString(),
        allowances: payroll.allowances.toString(),
        deductions: payroll.deductions.toString(),
        notes: payroll.notes || ''
    });
    
    // Validation state
    const [errors, setErrors] = MiniReact.useState({});
    const [loading, setLoading] = MiniReact.useState(false);
    
    // Calculate net salary (for display only)
    const calculateNetSalary = () => {
        const basic = parseFloat(formData.basicSalary) || 0;
        const allowances = parseFloat(formData.allowances) || 0;
        const deductions = parseFloat(formData.deductions) || 0;
        return basic + allowances - deductions;
    };
    
    // Format currency for display
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };
    
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        // Check that amounts are valid numbers
        if (isNaN(parseFloat(formData.basicSalary)) || parseFloat(formData.basicSalary) < 0) {
            newErrors.basicSalary = 'Basic salary must be a valid number';
        }
        
        if (isNaN(parseFloat(formData.allowances)) || parseFloat(formData.allowances) < 0) {
            newErrors.allowances = 'Allowances must be a valid number';
        }
        
        if (isNaN(parseFloat(formData.deductions)) || parseFloat(formData.deductions) < 0) {
            newErrors.deductions = 'Deductions must be a valid number';
        }
        
        // Check if calculated net salary is positive
        if (calculateNetSalary() < 0) {
            newErrors.netSalary = 'Net salary cannot be negative';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = () => {
        if (!validateForm()) return;
        
        setLoading(true);
        
        // Prepare payroll object for update
        const updatedPayroll = {
            basicSalary: parseFloat(formData.basicSalary),
            allowances: parseFloat(formData.allowances),
            deductions: parseFloat(formData.deductions),
            notes: formData.notes
        };
        
        // Call parent component's save function
        onSave(updatedPayroll);
    };
    
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Edit Payroll',
            children: [
                {
                    type: 'form',
                    props: {
                        onSubmit: (e) => {
                            e.preventDefault();
                            handleSubmit();
                        },
                        children: [
                            // Staff and Month info (read-only)
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.md,
                                        padding: theme.spacing.md,
                                        backgroundColor: theme.colors.background,
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Payroll ID: ${payroll.payrollId}`]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Staff ID: ${payroll.staffId}`]
                                            }
                                        },
                                        {
                                            type: 'p',
                                            props: {
                                                children: [`Month: ${new Date(payroll.salaryMonth).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long'
                                                })}`]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Basic Salary field
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Basic Salary',
                                                name: 'basicSalary',
                                                type: 'number',
                                                step: '0.01',
                                                value: formData.basicSalary,
                                                onChange: handleChange,
                                                error: errors.basicSalary,
                                                placeholder: 'Enter basic salary amount',
                                                disabled: loading
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Allowances field
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Allowances',
                                                name: 'allowances',
                                                type: 'number',
                                                step: '0.01',
                                                value: formData.allowances,
                                                onChange: handleChange,
                                                error: errors.allowances,
                                                placeholder: 'Enter allowances amount',
                                                disabled: loading
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Deductions field
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.md },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Deductions',
                                                name: 'deductions',
                                                type: 'number',
                                                step: '0.01',
                                                value: formData.deductions,
                                                onChange: handleChange,
                                                error: errors.deductions,
                                                placeholder: 'Enter deductions amount',
                                                disabled: loading
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Net Salary (calculated, read-only)
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        marginBottom: theme.spacing.lg,
                                        padding: theme.spacing.md,
                                        backgroundColor: theme.colors.background,
                                        borderRadius: theme.borderRadius.md
                                    },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { fontWeight: 'bold' },
                                                            children: ['Calculated Net Salary:']
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            style: { 
                                                                fontWeight: 'bold',
                                                                color: calculateNetSalary() < 0 ? theme.colors.error : theme.colors.success
                                                            },
                                                            children: [formatCurrency(calculateNetSalary())]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        errors.netSalary && {
                                            type: 'p',
                                            props: {
                                                style: { color: theme.colors.error, marginTop: theme.spacing.sm },
                                                children: [errors.netSalary]
                                            }
                                        }
                                    ]
                                }
                            },
                            
                            // Notes field
                            {
                                type: 'div',
                                props: {
                                    style: { marginBottom: theme.spacing.lg },
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Notes',
                                                name: 'notes',
                                                multiline: true,
                                                rows: 3,
                                                value: formData.notes,
                                                onChange: handleChange,
                                                placeholder: 'Enter notes about this payroll (optional)',
                                                disabled: loading
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
                                        gap: theme.spacing.md
                                    },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                type: 'button',
                                                variant: 'secondary',
                                                onClick: onClose,
                                                disabled: loading,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                type: 'submit',
                                                disabled: loading,
                                                children: loading ? 'Saving...' : 'Save Changes'
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

window.PayrollEditModal = PayrollEditModal;