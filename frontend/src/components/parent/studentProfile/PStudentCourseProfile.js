// components/profile/CourseProfile.js
const PStudentCourseProfile = () => {
    const courseProfile = {
        currentSemester: {
            name: "Year 2 - Semester 1",
            courses: [
                {
                    code: "CS2101",
                    name: "Data Structures and Algorithm",
                    credits: 3,
                    type: "Core",
                    lecturer: "Dr. Smith"
                },
                {
                    code: "CS2102",
                    name: "Database Systems",
                    credits: 3,
                    type: "Core",
                    lecturer: "Dr. Johnson"
                },
                {
                    code: "CS2103",
                    name: "Web Development",
                    credits: 3,
                    type: "Elective",
                    lecturer: "Prof. Williams"
                }
            ]
        },
    };


    return {
        type: 'div',
        props: {
            children: [
                {
                    type: Card,
                    props: {
                        //style: styles.coursesContainer,
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    style: theme.title,
                                    children: ['Current Courses']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Course Code', 'Course Name', 'Credits', 'Type', 'Lecturer'],
                                    data: courseProfile.currentSemester.courses.map(course => ({
                                        'Course Code': course.code,
                                        'Course Name': course.name,
                                        'Credits': course.credits,
                                        'Type': course.type,
                                        'Lecturer': course.lecturer
                                    }))
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.PStudentCourseProfile = PStudentCourseProfile;