import React, {useState} from 'react';
import {LoadingSpinner} from './LoadingSpinner';
import {MessageBubble} from './MessageBubble';
import {ChatInput} from './ChatInput';
import {ModeToggle} from './ModeToggle';
import {useChat} from '../hooks/useChat';
import {useStateContext} from "../state/StateProvider.jsx";

const ChatInterface = () => {
    const {state, send} = useStateContext();

    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('openai-chat');
    const [isStreaming, setIsStreaming] = useState(true);
    const {isLoading, sendMessage, audioElements, streamMessage} = useChat();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isStreaming) {
            await streamMessage(message, send);
        } else {
            await sendMessage(message, mode, send);
        }
        setMessage('');
    };

    // Helper function to automatically scroll to bottom
    const scrollToBottom = (behavior = 'smooth') => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior
        });
    };

    // Scroll to bottom whenever messages change
    React.useEffect(() => {
        scrollToBottom();
    }, [state.context.messages]);

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <ModeToggle mode={mode} setMode={setMode}/>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Streaming</label>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isStreaming}
                            onClick={() => setIsStreaming(!isStreaming)}
                            className={`
                                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                ${isStreaming ? 'bg-blue-600' : 'bg-gray-200'}
                            `}
                        >
                            <span className="sr-only">Use streaming</span>
                            <span
                                aria-hidden="true"
                                className={`
                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                                    transition duration-200 ease-in-out
                                    ${isStreaming ? 'translate-x-5' : 'translate-x-0'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 scroll-smooth">
                    {Object.keys(state.context.messages).length === 0 ? (
                        <div className="text-gray-400 italic text-center mt-4">
                            {mode === 'openai-image'
                                ? 'Describe an image to generate...'
                                : 'Start a conversation...'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.values(state.context.messages).map((msg, index) => (
                                <MessageBubble
                                    key={index}
                                    message={msg}
                                    audio={msg.hasAudio ? audioElements[msg.messageId] : null}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex justify-center">
                                    <LoadingSpinner/>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    mode={mode}
                />
            </div>
        </div>
    );
};

export default ChatInterface;