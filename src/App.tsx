import { SmoothScroll } from './components/Layout/SmoothScroll';
import { Navigation } from './components/UI/Navigation';
import { Hero } from './components/UI/Hero';
import { About } from './components/UI/About';
import { ExperienceSection } from './components/UI/Experience';
import { ServicesSection } from './components/UI/Services';
import { Work } from './components/UI/Work';
import { Contact } from './components/UI/Contact';
import { Footer } from './components/UI/Footer';
import { CustomCursor } from './components/UI/CustomCursor';
import { TextureOverlay } from './components/UI/TextureOverlay';
import { LoadingScreen } from './components/LoadingScreen';
import { DataProvider } from './lib/DataProvider';

function App() {
  return (
    <DataProvider>
      {/* GSAP Loading Animation - prefetches data during animation */}
      <LoadingScreen />

      <SmoothScroll>
        <div className="relative min-h-screen bg-cream text-charcoal selection:bg-charcoal selection:text-cream cursor-none">
          <CustomCursor />
          <TextureOverlay />
          <Navigation />
          <main>
            <div className="relative">
              <Hero />
            </div>
            <About />
            {/* Dynamic sections - only render if data exists */}
            <ExperienceSection />
            <ServicesSection />
            <Work />
            <Contact />
            <Footer />
          </main>
        </div>
      </SmoothScroll>
    </DataProvider>
  );
}

export default App;
