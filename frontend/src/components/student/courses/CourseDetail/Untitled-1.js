// components/common/Table.js
const Table = ({ 
    headers, 
    data, 
    onRowClick,
    sortable = false,
    pagination = false,
    pageSize = 10
}) => {
    const [currentPage, setCurrentPage] = MiniReact.useState(1);
    const [sortConfig, setSortConfig] = MiniReact.useState({
        key: null,
        direction: 'asc'
    });

    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            boxShadow: theme.shadows.sm
        },
        th: {
            padding: theme.spacing.md,
            textAlign: 'left',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
            fontWeight: 'bold',
            color: theme.colors.textSecondary,
            cursor: sortable ? 'pointer' : 'default'
        },
        td: {
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
            color: theme.colors.textPrimary
        },
        tr: {
            cursor: onRowClick ? 'pointer' : 'default',
            backgroundColor: 'white',
            transition: 'background-color 0.2s'
        },
        trHover: {
            backgroundColor: theme.colors.background
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`
        },
        pageButton: {
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: 'white',
            cursor: 'pointer',
            marginLeft: theme.spacing.xs
        },
        activePageButton: {
            backgroundColor: theme.colors.primary,
            color: 'white',
            borderColor: theme.colors.primary
        },
        sortIcon: {
            marginLeft: theme.spacing.xs,
            fontSize: '0.8em'
        }
    };

    // Sort data if sortable
    const sortedData = MiniReact.useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    // Handle pagination
    const paginatedData = MiniReact.useMemo(() => {
        if (!pagination) return sortedData;
        
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (header) => {
        if (!sortable) return;
        
        setSortConfig(prevConfig => ({
            key: header,
            direction: prevConfig.key === header && prevConfig.direction === 'asc' 
                ? 'desc' 
                : 'asc'
        }));
    };

    const renderCell = (cell) => {
        // If cell is a component (has type property)
        if (cell && typeof cell === 'object' && 'type' in cell) {
            return cell;
        }
        // If cell is null or undefined
        if (cell === null || cell === undefined) {
            return '';
        }
        // Default to string
        return String(cell);
    };

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: 'table',
                    props: {
                        style: styles.table,
                        children: [
                            // Table Header
                            {
                                type: 'thead',
                                props: {
                                    children: [{
                                        type: 'tr',
                                        props: {
                                            children: headers.map(header => ({
                                                type: 'th',
                                                props: {
                                                    style: styles.th,
                                                    onclick: () => handleSort(header),
                                                    children: [
                                                        header,
                                                        sortable && sortConfig.key === header && {
                                                            type: 'span',
                                                            props: {
                                                                style: styles.sortIcon,
                                                                children: [
                                                                    sortConfig.direction === 'asc' ? '▲' : '▼'
                                                                ]
                                                            }
                                                        }
                                                    ].filter(Boolean)
                                                }
                                            }))
                                        }
                                    }]
                                }
                            },
                            // Table Body
                            {
                                type: 'tbody',
                                props: {
                                    children: paginatedData.map((row, rowIndex) => ({
                                        type: 'tr',
                                        props: {
                                            style: {
                                                ...styles.tr,
                                                ':hover': styles.trHover
                                            },
                                            onclick: onRowClick ? () => onRowClick(row, rowIndex) : undefined,
                                            children: Object.values(row).map(cell => ({
                                                type: 'td',
                                                props: {
                                                    style: styles.td,
                                                    children: [renderCell(cell)]
                                                }
                                            }))
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },
                // Pagination
                pagination && totalPages > 1 && {
                    type: 'div',
                    props: {
                        style: styles.pagination,
                        children: [
                            {
                                type: 'div',
                                props: {
                                    children: Array.from({ length: totalPages }, (_, i) => ({
                                        type: 'button',
                                        props: {
                                            style: {
                                                ...styles.pageButton,
                                                ...(currentPage === i + 1 ? styles.activePageButton : {})
                                            },
                                            onclick: () => setCurrentPage(i + 1),
                                            children: [String(i + 1)]
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.Table = Table;