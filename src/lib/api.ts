// API service for fetching content from CMS
// Uses Appwrite Functions SDK to call serverless functions

import { functions } from './appwrite';
import { ExecutionMethod } from 'appwrite';

// Function IDs from Appwrite Console
const FUNCTION_IDS = {
    GET_CONTENT: import.meta.env.VITE_FUNCTION_GET_CONTENT,
    SUBMIT_CONTACT: import.meta.env.VITE_FUNCTION_SUBMIT_CONTACT,
};

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

// API functions using Appwrite Functions SDK
const fetchCollection = async <T>(collection: string): Promise<T[]> => {
    try {
        const execution = await functions.createExecution(
            FUNCTION_IDS.GET_CONTENT,
            '',           // body
            false,        // async
            `/?collection=${collection}`,  // path with query param
            ExecutionMethod.GET  // method
        );

        // Parse the response body
        const data: ApiResponse<T> = JSON.parse(execution.responseBody);

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
        const execution = await functions.createExecution(
            FUNCTION_IDS.SUBMIT_CONTACT,
            JSON.stringify(data),  // body
            false,                  // async
            '/',                    // path
            ExecutionMethod.POST  // method
        );

        return JSON.parse(execution.responseBody);
    } catch {
        return { success: false, error: 'Network error' };
    }
};
