// // components/courses/CourseCard.js
// const CourseCard = ({ course, onClick }) => {
//     const styles = {
//         card: {
//             cursor: 'pointer',
//             transition: 'transform 0.2s',
//             ':hover': {
//                 transform: 'translateY(-4px)'
//             }
//         },
//         title: {
//             fontSize: theme.typography.h3.fontSize,
//             fontWeight: 'bold',
//             marginBottom: theme.spacing.sm,
//             color: theme.colors.primary
//         },
//         code: {
//             fontSize: theme.typography.caption.fontSize,
//             color: theme.colors.textSecondary,
//             marginBottom: theme.spacing.md
//         },
//         meta: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             fontSize: theme.typography.body2.fontSize,
//             color: theme.colors.textSecondary
//         }
//     };

//     return {
//         type: Card,
//         props: {
//             style: styles.card,
//             onclick: () => onClick(course.id),
//             children: [
//                 {
//                     type: 'h3',
//                     props: {
//                         style: styles.title,
//                         children: [course.title]
//                     }
//                 },
//                 {
//                     type: 'div',
//                     props: {
//                         style: styles.code,
//                         children: [course.code]
//                     }
//                 },
//                 {
//                     type: 'div',
//                     props: {
//                         style: styles.meta,
//                         children: [
//                             {
//                                 type: 'span',
//                                 props: {
//                                     children: [`Credits: ${course.credits}`]
//                                 }
//                             },
//                             {
//                                 type: 'span',
//                                 props: {
//                                     children: [`${course.type}`]
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     };
// };
// window.CourseCard = CourseCard;