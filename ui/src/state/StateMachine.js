import {assign, createMachine, fromPromise} from "xstate";
import {v4 as uuidv4} from 'uuid';

const handleAudioPlayback = fromPromise(async ({ input, context }) => {
    const audio = new Audio();
    const mediaSource = new MediaSource();

    // Create object URL and set as audio source
    audio.src = URL.createObjectURL(mediaSource);

    return new Promise((resolve, reject) => {
        mediaSource.addEventListener('sourceopen', async () => {
            try {
                console.log("Media source opened");
                // Get the audio stream
                const response = input.audioResponse;
                const reader = response.body.getReader();

                // Try to determine content type from response headers
                const contentType = response.headers.get('content-type');
                let sourceBuffer;

                // Fallback MIME types if content-type header is missing or unsupported
                const mimeTypes = [
                    contentType,
                    'audio/mpeg',
                    'audio/mp4',
                    'audio/aac',
                    'audio/webm',
                    'audio/webm; codecs=opus'
                ].filter(Boolean); // Remove null/undefined entries

                // Try each MIME type until we find one that works
                for (const mimeType of mimeTypes) {
                    if (MediaSource.isTypeSupported(mimeType)) {
                        try {
                            sourceBuffer = mediaSource.addSourceBuffer(mimeType);
                            break;
                        } catch (e) {
                            console.warn(`Failed to create source buffer for ${mimeType}:`, e);
                        }
                    }
                }

                if (!sourceBuffer) {
                    throw new Error('No supported audio format found');
                }

                // Function to safely append buffer
                const appendBuffer = async (chunk) => {
                    return new Promise((resolveAppend) => {
                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(chunk);
                            sourceBuffer.addEventListener('updateend', resolveAppend, { once: true });
                        } else {
                            sourceBuffer.addEventListener('updateend', () => {
                                sourceBuffer.appendBuffer(chunk);
                                sourceBuffer.addEventListener('updateend', resolveAppend, { once: true });
                            }, { once: true });
                        }
                    });
                };

                // Process chunks as they arrive
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    try {
                        await appendBuffer(value);
                    } catch (e) {
                        console.error('Error appending buffer:', e);
                        // If we hit a quota exceeded error, try to remove some data
                        if (e.name === 'QuotaExceededError') {
                            const removeAmount = value.length;
                            await new Promise(resolveRemove => {
                                sourceBuffer.remove(0, removeAmount / sourceBuffer.timestampOffset);
                                sourceBuffer.addEventListener('updateend', resolveRemove, { once: true });
                            });
                            await appendBuffer(value);
                        } else {
                            throw e;
                        }
                    }
                }

                // All chunks processed, end the stream
                if (mediaSource.readyState === 'open') {
                    mediaSource.endOfStream();
                }

                // Set up audio element event handlers
                audio.addEventListener('canplay', () => {
                    resolve(audio);
                }, { once: true });

                audio.addEventListener('error', (e) => {
                    reject(new Error('Audio element error: ' + e.error));
                }, { once: true });

            } catch (error) {
                reject(error);
            }
        }, { once: true });

        mediaSource.addEventListener('sourceclosed', () => {
            reject(new Error('MediaSource was closed'));
        }, { once: true });

        mediaSource.addEventListener('sourceerror', (error) => {
            reject(new Error('MediaSource error: ' + error));
        }, { once: true });
    });
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
                        context.audio = event.output;
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
                    actions: assign(({event, context}) => {
                        context.errorMessage = event.data
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