import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioAnalyzer = (initialSession = 'session1') => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSession, setCurrentSession] = useState(initialSession);
    const [audioDataArray, setAudioDataArray] = useState(new Uint8Array(64));
    const [isLoading, setIsLoading] = useState(true);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [playlist, setPlaylist] = useState([]);

    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const dataArrayRef = useRef(new Uint8Array(64));

    // Fetch playlist
    useEffect(() => {
        fetch('/playlist.json')
            .then(res => res.json())
            .then(data => {
                setPlaylist(data);
                // If initialSession is not in playlist, set to first track
                if (!data.find(t => t.id === currentSession) && data.length > 0) {
                    setCurrentSession(data[0].id);
                }
            })
            .catch(err => console.error('Error loading playlist:', err));
    }, []);

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'metadata';
        audioRef.current = audio;

        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
            setIsLoading(false);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                setProgress(audio.currentTime / audio.duration);
            }
        });

        audio.addEventListener('waiting', () => setIsLoading(true));
        audio.addEventListener('canplay', () => setIsLoading(false));

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Load source when session changes or playlist loads
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || playlist.length === 0) return;

        const track = playlist.find(t => t.id === currentSession);
        if (!track) return;

        const wasPlaying = isPlaying;
        audio.pause();
        // Don't reset playing state if we are just switching tracks (unless we want to stop)
        // For smoother experience, we might want to autoplay if it was playing
        setIsPlaying(false);
        setProgress(0);
        setIsLoading(true);

        audio.src = track.url;
        audio.load();

        if (wasPlaying && hasUserInteracted) {
            audio.play().catch(console.error);
            setIsPlaying(true);
        }
    }, [currentSession, playlist]);

    // Setup Web Audio API
    const setupAudioContext = useCallback(() => {
        if (audioContextRef.current) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        sourceNodeRef.current = source;

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }, []);

    // Animation loop for frequency data
    const updateFrequencyData = useCallback(() => {
        if (analyserRef.current && isPlaying) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            setAudioDataArray(new Uint8Array(dataArrayRef.current));
        }
        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
        } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, updateFrequencyData]);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        setHasUserInteracted(true);

        // Resume audio context on first interaction
        if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        // Setup audio context on first play
        if (!audioContextRef.current) {
            setupAudioContext();
            if (audioContextRef.current?.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        }

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }
    }, [isPlaying, setupAudioContext]);

    const seek = useCallback((newProgress) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;

        const newTime = newProgress * audio.duration;
        audio.currentTime = newTime;
        setProgress(newProgress);
    }, []);

    const switchSession = useCallback((session) => {
        if (session !== currentSession) {
            setCurrentSession(session);
        }
    }, [currentSession]);

    const currentTrack = playlist.find(t => t.id === currentSession);

    return {
        audioDataArray,
        togglePlay,
        isPlaying,
        isLoading: isLoading || playlist.length === 0,
        progress,
        duration,
        seek,
        currentSession,
        switchSession,
        trackName: currentTrack?.title || 'Cargando...',
        playlist // Export playlist so UI can use it
    };
};

export default useAudioAnalyzer;
