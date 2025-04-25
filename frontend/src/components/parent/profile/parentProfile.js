// components/parent/profile/ParentProfile.js
const ParentProfile = () => {
    const profileData = {
        name: 'John Doe',
        email: 'johndoe@college.edu',
        mobileNumber: '01234566789',
        address: 'Colombo',
        children: [
            {
                name: 'Jane Doe',
                grade: '10th',
                studentId: 'ST2024001'
            },
            {
                name: 'Jack Doe',
                grade: '8th',
                studentId: 'ST2024002'
            }
        ]
    };

    return {
        type: 'div',
        props: {
            className: 'space-y-6 p-6',
            children: [
                

                // Profile Section
                {
                    type: Card,
                    props: {
                        children: [
                            // Header with Title and Edit Button
                            {
                                type: 'div',
                                props: {
                                    className: 'flex justify-between items-center mb-6',
                                    children: [
                                        {
                                            type: 'h2',
                                            props: {
                                                className: 'text-xl font-bold',
                                                children: ['Profile']
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                variant: 'secondary',
                                                onClick: () => navigation.navigate('profile/edit'),
                                                children: 'Edit'
                                            }
                                        }
                                    ]
                                }
                            },
                            // Main Profile Info
                            {
                                type: 'div',
                                props: {
                                    className: 'space-y-4',
                                    children: [
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Name',
                                                value: profileData.name,
                                                disabled: true
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Email',
                                                value: profileData.email,
                                                disabled: true
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Mobile Number',
                                                value: profileData.mobileNumber,
                                                disabled: true
                                            }
                                        },
                                        {
                                            type: TextField,
                                            props: {
                                                label: 'Address',
                                                value: profileData.address,
                                                disabled: true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },

                // Children Section
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    className: 'text-xl font-bold mb-4',
                                    children: ['Children']
                                }
                            },
                            {
                                type: Table,
                                props: {
                                    headers: ['Name', 'Grade', 'Student ID'],
                                    data: profileData.children
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
};

window.ParentProfile = ParentProfile;