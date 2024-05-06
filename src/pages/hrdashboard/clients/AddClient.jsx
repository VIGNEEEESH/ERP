import React, { useContext, useState } from 'react';
import { CardBody, Input, Button } from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

function AddClient() {
    const [formData, setFormData] = useState({
        email: '',
        clientName: '',
        companyName: '',
        mobile: '',
        projects: [""]
    });
    const auth=useContext(AuthContext)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'projects') {
            // Split the input value by comma and remove any leading/trailing spaces
            const projectsArray = value.split(',').map(project => project.trim());
            setFormData({
                ...formData,
                [name]: projectsArray,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:4444/api/erp/client/create/client",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            message.success(`Client created successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
            },[500])
          
        } catch (error) {
            message.error(`Error creating client`)
            console.error("Error submitting form:", error.message);
        }
    };

    return (
        <CardBody className="px-6 py-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Input 
                        label="Client Company Name"
                        name="companyName"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Input 
                        label="Client Name"
                        name="clientName"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Input 
                        type="email"
                        label="Client Email"
                        name="email"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Input 
                        label="Client Phone Number"
                        name="mobile"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Input 
                        type="text"
                        label="Projects (Comma-separated)"
                        name="projects"
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button 
                    buttonType="filled"
                    onClick={handleSubmit}
                >
                    Add Client
                </Button>
            </div>
        </CardBody>
    );
}

export default AddClient;
