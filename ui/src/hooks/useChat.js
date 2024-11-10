import { useState } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getEndpoint = (mode) => {
        switch (mode) {
            case 'openai-chat':
                return '/openai';
            case 'openai-image':
                return '/openai/image';
            case 'anthropic':
                return '/anthropic/anthropic';
            default:
                return '/openai';
        }
    };

    const sendMessage = async (message, mode) => {
        if (!message.trim()) return;

        const userMessage = { type: 'user', content: message, timestamp: new Date(), mode };
        setMessages(msgs => [...msgs, userMessage]);

        setIsLoading(true);
        try {
            const endpoint = getEndpoint(mode);
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
            setMessages(msgs => [...msgs, {
                type: 'ai',
                content: data,
                timestamp: new Date(),
                mode
            }]);

            return true;
        } catch (error) {
            console.error('Error:', error);
            setMessages(msgs => [...msgs, {
                type: 'error',
                content: 'Error: Failed to get response',
                timestamp: new Date(),
                mode
            }]);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
    };
};