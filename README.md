# Portfolio Frontend

A modern portfolio website built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. All content is dynamically fetched from the CMS.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js** + **React Three Fiber** for 3D elements
- **Lenis** for smooth scrolling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```env
   VITE_API_BASE_URL=https://your-appwrite-function-url
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Features

- 🎨 All content managed via CMS
- ⚡ Dynamic hero, about, projects, contact sections
- 📱 Fully responsive design
- 🌙 Beautiful dark/light aesthetics
- ✨ Smooth animations and interactions
- 📧 Working contact form

## Folder Structure

```
src/
├── components/
│   ├── Layout/       # Layout wrappers (SmoothScroll)
│   └── UI/           # UI components (Hero, About, Work, Contact, etc.)
├── hooks/            # Custom React hooks
├── lib/              # API service, utilities
├── assets/           # Static assets
└── App.tsx           # Main app component
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for Appwrite functions |

## Deployment

This portfolio is designed to be deployed on:
- **Vercel** (recommended)
- **Netlify**
- **Appwrite Hosting** (coming soon)
