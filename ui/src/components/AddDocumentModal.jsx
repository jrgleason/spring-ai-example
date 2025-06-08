import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddDocumentModal = ({ isOpen, onClose }) => {
    const [content, setContent] = useState('{\n  \n}');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleEditorChange = (e) => {
        setContent(e.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
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
                body: JSON.stringify({ content: parsedContent }),
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
                    <div className="flex items-center gap-2">                        <button
                            onClick={handleFormat}
                            className="px-3 py-1 text-sm bg-surface-100 hover:bg-surface-200 rounded-md"
                            type="button"
                        >
                            Format JSON
                        </button>
                        <button
                            onClick={onClose}
                            className="text-secondary-500 hover:text-secondary-700"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="h-[500px] border rounded-lg overflow-hidden">
                            <textarea
                                value={content}
                                onChange={handleEditorChange}
                                className="w-full h-full p-2 border rounded-lg"
                                style={{ fontFamily: 'monospace', fontSize: '14px' }}
                            />
                        </div>
                        {error && (
                            <div className="mt-2 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"                            disabled={isSubmitting}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-primary-300 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};