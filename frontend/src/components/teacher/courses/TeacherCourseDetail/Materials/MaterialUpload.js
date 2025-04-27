// components/teacher/courses/TeacherCourseDetail/Materials/MaterialUpload.js
const MaterialUpload = () => {
    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Upload Study Material']
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Title",
                        placeholder: "Enter the title of your study material"
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Description",
                        placeholder: "Write a description of your Study material",
                        multiline: true
                    }
                },
                {
                    type: Button,
                    props: {
                        children: ['Add a file']
                    }
                },
                {
                    type: Button,
                    props: {
                        children: ['Submit']
                    }
                },
                {
                    type: Button,
                    props: {
                        variant: 'secondary',
                        children: ['Cancel']
                    }
                }
            ]
        }
    };
};

window.MaterialUpload = MaterialUpload;