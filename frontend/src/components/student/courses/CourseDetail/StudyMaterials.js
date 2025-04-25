// components/courses/CourseDetail/StudyMaterials.js
const StudyMaterials = ({ courseId }) => {
    const [showModal, setShowModal] = MiniReact.useState(false);
    const [selectedMaterial, setSelectedMaterial] = MiniReact.useState(null);

    const materials = [
        {
            id: 1,
            title: "Lecture note 01",
            date: "03-09-2024",
            type: "PDF"
        },
        {
            id: 2,
            title: "Lecture note 02",
            date: "03-09-2024",
            type: "PDF"
        }
    ];

    const handleMaterialClick = (material) => {
        setSelectedMaterial(material);
        setShowModal(true);
    };

    const handleDownload = () => {
        // Handle download logic
        setShowModal(false);
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: Table,
                    props: {
                        headers: ['Title', 'Date', 'Type'],
                        data: materials,
                        onRowClick: handleMaterialClick
                    }
                },
                showModal && {
                    type: Modal,
                    props: {
                        isOpen: showModal,
                        onClose: () => setShowModal(false),
                        title: 'Download Material',
                        children: [
                            {
                                type: Card,
                                props: {
                                    variant: 'outlined',
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    `Title: ${selectedMaterial?.title}`,
                                                    {
                                                        type: Button,
                                                        props: {
                                                            onClick: handleDownload,
                                                            children: 'Download'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.StudyMaterials = StudyMaterials;