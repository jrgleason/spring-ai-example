import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        // Add user message immediately
        const userMessage = { type: 'user', content: message, timestamp: new Date() };
        setMessages(msgs => [...msgs, userMessage]);

        setIsLoading(true);
        try {
            const response = await fetch(
                `/chat/openai?message=${encodeURIComponent(message)}`,
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
                timestamp: new Date()
            }]);

            // Clear input field
            setMessage('');
        } catch (error) {
            console.error('Error:', error);
            setMessages(msgs => [...msgs, {
                type: 'error',
                content: 'Error: Failed to get response',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const MessageBubble = ({ message }) => {
        const isUser = message.type === 'user';
        const isError = message.type === 'error';

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
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                        isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-md h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {messages.length === 0 ? (
                        <div className="text-gray-400 italic text-center mt-4">
                            Start a conversation...
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                    >
                        <Send size={16} />
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;