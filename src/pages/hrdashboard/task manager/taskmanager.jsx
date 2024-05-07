import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import AddTaskForm from "./AddTaskForm"; // Import AddTaskForm component
import EditTaskForm from './EditTaskForm'; // Import EditTaskForm component
import { Progress } from "@material-tailwind/react";
import { Modal, message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

const TaskManager = () => {
    const [pageSize, setPageSize] = useState(5);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [editTaskData, setEditTaskData] = useState(null);
    const [showEditTask, setShowEditTask] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null); 
    const auth=useContext(AuthContext)
    useEffect(() => {
        const fetchTasks = async () => {
            
          try {
            const response = await fetch(
                import.meta.env.REACT_APP_BACKEND_URL+ `/api/erp/task/get/all/tasks`,{headers:{Authorization:"Bearer "+auth.token}}
            );
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setTasks(data.tasks);
            
          } catch (err) {
            message.error("Error fetching tasks", err.message);
          }
        };
        fetchTasks()
      }, []);

    const data = useMemo(() => (tasks ? tasks : []), [tasks]);

    const columns = useMemo(
        () => [
            {
                Header: 'Task Name',
                accessor: 'taskName',
                Cell: ({ row }) => (
                    <div>
                        <Typography className="font-semibold">{row.original.taskName}</Typography>
                    </div>
                ),
            },
            {
                Header: 'Description',
                accessor: 'taskDescription',
                Cell: ({ row }) => (
                    <div>
                        <Typography className="font-semibold">{row.original.taskDescription}</Typography>
                    </div>
                ),
            },
            {
                Header: 'Members',
                accessor: 'members',
                Cell: ({ value }) => (
                    <Typography className="text-xs font-normal text-blue-gray-500">
                        {value.join(', ')}
                    </Typography>
                ),
            },
            {
                Header: 'Deadline',
                accessor: 'deadline',
            },
            {
                Header: 'Assigned Date',
                accessor: 'assignedDate',
            },
            {
                Header: 'Department',
                accessor: 'department',
            },
            {
                Header: 'Progress',
                accessor: 'progress',
                Cell: ({ value }) => (
                    <div className="w-10/12">
                        <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                        >
                            {value}%
                        </Typography>
                        <Progress
                            value={value}
                            variant="gradient"
                            color={value === 100 ? "green" : "gray"}
                            className="h-1"
                        />
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
                Header: 'Action',
                accessor: 'Delete',
                Cell: ({ row }) => (
                    <Typography className='flex' onClick={() => handleDeleteClick(row)}>
                        <TrashIcon strokeWidth={2} className="h-5 w-5 mr-2 cursor-pointer" />
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
        console.log(rowData.original)
        setEditTaskData(rowData.original);
        setShowEditTask(true);
        
        
    };

    const handleCloseEdit = () => {
        setShowEditTask(false);
        setEditTaskData(null);
    };
    const handleDeleteClick = (rowData) => {
        
        setTaskToDelete(rowData.original);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setTaskToDelete(null);
    };




const handleConfirmDelete = async () => {
    try {
        
       
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/task/delete/task/byid/${taskToDelete._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + auth.token,
            },
        });

        
        if (response.ok) {
            
            setTasks(tasks.filter(task => task._id !== taskToDelete._id));

            
            setShowDeleteModal(false);
            setTaskToDelete(null);
            message.success("Employee deleted successfully");
        } else {
            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        message.error("Something went wrong while deleting the task, please try again")
        console.error('Error deleting employee:', error);
       
    }
};

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        {showAddTaskForm ? 'Add Task' : 'Task Manager'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddTaskForm(!showAddTaskForm)}>
                        <span>{showAddTaskForm ? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
                        {showAddTaskForm ? 'Cancel' : 'Add Task'}
                    </Button>
                </CardHeader>
                {showEditTask && (
                    <EditTaskForm taskData={editTaskData} onClose={handleCloseEdit} />
                )}
                {showAddTaskForm ? (
                    <>
                        <AddTaskForm />
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

title="Delete task"
open={showDeleteModal}
onOk={handleConfirmDelete}
onCancel={handleCloseDeleteModal}
okButtonProps={{ style: { backgroundColor: 'black' } }}
>
<p>Are you sure you want to delete this task?</p>
{taskToDelete && (
    <p>Name: {taskToDelete.taskName}</p>
)}
</Modal>
            </Card>
        </div>
    );
}

export default TaskManager;
