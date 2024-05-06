import React, { useState, useMemo, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Button,
    Input,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { authorsTableData } from "@/data";
import AttendanceCalendar from "./AttendenceCalender";
import { message } from 'antd';

export function ManageDepartments() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];


    useEffect(() => {
    const fetchAttendanceAndEmployees = async () => {
        try {
            
            const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/bydate/${formattedDate}`);
            if (!attendanceResponse.ok) {
                throw new Error(`Failed to fetch attendance data: ${attendanceResponse.status}`);
            }
            const attendanceData = await attendanceResponse.json();
           

            
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

    
    
    const data = useMemo(() => {
        return attendance.map(att => {
            
            const employee = employees.find(emp => emp._id === att.userId);
            
            return { ...att, employee };
            
        });
    }, [attendance, employees]);
    

  
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    
    const filteredData = useMemo(() => {
        return data.filter(({ employee }) => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            const email = employee.email.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);

    const columns = useMemo(
        () => [
            {
                Header: 'Employee Details',
                accessor: 'firstName',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                        <Avatar src={`http://localhost:4444/${row.original.employee.image}`} alt={row.original.name} size="sm" variant="rounded" />
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                {row.original.employee.firstName}&nbsp;{row.original.employee.lastName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                                {row.original.email}
                            </Typography>
                        </div>
                    </div>
                ),
            },
            {
                Header: 'Designation',
                accessor: 'role',
                Cell: ({ row }) => (
                    <div>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                            {row.original.employee.role}
                        </Typography>
                        {/* <Typography className="text-xs font-normal text-blue-gray-500">
                            {row.original.employee.role}
                        </Typography> */}
                    </div>
                ),
            },
            {
                Header: 'Status',
                accessor: 'workStatus',
                Cell: ({ value }) => (
                    <Chip
                        variant="gradient"
                        // color={value ? "green" : "blue-gray"}
                        value={value }
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                    />
                ),
            },
            {
                Header: 'View Detail',
                accessor: 'viewDetail',
                Cell: ({ row }) => (
                    <Button className="text-xs font-semibold" onClick={() => handleViewClick(row.original)}>
                        View
                    </Button>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state: { pageIndex },
        prepareRow,
    } = useTable(
        {
            columns,
            data:filteredData,
            initialState: { pageIndex: 0, pageSize },
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
    };

    const filteredAuthorsTableData = useMemo(() => 
    data.filter(({ firstName, email }) =>
        (firstName && firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (email && email.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [data, searchQuery]
);


const handleViewClick = (employee) => {
    setSelectedEmployee(employee); // Assuming the userId is stored in employee.userId
    setShowCalendar(true);
};


    const mockAttendanceData = {
        '2024-04-01': 'present',
        '2024-04-02': 'leave',
        '2024-04-03': 'absent',
        // Add more entries as needed
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                {showCalendar ? (
                    <AttendanceCalendar attendanceData={selectedEmployee} />
                ) : (
                    <>
                        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                            <Typography variant="h6" color="white">
                                Attendence Tracker
                            </Typography>
                            <Input
    label="Search with the employee name"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className=" w-full bg-white text-black"
/>

                        </CardHeader>
                        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                            <table {...getTableProps()} className="w-full min-w-[640px] table-auto">
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                        {column.render('Header')}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {page.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => (
                                                    <td {...cell.getCellProps()} className="py-3 px-5">
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                    {!page.length && (
                                        <tr>
                                            <td colSpan={columns.length} className="py-3 px-5 text-center">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-between items-center">
                                <div className='flex items-center'>
                                    <Typography className="text-sm text-blue-gray-600">
                                        Page {pageIndex + 1} of {Math.ceil(filteredAuthorsTableData.length / pageSize)}
                                    </Typography>
                                    <select 
                                        value={pageSize} 
                                        onChange={handlePageSizeChange}
                                        className="ml-2 border rounded px-2 py-1"
                                    >
                                        {[5, 10, 15].map((size) => (
                                            <option key={size} value={size}>
                                                Show {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
                                        {"<< "}
                                    </span>
                                    <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
                                        {"< "}
                                    </span>
                                    <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
                                        {" >"}
                                    </span>
                                    <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
                                        {" >>"}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </>
                )}
            </Card>
        </div>
    );
}

export default ManageDepartments;
