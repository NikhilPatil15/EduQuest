import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// No changes needed for the PixelButton component
const PixelButton = ({ children, className = '' }) => (
  <button id="cta-button" className={`relative select-none bg-[#b30000] text-white border-4 border-black px-8 py-4 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 ${className}`}>
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#ff4d4d,transparent_40%),radial-gradient(circle_at_70%_70%,#ff1a1a,transparent_40%)]"></span>
    <span className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-red-400/60 blur-[1px]"></span>
    <span className="sparkles pointer-events-none absolute -top-2 left-2 w-2 h-2 bg-white shadow-[0_0_10px_#fff,0_0_20px_#ff4d4d]"></span>
    <span className="sparkles pointer-events-none absolute -bottom-2 right-4 w-1.5 h-1.5 bg-white shadow-[0_0_8px_#fff,0_0_14px_#ff4d4d]"></span>
    </button>
  );

export default function LandingPage() {
  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
      // Hero reveal animations (with null checks)
      const heroTitle = document.querySelector('.hero-title');
      const heroSub = document.querySelector('.hero-sub');
      const ctaButton = document.getElementById('cta-button');
      
      if (heroTitle) {
        gsap.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
        gsap.to(heroTitle, { y: -2, repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut' });
        gsap.to(heroTitle, { textShadow: '4px 4px 0 #000, 0 0 10px rgba(255,77,77,0.35)', repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut' });
      }
      
      if (heroSub) {
        gsap.fromTo(heroSub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
      }
      
      if (ctaButton) {
        gsap.fromTo(ctaButton, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.8)', delay: 0.6 });
      }

      // Particle and icon animations (with null checks)
      const pixelParticles = gsap.utils.toArray('.pixel-particle');
      if (pixelParticles.length > 0) {
        pixelParticles.forEach((el, i) => {
          gsap.to(el, { y: gsap.utils.random(-30, -60), x: gsap.utils.random(-20, 20), repeat: -1, yoyo: true, duration: gsap.utils.random(2, 4), ease: 'sine.inOut', delay: i * 0.05 });
          gsap.to(el, { opacity: gsap.utils.random(0.4, 0.9), repeat: -1, yoyo: true, duration: gsap.utils.random(1.2, 2.4), ease: 'sine.inOut' });
        });
      }
      
      const floatIcons = gsap.utils.toArray('.float-icon');
      if (floatIcons.length > 0) {
        floatIcons.forEach((el, i) => {
          gsap.to(el, { y: -10, rotate: 8, repeat: -1, yoyo: true, duration: 2 + i * 0.3, ease: 'sine.inOut' });
        });
      }

      // Battleground animations (with null checks)
      const pokemonLeft = document.getElementById('pokemon-left');
      const pokemonRight = document.getElementById('pokemon-right');
      const heatShimmer = document.getElementById('heat-shimmer');
      
      if (pokemonLeft) {
        gsap.to(pokemonLeft, { y: -8, repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut' });
        gsap.to(pokemonLeft, { filter: 'drop-shadow(0 0 12px rgba(255,77,77,0.4))', repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut' });
      }
      
      if (pokemonRight) {
        gsap.to(pokemonRight, { y: -8, repeat: -1, yoyo: true, duration: 1.9, ease: 'sine.inOut' });
        gsap.to(pokemonRight, { filter: 'drop-shadow(0 0 12px rgba(255,77,77,0.4))', repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 0.2 });
      }
      
      const emberElements = gsap.utils.toArray('#bg-embers .ember');
      if (emberElements.length > 0) {
        emberElements.forEach((el) => {
          gsap.fromTo(el, { y: 0, opacity: gsap.utils.random(0.4, 0.9) }, { y: -200 - Math.random() * 200, opacity: 0, duration: 3 + Math.random() * 3, repeat: -1, ease: 'none', delay: Math.random() * 2 });
        });
      }
      
      if (heatShimmer) {
        gsap.to(heatShimmer, { opacity: 0.25, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut' });
      }
      
      // Battle timeline (only if both Pokémon exist)
      if (pokemonLeft && pokemonRight) {
        const battleTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        battleTl
          .addLabel('leftAttack')
          .to(pokemonLeft, { x: 14, duration: 0.18, ease: 'power2.in' }, 'leftAttack')
          .to(pokemonLeft, { x: 0, duration: 0.22, ease: 'power2.out' })
          .to(pokemonRight, { x: 6, yoyo: true, repeat: 4, duration: 0.05, ease: 'power1.inOut' }, 'leftAttack+=0.18')
          .addLabel('rightAttack', '+=0.8')
          .to(pokemonRight, { x: -14, duration: 0.18, ease: 'power2.in' }, 'rightAttack')
          .to(pokemonRight, { x: 0, duration: 0.22, ease: 'power2.out' })
          .to(pokemonLeft, { x: -6, yoyo: true, repeat: 4, duration: 0.05, ease: 'power1.inOut' }, 'rightAttack+=0.18');
      }

      // Parallax on mouse (with null checks)
      const onMouse = (e) => {
        const parallaxElements = gsap.utils.toArray('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(parallaxElements, {
          x: (i, t) => x * 20 * (parseFloat(t.getAttribute('data-parallax')) || 1),
          y: (i, t) => y * 12 * (parseFloat(t.getAttribute('data-parallax')) || 1),
          duration: 0.6, ease: 'power2.out'
            });
        };
      window.addEventListener('mousemove', onMouse);

      // Scroll reveal (with null checks)
      const revealElements = gsap.utils.toArray('.reveal');
      if (revealElements.length > 0) {
        revealElements.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
          });
        });
      }

       // NEW: GSAP hover animation for desktop nav links (smoother)
       const navLinks = gsap.utils.toArray('nav.desktop-nav a');
       if (navLinks.length > 0) {
         navLinks.forEach(link => {
             const hover = gsap.to(link, { y: -2, color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.35)', duration: 0.22, paused: true, ease: 'power2.out' });
             link.addEventListener('mouseenter', () => hover.play());
             link.addEventListener('mouseleave', () => hover.reverse());
         });
       }

       // Practice button idle + hover animations
       if (document.getElementById('practice-button')) {
         gsap.to('#practice-button', { y: -3, repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut' });
         const pb = document.getElementById('practice-button');
         const enter = () => {
           gsap.to('#practice-button', { scale: 1.04, duration: 0.18, ease: 'power2.out' });
           gsap.to('#practice-button .sparkle', { opacity: 1, scale: 1.2, duration: 0.3, ease: 'back.out(1.7)' });
         };
         const leave = () => {
           gsap.to('#practice-button', { scale: 1.0, duration: 0.18, ease: 'power2.in' });
           gsap.to('#practice-button .sparkle', { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' });
         };
         const click = () => {
           gsap.to(rootRef.current, { x: 3, yoyo: true, repeat: 3, duration: 0.05, ease: 'power1.inOut' });
         };
         pb.addEventListener('mouseenter', enter);
         pb.addEventListener('mouseleave', leave);
         pb.addEventListener('click', click);
         ctx.add(() => {
           pb.removeEventListener('mouseenter', enter);
           pb.removeEventListener('mouseleave', leave);
           pb.removeEventListener('click', click);
         });
       }

      // Fire/flame GIF animations
      const flameElements = gsap.utils.toArray('.flame-gif');
      if (flameElements.length > 0) {
        flameElements.forEach((el, i) => {
          gsap.to(el, { y: -8, repeat: -1, yoyo: true, duration: 1.2 + i * 0.3, ease: 'sine.inOut' });
          gsap.to(el, { opacity: gsap.utils.random(0.6, 0.9), repeat: -1, yoyo: true, duration: 0.8 + i * 0.2, ease: 'sine.inOut' });
        });
      }


      // Guarded Three.js background
      (async () => {
        try {
          const container = threeContainerRef.current;
          if (!container) return;
          const [{ Scene, PerspectiveCamera, WebGLRenderer, Color, Fog, SphereGeometry, MeshStandardMaterial, Mesh, AmbientLight, PointLight, Vector2, AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, Clock }, THREE] = await Promise.all([
            import('three'),
            import('three')
          ]);

          // --- 1. PIXELATION ENHANCEMENT ---
          const pixelationFactor = 4; // Render at 1/4th resolution
          
          const scene = new Scene();
          scene.background = new Color('#1a0808');
          scene.fog = new Fog('#0d0404', 50, 180);

          const camera = new PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
          camera.position.set(0, 0, 60);

          const renderer = new WebGLRenderer({ antialias: false, alpha: true });
          // Render at a lower resolution
          renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor);
          renderer.setPixelRatio(1); // Keep pixel ratio at 1
          renderer.outputColorSpace = 'srgb';
          
          container.appendChild(renderer.domElement);
          // Scale up the canvas with CSS and apply pixelated rendering
          renderer.domElement.style.width = '100%';
          renderer.domElement.style.height = '100%';
          renderer.domElement.style.imageRendering = 'pixelated';


          const ambient = new AmbientLight(0xff8844, 0.8);
          const point = new PointLight(0xff4411, 2.2, 200);
          point.position.set(20, 20, 20);
          scene.add(ambient, point);

          const orbGeo = new SphereGeometry(3, 16, 16);
          const orbMat = new MeshStandardMaterial({ color: '#b30000', emissive: '#ff1a1a', emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.2 });
          const orbs = [];
          for (let i = 0; i < 6; i++) {
            const orb = new Mesh(orbGeo, orbMat);
            orb.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, -20 - Math.random() * 40);
            scene.add(orb);
            orbs.push(orb);
          }

          const particlesCount = 400;
          const positions = new Float32BufferAttribute(particlesCount * 3, 3);
          for (let i = 0; i < particlesCount; i++) {
            positions.setXYZ(i, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 120, -50 - Math.random() * 200);
          }
          const pGeo = new BufferGeometry();
          pGeo.setAttribute('position', positions);
          // Changed material to THREE.PointsMaterial
          const pMat = new THREE.PointsMaterial({ color: 0xff6633, size: 1.4, sizeAttenuation: true, blending: AdditiveBlending, transparent: true, opacity: 0.8 });
          const points = new Points(pGeo, pMat);
          scene.add(points);

          const mouse = new Vector2(0, 0);
          const onResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            // Also update the renderer size with the pixelation factor
            renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor);
          };
          const onMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
          };
          window.addEventListener('resize', onResize);
          window.addEventListener('mousemove', onMove);

          const clock = new Clock();
          let rafId;
          const animate = () => {
            const t = clock.getElapsedTime();
            orbs.forEach((o, i) => {
              o.position.y += Math.sin(t * 0.8 + i) * 0.02;
              o.position.x += Math.cos(t * 0.5 + i) * 0.015;
            });
            points.rotation.y += 0.0008;
            camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
            camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, -40);
            renderer.render(scene, camera);
            rafId = requestAnimationFrame(animate);
          };
          animate();

          ctx.add(() => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
            renderer.dispose();
            if(container && renderer.domElement) {
              container.removeChild(renderer.domElement);
            }
          });
        } catch (e) {
            console.error("Three.js failed to load:", e);
        }
      })();

      }, rootRef);

    return () => ctx.revert();
    }, 100); // 100ms delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen text-white overflow-x-hidden relative font-pixel">
      {/* CSS is updated with a dither pattern */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .text-shadow-pixel { text-shadow: 4px 4px 0 #000; }
        .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
        .pixel-tile { background-size: 24px 24px; image-rendering: pixelated; }
        .pixel-tile-ground { background-image: repeating-linear-gradient(0deg, #2a0f0f 0 2px, #3b1212 2px 12px), repeating-linear-gradient(90deg, #2a0f0f 0 2px, #3b1212 2px 12px); }
        .pixel-mountains { background-image: linear-gradient(#200808,#0f0404); clip-path: polygon(0% 100%, 8% 76%, 16% 84%, 24% 68%, 32% 78%, 40% 62%, 48% 72%, 56% 58%, 64% 70%, 72% 60%, 80% 66%, 88% 58%, 100% 72%, 100% 100%); image-rendering: pixelated; }
        .pixel-grid { background-image: linear-gradient(rgba(255,64,64,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,64,64,0.05) 1px, transparent 1px); background-size: 12px 12px; mix-blend-mode: soft-light; }
        .scanlines { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px); }
        /* --- 2. NEW DITHER OVERLAY --- */
        .dither-overlay {
          background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%);
          background-size: 4px 4px;
          background-position: 0 0, 2px 2px;
        }
        /* Moving pixelated fire */
        .moving-fire {
            position: absolute;
          width: 40px;
          height: 40px;
          image-rendering: pixelated;
          animation: moveFire 8s linear infinite;
        }
        .moving-fire:nth-child(2) {
          animation-delay: -2s;
          animation-duration: 10s;
        }
        .moving-fire:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 12s;
        }
        .moving-fire:nth-child(4) {
          animation-delay: -6s;
          animation-duration: 9s;
        }
        .moving-fire:nth-child(5) {
          animation-delay: -8s;
          animation-duration: 11s;
        }
        @keyframes moveFire {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(calc(100vw + 50px)); }
        }
      `}</style>

      {/* Background layers */}
      <div aria-hidden data-parallax="-0.4" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
      <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div> {/* Added Dither */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
      <div aria-hidden className="pixel-grid absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="scanlines absolute inset-0 -z-10 pointer-events-none"></div>

      <div aria-hidden data-parallax="-0.2" className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(80)].map((_, i) => (
          <span key={i} className="pixel-particle absolute w-1 h-1 bg-red-400/80" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 8px #ff4d4d' }}></span>
        ))}
      </div>

      <div ref={threeContainerRef} data-parallax="-0.1" className="absolute inset-0 -z-10"></div>
      
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-black/80 via-red-900/20 to-black/80 backdrop-blur-md border-b-4 border-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 border-2 border-black rotate-45 shadow-[3px_3px_0_#000] relative">
              <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-orange-400 rotate-45"></div>
            </div>
            <span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">EduQuest</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm desktop-nav">
            <a href="#about" className="relative px-4 py-2 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a href="#features" className="relative px-4 py-2 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">
              <span className="relative z-10">Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a href="#team" className="relative px-4 py-2 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">
              <span className="relative z-10">Team</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 p-3 bg-red-900/30 border-2 border-red-600/50 hover:bg-red-900/50 transition-all duration-300">
              <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
              <div className="w-6 h-0.5 bg-white transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
              <div className="w-6 h-0.5 bg-white mt-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
          </button>
        </div>
        
        {/* Mobile Menu Panel */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-black/95 to-red-900/20 backdrop-blur-md border-b-4 border-red-600 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <nav className="flex flex-col items-center gap-6 py-8">
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">About</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">Features</a>
                <a href="#team" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">Team</a>
            </nav>
          </div>
        </header>

      {/* Hero (unchanged) */}
      <section className="relative min-h-[88vh] flex items-center">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-shadow-pixel bg-red-800/20 px-4 py-2 rounded">
  EduQuest
</h1>

          <div className="pointer-events-none absolute inset-0 -z-10" data-parallax="0.25" id="battleground">
            <div className="absolute inset-x-0 bottom-28 h-40 opacity-70 pixel-mountains"></div>
            <div className="absolute inset-x-0 bottom-0 h-28 pixel-tile pixel-tile-ground border-t-4 border-black"></div>
            <div id="bg-embers" className="absolute inset-0">
              {[...Array(40)].map((_, i) => (
                <span key={i} className="ember absolute w-1 h-1 bg-red-300/80" style={{ left: `${Math.random() * 100}%`, bottom: `${Math.random() * 40}%`, boxShadow: '0 0 10px #ff4d4d' }}></span>
              ))}
            </div>
            <div id="heat-shimmer" className="absolute inset-x-0 bottom-0 h-40 opacity-10" style={{ background: 'linear-gradient(0deg, rgba(255,77,77,0.15), transparent 60%)', filter: 'blur(2px)' }}></div>
            <img id="pokemon-left" className="absolute left-8 md:left-12 bottom-6 w-[280px] md:w-[380px] lg:w-[590px] pixelated-rendering drop-shadow-[8px_8px_0_#000]" style={{ transform: 'scaleX(-1)' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif" alt="Charizard facing right" />
            <img id="pokemon-right" className="absolute right-8 md:right-12 bottom-6 w-[270px] md:w-[370px] lg:w-[590px] pixelated-rendering drop-shadow-[8px_8px_0_#000]" style={{ transform: 'scaleX(1)' }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/248.gif" alt="Tyranitar facing left" />
            {/* Center CTA */}
            <button id="practice-button" className="pointer-events-auto absolute left-1/2 bottom-20 -translate-x-1/2 bg-[#b30000] text-white border-4 border-black px-5 py-3 md:px-6 md:py-3.5 font-bold shadow-[6px_6px_0_#000] hover:bg-[#cc0000] pixelated-rendering">
              Start Practicing
              <span className="sparkle relative -top-1 -right-1 w-2 h-2 bg-yellow-300 opacity-100" style={{ boxShadow: '0 0 8px #ffd700, 0 0 16px #ffaa00' }}></span>
              <span className="sparkle absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-300 opacity-100" style={{ boxShadow: '0 0 6px #ffd700, 0 0 12px #ffaa00' }}></span>
            </button>
            
            {/* Moving pixelated fire */}

            
            

            {/* <img className="moving-fire absolute bottom-32 opacity-60" src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="Pixel Fire" />
            <img className="moving-fire absolute bottom-16 opacity-80" src="https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" alt="Pixel Fire" />
            <img className="moving-fire absolute bottom-28 opacity-65" src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="Pixel Fire" />
            <img className="moving-fire absolute bottom-24 opacity-75" src="https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" alt="Pixel Fire" /> */}
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6">
            <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-white relative"></div>
              </div>
            </div>
            <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
              <div className="flex items-center gap-3">
              </div>
            </div>
            <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white rotate-45"></div>
              </div>
            </div>
          </div>
            </div>
          </section>

      {/* Rest of the sections and footer are unchanged */}
      <main className="container mx-auto px-4">
        <section id="about" className="reveal py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-10">A Pokémon-Inspired Gamified Learning Adventure</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000]">
              <p className="text-red-100">Ambient parallax worlds, pixel-red glows, and smooth motion welcome learners into an adventure.</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000]">
              <p className="text-red-100">Capture knowledge, evolve skills, and challenge friends with quizzes and leaderboards.</p>
            </div>
            </div>
          </section>

        <section id="features" className="reveal py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-10">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000]"><h3 className="font-bold text-xl text-red-200 mb-2">Interactive Homepage</h3><p>Dynamic hero with FireRed vibes and GSAP transitions.</p></div>
            <div className="bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000]"><h3 className="font-bold text-xl text-red-200 mb-2">Trainer Dashboard</h3><p>Track XP, badges, and captured knowledge-creatures.</p></div>
            <div className="bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000]"><h3 className="font-bold text-xl text-red-200 mb-2">Leaderboards</h3><p>Compete and climb ranks with friends.</p></div>
            </div>
          </section>
          
        <section id="pricing" className="reveal py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-12">Choose Your Adventure</h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            {/* Pricing Card 1: 1 Month */}
            <div className="text-center bg-black/40 border-4 border-black p-6 shadow-[8px_8px_0_#000] h-full flex flex-col">
              <h3 className="font-bold text-red-200 text-2xl mb-2">1 Month Pass</h3>
              <p className="text-4xl font-bold mb-4">$10</p>
              <ul className="text-left space-y-2 mb-6 text-red-100/90 text-sm flex-grow">
                <li>✓ Access to all quests</li>
                <li>✓ Track your progress</li>
                <li>✓ Basic trainer support</li>
              </ul>
              <PixelButton className="w-full text-sm py-3">Start Quest</PixelButton>
            </div>

            {/* Pricing Card 2: 6 Months (Featured) */}
            <div className="relative text-center bg-black/40 border-4 border-yellow-300 p-6 shadow-[8px_8px_0_#b30000] h-full flex flex-col scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-300 text-black font-bold px-4 py-1 border-2 border-black shadow-[2px_2px_0_#000] text-xs">
                POPULAR
              </div>
              <h3 className="font-bold text-yellow-200 text-2xl mb-2">6 Month Quest</h3>
              <p className="text-4xl font-bold mb-4">$50</p>
              <ul className="text-left space-y-2 mb-6 text-yellow-100/90 text-sm flex-grow">
                <li>✓ Everything in 1 Month Pass</li>
                <li>✓ <span className="font-bold">Save $10</span></li>
                <li>✓ Priority support</li>
                <li>✓ Exclusive trainer badges</li>
              </ul>
              <PixelButton className="w-full text-sm py-3 bg-yellow-500 hover:bg-yellow-600 !text-black shadow-[6px_6px_0px_#000]">Evolve Skills</PixelButton>
            </div>

            {/* Pricing Card 3: 1 Year */}
            <div className="text-center bg-black/40 border-4 border-black p-6 shadow-[8px_8px_0_#000] h-full flex flex-col">
              <h3 className="font-bold text-red-200 text-2xl mb-2">1 Year Journey</h3>
              <p className="text-4xl font-bold mb-4">$90</p>
              <ul className="text-left space-y-2 mb-6 text-red-100/90 text-sm flex-grow">
                <li>✓ Everything in 6 Month Quest</li>
                <li>✓ <span className="font-bold">Save $30</span></li>
                <li>✓ Early access to new content</li>
              </ul>
              <PixelButton className="w-full text-sm py-3">Go Legendary</PixelButton>
            </div>
          </div>
        </section>
        </main>

      <footer className="mt-16 bg-black/50 border-t-4 border-black">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-red-200">Powered by EduQuest Team</p>
        </div>
        </footer>
    </div>
  );
}