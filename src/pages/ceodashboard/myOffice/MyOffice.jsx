import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Button } from "@material-tailwind/react";
import { message, Modal, Input } from 'antd';  // Import Input from antd
import { AuthContext } from '@/pages/auth/Auth-context';

export function MyOffice() {
    const [isChecked, setIsChecked] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmClockOutModalVisible, setConfirmClockOutModalVisible] = useState(false);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isClockedOut, setIsClockedOut] = useState(false);
    const [workDone, setWorkDone] = useState("");  // State for work done input
    const auth = useContext(AuthContext);

    const [formData, setFormData] = useState({
        attendanceStatus: "Present",
        userId: auth.userId,
        email: auth.email
    });

    const formattedDate = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchAttendanceAndEmployees = async () => {
            try {
                // Fetch attendance data
                const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydate/${formattedDate}`, {
                    headers: { Authorization: "Bearer " + auth.token }
                });
                if (!attendanceResponse.ok) {
                    throw new Error(`Failed to fetch attendance data: ${attendanceResponse.status}`);
                }
                const attendanceData = await attendanceResponse.json();

                // Fetch employee data
                const employeeResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`, {
                    headers: { Authorization: "Bearer " + auth.token }
                });
                if (!employeeResponse.ok) {
                    throw new Error(`Failed to fetch employee data: ${employeeResponse.status}`);
                }
                const employeeData = await employeeResponse.json();

                // Fetch current clock in status
                const statusResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydateanduserid/${formattedDate}/${auth.userId}`, {
                    headers: { Authorization: "Bearer " + auth.token }
                });
                if (!statusResponse.ok) {
                    throw new Error(`Failed to fetch status data: ${statusResponse.status}`);
                }
                const statusData = await statusResponse.json();

                setAttendance(attendanceData.attendance);
                setEmployees(employeeData.users);
                setIsClockedIn(statusData.attendance.attendanceStatus);
                setIsClockedOut(statusData.attendance.loggedOutTime);
                
            } catch (error) {
                message.warning("Please clock in to get information");
            }
        };

        fetchAttendanceAndEmployees();
    }, [auth.token, formattedDate]);

    const handleAttendance = async (status) => {
        const attendanceData = {
            ...formData,
            attendanceStatus: status
        };
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/create/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                },
                body: JSON.stringify(attendanceData)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setIsClockedIn(status === "Present");
            message.success("Clocked In successfully")
            setTimeout(()=>{
                window.location.reload()
            },[300])
        } catch (err) {
            message.error("Something went wrong while creating the attendance, please try again");
        }
    };

    const handleConfirmClockIn = () => {
        handleAttendance("Present");
        setConfirmModalVisible(false);
    };

    const handleCancelClockIn = () => {
        setConfirmModalVisible(false);
    };

    const handleClockOut = async () => {
        try {
            const attendanceData = {
                ...formData,
                attendanceStatus: "Absent"
            };
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/add/loggedouttime`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                },
                body: JSON.stringify(attendanceData)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Post work done data
            const workData = {
                date: formattedDate,
                workDone,
                userId: auth.userId
            };
            const workResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/work/create/work`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                },
                body: JSON.stringify(workData)
            });
            if (!workResponse.ok) {
                throw new Error("Failed to submit work done data");
            }

            setIsClockedIn(false);
            message.success("Clocked Out successfully");
            setTimeout(()=>{
                window.location.reload()
            },[300])
        } catch (err) {
            message.error("Something went wrong while creating the attendance, please try again");
        }
    };

    const handleConfirmClockOut = () => {
        handleClockOut();
        setConfirmClockOutModalVisible(false);
    };

    const handleCancelClockOut = () => {
        setConfirmClockOutModalVisible(false);
    };

    const data = useMemo(() => {
        return attendance.map(att => {
            const employee = employees.find(emp => emp._id === att.userId);
            return { ...att, employee };
        });
    }, [attendance, employees]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Typography variant="h6" color="white" className="mr-4">
                            My Office
                            </Typography>
                </div>
                <div className="ml-auto flex flex-col md:flex-row items-center">
                    <Button
                        color="green"
                        disabled={isClockedIn === "Present"}
                        onClick={() => setConfirmModalVisible(true)}
                        className="mb-2 md:mb-0 md:mr-4"
                    >
                        Clock In
                    </Button>
                    <Button
                        color="red"
                        disabled={isClockedOut || !isClockedIn}
                        onClick={() => setConfirmClockOutModalVisible(true)}
                    >
                        Clock Out
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            {["Name", "Role", "Status", "Time"].map((el) => (
                                <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({ employee, ...att }, key) => {
                            const className = `py-3 px-5 ${key === data.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                            return (
                                <tr key={key}>
                                    <td className={className}>
                                        <div className="flex items-center gap-4">
                                            <Avatar src={`${import.meta.env.REACT_APP_BACKEND_URL}/${employee.image}`} alt={employee.name} size="sm" variant="rounded" />
                                            <div>
                                                <Typography variant="small" color="blue-gray" className="font-semibold">
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
                                    </td>
                                    <td className={className}>
                                        <Chip variant="gradient" value={att.workStatus} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
                                    </td>
                                    <td className={className}>
                                        <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600">
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
        
        <Modal  
            title="Confirm Clock In"
            visible={confirmModalVisible}
            onOk={handleConfirmClockIn}
            onCancel={handleCancelClockIn}
            okText="Yes"
            okType='default'
            cancelText="Cancel"
        >
            Are you sure you want to clock in?
        </Modal>
        <Modal 
            title="Confirm Clock Out"
            visible={confirmClockOutModalVisible}
            onOk={handleConfirmClockOut}
            onCancel={handleCancelClockOut}
            okText="Yes"
            okType='default'
            cancelText="Cancel"
        >
            <div>Are you sure you want to clock out?</div>
            <Input.TextArea
                placeholder="Enter the work done for the day"
                value={workDone}
                onChange={(e) => setWorkDone(e.target.value)}
                rows={4}
                className="mt-4"
            />
        </Modal>
    </div>
);
}

export default MyOffice;
