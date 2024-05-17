import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message, Modal } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function EmployeeLog({ employeeId, onBack }) {
    const [logs, setLogs] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmUpdateModalVisible, setConfirmUpdateModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/work/get/work/byuserid/${employeeId}`, {
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                });
                if (!logResponse.ok) {
                    throw new Error(`Failed to fetch log data: ${logResponse.status}`);
                }
                const logData = await logResponse.json();
                setLogs(logData.work);
            } catch (error) {
                message.error("Error fetching logs: " + error.message);
            }
        };

        fetchLogs();
    }, [employeeId, auth.token]);
    

    const columns = React.useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
               
            },
            {
                Header: 'Work Done',
                accessor: 'workDone',
            },
            {
                Header: 'Update',
                accessor: 'update',
                Cell: ({ row }) => (
                    <Button onClick={() => showUpdateModal(row.original)}>
                        Update
                    </Button>
                ),
            },
            {
                Header: 'Delete',
                accessor: 'delete',
                Cell: ({ row }) => (
                    <Button onClick={() => showDeleteModal(row.original._id)}>
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
        setConfirmUpdateModalVisible(false);
    };

    const handleDelete = async (logId) => {
        try {
            console.log(logId)
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/work/delete/work/byid/${logId}`, {
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
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (error) {
            message.error("Error deleting log: " + error.message);
        }
        setConfirmModalVisible(false);
    };

    const showDeleteModal = (logId) => {
        setSelectedLog(logId);
        setConfirmModalVisible(true);
    };

    const showUpdateModal = (log) => {
        setSelectedLog(log);
        setConfirmUpdateModalVisible(true);
    };

    const handleConfirmDelete = () => {
        handleDelete(selectedLog);
    };

    const handleConfirmUpdate = () => {
        handleUpdate(selectedLog);
    };

    const handleCancelDelete = () => {
        setConfirmModalVisible(false);
    };

    const handleCancelUpdate = () => {
        setConfirmUpdateModalVisible(false);
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
            {/* Confirmation Delete Modal */}
            <Modal
                title="Confirm Delete"
                visible={confirmModalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okType='default'
                okText="Yes"
                cancelText="Cancel"
            >
                Are you sure you want to delete this log?
            </Modal>
            {/* Confirmation Update Modal */}
            <Modal
                title="Confirm Update"
                visible={confirmUpdateModalVisible}
                onOk={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
                okType='default'
                okText="Yes"
                cancelText="Cancel"
            >
                Are you sure you want to update this log?
            </Modal>
        </Card>
    );
}

export default EmployeeLog;
