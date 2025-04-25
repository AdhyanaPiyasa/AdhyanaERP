// // components/Admin/exams/ExamList.js
// const ExamList = () => {
//     const [showCreateModal, setShowCreateModal] = MiniReact.useState(false);
//     const [showEditModal, setShowEditModal] = MiniReact.useState(false);
//     const [showDeleteModal, setShowDeleteModal] = MiniReact.useState(false);
//     const [selectedExam, setSelectedExam] = MiniReact.useState(null);

//     const exams = [
//         {
//             course: 'Course1',
//             courseCode: '2210',
//             date: 'May 11',
//             startTime: '8:00 AM',
//             endTime: '9:45 AM',
//             room: 'Auditorium',
//             teacher: 'Dr. Jane Smith'
//         }
//     ];

//     const quickLinks = [
//         { title: 'Check room Assignments', link: '/exams/room-assignments' },
//         { title: 'Create Exams', link: '/exams/create' },
//         { title: 'Generate Final Timetable', link: '/exams/timetable' }
//     ];

//     const handleEdit = (exam) => {
//         setSelectedExam(exam);
//         setShowEditModal(true);
//     };

//     const handleDelete = (exam) => {
//         setSelectedExam(exam);
//         setShowDeleteModal(true);
//     };

//     return {
//         type: 'div',
//         props: {
//             children: [
//                 {
//                     type: 'div',
//                     props: {
//                         children: [
//                             {
//                                 type: 'h2',
//                                 props: {
//                                     children: ['Exams']
//                                 }
//                             },
//                             {
//                                 type: 'div',
//                                 props: {
//                                     children: quickLinks.map(link => ({
//                                         type: Card,
//                                         props: {
//                                             onClick: () => navigation.navigate(link.link),
//                                             children: [{
//                                                 type: 'h3',
//                                                 props: {
//                                                     children: [link.title]
//                                                 }
//                                             }]
//                                         }
//                                     }))
//                                 }
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     type: Card,
//                     props: {
//                         children: [
//                             {
//                                 type: 'h2',
//                                 props: {
//                                     children: ['Final Exam Schedule']
//                                 }
//                             },
//                             {
//                                 type: Button,
//                                 props: {
//                                     onClick: () => setShowCreateModal(true),
//                                     children: 'Create Exam'
//                                 }
//                             },
//                             {
//                                 type: Table,
//                                 props: {
//                                     headers: ['Course', 'Code', 'Date', 'Start Time', 'End Time', 'Room', 'Teacher', ''],
//                                     data: exams.map(exam => ({
//                                         ...exam,
//                                         actions: {
//                                             type: 'div',
//                                             props: {
//                                                 style: {
//                                                     display: 'flex',
//                                                     gap: theme.spacing.sm
//                                                 },
//                                                 children: [
//                                                     {
//                                                         type: Button,
//                                                         props: {
//                                                             variant: 'secondary',
//                                                             onClick: () => handleEdit(exam),
//                                                             size: 'small',
//                                                             children: 'Edit'
//                                                         }
//                                                     },
//                                                     {
//                                                         type: Button,
//                                                         props: {
//                                                             variant: 'secondary',
//                                                             onClick: () => handleDelete(exam),
//                                                             size: 'small',
//                                                             children: 'Delete'
//                                                         }
//                                                     }
//                                                 ]
//                                             }
//                                         }
//                                     }))
//                                 }
//                             }

//                         ]
//                     }
//                 },
//                 showCreateModal && {
//                     type: CreateExam,
//                     props: {
//                         onClose: () => setShowCreateModal(false)
//                     }
//                 },
//                 showEditModal && {
//                     type: EditExam,
//                     props: {
//                         exam: selectedExam,
//                         onClose: () => setShowEditModal(false)
//                     }
//                 },
//                 showDeleteModal && {
//                     type: DeleteConfirmation,
//                     props: {
//                         onClose: () => setShowDeleteModal(false),
//                         onConfirm: () => {
//                             console.log('Deleting exam:', selectedExam);
//                             setShowDeleteModal(false);
//                         }
//                     }
//                 }
//             ]
//         }
//     };
// };

// window.ExamList = ExamList;