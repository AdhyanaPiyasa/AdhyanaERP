const EventList = ({ events = [] }) => {
    return {
        type: Table,
        props: {
            headers: ['Event Name', 'Date', 'Description'],
            data: events.map(event => ({
                'Event Name': event.title,
                'Date': event.date,
                'Description': event.description
            }))
        }
    };
};

window.EventList = EventList;