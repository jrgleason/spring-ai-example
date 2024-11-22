import React, {useEffect, useRef, useState} from 'react';
import {Pause, Play, Volume2, VolumeX} from 'lucide-react';

const AudioController = ({audio}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);

    useEffect(() => {
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        const handleTimeUpdate = () => {
            const percentage = (audio.currentTime / audio.duration) * 100;
            setProgress(percentage);
        };

        // Auto-play when audio is ready
        const handleCanPlay = () => {
            audio.play().catch(console.error);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [audio]);

    const togglePlay = () => {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
    };

    const toggleMute = () => {
        if (!audio) return;

        audio.muted = !audio.muted;
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e) => {
        if (!audio || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        const newTime = (percentage / 100) * audio.duration;

        audio.currentTime = newTime;
        setProgress(percentage);
    };

    if (!audio) return null;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={togglePlay}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ?
                    <Pause size={16} className="text-gray-700"/> :
                    <Play size={16} className="text-gray-700"/>
                }
            </button>

            <button
                onClick={toggleMute}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ?
                    <VolumeX size={16} className="text-gray-700"/> :
                    <Volume2 size={16} className="text-gray-700"/>
                }
            </button>

            <div
                ref={progressRef}
                className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer"
                onClick={handleProgressClick}
            >
                <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{width: `${progress}%`}}
                />
            </div>
        </div>
    );
};

export default AudioController;