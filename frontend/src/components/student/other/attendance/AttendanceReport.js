// // components/other/attendance/AttendanceReport.js
// const AttendanceReport = () => {
//     const report = {
//         totalClasses: 45,
//         attendedClasses: 38,
//         percentage: 84.4,
//         subjectWise: [
//             {
//                 subject: "Data Structures",
//                 total: 15,
//                 attended: 13,
//                 percentage: 86.7
//             },
//             {
//                 subject: "Database Systems",
//                 total: 15,
//                 attended: 12,
//                 percentage: 80.0
//             },
//             {
//                 subject: "Web Development",
//                 total: 15,
//                 attended: 13,
//                 percentage: 86.7
//             }
//         ]
//     };

//     const renderStatCard = (value, label) => ({
//         type: Card,
//         props: {
//             variant: 'outlined',
//             children: [
//                 {
//                     type: 'div',
//                     props: {
//                         children: [value]
//                     }
//                 },
//                 {
//                     type: 'div',
//                     props: {
//                         children: [label]
//                     }
//                 }
//             ]
//         }
//     });

//     const renderSummaryCards = () => [
//         renderStatCard(`${report.percentage}%`, 'Overall Attendance'),
//         renderStatCard(report.attendedClasses, 'Classes Attended'),
//         renderStatCard(report.totalClasses, 'Total Classes')
//     ];

//     return {
//         type: Card,
//         props: {
//             children: [
                
//                 {
//                     type: 'h2',
//                     props: {
//                         children: ['Attendance Report']
//                     }
//                 },
//                 {
//                     type: Card,
//                     props: {
//                         variant: 'outlined',
//                         children: renderSummaryCards()
//                     }
//                 },
//                 {
//                     type: Card,
//                     props: {
//                         variant: 'outlined',
//                         children: [
//                             {
//                                 type: 'h3',
//                                 props: {
//                                     children: ['Subject-wise Attendance']
//                                 }
//                             },
//                             {
//                                 type: Table,
//                                 props: {
//                                     headers: ['Subject', 'Total Classes', 'Attended', 'Percentage'],
//                                     data: report.subjectWise.map(subject => ({
//                                         Subject: subject.subject,
//                                         'Total Classes': subject.total,
//                                         Attended: subject.attended,
//                                         Percentage: `${subject.percentage}%`
//                                     }))
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     };
// };

// window.AttendanceReport = AttendanceReport;