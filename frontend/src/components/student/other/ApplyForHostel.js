// frontend/src/components/student/other/ApplyForHostel.js
const ApplyForHostel = ({ studentIndex, onClose }) => { // Expects studentIndex prop
    // --- State (keep existing) ---
    const [availableHostels, setAvailableHostels] = MiniReact.useState([]);
    const [loadingHostels, setLoadingHostels] = MiniReact.useState(true);
    const [formData, setFormData] = MiniReact.useState({
        preferredHostelId: '',
    });
    const [submitting, setSubmitting] = MiniReact.useState(false);
    const [error, setError] = MiniReact.useState(null);
    const [successMessage, setSuccessMessage] = MiniReact.useState(null);

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
                try { errorData = await response.json(); } catch (e) { /* ignore */ }
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
             if (response.status === 204) return null;
            const data = await response.json();
            if (data.success === false) throw new Error(data.message || 'API request failed');
            return data.data || data;
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError(err.message || "An unexpected error occurred.");
            throw err;
        }
    };

    // --- Fetch available hostels 
    MiniReact.useEffect(() => {
        const fetchHostels = async () => {
            setLoadingHostels(true);
            setError(null);
            try {
                // Fetch
                const hostels = await apiFetch('http://localhost:8081/api/api/hostel/hostels');
                const available = (hostels || []).filter(h => h.capacity > h.occupancy);
                setAvailableHostels(available);
            } catch (err) {
                setError("Could not load hostel list. Please try again later.");
                setAvailableHostels([]);
            } finally {
                setLoadingHostels(false);
            }
        };
        fetchHostels();
    }, []);

    // --- Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentIndex) { // Check the prop value
            setError("Critical error: Student information is missing. Cannot submit.");
            return;
        }
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        const payload = {
            studentIndex: studentIndex, 
            preferredHostelId: formData.preferredHostelId ? parseInt(formData.preferredHostelId, 10) : null,
        };

        try {
            // 1. Check if the student already has an active application or assignment
            const checkUrl = `http://localhost:8081/api/api/hostel/check-application/student/${studentIndex}`;
            const hasExistingResult = await apiFetch(checkUrl);

            // Adjust check based on expected API response structure
            if (hasExistingResult && hasExistingResult.hasActive === true) {
                 throw new Error("You already have an active hostel application or have been assigned a hostel.");
            }

            // 2. Submit the new application
            const applicationUrl = 'http://localhost:8081/api/api/hostel/applications';
            await apiFetch(applicationUrl, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setSuccessMessage("Application submitted successfully! You will be notified of the outcome.");
            setTimeout(onClose, 2500);

        } catch (err) {
            setError(`Submission failed: ${err.message}`);
             console.error("Application submission error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // --- Styles
    const styles = {
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
        },
        noteField: {
            minHeight: '100px'
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.spacing.md,
            marginTop: theme.spacing.lg
        },
        errorMessage: {
            color: theme.colors.error,
            marginBottom: theme.spacing.md
        }
    };

    // --- Render
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Apply for Hostel Accommodation',
            children: [
                 error && { type: 'p', props: { style: styles.errorText, children: [error] } },
                 successMessage && { type: 'p', props: { style: styles.successText, children: [successMessage] } },
                {
                    type: 'form',
                    props: {
                        style: styles.form,
                        onSubmit: handleSubmit,
                        children: [
                             // Display which student is applying (using the prop)
                             { type: 'p', props: { style: styles.applyingAsText, children: [`Applying as Student Index: ${studentIndex}`] } },
                             { type: 'p', props: { style: styles.infoText, children: ['Select a preferred hostel if you have one. If not, leave it as "No Preference".']}},
                             {
                                type: Select,
                                props: {
                                    label: 'Preferred Hostel (Optional)',
                                    value: formData.preferredHostelId,
                                    onChange: (e) => setFormData({...formData, preferredHostelId: e.target.value}),
                                    disabled: loadingHostels || submitting,
                                    options: [
                                        { value: '', label: loadingHostels ? 'Loading Hostels...' : 'No Preference' },
                                        ...availableHostels.map(h => ({
                                            value: h.hostelId,
                                            label: `${h.name} (${h.gender}, Vacancy: ${h.capacity - h.occupancy})`
                                        }))
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: styles.buttonContainer,
                                    children: [
                                        { type: Button, props: { variant: 'secondary', onClick: onClose, children: 'Cancel', disabled: submitting }},
                                        { type: Button, props: { type: 'submit', children: submitting ? 'Submitting...' : 'Submit Application', disabled: submitting || loadingHostels }}
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

window.ApplyForHostel = ApplyForHostel;