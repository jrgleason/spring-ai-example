import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ModeToggle } from './ModeToggle';
import { useChat } from '../hooks/useChat';
import { useStateContext } from "../state/StateProvider.jsx";
import AudioController from './AudioController';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';

const ChatInterface = () => {
    const { state, send } = useStateContext();
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('openai-chat');
    const [isStreaming, setIsStreaming] = useState(true);
    const { isLoading, sendMessage, streamMessage } = useChat();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isStreaming) {
            await streamMessage(message, send);
        } else {
            await sendMessage(message, mode, send);
        }
        setMessage('');
    };

    const EmptyState = () => (
        <Box className="text-center mt-4">
            <Typography variant="body2" className="text-gray-400 italic">
                {mode === 'openai-image'
                    ? 'Describe an image to generate...'
                    : 'Start a conversation...'}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="md" className="py-4">
            <Stack spacing={2}>
                {/* Controls Bar */}
                <Paper className="p-4">
                    <Stack direction="row" spacing={4} alignItems="center">
                        {!isStreaming && <ModeToggle mode={mode} setMode={setMode} />}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isStreaming}
                                    onChange={() => setIsStreaming(!isStreaming)}
                                    inputProps={{ 'aria-label': 'Use streaming' }}
                                />
                            }
                            label={
                                <Typography variant="body2" className="text-gray-600">
                                    Streaming
                                </Typography>
                            }
                        />
                    </Stack>
                </Paper>

                {/* Chat Container */}
                <Card>
                    <CardContent className="h-[600px] p-0">
                        <Stack className="h-full">
                            {/* Messages Area */}
                            <Box className="flex-1 overflow-y-auto p-4">
                                {Object.keys(state.context.messages).length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <Stack spacing={2}>
                                        {Object.values(state.context.messages).map((msg, index) => (
                                            <MessageBubble
                                                key={index}
                                                message={{
                                                    ...msg,
                                                    showAudioController: false
                                                }}
                                            />
                                        ))}
                                        {isLoading && (
                                            <Box className="flex justify-center">
                                                <LoadingSpinner />
                                            </Box>
                                        )}
                                    </Stack>
                                )}
                            </Box>

                            {/* Input Area */}
                            <Paper className="p-4 border-t" elevation={0}>
                                <Stack spacing={2}>
                                    <ChatInput
                                        message={message}
                                        setMessage={setMessage}
                                        isLoading={isLoading}
                                        onSubmit={handleSubmit}
                                        mode={mode}
                                    />
                                    <AudioController />
                                </Stack>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default ChatInterface;