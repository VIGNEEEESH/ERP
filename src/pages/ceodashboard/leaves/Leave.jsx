import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function Leave() {
    const [pageSize, setPageSize] = useState(5);
    const [leaves, setLeaves] = useState([]);
const auth=useContext(AuthContext)
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/get/all/leaves`,{headers:{Authorization:"Bearer "+auth.token}}
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setLeaves(data.leaves.reverse());

            } catch (err) {
                message.error("Error fetching leaves:", err.message);
            }
        };
        fetchLeaves();
    }, []);
    const data = useMemo(() => (leaves ? leaves : []), [leaves]);
    const columns = useMemo(() => [
        {
            Header: 'First Name',
            accessor: 'firstName',
            Cell: ({ value }) => <Typography className="text-xs font-semibold text-blue-gray-600">{value}</Typography>,
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
            Cell: ({ value }) => <Typography className="text-xs font-semibold text-blue-gray-600">{value}</Typography>,
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'Reason',
            accessor: 'reason',
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
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
        },
        {
            Header: 'Action',
            accessor: '_id',
            Cell: ({ value, row }) => {
                const status = row.original.status;
                if (status === 'Approved') {
                    return null; // Don't render action buttons if status is approved
                }
                return (
                    <div className="flex gap-2">
                        <Button color="green" size="sm" onClick={() => handleApprove(value)}>
                            Approve
                        </Button>
                        <Button color="red" size="sm" onClick={() => handleDecline(value)}>
                            Decline
                        </Button>
                    </div>
                );
            },
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
        state: { pageIndex },
        prepareRow,
        setPageSize: setTablePageSize,
    } = useTable(
        {
            columns,
            data: leaves,
            initialState: { pageIndex:0, pageSize },
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        setTablePageSize(newSize);
      };

    const handleApprove = async (_id) => {
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/update/leavestatus/byid/${_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    },
                    body: JSON.stringify({ status: "Approved" }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            message.success(`Leave approved successfully`);
            setTimeout(()=>{
                window.location.reload()
            },[500])
        } catch (error) {
            message.error(`Error approving leave: ${error.message}`);
        }
    };

    const handleDecline = async (_id) => {
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/update/leavestatus/byid/${_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    },
                    body: JSON.stringify({ status: "Declined" }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            message.success(`Leave declined successfully`);
            setTimeout(()=>{
                window.location.reload()
            },[500])
        } catch (error) {
            message.error(`Error declining leave: ${error.message}`);
        }
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
                                    const { id, firstName, lastName, email, reason, startDate, endDate } = row.original;
                                    const className = `py-3 px-5`;

                                    return (
                                        <tr {...row.getRowProps()} key={id}>
                                            {row.cells.map((cell) => (
                                                <td {...cell.getCellProps()} className={className}>
                                                    {cell.render('Cell', { id, firstName, lastName, email, reason, startDate, endDate })}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 ml-2 flex justify-between items-center">
                            <div className='flex items-center'>
                                <Typography className="text-sm text-blue-gray-600">
                                    Page {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
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
                            <div className='mr-4'>
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
            </Card>
        </div>
    );
}

export default Leave;
