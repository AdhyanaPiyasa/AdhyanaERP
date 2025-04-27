// components/student/announcements/AnnouncementView.js
const AnnouncementView = () => {
    const [announcements, setAnnouncements] = MiniReact.useState([
        {
            id: 1,
            title: "End of Semester Examination Schedule",
            content: "The end of semester examination will begin on June 15th. Please check your personal timetable for exact dates and venues. All students must bring their student ID cards to the examination hall.",
            date: "2025-04-20",
            time: "09:30 AM",
            category: "Academic",
            isRead: false
        },
        {
            id: 2,
            title: "Campus Maintenance Notice",
            content: "The west wing of the library will be closed for renovations from April 25th to May 5th. Alternative study spaces will be available in the Student Center.",
            date: "2025-04-18",
            time: "02:15 PM",
            category: "Campus",
            isRead: true
        },
        {
            id: 3,
            title: "Scholarship Applications Now Open",
            content: "Applications for the annual merit scholarship are now open. Eligible students must have a GPA of at least 3.5. The deadline for submission is May 10th.",
            date: "2025-04-15",
            time: "11:00 AM",
            category: "Financial",
            isRead: false
        },
        {
            id: 4,
            title: "Student Council Elections",
            content: "Nominations for Student Council positions are now open. If you're interested in running for a position, please submit your nomination form by May 5th.",
            date: "2025-04-10",
            time: "03:45 PM",
            category: "Student Life",
            isRead: true
        },
        {
            id: 5,
            title: "Career Fair Next Week",
            content: "The annual Career Fair will be held on April 30th in the Main Hall from 10 AM to 4 PM. Over 50 companies will be present. Bring your resume and dress professionally.",
            date: "2025-04-05",
            time: "10:20 AM",
            category: "Career",
            isRead: true
        }
    ]);

    const [selectedAnnouncement, setSelectedAnnouncement] = MiniReact.useState(null);
    const [activeCategory, setActiveCategory] = MiniReact.useState('All');
    const [searchTerm, setSearchTerm] = MiniReact.useState('');

    const styles = {
        container: {
            padding: theme.spacing.lg,
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        title: {
            fontSize: theme.typography.h1.fontSize,
            fontWeight: 'bold',
            color: theme.colors.primary
        },
        searchBar: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
        },
        searchInput: {
            width: '300px',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
            fontSize: theme.typography.body1.fontSize
        },
        categoryFilters: {
            display: 'flex',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            flexWrap: 'wrap'
        },
        categoryButton: {
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        activeCategory: {
            backgroundColor: theme.colors.primary,
            color: 'white'
        },
        inactiveCategory: {
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`
        },
        contentGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: theme.spacing.xl,
            height: '600px'
        },
        announcementList: {
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            paddingRight: theme.spacing.md,
            height: '100%'
        },
        announcementCard: {
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: 'white'
        },
        selectedCard: {
            borderLeft: `4px solid ${theme.colors.primary}`,
            backgroundColor: `${theme.colors.primary}10`
        },
        unreadCard: {
            borderLeft: `4px solid ${theme.colors.primary}`
        },
        announcementHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm
        },
        announcementTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            color: theme.colors.textPrimary
        },
        announcementDate: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.colors.textSecondary
        },
        announcementMeta: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: theme.typography.body2.fontSize,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.sm
        },
        importantBadge: {
            backgroundColor: theme.colors.error,
            color: 'white',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.caption.fontSize,
            fontWeight: 'bold'
        },
        category: {
            backgroundColor: theme.colors.background,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.caption.fontSize
        },
        announcementPreview: {
            fontSize: theme.typography.body2.fontSize,
            color: theme.colors.textSecondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
        },
        detailView: {
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.xl,
            backgroundColor: 'white',
            height: '100%',
            overflowY: 'auto'
        },
        detailHeader: {
            borderBottom: `1px solid ${theme.colors.border}`,
            paddingBottom: theme.spacing.lg,
            marginBottom: theme.spacing.lg
        },
        detailTitle: {
            fontSize: theme.typography.h2.fontSize,
            fontWeight: 'bold',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm
        },
        detailMeta: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: theme.typography.body2.fontSize,
            color: theme.colors.textSecondary
        },
        detailContent: {
            fontSize: theme.typography.body1.fontSize,
            lineHeight: '1.6',
            color: theme.colors.textPrimary
        },
        noResultsMsg: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: theme.typography.body1.fontSize,
            color: theme.colors.textSecondary
        },
        emptyDetailView: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: theme.typography.body1.fontSize,
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md
        }
    };

    // Filter announcements based on category and search term
    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesCategory = activeCategory === 'All' || announcement.category === activeCategory;
        const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Mark announcement as read when clicked
    const handleAnnouncementClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        
        // Mark as read if it's unread
        if (!announcement.isRead) {
            const updatedAnnouncements = announcements.map(item => 
                item.id === announcement.id ? {...item, isRead: true} : item
            );
            setAnnouncements(updatedAnnouncements);
        }
    };

    return {
        type: 'div',
        props: {
            style: styles.container,
            children: [
                // Header Section
                {
                    type: 'div',
                    props: {

                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Announcements']
                                }
                            }
                        ]
                    }
                },
                             
                // Main Content Grid (List + Detail View)
                {
                    type: 'div',
                    props: {
                        style: styles.contentGrid,
                        children: [
                            // Announcement List
                            {
                                type: 'div',
                                props: {
                                    style: styles.announcementList,
                                    children: filteredAnnouncements.length > 0 
                                        ? filteredAnnouncements.map(announcement => ({
                                            type: 'div',
                                            props: {
                                                style: {
                                                    ...styles.announcementCard,
                                                    ...(selectedAnnouncement?.id === announcement.id ? styles.selectedCard : {}),
                                                    ...(!announcement.isRead ? styles.unreadCard : {})
                                                },
                                                onclick: () => handleAnnouncementClick(announcement),
                                                children: [
                                                    // Announcement Header (Title + Date)
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: styles.announcementHeader,
                                                            children: [
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: styles.announcementTitle,
                                                                        children: [announcement.title]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    // Announcement Meta (Important Badge + Category)
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: styles.announcementMeta,
                                                            children: [
                                                                {
                                                                    type: 'div',
                                                                    props: {
                                                                        style: styles.announcementDate,
                                                                        children: [formatDate(announcement.date) + " • " + announcement.time]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    // Announcement Preview
                                                    {
                                                        type: 'div',
                                                        props: {
                                                            style: styles.announcementPreview,
                                                            children: [announcement.content]
                                                        }
                                                    }
                                                ]
                                            }
                                        }))
                                        : {
                                            type: 'div',
                                            props: {
                                                style: styles.noResultsMsg,
                                                children: ['No announcements found']
                                            }
                                        }
                                }
                            },
                            
                            // Detail View
                            selectedAnnouncement 
                                ? {
                                    type: 'div',
                                    props: {
                                        style: styles.detailView,
                                        children: [
                                            // Detail Header
                                            {
                                                type: 'div',
                                                props: {
                                                    style: styles.detailHeader,
                                                    children: [
                                                        // Title
                                                        {
                                                            type: 'div',
                                                            props: {
                                                                style: styles.detailTitle,
                                                                children: [selectedAnnouncement.title]
                                                            }
                                                        },
                                                        // Meta Information
                                                        {
                                                            type: 'div',
                                                            props: {
                                                                style: styles.detailMeta,
                                                                children: [
                                                                    {
                                                                        type: 'div',
                                                                        props: {
                                                                            children: [formatDate(selectedAnnouncement.date) + " • " + selectedAnnouncement.time]
                                                                        }
                                                                    },
                                                                    {
                                                                        type: 'div',
                                                                        props: {
                                                                            style: {
                                                                                display: 'flex',
                                                                                gap: theme.spacing.sm
                                                                            },
                                                                            children: [
                                                                                selectedAnnouncement.isImportant && {
                                                                                    type: 'span',
                                                                                    props: {
                                                                                        style: styles.importantBadge,
                                                                                        children: ['IMPORTANT']
                                                                                    }
                                                                                }
                                                                            ].filter(Boolean)
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            // Detail Content
                                            {
                                                type: 'div',
                                                props: {
                                                    style: styles.detailContent,
                                                    children: [selectedAnnouncement.content]
                                                }
                                            }
                                        ]
                                    }
                                }
                                : {
                                    type: 'div',
                                    props: {
                                        style: styles.emptyDetailView,
                                        children: ['Select an announcement to view details']
                                    }
                                }
                        ]
                    }
                }
            ]
        }
    };
};

window.AnnouncementView = AnnouncementView;