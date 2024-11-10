// components/AddDocumentModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Editor from "@monaco-editor/react";

export const AddDocumentModal = ({ isOpen, onClose }) => {
    const [content, setContent] = useState('{\n  \n}');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleEditorChange = (value) => {
        setContent(value);
        // Clear any previous error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validate JSON before submitting
        try {
            JSON.parse(content);
        } catch (e) {
            setError("Invalid JSON format");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/pinecone/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to add document');
            }

            setContent('{\n  \n}');
            onClose();
        } catch (error) {
            console.error('Error adding document:', error);
            setError('Failed to add document');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormat = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(content), null, 2);
            setContent(formatted);
            setError(null);
        } catch (e) {
            setError("Invalid JSON format");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Document</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFormat}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                            type="button"
                        >
                            Format JSON
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="h-[500px] border rounded-lg overflow-hidden">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                value={content}
                                onChange={handleEditorChange}
                                theme="vs-light"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    scrollBeyondLastLine: false,
                                    tabSize: 2,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                        {error && (
                            <div className="mt-2 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};