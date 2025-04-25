// components/teacher/courses/TeacherCourseDetail/StudentList/StudentDetails.js
const StudentDetails = () => {
    const studentData = {
        name: "Student 1",
        indexNumber: "11334567",
        registrationNumber: "2025/CS/234", 
        degree: "Computer Science",
        email: "student@gmail.com",
        mobileNumber: "0771122330",
        batch: "2025",
        courses: [
            { code: "1205", name: "Data Structures and Algorithm", year: "2nd Year" },
            { code: "1304", name: "Software Engineering", year: "3rd Year" }
        ],
        attendance: {
            present: 15,
            total: 20,
            percentage: "75%"
        },
        grades: [
            { assignment: "Assignment 1", grade: "A", feedback: "Good.Keep it well" },
            { assignment: "Quiz 1", grade: "A-", feedback: "Well done" }
        ]
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Student Information']
                    }
                },
                // Basic Information Section
                {
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Basic Information']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    data: [
                                        { field: 'Name', value: studentData.name },
                                        { field: 'Index Number', value: studentData.indexNumber },
                                        { field: 'Registration Number', value: studentData.registrationNumber },
                                        { field: 'Degree', value: studentData.degree },
                                        { field: 'Email', value: studentData.email },
                                        { field: 'Mobile Number', value: studentData.mobileNumber },
                                        { field: 'Batch', value: studentData.batch }
                                    ]
                                }
                            }
                        ]
                    }
                },
                // Attendance Section
                {
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Attendance']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    data: [
                                        { field: 'Present Days', value: studentData.attendance.present },
                                        { field: 'Total Days', value: studentData.attendance.total },
                                        { field: 'Percentage', value: studentData.attendance.percentage }
                                    ]
                                }
                            }
                        ]
                    }
                },
                // Grades Section
                {
                    type: Card,
                    props: {
                        variant: 'outlined',
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Grades']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Assignment', 'Grade', 'Feedback'],
                                    data: studentData.grades
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.StudentDetails = StudentDetails;