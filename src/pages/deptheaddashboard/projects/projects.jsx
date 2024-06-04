
  import React, { useContext, useEffect, useMemo, useState } from 'react';
  import { Card, CardHeader, CardBody, Typography, Avatar, Button } from "@material-tailwind/react";
  import { useTable, usePagination } from 'react-table';
  import { Progress } from "@material-tailwind/react";
  import { PencilIcon, UserPlusIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
  import AddProject from './AddProject';
  import UpdateProject from './UpdateProjects';
  import { Modal, message } from 'antd';
  import { AuthContext } from '@/pages/auth/Auth-context';
  
  
  
  export function Projects({ onAddProject }) {
      const [pageSize, setPageSize] = useState(5);
      const [projects, setProjects] = useState([]);
      const [showAddProject, setShowAddProject] = useState(false);
      const [selectedProject, setSelectedProject] = useState(null); // State to keep track of selected project for update
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [editProjectData, setEditProjectData] = useState(null);
      const [showEditProject, setShowEditProject] = useState(false);
      const [projectToDelete, setProjectToDelete] = useState(null); 
  const auth=useContext(AuthContext)
      
useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/get/projects/bydepartmentandid/${auth.userId}`,{headers:{Authorization:"Bearer "+auth.token}}
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance data: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        message.error("Error fetching projects ", error.message);
      }
    };

    fetchProjects();
  }, []);

  
      const data = useMemo(() => (projects ? projects : []), [projects]);
  
      const handleUpdateClick = (project) => {
          setSelectedProject(project);
      };
  
      const columns = useMemo(
          () => [
              {
                  Header: 'Project Name',
                  accessor: 'projectName',
                  Cell: ({ row }) => (
                      <div className="whitespace-pre-wrap" style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <Typography className="font-semibold">{row.original.projectName}</Typography>
                      </div>
                  ),
              },
              {
                  Header: 'Project Description',
                  accessor: 'projectDescription',
                  Cell: ({ row }) => (
                      <div className="whitespace-pre-wrap" style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <Typography className="font-semibold">{row.original.projectDescription}</Typography>
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
                      <Typography onClick={() => handleEditClick(row)}  as="a" href="#" className="text-xs font-semibold text-blue-gray-600 flex" >
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
  
      const handleDeleteClick = (rowData) => {
          setProjectToDelete(rowData.original);
          setShowDeleteModal(true);
      };
  
      const handleCloseDeleteModal = () => {
          setShowDeleteModal(false);
          setProjectToDelete(null);
      };
      const handleEditClick = (rowData) => {
          
          setEditProjectData(rowData.original);
          setShowEditProject(true);
          
          
      };
  
      const handleCloseEdit = () => {
          setShowEditProject(false);
          setEditProjectData(null);
      };
  
      const handleConfirmDelete = async () => {
          try {
              
              // Make a delete request to your backend API using fetch
              const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/project/delete/project/byid/${projectToDelete._id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: "Bearer " + auth.token,
                  },
              });
      
              // Check if the request was successful (status code 200-299)
              if (response.ok) {
                  
                  // If the request is successful, remove the deleted employee from the local state
                  setProjects(projects.filter(project => project._id !== projectToDelete._id));
      
                  // Close the modal
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                  message.success("Project Sucessfully Deleted");
              } else {
                  // If the request failed, throw an error
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
          } catch (error) {
              message.success("Something went wrong while deleting the project, please try again");
              console.error('Error deleting project:', error);
              // You can show an error message to the user here
          }
      };
      
  
  
      return (
          <div className="mt-12 mb-8 flex flex-col gap-12">
              <Card>
                  <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                      <Typography variant="h6" color="white">
                          {showAddProject ? 'Add Project' : 'Manage Projects'}
                      </Typography>
                      <Button className="bg-white text-gray-900 flex hover:bg-gray-200" onClick={() => setShowAddProject(!showAddProject)}>
                          <span>{showAddProject ? <ArrowLeftIcon className="h-4 w-4 mr-2" /> : <UserPlusIcon className="h-4 w-4 mr-2" />}</span>
                          {showAddProject ? 'Cancel' : 'Add Project'}
                      </Button>
                  </CardHeader>
                  {showEditProject && (
                      <UpdateProject projectData={editProjectData} onClose={handleCloseEdit} />
                  )}
                  {showAddProject ? (
                      <AddProject onAddProject={AddProject} />
                  ) : (
                      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                          <table {...getTableProps()} className="w-full min-w-[640px] table-auto">
                              <thead>
                                  {headerGroups.map(headerGroup => (
                                      <tr {...headerGroup.getHeaderGroupProps()}>
                                          {headerGroup.headers.map(column => (
                                              <th {...column.getHeaderProps()} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                                  <Typography variant="small" className="text-[14px] font-bold uppercase text-blue-gray-400">
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
                          // Logic to update the project data...
                          setSelectedProject(null);
                      }}
                      onCancel={() => setSelectedProject(null)}
                  />
              )}
  
              <Modal
                  title="Delete Project"
                  open={showDeleteModal}
                  onOk={handleConfirmDelete}
                  onCancel={handleCloseDeleteModal}
                  okButtonProps={{ style: { backgroundColor: 'black' } }}
              >
                  <p>Are you sure you want to delete this Project?</p>
                  {projectToDelete && (
                      <p>Name: {projectToDelete.projectName}</p>
                  )}
              </Modal>
          </div>
      );
  }
  
  export default Projects;
  