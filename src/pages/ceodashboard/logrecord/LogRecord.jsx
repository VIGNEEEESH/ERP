// import React, { useState, useMemo, useEffect, useContext } from 'react';
// import {
//     Card,
//     CardHeader,
//     CardBody,
//     Typography,
//     Avatar,
//     Chip,
//     Button,
//     Input,
// } from "@material-tailwind/react";
// import { useTable, usePagination } from 'react-table';
// import { authorsTableData } from "@/data";
// import AttendanceCalendar from "./AttendenceCalender";
// import { message } from 'antd';
// import { AuthContext } from '@/pages/auth/Auth-context';

// export function LogRecord() {
//     const [showCalendar, setShowCalendar] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [pageSize, setPageSize] = useState(5);
//     // const [attendance, setAttendance] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const currentDate = new Date();
//     const formattedDate = currentDate.toISOString().split("T")[0];
// const auth=useContext(AuthContext)
// // Handler for updating search query


//     useEffect(() => {
//     const fetchAttendanceAndEmployees = async () => {
//         try {
//             const employeeResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`,{headers:{
//                 Authorization:"Bearer "+auth.token
//             }});
//             if (!employeeResponse.ok) {
//                 throw new Error(`Failed to fetch employee data: ${employeeResponse.status}`);
//             }
//             const employeeData = await employeeResponse.json();
//             // setAttendance(attendanceData.attendance);
//             setEmployees(employeeData.users);
//         } catch (error) {
//             message.error("Error fetching attendance or employees", error.message);
//         }
//     };

//     fetchAttendanceAndEmployees();
// }, []);

    
    
// const data = useMemo(() => (employees ? employees : []), [employees]);
    

  
//     const handleSearch = (e) => {
//         setSearchQuery(e.target.value);
//     };
    
//     // Filter data based on search query
//     const filteredData = useMemo(() => {
//         return data.filter(({ firstName, lastName, email }) => {
//             const fullName = `${firstName} ${lastName}`.toLowerCase();
//             return fullName.includes(searchQuery.toLowerCase()) || email.toLowerCase().includes(searchQuery.toLowerCase());
//         });
//     }, [data, searchQuery]);

//     const columns = useMemo(
//         () => [
//             {
//                 Header: 'Employee Details',
//                 accessor: 'firstName',
//                 Cell: ({ row }) => (
//                     <div className="flex items-center gap-4">
//                         <Avatar src={`http://localhost:4444/${row.original.image}`} alt={row.original.name} size="sm" variant="rounded" />
//                         <div>
//                             <Typography variant="small" color="blue-gray" className="font-semibold">
//                                 {row.original.firstName}&nbsp;{row.original.lastName}
//                             </Typography>
//                             <Typography className="text-xs font-normal text-blue-gray-500">
//                                 {row.original.email}
//                             </Typography>
//                         </div>
//                     </div>
//                 ),
//             },
//             {
//                 Header: 'Designation',
//                 accessor: 'role',
//                 Cell: ({ row }) => (
//                     <div>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                             {row.original.role}
//                         </Typography>
//                         {/* <Typography className="text-xs font-normal text-blue-gray-500">
//                             {row.original.employee.role}
//                         </Typography> */}
//                     </div>
//                 ),
//             },
//             {
//                 Header: 'View Detail',
//                 accessor: 'viewDetail',
//                 Cell: ({ row }) => (
//                     <Button className="text-xs font-semibold" onClick={() => handleViewClick(row.original)}>
//                         View
//                     </Button>
//                 ),
//             },
//         ],
//         []
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         nextPage,
//         previousPage,
//         canNextPage,
//         canPreviousPage,
//         state: { pageIndex },
//         prepareRow,
//     } = useTable(
//         {
//             columns,
//             data:filteredData,
//             initialState: { pageIndex: 0, pageSize },
//         },
//         usePagination
//     );

//     const handlePageSizeChange = (e) => {
//         const newSize = Number(e.target.value);
//         setPageSize(newSize);
//     };

//     const filteredAuthorsTableData = useMemo(() => 
//     data.filter(({ firstName, email }) =>
//         (firstName && firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (email && email.toLowerCase().includes(searchQuery.toLowerCase()))
//     ),
//     [data, searchQuery]
// );


// const handleViewClick = (employee) => {
//     setSelectedEmployee(employee); // Assuming the userId is stored in employee.userId
//     setShowCalendar(true);
// };

//     return (
//         <div className="mt-12 mb-8 flex flex-col gap-12">
//             <Card>
//                 {showCalendar ? (
//                     <AttendanceCalendar attendanceData={selectedEmployee} />
//                 ) : (
//                     <>
//                         <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
//                             <Typography variant="h6" color="white">
//                                 Log Record
//                             </Typography>
//                             <Input
//     label="Search with the employee name"
//     value={searchQuery}
//     onChange={(e) => setSearchQuery(e.target.value)}
//     className=" w-full bg-white text-black"
// />

//                         </CardHeader>
//                         <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//                             <table {...getTableProps()} className="w-full min-w-[640px] table-auto">
//                                 <thead>
//                                     {headerGroups.map(headerGroup => (
//                                         <tr {...headerGroup.getHeaderGroupProps()}>
//                                             {headerGroup.headers.map(column => (
//                                                 <th {...column.getHeaderProps()} className="border-b border-blue-gray-50 py-3 px-5 text-left">
//                                                     <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
//                                                         {column.render('Header')}
//                                                     </Typography>
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </thead>
//                                 <tbody {...getTableBodyProps()}>
//                                     {page.map(row => {
//                                         prepareRow(row);
//                                         return (
//                                             <tr {...row.getRowProps()}>
//                                                 {row.cells.map(cell => (
//                                                     <td {...cell.getCellProps()} className="py-3 px-5">
//                                                         {cell.render('Cell')}
//                                                     </td>
//                                                 ))}
//                                             </tr>
//                                         );
//                                     })}
//                                     {!page.length && (
//                                         <tr>
//                                             <td colSpan={columns.length} className="py-3 px-5 text-center">
//                                                 No data available
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                             <div className="mt-4 flex justify-between items-center">
//                                 <div className='flex items-center'>
//                                     <Typography className="text-sm text-blue-gray-600">
//                                         Page {pageIndex + 1} of {Math.ceil(filteredAuthorsTableData.length / pageSize)}
//                                     </Typography>
//                                     <select 
//                                         value={pageSize} 
//                                         onChange={handlePageSizeChange}
//                                         className="ml-2 border rounded px-2 py-1"
//                                     >
//                                         {[5, 10, 15].map((size) => (
//                                             <option key={size} value={size}>
//                                                 Show {size}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
//                                         {"<< "}
//                                     </span>
//                                     <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
//                                         {"< "}
//                                     </span>
//                                     <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
//                                         {" >"}
//                                     </span>
//                                     <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
//                                         {" >>"}
//                                     </span>
//                                 </div>
//                             </div>
//                         </CardBody>
//                     </>
//                 )}
//             </Card>
//         </div>
//     );
// }

// export default LogRecord;
import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
    Input,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';
import EmployeeLog from './EmployeeLog'; // Import the new component

export function LogRecord() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/get/all/users`, {
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                });
                if (!employeeResponse.ok) {
                    throw new Error(`Failed to fetch employee data: ${employeeResponse.status}`);
                }
                const employeeData = await employeeResponse.json();
                setEmployees(employeeData.users);
            } catch (error) {
                message.error("Error fetching employees", error.message);
            }
        };

        fetchEmployees();
    }, [auth.token]);

    const data = useMemo(() => (employees ? employees : []), [employees]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = useMemo(() => {
        return data.filter(({ firstName, lastName, email }) => {
            const fullName = `${firstName} ${lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase()) || email.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);

    const columns = useMemo(
        () => [
            {
                Header: 'Employee Details',
                accessor: 'firstName',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                        <Avatar src={`http://localhost:4444/${row.original.image}`} alt={row.original.name} size="sm" variant="rounded" />
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                {row.original.firstName}&nbsp;{row.original.lastName}
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
                            {row.original.role}
                        </Typography>
                    </div>
                ),
            },
            {
                Header: 'View Detail',
                accessor: 'viewDetail',
                Cell: ({ row }) => (
                    <Button className="text-xs font-semibold" onClick={() => handleView(row.original._id)}>
                        View
                    </Button>
                ),
            },
        ],
        []
    );

    const handleView = (id) => {
        console.log(`View button clicked for employee ID: ${id}`);
        setSelectedEmployeeId(id);
    };

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
            data: filteredData,
            initialState: { pageIndex: 0, pageSize },
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
    };

    console.log(`selectedEmployeeId: ${selectedEmployeeId}`);

    if (selectedEmployeeId) {
        return <EmployeeLog employeeId={selectedEmployeeId} onBack={() => setSelectedEmployeeId(null)} />;
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        User Details
                    </Typography>
                    <Input
                        label="Search with the employee name"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-white text-black"
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
                                Page {pageIndex + 1} of {Math.ceil(filteredData.length / pageSize)}
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
                            <Button onClick={() => previousPage()} disabled={!canPreviousPage} className='text-xs font-semibold'>
                                {"<"}
                            </Button>
                            <Button onClick={() => nextPage()} disabled={!canNextPage} className='text-xs font-semibold'>
                                {">"}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default LogRecord;
