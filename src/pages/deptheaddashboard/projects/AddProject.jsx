import React, { useContext, useEffect, useState } from 'react';
import { CardBody, Input, Button } from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

const AddProject = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        members: [''],
        deadline: '',
        department:"",
        files:[],
        assignedDate: new Date().toISOString().slice(0, 10),
    });
    const auth=useContext(AuthContext)
    const [members,setMembers]=useState([])
    const [departments,setDepartments]=useState([])

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(
                    import.meta.env.REACT_APP_BACKEND_URL+ `/api/erp/user/get/all/users`,{headers:{
                        Authorization:"Bearer "+auth.token
                    }}
                );
                const departmentResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/all/departments`,{headers:{Authorization:"Bearer "+auth.token}});
                if (!response.ok || !departmentResponse.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const departmentData = await departmentResponse.json();
                setMembers(data.users);
                setDepartments(departmentData.departments);
            } catch (err) {
                message.error("Error fetching employees", err.message);
            }
        };
        fetchMembers()
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "files") {
            setFormData({
                ...formData,
                [name]: files 
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleMemberChange = (e, index) => {
        const updatedMembers = [...formData.members];
        updatedMembers[index] = e.target.value;
        setFormData({
            ...formData,
            members: updatedMembers,
        });
    };
    const handleDeleteMember = (index) => {
        const updatedMembers = [...formData.members];
        updatedMembers.splice(index, 1);
        setFormData({
            ...formData,
            members: updatedMembers,
        });
    };

    const handleAddMember = () => {
        setFormData({
            ...formData,
            members: [...formData.members, ''],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("projectName", formData.projectName);
            formDataToSend.append("projectDescription", formData.projectDescription);
            formDataToSend.append("deadline", formData.deadline);
            formDataToSend.append("assignedDate", formData.assignedDate);
            formDataToSend.append("department", formData.department);
            
            // Append members individually
            for (let i = 0; i < formData.members.length; i++) {
                formDataToSend.append("members[]", formData.members[i]);
            }
    
            // Append files
            if (formData.files && formData.files.length > 0) {
                for (let i = 0; i < formData.files.length; i++) {
                    formDataToSend.append("files", formData.files[i]);
                }
            }
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/create/project`,
                {
                    method: "POST",
                    headers: {
                        
                        Authorization:"Bearer "+auth.token
                    },
                    body: formDataToSend,
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            message.success(`Project created successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
            },[500])
            
            
            
        } catch (error) {
            message.error(`Error creating project`)
            console.error("Error submitting form:", error.message);
        }
    };

    return (
        <div>
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                label="Project Name"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="projectDescription"
                                value={formData.projectDescription}
                                onChange={handleInputChange}
                                label="Project Description"
                            />
                        </div>
                        <div>
                            <Input
                                type="file"
                                name="files"
                                onChange={handleInputChange}
                                label="Upload Files"
                                multiple // Allow multiple file selection
                            />
                        </div>
                        <div>
                            <Input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                label="Deadline"
                            />
                        </div>
                        <div>
                            <Input
                                type="date"
                                name="assignedDate"
                                value={formData.assignedDate}
                                onChange={handleInputChange}
                                label="Assigned Date"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Select Department</option>
                                {departments.map(department => (
                                    <option key={department._id} value={department.departmentName}>{department.departmentName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Assigned Members</label>
                            {formData.members.map((member, index) => (
                                <div key={index} className="flex items-center gap-2" style={{ padding: '5px' }}>
                                    <select
                                        name="member"
                                        value={member}
                                        onChange={(e) => handleMemberChange(e, index)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select Member</option>
                                        {members.map(memberItem => (
                                            <option key={memberItem._id} value={memberItem.email}>{memberItem.firstName} {memberItem.lastName}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteMember(index)}
                                        className="bg-red-500 text-white px-3 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    {/* {index === formData.members.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddMember}
                                            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 "
                                        >
                                            +
                                        </button>
                                    )} */}
                                   
                                </div>
                            ))}
                              <center>  <button
                                            type="button"
                                            onClick={handleAddMember}
                                            className="bg-gray-800   text-white px-10 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                                        >
                                            +
                                        </button></center>
                        </div>
                    </div>
                    <Button type="submit" className="mt-6">Add Project</Button>
                </form>
            </CardBody>
        </div>
    );
}

export default AddProject;
