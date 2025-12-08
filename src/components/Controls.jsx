import { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Loader2 } from 'lucide-react';
import Playlist from './Playlist';

const Controls = ({
    trackName,
    isPlaying,
    isLoading,
    progress,
    onSeek,
    currentSession,
    onSwitchSession,
    onTogglePlay,
    playlist = []
}) => {
    const seekerRef = useRef(null);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

    const handleSeek = useCallback((e) => {
        if (!seekerRef.current) return;

        const rect = seekerRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        const newProgress = Math.max(0, Math.min(1, x / rect.width));
        onSeek(newProgress);
    }, [onSeek]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        handleSeek(e);
    }, [handleSeek]);

    // Format time from progress
    const formatTime = (prog) => {
        const totalSeconds = Math.floor(prog * 300); // Assume ~5 min tracks
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="fixed bottom-0 left-0 right-0 p-6 pb-10"
            >
                <div className="max-w-md mx-auto space-y-5">
                    {/* Track Name and Play Button */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={trackName}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-base font-light tracking-wide text-white/90"
                                >
                                    {trackName}
                                </motion.p>
                            </AnimatePresence>
                            <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                                EGO · Sesión en vivo
                            </p>
                        </div>

                        <button
                            onClick={onTogglePlay}
                            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1f2d 100%)',
                                border: '2px solid rgba(139, 92, 246, 0.6)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }}
                            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 text-white/80 animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white ml-0.5" />
                            )}
                        </button>
                    </div>

                    {/* Seeker Bar with Time */}
                    <div className="space-y-2">
                        <div
                            ref={seekerRef}
                            className="seeker-container"
                            onClick={handleSeek}
                            onTouchStart={handleSeek}
                            onTouchMove={handleTouchMove}
                        >
                            <div className="seeker-track" style={{
                                background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                            }}>
                                <div
                                    className="seeker-progress"
                                    style={{
                                        width: `${progress * 100}%`,
                                        background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)'
                                    }}
                                />
                            </div>
                            <div
                                className="seeker-thumb"
                                style={{
                                    left: `${progress * 100}%`,
                                    background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)'
                                }}
                            />
                        </div>

                        {/* Time indicators */}
                        <div className="flex justify-between text-[10px] text-white/30 tabular-nums">
                            <span>{formatTime(progress)}</span>
                            <span>5:00</span>
                        </div>
                    </div>

                    {/* Playlist Selector */}
                    <div className="flex justify-center">
                        <Playlist
                            currentSession={currentSession}
                            onSelectTrack={onSwitchSession}
                            isOpen={isPlaylistOpen}
                            onOpen={() => setIsPlaylistOpen(true)}
                            onClose={() => setIsPlaylistOpen(false)}
                            tracks={playlist}
                        />
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Controls;
