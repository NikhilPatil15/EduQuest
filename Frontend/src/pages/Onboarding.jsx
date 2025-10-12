// pages/Onboarding.js
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// Reusable Pixel Button
const PixelButton = ({ children, onClick, className = '', disabled = false }) => {
  const buttonRef = useRef(null);
  const handleMouseEnter = () => { if (!disabled) gsap.to(buttonRef.current, { y: -3, scale: 1.05, duration: 0.2, ease: 'power2.out' }); };
  const handleMouseLeave = () => { if (!disabled) gsap.to(buttonRef.current, { y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }); };
  return (
    <button ref={buttonRef} onClick={onClick} disabled={disabled} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`px-8 py-4 rounded border-4 border-black font-bold text-white transition-all duration-300 transform-gpu shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  );
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);

  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const cardRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const navigate = useNavigate();

  // ✅ UPDATED: Paths are now standardized. Make sure your images are in `public/trainers/`
  const starterTrainers = [
    { id: 1, name: 'Ash', url: 'ash.png', description: 'Ambitious and determined, never gives up on the path to mastery.' },
    { id: 2, name: 'Misty', url: 'misty.png', description: 'A spirited and passionate trainer with a strong sense of duty.' },
    { id: 3, name: 'Brock', url: 'Brock.png', description: 'Wise and caring, always ready to support friends on their journey.' },
    { id: 4, name: 'May', url: 'may.png', description: 'Cheerful and stylish, loves exploring new challenges with flair.' },
  ];
  const subjects = [ { name: 'Maths', icon: '🧮', color: 'bg-blue-600', hover: 'hover:bg-blue-500' }, { name: 'Science', icon: '🔬', color: 'bg-green-600', hover: 'hover:bg-green-500' }, { name: 'Coding', icon: '💻', color: 'bg-purple-600', hover: 'hover:bg-purple-500' }, ];
  
  // All useEffects and handlers are unchanged
  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo('.onboarding-container', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' });
        gsap.fromTo('.floating-element',{ y: 0, rotation: 0 },{ y: (i) => (i % 2 === 0 ? -15 : 15), rotation: (i) => (i % 2 === 0 ? -8 : 8), repeat: -1, yoyo: true, duration: (i) => gsap.utils.random(3, 5), ease: 'sine.inOut', stagger: 0.2 });
        const container = threeContainerRef.current; if (!container) return;
        const pixelationFactor = 6;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0d041a');
        scene.fog = new THREE.Fog('#0d041a', 60, 200);
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 70);
        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor);
        renderer.setPixelRatio(1);
        container.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { width: '100%', height: '100%', imageRendering: 'pixelated' });
        const ambient = new THREE.AmbientLight(0x8844ff, 0.9);
        const point = new THREE.PointLight(0x4411ff, 2.5, 250);
        point.position.set(30, 30, 30);
        scene.add(ambient, point);
        const particlesCount = 500;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 250;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 2] = -50 - Math.random() * 200;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({ color: 0xaa66ff, size: 1.5, sizeAttenuation: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.7 });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);
        const crystalGeo = new THREE.IcosahedronGeometry(2, 0);
        const crystalMat = new THREE.MeshStandardMaterial({ color: '#8A2BE2', emissive: '#4B0082', roughness: 0.2, metalness: 0.8 });
        const crystals = Array.from({ length: 10 }, () => {
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            crystal.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, -20 - Math.random() * 60);
            scene.add(crystal);
            return crystal;
        });
        let rafId;
        const clock = new THREE.Clock();
        const animate = () => {
            const t = clock.getElapsedTime();
            points.rotation.y += 0.0006;
            crystals.forEach((c, i) => {
                c.rotation.x += 0.005 + i * 0.0001;
                c.rotation.y += 0.005 + i * 0.0001;
                c.position.y += Math.sin(t * 0.5 + i) * 0.05;
            });
            renderer.render(scene, camera);
            rafId = requestAnimationFrame(animate);
        };
        animate();
        return () => { cancelAnimationFrame(rafId); if (container && renderer.domElement) container.removeChild(renderer.domElement); renderer.dispose(); };
    }, rootRef);
    return () => ctx.revert();
  }, []);
  useEffect(() => { if (step === 1 && cardRef.current) { gsap.fromTo(cardRef.current, { x: 100 * slideDirection, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }); } }, [selectedIndex]);
  useEffect(() => { if (contentWrapperRef.current) { gsap.fromTo(contentWrapperRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }); } }, [step]);
  const handleNext = () => { setSlideDirection(1); gsap.to(cardRef.current, { x: -100, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { setSelectedIndex((prev) => (prev + 1) % starterTrainers.length); }}); };
  const handlePrev = () => { setSlideDirection(-1); gsap.to(cardRef.current, { x: 100, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { setSelectedIndex((prev) => (prev - 1 + starterTrainers.length) % starterTrainers.length); }}); };
  const handleConfirmTrainer = () => { setSelectedTrainer(starterTrainers[selectedIndex]); gsap.to(contentWrapperRef.current, { opacity: 0, y: -50, duration: 0.5, ease: 'power2.in', onComplete: () => setStep(2) }); };
  const handleConfirmSubject = (subject) => { setSelectedSubject(subject); gsap.to(contentWrapperRef.current, { opacity: 0, y: -50, duration: 0.5, ease: 'power2.in', onComplete: () => setStep(3) }); };
  const handleStartAdventure = async () => { setLoading(true); await new Promise(resolve => setTimeout(resolve, 1500)); setLoading(false); const message = `Your adventure as Trainer ${selectedTrainer.name} begins!`; navigate('/dashboard', { state: { toastMessage: message } }); };
  const currentTrainer = starterTrainers[selectedIndex];

  return (
    <div ref={rootRef} className="min-h-screen text-white overflow-hidden relative font-pixel p-4 flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .text-shadow-pixel { text-shadow: 4px 4px 0 #000; }
        .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
        .dither-overlay { background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%); background-size: 4px 4px; background-position: 0 0, 2px 2px; pointer-events: none; }
      `}</style>
      
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(68,136,255,0.3),rgba(0,0,179,0.25),transparent_70%),linear-gradient(180deg,#0a031a_0%,#1a0a2d_100%)]"></div>
      <div ref={threeContainerRef} className="absolute inset-0 -z-10" aria-hidden="true"></div>
      <div className="dither-overlay absolute inset-0 -z-5"></div>
      <img src="/pokeball.png" alt="Pokeball" className="floating-element absolute top-8 left-8 w-16 h-16 pixelated-rendering" />
      <img src="/potion.png" alt="Potion" className="floating-element absolute bottom-8 right-8 w-16 h-16 pixelated-rendering" />

      <div className="onboarding-container w-full max-w-2xl bg-black/70 border-8 border-black shadow-[12px_12px_0_rgba(0,0,0,0.5)] p-8 relative min-h-[550px]">
        <div ref={contentWrapperRef}>
          {step === 1 && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 text-shadow-pixel mb-6 text-center">Choose Your Trainer!</h1>
              <div className="flex items-center justify-center space-x-4">
                <button onClick={handlePrev} className="p-2 bg-red-600 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-red-500 transition-colors"> <span className="text-2xl">◀</span> </button>
                
                {/* ✅ FIXED: Removed fixed height from this container to make it flexible */}
                <div className="w-full max-w-md bg-gray-800/50 border-4 border-black p-4 overflow-hidden">
                  <div ref={cardRef}>
                    {/* ✅ FIXED: Gave the image a consistent height to prevent layout jumps */}
                    <div className="h-52 flex items-center justify-center mb-4 bg-black/30 border-2 border-black">
                      <img src={currentTrainer.url} alt={currentTrainer.name} className="max-h-full pixelated-rendering drop-shadow-[4px_4px_0_#000] object-contain" />
                    </div>
                    <h2 className="text-2xl text-center text-white my-2">{currentTrainer.name}</h2>
                    <p className="text-center text-sm text-gray-300 h-24">{currentTrainer.description}</p>
                  </div>
                </div>
                
                <button onClick={handleNext} className="p-2 bg-red-600 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-red-500 transition-colors"> <span className="text-2xl">▶</span> </button>
              </div>
              <div className="text-center mt-8"> <PixelButton onClick={handleConfirmTrainer} className="bg-blue-600 hover:bg-blue-500"> CHOOSE TRAINER </PixelButton> </div>
            </div>
          )}

          {step === 2 && selectedTrainer && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-yellow-300 text-shadow-pixel mb-4">Choose a Path!</h1>
              <p className="text-white mb-6">Welcome, {selectedTrainer.name}! <br/>What will you study first?</p>
              <img src={selectedTrainer.url} alt={selectedTrainer.name} className="mx-auto h-24 object-contain pixelated-rendering drop-shadow-[4px_4px_0_#000] mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <button key={subject.name} onClick={() => handleConfirmSubject(subject)} className={`p-6 border-4 border-black shadow-[6px_6px_0_#000] transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] ${subject.color} ${subject.hover}`}>
                    <div className="text-5xl mb-2">{subject.icon}</div>
                    <div className="font-bold text-lg text-white">{subject.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 3 && selectedTrainer && selectedSubject && (
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 text-shadow-pixel mb-6">Your Adventure Begins!</h1>
              <div className="bg-gray-800/50 border-4 border-black p-6 text-left relative">
                {loading && <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center"><p className="text-yellow-300 animate-pulse">Loading...</p></div>}
                <h3 className="text-xl text-center text-white mb-4">TRAINER CARD</h3>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-black/50 border-2 border-black flex-shrink-0 flex items-center justify-center">
                    <img src={selectedTrainer.url} alt={selectedTrainer.name} className="h-full w-full object-contain pixelated-rendering"/>
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <p><span className="text-red-300">NAME:</span> {selectedTrainer.name}</p>
                    <p><span className="text-red-300">PATH:</span> {selectedSubject.name} {selectedSubject.icon}</p>
                    <p><span className="text-red-300">JOINED:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="text-red-300">STATUS:</span> <span className="text-green-400">Ready to Learn!</span></p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-8">
                <PixelButton onClick={handleStartAdventure} disabled={loading} className="bg-green-600 hover:bg-green-500">
                  START YOUR ADVENTURE!
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;