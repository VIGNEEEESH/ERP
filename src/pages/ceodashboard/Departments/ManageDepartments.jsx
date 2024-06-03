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
import { PencilIcon, UserPlusIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";

import { Modal, message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';
import EditDepartment from './EditDepartment';
import AddDepartment from './AddDepartment';

export function ManageDepartments() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
    const [editDepartmentData, setEditDepartmentData] = useState(null);
    const [showEditDepartment, setShowEditDepartment] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [departments,setDepartments] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null); 
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
            message.error("Error fetching attendance or department", error.message);
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
    
    
    const handleEditClick = (rowData) => {
        setEditDepartmentData(rowData.original);
        setShowEditDepartment(true);
    };

    const handleCloseEdit = () => {
        setShowEditDepartment(false);
        setEditDepartmentData(null);
    };
    const handleDeleteClick = (rowData) => {
        setDepartmentToDelete(rowData.original);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDepartmentToDelete(null);
    };
    
    

    const columns = useMemo(
        () => [
            {
                Header: 'Department Name',
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
    Header: 'Department Head',
    accessor: 'users',
    Cell: ({ row }) => (
        <div>
            {row.original.users.map(user => (
                <Typography key={user._id} className="text-xs font-semibold text-blue-gray-600">
                    {user && user.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                </Typography>
            ))}
        </div>
    ),
},

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
        gotoPage,
        pageCount,
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

const handleConfirmDelete = async () => {
    try {
        
        // Make a delete request to your backend API using fetch
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/department/delete/department/byid/${departmentToDelete._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization:"Bearer "+auth.token,
            },
        });

        // Check if the request was successful (status code 200-299)
        if (response.ok) {
            // If the request is successful, remove the deleted department from the local state
            setDepartments(departments.filter(emp => emp._id !== departmentToDelete._id));

            // Close the modal
            setShowDeleteModal(false);
            setDepartmentToDelete(null);
            message.success("Department deleted successfully");
        } else {
            // If the request failed, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        // Handle error (e.g., show error message)
        console.error('Error deleting department:', error);
        // You can show an error message to the user here
    }
};



    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        {showAddDepartmentForm ? 'Add Department' : 'Manage Departments'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddDepartmentForm(!showAddDepartmentForm)}>
                        <span>{showAddDepartmentForm ? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
                        {showAddDepartmentForm ? 'Cancel' : 'Add Department'}
                    </Button>
                </CardHeader>
                {showEditDepartment && (
                <EditDepartment departmentData={editDepartmentData} onClose={handleCloseEdit} />
                )}
                {showAddDepartmentForm ? (
                    <>
                        <AddDepartment />
                        {/* <div className="flex justify-center items-center  w-full">
                            <hr className="border-t-2 border-gray-300 w-full"/>
                            <span className="mx-4 text-gray-500">OR</span>
                            <hr className="border-t-2 border-gray-300 w-full"/>
                        </div>
                        <AddDepartment /> */}
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
                        </CardBody>)}
                        <Modal

title="Delete Department"
open={showDeleteModal}
onOk={handleConfirmDelete}
onCancel={handleCloseDeleteModal}
okButtonProps={{ style: { backgroundColor: 'black' } }}
>
<p>Are you sure you want to delete this department?</p>
{departmentToDelete && (
    <p>Name: {departmentToDelete.departmentName} </p>
)}
</Modal>
            </Card>
        </div>
    );
}

export default ManageDepartments;
