import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BioModal = ({ isOpen, onClose }) => {
    const genres = [
        'House',
        'Microhouse',
        'Lounge',
        'Chillout',
        'Jazz House',
        'Trip-hop',
        'World Music'
    ];

    const references = ['Hotel Costes', 'Café del Mar', 'Buddha Bar'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="glass rounded-2xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-all"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-ego text-4xl text-white mb-2"
                            >
                                EGO
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs tracking-widest text-white/50 uppercase"
                            >
                                Curaduría y arquitectura Sonora para Espacios
                            </motion.p>
                        </div>

                        {/* Bio Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-3 mb-6"
                        >
                            <p className="text-sm leading-relaxed text-white/70 font-light">
                                La música no es solo sonido, es la atmósfera que define un espacio. Con más de 10 años en la escena electrónica, <span className="text-white/90">EGO</span> se especializa en convertir entornos físicos en salas de escucha especializada.
                            </p>
                            <p className="text-sm leading-relaxed text-white/70 font-light">
                                Lejos del consumo comercial masivo, la propuesta eleva la identidad de lugares como restaurantes, bares y espacios con estilo a través de una curaduría sonora especifica para cada lugar. Desde el Microhouse, Jazz, Chill, Deep, Lounge hasta texturas de Acid Jazz y World Music, diseño experiencias para audiencias que valoran la sofisticación.
                            </p>
                        </motion.div>

                        {/* Genres */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-5"
                        >
                            <p className="text-xs tracking-widest text-white/40 uppercase mb-2">
                                Géneros
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-2.5 py-1 text-xs tracking-wide text-white/60 border border-white/10 rounded-full"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* References */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-xs tracking-widest text-white/40 uppercase mb-2">
                                Referencias
                            </p>
                            <p className="text-sm text-white/60">
                                {references.join(' • ')}
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BioModal;

