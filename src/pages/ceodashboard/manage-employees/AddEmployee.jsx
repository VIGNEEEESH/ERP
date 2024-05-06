import { useState } from 'react';
// import {useHistory} from 'react-router-dom'
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
export function AddEmployeeForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        address: '',
        pincode: '',
        state: '',
        country: '',
        image: '',
        offerLetter: '',
        salary: '',
        pan: '',
        aadhar: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // const history = useHistory();
    // const handleBackClick = () => {
    //     history.goBack(); // Navigate back to the previous page
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        // Reset form fields
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: '',
            address: '',
            pincode: '',
            state: '',
            country: '',
            image: null,
            offerLetter: null,
            salary: '',
            pan: '',
            aadhar: '',
        });

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
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 px-3 py-2"
                                >
                                    {showPassword ? (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                label="Role"
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
                                type="file"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                label="Profile Image"
                            />
                        </div>
                        <div>
                            <Input
                                type="file"
                                name="offerLetter"
                                value={formData.offerLetter}
                                onChange={handleInputChange}
                                label="Offer Letter"
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
                    </div>
                    <Button type="submit" className='mt-4'>Add Employee</Button>
                    {/* <Button onChange={handleBackClick} className='mt-4'>Back</Button> */}

                </form>
            </CardBody>
        </div>
    );
}

export default AddEmployeeForm;
