// components/Admin/hostel/RoomInformation.js
const PHostelInfo = () => {
    const roomData = [
        { 
            Block: 'Block J',
            'Room Number': '101',
            Occupancy: '4',
            Vacancy: '2',
            Gender: 'Female',
            'Resident Assistant': 'Jane Smith'
        }
    ];

    const blockFacilities = [
        { Block: 'Block G', WIFi: true, Kitchen: false, Laundry: true, AC: false, 'Study Area': true },
        { Block: 'Block H', WIFi: true, Kitchen: true, Laundry: true, AC: false, 'Study Area': true },
        { Block: 'Block I', WIFi: true, Kitchen: false, Laundry: true, AC: false, 'Study Area': false },
        { Block: 'Block J', WIFi: true, Kitchen: true, Laundry: false, AC: true, 'Study Area': true }
    ];

    return {
        type: 'div',
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Hostel information']
                    }
                },
                // Room Information Table
                {
                    type: Card,
                    props: {
                        style: { marginBottom: '2rem' },
                        children: [
                            {
                                type: Table,
                                props: {
                                    headers: ['Block', 'Room Number', 'Occupancy', 'Vacancy', 'Gender', 'Resident Assistant'],
                                    data: roomData
                                }
                            }
                        ]
                    }
                },
                // Facilities Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Hostel Facilities'],
                                    style: { marginBottom: '1rem' }
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Block', 'WI-Fi', 'Kitchen', 'Laundry', 'AC', 'Study Area'],
                                    data: blockFacilities.map(facility => ({
                                        Block: facility.Block,
                                        'WI-Fi': facility.WIFi ? '✓' : '✗',
                                        Kitchen: facility.Kitchen ? '✓' : '✗',
                                        Laundry: facility.Laundry ? '✓' : '✗',
                                        AC: facility.AC ? '✓' : '✗',
                                        'Study Area': facility['Study Area'] ? '✓' : '✗'
                                    }))
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.PHostelInfo = PHostelInfo;