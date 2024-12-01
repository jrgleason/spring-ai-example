import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

export const useChat = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getEndpoint = (mode) => {
        const endpoints = {
            'openai-chat': '/openai',
            'openai-image': '/openai/image',
            'anthropic': '/anthropic/anthropic'
        };
        return endpoints[mode] || '/openai';
    };

    const generateAudioForMessage = async (messageId, text, send) => {
        try {
            const audioResponse = await fetch(`/openai/audio?message=${encodeURIComponent(text)}`, {
                method: 'GET'
            });
            if (!audioResponse.ok) throw new Error('Audio stream response was not ok');

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
        await send({type: 'ASK', message, speaker: "user", responder: "ai", responseId: messageId});

        try {
            const endpoint = getEndpoint(mode);
            const textResponse = await fetch(`${endpoint}?message=${encodeURIComponent(message)}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const responseText = await textResponse.text();

            await send({type: 'STREAM', chunk: responseText, responseId: messageId});
            await send({type: 'COMPLETE'});

            await generateAudioForMessage(messageId, responseText, send);
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

        await send({type: 'ASK', message, speaker: "user", responder: "ai", responseId: messageId});

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
            await generateAudioForMessage(messageId, completeMessage, send);
            return true;

        } catch (error) {
            await send({type: 'STREAM_ERROR'});
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, sendMessage, streamMessage};
};