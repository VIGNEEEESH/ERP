import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar, Chip } from "@material-tailwind/react";
import { message, Modal } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function MyOffice() {
    const [isChecked, setIsChecked] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false); // State for confirmation modal
    const auth=useContext(AuthContext)
    const [formData, setFormData] = useState({
        attendanceStatus:"Present",
        userId:auth.userId,
        email:auth.email
    }); // State for form data

    useEffect(() => {
        const fetchAttendanceAndEmployees = async () => {
            try {
                // Fetch attendance data
                const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydate/${formattedDate}`);
                if (!attendanceResponse.ok) {
                    throw new Error(`Failed to fetch attendance data: ${attendanceResponse.status}`);
                }
                const attendanceData = await attendanceResponse.json();
    
                // Fetch employee data
                const employeeResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`);
                if (!employeeResponse.ok) {
                    throw new Error(`Failed to fetch employee data: ${employeeResponse.status}`);
                }
                const employeeData = await employeeResponse.json();
                setAttendance(attendanceData.attendance);
                setEmployees(employeeData.users);
            } catch (error) {
                message.error("Error fetching attendance or employees", error.message);
            }
        };
    
        fetchAttendanceAndEmployees();
    }, []);

    const handleAttendance = async () => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/create/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
        } catch (err) {
            message.error("Something went wrong while creating the attendance, please try again")
        }
    }

    const formattedDate = new Date().toISOString().split("T")[0];

    const data = useMemo(() => {
        // Map attendance data with user information
        return attendance.map(att => {
            const employee = employees.find(emp => emp._id === att.userId);
            return { ...att, employee };
        });
    }, [attendance, employees]);

    const handleClockIn = () => {
        // Show confirmation modal
        setConfirmModalVisible(true);
    };

    const handleConfirmClockIn = () => {
        // Execute clock in logic
        handleAttendance();
        // Close confirmation modal
        setConfirmModalVisible(false);
    };

    const handleCancelClockIn = () => {
        // Close confirmation modal
        setConfirmModalVisible(false);
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Typography variant="h6" color="white" className="mr-4">
                            My Office
                        </Typography>
                        <span>Last Logged in at so & so</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input
                            className="sr-only peer"
                            value=""
                            type="checkbox"
                        />
                        <div className="peer rounded-full outline-none duration-100 after:duration-500 w-28 h-14 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-900  after:content-['Out'] after:absolute after:outline-none after:rounded-full after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-black after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['in'] peer-checked:after:border-black"
                            onClick={handleClockIn} // Call handleClockIn on click
                        >
                        </div>
                    </label>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Name", "role", "status",  ""].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(({ employee, ...att }, key) => {
                                const className = `py-3 px-5 ${
                                    key === data.length - 1 ? "" : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={key}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={`http://localhost:4444/${employee.image}`} alt={employee.name} size="sm" variant="rounded" />
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {employee.firstName}&nbsp;{employee.lastName}
                                                    </Typography>
                                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                                        {employee.email}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {employee.role}
                                            </Typography>
                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                {/* Add additional job info if needed */}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                value={att.workStatus}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                {/* Add last punch info */}
                                                Last clocked in at {att.loggedInTime} {att.loggedOutTime && `& clocked out at ${att.loggedOutTime}`}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            {/* Confirmation Modal */}
            <Modal
                title="Confirm Clock In"
                visible={confirmModalVisible}
                onOk={handleConfirmClockIn}
                onCancel={handleCancelClockIn}
                okText="Yes"
                cancelText="Cancel"
            >
                Are you sure you want to clock in?
            </Modal>
        </div>
    );
}

export default MyOffice;
