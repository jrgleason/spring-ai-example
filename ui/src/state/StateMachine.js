import {assign, createMachine, fromPromise} from "xstate";
import {v4 as uuidv4} from 'uuid';

const handleAudioPlayback = fromPromise(async ({input, context}) => {
    const audio = new Audio();
    const mediaSource = new MediaSource();
    audio.src = URL.createObjectURL(mediaSource);

    const appendChunks = async (sourceBuffer, reader) => {
        const chunks = [];
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        for (const chunk of chunks) {
            await new Promise((resolve, reject) => {
                if (!sourceBuffer.updating) {
                    sourceBuffer.appendBuffer(chunk);
                    sourceBuffer.addEventListener('updateend', resolve, {once: true});
                } else {
                    sourceBuffer.addEventListener('updateend', () => {
                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(chunk);
                            sourceBuffer.addEventListener('updateend', resolve, {once: true});
                        } else {
                            reject(new Error('SourceBuffer is still updating'));
                        }
                    }, {once: true});
                }
            }).catch(error => {
                console.error('Error appending chunk:', error);
            });
        }
    };

    await new Promise((resolve, reject) => {
        mediaSource.addEventListener('sourceopen', async () => {
            try {
                const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                const reader = input.audioResponse.body.getReader();
                await appendChunks(sourceBuffer, reader);
                mediaSource.endOfStream();
                resolve(audio);
            } catch (error) {
                reject(error);
            }
        });
    }).catch(error => {
        console.error('Error during media source open:', error);
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
                    actions: assign({
                        audioElements: (_, {output}) => output,
                        messages: (context, {output}) => ({
                            ...context.messages,
                            [Object.keys(output)[Object.keys(output).length - 1]]: {
                                ...context.messages[Object.keys(output)[Object.keys(output).length - 1]],
                                hasAudio: true
                            }
                        })
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
                    actions: assign({
                        messages: (_, {output}) => output
                    })
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        errorMessage: ({event}) => event.data
                    })
                }
            },
            on: {
                STREAM: {
                    actions: assign({
                        messages: (context, event) => ({
                            ...context.messages,
                            [event.responseId]: {
                                ...context.messages[event.responseId],
                                content: context.messages[event.responseId].content + event.chunk
                            }
                        })
                    })
                },
                STREAM_ERROR: {
                    target: 'idle',
                    actions: assign({
                        errorMessage: ({event}) => event.error
                    })
                },
                COMPLETE: {
                    target: 'idle'
                }
            }
        }
    }
});