import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api, AboutContent, Skill } from '../../lib/api';

// Loading skeleton
const AboutSkeleton = () => (
    <section id="about" className="py-24 md:py-32 px-6 md:px-20 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
                <div className="space-y-12">
                    <div>
                        <div className="h-12 w-64 bg-charcoal/10 animate-pulse rounded-lg mb-8" />
                        <div className="h-24 w-full bg-charcoal/10 animate-pulse rounded-lg" />
                    </div>
                </div>
                <div className="aspect-[3/4] bg-beige animate-pulse md:mt-20" />
            </div>
        </div>
    </section>
);

export const About = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const { data: aboutData, isLoading: aboutLoading } = useFetch<AboutContent>(api.getAbout, []);
    const { data: skills, isLoading: skillsLoading } = useFetch<Skill>(api.getSkills, []);

    const yLeft = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [-100, 100]);

    const isLoading = aboutLoading || skillsLoading;

    if (isLoading) {
        return <AboutSkeleton />;
    }

    const about = aboutData[0];

    // Group skills by category
    const techSkills = skills.filter(s => s.category?.toLowerCase() === 'tech');
    const artSkills = skills.filter(s => s.category?.toLowerCase() === 'art');

    return (
        <section ref={containerRef} id="about" className="py-24 md:py-32 px-6 md:px-20 bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* Left Column: The Narrative */}
                    <motion.div style={{ y: yLeft }} className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-serif mb-8">
                                {about?.title || 'The Dual Creator'}
                            </h2>
                            <div
                                className="text-lg md:text-xl font-light leading-relaxed text-charcoal/80 space-y-6"
                                dangerouslySetInnerHTML={{
                                    __html: about?.description?.replace(/\n/g, '<br/>') ||
                                        'My journey exists at the intersection of logic and emotion.'
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex gap-4"
                        >
                            {techSkills.length > 0 && (
                                <div className="p-6 bg-beige/30 rounded-lg w-full">
                                    <h3 className="font-serif text-xl mb-4">Tech Stack</h3>
                                    <ul className="space-y-2 text-sm uppercase tracking-wide opacity-70">
                                        {techSkills.map((skill, i) => (
                                            <motion.li
                                                key={skill.$id}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                                viewport={{ once: true }}
                                            >
                                                {skill.name}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {artSkills.length > 0 && (
                                <div className="p-6 bg-beige/30 rounded-lg w-full">
                                    <h3 className="font-serif text-xl mb-4">Art Mediums</h3>
                                    <ul className="space-y-2 text-sm uppercase tracking-wide opacity-70">
                                        {artSkills.map((skill, i) => (
                                            <motion.li
                                                key={skill.$id}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                                viewport={{ once: true }}
                                            >
                                                {skill.name}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Visual Representation */}
                    <motion.div
                        style={{ y: yRight }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-[3/4] bg-beige md:mt-20 overflow-hidden rounded-lg"
                    >
                        {about?.image_url ? (
                            <img
                                src={about.image_url}
                                alt="About"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-charcoal/20 font-serif text-6xl">
                                Portrait
                            </div>
                        )}
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-charcoal text-cream flex items-center justify-center rounded-full text-sm font-medium uppercase tracking-wide animate-spin-slow">
                            Since 2020
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
