import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';

const BioModal = ({ isOpen, onClose }) => {
    const phoneNumber = '+573046814857';
    const whatsappUrl = `https://wa.me/573046814857?text=Hola%20EGO,%20me%20interesa%20tu%20propuesta%20de%20curadur%C3%ADa%20sonora`;

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
                        className="glass rounded-2xl p-8 max-w-sm w-full max-h-[85vh] overflow-y-auto"
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
                        <div className="text-center mb-8">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-ego text-5xl text-white mb-3"
                            >
                                EGO
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs tracking-widest text-white/50 uppercase"
                            >
                                Curaduría Sonora para Espacios
                            </motion.p>
                        </div>

                        {/* Bio Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4 mb-8"
                        >
                            <p className="text-sm leading-relaxed text-white/70 font-light">
                                La música no es solo sonido, es la atmósfera que define un espacio. Con más de 10 años en la escena electrónica, <span className="text-white/90">EGO</span> se especializa en convertir entornos físicos en salas de escucha especializada.
                            </p>
                            <p className="text-sm leading-relaxed text-white/70 font-light">
                                Lejos del consumo comercial masivo, mi propuesta eleva la identidad de restaurantes, bares y espacios elegantes a través de una curaduría sonora exquisita. Desde el Deep House y Lounge hasta texturas de Acid Jazz y World Music, diseño experiencias para audiencias que valoran la sofisticación.
                            </p>
                        </motion.div>

                        {/* Genres */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8"
                        >
                            <p className="text-xs tracking-widest text-white/40 uppercase mb-3">
                                Géneros
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre, index) => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1.5 text-xs tracking-wide text-white/60 border border-white/10 rounded-full"
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
                            className="mb-8"
                        >
                            <p className="text-xs tracking-widest text-white/40 uppercase mb-3">
                                Referencias
                            </p>
                            <p className="text-sm text-white/60">
                                {references.join(' • ')}
                            </p>
                        </motion.div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="border-t border-white/10 pt-6"
                        >
                            <p className="text-center text-lg font-light tracking-wide text-white/90 mb-6">
                                Eleva tu espacio.
                            </p>

                            <div className="space-y-3">
                                {/* Phone Link */}
                                <a
                                    href={`tel:${phoneNumber}`}
                                    className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl glass hover:bg-white/10 transition-all group"
                                >
                                    <Phone className="w-4 h-4 text-white/60 group-hover:text-white/90" />
                                    <span className="text-sm tracking-wide text-white/80 group-hover:text-white">
                                        +57 304 681 4857
                                    </span>
                                </a>

                                {/* WhatsApp Link */}
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-all group"
                                >
                                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                    <span className="text-sm tracking-wide text-[#25D366]">
                                        WhatsApp
                                    </span>
                                </a>
                            </div>

                            <p className="text-center text-xs text-white/30 mt-4">
                                Cel + WhatsApp
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BioModal;
