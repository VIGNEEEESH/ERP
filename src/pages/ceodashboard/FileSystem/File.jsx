import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import { useTable, usePagination } from 'react-table';
import { message } from 'antd';
import PasswordPrompt from './PasswordPrompt';


export function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [inputKey, setInputKey] = useState(Date.now()); // Add a key to reset file input
    const [authenticated, setAuthenticated] = useState(false);

  const handlePasswordSubmit = (password) => {
    const validPassword = 'sajaljain390'; // Replace with your actual password

    if (password === validPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
      setAuthenticated(false);
    }
  };

    useEffect(() => {
        // Fetch files from backend
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/files');
                setFiles(response.data);

            } catch (error) {
                console.error('Error fetching files:', error);
                message.error('Failed to fetch files. Please refresh the page.');

            }
        };

        fetchFiles();
    }, []);

    const handleFileChange = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles, ...uploadedFiles]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('file', file);
        });

        try {
            await axios.post('http://localhost:3000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Fetch updated files list
            const response = await axios.get('http://localhost:3000/api/files');
            setFiles(response.data);
            setSelectedFiles([]);
            setInputKey(Date.now());
            message.success('Files uploaded successfully.');
        } catch (error) {
            message.error('Failed to upload files. Please try again.');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const data = useMemo(() => files, [files]);
    const filteredData = useMemo(() => {
        return data.filter(file =>
            file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const columns = useMemo(
        () => [
            {
                Header: 'File Name',
                accessor: 'originalName',
                Cell: ({ row }) => (
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-white">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                            {row.original.originalName}
                        </Typography>
                        <Button onClick={() => openFile(row.original)} size="sm" className="ml-4">
                            Open
                        </Button>
                    </div>
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

    const openFile = (file) => {
        // For simplicity, opening the file URL directly
        const fileURL = `http://localhost:5000/api/files/${file._id}`;
        window.open(fileURL);
    };

    return (
        <div>
        {!authenticated && <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />}
      {authenticated && (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        File Upload
                    </Typography>
                    <Input
                        type="text"
                        placeholder="Search files"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-white text-black"
                    />
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="flex justify-end items-center gap-4 mb-4" style={{ marginLeft: '20px' }}>
                        <Input
                            key={inputKey}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-30 bg-white text-black p-2"
                        />
                        <Button onClick={handleFileUpload} size="m" className="p-2" style={{ marginRight: '20px' }}>
                            Upload
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
                                        No files found
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
            </Card>
        </div>
      )}</div>
    );
}

export default FileUpload;