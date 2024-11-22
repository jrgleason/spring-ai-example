import {useState} from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioElements, setAudioElements] = useState({});

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

        const messageId = Date.now().toString();
        const userMessage = {type: 'user', content: message, timestamp: new Date(), mode};
        setMessages(msgs => [...msgs, userMessage]);
        setIsLoading(true);

        try {
            // First get the text response
            const endpoint = getEndpoint(mode);
            const textResponse = await fetch(
                `${endpoint}?message=${encodeURIComponent(message)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const responseText = await textResponse.text();

            // Create and set up audio element
            const audio = new Audio();

            // Now use that response text for the audio stream
            const audioResponse = await fetch(
                `/openai/stream?message=${encodeURIComponent(responseText)}`,
                {method: 'GET'}
            );

            if (!audioResponse.ok) {
                throw new Error('Audio stream response was not ok');
            }

            const mediaSource = new MediaSource();
            audio.src = URL.createObjectURL(mediaSource);

            mediaSource.addEventListener('sourceopen', async () => {
                const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                const reader = audioResponse.body.getReader();
                const chunks = [];

                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }

                for (const chunk of chunks) {
                    await new Promise((resolve) => {
                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(chunk);
                            sourceBuffer.addEventListener('updateend', resolve, {once: true});
                        } else {
                            sourceBuffer.addEventListener('updateend', () => {
                                sourceBuffer.appendBuffer(chunk);
                                sourceBuffer.addEventListener('updateend', resolve, {once: true});
                            }, {once: true});
                        }
                    });
                }

                mediaSource.endOfStream();
            });

            // Store the audio element
            setAudioElements(prev => ({
                ...prev,
                [messageId]: audio
            }));

            // Add AI message
            setMessages(msgs => [...msgs, {
                type: 'ai',
                content: responseText,
                timestamp: new Date(),
                mode,
                messageId,
                hasAudio: true
            }]);

            return true;
        } catch (error) {
            console.error('Audio Error:', error);
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
        audioElements
    };
};