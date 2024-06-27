import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message, Modal, Select } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this is imported

const { Option } = Select;

export function EmployeeLog({ employeeId, onBack }) {
    const [logs, setLogs] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmUpdateModalVisible, setConfirmUpdateModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [updateInput, setUpdateInput] = useState("");
    const [filterInterval, setFilterInterval] = useState('weekly'); // Default filter interval
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

    const handleUpdate = async (log) => {
        try {
            const updatedLog = { ...log, workDone: updateInput };
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/work/update/work/byid/${log._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                },
                body: JSON.stringify(updatedLog),
            });
            if (!response.ok) {
                throw new Error(`Failed to update log: ${response.status}`);
            }
            setLogs(logs.map(l => (l._id === log._id ? updatedLog : l)));
            message.success('Log updated successfully');
            setConfirmUpdateModalVisible(false);
        } catch (error) {
            message.error("Error updating log: " + error.message);
        }
    };

    const handleDelete = async (logId) => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/work/delete/work/byid/${logId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to delete log: ${response.status}`);
            }
            setLogs(logs.filter(log => log._id !== logId));
            message.success('Log deleted successfully');
            setConfirmModalVisible(false);
        } catch (error) {
            message.error("Error deleting log: " + error.message);
        }
    };

    const showDeleteModal = (logId) => {
        setSelectedLog(logId);
        setConfirmModalVisible(true);
    };

    const showUpdateModal = (log) => {
        setSelectedLog(log);
        setUpdateInput(log.workDone); // Set input field with current work done
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

    const handleFilterChange = (value) => {
        setFilterInterval(value);
    };

    const handlePDFDownload = () => {
        let filteredLogs = [];

        switch (filterInterval) {
            case 'weekly':
                filteredLogs = filterLogsByWeekly();
                break;
            case 'monthly':
                filteredLogs = filterLogsByMonthly();
                break;
            case 'yearly':
                filteredLogs = filterLogsByYearly();
                break;
            default:
                filteredLogs = logs;
        }

        if (filteredLogs.length > 0) {
            const doc = new jsPDF();
            const tableRows = [];

            filteredLogs.forEach((log, index) => {
                const rowData = [
                    index + 1,
                    new Date(log.date).toLocaleDateString(),
                    log.workDone,
                ];
                tableRows.push(rowData);
            });

            doc.autoTable({
                head: [['#', 'Date', 'Work Done']],
                body: tableRows,
            });

            doc.save(`logs_${filterInterval}.pdf`);
        } else {
            message.warning('No logs available to download.');
        }
    };

    const filterLogsByWeekly = () => {
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        return logs.filter(log => {
            const logDate = new Date(log.date); // Assuming log.date is a valid date string or Date object
            return logDate >= oneWeekAgo && logDate <= currentDate;
        });
    };

    const filterLogsByMonthly = () => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        return logs.filter(log => {
            const logDate = new Date(log.date); // Assuming log.date is a valid date string or Date object
            return logDate >= startOfMonth && logDate <= endOfMonth;
        });
    };

    const filterLogsByYearly = () => {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

        return logs.filter(log => {
            const logDate = new Date(log.date); // Assuming log.date is a valid date string or Date object
            return logDate >= startOfYear && logDate <= endOfYear;
        });
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
        gotoPage,
        pageCount,
        state: { pageIndex },
        prepareRow,
    } = useTable(
        {
            columns,
            data: logs,
            initialState: { pageIndex: 0, pageSize},
        },
        usePagination
    );

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
    };


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
                <div className="flex flex-col items-center mb-8 gap-4">
                    <div className="flex items-center">
                        <Typography className="mr-4">Filter by:</Typography>
                        <Select value={filterInterval} style={{ width: 120 }} onChange={handleFilterChange}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </div>
                    <Button onClick={handlePDFDownload}>
                        Download PDF
                    </Button>
                </div>
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
                    <div className="flex items-center" style={{ marginLeft: '20px' }}>
                        <Typography className="text-sm text-blue-gray-600">
                            Page {pageIndex + 1} of {pageCount}
                        </Typography>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="ml-2 border rounded px-2 py-1"
                        >
                            {[5, 10, 15].map(size => (
                                <option key={size} value={size}>Show {size}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <span onClick={() => gotoPage(0)} disabled={!canPreviousPage} className='cursor-pointer'>
                            {"<< "}
                        </span>
                        <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
                            {"< "}
                        </span>
                        <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
                            {" >"}
                        </span>
                        <span onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className='cursor-pointer'>
                            {" >>"}
                        </span>
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
                title="Update Log"
                visible={confirmUpdateModalVisible}
                onOk={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
                okType='default'
                okText="Update"
                cancelText="Cancel"
            >
                <textarea
                    value={updateInput}
                    onChange={(e) => setUpdateInput(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Update the work done"
                />
            </Modal>
        </Card>
    );
}

export default EmployeeLog;
