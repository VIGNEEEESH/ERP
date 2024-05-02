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
// import AttendanceCalendar from "./AttendenceCalender";
// import { authorsTableData } from "@/data";
// import { useState } from "react";

// export function AttendenceTracker() {
//     const [showCalendar, setShowCalendar] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');

//     const filteredAuthorsTableData = authorsTableData.filter(({ name, email,job }) =>
//         name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const handleViewClick = (employee) => {
//         setSelectedEmployee(employee);
//         setShowCalendar(true);
//     };
    

//     const mockAttendanceData = {
//         '2024-04-01': 'present',
//         '2024-04-02': 'leave',
//         '2024-04-03': 'absent',
//         // Add more entries as needed
//     };

//     return (
//         <div className="mt-12 mb-8 flex flex-col gap-12">
//             <Card>
//                 {showCalendar ? (
//                     <AttendanceCalendar attendanceData={mockAttendanceData} />
//                 ) : (
//                     <>
//                         <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
//                             <Typography variant="h6" color="white">
//                                 Attendence Tracker
//                             </Typography>
//                             <Input
//                                 label="Search with the employee name"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className=" w-full bg-white text-black"
//                             />
//                         </CardHeader>
//                         <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//                             <table className="w-full min-w-[640px] table-auto">
//                                 <thead>
//                                     <tr>
//                                         {["Employee Details", "Designation", "status", "view Detail"].map((el) => (
//                                             <th
//                                                 key={el}
//                                                 className="border-b border-blue-gray-50 py-3 px-5 text-left"
//                                             >
//                                                 <Typography
//                                                     variant="small"
//                                                     className="text-[11px] font-bold uppercase text-blue-gray-400"
//                                                 >
//                                                     {el}
//                                                 </Typography>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredAuthorsTableData.map(
//                                         ({ img, name, email, job, online, date }, key) => {
//                                             const className = `py-3 px-5 ${key === filteredAuthorsTableData.length - 1
//                                                 ? ""
//                                                 : "border-b border-blue-gray-50"}`;

//                                             return (
//                                                 <tr key={name}>
//                                                     <td className={className}>
//                                                         <div className="flex items-center gap-4">
//                                                             <Avatar src={img} alt={name} size="sm" variant="rounded" />
//                                                             <div>
//                                                                 <Typography
//                                                                     variant="small"
//                                                                     color="blue-gray"
//                                                                     className="font-semibold"
//                                                                 >
//                                                                     {name}
//                                                                 </Typography>
//                                                                 <Typography className="text-xs font-normal text-blue-gray-500">
//                                                                     {email}
//                                                                 </Typography>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className={className}>
//                                                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                                                             {job[0]}
//                                                         </Typography>
//                                                         <Typography className="text-xs font-normal text-blue-gray-500">
//                                                             {job[1]}
//                                                         </Typography>
//                                                     </td>
//                                                     <td className={className}>
//                                                         <Chip
//                                                             variant="gradient"
//                                                             color={online ? "green" : "blue-gray"}
//                                                             value={online ? "online" : "offline"}
//                                                             className="py-0.5 px-2 text-[11px] font-medium w-fit" />
//                                                     </td>
//                                                     <td className={className}>
//                                                         <Button className="text-xs font-semibold" onClick={() => handleViewClick({ img, name, email, job, online, date })}>
//                                                             View
//                                                         </Button>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         }
//                                     )}
//                                 </tbody>
//                             </table>
//                         </CardBody>
//                     </>
//                 )}
//             </Card>
//         </div>
//     );
// }

// export default AttendenceTracker;
import React, { useState, useMemo } from 'react';
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

export function AttendenceTracker() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);

    const data = useMemo(() => authorsTableData, []);

    const columns = useMemo(
        () => [
            {
                Header: 'Employee Details',
                accessor: 'name',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                        <Avatar src={row.original.img} alt={row.original.name} size="sm" variant="rounded" />
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                {row.original.name}
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
                accessor: 'job',
                Cell: ({ value }) => (
                    <div>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                            {value[0]}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                            {value[1]}
                        </Typography>
                    </div>
                ),
            },
            {
                Header: 'Status',
                accessor: 'online',
                Cell: ({ value }) => (
                    <Chip
                        variant="gradient"
                        color={value ? "green" : "blue-gray"}
                        value={value ? "online" : "offline"}
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
            data,
            initialState: { pageIndex: 0, pageSize },
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
    };

    const filteredAuthorsTableData = useMemo(() => 
        data.filter(({ name, email }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [data, searchQuery]
    );

    const handleViewClick = (employee) => {
        setSelectedEmployee(employee);
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
                    <AttendanceCalendar attendanceData={mockAttendanceData} />
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

export default AttendenceTracker;