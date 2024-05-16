import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function EmployeeLog({ employeeId, onBack }) {
    const [logs, setLogs] = useState([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/logs/get/${employeeId}`, {
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                });
                if (!logResponse.ok) {
                    throw new Error(`Failed to fetch log data: ${logResponse.status}`);
                }
                const logData = await logResponse.json();
                setLogs(logData.logs);
            } catch (error) {
                message.error("Error fetching logs", error.message);
            }
        };

        fetchLogs();
    }, [employeeId, auth.token]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
            },
            {
                Header: 'Work Done',
                accessor: 'workDone',
            },
            {
                Header: 'Update',
                accessor: 'update',
                Cell: ({ row }) => (
                    <Button onClick={() => handleUpdate(row.original)}>
                        Update
                    </Button>
                ),
            },
            {
                Header: 'Delete',
                accessor: 'delete',
                Cell: ({ row }) => (
                    <Button onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </Button>
                ),
            },
        ],
        []
    );

    const handleUpdate = (log) => {
        // Implement the logic to update the log record
        console.log('Update log:', log);
    };

    const handleDelete = async (logId) => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/logs/delete/${logId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete log: ${response.status}`);
            }
            setLogs(logs.filter(log => log.id !== logId));
            message.success('Log deleted successfully');
        } catch (error) {
            message.error("Error deleting log", error.message);
        }
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
            data: logs,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        usePagination
    );

    return (
        <Card className='mt-12 mb-8 flex flex-col gap-12'>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                <Typography variant="h6" color="white">
                    Log Records
                </Typography>
                <Button onClick={onBack} className="text-xs font-semibold">
                    Back
                </Button>
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
                    <Typography className="text-sm text-blue-gray-600">
                        Page {pageIndex + 1} of {Math.ceil(logs.length / 5)}
                    </Typography>
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
    );
}

export default EmployeeLog;
