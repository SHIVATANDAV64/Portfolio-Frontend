import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
    return (
        <a href={href} onClick={onClick} className="relative group hover:text-charcoal transition-colors">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-charcoal transition-all duration-300 group-hover:w-full" />
        </a>
    );
};

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 flex justify-between items-center gap-36 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl font-serif font-bold tracking-tighter text-charcoal"
                >
                    Shivatandav
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-charcoal/80"
                >
                    <NavLink href="#work">Work</NavLink>
                    <NavLink href="#about">About</NavLink>
                    <NavLink href="#contact">Contact</NavLink>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:hidden text-charcoal"
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
