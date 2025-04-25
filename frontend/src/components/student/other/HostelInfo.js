// components/student/other/HostelInfo.js
const HostelInfo = () => {
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
            ]
        }
    });

    return {
        type: Card,
        props: {
            style: styles.container,
            children: [
                {
                    type: Card,
                    props: {
                        variant: 'ghost',
                        children: [
                            {
                                type: 'h1',
                                props: {
                                    children: ['Hostel Information']
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        style: styles.blockGrid,
                        children: hostelBlocks.map(renderBlockCard)
                    }
                }
                
            ]
        }
    };
};

window.HostelInfo = HostelInfo;