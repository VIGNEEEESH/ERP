import React, { useEffect, useMemo, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { PencilIcon, UserPlusIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { authorsTableData } from "@/data";
import AddEmployeeForm from "./AddEmployee";
import AddEmployeeShort from './AddEmployeeShort';
import EditEmployee from './EditEmployee'; // Import EditEmployee component
import { message,Modal } from 'antd';

export function ManageEmployees() {
    
    const [pageSize, setPageSize] = useState(5);
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
    const [editEmployeeData, setEditEmployeeData] = useState(null);
    const [showEditEmployee, setShowEditEmployee] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null); 
    useEffect(() => {
        const fetchEmployees = async () => {
            
          try {
            const response = await fetch(
                import.meta.env.REACT_APP_BACKEND_URL+ `/api/erp/user/get/all/users`
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setEmployees(data.users);
            
          } catch (err) {
            message.error("Error fetching employees", err.message);
          }
        };
        fetchEmployees()
      }, []);

      const data = useMemo(() => (employees ? employees : []), [employees])
    
    const columns = useMemo(
        () => [
            {
                Header: 'Employee Details',
                accessor: 'firstName',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-4">
                        <Avatar src={`http://localhost:4444/${row.original.image}`} alt={row.original.name} size="sm" variant="rounded" />
                        <div>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                            >
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
                Cell: ({ value }) => (
                    <div>
                       
                        <Typography className="text-xs font-normal text-blue-gray-500">
                            {value}
                        </Typography>
                    </div>
                ),
            },
            {
                Header: 'Mobile',
                accessor: 'mobile',
                Cell: ({ value }) => (
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {value}
                    </Typography>
                ),
            },
            // {
            //     Header: 'Salary',
            //     accessor: 'salary',
            //     Cell: ({ value }) => (
            //         <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600">
            //             50,000
            //         </Typography>
            //     ),
            // },
            {
                Header: '',
                accessor: 'edit',
                Cell: ({ row }) => (
                    <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600 flex" onClick={() => handleEditClick(row)}>
                        <PencilIcon className="h-4 w-4 mr-2"/>Edit
                    </Typography>
                ),
            },
            {
                Header: '',
                accessor: 'Delete',
                Cell: ({ row }) => (
                    <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600 flex" onClick={() => handleDeleteClick(row)}>
                        <TrashIcon className="h-4 w-4 mr-2"/>
                    </Typography>
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
        setPageSize: setTablePageSize,
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
        setTablePageSize(newSize);
    };

    const handleEditClick = (rowData) => {
        setEditEmployeeData(rowData.original);
        setShowEditEmployee(true);
    };

    const handleCloseEdit = () => {
        setShowEditEmployee(false);
        setEditEmployeeData(null);
    };
    const handleDeleteClick = (rowData) => {
        setEmployeeToDelete(rowData.original);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
    };

// Inside ManageEmployees component

// Update handleConfirmDelete function to send a delete request to the backend
const handleConfirmDelete = async () => {
    try {
        
        // Make a delete request to your backend API using fetch
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/user/delete/user/byid/${employeeToDelete._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if required
            },
        });

        // Check if the request was successful (status code 200-299)
        if (response.ok) {
            console.log(employees)
            // If the request is successful, remove the deleted employee from the local state
            setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));

            // Close the modal
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
            message.success("Employee deleted successfully");
        } else {
            // If the request failed, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        // Handle error (e.g., show error message)
        console.error('Error deleting employee:', error);
        // You can show an error message to the user here
    }
};


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        {showAddEmployeeForm ? 'Add Employee' : 'Manage Employees'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddEmployeeForm(!showAddEmployeeForm)}>
                        <span>{showAddEmployeeForm ? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
                        {showAddEmployeeForm ? 'Cancel' : 'Add Employee'}
                    </Button>
                </CardHeader>
                {showEditEmployee && (
                <EditEmployee employeeData={editEmployeeData} onClose={handleCloseEdit} />
                )}
                {showAddEmployeeForm ? (
                    <>
                        <AddEmployeeShort />
                        {/* <div className="flex justify-center items-center  w-full">
                            <hr className="border-t-2 border-gray-300 w-full"/>
                            <span className="mx-4 text-gray-500">OR</span>
                            <hr className="border-t-2 border-gray-300 w-full"/>
                        </div>
                        <AddEmployeeForm /> */}
                    </>
                ) : (
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
                )}
                <Modal

                title="Delete Employee"
                open={showDeleteModal}
                onOk={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                okButtonProps={{ style: { backgroundColor: 'black' } }}
            >
                <p>Are you sure you want to delete this employee?</p>
                {employeeToDelete && (
                    <p>Name: {employeeToDelete.firstName} {employeeToDelete.lastName}</p>
                )}
            </Modal>
        
            </Card>

        </div>
    );
}

export default ManageEmployees;
