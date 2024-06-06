
import React, { useContext, useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function EditDepartment({ departmentData, onClose }) {
    const [formData, setFormData] = useState({ departmentName: departmentData.departmentName, userId: departmentData.userId });
    const auth = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/users/byrole/DeptHead`, {
                    headers: {
                        Authorization: "Bearer " + auth.token
                    }
                });

                if (!userResponse.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const userData = await userResponse.json();

                setUsers(userData.users);
            } catch (error) {
                message.error("Error fetching data: " + error.message);
            }
        };

        fetchData();
    }, [auth.token]);

    const handleAddUsers = () => {
        setFormData({
            ...formData,
            userId: [...formData.userId, ''],
        });
    };

    const handleUserChange = (e, index) => {
        const updatedUsers = [...formData.userId];
        updatedUsers[index] = e.target.value;
        setFormData({
            ...formData,
            userId: updatedUsers,
        });
    };

    const handleDeleteUser = (index) => {
        const updatedUsers = [...formData.userId];
        updatedUsers.splice(index, 1);
        setFormData({
            ...formData,
            userId: updatedUsers,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         // Check for empty fields
         
    const emptyFields = Object.keys(formData).filter((key) => !formData[key]);

    // Check if any userId is empty
    const emptyUserIds = formData.userId.filter((userId) => !userId);

    if (emptyFields.length > 0 || emptyUserIds.length > 0) {
        // Create an error message for empty fields and empty userIds
        const errorMessage = emptyFields.length > 0 
            ? `Please fill in the following fields: ${emptyFields.join(', ')}`
            : 'Please assign member';
        message.error(errorMessage);
        return;
    }

        const formDataToSend = new FormData();
        
        for (let key in formData) {
            if (formData[key] instanceof File) {
                formDataToSend.append(key, formData[key]);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/update/department/byid/${departmentData._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:"Bearer "+auth.token,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            message.success(`Department updated successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
                      },[300]
                    )
            
            
        } catch (error) {
            message.error(`Error updating Department`)
           
        }
        

        onClose(); 
    };

    return (
        <div className="mt-4 mb-8 flex flex-col gap-12">
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                            <Input
                                type="text"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleInputChange}
                                label="Department Name"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Assigned Members</label>
                            {formData.userId.map((user, index) => (
                                <div key={index} className="flex items-center gap-2" style={{ padding: '5px' }}>
                                    <select
                                        name="userId"
                                        value={user}
                                        onChange={(e) => handleUserChange(e, index)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select User</option>
                                        {users.filter(userItem => userItem.firstName).map(userItem => (
  <option key={userItem._id} value={userItem._id}>
    {userItem.firstName} {userItem.lastName}
  </option>
))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteUser(index)}
                                        className="bg-red-500 text-white px-3 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    
                                        
                                    
                                </div>
                            ))}
                           <center>  <button
                                            type="button"
                                            onClick={handleAddUsers}
                                            className="bg-gray-800   text-white px-10 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                                        >
                                            Add
                                        </button></center>
                        </div>
                    </div>
                    <Button type="submit" disabled={!formData.userId} className='mt-4'>Update Department</Button>
                    <Button onClick={onClose} className='mt-4 ml-2'>Cancel</Button>
                </form>
            </CardBody>
        </div>
    );
}

export default EditDepartment;
