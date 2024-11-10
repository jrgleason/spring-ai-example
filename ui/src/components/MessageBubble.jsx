import React from 'react';
import { Sparkles, ImageIcon, Bot } from 'lucide-react';

export const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const isImage = message.mode === 'openai-image' && message.type === 'ai';

    const isBase64 = (str) => {
        try {
            return str.startsWith('data:image') || btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    };

    const getAILabel = (mode) => {
        switch (mode) {
            case 'openai-chat':
                return 'OpenAI';
            case 'openai-image':
                return 'DALL·E';
            case 'anthropic':
                return 'Claude';
            default:
                return 'AI';
        }
    };

    const getAIIcon = (mode) => {
        switch (mode) {
            case 'openai-chat':
                return <Sparkles size={12} className="inline" />;
            case 'openai-image':
                return <ImageIcon size={12} className="inline" />;
            case 'anthropic':
                return <Bot size={12} className="inline" />;
            default:
                return null;
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
                {!isUser && !isError && (
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        {getAIIcon(message.mode)}
                        {getAILabel(message.mode)}
                    </div>
                )}
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
