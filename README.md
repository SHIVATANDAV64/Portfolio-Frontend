# Portfolio Frontend

Public-facing portfolio website with smooth animations and optimized data loading.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **GSAP** for loading screen
- **Lenis** for smooth scrolling
- **Appwrite SDK** for API calls

## Features

- 🎬 Branded loading screen with GSAP color wipes
- ⚡ Data prefetching during loading animation
- 💾 localStorage caching with stale-while-revalidate
- 📱 Fully responsive design
- ✨ Custom cursor, parallax effects
- 📧 Working contact form

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```env
   VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=<project-id>
   VITE_FUNCTION_GET_CONTENT=get-content
   VITE_FUNCTION_SUBMIT_CONTACT=submit-contact
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Folder Structure

```
src/
├── components/
│   ├── Layout/           # SmoothScroll wrapper
│   ├── UI/               # Hero, About, Work, Contact, Footer
│   └── LoadingScreen.tsx # GSAP loading animation
├── hooks/                # useFetch, custom hooks
├── lib/
│   ├── api.ts            # API service
│   ├── appwrite.ts       # Appwrite SDK setup
│   ├── cache.ts          # localStorage caching
│   └── DataProvider.tsx  # Prefetching context
└── App.tsx               # Main app
```

## Data Flow

1. `LoadingScreen` triggers `prefetchPriority()` during animation
2. Hero, About, Skills fetched and cached
3. After animation: Projects, Experience, etc. fetched in background
4. Subsequent visits load from localStorage cache
5. Cache auto-refreshes when stale (TTL-based)

## Deployment

Recommended: **Vercel** or **Netlify**
