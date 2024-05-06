import React, { useEffect, useState } from 'react';
import { CardBody, Input, Button } from "@material-tailwind/react";
import { message } from 'antd';

const AddTaskForm = () => {
    const [formData, setFormData] = useState({
        taskName: '',
        taskDescription: '',
        members: [''],
        deadline: '',
        department:"",
        assignedDate: new Date().toISOString().slice(0, 10), // Current date by default
    });
    const [members,setMembers]=useState([])
    const [departments,setDepartments]=useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`);
                const departmentResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/all/departments`);
                
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/create/task`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            message.success(`Task created successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
            },[500])
            
            
            
        } catch (error) {
            message.error(`Error creating task`)
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
                                name="taskName"
                                value={formData.taskName}
                                onChange={handleInputChange}
                                label="Task Name"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                label="Task Description"
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
                                <div key={index} className="flex items-center gap-2">
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
                                    {index === formData.members.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddMember}
                                            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 "
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="mt-6">Add Task</Button>
                </form>
            </CardBody>
        </div>
    );
}

export default AddTaskForm;
