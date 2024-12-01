import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

const AudioController = ({ audio }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);

    useEffect(() => {
        if (!audio) return;

        const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);

        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
        });
        audio.addEventListener('timeupdate', updateProgress);

        return () => {
            audio.removeEventListener('play', () => setIsPlaying(true));
            audio.removeEventListener('pause', () => setIsPlaying(false));
            audio.removeEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(0);
            });
            audio.removeEventListener('timeupdate', updateProgress);
        };
    }, [audio]);

    const togglePlay = () => {
        if (isPlaying) audio.pause();
        else audio.play().catch(console.error);
    };

    const toggleMute = () => {
        audio.muted = !audio.muted;
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const newTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        audio.currentTime = newTime;
        setProgress((newTime / audio.duration) * 100);
    };

    if (!audio) return null;

    return (
        <div className="flex items-center gap-2 max-w-md">
            <button onClick={togglePlay} className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause size={16} className="text-gray-700"/> : <Play size={16} className="text-gray-700"/>}
            </button>
            <button onClick={toggleMute} className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? <VolumeX size={16} className="text-gray-700"/> : <Volume2 size={16} className="text-gray-700"/>}
            </button>
            <div ref={progressRef} className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer relative" onClick={handleProgressClick}>
                <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}/>
            </div>
        </div>
    );
};

export default AudioController;