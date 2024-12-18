import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

export const useChat = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getEndpoint = (mode) => {
        const endpoints = {
            'openai-chat': '/openai',
            'openai-image': '/openai/image',
            'anthropic': '/anthropic'
        };
        return endpoints[mode] || '/openai';
    };

    const generateAudioForMessage = async (messageId, text, send) => {
        if (!text) {
            console.warn('No text provided for audio generation');
            return;
        }

        try {
            console.log('Generating audio for:', text.substring(0, 50) + '...');
            const audioResponse = await fetch(`/openai/audio?message=${encodeURIComponent(text)}`, {
                method: 'GET'
            });

            if (!audioResponse.ok) {
                throw new Error(`Audio stream response was not ok: ${audioResponse.status}`);
            }

            await send({
                type: 'PLAYBACK',
                audioResponse,
                responseId: messageId
            });
        } catch (error) {
            console.error('Audio generation error:', error);
        }
    };

    const sendMessage = async (message, mode, send) => {
        if (!message.trim()) return;

        const messageId = uuidv4();
        await send({
            type: 'ASK',
            message,
            speaker: "user",
            responder: "ai",
            responseId: messageId,
            mode
        });

        try {
            const endpoint = getEndpoint(mode);
            const textResponse = await fetch(`${endpoint}?message=${encodeURIComponent(message)}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const responseText = await textResponse.text();

            // Check if it's a cached response by trying to parse as JSON
            let isCached = false;
            try {
                const jsonResponse = JSON.parse(responseText);
                isCached = jsonResponse.metadata && jsonResponse.metadata.cache_hit;
            } catch (e) {
                // Not JSON, so not a cached response
                isCached = false;
            }

            // Handle both cached and non-cached responses the same way for UI
            await send({type: 'STREAM', chunk: isCached ? JSON.parse(responseText).generation.content : responseText, responseId: messageId});
            await send({type: 'COMPLETE'});

            // Generate audio if needed
            const textForAudio = isCached ? JSON.parse(responseText).generation.content : responseText;
            await generateAudioForMessage(messageId, textForAudio, send);
            return true;

        } catch (error) {
            console.error('Error:', error);
            await send({type: 'STREAM_ERROR', error: 'Failed to get response', responseId: messageId});
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const streamMessage = async (message, send) => {
        if (!message.trim()) return;

        const messageId = uuidv4();
        let completeMessage = '';

        await send({
            type: 'ASK',
            message,
            speaker: "user",
            responder: "ai",
            responseId: messageId
        });

        try {
            const response = await fetch(`/openai/stream?message=${encodeURIComponent(message)}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, {stream: true});
                completeMessage += chunk;
                await send({
                    type: 'STREAM',
                    chunk,
                    responseId: messageId
                });
            }

            await send({type: 'COMPLETE'});

            if (message.mode !== 'openai-image') {
                await generateAudioForMessage(messageId, completeMessage, send);
            }
            return true;

        } catch (error) {
            console.error('Error in streamMessage:', error);
            await send({
                type: 'STREAM_ERROR',
                error: 'Failed to get response',
                responseId: messageId
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, sendMessage, streamMessage};
};