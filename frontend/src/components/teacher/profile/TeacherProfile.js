// components/teacher/profile/Profile.js
const TeacherProfile = () => {
    const teacherData = {
        name: "John Doe",
        email: "johndoe@college.edu",
        role: "Teacher",
        employeeNumber: "E200",
        mobileNumber: "0147258369",
        address: "Colombo"
    };

    return {
        type: 'div',
        props: {
            children: [
                // Profile Header
                {
                    type: Card,
                    props: {
                        children: [
                            {
                                type: 'h2',
                                props: {
                                    children: ['Profile']
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'img',
                                            props: {
                                                src: '/api/placeholder/100/100',
                                                alt: 'Profile'
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                children: [
                                                    {
                                                        type: 'h3',
                                                        props: {
                                                            children: [teacherData.name]
                                                        }
                                                    },
                                                    {
                                                        type: 'p',
                                                        props: {
                                                            children: [teacherData.email]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            type: Button,
                                            props: {
                                                onClick: () => navigation.navigate('profile/edit'),
                                                children: ['Edit']
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                // Profile Details
                {
                    type: Card,
                    props: {
                        children: [
                            // Each field row
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Name']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.name]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Email']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.email]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Role']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.role]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Employee Number']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.employeeNumber]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Mobile Number']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.mobileNumber]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                children: ['Address']
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                children: [teacherData.address]
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
    };
};

window.TeacherProfile = TeacherProfile;