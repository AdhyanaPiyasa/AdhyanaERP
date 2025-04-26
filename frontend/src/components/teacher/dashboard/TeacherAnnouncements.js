// components/teacher/dashboard/TeacherAnnouncements.js
const TeacherAnnouncements = () => {
    const announcements = [
        {
            id: 1,
            title: "Regarding Assignment1",
            date: "03-09-2024",
            time: "10:00am"
        },
        {
            id: 2,
            title: "Lecture schedule",
            date: "03-09-2024",
            time: "10:00am"
        }
    ];

    const [showAddModal, setShowAddModal] = MiniReact.useState(false);

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Notices']
                    }
                },
                {
                    type: Button,
                    props: {
                        onClick: () => setShowAddModal(true),
                        children: ['ADD']
                    }
                },
                ...announcements.map(announcement => ({
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'div',
                                props: {
                                    children: [announcement.title]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [`${announcement.date} ${announcement.time}`]
                                }
                            }
                        ]
                    }
                })),
                showAddModal && {
                    type: Modal,
                    props: {
                        isOpen: true,
                        onClose: () => setShowAddModal(false),
                        title: "Add Announcement",
                        children: [
                            {
                                type: TextField,
                                props: {
                                    label: "Announcement",
                                    multiline: true
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    children: ['Submit']
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.TeacherAnnouncements = TeacherAnnouncements;