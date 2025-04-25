// components/teacher/courses/TeacherCourseList.js
const TeacherCourseList = () => {
    const courses = [
        {
            id: 1,
            code: "1205",
            name: "Data Structures and Algorithm",
            year: "2nd Year"
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: { children: ['My Courses'] }
                },
                ...courses.map(course => ({
                    type: Card,
                    props: {
                        variant: 'outlined',
                        onClick: () => navigation.navigate(`courses/${course.id}`), // Remove the leading slash
                        children: [
                            {
                                type: 'div',
                                props: {
                                    children: [course.name]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [`${course.code} • ${course.year}`]
                                }
                            }
                        ]
                    }
                }))
            ]
        }
    };
};
window.TeacherCourseList = TeacherCourseList;