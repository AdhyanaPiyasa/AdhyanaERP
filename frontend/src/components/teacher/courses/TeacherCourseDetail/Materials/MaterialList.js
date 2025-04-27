// components/teacher/courses/TeacherCourseDetail/Materials/MaterialList.js
const MaterialList = () => {
    const [showAddModal, setShowAddModal] = MiniReact.useState(false);
    const [title, setTitle] = MiniReact.useState('');
    const [description, setDescription] = MiniReact.useState('');

    const renderAddModal = () => ({
        type: Modal,
        props: {
            isOpen: showAddModal,
            onClose: () => setShowAddModal(false),
            title: "Add Study Material",
            children: [
                {
                    type: TextField,
                    props: {
                        label: "Title",
                        placeholder: "Enter the title of your study material",
                        value: title,
                        onChange: (e) => setTitle(e.target.value)
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Description",
                        placeholder: "Write a description of your Study material",
                        multiline: true,
                        value: description,
                        onChange: (e) => setDescription(e.target.value)
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
                        onClick: () => setShowAddModal(false),
                        children: ['Submit']
                    }
                },
                {
                    type: Button,
                    props: {
                        variant: 'secondary',
                        onClick: () => setShowAddModal(false),
                        children: ['Cancel']
                    }
                }
            ]
        }
    });

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Study Materials']
                    }
                },
                {
                    type: Button,
                    props: {
                        onClick: () => setShowAddModal(true),
                        children: ['Add Material']
                    }
                },
                showAddModal && renderAddModal()
            ]
        }
    };
};

window.MaterialList = MaterialList;



