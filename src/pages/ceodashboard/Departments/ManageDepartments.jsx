import React, { useState, useMemo, useEffect, useContext } from 'react';
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
import { AuthContext } from '@/pages/auth/Auth-context';

export function ManageDepartments() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [departments,setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const auth=useContext(AuthContext)

    useEffect(() => {
    const fetchDepartments = async () => {
        try {
            
            const departmentResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/get/all/departments`,{headers:{Authorization:"Bearer "+auth.token}});
            if (!departmentResponse.ok) {
                throw new Error(`Failed to fetch attendance data: ${departmentResponse.status}`);
            }
            const departmentData = await departmentResponse.json();
            const userResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`,{headers:{
                Authorization:"Bearer "+auth.token
            }});
            if (!userResponse.ok) {
                throw new Error(`Failed to fetch attendance data: ${userResponse.status}`);
            }
            const userData = await userResponse.json();
            
            setDepartments(departmentData.departments);
            setUsers(userData.users);
            
        } catch (error) {
            message.error("Error fetching attendance or employees", error.message);
        }
    };

    fetchDepartments();
}, []);


const data = useMemo(() => {
    // Map attendance data with user information
    return departments.map(department => {
        // Ensure departmentName is defined
        const departmentName = department.departmentName || '';
        // Find all users corresponding to the department's userIds
        const departmentUsers = department.userId.map(id => users.find(user => user._id === id));
        
        return { ...department, departmentName, users: departmentUsers };
    });
}, [departments, users]);




console.log(users);
console.log(data)
    

  
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // const filteredData = useMemo(() => {
    //     return data.filter(({ department, users }) => {
    //         const fullName = department.departmentName.toLowerCase();
    //         const emailMatch = users.some(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    //         return fullName.includes(searchQuery.toLowerCase()) || emailMatch;
    //     });
    // }, [data, searchQuery]);
    
    
    
    
    

    const columns = useMemo(
        () => [
            {
                Header: 'Employee Details',
                accessor: 'departmentName',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                {row.original.departmentName}
                            </Typography>
                        </div>
                    </div>
                ),
            },
            {
                Header: 'User',
                accessor: 'users',
                Cell: ({ row }) => (
                    <div>
                        {row.original.users.map(user => (
                            <Typography key={user._id} className="text-xs font-semibold text-blue-gray-600">
                                {user.firstName}&nbsp;{user.lastName} - {user.role}
                            </Typography>
                        ))}
                    </div>
                ),
            },
            // {
            //     Header: 'Status',
            //     accessor: 'workStatus',
            //     Cell: ({ value }) => (
            //         <Chip
            //             variant="gradient"
            //             // color={value ? "green" : "blue-gray"}
            //             value={value}
            //             className="py-0.5 px-2 text-[11px] font-medium w-fit"
            //         />
            //     ),
            // },
            // {
            //     Header: 'View Detail',
            //     accessor: 'viewDetail',
            //     Cell: ({ row }) => (
            //         <Button className="text-xs font-semibold" onClick={() => handleViewClick(row.original)}>
            //             View
            //         </Button>
            //     ),
            // },
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
            data:data,
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
