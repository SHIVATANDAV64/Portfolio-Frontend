// LoadingScreen: Branded loading with data prefetch, reveals hero after data ready

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useData } from '../lib/DataProvider';

const THEME = {
    charcoal: '#1A1A1A',
    terracotta: '#9C5C45',
    cream: '#F9F9F7',
    olive: '#3A4D39',
};

// Session-based detection to skip animation on SPA navigation
const ANIMATION_SHOWN_KEY = 'portfolio_loading_ts';
const LOAD_TIMESTAMP = Date.now();

const checkAlreadyShown = (): boolean => {
    try {
        const storedTimestamp = sessionStorage.getItem(ANIMATION_SHOWN_KEY);
        if (!storedTimestamp) return false;
        return LOAD_TIMESTAMP <= parseInt(storedTimestamp, 10);
    } catch {
        return false;
    }
};

const LoadingDots = () => (
    <div className="flex gap-2 justify-center mt-8">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="w-2 h-2 rounded-full bg-cream/60"
                style={{ animation: `pulse 2.4s ease-in-out ${i * 0.2}s infinite` }}
            />
        ))}
        <style>{`
            @keyframes pulse {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }
        `}</style>
    </div>
);

const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const chars = containerRef.current.querySelectorAll('.char');
        gsap.fromTo(chars,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay, ease: "power3.out" }
        );
    }, [delay]);

    return (
        <div ref={containerRef} className="overflow-hidden">
            <div className="flex justify-center">
                {text.split('').map((char, i) => (
                    <span key={i} className="char inline-block font-serif italic text-5xl md:text-7xl text-cream">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>
        </div>
    );
};

export const LoadingScreen = () => {
    const hasShownThisSession = useRef(checkAlreadyShown());
    const [isVisible, setIsVisible] = useState(!hasShownThisSession.current);
    const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading');

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const { prefetchPriority, isPrefetched } = useData();
    const startTime = useRef(Date.now());

    // Prefetch data during loading animation
    useEffect(() => {
        prefetchPriority();
    }, [prefetchPriority]);

    // Reveal when data ready AND minimum time elapsed
    useEffect(() => {
        if (!isVisible || phase !== 'loading') return;

        if (isPrefetched) {
            const elapsed = Date.now() - startTime.current;
            const minTime = 1500;
            const remainingTime = Math.max(0, minTime - elapsed);

            const timer = setTimeout(() => setPhase('revealing'), remainingTime);
            return () => clearTimeout(timer);
        }

        // Fallback timeout
        const timeout = setTimeout(() => setPhase('revealing'), 8000);
        return () => clearTimeout(timeout);
    }, [isPrefetched, isVisible, phase]);

    // Slide-up reveal animation
    useEffect(() => {
        if (phase !== 'revealing' || !containerRef.current) return;

        gsap.timeline({
            onComplete: () => {
                sessionStorage.setItem(ANIMATION_SHOWN_KEY, Date.now().toString());
                document.body.style.overflow = '';
                setPhase('done');
                setIsVisible(false);
            }
        }).to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut"
        });
    }, [phase]);

    // Lock scroll during loading
    useEffect(() => {
        if (isVisible && phase !== 'done') {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isVisible, phase]);

    if (hasShownThisSession.current || !isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: THEME.charcoal }}
        >
            {/* Background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
                    style={{ backgroundColor: THEME.olive, opacity: 0.15 }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
                    style={{ backgroundColor: THEME.terracotta, opacity: 0.1 }}
                />
            </div>

            {/* Content */}
            <div ref={contentRef} className="relative z-10 text-center">
                <AnimatedText text="Portfolio" delay={0.3} />

                <div className="mt-4 overflow-hidden">
                    <p
                        className="text-cream/40 text-sm uppercase tracking-[0.3em] font-light"
                        style={{ animation: 'fadeIn 1s ease-out 1s forwards', opacity: 0 }}
                    >
                        Loading Experience
                    </p>
                </div>

                <LoadingDots />

                {isPrefetched && phase === 'loading' && (
                    <p
                        className="mt-6 text-terracotta/80 text-xs uppercase tracking-widest"
                        style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
                    >
                        Ready
                    </p>
                )}
            </div>

            {/* Progress line */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-terracotta to-transparent"
                style={{ width: isPrefetched ? '100%' : '0%', transition: 'width 0.5s ease-out' }}
            />

            <style>{`
                @keyframes fadeIn { to { opacity: 1; } }
            `}</style>
        </div>
    );
};
