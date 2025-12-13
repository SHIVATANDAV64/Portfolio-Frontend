import { SmoothScroll } from './components/Layout/SmoothScroll';
import { Navigation } from './components/UI/Navigation';
import { Hero } from './components/UI/Hero';
import { About } from './components/UI/About';
import { Work } from './components/UI/Work';
import { Contact } from './components/UI/Contact';
import { Footer } from './components/UI/Footer';
import { CustomCursor } from './components/UI/CustomCursor';
import { TextureOverlay } from './components/UI/TextureOverlay';

function App() {
  return (
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
          <Work />
          <Contact />
          <Footer />
        </main>
      </div>
    </SmoothScroll>
  );
}

export default App;
