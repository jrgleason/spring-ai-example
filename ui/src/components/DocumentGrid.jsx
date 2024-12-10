import React, {useEffect, useState} from 'react';
import {RefreshCw, Trash2} from 'lucide-react';

export const DocumentGrid = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchDocuments = async () => {
        setIsLoading(true);
        setDocuments([]); // Clear current documents
        try {
            const response = await fetch('/pinecone/search');
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            const data = await response.json();
            setDocuments(data.map(doc => ({
                ...doc,
                content: JSON.parse(doc.content).content
            })));
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/pinecone/delete?id=${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete document');
            }
            setMessage('Document deleted successfully');
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
            setMessage('Failed to delete document');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCache = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/cache/deleteAll', { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete cache');
            }
            setMessage('Cache deleted successfully');
            fetchDocuments(); // Refetch documents after cache deletion
        } catch (error) {
            console.error('Error deleting cache:', error);
            setMessage('Failed to delete cache');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Stored Documents</h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchDocuments}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                        disabled={isLoading}
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/>
                        Refresh
                    </button>
                </div>
            </div>

            {message && (
                <div className="mb-4 text-center text-green-500">
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-2 font-medium">Content</th>
                        <th className="px-4 py-2 font-medium">Metadata</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {documents.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                                <div className="max-h-20 overflow-y-auto">
                                    {typeof doc.content === 'string'
                                        ? doc.content
                                        : JSON.stringify(doc.content, null, 2)}
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <pre className="text-xs bg-gray-50 p-2 rounded">
                                    {JSON.stringify(doc.metadata, null, 2)}
                                </pre>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => deleteDocument(doc.id)}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-md"
                                    disabled={isLoading}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {documents.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500">
                        No documents found
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-8 text-gray-500">
                        Loading documents...
                    </div>
                )}
            </div>
        </div>
    );
};