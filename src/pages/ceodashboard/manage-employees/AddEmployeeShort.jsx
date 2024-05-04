import React, { useState } from 'react';
import {
    CardBody,
    Input,
    Button,
} from "@material-tailwind/react";
import QRCodePopup from './QRCodePopup';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export function AddEmployeeShort() {
    const [formData, setFormData] = useState({
        email: '',
        role: '',
        salary:""
    });
    
    const [qrCodeData, setQRCodeData] = useState(null);
    const [showQRCodePopup, setShowQRCodePopup] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/invite/user`,
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
            message.success(`Employee created successfully`)
            const responseData = await response.json();
            setQRCodeData(responseData);
            setShowQRCodePopup(true);
            
            
        } catch (error) {
            message.error(`Error creating employee`)
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
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                label="Email"
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                label="Salary"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-blue-gray-500">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-blue-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Role</option>
                                <option value="CEO">CEO</option>
                                <option value="HR">HR</option>
                                <option value="DeptHead">DeptHead</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>
                    </div>
                    <Button type="submit" className='mt-4'>Add Employee</Button>
                </form>
            </CardBody>
            {showQRCodePopup && <QRCodePopup qrCodeData={qrCodeData} onClose={handleCloseQRCodePopup} />}
        </div>
    );
}

export default AddEmployeeShort;
