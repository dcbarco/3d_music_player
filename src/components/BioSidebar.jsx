import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ChevronDown } from 'lucide-react';

const BioSidebar = () => {
    const [isCtaOpen, setIsCtaOpen] = useState(false);

    const phoneNumber = '+573046814857';
    const whatsappUrl = `https://wa.me/573046814857?text=Hola%20EGO,%20me%20interesa%20tu%20propuesta%20de%20curadur%C3%ADa%20sonora`;

    const genres = [
        'House',
        'Microhouse',
        'Lounge',
        'Chillout',
        'Jazz House',
        'Trip-hop',
        'World Music',
        'Lo-Fi'
    ];

    const references = ['Hotel Costes', 'Café del Mar', 'Buddha Bar'];

    return (
        <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex flex-col h-full w-[320px] xl:w-[380px] py-6 pl-10 pr-10 xl:pr-14 glass-sidebar bio-sidebar relative"
        >
            {/* Hablemos Button - Top Right */}
            <div className="flex justify-end mb-auto">
                <div className="relative cta-dropdown">
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
            </div>

            {/* Bio Content - Centered */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Bio Text */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs leading-snug text-white/70 font-light text-justify">
                        La identidad de un espacio no se construye con ruido, sino con atmósfera. <span className="text-white/90">EGO</span> redefine la experiencia sonora, alejándose del formato convencional en vivo para diseñar entornos inmersivos de alta sofisticación.
                    </p>
                    <p className="text-xs leading-snug text-white/70 font-light text-justify">
                        Nuestra curaduría para espacios de concepto actúa como un hilo invisible que invita a la permanencia. Convertimos la música en una herramienta estratégica de retención, creando una narrativa sonora que conecta profundamente con audiencias exigentes.
                    </p>
                </div>

                {/* Genres */}
                <div className="mb-5">
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
                </div>

                {/* References */}
                <div>
                    <p className="text-xs tracking-widest text-white/40 uppercase mb-2">
                        Referencias
                    </p>
                    <p className="text-sm text-white/60">
                        {references.join(' • ')}
                    </p>
                </div>
            </div>
        </motion.aside>
    );
};

export default BioSidebar;



