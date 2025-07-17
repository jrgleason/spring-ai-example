import React, {useEffect, useState} from 'react';
import {Bot, ImageIcon, Sparkles} from 'lucide-react';
import {LoadingSpinner} from './LoadingSpinner';

export const MessageBubble = ({message}) => {
    const [isLoading, setIsLoading] = useState(true);
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const isImage = message.mode === 'openai-image' && message.type === 'ai';

    useEffect(() => {
        // If it's an AI message and content changes from empty to having content
        if (message.type === 'ai' && message.content) {
            setIsLoading(false);
        }
    }, [message.content, message.type]);

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
            default:
                return 'AI';
        }
    };

    const getAIIcon = (mode) => {
        switch (mode) {
            case 'openai-chat':
                return <Sparkles size={12} className="inline"/>;
            case 'openai-image':
                return <ImageIcon size={12} className="inline"/>;
            default:
                return null;
        }
    };
    const renderContent = () => {
        if (isImage && message.type === 'ai') {
            if (!message.content) {
                return (
                    <div className="flex justify-center w-full">
                        <LoadingSpinner size="small"/>
                    </div>
                );
            }

            return (
                <img
                    src={isBase64(message.content)
                        ? `data:image/png;base64,${message.content}`
                        : message.content}
                    alt="Generated"
                    className="rounded-lg max-w-full h-auto shadow-sm" onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 4v16m-8-8h16"/></svg>';
                    e.target.classList.add('bg-secondary-200', 'p-4');
                    e.target.nextSibling.textContent = 'Error loading image';
                }}
                />
            );
        }

        return (
            <div className="whitespace-pre-wrap min-h-[24px] min-w-[24px] flex items-center">
                {!isUser && isLoading ? (
                    <div className="flex justify-center w-full">
                        <LoadingSpinner size="small"/>
                    </div>
                ) : (
                    message.content
                )}
            </div>
        );
    };
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    isUser
                        ? 'bg-primary-500 text-surface-50'
                        : isError
                            ? 'bg-error-100 text-error-700'
                            : 'bg-secondary-100 text-secondary-800'
                }`}
            >
                {!isUser && !isError && (
                    <div className="text-xs text-secondary-500 mb-1 flex items-center gap-1">
                        {getAIIcon(message.mode)}
                        {getAILabel(message.mode)}
                    </div>
                )}

                {renderContent()}
                <div className="flex flex-col gap-2">
                    <div className={`text-xs ${
                        isUser ? 'text-primary-100' : 'text-secondary-500'
                    }`}>
                        {message.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};