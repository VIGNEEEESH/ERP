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
                        <Avatar src={`${import.meta.env.REACT_APP_BACKEND_URL}/${row.original.image}`} alt={row.original.name} size="sm" variant="rounded" />
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
        gotoPage,
        pageCount,
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

    if (selectedEmployeeId) {
        return <EmployeeLog employeeId={selectedEmployeeId} onBack={() => setSelectedEmployeeId(null)} />;
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Log Record
                    </Typography>
                    <Input
                        placeholder="Search with the employee name"
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
                        <div className='flex items-center' style={{ marginLeft: '10px' }}>
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
                        <div className="mt-4 flex justify-between items-center">
                            <div className='p-2 mr-4'>
                                <span onClick={() => gotoPage(0)} disabled={!canPreviousPage} className='cursor-pointer'>
                                    {"<< "}
                                </span>
                                <span onClick={previousPage} disabled={!canPreviousPage} className='cursor-pointer'>
                                    {"< "}
                                </span>
                                <span onClick={nextPage} disabled={!canNextPage} className='cursor-pointer'>
                                    {" >"}
                                </span>
                                <span onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className='cursor-pointer'>
                                    {" >>"}
                                </span>
                            </div>
</div>
</div>
</CardBody>
</Card>
</div>
);
}

export default LogRecord;
