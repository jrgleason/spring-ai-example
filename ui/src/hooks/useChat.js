import {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

export const useChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [audioElements, setAudioElements] = useState({});

    const getEndpoint = (mode) => {
        const endpoints = {
            'openai-chat': '/openai',
            'openai-image': '/openai/image',
            'anthropic': '/anthropic/anthropic'
        };
        return endpoints[mode] || '/openai';
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

            const audioResponse = await fetch(`/openai/audio?message=${encodeURIComponent(responseText)}`, {method: 'GET'});
            if (!audioResponse.ok) throw new Error('Audio stream response was not ok');

            const mediaSource = new MediaSource();
            const audio = new Audio();
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

            await send({type: 'COMPLETE'});
            return true;

        } catch (error) {
            await send({type: 'STREAM_ERROR', error: 'Failed to get response', responseId: messageId});
            return false;
        }
    };

    const streamMessage = async (message, send) => {
        if (!message.trim()) return;

        const uuid = uuidv4();
        await send({type: 'ASK', message, speaker: "user", responder: "ai", responseId: uuid});

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
                await send({
                    type: 'STREAM',
                    chunk: decoder.decode(
                        value,
                        {stream: true}
                    ), responseId: uuid
                });
            }

            await send({type: 'COMPLETE'});
            console.log("Streamed successfully");
            return true;

        } catch (error) {
            await send({type: 'STREAM_ERROR'});
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, sendMessage, audioElements, streamMessage};
};