// API service for fetching content from CMS
// This uses the Appwrite get-content function

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiResponse<T> {
    success: boolean;
    collection: string;
    total: number;
    documents: T[];
    error?: string;
}

// Content types
export interface HeroContent {
    $id: string;
    title: string;
    subtitle: string;
    description: string;
    cta_text: string;
    cta_link: string;
}

export interface AboutContent {
    $id: string;
    title: string;
    description: string;
    image_url: string;
}

export interface Skill {
    $id: string;
    name: string;
    category: string;
    icon: string;
}

export interface Project {
    $id: string;
    title: string;
    category: string;
    year: string;
    description: string;
    image_pc: string;
    image_mobile: string;
    link: string;
}

export interface Experience {
    $id: string;
    role: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface Testimonial {
    $id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
}

export interface Service {
    $id: string;
    title: string;
    description: string;
    icon: string;
}

export interface SocialLink {
    $id: string;
    platform: string;
    url: string;
    icon: string;
}

// API functions
const fetchCollection = async <T>(collection: string): Promise<T[]> => {
    try {
        const response = await fetch(`${API_BASE}/get-content?collection=${collection}`);
        const data: ApiResponse<T> = await response.json();

        if (data.success) {
            return data.documents;
        }
        console.error(`Error fetching ${collection}:`, data.error);
        return [];
    } catch (error) {
        console.error(`Network error fetching ${collection}:`, error);
        return [];
    }
};

export const api = {
    getHero: () => fetchCollection<HeroContent>('hero'),
    getAbout: () => fetchCollection<AboutContent>('about'),
    getSkills: () => fetchCollection<Skill>('skills'),
    getProjects: () => fetchCollection<Project>('projects'),
    getExperience: () => fetchCollection<Experience>('experience'),
    getTestimonials: () => fetchCollection<Testimonial>('testimonials'),
    getServices: () => fetchCollection<Service>('services'),
    getSocialLinks: () => fetchCollection<SocialLink>('social_links'),
};

// Contact form submission
export const submitContact = async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
}): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE}/submit-contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch {
        return { success: false, error: 'Network error' };
    }
};
