import React, { useEffect } from 'react';
import { useStateContext } from "../state/StateProvider.jsx";

const AudioDebugger = () => {
    const { state } = useStateContext();

    useEffect(() => {
        console.log("=== Audio Debug Info ===");
        console.log("Current state:", state.value);
        console.log("Audio in context:", state.context.audio);

        if (state.context.audio) {
            // Only try to access audio properties if we have an audio element
            const audio = state.context.audio;
            try {
                console.log("Audio properties:", {
                    src: audio.src || 'no src',
                    readyState: audio.readyState,
                    paused: audio.paused,
                    duration: audio.duration || 'unknown',
                    error: audio.error ? 'yes' : 'no'
                });
            } catch (e) {
                console.log("Error accessing audio properties:", e);
            }
        }
    }, [state.context.audio, state.value]);

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Audio Debug Info</h3>
            <div className="space-y-1 text-xs">
                <p>Current State: {state.value || 'unknown'}</p>
                <p>Audio Available: {state.context.audio ? 'Yes' : 'No'}</p>
                {state.context.audio && (
                    <>
                        <p>Ready State: {String(state.context.audio.readyState || 'unknown')}</p>
                        <p>Paused: {String(state.context.audio.paused)}</p>
                        <p>Has Source: {state.context.audio.src ? 'Yes' : 'No'}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AudioDebugger;