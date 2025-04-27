// components/student/other/ApplyForHostel.js (Example - IF NEEDED)
// This assumes a student is using it to apply.
const ApplyForHostel = ({ studentIndex, onClose }) => { // Needs studentIndex prop
    const [availableHostels, setAvailableHostels] = MiniReact.useState([]);
    const [loadingHostels, setLoadingHostels] = MiniReact.useState(true);
    const [formData, setFormData] = MiniReact.useState({
        preferredHostelId: '', // Store ID
    });
    const [submitting, setSubmitting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [successMessage, setSuccessMessage] = MiniReact.useState(null);

    // --- API Helper (reuse or define) ---
    const apiFetch = async (url, options = {}) => {
        try {
             const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
 
             const response = await fetch(url, {
                 headers: { 
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json',
                      ...options.headers 
                     },
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

    // --- Fetch available hostels for dropdown ---
    MiniReact.useEffect(() => {
        const fetchHostels = async () => {
            setLoadingHostels(true);
            try {
                // Ideally, backend provides an endpoint for suitable hostels based on student gender/eligibility
                // Using the general endpoint for now
                const hostels = await apiFetch('http://localhost:8081/api/api/hostel/hostels');
                setAvailableHostels(hostels || []);
            } catch (err) {
                setError("Could not load hostel list.");
            } finally {
                setLoadingHostels(false);
            }
        };
        fetchHostels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentIndex) {
             setError("Student information is missing.");
             return;
        }
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const payload = {
            studentIndex: studentIndex, // Passed as prop
            preferredHostelId: formData.preferredHostelId ? parseInt(formData.preferredHostelId, 10) : null, // Use null if no preference
            // applicationDate and status are set by backend
        };

        try {
            // Check if student already has an application/assignment
            const hasExisting = await apiFetch(`/api/hostel/check-application/student/${studentIndex}`); //
            if (hasExisting) {
                 throw new Error("You already have an active hostel application or assignment."); //
            }

            const result = await apiFetch('/api/hostel/applications', { //
                method: 'POST',
                body: JSON.stringify(payload),
            });
            setSuccessMessage("Application submitted successfully!");
            // Optionally close the modal after a delay or on user action
            setTimeout(onClose, 2000);
        } catch (err) {
             setError(`Submission failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // --- Styles ---
     const styles = { /* ... adapt existing styles ... */ };

    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Apply for Hostel Accommodation',
            children: [
                 error && { type: 'p', props: { style: { color: 'red' }, children: [error] } },
                 successMessage && { type: 'p', props: { style: { color: 'green' }, children: [successMessage] } },
                {
                    type: 'form',
                    props: {
                        style: styles.form,
                        onSubmit: handleSubmit,
                        children: [
                             { type: 'p', props: { children: [`Applying as Student Index: ${studentIndex}`] } },
                            {
                                type: Select,
                                props: {
                                    label: 'Preferred Hostel (Optional)',
                                    value: formData.preferredHostelId,
                                    onChange: (e) => setFormData({...formData, preferredHostelId: e.target.value}),
                                    disabled: loadingHostels,
                                    options: [
                                        { value: '', label: loadingHostels ? 'Loading...' : 'No Preference' },
                                        // Filter hostels based on student gender if possible, or let backend handle suitability
                                        ...availableHostels.map(h => ({ value: h.hostelId, label: `${h.name} (${h.gender}, Vacancy: ${h.capacity - h.occupancy})` }))
                                    ]
                                }
                            },
                            // Remove roomNumber, assignDate fields
                            {
                                type: 'div',
                                props: { /* ... buttonsContainer styles ... */
                                    children: [
                                        { type: Button, props: { variant: 'secondary', onClick: onClose, children: 'Cancel', disabled: submitting } },
                                        { type: Button, props: { type: 'submit', children: submitting ? 'Submitting...' : 'Submit Application', disabled: submitting || loadingHostels } }
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

window.ApplyForHostel = ApplyForHostel; // If this becomes the new component name