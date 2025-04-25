const AdministratorEventList = ({ events, onEditEvent, onDeleteEvent }) => {
    return {
        type: Table,
        props: {
            headers: ['Event Name', 'Date', 'Description', 'Actions'],
            data: events.map(event => ({
                'Event Name': event.title,
                'Date': event.date,
                'Description': event.description,
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
                                                onClick: () => onEditEvent(event),
                                                variant: 'secondary',
                                                size: 'small',
                                                children: 'Edit'
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => onDeleteEvent(event),
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
    };
};


window.AdministratorEventList = AdministratorEventList;