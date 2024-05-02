// import React from 'react';
// import {
//     Card,
//     CardHeader,
//     CardBody,
//     Typography,
//     Avatar,
//     Button
// } from "@material-tailwind/react";
// import { leaveApplicationsData } from "@/data";

// export function Leave() {
// const handleApprove = (name) => {
//     console.log(`Approved leave for ${name}`);
// };

// const handleDecline = (name) => {
//     console.log(`Declined leave for ${name}`);
// };
//     return (
//         <div className="mt-12 mb-8 flex flex-col gap-12">
//             <Card>
//                 <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
//                     <Typography variant="h6" color="white">
//                         Employee Leave Approval
//                     </Typography>
//                 </CardHeader>
//                 <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//                     <table className="w-full min-w-[640px] table-auto">
//                         <thead>
//                             <tr>
//                                 {["Image", "Name", "Email", "Message", "Start Date", "End Date", "Action"].map((el) => (
//                                     <th
//                                         key={el}
//                                         className="border-b border-blue-gray-50 py-3 px-5 text-left"
//                                     >
//                                         <Typography
//                                             variant="small"
//                                             className="text-[11px] font-bold uppercase text-blue-gray-400"
//                                         >
//                                             {el}
//                                         </Typography>
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leaveApplicationsData.map(
//                                 ({ img, name, email, message, startDate, endDate }, key) => {
//                                     const className = `py-3 px-5 ${
//                                         key === leaveApplicationsData.length - 1
//                                             ? ""
//                                             : "border-b border-blue-gray-50"
//                                     }`;

//                                     return (
//                                         <tr key={name}>
//                                             <td className={className}>
//                                                 <Avatar src={img} alt={name} size="sm" variant="rounded" />
//                                             </td>
//                                             <td className={className}>
//                                                 <Typography className="text-xs font-semibold text-blue-gray-600">
//                                                     {name}
//                                                 </Typography>
//                                             </td>
//                                             <td className={className}>
//                                                 <Typography className="text-xs font-normal text-blue-gray-500">
//                                                     {email}
//                                                 </Typography>
//                                             </td>
//                                             <td className={className}>
//                                                 <Typography className="text-xs font-normal text-blue-gray-500">
//                                                     {message}
//                                                 </Typography>
//                                             </td>
//                                             <td className={className}>
//                                                 <Typography className="text-xs font-normal text-blue-gray-500">
//                                                     {startDate}
//                                                 </Typography>
//                                             </td>
//                                             <td className={className}>
//                                                 <Typography className="text-xs font-normal text-blue-gray-500">
//                                                     {endDate}
//                                                 </Typography>
//                                             </td>
//                                             <td className={className}>
//                                                 <div className="flex gap-2">
//                                                     <Button
//                                                         color="green"
//                                                         size="sm"
//                                                         onClick={() => handleApprove(name)}
//                                                     >
//                                                         Approve
//                                                     </Button>
//                                                     <Button
//                                                         color="red"
//                                                         size="sm"
//                                                         onClick={() => handleDecline(name)}
//                                                     >
//                                                         Decline
//                                                     </Button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 }
//                             )}
//                         </tbody>
//                     </table>
//                 </CardBody>
//             </Card>
//         </div>
//     );
// }

// export default Leave;
import React, { useMemo, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { leaveApplicationsData } from "@/data";


export function Leave() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);

    const data = useMemo(() => leaveApplicationsData, []);

    const columns = useMemo(() => [
        {
            Header: 'Image',
            accessor: 'img',
            Cell: ({ value }) => <Avatar src={value} size="sm" variant="rounded" />,
        },
        {
            Header: 'Name',
            accessor: 'name',
            Cell: ({ value }) => <Typography className="text-xs font-semibold text-blue-gray-600">{value}</Typography>,
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'Message',
            accessor: 'message',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'Start Date',
            accessor: 'startDate',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'End Date',
            accessor: 'endDate',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'Action',
            accessor: 'id',
            Cell: ({ value }) => (
                <div className="flex gap-2">
                    <Button color="green" size="sm" onClick={() => handleApprove(value)}>
                        Approve
                    </Button>
                    <Button color="red" size="sm" onClick={() => handleDecline(value)}>
                        Decline
                    </Button>
                </div>
            ),
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageCount,
        prepareRow
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex, pageSize },
            pageCount: Math.ceil(data.length / pageSize),
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        setPageIndex(0);  // Reset pageIndex when pageSize changes
    };

    const handleApprove = (id) => {
        console.log(`Approved leave for ID: ${id}`);
    };

    const handleDecline = (id) => {
        console.log(`Declined leave for ID: ${id}`);
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Employee Leave Approval
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table {...getTableProps()} className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {headerGroups.map(headerGroup => (
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                            <Typography
                                                variant="small"
                                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                                            >
                                                {column.render('Header')}
                                            </Typography>
                                        </th>
                                    ))
                                ))}
                            </tr>
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(
                                (row) => {
                                    prepareRow(row);
                                    const { id, img, name, email, message, startDate, endDate } = row.original;
                                    const className = `py-3 px-5`;

                                    return (
                                        <tr {...row.getRowProps()} key={id}>
                                            {row.cells.map((cell) => (
                                                <td {...cell.getCellProps()} className={className}>
                                                    {cell.render('Cell', { id, img, name, email, message, startDate, endDate })}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center">
                        <div className='flex items-center'>
                            <Typography className="text-sm text-blue-gray-600">
                                Page {pageIndex + 1} of {pageCount}
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
                            <button onClick={() => setPageIndex((prevIndex) => prevIndex - 1)} disabled={!canPreviousPage} className='cursor-pointer'>
                                {"< "}
                            </button>
                            <button onClick={() => setPageIndex((prevIndex) => prevIndex + 1)} disabled={!canNextPage} className='cursor-pointer'>
                                {" >"}
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default Leave;