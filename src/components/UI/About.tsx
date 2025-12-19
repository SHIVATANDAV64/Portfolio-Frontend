import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useAbout, useSkills } from '../../lib/DataProvider';
import type { Skill } from '../../lib/api';

// Loading skeleton component
const LoadingContent = () => (
    <div className="py-24 md:py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16">
                <div
                    className="h-16 md:h-24 w-3/4 rounded-lg mb-6 bg-cream/5"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite',
                    }}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div
                    className="aspect-[4/3] rounded-2xl bg-cream/5"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite',
                    }}
                />
                <div className="space-y-6">
                    <div className="h-6 w-3/4 bg-cream/5 rounded animate-pulse" />
                    <div className="h-4 w-full bg-cream/5 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-cream/5 rounded animate-pulse" />
                </div>
            </div>
        </div>
    </div>
);

// Skill pill component
const SkillPill = ({ skill, index }: { skill: Skill; index: number }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : 0.1 + (index * 0.03),
                type: "spring",
                stiffness: 300
            }}
            whileHover={{
                scale: shouldReduceMotion ? 1 : 1.05,
                transition: { duration: 0.2 }
            }}
            className="px-4 py-2 rounded-full text-sm font-medium cursor-default transition-all duration-300 bg-cream/10 text-cream/80 border border-cream/10 hover:border-terracotta/50 hover:text-cream hover:bg-cream/15"
        >
            {skill.icon && <span className="mr-1.5">{skill.icon}</span>}
            {skill.name}
        </motion.span>
    );
};

// Fallback pattern for no image
const FallbackPattern = () => (
    <div className="absolute inset-0 overflow-hidden bg-charcoal-500 flex items-center justify-center">
        <span className="text-cream/10 font-serif italic text-6xl">Creator</span>
    </div>
);

export const About = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { data: aboutData, isLoading: aboutLoading } = useAbout();
    const { data: skills, isLoading: skillsLoading } = useSkills();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const yImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);

    const isLoading = aboutLoading || skillsLoading;
    const about = aboutData[0];

    // Group skills by category
    const techSkills = skills.filter(s => s.category?.toLowerCase() === 'tech');
    const artSkills = skills.filter(s => s.category?.toLowerCase() === 'art');

    return (
        <section
            ref={containerRef}
            id="about"
            className="relative min-h-screen bg-charcoal overflow-hidden"
            style={{ position: 'relative' }}
        >
            {isLoading ? (
                <LoadingContent />
            ) : (
                <>
                    {/* Gradient mesh background */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-olive/20 blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-terracotta/15 blur-[100px]" />
                    </div>

                    {/* Main content */}
                    <div className="relative z-10 py-24 md:py-32 px-6 md:px-20">
                        <div className="max-w-7xl mx-auto">

                            {/* Large display heading */}
                            <motion.div
                                style={{ y: shouldReduceMotion ? 0 : yText }}
                                className="mb-16"
                            >
                                <motion.div
                                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                    whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: shouldReduceMotion ? 0 : 1.2,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-cream leading-[0.9]">
                                        {about?.title || 'The Dual Creator'}
                                    </h2>
                                </motion.div>
                            </motion.div>

                            {/* Two column layout: Image | Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                                {/* Left: Image */}
                                <motion.div
                                    style={{ y: shouldReduceMotion ? 0 : yImage }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
                                    className="relative aspect-[4/3] rounded-2xl overflow-hidden group max-h-[500px]"
                                >
                                    {about?.image_url ? (
                                        <>
                                            <img
                                                src={about.image_url}
                                                alt="About"
                                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                        </>
                                    ) : (
                                        <FallbackPattern />
                                    )}

                                    {/* Corner accent */}
                                    <div className="absolute bottom-0 left-0 w-20 h-20">
                                        <div className="absolute bottom-4 left-4 w-full h-full border-l-2 border-b-2 border-terracotta/50" />
                                    </div>
                                </motion.div>

                                {/* Right: Description + Skills flowing elegantly */}
                                <div className="flex flex-col gap-10">

                                    {/* Description - clean inline text, no card wrapper */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0 : 0.6,
                                            delay: shouldReduceMotion ? 0 : 0.2
                                        }}
                                    >
                                        <p className="text-lg md:text-xl font-light leading-relaxed text-cream/70 whitespace-pre-wrap">
                                            {about?.description ||
                                                'My journey exists at the intersection of logic and emotion. I craft digital experiences that blend technical precision with artistic expression.'}
                                        </p>
                                    </motion.div>

                                    {/* Skills section - flowing pills */}
                                    <div className="space-y-6">
                                        {/* Tech Skills */}
                                        {techSkills.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                <h3 className="text-sm uppercase tracking-widest text-cream/40 font-medium mb-4 flex items-center gap-2">
                                                    <span>💻</span> Tech Stack
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {techSkills.map((skill, i) => (
                                                        <SkillPill key={skill.$id} skill={skill} index={i} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Art Skills */}
                                        {artSkills.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                            >
                                                <h3 className="text-sm uppercase tracking-widest text-cream/40 font-medium mb-4 flex items-center gap-2">
                                                    <span>🎨</span> Art Mediums
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {artSkills.map((skill, i) => (
                                                        <SkillPill key={skill.$id} skill={skill} index={i} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Experience badge */}
                                    {/* <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream/5 border border-cream/10 self-start"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                                        <span className="text-cream/60 text-sm font-medium tracking-wide">
                                            Creating since 2020
                                        </span>
                                    </motion.div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};
