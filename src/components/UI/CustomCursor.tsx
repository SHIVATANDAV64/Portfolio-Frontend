import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smoother spring for normal movement
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const hoveredElementRef = useRef<Element | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            // If hovering a clickable element, apply magnetic effect
            if (hoveredElementRef.current) {
                const rect = hoveredElementRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Magnetic attraction - cursor moves 30% toward element center
                const magnetStrength = 0.3;
                const magnetX = e.clientX + (centerX - e.clientX) * magnetStrength;
                const magnetY = e.clientY + (centerY - e.clientY) * magnetStrength;

                cursorX.set(magnetX);
                cursorY.set(magnetY);
            } else {
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[data-hoverable="true"]') ||
                target.closest('input') ||
                target.closest('textarea');

            if (clickable) {
                setIsHovering(true);
                hoveredElementRef.current =
                    target.closest('a') ||
                    target.closest('button') ||
                    target.closest('[data-hoverable="true"]') ||
                    target;
            } else {
                setIsHovering(false);
                hoveredElementRef.current = null;
            }
        };

        const handleMouseOut = () => {
            // Reset cursor to actual mouse position when leaving element
            setIsHovering(false);
            hoveredElementRef.current = null;
            cursorX.set(mousePos.current.x);
            cursorY.set(mousePos.current.y);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [cursorX, cursorY]);

    // Constant terracotta color
    const cursorColor = '#9C5C45';

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{ contain: 'layout style paint' }}
        >
            {/* Inner dot - always visible */}
            <motion.div
                className="absolute top-0 left-0 w-4 h-4 rounded-full will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: cursorColor,
                }}
                animate={{
                    scale: isHovering ? 0.6 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                }}
                layout={false}
            />

            {/* Outer ring - only visible on hover */}
            <motion.div
                className="absolute top-0 left-0 w-14 h-14 rounded-full will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    border: `1.5px solid ${cursorColor}`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isHovering ? 1 : 0,
                    opacity: isHovering ? 1 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                }}
                layout={false}
            />
        </div>
    );
};

