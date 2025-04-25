// components/Administrator/other/announcements/DeleteAnnouncement.js
const DeleteAnnouncement = ({ onClose, onConfirm }) => {
    return {
        type: Modal,
        props: {
            isOpen: true,
            onClose: onClose,
            title: 'Delete Announcement',
            children: [
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'p',
                                props: {
                                    children: ['Are you sure you want to delete this announcement? This action cannot be undone.']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' },
                                    children: [
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: onClose,
                                                children: 'Cancel'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: onConfirm,
                                                children: 'Delete'
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

window.DeleteAnnouncement = DeleteAnnouncement;