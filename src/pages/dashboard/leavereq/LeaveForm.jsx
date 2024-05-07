import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { message } from 'antd';
import { AuthContext } from '@/pages/auth/Auth-context';
import { usePagination, useTable } from 'react-table';

const LeaveForm = () => {
  const auth=useContext(AuthContext)
  const [leaves,setLeaves]=useState([])
  const [pageSize, setPageSize] = useState(5);
    const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: auth.email,
    reason: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  useEffect(() => {
    const fetchLeaves = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/get/leave/byemail/${auth.email}`,{headers:{Authorization:"Bearer "+auth.token}}
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setLeaves(data.leaves);

        } catch (err) {
            message.error("Error fetching leaves:", err.message);
        }
    };
    fetchLeaves();
}, []);
const data = useMemo(() => (leaves ? leaves : []), [leaves]);
const columns = useMemo(() => [
  {
      Header: 'First Name',
      accessor: 'firstName',
      Cell: ({ value }) => <Typography className="text-xs font-semibold text-blue-gray-600">{value}</Typography>,
  },
  {
      Header: 'Last Name',
      accessor: 'lastName',
      Cell: ({ value }) => <Typography className="text-xs font-semibold text-blue-gray-600">{value}</Typography>,
  },
  {
      Header: 'Email',
      accessor: 'email',
      Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
  },
  {
      Header: 'Reason',
      accessor: 'reason',
      Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
  },
  {
      Header: 'Start Date',
      accessor: 'startDate',
      Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
  },
  {
      Header: 'End Date',
      accessor: 'endDate',
      Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
  },
  {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => <Typography className="text-xs font-normal text-blue-gray-500">{value}</Typography>,
  },
  // {
  //     Header: 'Action',
  //     accessor: '_id',
  //     Cell: ({ value, row }) => {
  //         const status = row.original.status;
  //         if (status === 'Approved') {
  //             return null; // Don't render action buttons if status is approved
  //         }
  //         return (
  //             <div className="flex gap-2">
  //                 <Button color="green" size="sm" onClick={() => handleApprove(value)}>
  //                     Approve
  //                 </Button>
  //                 <Button color="red" size="sm" onClick={() => handleDecline(value)}>
  //                     Decline
  //                 </Button>
  //             </div>
  //         );
  //     },
  // },
], []);
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response=await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/leave/create/leave`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: "Bearer " + auth.token,
        },
        body:JSON.stringify(formData)
      })
      if(!response.ok){
        throw new Error("Network response was not ok")
      }
      message.success("Your request is received, please be patient while the we revert back to you ")
      setTimeout(()=>{
        window.location.reload()
      },[500])
    }catch(err){
message.error("Error sending request, please try again")
    }
    
  };

  return (
    <div className="mt-12 mb-8">
      <Card>
        <CardHeader variant="gradient" color="gray" className=" p-6 flex items-center justify-between">
          <Typography variant="h6" color="white">
            Leave Request
          </Typography>
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
             
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Reason for Leave:</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold uppercase text-blue-gray-400">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit
            </button>
          </form>
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
                
        </CardBody>
      </Card>
    </div>
  );
};

export default LeaveForm;