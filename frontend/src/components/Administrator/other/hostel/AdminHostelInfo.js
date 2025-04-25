// components/student/other/HostelInfo.js
const AdminHostelInfo = () => {
    const hostelBlocks = [
        {
            name: 'Block G',
            rooms: 6,
            occupancy: 30,
            vacancy: 10,
            gender: 'Female',
            assistant: 'Jane Smith',
            facilities: {
                wifi: true,
                kitchen: false,
                laundry: true,
                ac: false,
                studyArea: true
            }
        },
        {
            name: 'Block H',
            rooms: 6,
            occupancy: 30,
            vacancy: 10,
            gender: 'Female',
            assistant: 'Jane Smith',
            facilities: {
                wifi: false,
                kitchen: false,
                laundry: false,
                ac: false,
                studyArea: false
            }
        },
        {
            name: 'Block J',
            rooms: 6,
            occupancy: 30,
            vacancy: 10,
            gender: 'Female',
            assistant: 'Jane Smith',
            facilities: {
                wifi: true,
                kitchen: false,
                laundry: true,
                ac: false,
                studyArea: true
            }
        },
        {
            name: 'Block k',
            rooms: 6,
            occupancy: 30,
            vacancy: 10,
            gender: 'Female',
            assistant: 'Jane Smith',
            facilities: {
                wifi: true,
                kitchen: true,
                laundry: true,
                ac: true,
                studyArea: true
            }
        }
    ];

    const [editingBlock, setEditingBlock] = MiniReact.useState(null);
    const [showAddStudentModal, setShowAddStudentModal] = MiniReact.useState(false);

    const handleEditClick = (block) => {
        setEditingBlock(block);
    };

    const handleSaveEdit = (blockName, updatedData) => {
        try {
            // Create a new array with the updated block data
            const updatedBlocks = hostelBlocks.map(block => {
                if (block.name === blockName) {
                    // Return a new object with the updated data
                    return {
                        ...block,
                        rooms: updatedData.rooms,
                        occupancy: updatedData.occupancy,
                        vacancy: updatedData.vacancy,
                        gender: updatedData.gender,
                        assistant: updatedData.assistant,
                        facilities: updatedData.facilities
                    };
                }
                return block;
            });
            
            // Update the state with the new array
            setHostelBlocks(updatedBlocks);
            
            // Close the edit modal
            setEditingBlock(null);
            
            console.log(`Updated ${blockName} with new data:`, updatedData);
        } catch (error) {
            console.error("Error updating hostel block:", error);
        }
    };

    const styles = {
        container: {
            padding: theme.spacing.lg
        },
        blockGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: theme.spacing.lg
        },
        blockName: {
            fontSize: theme.typography.h2.fontSize,
            fontWeight: 'bold',
            marginBottom: theme.spacing.md,
            textAlign: 'center'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm
        },
        infoValue: {
            fontWeight: 'bold',
        },
        facilitiesTitle: {
            fontSize: theme.typography.h3.fontSize,
            fontWeight: 'bold',
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm
        },
        editButton: {
            marginTop: theme.spacing.lg,

        }
    };

    const renderFacilityRow = (label, value) => ({
        type: 'div',
        props: {
            style: styles.infoRow,
            children: [
                {
                    type: 'span',
                    props: {
                        children: [label]
                    }
                },
                {
                    type: 'span',
                    props: {
                        children: [value ? 'Yes' : 'No']
                    }
                }
            ]
        }
    });

    const renderInfoRow = (label, value) => ({
        type: 'div',
        props: {
            style: styles.infoRow,
            children: [
                {
                    type: 'span',
                    props: {
                        style: styles.infoLabel,
                        children: [`${label} :`]
                    }
                },
                {
                    type: 'span',
                    props: {
                        style: styles.infoValue,
                        children: [value]
                    }
                }
            ]
        }
    });

    const renderBlockCard = (block) => ({
        type: Card,
        props: {
            variant: 'outlined',
            children: [
                {
                    type: 'div',
                    props: {
                        style: styles.blockName,
                        children: [block.name]
                    }
                },
                renderInfoRow('Number of Rooms', block.rooms),
                renderInfoRow('Occupancy', block.occupancy),
                renderInfoRow('Vacancy', block.vacancy),
                renderInfoRow('Gender', block.gender),
                renderInfoRow('Assistant', block.assistant),
                {
                    type: 'div',
                    props: {
                        style: styles.facilitiesTitle,
                        children: ['Facilities']
                    }
                },
                renderFacilityRow('WiFi', block.facilities.wifi),
                renderFacilityRow('Kitchen', block.facilities.kitchen),
                renderFacilityRow('Laundry', block.facilities.laundry),
                renderFacilityRow('AC', block.facilities.ac),
                renderFacilityRow('Study Area', block.facilities.studyArea),
                {
                    type: Button,
                    props: {
                        style: styles.editButton,
                        variant: 'primary',
                        children: 'Edit',
                        onClick: () => handleEditClick(block)
                    }
                }
            ]
        }
    });

    return {
        type: Card,
        props: {
            style: styles.container,
            children: [
                {
                    type: 'h1',
                    props: {
                        variant: 'ghost',
                        children: ['Hostel Managment']
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            //alignItems: 'center',
                            marginBottom: theme.spacing.lg
                        },
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Hostel Details']
                                }
                            },
                            {
                                type: Button,
                                props: {
                                    onClick: () => setShowAddStudentModal(true),
                                    children: '+ Admit Student '
                                }
                            }
                        ]
                    }
                },
                // {
                //     type: Button,
                //     props: {
                //         onClick: () => setShowAddStudentModal(true),
                //         children: '+ Add new student to hostel'
                //     }
                // },
                {
                    type: 'div',
                    props: {
                        style: styles.blockGrid,
                        children: hostelBlocks.map(renderBlockCard)
                    }
                },
                editingBlock && {
                    type: HostelEdit,
                    props: {
                        block: editingBlock,
                        onClose: () => setEditingBlock(null),
                        onSave: handleSaveEdit
                    }
                },
                showAddStudentModal && {
                    type: AddStudentToHostel,
                    props: {
                        onClose: () => setShowAddStudentModal(false)
                    }
                }
            ]
        }
    };
};

window.AdminHostelInfo = AdminHostelInfo;