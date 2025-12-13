import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Center offsets
    const cursorXDot = useTransform(cursorXSpring, x => x - 8);
    const cursorYDot = useTransform(cursorYSpring, y => y - 8);
    const cursorXRing = useTransform(cursorXSpring, x => x - 24);
    const cursorYRing = useTransform(cursorYSpring, y => y - 24);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[data-hoverable="true"]')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-4 h-4 bg-terracotta rounded-full mix-blend-difference"
                style={{
                    x: cursorXDot,
                    y: cursorYDot
                }}
                animate={{
                    scale: isHovering ? 0.5 : 1,
                }}
            />
            <motion.div
                className="absolute top-0 left-0 w-12 h-12 border border-terracotta rounded-full mix-blend-difference"
                style={{
                    x: cursorXRing,
                    y: cursorYRing
                }}
                animate={{
                    scale: isHovering ? 1.5 : 0.5,
                    opacity: isHovering ? 1 : 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    mass: 0.8
                }}
            />
        </div>
    );
};
