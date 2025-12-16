// Cache: localStorage with stale-while-revalidate pattern

const CACHE_PREFIX = 'portfolio_cache_';
const CACHE_VERSION_KEY = 'portfolio_cache_version';
const CACHE_VERSION = '1.1';
const DEFAULT_TTL_MS = 5 * 60 * 1000;

// Hard refresh detection via sessionStorage timestamp comparison
const PAGE_LOAD_KEY = 'portfolio_page_load_ts';
const LOAD_TIMESTAMP = Date.now();

// Returns true on hard refresh or new tab
export const shouldForceRefresh = (): boolean => {
    try {
        const storedTimestamp = sessionStorage.getItem(PAGE_LOAD_KEY);

        if (!storedTimestamp) {
            sessionStorage.setItem(PAGE_LOAD_KEY, LOAD_TIMESTAMP.toString());
            return true;
        }

        const stored = parseInt(storedTimestamp, 10);
        if (LOAD_TIMESTAMP > stored) {
            sessionStorage.setItem(PAGE_LOAD_KEY, LOAD_TIMESTAMP.toString());
            return true;
        }

        return false;
    } catch {
        return true;
    }
};

// Debug: force fresh fetch on next load
export const clearPageLoadMarker = (): void => {
    sessionStorage.removeItem(PAGE_LOAD_KEY);
};

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export const getCached = <T>(key: string, allowStale = true): T | null => {
    try {
        const version = localStorage.getItem(CACHE_VERSION_KEY);
        if (version !== CACHE_VERSION) {
            clearAllCache();
            return null;
        }

        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;

        const entry: CacheEntry<T> = JSON.parse(raw);
        const isExpired = Date.now() - entry.timestamp > entry.ttl;

        if (isExpired && !allowStale) return null;

        return entry.data;
    } catch {
        return null;
    }
};

export const isStale = (key: string): boolean => {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return true;

        const entry: CacheEntry<unknown> = JSON.parse(raw);
        return Date.now() - entry.timestamp > entry.ttl;
    } catch {
        return true;
    }
};

export const setCache = <T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void => {
    try {
        localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);

        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
        // localStorage full or disabled
    }
};

export const removeCache = (key: string): void => {
    localStorage.removeItem(CACHE_PREFIX + key);
};

export const clearAllCache = (): void => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
};

export const CACHE_KEYS = {
    HERO: 'hero',
    ABOUT: 'about',
    SKILLS: 'skills',
    PROJECTS: 'projects',
    EXPERIENCE: 'experience',
    SERVICES: 'services',
    SOCIAL_LINKS: 'social_links',
} as const;

// Debug helpers exposed to window
if (typeof window !== 'undefined') {
    (window as unknown as { clearPageLoadMarker: () => void }).clearPageLoadMarker = clearPageLoadMarker;
    (window as unknown as { clearAllCache: () => void }).clearAllCache = clearAllCache;
}
