// // components/teacher/courses/TeacherCourseDetail/Attendance/AttendanceRecords.js
// const AttendanceRecords = ({ courseId, onBack }) => {
//     // Mock attendance record data - this would normally come from your backend
//     const [records, setRecords] = MiniReact.useState([
//         { date: '05/06/2025', percentage: 85 },
//         { date: '05/06/2025', percentage: 65 },
//         { date: '05/06/2025', percentage: 50 },
//         { date: '05/06/2025', percentage: 20 },
//         { date: '05/06/2025', percentage: 30 },
//         { date: '05/06/2025', percentage: 85 }
//     ]);

//     return {
//         type: 'div',
//         props: {
//             children: [
//                 // Header with back button
//                 {
//                     type: 'div',
//                     props: {
//                         style: {
//                             display: 'flex',
//                             alignItems: 'center',
//                             marginBottom: theme.spacing.lg
//                         },
//                         children: [
//                             {
//                                 type: Button,
//                                 props: {
//                                     onClick: onBack,
//                                     variant: 'secondary',
//                                     children: '← Back'
//                                 }
//                             },
//                             {
//                                 type: 'h2',
//                                 props: {
//                                     style: {
//                                         marginLeft: theme.spacing.lg
//                                     },
//                                     children: ['Attendance Records']
//                                 }
//                             }
//                         ]
//                     }
//                 },
//                 // Records table
//                 {
//                     type: Table,
//                     props: {
//                         headers: ['Date', 'Attendance percentage'],
//                         data: records.map(record => ({
//                             'Date': record.date,
//                             'Attendance percentage': record.percentage.toString()
//                         }))
//                     }
//                 }
//             ]
//         }
//     };
// };

// window.AttendanceRecords = AttendanceRecords;