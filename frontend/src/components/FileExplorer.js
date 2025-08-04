import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { FaFolder } from "react-icons/fa6";


const FileExplorer = forwardRef(({ token, onLoadFile }, ref) => {
    const [files, setFiles] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    useImperativeHandle(ref, () => ({
        refresh: fetchFiles
    }));

    useEffect(() => {
        if (token) fetchFiles();
    }, [token]);

    const fetchFiles = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/files/myfiles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(res.data);
        } catch (err) {
            console.error('Error loading files:', err);
        }
    };

    const loadFile = async (id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onLoadFile(res.data);
        } catch (err) {
            alert('Failed to load file');
        }
    };

    const deleteFile = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this file?');
        if (!confirmed) return;

        try {
            setDeletingId(id);
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(prev => prev.filter(file => file._id !== id)); // Optimistic update
        } catch (err) {
            alert('Failed to delete file');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 text-sm text-gray-900 dark:text-white">
            <div className="p-4 mt-2 border-b dark:border-gray-700 font-semibold text-lg flex items-center gap-2">
                <FaFolder className='text-yellow-300' />
                Saved Files
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {files.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">No files found.</p>
                ) : (
                    <ul className="space-y-2">
                        {files.map((file) => (
                            <li
                                key={file._id}
                                className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded cursor-pointer"
                            >
                                <span
                                    className="text-blue-600 dark:text-blue-400 font-medium truncate w-44"
                                    onClick={() => loadFile(file._id)}
                                    title={file.name || 'Untitled'}
                                >
                                    {file.name || 'Untitled'}
                                </span>

                                <button
                                    onClick={() => deleteFile(file._id)}
                                    className={`text-red-500 text-xs hover:underline disabled:opacity-50`}
                                    disabled={deletingId === file._id}
                                >
                                    {deletingId === file._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});

export default FileExplorer;
