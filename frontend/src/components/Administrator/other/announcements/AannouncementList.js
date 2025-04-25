// components/Administrator/other/announcements/AnnouncementList.js
const AannouncementList = () => {
    const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
    const [showEditModal, setShowEditModal] = MiniReact.useState(false);
    const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = MiniReact.useState(null);

    const announcements = [
        {
            id: 1,
            title: 'Welcome to the course!',
            content: 'Welcome message for the course',
            course: 'Data Structures and Algorithm',
            date: 'Mar 9',
            time: '02:30 PM',
            targetAudience: ['Students', 'Teachers']
        },
        {
            id: 2,
            title: 'Lecture schedule updated',
            content: 'Schedule has been updated',
            course: 'Data Structures and Algorithm',
            date: 'Mar 9',
            time: '10:15 AM',
            targetAudience: ['Students']
        }
    ];

    const handleEdit = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowEditModal(true);
    };

    const handleDelete = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        console.log('Deleting announcement:', selectedAnnouncement);
        setShowDeleteModal(false);
    };

    return {
        type: 'div',
        props: {
            children: [
                // Main Content Card
                {
                    type: Card,
                    props: {
                        variant: 'elevated',
                        children: [
                            // Header Section with Title
                            {
                                type: Card,
                                props: {
                                    variant: 'ghost',
                                    noPadding: true,
                                    children: [
                                        {
                                            type: 'h1',
                                            props: {
                                                style: { marginBottom: theme.spacing.md },
                                                children: ['Announcements']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Announcements List Card
                {
                    type: Card,
                    props: {
                        children: [
                            // Header Section with Title and Add Button
                            {
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
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: theme.spacing.lg
                                                },
                                                children: [
                                                    {
                                                        type: 'h2',
                                                        props: {
                                                            children: ['Announcement Details']
                                                        }
                                                    },
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: () => setShowCreateModal(true),
                                                            children: '+ Add New Announcement'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },

                            // Announcements Table
                            {
                                type: Table,
                                props: {
                                    headers: ['Title', 'Course', 'Date', 'Time', 'Target Audience', 'Actions'],
                                    data: announcements.map(announcement => ({
                                        'Title': announcement.title,
                                        'Course': announcement.course,
                                        'Date': announcement.date,
                                        'Time': announcement.time,
                                        'Target Audience': announcement.targetAudience.join(', '),
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
                                                                        onClick: () => handleEdit(announcement),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Edit'
                                                                    }
                                                                },
                                                                {
                                                                    type: Button,
                                                                    props: {
                                                                        onClick: () => handleDelete(announcement),
                                                                        variant: 'secondary',
                                                                        size: 'small',
                                                                        children: 'Delete'
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },

                // Modals
                showCreateModal && {
                    type: CreateAnnouncement,
                    props: {
                        onClose: () => setShowCreateModal(false)
                    }
                },
                showEditModal && {
                    type: EditAnnouncement,
                    props: {
                        announcement: selectedAnnouncement,
                        onClose: () => setShowEditModal(false)
                    }
                },
                showDeleteModal && {
                    type: DeleteAnnouncement,
                    props: {
                        onClose: () => setShowDeleteModal(false),
                        onConfirm: handleDeleteConfirm
                    }
                }
            ]
        }
    };
};

window.AannouncementList = AannouncementList;