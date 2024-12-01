import {assign, createMachine, fromPromise} from "xstate";
import {v4 as uuidv4} from 'uuid';

const handleAudioPlayback = fromPromise(async ({input, context}) => {
    const audio = new Audio();
    const mediaSource = new MediaSource();
    audio.src = URL.createObjectURL(mediaSource);

    await new Promise((resolve, reject) => {
        mediaSource.addEventListener('sourceopen', async () => {
            try {
                // Try different MIME types that are commonly supported
                const mimeTypes = [
                    'audio/mpeg',
                    'audio/mp4',
                    'audio/mp4; codecs="mp4a.40.2"',
                    'audio/aac'
                ];

                let sourceBuffer = null;
                for (const mimeType of mimeTypes) {
                    if (MediaSource.isTypeSupported(mimeType)) {
                        try {
                            sourceBuffer = mediaSource.addSourceBuffer(mimeType);
                            break;
                        } catch (e) {
                            console.log(`Failed to add source buffer for ${mimeType}:`, e);
                            continue;
                        }
                    }
                }

                if (!sourceBuffer) {
                    throw new Error('No supported audio MIME type found');
                }

                const reader = input.audioResponse.body.getReader();
                const chunks = [];

                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }

                for (const chunk of chunks) {
                    await new Promise((resolveChunk) => {
                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(chunk);
                            sourceBuffer.addEventListener('updateend', resolveChunk, {once: true});
                        } else {
                            sourceBuffer.addEventListener('updateend', () => {
                                sourceBuffer.appendBuffer(chunk);
                                sourceBuffer.addEventListener('updateend', resolveChunk, {once: true});
                            }, {once: true});
                        }
                    });
                }

                mediaSource.endOfStream();
                resolve(audio);
            } catch (error) {
                reject(error);
            }
        });

        mediaSource.addEventListener('sourceerror', (error) => {
            reject(new Error('MediaSource error: ' + error));
        });
    });

    return {
        ...context.audioElements,
        [input.responseId]: audio
    };
});

const askQuestion = fromPromise(async ({input}) => {
    try {
        console.log(`Adding message ${input.message} by ${input.speaker}`);
        return {
            ...input.messages,
            [uuidv4()]: {
                type: input.speaker,
                content: input.message,
                timestamp: new Date()
            },
            [input.responseId]: {
                type: input.responder,
                content: "",
                timestamp: new Date()
            }
        };
    } catch (error) {
        console.error('Error in askQuestion:', error);
        throw error;
    }
});

export const simpleMachine = createMachine({
    initial: 'idle',
    context: {
        messages: {},
        isLoading: false,
        audioElements: {},
        errorMessage: ""
    },
    states: {
        idle: {
            on: {
                ASK: 'ask',
                PLAYBACK: {
                    target: 'playback',
                }
            }
        },
        playback: {
            invoke: {
                src: handleAudioPlayback,
                input: ({event}) => ({
                    responseId: event.responseId,
                    audioResponse: event.audioResponse
                }),
                onDone: {
                    target: 'idle',
                    actions: assign(({event, context}) => {
                        return {
                            audioElements: event.output,
                        };
                    })
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        errorMessage: ({event}) => event.data
                    })
                }
            }
        },
        ask: {
            invoke: {
                src: askQuestion,
                input: ({event, context}) => ({
                    messages: context.messages,
                    message: event.message,
                    responseId: event.responseId,
                    speaker: event.speaker,
                    responder: event.responder
                }),
                onDone: {
                    actions: assign(({event, context}) => {
                        context.messages = event.output
                    })
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        errorMessage: ({event}) => {
                            return event.data
                        }
                    })
                }
            },
            on: {
                STREAM: {
                    actions: assign(({context, event}) => {
                        const currentValue = context.messages[event.responseId];
                        context.messages[event.responseId] = {
                            ...currentValue,
                            content: currentValue.content + event.chunk
                        }
                    })
                },
                STREAM_ERROR: {
                    target: 'idle',
                    actions: assign({
                        // TODO: Add error message to the responseId
                        errorMessage: ({event}) => {
                            return event.error
                        }
                    })
                },
                COMPLETE: {
                    target: 'idle'
                }
            }
        }
    }
});