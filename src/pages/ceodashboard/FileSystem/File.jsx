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

    const handlePasswordSubmit = async (password) => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify({ email: auth.email, password }),
            });

            if (response.ok) {
                setAuthenticated(true);
            } else {
                const result = await response.json();
                alert(result.message || 'Incorrect password. Please try again.');
                setAuthenticated(false);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            message.error('Failed to verify password. Please try again.');
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
            setInputKey(Date.now()); // Reset file input
            message.success('Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading files:', error);
            message.error(error.message || 'Failed to upload files. Please try again.');
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
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to delete file');
            }
            // Handle success response
            const updatedFiles = files.filter((file) => file.id !== fileId);
            setFiles(updatedFiles);
            message.success('File deleted successfully!');
        } catch (error) {
            console.error('Error deleting file:', error);
            message.error(error.message || 'Failed to delete file. Please try again.');
        }
    };

    const columns = useMemo(
        () => [
            { Header: 'Name', accessor: 'name' },
            { Header: 'Size', accessor: 'size' },
            { Header: 'Type', accessor: 'type' },
            { Header: 'Date Uploaded', accessor: 'dateUploaded' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <Button color="red" size="sm" onClick={() => handleFileDelete(row.original.id)}>
                        Delete
                    </Button>
                ),
            },
        ],
        [files]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize: setTablePageSize,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data: files,
            initialState: { pageIndex: 0, pageSize },
        },
        usePagination
    );

    useEffect(() => {
        setTablePageSize(pageSize);
    }, [pageSize, setTablePageSize]);

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {!authenticated ? (
                <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />
            ) : (
                <div className="p-4">
                    <Card>
                        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                            <Typography variant="h6" color="white">
                                File Upload
                            </Typography>
                        </CardHeader>
                        <CardBody>
                            <div className="mb-4">
                                <Input
                                    key={inputKey}
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="mb-4">
                                <Button onClick={handleFileUpload} disabled={selectedFiles.length === 0}>
                                    Upload
                                </Button>
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table
                                    {...getTableProps()}
                                    className="min-w-full bg-white border border-gray-200"
                                >
                                    <thead>
                                        {headerGroups.map((headerGroup) => (
                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                {headerGroup.headers.map((column) => (
                                                    <th
                                                        {...column.getHeaderProps()}
                                                        className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {column.render('Header')}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody {...getTableBodyProps()}>
                                        {page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                                        >
                                                            {cell.render('Cell')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination mt-4">
                                <Button
                                    onClick={() => gotoPage(0)}
                                    disabled={!canPreviousPage}
                                >
                                    {'<<'}
                                </Button>
                                <Button
                                    onClick={() => previousPage()}
                                    disabled={!canPreviousPage}
                                >
                                    {'<'}
                                </Button>
                                <Button onClick={() => nextPage()} disabled={!canNextPage}>
                                    {'>'}
                                </Button>
                                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                    {'>>'}
                                </Button>
                                <span>
                                    Page{' '}
                                    <strong>
                                        {pageIndex + 1} of {pageOptions.length}
                                    </strong>{' '}
                                </span>
                                <span>
                                    | Go to page:{' '}
                                    <input
                                        type="number"
                                        defaultValue={pageIndex + 1}
                                        onChange={(e) => {
                                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                            gotoPage(pageNumber);
                                        }}
                                        style={{ width: '100px' }}
                                    />
                                </span>{' '}
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                >
                                    {[5, 10, 20, 30, 40, 50].map((size) => (
                                        <option key={size} value={size}>
                                            Show {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    );
}
