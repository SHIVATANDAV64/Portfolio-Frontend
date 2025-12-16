// DataProvider: Centralized data with prefetch and stale-while-revalidate caching

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { api, type HeroContent, type AboutContent, type Skill, type Project, type Experience, type Service, type SocialLink } from './api';
import { getCached, setCache, isStale, shouldForceRefresh, CACHE_KEYS } from './cache';

// TTL per collection type
const CACHE_TTL = {
    HERO: 10 * 60 * 1000,
    ABOUT: 10 * 60 * 1000,
    SKILLS: 10 * 60 * 1000,
    PROJECTS: 5 * 60 * 1000,
    EXPERIENCE: 30 * 60 * 1000,
    SERVICES: 30 * 60 * 1000,
    SOCIAL_LINKS: 60 * 60 * 1000,
};

interface DataState {
    hero: HeroContent[];
    about: AboutContent[];
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    services: Service[];
    socialLinks: SocialLink[];
    isLoading: boolean;
    isPrefetched: boolean;
}

interface DataContextValue extends DataState {
    prefetchPriority: () => Promise<void>;
    fetchSecondary: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

// Evaluated once at module load - prevents stale cache on hard refresh
const FORCE_REFRESH = shouldForceRefresh();

async function fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T[]>,
    ttl: number
): Promise<T[]> {
    const cached = getCached<T[]>(key, true);

    if (!FORCE_REFRESH && cached && !isStale(key)) {
        return cached;
    }

    try {
        const fresh = await fetcher();
        setCache(key, fresh, ttl);
        return fresh;
    } catch (error) {
        console.error(`Fetch failed for ${key}:`, error);
        return cached || [];
    }
}

function getInitialData<T>(key: string): T[] {
    if (FORCE_REFRESH) return [];
    return getCached<T[]>(key, true) || [];
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<DataState>({
        hero: getInitialData<HeroContent>(CACHE_KEYS.HERO),
        about: getInitialData<AboutContent>(CACHE_KEYS.ABOUT),
        skills: getInitialData<Skill>(CACHE_KEYS.SKILLS),
        projects: getInitialData<Project>(CACHE_KEYS.PROJECTS),
        experience: getInitialData<Experience>(CACHE_KEYS.EXPERIENCE),
        services: getInitialData<Service>(CACHE_KEYS.SERVICES),
        socialLinks: getInitialData<SocialLink>(CACHE_KEYS.SOCIAL_LINKS),
        isLoading: true,
        isPrefetched: false,
    });

    // Priority: Hero, About, Skills - needed for above-the-fold content
    const prefetchPriority = useCallback(async () => {
        const [hero, about, skills] = await Promise.all([
            fetchWithCache(CACHE_KEYS.HERO, api.getHero, CACHE_TTL.HERO),
            fetchWithCache(CACHE_KEYS.ABOUT, api.getAbout, CACHE_TTL.ABOUT),
            fetchWithCache(CACHE_KEYS.SKILLS, api.getSkills, CACHE_TTL.SKILLS),
        ]);

        setState(prev => ({
            ...prev,
            hero,
            about,
            skills,
            isLoading: false,
            isPrefetched: true,
        }));
    }, []);

    // Secondary: Projects, Experience, Services, Social - loaded after initial render
    const fetchSecondary = useCallback(async () => {
        const [projects, experience, services, socialLinks] = await Promise.all([
            fetchWithCache(CACHE_KEYS.PROJECTS, api.getProjects, CACHE_TTL.PROJECTS),
            fetchWithCache(CACHE_KEYS.EXPERIENCE, api.getExperience, CACHE_TTL.EXPERIENCE),
            fetchWithCache(CACHE_KEYS.SERVICES, api.getServices, CACHE_TTL.SERVICES),
            fetchWithCache(CACHE_KEYS.SOCIAL_LINKS, api.getSocialLinks, CACHE_TTL.SOCIAL_LINKS),
        ]);

        setState(prev => ({
            ...prev,
            projects,
            experience,
            services,
            socialLinks,
        }));
    }, []);

    const refreshAll = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        await prefetchPriority();
        await fetchSecondary();
    }, [prefetchPriority, fetchSecondary]);

    // Auto-fetch secondary after priority completes
    useEffect(() => {
        if (state.isPrefetched) {
            fetchSecondary();
        }
    }, [state.isPrefetched, fetchSecondary]);

    return (
        <DataContext.Provider value={{
            ...state,
            prefetchPriority,
            fetchSecondary,
            refreshAll,
        }}>
            {children}
        </DataContext.Provider>
    );
};

// Hooks

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const useHero = () => {
    const { hero, isLoading } = useData();
    return { data: hero, isLoading };
};

export const useAbout = () => {
    const { about, isLoading } = useData();
    return { data: about, isLoading };
};

export const useSkills = () => {
    const { skills, isLoading } = useData();
    return { data: skills, isLoading };
};

export const useProjects = () => {
    const { projects } = useData();
    return { data: projects };
};

export const useExperience = () => {
    const { experience } = useData();
    return { data: experience };
};

export const useServices = () => {
    const { services } = useData();
    return { data: services };
};
