import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useFetch } from '../../hooks/useFetch';
import { api, type Project } from '../../lib/api';

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <div className="group relative h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 mx-4 md:mx-8">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                    className="h-full w-full"
                >
                    <picture>
                        <source media="(max-width: 768px)" srcSet={project.image_mobile} />
                        <img
                            src={project.image_pc}
                            alt={project.title}
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </picture>
                </motion.div>
            </div>
            {/* Enhanced gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end">
                <div className="overflow-hidden">
                    <motion.h3
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl font-serif font-medium mb-2 text-white drop-shadow-lg"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)' }}
                    >
                        {project.title}
                    </motion.h3>
                </div>
                <div className="flex justify-between items-end border-t border-white/40 pt-4 mt-4">
                    <div
                        className="flex gap-4 text-sm uppercase tracking-widest text-white/90 font-medium"
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                    >
                        <span>{project.category}</span>
                        <span>—</span>
                        <span>{project.year}</span>
                    </div>
                    <Magnetic strength={0.3}>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 cursor-pointer"
                            aria-label={`View project ${project.title}`}
                        >
                            <ArrowUpRight size={20} />
                        </a>
                    </Magnetic>
                </div>
            </div>
        </div>
    );
};

export const Work = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const { data: projects, isLoading } = useFetch<Project>(api.getProjects, []);

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);
    const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Always render with the ref attached - use conditional content inside
    return (
        <section ref={targetRef} id="work" className="relative h-[300vh] bg-cream">
            {isLoading ? (
                // Loading skeleton - inside the same container
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                    <div className="absolute top-12 left-6 md:left-20 z-10">
                        <div className="h-16 w-64 bg-charcoal/10 animate-pulse rounded-lg" />
                    </div>
                    <div className="flex gap-4 px-6 md:px-20">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 bg-gray-200 animate-pulse rounded-2xl mx-4 md:mx-8"
                            />
                        ))}
                    </div>
                </div>
            ) : projects.length === 0 ? (
                // Empty state
                <div className="sticky top-0 flex h-screen items-center justify-center">
                    <div className="max-w-7xl mx-auto text-center px-6 md:px-20">
                        <h2 className="text-4xl md:text-6xl font-serif text-charcoal mb-8">Selected Works</h2>
                        <p className="text-charcoal/60">Projects coming soon...</p>
                    </div>
                </div>
            ) : (
                // Actual content
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                    <motion.div style={{ y: titleY }} className="absolute top-12 left-6 md:left-20 z-10">
                        <h2 className="text-4xl md:text-6xl font-serif text-charcoal mix-blend-difference">
                            Selected Works <span className="text-lg align-top opacity-50">({projects.length.toString().padStart(2, '0')})</span>
                        </h2>
                    </motion.div>

                    <motion.div style={{ x }} className="flex gap-4 px-6 md:px-20">
                        {projects.map((project) => (
                            <ProjectCard key={project.$id} project={project} />
                        ))}
                    </motion.div>
                </div>
            )}
        </section>
    );
};

