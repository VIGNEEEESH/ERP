// import React, { useEffect, useMemo, useState } from 'react';
// import { Card, CardHeader, CardBody, Typography, Avatar,Button } from "@material-tailwind/react";
// import { useTable, usePagination } from 'react-table';
// import { Progress } from "@material-tailwind/react"; 
// import { PencilIcon,UserPlusIcon,ArrowLeftIcon } from '@heroicons/react/24/solid';
// import AddProject from './AddProject';

// // Sample projects data
// const sampleProjectsData = [
//     {
//         id: 1,
//         name: "Project A",
//         members: [
//             { id: 1, name: "John Doe", img: "team-1.jpg" },
//             { id: 2, name: "Jane Doe", img: "jane.jpg" }
//         ],
//         budget: "$10,000",
//         completion: 50
//     },
//     {
//         id: 2,
//         name: "Project B",
//         members: [
//             { id: 3, name: "Alice Smith", img: "alice.jpg" },
//             { id: 4, name: "Bob Smith", img: "bob.jpg" }
//         ],
//         budget: "$15,000",
//         completion: 75
//     },
//     // Add more projects as needed
// ];

// export function Projects({onAddProject}) {
//     const [pageSize, setPageSize] = useState(5);
//     const [projects, setProjects] = useState([]);
//     const [showAddProject, setShowAddProject] = useState(false);


//     useEffect(() => {
//         // Set sample projects data
//         setProjects(sampleProjectsData);
//     }, []);

//     const data = useMemo(() => (projects ? projects : []), [projects]);
//     const handleAddProject = (newProject) => {
//         setProjects([...projects, newProject]);
//         setShowAddProject(false);
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 Header: 'Project Name',
//                 accessor: 'name',
//             },
//             {
//                 Header: 'Members',
//                 accessor: 'members',
//                 Cell: ({ value }) => (
//                     <div>
//                         {value.map((member, index) => (
//                             <Avatar key={index} src={`/img/${member.img}`} alt={member.name} size="xs" variant="circular" className={`cursor-pointer border-2 border-white ${index === 0 ? "" : "-ml-2.5"}`} />
//                         ))}
//                     </div>
//                 ),
//             },
//             {
//                 Header: 'Budget',
//                 accessor: 'budget',
//             },
//             {
//                 Header: 'Progress',
//                 accessor: 'completion',
//                 Cell: ({ value }) => (
//                     <div className="w-10/12">
//                         <Typography
//                             variant="small"
//                             className="mb-1 block text-xs font-medium text-blue-gray-600"
//                         >
//                             {value}%
//                         </Typography>
//                         <Progress
//                             value={value}
//                             variant="gradient"
//                             color={value === 100 ? "green" : "gray"}
//                             className="h-1"
//                         />
//                     </div>
//                 ),
//             },
//             {
//                 Header: 'Action',
//                 accessor: 'update',
//                 Cell: () => (
//                     <Typography
//                         as="a"
//                         href="#"
//                         className="text-xs flex font-semibold text-blue-gray-600"
//                     >
//                         <PencilIcon
//                             strokeWidth={2}
//                             className="h-5 w-5  mr-2 text-inherit"
//                         /> Update
//                     </Typography>
//                 ),
//             },
//         ],
//         []
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         nextPage,
//         previousPage,
//         canNextPage,
//         canPreviousPage,
//         state: { pageIndex },
//         prepareRow,
//         setPageSize: setTablePageSize,
//     } = useTable(
//         {
//             columns,
//             data,
//             initialState: { pageIndex: 0, pageSize },
//         },
//         usePagination
//     );

//     const handlePageSizeChange = (e) => {
//         const newSize = Number(e.target.value);
//         setPageSize(newSize);
//         setTablePageSize(newSize);
//     };

//     return (
//         <div className="mt-12 mb-8 flex flex-col gap-12">
//             <Card>
//                 <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
//                     <Typography variant="h6" color="white">
//                     {showAddProject ? 'Add Project' : 'Manage Projects'}
//                     </Typography>
//                     <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddProject(!showAddProject)}>
//                         <span>{showAddProject ? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
//                         {showAddProject ? 'Cancel' : 'Add Project'}
//                     </Button>
//                 </CardHeader>
//                 {showAddProject ? (
//                     <>
//                         <AddProject onAddProject={handleAddProject}/>
//                         {/* <div className="flex justify-center items-center  w-full">
//                             <hr className="border-t-2 border-gray-300 w-full"/>
//                             <span className="mx-4 text-gray-500">OR</span>
//                             <hr className="border-t-2 border-gray-300 w-full"/>
//                         </div>
//                         <AddEmployeeForm /> */}
//                     </>
//                 ) : (
//                 <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//                     <table {...getTableProps()} className="w-full min-w-[640px] table-auto">
//                         <thead>
//                             {headerGroups.map(headerGroup => (
//                                 <tr {...headerGroup.getHeaderGroupProps()}>
//                                     {headerGroup.headers.map(column => (
//                                         <th {...column.getHeaderProps()} className="border-b border-blue-gray-50 py-3 px-5 text-left">
//                                             <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
//                                                 {column.render('Header')}
//                                             </Typography>
//                                         </th>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         <tbody {...getTableBodyProps()}>
//                             {page.map(row => {
//                                 prepareRow(row);
//                                 return (
//                                     <tr {...row.getRowProps()}>
//                                         {row.cells.map(cell => (
//                                             <td {...cell.getCellProps()} className="py-3 px-5">
//                                                 {cell.render('Cell')}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                     <div className="mt-4 ml-2 flex justify-between items-center">
//                         <div className='flex items-center'>
//                             <Typography className="text-sm text-blue-gray-600">
//                                 Page {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
//                             </Typography>
//                             <select
//                                 value={pageSize}
//                                 onChange={handlePageSizeChange}
//                                 className="ml-2 border rounded px-2 py-1"
//                             >
//                                 {[5, 10, 15].map((size) => (
//                                     <option key={size} value={size}>
//                                         Show {size}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className='mr-4'>
//                         <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
//                                     {"<< "}
//                                 </span>
//                                 <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
//                                     {"< "}
//                                 </span>
//                                 <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
//                                     {" >"}
//                                 </span>
//                                 <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
//                                     {" >>"}
//                                 </span>
//                         </div>
//                     </div>
//                 </CardBody>
//                 )}
//             </Card>
//         </div>
//     );
// }

// export default Projects;// Projects.js
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar, Button } from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { Progress } from "@material-tailwind/react"; 
import { PencilIcon, UserPlusIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import AddProject from './AddProject';
import UpdateProject from './UpdateProjects'; // Import the UpdateProject component

// Sample projects data
const sampleProjectsData = [
    {
        id: 1,
        name: "Project A",
        members: [
            { id: 1, name: "John Doe", img: "team-1.jpg" },
            { id: 2, name: "Jane Doe", img: "jane.jpg" }
        ],
        budget: "$10,000",
        completion: 50
    },
    {
        id: 2,
        name: "Project B",
        members: [
            { id: 3, name: "Alice Smith", img: "alice.jpg" },
            { id: 4, name: "Bob Smith", img: "bob.jpg" }
        ],
        budget: "$15,000",
        completion: 75
    },
    // Add more projects as needed
];

export function Projects({ onAddProject }) {
    const [pageSize, setPageSize] = useState(5);
    const [projects, setProjects] = useState([]);
    const [showAddProject, setShowAddProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null); // State to keep track of selected project for update

    useEffect(() => {
        // Set sample projects data
        setProjects(sampleProjectsData);
    }, []);

    const data = useMemo(() => (projects ? projects : []), [projects]);
    
    // Function to handle click on Update button
    const handleUpdateClick = (project) => {
        setSelectedProject(project);
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Project Name',
                accessor: 'name',
            },
            {
                Header: 'Members',
                accessor: 'members',
                Cell: ({ value }) => (
                    <div>
                        {value.map((member, index) => (
                            <Avatar key={index} src={`/img/${member.img}`} alt={member.name} size="xs" variant="circular" className={`cursor-pointer border-2 border-white ${index === 0 ? "" : "-ml-2.5"}`} />
                        ))}
                    </div>
                ),
            },
            {
                Header: 'Budget',
                accessor: 'budget',
            },
            {
                Header: 'Progress',
                accessor: 'completion',
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
                Header: 'Action',
                accessor: 'update',
                Cell: ({ row }) => (
                    <Button onClick={() => handleUpdateClick(row.original)} className='flex'>
                        <PencilIcon strokeWidth={2} className="h-5 w-5 mr-2 text-inherit" /> Update
                    </Button>
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

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                    {showAddProject ? 'Add Project' : 'Manage Projects'}
                    </Typography>
                    <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddProject(!showAddProject)}>
                        <span>{showAddProject ? <ArrowLeftIcon className="h-4 w-4 mr-2"/> :<UserPlusIcon className="h-4 w-4 mr-2"/>}</span>
                        {showAddProject ? 'Cancel' : 'Add Project'}
                    </Button>
                </CardHeader>
                {showAddProject ? (
                    <AddProject onAddProject={onAddProject}/>
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
            </Card>
            {selectedProject && (
                <UpdateProject
                    project={selectedProject}
                    onUpdate={() => {
                        // Logic to update the project data
                        setSelectedProject(null); // Clear selected project after update
                    }}
                    onCancel={() => setSelectedProject(null)} // Cancel update
                />
            )}
        </div>
    );
}

export default Projects;
