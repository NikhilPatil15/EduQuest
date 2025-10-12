// components/SignupPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api.service"; // Real backend connection

const PixelButton = ({ children, className = "", onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative select-none bg-[#b30000] text-white border-4 border-black px-8 py-4 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 disabled:bg-gray-600 disabled:cursor-not-allowed ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#ff4d4d,transparent_40%),radial-gradient(circle_at_70%_70%,#ff1a1a,transparent_40%)]"></span>
    <span className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-red-400/60 blur-[1px]"></span>
    <span className="sparkles pointer-events-none absolute -top-2 left-2 w-2 h-2 bg-white shadow-[0_0_10px_#fff,0_0_20px_#ff4d4d]"></span>
    <span className="sparkles pointer-events-none absolute -bottom-2 right-4 w-1.5 h-1.5 bg-white shadow-[0_0_8px_#fff,0_0_14px_#ff4d4d]"></span>
  </button>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const formTitleRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo( formTitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
        gsap.fromTo( formRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)", delay: 0.4 });
        
        // This animates the floating orbs around the form
        const floatingOrbs = gsap.utils.toArray(".floating-orb");
        floatingOrbs.forEach((el, i) => { 
          gsap.to(el, { 
            y: gsap.utils.random(-15, 15), 
            x: gsap.utils.random(-15, 15), 
            rotate: gsap.utils.random(-10, 10), 
            repeat: -1, 
            yoyo: true, 
            duration: gsap.utils.random(2, 4), 
            ease: "sine.inOut", 
            delay: i * 0.1,
          }); 
        });

        // This handles the parallax effect on mouse move
        const onMouse = (e) => { 
          const parallaxElements = gsap.utils.toArray("[data-parallax]");
          if (parallaxElements.length === 0) return; 
          const x = (e.clientX / window.innerWidth - 0.5) * 2; 
          const y = (e.clientY / window.innerHeight - 0.5) * 2; 
          gsap.to(parallaxElements, { 
            x: (i, t) => x * 20 * (parseFloat(t.getAttribute("data-parallax")) || 1), 
            y: (i, t) => y * 12 * (parseFloat(t.getAttribute("data-parallax")) || 1), 
            duration: 0.6, 
            ease: "power2.out", 
          }); 
        };
        window.addEventListener("mousemove", onMouse);
        
        // Three.js background setup
        (async () => {
          try {
            const container = threeContainerRef.current; if (!container) return;
            const { Scene, PerspectiveCamera, WebGLRenderer, Color, Fog, SphereGeometry, MeshStandardMaterial, Mesh, AmbientLight, PointLight, Clock, SRGBColorSpace, AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Vector2 } = await import("three");
            const pixelationFactor = 4; const scene = new Scene(); scene.background = new Color("#1a0808"); scene.fog = new Fog("#0d0404", 50, 180); const camera = new PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000); camera.position.set(0, 0, 60); const renderer = new WebGLRenderer({ antialias: false, alpha: true }); renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor); renderer.setPixelRatio(1); renderer.outputColorSpace = SRGBColorSpace; container.appendChild(renderer.domElement); Object.assign(renderer.domElement.style, { width: "100%", height: "100%", imageRendering: "pixelated" }); const ambient = new AmbientLight(0xff8844, 0.8); const point = new PointLight(0xff4411, 2.2, 200); point.position.set(20, 20, 20); scene.add(ambient, point); const orbGeo = new SphereGeometry(3, 16, 16); const orbMat = new MeshStandardMaterial({ color: "#b30000", emissive: "#ff1a1a", emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.2 }); const orbs = Array.from({ length: 6 }, () => { const orb = new Mesh(orbGeo, orbMat); orb.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, -20 - Math.random() * 40); scene.add(orb); return orb; }); const particlesCount = 400; const positions = new Float32Array(particlesCount * 3); for (let i = 0; i < particlesCount; i++) { positions[i * 3] = (Math.random() - 0.5) * 200; positions[i * 3 + 1] = (Math.random() - 0.5) * 120; positions[i * 3 + 2] = -50 - Math.random() * 200; } const pGeo = new BufferGeometry(); pGeo.setAttribute("position", new Float32BufferAttribute(positions, 3)); const pMat = new PointsMaterial({ color: 0xff6633, size: 1.4, sizeAttenuation: true, blending: AdditiveBlending, transparent: true, opacity: 0.8 }); const points = new Points(pGeo, pMat); scene.add(points); const mouse = new Vector2(0, 0); const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = (e.clientY / window.innerHeight - 0.5) * 2; }; window.addEventListener("mousemove", onMove); const clock = new Clock(); let rafId; const animate = () => { const t = clock.getElapsedTime(); orbs.forEach((o, i) => { o.position.y += Math.sin(t * 0.8 + i) * 0.02; o.position.x += Math.cos(t * 0.5 + i) * 0.015; }); points.rotation.y += 0.0008; camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05; camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05; camera.lookAt(0, 0, -40); renderer.render(scene, camera); rafId = requestAnimationFrame(animate); }; animate();
            ctx.add(() => { cancelAnimationFrame(rafId); window.removeEventListener("mousemove", onMove); renderer.dispose(); if (container && renderer.domElement) container.removeChild(renderer.domElement); });
          } catch (e) { console.error("Three.js failed to load:", e); }
        })();
        
      }, rootRef);
      return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ... All logic functions (handleInputChange, handleSignup, handleLogin) remain exactly the same
  const handleInputChange = (e) => { const { id, value } = e.target; setFormData((prev) => ({ ...prev, [id]: value, })); setError(""); };
  const handleSignup = async (e) => { e.preventDefault(); setIsLoading(true); setError(""); try { const response = await authAPI.register(formData); if (response.data.success) { const ctx = gsap.context(() => { gsap.to(formRef.current, { scale: 1.1, opacity: 0, duration: 0.6, ease: "power2.in", onComplete: () => { navigate("/login", { state: { signupSuccessMessage: `Welcome, ${formData.userName}! Please log in to begin.`, }, }); }, }); }, rootRef); } } catch (error) { console.error("Registration failed:", error); setError( error.response?.data?.message || "Registration failed. Please try again." ); const ctx = gsap.context(() => { gsap.to(formRef.current, { x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: "power1.inOut", }); }, rootRef); setIsLoading(false); } };
  const handleLogin = (e) => { e.preventDefault(); navigate("/login"); };

  return (
    <div
      ref={rootRef}
      className="min-h-screen text-white overflow-hidden relative font-pixel flex items-center justify-center p-4"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .text-shadow-pixel { text-shadow: 4px 4px 0 #000; }
        .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
        .pixel-input { background-color: #0d0404; border: 3px solid #000; color: #fff; padding: 0.75rem 1rem; font-family: 'Press Start 2P', cursive; font-size: 0.875rem; box-shadow: inset 2px 2px 0px #000; transition: all 0.1s ease-out; }
        .pixel-input:focus { outline: none; border-color: #ff4d4d; box-shadow: inset 2px 2px 0px #000, 0 0 10px rgba(255,77,77,0.5); }
        /* ✅ ADDED: Styles for the new background layers */
        .pixel-grid { background-image: linear-gradient(rgba(255,64,64,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,64,64,0.05) 1px, transparent 1px); background-size: 12px 12px; mix-blend-mode: soft-light; }
        .scanlines { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px); }
        .dither-overlay { background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%); background-size: 4px 4px; background-position: 0 0, 2px 2px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 2s linear infinite; }
      `}</style>

      {/* ✅ UPDATED: Richer, multi-layered pixel background */}
      <div aria-hidden data-parallax="-0.4" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
      <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: "inset 0 0 180px 40px rgba(0,0,0,0.75)" }}></div>
      <div aria-hidden className="pixel-grid absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="scanlines absolute inset-0 -z-10 pointer-events-none"></div>
      <div ref={threeContainerRef} data-parallax="-0.1" className="absolute inset-0 -z-10"></div>

      {/* Main Form Container */}
      <div className="relative z-10 p-6 md:p-10 bg-black/70 border-8 border-red-800/80 shadow-[10px_10px_0_#000] max-w-md w-full mx-auto pixelated-rendering">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Loading..." className="w-16 h-16 pixelated-rendering animate-spin-slow" />
            <p className="text-xl text-yellow-300 text-shadow-pixel animate-pulse"> REGISTERING... </p>
          </div>
        )}

        {/* ✅ ADDED: Floating decorative elements around the form */}
        <div className="floating-orb absolute -top-8 -left-8 w-12 h-12 bg-red-500 rounded-full border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" className="w-8 h-8 pixelated-rendering" />
        </div>
        <div className="floating-orb absolute -bottom-6 -right-6 w-10 h-10 bg-yellow-400 rounded-full border-4 border-black shadow-[4px_4px_0_#000]"></div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif" alt="Charmander" className="floating-orb absolute -top-12 right-10 w-24 h-24 pixelated-rendering drop-shadow-[4px_4px_0_#000]" />
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" alt="Great Ball" className="floating-orb absolute -bottom-10 left-10 w-16 h-16 pixelated-rendering" />
        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>

        <h2 ref={formTitleRef} className="text-3xl md:text-4xl font-bold text-center text-shadow-pixel mb-8 bg-red-800/30 px-4 py-2 rounded" >
          BECOME A TRAINER!
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border-2 border-red-600 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form ref={formRef} className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label htmlFor="fullName" className="block text-red-200 text-sm mb-2"> FULL NAME </label>
            <input type="text" id="fullName" className="w-full pixel-input" placeholder="ASH KETCHUM" value={formData.fullName} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="userName" className="block text-red-200 text-sm mb-2"> USERNAME </label>
            <input type="text" id="userName" className="w-full pixel-input" placeholder="YOUR TRAINER NAME" value={formData.userName} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-red-200 text-sm mb-2"> EMAIL </label>
            <input type="email" id="email" className="w-full pixel-input" placeholder="TRAINER@POKEMON.COM" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-red-200 text-sm mb-2"> PASSWORD </label>
            <input type="password" id="password" className="w-full pixel-input" placeholder="SECRET MOVE" value={formData.password} onChange={handleInputChange} required minLength={6} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <PixelButton type="submit" className="flex-1 w-full text-lg py-3 whitespace-nowrap min-w-[180px]" disabled={isLoading}>
              SIGN UP
            </PixelButton>
            <PixelButton type="button" className="flex-1 w-full bg-gray-700 hover:bg-gray-800 !shadow-[6px_6px_0px_#222] text-lg py-3 whitespace-nowrap min-w-[180px]" onClick={handleLogin}>
              LOGIN
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
}