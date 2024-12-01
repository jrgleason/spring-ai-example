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
        if (state.context.audio) {
            state.context.audio.play().catch(error => {
                console.error('Error auto-playing audio:', error);
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
        const audio = state.context.audio;
        if (isPlaying) audio.pause();
        else audio.play().catch(console.error);
    };

    const toggleMute = () => {
        const audio = state.context.audio;
        audio.muted = !audio.muted;
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e) => {
        const audio = state.context.audio;
        const rect = progressRef.current.getBoundingClientRect();
        const newTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        audio.currentTime = newTime;
        setProgress((newTime / audio.duration) * 100);
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