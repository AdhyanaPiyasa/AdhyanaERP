// components/teacher/courses/TeacherCourseDetail/StudentList/StudentList.js
const StudentList = () => {
    const students = [
        {
            name: "Student 1",
            degree: "Computer Science",
            indexNumber: "11334567",
            registrationNumber: "2025/CS/234",
            email: "student@gmail.com",
            mobileNumber: "0771122330"
        },
        {
            name: "Student 02",
            degree: "Computer Science",
            indexNumber: "11334567",
            registrationNumber: "2025/CS/234",
            email: "student@gmail.com",
            mobileNumber: "0771122330"
        }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Students details']
                    }
                },
                {
                    type: TextField,
                    props: {
                        placeholder: "Search Student"
                    }
                },
                {
                    type: Table,
                    props: {
                        headers: ['Name', 'Degree', 'Index number', 'Registration number', 'Email', 'Mobile number'],
                        data: students
                    }
                }
            ]
        }
    };
};

window.StudentList = StudentList;