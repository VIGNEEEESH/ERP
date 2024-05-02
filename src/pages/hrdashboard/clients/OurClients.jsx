import React, { useState,useMemo, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button 
} from "@material-tailwind/react";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useTable, usePagination } from 'react-table';
import AddClient from './AddClient';
import { message } from 'antd';

const customTableData = [
    {
        companyImg: "/img/team-1.jpeg",
        companyName: "Company A",
        personName: "John Doe",
        personDesignation: "Founder",
        email: "john.doe@example.com",
        phone: "+1 123-456-7890"
    },
    {
        companyImg: "/img/team-2.jpeg",
        companyName: "Company B",
        personName: "Jane Doe",
        personDesignation: "Head of the Department",
        email: "jane.doe@example.com",
        phone: "+1 987-654-3210"
    },
    {
        companyImg: "/img/team-3.jpeg",
        companyName: "Company C",
        personName: "Emily Smith",
        personDesignation: "Marketing Manager",
        email: "emily.smith@example.com",
        phone: "+1 111-222-3333"
    },
    {
        companyImg: "/img/team-4.jpeg",
        companyName: "Company D",
        personName: "Michael Johnson",
        personDesignation: "Sales Manager",
        email: "michael.johnson@example.com",
        phone: "+1 444-555-6666"
    },
    {
        companyImg: "/img/team-5.jpeg",
        companyName: "Company E",
        personName: "Sophia Williams",
        personDesignation: "HR Manager",
        email: "sophia.williams@example.com",
        phone: "+1 777-888-9999"
    },
    {
        companyImg: "/img/team-6.jpeg",
        companyName: "Company F",
        personName: "James Brown",
        personDesignation: "IT Manager",
        email: "james.brown@example.com",
        phone: "+1 101-112-1314"
    },
    {
        companyImg: "/img/team-7.jpeg",
        companyName: "Company G",
        personName: "Olivia Davis",
        personDesignation: "Finance Manager",
        email: "olivia.davis@example.com",
        phone: "+1 151-617-1819"
    },
    {
        companyImg: "/img/team-8.jpeg",
        companyName: "Company H",
        personName: "Liam Wilson",
        personDesignation: "Operations Manager",
        email: "liam.wilson@example.com",
        phone: "+1 202-122-2324"
    },
    {
        companyImg: "/img/team-9.jpeg",
        companyName: "Company I",
        personName: "Ava Martinez",
        personDesignation: "Customer Support",
        email: "ava.martinez@example.com",
        phone: "+1 252-627-2829"
    },
    {
        companyImg: "/img/team-10.jpeg",
        companyName: "Company J",
        personName: "Noah Anderson",
        personDesignation: "Product Manager",
        email: "noah.anderson@example.com",
        phone: "+1 303-243-3445"
    }
];


export function OurClients() {
    const [showAddClient, setShowAddClient] = useState(false);
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const fetchClients = async () => {
          try {
            const response = await fetch(
              "http://localhost:4444/api/erp/client/get/all/clients"
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
      }, []);
    //   const data = useMemo(() => (employees ? employees : []), [employees]);
    
    const columns = useMemo(
        () => [
            
            {
                Header: 'Company Name',
                accessor: 'companyName',
            },
            {
                Header: 'Client Name',
                accessor: 'clientName',
            },
            {
                Header: 'Mobile',
                accessor: 'mobile',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Projects',
                accessor: 'projects',
                Cell: ({ value }) => (
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                        {value.join(', ')}
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

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h5" color="white">
                    {showAddClient ? 'Add Client' : 'Our Clients'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddClient(!showAddClient)}>
                        <span>{showAddClient? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
                        {showAddClient ? 'Cancel' : 'Add Client'}
                    </Button>
                </CardHeader>
                {showAddClient ? (
                    <AddClient/>
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
                    <div className='flex items-center'>
                        <Typography className="text-sm text-blue-gray-600">
                            Page {pageIndex + 1} of {Math.ceil(customTableData.length / pageSize)}
                        </Typography>
                        <select 
                            value={pageSize} 
                            onChange={(e) => setPageSize(Number(e.target.value))} // Use setPageSize here
                            className="ml-2 border rounded px-2 py-1"
                        >
                            {[5, 10, 15].map((size) => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                        <div className='p-2 mr-4'>
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
            </Card>
        </div>
    );
}

export default OurClients;
