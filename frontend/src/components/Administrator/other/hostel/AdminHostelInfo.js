// components/Administrator/other/hostel/AdminHostelInfo.js
const AdminHostelInfo = () => {
    const [hostelBlocks, setHostelBlocks] = MiniReact.useState([]);
    const [loading, setLoading] = MiniReact.useState(true);
    const [error, setError] = MiniReact.useState(null);
    const [editingBlockId, setEditingBlockId] = MiniReact.useState(null); // Store ID instead of full object

    // --- API Helper ---
    const apiFetch = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers,
                },
                ...options,
            });
            if (!response.ok) {
                // Try to parse error response from backend
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    // If response is not JSON
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            // Handle cases where response might be empty (e.g., DELETE 204)
            if (response.status === 204) {
                 return null; // Or return a specific indicator if needed
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'API request failed');
            }
            return data.data; // Return the actual data payload
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(err.message); // Set error state for UI
            throw err; // Re-throw to allow caller to handle
        }
    };

    // --- Fetch Hostels ---
    MiniReact.useEffect(() => {
        const fetchHostels = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiFetch('/api/hostel/hostels');
                setHostelBlocks(data || []); // Use fetched data
            } catch (err) {
                // Error state is set within apiFetch
                setHostelBlocks([]); // Clear data on error
            } finally {
                setLoading(false);
            }
        };
        fetchHostels();
    }, []); // Runs once on mount

    // --- Edit Logic ---
    const handleEditClick = (hostelId) => {
        setEditingBlockId(hostelId);
    };

    const handleCloseEdit = () => {
        setEditingBlockId(null);
    }

    const handleSaveEdit = async (hostelId, updatedData) => {
        setLoading(true); // Indicate loading state
        setError(null);
        try {
            const savedHostel = await apiFetch(`/api/hostel/hostels/${hostelId}`, {
                method: 'PUT',
                body: JSON.stringify(updatedData),
            });

            // Update the hostel list state with the new data
            setHostelBlocks(prevBlocks =>
                prevBlocks.map(block =>
                    block.hostelId === hostelId ? { ...block, ...savedHostel } : block // Use returned saved data
                )
            );
            setEditingBlockId(null); // Close the modal
        } catch (err) {
            // Error state handled by apiFetch, maybe show a notification
             console.error("Failed to save hostel:", err);
        } finally {
            setLoading(false);
        }
    };

     // --- Optional: Delete Logic ---
    const handleDeleteHostel = async (hostelId) => {
        // Optional: Add a confirmation dialog here
        if (!confirm(`Are you sure you want to delete hostel ${hostelId}? This cannot be undone.`)) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await apiFetch(`/api/hostel/hostels/${hostelId}`, {
                method: 'DELETE',
            });
            // Remove the hostel from the list
            setHostelBlocks(prevBlocks => prevBlocks.filter(block => block.hostelId !== hostelId));
        } catch (err) {
             // Error state handled by apiFetch, maybe show a notification
             // Note: Backend might return 409 Conflict if hostel has residents
            console.error("Failed to delete hostel:", err);
            alert(`Error deleting hostel: ${err.message}`); // Simple alert for now
        } finally {
            setLoading(false);
        }
    };

    // --- Styles (keep existing styles) ---
    const styles = { /* ... existing styles ... */
         container: { padding: theme.spacing.lg },
         blockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: theme.spacing.lg },
         blockName: { fontSize: theme.typography.h2.fontSize, fontWeight: 'bold', marginBottom: theme.spacing.md, textAlign: 'center' },
         infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
         infoLabel: { /* Optional: style for label */ },
         infoValue: { fontWeight: 'bold' },
         facilitiesTitle: { fontSize: theme.typography.h3.fontSize, fontWeight: 'bold', marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
         buttonContainer: { display: 'flex', justifyContent: 'space-between', marginTop: theme.spacing.md } // For Edit/Delete buttons
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
            key: block.hostelId, // Use unique key
            variant: 'outlined',
            children: [
                { type: 'div', props: { style: styles.blockName, children: [block.name] } },
                renderInfoRow('ID', block.hostelId), // Display ID
                renderInfoRow('Capacity', block.capacity), // Use capacity
                renderInfoRow('Occupancy', block.occupancy), // Use occupancy
                renderInfoRow('Vacancy', block.capacity - block.occupancy), // Calculate vacancy
                renderInfoRow('Gender', block.gender), // Use gender
                renderInfoRow('Assistant', block.assistantName || 'N/A'), // Use assistantName
                { type: 'div', props: { style: styles.facilitiesTitle, children: ['Facilities'] } },
                renderFacilityRow('WiFi', block.wifi), // Use wifi
                renderFacilityRow('Kitchen', block.kitchen), // Use kitchen
                renderFacilityRow('Laundry', block.laundry), // Use laundry
                renderFacilityRow('Study Area', block.studyArea), // Use studyArea
                // Removed AC and Rooms as they are not in backend model
                {
                    type: 'div',
                    props: {
                         style: styles.buttonContainer,
                         children: [
                            {
                                type: Button,
                                props: {
                                    variant: 'primary',
                                    children: 'Edit',
                                    onClick: () => handleEditClick(block.hostelId) // Pass ID
                                }
                            },
                            { // Optional Delete Button
                                type: Button,
                                props: {
                                    variant: 'danger', // Assuming a danger variant exists
                                    children: 'Delete',
                                    onClick: () => handleDeleteHostel(block.hostelId)
                                }
                            }
                         ]
                    }
                }
            ]
        }
    });

    // --- Main Return ---
    return {
        type: Card,
        props: {
            style: styles.container,
            children: [
                { type: 'h1', props: { children: ['Hostel Management'] } },
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
                        children: [
                            { type: 'h2', props: { children: ['Hostel Details'] } },
                        ]
                    }
                },
                loading && { type: 'p', props: { children: ['Loading hostels...'] } },
                error && { type: 'p', props: { style: { color: 'red' }, children: [`Error: ${error}`] } },
                !loading && !error && {
                    type: 'div',
                    props: {
                        style: styles.blockGrid,
                        children: hostelBlocks.length > 0 ? hostelBlocks.map(renderBlockCard) : { type: 'p', props: { children: ['No hostels found.'] } }
                    }
                },
                // Render Edit Modal when editingBlockId is set
                editingBlockId && {
                    type: HostelEdit,
                    props: {
                        hostelId: editingBlockId, // Pass ID
                        hostelName: hostelBlocks.find(b => b.hostelId === editingBlockId)?.name || '', // Pass name for title
                        initialData: hostelBlocks.find(b => b.hostelId === editingBlockId), // Pass initial data
                        onClose: handleCloseEdit,
                        onSave: handleSaveEdit // Pass the save handler
                    }
                },
            ]
        }
    };
};

window.AdminHostelInfo = AdminHostelInfo;