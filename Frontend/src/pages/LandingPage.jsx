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
import TestimonialsSection from '../components/LandingPage/Testimonials.jsx';
import HowItWorksSection from '../components/LandingPage/HowItWorksSection.jsx';
import LeaderboardSection from '../components/LandingPage/LeaderboardSection.jsx';
import GameModesSection from '../components/LandingPage/GameModesSection.jsx';
import CTASection from '../components/LandingPage/CTASection.jsx';
import FAQSection from '../components/LandingPage/FAQSection.jsx';

export default function LandingPage() {
  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useGSAPAnimations(rootRef, threeContainerRef);

  return (
    <div ref={rootRef} className="min-h-screen text-white overflow-x-hidden relative font-pixel">
      <GlobalStyles />
      <BackgroundLayers />
      <div ref={threeContainerRef} data-parallax="-0.1" className="absolute inset-0 -z-10"></div>
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      
      {/* Main content with proper spacing */}
      <div className="space-y-28 md:space-y-36 lg:space-y-44 py-10">
        {/* First container group */}
        <div className="container mx-auto px-4 space-y-28 md:space-y-32">
          <AboutSection />
          <FeaturesSection />
          <HowItWorksSection />
        </div>

        {/* Game modes with different background */}
        <div className="relative py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent"></div>
          <div className="container mx-auto px-4">
            <GameModesSection />
          </div>
        </div>

        {/* Middle container group */}
        <div className="container mx-auto px-4 space-y-28 md:space-y-32">
          <LeaderboardSection />
          <TestimonialsSection />
        </div>

        <div className="relative py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent"></div>
          <div className="container mx-auto px-4">
            <PricingSection />
          </div>
        </div>

        {/* Bottom container group */}
        <div className="container mx-auto px-4 space-y-28 md:space-y-32">
          <FAQSection />
          <CTASection />
        </div>
      </div>

      <Footer />
    </div>
  );
}