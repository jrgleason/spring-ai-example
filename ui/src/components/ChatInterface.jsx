import React, {useState} from 'react';
import {LoadingSpinner} from './LoadingSpinner';
import {MessageBubble} from './MessageBubble';
import {ChatInput} from './ChatInput';
import {ModeToggle} from './ModeToggle';
import {useChat} from '../hooks/useChat';
import {AddDocumentModal} from "./AddDocumentModal.jsx";
import {Plus} from "lucide-react";
import {DocumentGrid} from "./DocumentGrid.jsx";

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('openai-chat');
    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
    const {messages, isLoading, sendMessage} = useChat();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await sendMessage(message, mode);
        if (success) {
            setMessage('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <ModeToggle mode={mode} setMode={setMode}/>
                <button
                    onClick={() => setIsAddDocumentOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    <Plus size={16}/>
                    Add Document
                </button>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {messages.length === 0 ? (
                        <div className="text-gray-400 italic text-center mt-4">
                            {mode === 'openai-image'
                                ? 'Describe an image to generate...'
                                : 'Start a conversation...'}
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg}/>
                            ))}
                            {isLoading && <LoadingSpinner/>}
                        </>
                    )}
                </div>

                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    mode={mode}
                />
            </div>

            <DocumentGrid />

            <AddDocumentModal
                isOpen={isAddDocumentOpen}
                onClose={() => setIsAddDocumentOpen(false)}
            />
        </div>
    );
};

export default ChatInterface;