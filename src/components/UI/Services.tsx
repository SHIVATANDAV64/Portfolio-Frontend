import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useData } from '../../lib/DataProvider';
import type { Service } from '../../lib/api';

// Service Card Component
const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="group relative p-8 rounded-2xl bg-charcoal text-cream hover:bg-charcoal/90 transition-colors"
        >
            {/* Icon/Number */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-3xl">{service.icon || '✦'}</span>
                <span className="text-sm font-mono text-cream/40">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-serif mb-4 group-hover:text-terracotta-light transition-colors">
                {service.title}
            </h3>

            {/* Description */}
            <p className="text-cream/70 leading-relaxed">
                {service.description}
            </p>

            {/* Hover accent */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-terracotta via-terracotta-light to-transparent"
            />
        </motion.div>
    );
};


export const ServicesSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { services } = useData();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    // Render empty hidden section to keep ref attached when no data
    if (!services || services.length === 0) {
        return <section ref={containerRef} style={{ display: 'none' }} />;
    }

    return (
        <section
            ref={containerRef}
            id="services"
            className="relative py-24 md:py-32 px-6 md:px-20 bg-cream"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    style={{ y }}
                    className="mb-16 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm uppercase tracking-[0.3em] text-olive/60 font-mono"
                    >
                        What I Offer
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif text-charcoal mt-4"
                    >
                        Services
                    </motion.h2>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.$id}
                            service={service}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
