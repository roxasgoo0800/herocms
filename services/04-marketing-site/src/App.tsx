import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { FeaturesGrid } from './components/FeaturesGrid';
import { VerticalShowcase } from './components/VerticalShowcase';
import { InfraArchitecture } from './components/InfraArchitecture';
import { PricingCalculator } from './components/PricingCalculator';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BackgroundWave } from './components/BackgroundWave';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export const App: React.FC = () => {
  // Activate calibrated silky smooth scroll (buttery without floating dizziness)
  useSmoothScroll();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Interactive Cursor-Tracking Gray Wave & Dotted Background */}
      <BackgroundWave />

      {/* Enterprise Sticky Navigation */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
      </div>

      {/* Main Content Sections */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Hero />
        <InteractiveSandbox />
        <FeaturesGrid />
        <VerticalShowcase />
        <InfraArchitecture />
        <PricingCalculator />
        <FaqSection />
      </main>

      {/* Enterprise Footer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  );
};

export default App;
