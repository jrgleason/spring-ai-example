import React, {useCallback, useEffect, useState} from 'react';
import {Alert, AlertTitle, Button, Card, CardContent, CardHeader} from '@mui/material';

const DeviceStateComponent = () => {
    const [deviceStates, setDeviceStates] = useState({});
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);

    const connectWebSocket = useCallback(() => {
        try {
            const ws = new WebSocket('ws://localhost:8080/ws/devices');

            ws.onopen = () => {
                setConnectionStatus('connected');
                setError(null);
                console.log('WebSocket connection established');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Handle the app error message format
                    if (data.appError) {
                        setError(data.appError.message);
                        return;
                    }

                    // Handle normal device state updates
                    setDeviceStates(prevStates => ({
                        ...prevStates,
                        [data.device]: data.state
                    }));
                } catch (err) {
                    console.error('Error parsing message:', err);
                    setError('Failed to parse server message');
                }
            };

            ws.onclose = () => {
                setConnectionStatus('disconnected');
                console.log('WebSocket connection closed');
                // Attempt to reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError('WebSocket connection error');
                setConnectionStatus('error');
            };

            setSocket(ws);
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            setError('Failed to create WebSocket connection');
            setConnectionStatus('error');
        }
    }, []);

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connectWebSocket]);

    const sendDeviceCommand = useCallback((device, state) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                device,
                state,
                timestamp: new Date().toISOString()
            });
            socket.send(message);
        } else {
            setError('Cannot send command: WebSocket is not connected');
        }
    }, [socket]);

    return (
        <Card className="w-full max-w-2xl mx-auto my-4">
            <CardHeader>
                <h2 className="text-2xl font-bold">Device Control Panel</h2>
                <div className="text-sm text-gray-500">
                    Status: {connectionStatus}
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert severity="error" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}
                <div className="space-y-4">
                    {Object.entries(deviceStates).map(([device, state]) => (
                        <div key={device} className="flex items-center justify-between p-2 border rounded">
                            <span className="font-medium">{device}</span>
                            <span
                                className={`px-2 py-1 rounded ${state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {state ? 'On' : 'Off'}
                            </span>
                        </div>
                    ))}

                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={() => sendDeviceCommand('device1', true)}
                            disabled={connectionStatus !== 'connected'}
                        >
                            Turn On Device 1
                        </Button>
                        <Button
                            onClick={() => sendDeviceCommand('device1', false)}
                            disabled={connectionStatus !== 'connected'}
                            variant="outline"
                        >
                            Turn Off Device 1
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DeviceStateComponent;