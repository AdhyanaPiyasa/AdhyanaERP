// components/teacher/profile/ProfileEdit.js
const TeacherProfileEdit = () => {
    const [formData, setFormData] = MiniReact.useState({
        name: "John Doe",
        email: "johndoe@college.edu",
        role: "Teacher",
        employeeNumber: "E200",
        mobileNumber: "0147258369",
        address: "Colombo"
    });

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Edit Profile']
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Name",
                        value: formData.name,
                        onChange: (e) => setFormData({...formData, name: e.target.value})
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Email",
                        value: formData.email,
                        onChange: (e) => setFormData({...formData, email: e.target.value})
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Role",
                        value: formData.role,
                        disabled: true
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Employee Number",
                        value: formData.employeeNumber,
                        disabled: true
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Mobile Number",
                        value: formData.mobileNumber,
                        onChange: (e) => setFormData({...formData, mobileNumber: e.target.value})
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: "Address",
                        value: formData.address,
                        onChange: (e) => setFormData({...formData, address: e.target.value})
                    }
                },
                {
                    type: Button,
                    props: {
                        onClick: () => navigation.navigate('profile'),
                        children: ['Save edits']
                    }
                },
                {
                    type: Button,
                    props: {
                        variant: 'secondary',
                        onClick: () => navigation.navigate('profile'),
                        children: ['Cancel']
                    }
                }
            ]
        }
    };
};

window.TeacherProfileEdit = TeacherProfileEdit;