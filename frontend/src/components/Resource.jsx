import React, { useState, useEffect } from 'react';
import axios from "axios";

const Resource = () => {
    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    useEffect(() => {
        resourcesData();
    }, []);

    const resourcesData = async () => {
        try {
            const response = await axios.get('/api/forum/forum/resources');
            setResources(response.data);
            if (response.data.length > 0) {
                setSelectedResource(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        }
    };

    // Handle resource download
    const downloadResource = (resourceId, e) => {
        e.stopPropagation(); // Prevent row selection when clicking download
        window.location.href = `/api/forum/resources/${resourceId}/download`;
    };

    // Handle resource deletion
    const deleteResource = async (resourceId, e) => {
        e.stopPropagation(); // Prevent row selection when clicking delete

        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`/api/forum/forum/${resourceId}`);
                resourcesData(); // Refresh the resources list
                if (selectedResource && selectedResource.id === resourceId) {
                    setSelectedResource(resources.length > 1 ? resources[0] : null);
                }
            } catch (error) {
                console.error('Failed to delete resource:', error);
            }
        }
    };

    // Format the date from timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get file name from path
    const getFileName = (path) => {
        if (!path) return 'No file';
        return path.split('\\').pop().split('/').pop();
    };

    // Get appropriate icon based on category
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'IMAGE':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'ZIP':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <h1 className="text-3xl font-bold text-white">Resource Library</h1>
                    <p className="text-blue-100 mt-2">Manage and access your uploaded resources</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search resources..."
                        />
                    </div>

                    <div className="flex space-x-2">
                        <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>All Categories</option>
                            <option>IMAGE</option>
                            <option>ZIP</option>
                            <option>DOCUMENT</option>
                        </select>

                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Resources ({resources.length})
                    </h2>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {resources.map((resource) => (
                                <tr
                                    key={resource.id}
                                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                    onClick={() => setSelectedResource(resource)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                                                {getCategoryIcon(resource.category)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                                <div className="text-xs text-gray-500">{resource.id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {resource.category}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(resource.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                        {resource.text}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            {resource.fileDest ? getFileName(resource.fileDest) : 'No file'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                View
                                            </button>
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                onClick={(e) => downloadResource(resource.id, e)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m-4-4l4 4 4-4m-8 8h8" />
                                                </svg>
                                                Download
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No data state - hidden when there's data */}
                    {resources.length === 0 && (
                        <div className="text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-6">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by uploading your first resource.</p>
                            <div className="mt-6">
                                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Upload Resource
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                {selectedResource && (
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Details</h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Basic Information</h4>
                                <div className="space-y-2">
                                    <p className="text-sm"><span className="font-medium text-gray-500">ID:</span> <span className="text-gray-900">{selectedResource.id}</span></p>
                                    <p className="text-sm"><span className="font-medium text-gray-500">Title:</span> <span className="text-gray-900">{selectedResource.title}</span></p>
                                    <p className="text-sm"><span className="font-medium text-gray-500">Category:</span> <span className="text-gray-900">{selectedResource.category}</span></p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">File Information</h4>
                                <div className="space-y-2">
                                    <p className="text-sm"><span className="font-medium text-gray-500">File:</span> <span className="text-gray-900">{selectedResource.fileDest ? getFileName(selectedResource.fileDest) : 'No file'}</span></p>
                                    <p className="text-sm"><span className="font-medium text-gray-500">Location:</span> <span className="text-gray-900">{selectedResource.fileDest || 'N/A'}</span></p>
                                    <p className="text-sm"><span className="font-medium text-gray-500">Description:</span> <span className="text-gray-900">{selectedResource.text}</span></p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Meta Information</h4>
                                <div className="space-y-2">
                                    <p className="text-sm"><span className="font-medium text-gray-500">User ID:</span> <span className="text-gray-900">{selectedResource.userId}</span></p>
                                    <p className="text-sm"><span className="font-medium text-gray-500">Created:</span> <span className="text-gray-900">{formatDate(selectedResource.timestamp)}</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={(e) => downloadResource(selectedResource.id, e)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </button>

                            <button
                                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={(e) => deleteResource(selectedResource.id, e)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resource;