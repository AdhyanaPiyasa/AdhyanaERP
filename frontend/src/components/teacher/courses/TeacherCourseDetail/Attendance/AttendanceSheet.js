// components/teacher/courses/TeacherCourseDetail/Attendance/AttendanceSheet.js
const AttendanceSheet = () => {
    const students = [
        { id: 1, name: "Student 1", attendance: "present" },
        { id: 2, name: "Student 2", attendance: "absent" },
        { id: 3, name: "Student 3", attendance: "present" },
        { id: 4, name: "Student 4", attendance: "present" },
        { id: 5, name: "Student 5", attendance: "absent" }
    ];

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'div',
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Attendance']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Student', 'Status'],
                                    data: students.map(student => ({
                                        Student: student.name,
                                        Status: {
                                            type: Select,
                                            props: {
                                                value: student.attendance,
                                                options: [
                                                    { value: 'present', label: 'Present' },
                                                    { value: 'absent', label: 'Absent' }
                                                ]
                                            }
                                        }
                                    }))
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    children: ['Submit Attendance']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    variant: 'secondary',
                                    children: ['Reset Form']
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.AttendanceSheet = AttendanceSheet;