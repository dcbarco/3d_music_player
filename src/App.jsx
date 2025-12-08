import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import BioModal from './components/BioModal';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';

function App() {
    const [isBioOpen, setIsBioOpen] = useState(false);
    const [ripplePoint, setRipplePoint] = useState(null);

    const {
        audioDataArray,
        togglePlay,
        isPlaying,
        isLoading,
        progress,
        seek,
        currentSession,
        switchSession,
        trackName,
        playlist
    } = useAudioAnalyzer('session1');

    const handleTogglePlay = useCallback(() => {
        togglePlay();
    }, [togglePlay]);

    // Get normalized position from event
    const getNormalizedPosition = (e) => {
        const x = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
        return {
            x: (x / window.innerWidth) * 2 - 1,
            y: -(y / window.innerHeight) * 2 + 1
        };
    };

    // Handle screen press START - activate glitch effect
    const handlePressStart = useCallback((e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.seeker-container')) {
            return;
        }
        const pos = getNormalizedPosition(e);
        setRipplePoint({ x: pos.x, y: pos.y, time: Date.now(), active: true });
    }, []);

    // Handle screen press MOVE - update position while pressing
    const handlePressMove = useCallback((e) => {
        if (ripplePoint?.active) {
            const pos = getNormalizedPosition(e);
            setRipplePoint({ x: pos.x, y: pos.y, time: Date.now(), active: true });
        }
    }, [ripplePoint?.active]);

    // Handle screen press END - deactivate glitch effect
    const handlePressEnd = useCallback(() => {
        setRipplePoint(prev => prev ? { ...prev, active: false, time: Date.now() } : null);
    }, []);

    return (
        <div
            className="relative w-full h-full bg-ego-bg overflow-hidden"
            onMouseDown={handlePressStart}
            onMouseMove={handlePressMove}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchMove={handlePressMove}
            onTouchEnd={handlePressEnd}
        >
            {/* 3D Visualizer */}
            <Visualizer
                audioData={audioDataArray}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                currentSession={currentSession}
                ripplePoint={ripplePoint}
            />

            {/* UI Overlay */}
            <div className="ui-overlay">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-start p-6"
                >
                    {/* Logo */}
                    <div>
                        <h1 className="font-ego text-3xl text-white/95 tracking-wide">
                            EGO
                        </h1>
                        <p className="text-[10px] tracking-widest text-white/40 uppercase mt-1 max-w-[140px] leading-relaxed">
                            Curaduría sonora para espacios
                        </p>
                    </div>

                    {/* CTA Button - User Icon Only */}
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsBioOpen(true);
                        }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                            scale: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 50%, #FF0080 100%)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-shift 3s ease infinite',
                            boxShadow: '0 0 30px rgba(255, 0, 128, 0.5), 0 0 60px rgba(121, 40, 202, 0.3)'
                        }}
                        aria-label="Conoce más sobre EGO"
                    >
                        <User className="w-5 h-5 text-white" />
                    </motion.button>
                </motion.header>

                {/* Controls */}
                <Controls
                    trackName={trackName}
                    isPlaying={isPlaying}
                    isLoading={isLoading}
                    progress={progress}
                    onSeek={seek}
                    currentSession={currentSession}
                    onSwitchSession={switchSession}
                    onTogglePlay={handleTogglePlay}
                    playlist={playlist}
                />
            </div>

            {/* Bio Modal */}
            <BioModal
                isOpen={isBioOpen}
                onClose={() => setIsBioOpen(false)}
            />

            {/* CSS for gradient animation */}
            <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    );
};

export default App;
