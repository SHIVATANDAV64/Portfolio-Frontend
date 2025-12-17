import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

// Detect if background is dark at a given point
const isBackgroundDark = (x: number, y: number): boolean => {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    let current: Element | null = element;
    while (current) {
        const style = window.getComputedStyle(current);
        const bgColor = style.backgroundColor;

        // Parse rgba/rgb values
        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const [, r, g, b] = match.map(Number);
            // Check if alpha is not 0 (transparent)
            const alphaMatch = bgColor.match(/rgba\([^)]+,\s*([\d.]+)\)/);
            const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;

            if (alpha > 0.1) {
                // Calculate luminance
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                return luminance < 0.5;
            }
        }

        current = current.parentElement;
    }
    return false;
};

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    isDark?: boolean;
}

const NavLink = ({ href, children, onClick, isDark }: NavLinkProps) => {
    const textColor = isDark ? 'text-cream hover:text-cream/80' : 'text-charcoal hover:text-charcoal/80';
    const underlineColor = isDark ? 'bg-cream' : 'bg-charcoal';

    return (
        <a href={href} onClick={onClick} className={`relative group transition-colors ${textColor}`}>
            {children}
            <span className={`absolute -bottom-1 left-0 w-0 h-px ${underlineColor} transition-all duration-300 group-hover:w-full`} />
        </a>
    );
};

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkBg, setIsDarkBg] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const rafId = useRef<number>(0);

    const checkBackground = useCallback(() => {
        if (!navRef.current) return;

        const rect = navRef.current.getBoundingClientRect();
        // Check point just below the navbar center
        const x = rect.left + rect.width / 2;
        const y = rect.bottom + 10;

        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            setIsDarkBg(isBackgroundDark(x, y));
        });
    }, []);

    useEffect(() => {
        // Initial check
        checkBackground();

        // Check on scroll
        window.addEventListener('scroll', checkBackground, { passive: true });
        window.addEventListener('resize', checkBackground);

        return () => {
            window.removeEventListener('scroll', checkBackground);
            window.removeEventListener('resize', checkBackground);
            cancelAnimationFrame(rafId.current);
        };
    }, [checkBackground]);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Dynamic colors based on background
    const textColorClass = isDarkBg ? 'text-cream' : 'text-charcoal';
    const bgClass = isDarkBg
        ? 'border-cream/20 bg-charcoal/30'
        : 'border-white/20 bg-white/10';

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 flex justify-between items-center gap-36 rounded-full backdrop-blur-md shadow-lg border transition-colors duration-300 ${bgClass}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-2xl font-serif tracking-wide transition-colors duration-300 ${textColorClass}`}
                >
                    Shivatandav
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase"
                >
                    <NavLink href="#work" isDark={isDarkBg}>Work</NavLink>
                    <NavLink href="#about" isDark={isDarkBg}>About</NavLink>
                    <NavLink href="#contact" isDark={isDarkBg}>Contact</NavLink>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`md:hidden transition-colors duration-300 ${textColorClass}`}
                    onClick={toggleMenu}
                >
                    <Menu size={24} />
                </motion.button>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center md:hidden"
                    >
                        <button
                            onClick={toggleMenu}
                            className="absolute top-8 right-8 text-charcoal"
                            aria-label="Close menu"
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col gap-8 text-center">
                            <NavLink href="#work" onClick={toggleMenu}>
                                <span className="text-4xl font-serif">Work</span>
                            </NavLink>
                            <NavLink href="#about" onClick={toggleMenu}>
                                <span className="text-4xl font-serif">About</span>
                            </NavLink>
                            <NavLink href="#contact" onClick={toggleMenu}>
                                <span className="text-4xl font-serif">Contact</span>
                            </NavLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
