import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useExperience } from '../../lib/DataProvider';
import type { Experience } from '../../lib/api';

// Experience Card Component
const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative flex gap-6 md:gap-12"
        >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-terracotta ring-4 ring-cream z-10" />
                {/* Line connecting to next */}
                <div className="w-px flex-1 bg-gradient-to-b from-terracotta/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="pb-12 flex-1">
                {/* Date range */}
                <div className="flex items-center gap-3 text-sm text-charcoal/50 mb-2 font-mono">
                    <span>{experience.start_date}</span>
                    <span className="w-4 h-px bg-charcoal/30" />
                    <span>{experience.end_date || 'Present'}</span>
                </div>

                {/* Role & Company */}
                <h3 className="text-xl md:text-2xl font-serif text-charcoal group-hover:text-terracotta transition-colors">
                    {experience.role}
                </h3>
                <p className="text-olive font-medium mt-1">{experience.company}</p>

                {/* Description */}
                {experience.description && (
                    <p className="text-charcoal/70 mt-3 leading-relaxed max-w-xl">
                        {experience.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};


export const ExperienceSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { data: experience } = useExperience();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    // Render empty hidden section to keep ref attached when no data
    if (!experience || experience.length === 0) {
        return <section ref={containerRef} style={{ display: 'none' }} />;
    }

    return (
        <section
            ref={containerRef}
            id="experience"
            className="relative py-24 md:py-32 px-6 md:px-20 bg-cream"
        >
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <motion.div
                    style={{ y }}
                    className="mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm uppercase tracking-[0.3em] text-olive/60 font-mono"
                    >
                        Career Journey
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif text-charcoal mt-4"
                    >
                        Experience
                    </motion.h2>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {experience.map((exp, index) => (
                        <ExperienceCard
                            key={exp.$id}
                            experience={exp}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
