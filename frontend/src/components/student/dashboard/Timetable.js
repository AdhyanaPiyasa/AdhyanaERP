// components/dashboard/Timetable.js
const Timetable = () => {
    const schedule = [
        {
            time: "09:00 AM",
            subject: "Data Structures",
            room: "Lab 01",
            type: "Lecture"
        },
        {
            time: "11:00 AM",
            subject: "Algorithms",
            room: "Room 203",
            type: "Tutorial"
        },
        {
            time: "02:00 PM",
            subject: "Database Systems",
            room: "Lab 03",
            type: "Practical"
        }
    ];

    const styles = {
        header: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.lg,
            color: theme.colors.textPrimary
        }
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        style: styles.header,
                        children: ['Today\'s Schedule']
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Time', 'Subject', 'Room', 'Type'],
                        data: schedule
                    }
                }
            ]
        }
    };
};

window.Timetable = Timetable;