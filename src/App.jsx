import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageCircle, Phone, ChevronDown } from 'lucide-react';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import BioModal from './components/BioModal';
import BioSidebar from './components/BioSidebar';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';

function App() {
    const [isBioOpen, setIsBioOpen] = useState(false);
    const [ripplePoint, setRipplePoint] = useState(null);
    const [isCtaOpen, setIsCtaOpen] = useState(false);

    const phoneNumber = '+573046814857';
    const whatsappUrl = `https://wa.me/573046814857?text=Hola%20EGO,%20me%20interesa%20tu%20propuesta%20de%20curadur%C3%ADa%20sonora`;

    const {
        audioDataArray,
        togglePlay,
        isPlaying,
        isLoading,
        isSeeking,
        progress,
        buffered,
        seek,
        currentSession,
        switchSession,
        trackName,
        playlist,
        duration
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
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.seeker-container') || e.target.closest('.cta-dropdown') || e.target.closest('.bio-sidebar')) {
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
            className="relative w-full h-full bg-ego-bg overflow-hidden flex"
            onMouseDown={handlePressStart}
            onMouseMove={handlePressMove}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchMove={handlePressMove}
            onTouchEnd={handlePressEnd}
        >
            {/* Main Content Area */}
            <div className="flex-1 relative">
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
                        className="flex justify-between items-start p-6 lg:pr-6"
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

                        {/* Header Buttons */}
                        <div className="flex items-center gap-3">
                            {/* CTA "Hablemos" Button with Dropdown - Only visible on mobile */}
                            <div className="relative cta-dropdown lg:hidden">
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCtaOpen(!isCtaOpen);
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 50%, #FF0080 100%)',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-shift 3s ease infinite',
                                        boxShadow: '0 0 25px rgba(255, 0, 128, 0.4), 0 0 50px rgba(121, 40, 202, 0.25)'
                                    }}
                                    aria-label="Hablemos - Contactar"
                                >
                                    {/* Invisible spacer to align text with dropdown icons */}
                                    <div className="w-4 h-4" />
                                    <span className="text-sm font-medium text-white tracking-wide">Hablemos</span>
                                    <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${isCtaOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {isCtaOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-max min-w-full rounded-xl glass overflow-hidden z-50"
                                            style={{
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                                            }}
                                        >
                                            <a
                                                href={whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all"
                                                onClick={() => setIsCtaOpen(false)}
                                            >
                                                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                                <span className="text-sm text-white/90">WhatsApp</span>
                                            </a>
                                            <a
                                                href={`tel:${phoneNumber}`}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all border-t border-white/10"
                                                onClick={() => setIsCtaOpen(false)}
                                            >
                                                <Phone className="w-4 h-4 text-white/70" />
                                                <span className="text-sm text-white/90">Llamar</span>
                                            </a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bio Button - Only visible on mobile (hidden on lg+) */}
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsBioOpen(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/15 border border-white/10"
                                aria-label="Conoce más sobre EGO"
                            >
                                <User className="w-5 h-5 text-white/60" />
                            </motion.button>
                        </div>
                    </motion.header>

                    {/* Controls */}
                    <Controls
                        trackName={trackName}
                        isPlaying={isPlaying}
                        isLoading={isLoading}
                        isSeeking={isSeeking}
                        progress={progress}
                        buffered={buffered}
                        duration={duration}
                        onSeek={seek}
                        currentSession={currentSession}
                        onSwitchSession={switchSession}
                        onTogglePlay={handleTogglePlay}
                        playlist={playlist}
                    />
                </div>
            </div>

            {/* Desktop Bio Sidebar - Only visible on lg+ */}
            <BioSidebar />

            {/* Bio Modal - Only for mobile */}
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

