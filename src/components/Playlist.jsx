import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, ChevronDown, Check } from 'lucide-react';

const Playlist = forwardRef(({ currentSession, onSelectTrack, isOpen, onClose, onOpen, tracks = [] }, ref) => {

    useImperativeHandle(ref, () => ({
        open: onOpen,
        close: onClose,
        toggle: () => isOpen ? onClose() : onOpen()
    }));

    const currentTrack = tracks.find(t => t.id === currentSession);

    return (
        <>
            {/* Playlist Toggle Button */}
            <motion.button
                onClick={onOpen}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full glass transition-all hover:bg-white/10 active:scale-95"
                whileTap={{ scale: 0.95 }}
            >
                <Music2 className="w-4 h-4 text-white/60" />
                <span className="text-xs tracking-wide text-white/80">
                    Playlist
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </motion.button>

            {/* Playlist Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={onClose}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 30,
                                stiffness: 300
                            }}
                            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl glass overflow-hidden"
                            style={{ maxHeight: '70vh' }}
                        >
                            {/* Handle */}
                            <div className="flex justify-center py-3">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            {/* Header */}
                            <div className="px-6 pb-4 border-b border-white/10">
                                <h3 className="text-sm font-medium tracking-wider text-white/90">
                                    Sesiones Disponibles
                                </h3>
                                <p className="text-xs text-white/40 mt-1">
                                    Selecciona una pista para reproducir
                                </p>
                            </div>

                            {/* Track List */}
                            <div className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 120px)' }}>
                                {tracks.map((track, index) => {
                                    const isActive = track.id === currentSession;

                                    return (
                                        <motion.button
                                            key={track.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => {
                                                onSelectTrack(track.id);
                                                onClose();
                                            }}
                                            className={`w-full px-6 py-4 flex items-center gap-4 transition-all ${isActive
                                                ? 'bg-white/10'
                                                : 'hover:bg-white/5 active:bg-white/10'
                                                }`}
                                        >
                                            {/* Track Number/Check */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive
                                                ? 'bg-gradient-to-br from-purple-500 to-cyan-500'
                                                : 'bg-white/10'
                                                }`}>
                                                {isActive ? (
                                                    <Check className="w-4 h-4 text-white" />
                                                ) : (
                                                    <span className="text-xs text-white/60">{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Track Info */}
                                            <div className="flex-1 text-left">
                                                <p className={`text-sm tracking-wide ${isActive ? 'text-white' : 'text-white/80'
                                                    }`}>
                                                    {track.title}
                                                </p>
                                                <p className="text-xs text-white/40 mt-0.5">
                                                    {track.subtitle}
                                                </p>
                                            </div>

                                            {/* Duration */}
                                            <span className="text-xs text-white/40 tabular-nums">
                                                {track.duration}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/10">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl bg-white/5 text-sm text-white/60 tracking-wide hover:bg-white/10 transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
});

Playlist.displayName = 'Playlist';

export default Playlist;
