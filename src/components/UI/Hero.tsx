import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { useHero } from '../../lib/DataProvider';

const letterAnimation = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 }
};

const AnimatedTitle = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                initial="initial"
                animate="animate"
                transition={{ staggerChildren: 0.05, delayChildren: delay }}
                className="flex"
            >
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        variants={letterAnimation}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block"
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
};

// Loading skeleton
const HeroSkeleton = () => (
    <section className="relative h-screen flex flex-col justify-center px-6 md:px-20 lg:mt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full z-10">
            <div className="flex flex-col gap-2">
                <div className="h-32 w-64 bg-charcoal/10 animate-pulse rounded-lg" />
                <div className="h-32 w-48 bg-charcoal/10 animate-pulse rounded-lg ml-[10vw]" />
            </div>
        </div>
    </section>
);

export const Hero = () => {
    const { data: heroData, isLoading } = useHero();

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const yBg = useTransform(scrollY, [0, 500], [0, 100]);

    // Get first hero content or use defaults
    const hero = heroData[0];
    const titleWords = hero?.title?.split(' ') || ['Digital', 'Artisan'];

    if (isLoading) {
        return <HeroSkeleton />;
    }

    return (
        <section className="relative h-screen flex flex-col justify-center px-6 md:px-20 lg:mt-16 overflow-hidden">
            <motion.div style={{ y }} className="max-w-7xl mx-auto w-full z-10">
                <div className="flex flex-col gap-2">
                    {titleWords.map((word, index) => (
                        <AnimatedTitle
                            key={index}
                            text={word}
                            className={`text-[12vw] md:text-[11vw] leading-[0.85] font-serif font-medium tracking-tight text-charcoal mix-blend-overlay ${index === 1 ? 'italic ml-[10vw]' : ''
                                }`}
                            delay={0.2 + index * 0.3}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
                >
                    <div className="max-w-md backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
                        <p className="text-lg md:text-xl font-light leading-relaxed text-charcoal/90">
                            {hero?.description || 'Crafting digital experiences that blend technical precision with artistic soul.'}
                        </p>
                        <div className="mt-8">
                            <MagneticButton
                                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 border border-charcoal/20 bg-white/10 backdrop-blur-md rounded-full text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105"
                            >
                                {hero?.cta_text || 'View Projects'}
                            </MagneticButton>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm font-medium uppercase tracking-wide px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                        <span className="block w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                        <span>{hero?.subtitle || 'Based in India'}</span>
                        <span className="text-charcoal/40">/</span>
                        <span>Available for freelance</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorative Background Elements */}
            <motion.div style={{ y: yBg }} className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-olive/5 to-transparent -z-10 blur-3xl"></motion.div>
            <motion.div style={{ y: yBg }} className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-terracotta/5 to-transparent -z-10 blur-3xl"></motion.div>
        </section>
    );
};
