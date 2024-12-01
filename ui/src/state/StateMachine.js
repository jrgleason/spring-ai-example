import {assign, createMachine, fromPromise} from "xstate";
import {v4 as uuidv4} from 'uuid';

const askQuestion = fromPromise(async (
    {
        input
    }
) => {
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
    }
});

const streamRecord = fromPromise(async ({input}) => {
    console.log("Streaming record");
});

export const simpleMachine = createMachine({
    initial: 'idle',
    context: {
        messages: {},
        isLoading: false,
        errorMessage: ""
    },
    states: {
        idle: {
            on: {
                ASK: 'ask'
            }
        },
        ask: {
            invoke: {
                src: askQuestion,
                input: ({event, context}) => {
                    console.log("Here we are");
                    return {
                        messages: context.messages,
                        message: event.message,
                        responseId: event.responseId,
                        speaker: event.speaker,
                        responder: event.responder
                    }
                },
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