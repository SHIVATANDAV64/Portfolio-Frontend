import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Instagram, Copy, Check, Send } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useState, useRef, type FormEvent } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api, type SocialLink, submitContact } from '../../lib/api';

// Icon mapping for social platforms
const getIconForPlatform = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('github')) return Github;
    if (platformLower.includes('linkedin')) return Linkedin;
    if (platformLower.includes('instagram')) return Instagram;
    return Github; // default
};

export const Contact = () => {
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const { data: socialLinks } = useFetch<SocialLink>(api.getSocialLinks, []);

    const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    // Get contact email from about data or use default
    const contactEmail = 'rudrashiva654@gmail.com'; // This could be fetched from a settings collection

    const copyEmail = () => {
        navigator.clipboard.writeText(contactEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const result = await submitContact(formData);

        if (result.success) {
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setSubmitStatus('error');
        }

        setIsSubmitting(false);
    };

    return (
        <section ref={containerRef} id="contact" className="py-24 md:py-32 px-6 md:px-20 bg-charcoal text-cream overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Info */}
                    <motion.div
                        style={{ y }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif mb-8">Let's create something timeless.</h2>
                        <p className="text-lg md:text-xl font-light opacity-80 mb-12 max-w-2xl">
                            Whether you need a distinctive web presence or a custom portrait,
                            I'm always open to discussing new projects and collaborations.
                        </p>

                        <div className="relative inline-block group mb-8">
                            <a
                                href={`mailto:${contactEmail}`}
                                className="inline-block text-2xl md:text-3xl font-serif border-b border-cream/30 hover:border-cream transition-colors pb-2"
                            >
                                {contactEmail}
                            </a>
                            <button
                                onClick={copyEmail}
                                className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-cream/60 hover:text-cream"
                                title="Copy email"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        <div className="flex gap-6 mt-8">
                            {socialLinks.map((social) => {
                                const IconComponent = getIconForPlatform(social.platform);
                                return (
                                    <Magnetic key={social.$id}>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Visit my ${social.platform}`}
                                            className="block p-4 border border-cream/20 rounded-full hover:bg-cream hover:text-charcoal transition-colors"
                                        >
                                            <IconComponent size={24} />
                                        </a>
                                    </Magnetic>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-70">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 focus:border-cream/50 focus:outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-70">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 focus:border-cream/50 focus:outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 opacity-70">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 focus:border-cream/50 focus:outline-none transition-colors"
                                    placeholder="Project inquiry"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 opacity-70">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 focus:border-cream/50 focus:outline-none transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            {submitStatus === 'success' && (
                                <div className="p-4 bg-green-500/20 rounded-lg text-green-300">
                                    Message sent successfully! I'll get back to you soon.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="p-4 bg-red-500/20 rounded-lg text-red-300">
                                    Failed to send message. Please try again.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-3 px-8 py-4 bg-cream text-charcoal rounded-full font-medium hover:bg-cream/90 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
