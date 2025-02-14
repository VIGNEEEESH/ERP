import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button, Input
} from "@material-tailwind/react";
import { ArrowLeftIcon, UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useTable, usePagination } from 'react-table';
import AddClient from './AddClient';
import { Modal, message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';

export function OurClients() {
    const [showAddClient, setShowAddClient] = useState(false);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/client/get/all/clients`, { headers: { Authorization: "Bearer " + auth.token } }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setClients(data.clients);
            } catch (err) {
                message.error("Error fetching clients:", err.message);
            }
        };
        fetchClients();
    }, [auth.token]);

    const columns = useMemo(
        () => [
            { Header: 'Company Name', accessor: 'companyName' },
            { Header: 'Client Name', accessor: 'clientName' },
            { Header: 'Mobile', accessor: 'mobile' },
            { Header: 'Email', accessor: 'email' },
            {
                Header: 'Projects',
                accessor: 'projects',
                Cell: ({ value }) => (
                    <ul className="text-xs font-semibold text-blue-gray-600 list-disc pl-4">
                        {value.map((project, index) => (
                            <li key={index}>{project}</li>
                        ))}
                    </ul>
                ),
            },
            {
                Header: '',
                accessor: 'edit',
                Cell: ({ row }) => (
                    <Typography as="a" href="#" className="text-xs font-semibold text-blue-gray-600 flex" onClick={() => handleUpdateClick(row.original)}>
                        <PencilIcon className="h-4 w-4 mr-2" />Edit
                    </Typography>
                ),
            },
            {
                Header: 'Delete',
                accessor: 'delete',
                Cell: ({ row }) => (
                    <Typography onClick={() => handleDeleteClick(row.original)} className='cursor-pointer'>
                        <TrashIcon className="h-5 w-5" />
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
        gotoPage,
        pageCount,
        state: { pageIndex, pageSize },
        prepareRow,
        setPageSize
    } = useTable(
        {
            columns,
            data: clients,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        usePagination
    );

    const handleUpdateClick = (client) => {
        setSelectedClient(client);
        setShowUpdateModal(true);
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/client/delete/client/byid/${clientToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + auth.token,
                },
            });

            if (response.ok) {
                setClients(clients.filter(client => client._id !== clientToDelete._id));
                setShowDeleteModal(false);
                setClientToDelete(null);
                message.success("Client successfully deleted");
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedClient(null);
    };

    const handleUpdate = async (client) => {
        try {
            const emptyFields = Object.keys(client).filter((key) => !client[key]);

            if (emptyFields.length > 0) {
                const errorMessage = `Please fill in the following fields: ${emptyFields.join(', ')}`;
                message.error(errorMessage);
                return;
            }

            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/client/update/client/byid/${client._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
                body: JSON.stringify(client)
            });

            if (!response.ok) {
                throw new Error("Something went wrong, please try again");
            }

            setClients(clients.map(c => (c._id === client._id ? client : c)));
            message.success("Client updated successfully");
            setShowUpdateModal(false);
            setSelectedClient(null);
        } catch (err) {
            message.error("Something went wrong, please try again");
        }
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h5" color="white">
                        {showAddClient ? 'Add Client' : 'Our Clients'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddClient(!showAddClient)}>
                        <span>{showAddClient ? <ArrowLeftIcon className="h-4 w-4 mr-2" /> : <UserPlusIcon className="h-4 w-4 mr-2" />}</span>
                        {showAddClient ? 'Cancel' : 'Add Client'}
                    </Button>
                </CardHeader>
                {showAddClient ? (
                    <AddClient />
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
                        <div className="mt-4 flex justify-between items-center">
                            <div className='flex items-center' style={{ marginLeft: '10px' }}>
                                <Typography className="text-sm text-blue-gray-600">
                                    Page {pageIndex + 1} of {Math.ceil(clients.length / pageSize)}
                                </Typography>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
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
                    </CardBody>
                )}
            </Card>
            <Modal
                title="Delete Client"
                open={showDeleteModal}
                onOk={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                okButtonProps={{ style: { backgroundColor: 'black' } }}
            >
                <p>Are you sure you want to delete this Client?</p>
                {clientToDelete && (
                    <div>
                        <p>Company Name: {clientToDelete.companyName}</p>
                        <p>Client Name: {clientToDelete.clientName}</p>
                    </div>
                )}
            </Modal>
            <Modal
                title="Update Client"
                open={showUpdateModal}
                onCancel={handleCloseUpdateModal}
                footer={null}
            >
                {selectedClient && (
                    <UpdateClientForm
                        client={selectedClient}
                        onUpdate={handleUpdate}
                    />
                )}
            </Modal>
        </div>
    );
}

function UpdateClientForm({ client, onUpdate }) {
    const [updatedClientData, setUpdatedClientData] = useState({ ...client });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedClientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProjectChange = (index, e) => {
        const projects = [...updatedClientData.projects];
        projects[index] = e.target.value;
        setUpdatedClientData(prevData => ({
            ...prevData,
            projects
        }));
    };

    const handleAddProject = () => {
        const projects = [...updatedClientData.projects, ""];
        setUpdatedClientData(prevData => ({
            ...prevData,
            projects
        }));
    };

    const handleRemoveProject = (index) => {
        const projects = [...updatedClientData.projects];
        projects.splice(index, 1);
        setUpdatedClientData(prevData => ({
            ...prevData,
            projects
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedClientData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
                <div className="w-1/2 pr-4 mb-4">
                    <Input type="text" id="companyName" name="companyName" value={updatedClientData.companyName} onChange={handleChange} label='Company Name' />
                </div>
                <div className="w-1/2 pl-4 mb-4">
                    <Input type="text" id="clientName" name="clientName" value={updatedClientData.clientName} onChange={handleChange} label='Client Name' />
                </div>
            </div>
            <div className="mb-4">
                <Input type="text" id="mobile" name="mobile" value={updatedClientData.mobile} onChange={handleChange} label='Mobile' />
            </div>
            <div className="mb-4">
                <Input type="email" id="email" name="email" value={updatedClientData.email} onChange={handleChange} label='Email' />
            </div>
            <div className="mb-4">
                <label>Projects:</label>
                {updatedClientData.projects.map((project, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <Input type="text" value={project} onChange={(e) => handleProjectChange(index, e)} className='mr-2' />
                        <Button onClick={() => handleRemoveProject(index)} className='mt-2'>Remove</Button>
                    </div>
                ))}
                <Button onClick={handleAddProject}>Add Project</Button>
            </div>
            <Button type="submit">Update</Button>
        </form>
    );
}

export default OurClients;
