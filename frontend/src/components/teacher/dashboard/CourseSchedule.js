// components/teacher/dashboard/CourseSchedule.js
const CourseSchedule = () => {
    const schedule = [
        {
            time: "08:00 - 10:00",
            monday: { code: "1205", name: "DSA", year: "2nd Year", hall: "Hall 01" },
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null
        },
        {
            time: "10:00 - 12:00",
            monday: null,
            tuesday: { code: "1304", name: "Software Engineering", year: "3rd Year", hall: "Hall02" },
            wednesday: null,
            thursday: null,
            friday: null
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Timetable']
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Time Slot', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        data: schedule
                    }
                },
                
                
                
            ]
        }
      
    };
};
window.CourseSchedule = CourseSchedule;