import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

// Import components
import PixelButton from '../components/Dashboard/PixelButton';
import LoadingScreen from '../components/Dashboard/LoadingScreen';
import Header from '../components/Dashboard/Header';
import NavigationTabs from '../components/Dashboard/NavigationTabs';
import MainContent from '../components/Dashboard/MainContent';
import ActivityFeed from '../components/Dashboard/ActivityFeed';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('world');
  const [trainerData, setTrainerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock trainer data
  useEffect(() => {
    const mockTrainerData = {
      name: "ASH",
      level: 15,
      xp: 1250,
      xpToNextLevel: 2000,
      badges: 4,
      streak: 7,
      coins: 1250,
      pokemonCount: 24,
      rank: 156
    };
    
    setTimeout(() => {
      setTrainerData(mockTrainerData);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Animation setup
  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Dashboard animations
        const animateDashboard = () => {
          // Tab animations
          const tabButtons = gsap.utils.toArray('.tab-button');
          if (tabButtons.length > 0) {
            gsap.fromTo(tabButtons, 
              { opacity: 0, y: -20 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.1,
                ease: "back.out(1.7)"
              }
            );
          }

          // Profile animation
          const trainerProfile = document.querySelector('.trainer-profile');
          if (trainerProfile) {
            gsap.fromTo(trainerProfile,
              { scale: 0.8, rotation: -5 },
              {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
              }
            );
          }

          // Card animations
          const cards = gsap.utils.toArray('.dashboard-card');
          if (cards.length > 0) {
            gsap.fromTo(cards,
              { opacity: 0, y: 30, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
              }
            );
          }

          // Pokémon GIF animations
          const pokemonGifs = gsap.utils.toArray('.pokemon-gif');
          if (pokemonGifs.length > 0) {
            pokemonGifs.forEach((gif, i) => {
              gsap.to(gif, {
                y: -5,
                rotation: 5,
                repeat: -1,
                yoyo: true,
                duration: 2 + i * 0.3,
                ease: "sine.inOut"
              });
            });
          }

          // Progress bar animations
          const progressBars = gsap.utils.toArray('.progress-bar');
          if (progressBars.length > 0) {
            progressBars.forEach(bar => {
              const width = bar.style.width || "0%";
              gsap.fromTo(bar,
                { width: "0%" },
                {
                  width: width,
                  duration: 1.5,
                  ease: "power2.out",
                  delay: 0.5
                }
              );
            });
          }

          // Floating elements
          const floatingElements = gsap.utils.toArray('.floating-element');
          if (floatingElements.length > 0) {
            floatingElements.forEach((el, i) => {
              gsap.to(el, {
                y: gsap.utils.random(-10, 10),
                x: gsap.utils.random(-5, 5),
                rotation: gsap.utils.random(-5, 5),
                repeat: -1,
                yoyo: true,
                duration: gsap.utils.random(2, 4),
                ease: "sine.inOut",
                delay: i * 0.2
              });
            });
          }
        };

        // Parallax effect
        const onMouseMove = (e) => {
          const parallaxElements = gsap.utils.toArray("[data-parallax]");
          if (parallaxElements.length === 0) return;

          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          
          gsap.to(parallaxElements, {
            x: (i, t) => x * 15 * (parseFloat(t.getAttribute("data-parallax")) || 1),
            y: (i, t) => y * 10 * (parseFloat(t.getAttribute("data-parallax")) || 1),
            duration: 1,
            ease: "power2.out"
          });
        };
        window.addEventListener("mousemove", onMouseMove);

        // Initialize animations
        animateDashboard();

      }, rootRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-br from-[#8b0000] via-[#600000] to-[#400000] font-pixel text-white pixelated-rendering ">
      <GlobalStyles />
      <BackgroundLayers />
      
      <Header 
        navigate={navigate} 
        trainerData={trainerData} 
      />
      
      <NavigationTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <MainContent 
              activeTab={activeTab}
              trainerData={trainerData}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ActivityFeed trainerData={trainerData} />
          </div>
        </div>
      </main>
    </div>
  );
}

// Background components
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    .font-pixel { font-family: 'Press Start 2P', cursive; }
    .text-shadow-pixel { text-shadow: 3px 3px 0 #000; }
    .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
    .dither-overlay {
      background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%);
      background-size: 4px 4px;
      background-position: 0 0, 2px 2px;
    }
  `}</style>
);

const BackgroundLayers = () => (
  <>
    <div aria-hidden data-parallax="-0.4" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
    <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div>
    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
  </>
);