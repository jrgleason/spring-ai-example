import React, {useEffect, useRef, useState} from 'react';
import {Pause, Play, Volume2, VolumeX} from 'lucide-react';
import {useStateContext} from "../state/StateProvider.jsx";

const AudioController = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);

    const {state, send} = useStateContext();

    // Watch for audio becoming available
    useEffect(() => {
        console.log("Audio state changed:", state.context.audio);
        const audio = state.context.audio;

        // Check if audio is a proper Audio element
        if (!audio || typeof audio.play !== 'function') {
            return;
        }

        // Wait for browser interaction before trying to play
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
        }
    }, [state.context.audio]);

    // Handle audio event listeners
    useEffect(() => {
        const audio = state.context.audio;
        if (!audio) return;

        const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            resetAudio();
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', updateProgress);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', updateProgress);
        };
    }, [state.context.audio]);

    const togglePlay = () => {
        console.log('=== Toggle Play triggered ===');
        const audio = state.context.audio;

        // Check if audio is a proper Audio element by checking for play method
        if (!audio || typeof audio.play !== 'function') {
            console.warn('No valid audio element available');
            return;
        }

        try {
            if (isPlaying) {
                console.log('Attempting to pause');
                audio.pause();
            } else {
                console.log('Attempting to play');
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Play started successfully');
                            setIsPlaying(true);
                        })
                        .catch(error => {
                            console.error('Error playing audio:', error);
                            setIsPlaying(false);
                        });
                }
            }
        } catch (error) {
            console.error('Error in togglePlay:', error);
        }
    };

    const toggleMute = () => {
        const audio = state.context.audio;
        if (!audio || typeof audio.play !== 'function') {
            return;
        }
        audio.muted = !audio.muted;
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e) => {
        const audio = state.context.audio;
        if (!audio || typeof audio.play !== 'function') {
            return;
        }
        const rect = progressRef.current.getBoundingClientRect();
        const newTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        audio.currentTime = newTime;
        setProgress((newTime / audio.duration) * 100);
    };

    const resetAudio = () => {
        const audio = state.context.audio;
        if (!audio || typeof audio.play !== 'function') {
            return;
        }
        audio.currentTime = 0;
        audio.pause();
    };

    return (
        <div className="flex items-center gap-2 max-w-md">
            <button onClick={togglePlay} className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause size={16} className="text-gray-700"/> : <Play size={16} className="text-gray-700"/>}
            </button>
            <button onClick={toggleMute} className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? <VolumeX size={16} className="text-gray-700"/> :
                    <Volume2 size={16} className="text-gray-700"/>}
            </button>
            <div ref={progressRef} className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer relative"
                 onClick={handleProgressClick}>
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{width: `${progress}%`}}/>
            </div>
        </div>
    );
};

export default AudioController;