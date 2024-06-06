import React, { useContext, useEffect, useState } from 'react';
import {
    CardBody,
    Input,
    Button,
    Avatar,
} from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

const UpdateProject = ({ projectData, onClose }) => {
    const [formData, setFormData] = useState({
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        department: projectData.department,
        deadline:projectData.deadline,
        assignedDate:projectData.assignedDate,
        members: projectData.members,
        progress:projectData.progress,
        files:projectData.files
    });
    const auth=useContext(AuthContext)

   const [members,setMembers]=useState([])
   const [departments,setDepartments]=useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`,{headers:{
                    Authorization:"Bearer "+auth.token
                }});
                const departmentResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/all/departments`,{headers:{Authorization:"Bearer "+auth.token}});
                
                if (!userResponse.ok || !departmentResponse.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const userData = await userResponse.json();
                const departmentData = await departmentResponse.json();
                
                setMembers(userData.users);
                setDepartments(departmentData.departments);
            } catch (error) {
                message.error("Error fetching data: " + error.message);
            }
        };
        
        fetchData();
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

    const handleAddMember = () => {
        setFormData({
            ...formData,
            members: [...formData.members, ''],
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

    const handleSubmit = async (e) => {
        e.preventDefault();
         // Check for empty fields
     const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
     // Check if any userId is empty
     const emptyMembers = formData.members.filter((member) => !member);
     
    if (emptyFields.length > 0 || emptyMembers.length > 0) {
        // Create an error message for empty fields and empty userIds
        const errorMessage = emptyFields.length > 0 
            ? `Please fill in the following fields: ${emptyFields.join(', ')}`
            : 'Please assign member';
        message.error(errorMessage);
        return;
    }
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("projectName", formData.projectName);
            formDataToSend.append("projectDescription", formData.projectDescription);
            formDataToSend.append("deadline", formData.deadline);
            formDataToSend.append("assignedDate", formData.assignedDate);
            formDataToSend.append("department", formData.department);
            formDataToSend.append("progress", formData.progress);
            
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
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/update/project/byid/${projectData._id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                    body: formDataToSend,
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            message.success(`Project updated successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
            },[500])
            onClose()
            
            
            
        } catch (error) {
            message.error(`Error creating project`)
            console.error("Error submitting form:", error.message);
        }
    };

    return (
        <div className="mt-4 mb-8">
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
                                multiple 
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                name="progress"
                                value={formData.progress}
                                onChange={handleInputChange}
                                label="progress"
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
                            <Input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                label="Deadline"
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
                                        {members.filter(memberItem => memberItem.firstName).map(memberItem => (
  <option key={memberItem._id} value={memberItem.email}>
    {memberItem.firstName} {memberItem.lastName}
  </option>
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
                                            Add
                                        </button></center>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button type="submit">Update Project</Button>
                        <Button onClick={onClose} color="red">Cancel</Button>
                    </div>
                </form>
            </CardBody>
        </div>
    );
}

export default UpdateProject;
