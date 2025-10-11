
import React, { useRef, useState } from 'react';
import GlobalStyles from '../components/LandingPage/GlobalStyles.jsx';
import BackgroundLayers from '../components/LandingPage/BackgroundLayers';
import Header from '../components/LandingPage/Header';
import HeroSection from '../components/LandingPage/HeroSection';
import AboutSection from '../components/LandingPage/AboutSection';
import FeaturesSection from '../components/LandingPage/FeaturesSection';
import PricingSection from '../components/LandingPage/PricingSection';
import Footer from '../components/LandingPage/Footer';
import useGSAPAnimations from '../components/LandingPage/useGSAPAnimations';

export default function LandingPage() {
  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useGSAPAnimations(rootRef, threeContainerRef);

  return (
    <div ref={rootRef} className="min-h-screen text-white overflow-x-hidden relative font-pixel  ">
      <GlobalStyles />
      <BackgroundLayers />
      <div ref={threeContainerRef} data-parallax="-0.1" className="absolute inset-0 -z-10"></div>
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      
      <main className="container mx-auto px-4 space-y-10">
        <AboutSection />
        <FeaturesSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
