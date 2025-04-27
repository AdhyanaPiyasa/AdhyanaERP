// frontend/src/components/student/other/HostelInfo.js
const HostelInfo = () => {
    // --- State ---
    const [hostelBlocks, setHostelBlocks] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [showApplyModal, setShowApplyModal] = MiniReact.useState(false);

    // --- Get userId from AppState ---
    const studentUserId = localStorage.getItem('userId'); // Use the userId from the local storage

    // --- API Helper (keep existing) ---
    const apiFetch = async (url, options = {}) => {
        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                     'Accept': 'application/json', 
                    ...options.headers
                },
                ...options,
            });
            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) { /* ignore non-json response */ }
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            if (response.status === 204) return null;
            const data = await response.json();
            if (data.success === false) throw new Error(data.message || 'API request indicated failure');
            return data.data || data;
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(err.message);
            throw err;
        }
    };

    // --- Fetch Hostels (keep existing) ---
    MiniReact.useEffect(() => {
        const fetchHostels = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch('http://localhost:8081/api/api/hostel/hostels');
                setHostelBlocks(data || []);
            } catch (err) {
                setHostelBlocks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHostels();
    }, []);

    // --- Modal Control ---
    const handleOpenApplyModal = () => {
        // Check if studentUserId is available from AppState
        if (!studentUserId) {
            setError("Cannot apply: Student information not found. Please ensure you are logged in.");
            return;
        }
        setShowApplyModal(true);
    };
    const handleCloseApplyModal = () => {
        setShowApplyModal(false);
        setError(null);
    };

    // --- Styles (keep existing, including centering) ---
    const styles = {
        container: {
            padding: theme.spacing.lg,
            maxWidth: '1200px',
            margin: '0 auto',
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        title: {
             margin: 0
        },
        blockGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: theme.spacing.lg
        },
        blockName: {
            fontSize: theme.typography.h2.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.md,
            textAlign: 'center'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm
        },
        infoLabel: { /* Optional */ },
        infoValue: { fontWeight: 'bold' },
        facilitiesTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm
        },
         errorText: {
            color: 'red',
            marginTop: theme.spacing.md,
            textAlign: 'center'
        },
        loadingText: {
             textAlign: 'center',
             padding: theme.spacing.xl
        },
         noDataText: {
             textAlign: 'center',
             padding: theme.spacing.xl
         }
    };

    // --- Render Functions (keep existing) ---
    const renderFacilityRow = (label, value) => ({ /* ... */ });
    const renderInfoRow = (label, value) => ({ /* ... */ });
    const renderBlockCard = (block) => ({ /* ... */ });

    // --- Main Return ---
    return {
        type: Card,
        props: {
            style: styles.container,
            children: [
                // Header Row with Title and Apply Button
                { type: 'div', props: { style: styles.headerContainer, children: [
                    { type: 'h1', props: { style: styles.title, children: ['Hostel Information'] } },
                    { type: Button, props: {
                        variant: 'primary',
                        onClick: handleOpenApplyModal,
                        children: 'Apply for Hostel',
                        // Disable button if loading or if userId is not available
                        disabled: loading || !studentUserId
                    }}
                ]}},

                // Loading State
                loading && { type: 'p', props: { style: styles.loadingText, children: ['Loading hostel information...'] } },

                // Error State (General fetch error or missing userId)
                error && !showApplyModal && { type: 'p', props: { style: styles.errorText, children: [`Error: ${error}`] } },

                // Content Area
                !loading && !error && {
                    type: 'div',
                    props: {
                        style: styles.blockGrid,
                        children: hostelBlocks.length > 0
                            ? hostelBlocks.map(renderBlockCard)
                            : { type: 'p', props: { style: styles.noDataText, children: ['No hostel information available.'] } }
                    }
                },

                showApplyModal && {
                    type: ApplyForHostel,
                    props: {
                        studentIndex: studentUserId,
                        onClose: handleCloseApplyModal
                    }
                }
            ]
        }
    };
};

window.HostelInfo = HostelInfo; 