// components/teacher/profile/CourseProfile.js
const TeacherCourseProfile = () => {
    const courses = [
        { name: "Course 01", code: "1234", year: "2nd Year" },
        { name: "Course 05", code: "2145", year: "1st Year" },
        { name: "Course 03", code: "2136", year: "1st Year" },
        { name: "Course 07", code: "3125", year: "4th Year" }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Course Profile']
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Course', 'Code', 'Year'],
                        data: courses.map(course => ({
                            Course: course.name,
                            Code: course.code,
                            Year: course.year
                        }))
                    }
                }
            ]
        }
    };
};

window.TeacherCourseProfile = TeacherCourseProfile;