import React, { useState } from 'react';
import { Send, Image as ImageIcon, MessageSquare, Loader2 } from 'lucide-react';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('chat'); // 'chat' or 'image'

    const LoadingSpinner = () => (
        <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            </div>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        // Add user message immediately
        const userMessage = { type: 'user', content: message, timestamp: new Date(), mode };
        setMessages(msgs => [...msgs, userMessage]);

        setIsLoading(true);
        try {
            const endpoint = mode === 'chat' ? '/openai' : '/openai/image';
            const response = await fetch(
                `${endpoint}?message=${encodeURIComponent(message)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            // Add AI response to messages
            setMessages(msgs => [...msgs, {
                type: 'ai',
                content: data,
                timestamp: new Date(),
                mode
            }]);

            // Clear input field
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
            setMessages(msgs => [...msgs, {
                type: 'error',
                content: 'Error: Failed to get response',
                timestamp: new Date(),
                mode
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const MessageBubble = ({ message }) => {
        const isUser = message.type === 'user';
        const isError = message.type === 'error';
        const isImage = message.mode === 'image' && message.type === 'ai';

        const isBase64 = (str) => {
            try {
                return str.startsWith('data:image') || btoa(atob(str)) === str;
            } catch (err) {
                return false;
            }
        };

        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        isUser
                            ? 'bg-blue-500 text-white'
                            : isError
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {isImage && message.type === 'ai' ? (
                        <img
                            src={isBase64(message.content)
                                ? `data:image/png;base64,${message.content}`
                                : message.content}
                            alt="Generated"
                            className="rounded-lg max-w-full h-auto"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m-8-8h16"/></svg>';
                                e.target.classList.add('bg-gray-200', 'p-4');
                                e.target.nextSibling.textContent = 'Error loading image';
                            }}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                    <div className={`text-xs mt-1 ${
                        isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        );
    };

    const ToggleButton = ({ isActive, icon: Icon, label, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="flex justify-center gap-4 mb-4">
                <ToggleButton
                    isActive={mode === 'chat'}
                    icon={MessageSquare}
                    label="Chat"
                    onClick={() => setMode('chat')}
                />
                <ToggleButton
                    isActive={mode === 'image'}
                    icon={ImageIcon}
                    label="Image"
                    onClick={() => setMode('image')}
                />
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {messages.length === 0 ? (
                        <div className="text-gray-400 italic text-center mt-4">
                            {mode === 'chat'
                                ? 'Start a conversation...'
                                : 'Describe an image to generate...'}
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} message={msg} />
                            ))}
                            {isLoading && <LoadingSpinner />}
                        </>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={mode === 'chat'
                            ? "Type your message..."
                            : "Describe the image you want to generate..."}
                        className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Send
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;