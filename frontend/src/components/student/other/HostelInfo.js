// components/student/other/HostelInfo.js
const HostelInfo = () => {
    const [hostelBlocks, setHostelBlocks] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);

     // --- API Helper (can be shared or defined here) ---
    const apiFetch = async (url, options = {}) => {
       try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                     ...options.headers },
                ...options,
            });
            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); } catch (e) { /* ignore */ }
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            if (response.status === 204) return null;
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'API request failed');
            return data.data;
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(err.message);
            throw err;
        }
    };

    // --- Fetch Hostels ---
    MiniReact.useEffect(() => {
        const fetchHostels = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch('http://localhost:8081/api/api/hostel/hostels'); // Fetch from backend
                setHostelBlocks(data || []);
            } catch (err) {
                 setHostelBlocks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHostels();
    }, []);

    // --- Styles (keep existing styles) ---
    const styles = { /* ... existing styles ... */
         container: { padding: theme.spacing.lg },
         blockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: theme.spacing.lg },
         blockName: { fontSize: theme.typography.h2.fontSize, fontWeight: 'bold', marginBottom: theme.spacing.md, textAlign: 'center' },
         infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
         infoLabel: { /* Optional */ },
         infoValue: { fontWeight: 'bold' },
         facilitiesTitle: { fontSize: theme.typography.h3.fontSize, fontWeight: 'bold', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm }
    };

    // --- Render Functions ---
    const renderFacilityRow = (label, value) => ({ /* ... existing renderFacilityRow ... */
        type: 'div', props: { style: styles.infoRow, children: [ { type: 'span', props: { children: [label] } }, { type: 'span', props: { style: styles.infoValue, children: [value ? 'Yes' : 'No'] } } ] }
    });

    const renderInfoRow = (label, value) => ({ /* ... existing renderInfoRow ... */
         type: 'div', props: { style: styles.infoRow, children: [ { type: 'span', props: { style: styles.infoLabel, children: [`${label} :`] } }, { type: 'span', props: { style: styles.infoValue, children: [value] } } ] }
    });

    const renderBlockCard = (block) => ({
        type: Card,
        props: {
            key: block.hostelId, // Use unique ID
            variant: 'outlined',
            children: [
                { type: 'div', props: { style: styles.blockName, children: [block.name] } },
                // Use backend fields
                renderInfoRow('Capacity', block.capacity),
                renderInfoRow('Occupancy', block.occupancy),
                renderInfoRow('Vacancy', block.capacity - block.occupancy), // Calculate vacancy
                renderInfoRow('Gender', block.gender),
                renderInfoRow('Assistant', block.assistantName || 'N/A'), // Use assistantName
                { type: 'div', props: { style: styles.facilitiesTitle, children: ['Facilities'] } },
                renderFacilityRow('WiFi', block.wifi),
                renderFacilityRow('Kitchen', block.kitchen),
                renderFacilityRow('Laundry', block.laundry),
                renderFacilityRow('Study Area', block.studyArea), // Use studyArea
            ]
        }
    });

    // --- Main Return ---
    return {
        type: Card,
        props: {
            style: styles.container,
            children: [
                { type: Card, props: { variant: 'ghost', children: [ { type: 'h1', props: { children: ['Hostel Information'] } } ] } },
                loading && { type: 'p', props: { children: ['Loading hostel information...'] } },
                error && { type: 'p', props: { style: { color: 'red' }, children: [`Error: ${error}`] } },
                !loading && !error && {
                    type: 'div',
                    props: {
                        style: styles.blockGrid,
                        children: hostelBlocks.length > 0 ? hostelBlocks.map(renderBlockCard) : { type: 'p', props: { children: ['No hostel information available.'] } }
                    }
                }
            ]
        }
    };
};

window.HostelInfo = HostelInfo;