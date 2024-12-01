import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

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

    const sendMessage = async (message, mode, send) => {
        if (!message.trim()) return;

        const messageId = uuidv4();

        // Send initial message event - this matches the existing state machine
        await send({
            type: 'ASK',
            message,
            speaker: "user",
            responder: "ai",
            responseId: messageId
        });

        try {
            // Get the text response
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

            // Use the existing STREAM event to send the full text
            await send({
                type: 'STREAM',
                chunk: responseText,
                responseId: messageId
            });

            // Handle audio stream
            const audioResponse = await fetch(
                `/openai/audio?message=${encodeURIComponent(responseText)}`,
                {method: 'GET'}
            );

            if (!audioResponse.ok) {
                throw new Error('Audio stream response was not ok');
            }

            // Create MediaSource and set up audio
            const mediaSource = new MediaSource();
            const audio = new Audio();
            audio.src = URL.createObjectURL(mediaSource);

            mediaSource.addEventListener('sourceopen', async () => {
                const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                const reader = audioResponse.body.getReader();
                const chunks = [];

                // Read all chunks
                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }

                // Process chunks
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

            // Send completion event - matches existing state machine
            await send({
                type: 'COMPLETE'
            });

            return true;

        } catch (error) {
            console.error('Error:', error);

            // Use existing STREAM_ERROR event
            await send({
                type: 'STREAM_ERROR',
                error: 'Failed to get response',
                responseId: messageId
            });

            return false;
        }
    };

    const streamMessage = async (message, send) => {
        if (!message.trim()) return;

        const uuid = uuidv4();
        await send({
            type: 'ASK',
            message,
            speaker: "user",
            responder: "ai",
            responseId: uuid
        });

        try {
            // First get the text response
            const response = await fetch(
                `/openai/stream?message=${encodeURIComponent(message)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            (async () => {
                try {
                    while (true) {
                        const {done, value} = await reader.read();
                        if (done) break;
                        await send({
                            type: 'STREAM',
                            chunk: decoder.decode(value, {stream: true}),
                            responseId: uuid
                        });
                    }
                } catch (error) {
                    send({
                        type: 'STREAM_ERROR',
                        error: 'Stream interrupted. Please try again.',
                        responseId: uuid
                    });
                }
            })().then(r => {
                send({
                    type: 'COMPLETE'
                });
                console.log("Streamed successfully");
            });
            return true;
        } catch (error) {
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
        audioElements,
        streamMessage
    };
};