import React, { useContext, useEffect, useState } from 'react';
import {
    CardBody,
    Input,
    Button,
} from "@material-tailwind/react";

import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/pages/auth/Auth-context';

export function AddDepartment() {
    const [formData, setFormData] = useState({
        departmentName: '',
        userId:[""]
        
        
    });
    const auth=useContext(AuthContext)
    const [users,setUsers]=useState([])
    const [qrCodeData, setQRCodeData] = useState(null);
    const [showQRCodePopup, setShowQRCodePopup] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/users/byrole/DeptHead`,{headers:{
                    Authorization:"Bearer "+auth.token
                }});
                
                if (!userResponse.ok ) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const userData = await userResponse.json();
                
                setUsers(userData.users);
            } catch (error) {
                message.error("Error fetching data: " + error.message);
            }
        };
        
        fetchData();
    }, []);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/create/department`,
                {
                    method: "POST",
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
            message.success(`Department created successfully`)
            const responseData = await response.json();
            
            setTimeout(()=>{
                window.location.reload()
            },[300])
            
            
        } catch (error) {
            message.error(`Error creating department`)
            console.error("Error submitting form:", error.message);
        }
    };

    const handleCloseQRCodePopup = () => {
        setShowQRCodePopup(false);
        setQRCodeData(null);
        
            window.location.reload();
        
    };

    return (
        <div className="mt-4 mb-8 flex flex-col gap-12">
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
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
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        name="userId"
                                        value={user}
                                        onChange={(e) => handleUserChange(e, index)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select User</option>
                                        {users.map(userItem => (
                                            <option key={userItem._id} value={userItem._id}>{userItem.firstName} {userItem.lastName}</option>
                                        ))}
                                    </select>
                                    {index === formData.userId.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddUsers}
                                            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 "
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                       
                    </div>
                    <Button type="submit" className='mt-4'>Add Department</Button>
                </form>
            </CardBody>
            {showQRCodePopup && <QRCodePopup qrCodeData={qrCodeData} onClose={handleCloseQRCodePopup} />}
        </div>
    );
}

export default AddDepartment;
