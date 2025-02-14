import { useContext, useState } from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function EditEmployee({ employeeData, onClose }) {
    const [formData, setFormData] = useState(employeeData);
    const auth=useContext(AuthContext)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
         // Check for empty fields
         const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
    
         if (emptyFields.length > 1) {
             // Create an error message for empty fields
             const errorMessage = `Please fill in the following fields: ${emptyFields.join(', ')}`;
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
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/update/user/byid/${formData._id}`,
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
            message.success(`Employee updated successfully`)
            const responseData = await response.json();
            setTimeout(()=>{
                window.location.reload()
                      },[300]
                    )
            
            
        } catch (error) {
            message.error(`Error updating employee`)
           
        }
        

        onClose(); 
    };

    return (
        <div className="mt-4 mb-8 flex flex-col gap-12">
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                label="First Name"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                label="Last Name"
                            />
                        </div>
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
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                label="Mobile"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                label="Address"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                label="Pincode"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                label="State"
                            />
                        </div>
                        
                        <div>
                            <Input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                label="Country"
                            />
                        </div>
                       
                        <div>
                            <Input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                label="Salary"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="pan"
                                value={formData.pan}
                                onChange={handleInputChange}
                                label="PAN Number"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="aadhar"
                                value={formData.aadhar}
                                onChange={handleInputChange}
                                label="Aadhar Number"
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
                    <Button type="submit" className='mt-4'>Update Employee</Button>
                    <Button onClick={onClose} className='mt-4 ml-2'>Cancel</Button>
                </form>
            </CardBody>
        </div>
    );
}

export default EditEmployee;
