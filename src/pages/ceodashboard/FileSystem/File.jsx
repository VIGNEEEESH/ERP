import React, { useState, useMemo, useEffect, useContext } from 'react';
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
import { AuthContext } from '@/pages/auth/Auth-context';

export function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [inputKey, setInputKey] = useState(Date.now());
    const [authenticated, setAuthenticated] = useState(false);
    const auth = useContext(AuthContext);

    const handlePasswordSubmit = (password) => {
        const validPassword = "sajaljain390";
        if (password === validPassword) {
            setAuthenticated(true);
        } else {
            alert('Incorrect password. Please try again.');
            setAuthenticated(false);
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/files/get/all/files`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFiles(data.files);
            } catch (error) {
                console.error('Error fetching files:', error);
                message.error('Failed to fetch files. Please refresh the page.');
            }
        };
        fetchFiles();
    }, [auth.token]);

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
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/files/upload/file`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
                body: formData,
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to upload files');
            }
    
            // Handle success response
            const fetchResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/files/get/all/files`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            const data = await fetchResponse.json();
            setFiles(data.files);
            setSelectedFiles([]);
            setInputKey(Date.now());
            message.success('Files uploaded successfully.');
        } catch (error) {
            console.error('Error uploading files:', error);
            message.error(error.message || 'Failed to upload files');
        }
    };

    const handleFileDelete = async (fileId) => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/files/delete/file/${fileId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (!response.ok) {
                const errorDetails = await response.text(); // Get more error details
                throw new Error(`Network response was not ok: ${errorDetails}`);
            }
            setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
            message.success('File deleted successfully.');
        } catch (error) {
            console.error('Error deleting file:', error);
            message.error(`Failed to delete file. Error: ${error.message}`);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const openFile = async (file) => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/files/open/file/${encodeURIComponent(file.filename)}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            // Assuming the response is a file, you can create a blob URL to open it
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error('Error opening file:', error);
            message.error('Failed to open file. Please try again.');
        }
    };

    const data = useMemo(() => files, [files]);
    const filteredData = useMemo(() => {
        return data.filter(file =>
            file.filename.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const columns = useMemo(
        () => [
            {
                Header: 'File Name',
                accessor: 'filename',
                Cell: ({ row }) => (
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-white">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                            {row.original.filename}
                        </Typography>
                        <div className="flex gap-2">
                            <Button onClick={() => openFile(row.original)} size="sm" className="ml-4">
                                Open
                            </Button>
                            <Button onClick={() => handleFileDelete(row.original._id)} size="sm" color="red">
                                Delete
                            </Button>
                        </div>
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
                                </tbody>
                            </table>
                            <div className="pagination p-5 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="mr-2">Page</span>
                                    <strong>
                                        {pageIndex + 1} of {pageCount}
                                    </strong>
                                </div>
                                <div className="flex items-center">
                                    <span onClick={() => gotoPage(0)} disabled={!canPreviousPage} className='cursor-pointer'>
                                        {" << "}
                                    </span>
                                    <span onClick={() => previousPage()} disabled={!canPreviousPage} className='cursor-pointer'>
                                        {"<"}
                                    </span>
                                    <span onClick={() => nextPage()} disabled={!canNextPage} className='cursor-pointer'>
                                        {">"}
                                    </span>
                                    <span onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className='cursor-pointer'>
                                        {" >>"}
                                    </span>
                                    <select value={pageSize} onChange={handlePageSizeChange} className='ml-2'>
                                        {[5, 10, 20,                                         30, 40, 50].map(size => (
                                            <option key={size} value={size}>
                                                Show {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default FileUpload;