import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Center offsets using transform for better perf
    const dotTransform = useTransform(
        [cursorXSpring, cursorYSpring],
        ([x, y]) => `translate(${(x as number) - 8}px, ${(y as number) - 8}px)`
    );
    const ringTransform = useTransform(
        [cursorXSpring, cursorYSpring],
        ([x, y]) => `translate(${(x as number) - 24}px, ${(y as number) - 24}px)`
    );

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
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ contain: 'layout style paint' }}
        >
            <motion.div
                className="absolute top-0 left-0 w-4 h-4 bg-terracotta rounded-full mix-blend-difference will-change-transform"
                style={{ transform: dotTransform }}
                animate={{ scale: isHovering ? 0.5 : 1 }}
                layout={false}
            />
            <motion.div
                className="absolute top-0 left-0 w-12 h-12 border border-terracotta rounded-full mix-blend-difference will-change-transform"
                style={{ transform: ringTransform }}
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
                layout={false}
            />
        </div>
    );
};

