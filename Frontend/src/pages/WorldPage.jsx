import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// --- MOCK DATA FOR THE WORLD MAP ---
const mapData = {
    'starter_shore': {
        name: 'Starter Shore',
        description: 'A calm beach where new trainers begin. The challenges are straightforward.',
        position: { top: '85%', left: '15%' },
        userProgress: 100,
        unlocks: 'path_to_woods',
        leaderboard: [ { rank: 1, name: 'Ash', score: 9800 }, { rank: 2, name: 'You', score: 9500 }, { rank: 3, name: 'Gary', score: 9200 }, ],
        effect: 'waves',
    },
    'whispering_woods': {
        name: 'Whispering Woods',
        description: 'A dense forest with tricky, winding challenges. Recommended for growing trainers.',
        position: { top: '65%', left: '28%' },
        userProgress: 80,
        unlocks: 'path_to_desert',
        leaderboard: [ { rank: 1, name: 'Misty', score: 15400 }, { rank: 2, name: 'You', score: 14800 }, { rank: 3, name: 'Brock', score: 14200 }, ],
        effect: 'fog',
    },
    'sunkiss_desert': {
        name: 'Sunkiss Desert',
        description: 'A vast desert where only the most resilient can survive the heat of the questions.',
        position: { top: '70%', left: '55%' },
        userProgress: 0,
        unlocks: 'path_to_peaks',
        leaderboard: [],
        effect: 'sandstorm',
    },
    'frostfang_peaks': {
        name: 'Frostfang Peaks',
        description: 'Icy mountains with questions that will test the peak of your knowledge.',
        position: { top: '30%', left: '48%' },
        userProgress: 0,
        unlocks: 'path_to_volcano',
        leaderboard: [],
        effect: 'snow',
    },
    'cinder_volcano': {
        name: 'Cinder Volcano',
        description: 'The final challenge. A towering volcano where only legendary masters can hope to succeed.',
        position: { top: '40%', left: '80%' },
        userProgress: 0,
        unlocks: null,
        leaderboard: [],
        effect: 'lava',
    },
};

// --- REGION EFFECT OVERLAYS ---
const RegionEffectOverlay = ({ effect, visible }) => {
    if (!visible) return null;
    switch (effect) {
        case 'fog':
            return (
                <div className="absolute inset-0 pointer-events-none" style={{zIndex:2}}>
                    {[...Array(12)].map((_,i) => (
                        <div key={i} className="absolute bg-white/10 rounded-full blur-md" style={{
                            top: `${20 + Math.random()*40}%`,
                            left: `${10 + Math.random()*70}%`,
                            width: `${120 + Math.random()*120}px`,
                            height: `${60 + Math.random()*60}px`,
                            opacity: 0.6,
                            animation: `fogMove ${6+Math.random()*8}s infinite alternate`
                        }}></div>
                    ))}
                </div>
            );
        case 'sandstorm':
            return (
                <div className="absolute inset-0 pointer-events-none" style={{zIndex:2}}>
                    {[...Array(30)].map((_,i) => (
                        <div key={i} className="absolute bg-yellow-200/20 rounded-full blur-sm" style={{
                            top: `${Math.random()*100}%`,
                            left: `${Math.random()*100}%`,
                            width: `${6+Math.random()*12}px`,
                            height: `${6+Math.random()*12}px`,
                            opacity: 0.5,
                            animation: `sandstormMove ${2+Math.random()*3}s infinite linear`
                        }}></div>
                    ))}
                </div>
            );
        case 'waves':
            return (
                <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{height:'20%',zIndex:2}}>
                    <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 Q25,10 50,20 T100,20" fill="#38bdf8" fillOpacity="0.3">
                            <animate attributeName="d" values="M0,20 Q25,10 50,20 T100,20;M0,20 Q35,15 50,17 T100,20;M0,20 Q25,10 50,20 T100,20" dur="6s" repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
            );
        case 'snow':
            return (
                <div className="absolute inset-0 pointer-events-none" style={{zIndex:2}}>
                    {[...Array(28)].map((_,i)=>(
                        <div key={i} className="absolute bg-white rounded-full" style={{
                            top: `${Math.random()*80}%`,
                            left: `${Math.random()*100}%`,
                            width: `${3+Math.random()*7}px`,
                            height: `${3+Math.random()*7}px`,
                            opacity: 0.8,
                            animation: `snowFall ${6+Math.random()*4}s infinite linear`
                        }}></div>
                    ))}
                </div>
            );
        case 'lava':
            return (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{zIndex:2}}>
                    <div className="w-32 h-32 rounded-full" style={{background:'radial-gradient(circle at 60% 60%, #f59e0b 0%, #b91c1c 90%)', filter:'blur(24px)', opacity:0.7, animation:'lavaPulse 2s infinite alternate'}}></div>
                </div>
            );
        default: return null;
    }
};

// --- SVG PATHS COMPONENT ---
const ProgressionPaths = ({ completedRegions }) => {
    const pathsRef = useRef(null);
    const pathData = {
        'path_to_woods': "M 150 510 C 200 450, 250 400, 280 390",
        'path_to_desert': "M 280 390 C 380 450, 480 450, 550 420",
        'path_to_peaks': "M 550 420 C 520 350, 490 250, 480 180",
        'path_to_volcano': "M 480 180 C 580 200, 700 220, 800 240",
    };

    useEffect(() => {
        if (!pathsRef.current) return;
        pathsRef.current.querySelectorAll('path').forEach(path => {
            const pathId = path.getAttribute('id');
            const regionThatUnlocksPath = Object.keys(mapData).find(key => mapData[key].unlocks === pathId);
            if (completedRegions.includes(regionThatUnlocksPath)) {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
                gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power1.inOut', delay: 0.5 });
            } else {
                gsap.set(path, { opacity: 0.3, strokeDasharray: "10 5" });
            }
        });
    }, [completedRegions]);

    return (
        <svg ref={pathsRef} className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
            {Object.entries(pathData).map(([id, d]) => (
                <path key={id} id={id} d={d} fill="none" stroke="rgba(255, 235, 153, 0.9)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 5px #fef08a)' }} />
            ))}
        </svg>
    );
};

// --- SOUND EFFECTS ---
const playSound = (src, enabled) => {
    if (!enabled) return;
    const audio = new window.Audio(src);
    audio.volume = 0.5;
    audio.play();
};

// --- ACHIEVEMENTS BADGES ---
const regionBadges = {
    'starter_shore': '🏆',
    'whispering_woods': '🌲',
    'sunkiss_desert': '🏜️',
    'frostfang_peaks': '❄️',
    'cinder_volcano': '🔥',
};

// --- PIXEL BUTTON ---
const PixelButton = ({ children, className = '', ...props }) => (
    <button {...props} className={`relative select-none bg-[#b30000] text-white border-4 border-black px-8 py-3 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed ${className}`}>
        <span className="relative z-10">{children}</span>
    </button>
);

// --- PROGRESS BAR ---
const ProgressBar = ({ progress }) => (
    <div className="w-full bg-black/50 border-4 border-black p-1 shadow-[4px_4px_0_#000]">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
);

// --- BATTLEFIELD BACKGROUND ---
const Battlefield = () => (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-[#0c0a18]">
        {/* Sky & Sun */}
        <div data-parallax="0.1" className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b] via-[#4c1d95] to-[#b91c1c]"></div>
        <div data-parallax="0.15" className="absolute top-[10%] left-[50%] w-32 h-32 bg-yellow-300 rounded-full filter blur-xl opacity-50 sun-glow"></div>
        {/* Twinkling Stars */}
        <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-white rounded-full star" style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${2 + Math.random() * 3}s infinite alternate` }}></div>
            ))}
        </div>
        {/* Animated clouds - layered for parallax */}
        <div data-parallax="0.2" className="cloud absolute top-[5%] left-[-200px] w-[300px] h-[90px] bg-white/10 rounded-full filter blur-md"></div>
        <div data-parallax="0.3" className="cloud absolute top-[15%] left-[-300px] w-[400px] h-[120px] bg-white/10 rounded-full filter blur-lg"></div>
        <div data-parallax="0.2" className="cloud absolute top-[10%] right-[-250px] w-[250px] h-[75px] bg-white/10 rounded-full filter blur-md"></div>
        {/* Animated Water */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-800/50 ocean"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-900/50 ocean" style={{animationDelay: '-2s'}}></div>
        {/* Landmasses */}
        <svg data-parallax="0.5" className="absolute bottom-0 w-full h-full text-[#14532d]" preserveAspectRatio="none" viewBox="0 0 200 100">
            <path d="M 0 100 V 80 C 10 70, 30 75, 45 60 S 70 40, 90 60 S 110 80, 130 75 S 160 65, 180 80 V 100 Z" fill="currentColor"/>
        </svg>
         <svg data-parallax="0.7" className="absolute bottom-0 w-full h-full text-[#166534]" preserveAspectRatio="none" viewBox="0 0 200 100">
            <path d="M 0 100 V 85 C 20 80, 35 90, 50 80 S 70 65, 90 75 S 110 90, 130 85 S 160 75, 180 90 V 100 Z" fill="currentColor"/>
        </svg>
        <svg data-parallax="1" className="absolute bottom-0 right-0 w-[50%] h-[50%] text-[#44403c]" viewBox="0 0 100 100">
             <polygon points="100,100 100,50 80,30 60,60 40,40 20,80 0,70 20,100" fill="currentColor" />
             <polygon points="80,30 75,40 85,40" fill="#f97316" className="lava-glow" />
             <polygon points="81,31 77,38 83,38" fill="#fef08a" className="lava-glow" style={{animationDelay: '0.5s'}} />
        </svg>
        {/* Floating Embers */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => ( <div key={i} className="ember absolute w-1.5 h-1.5 bg-orange-400 rounded-full" style={{ left: `${Math.random() * 100}%`, animation: `floatUp ${4 + Math.random() * 6}s linear ${Math.random() * 6}s infinite` }}></div> ))}
        </div>
        {/* Pokemon Sprites */}
        <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/lapras.gif" className="absolute bottom-[8%] left-[45%] w-24 pixelated-rendering pokemon-bob" data-parallax="0.6" alt="Lapras"/>
        <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/snorlax.gif" className="absolute bottom-[28%] left-[26%] w-20 pixelated-rendering pokemon-bob" style={{animationDuration: '5s'}} data-parallax="0.8" alt="Snorlax"/>
        <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/pidgey.gif" className="absolute top-[20%] left-[-5%] w-12 pixelated-rendering pokemon-fly" data-parallax="0.3" alt="Pidgey"/>
        <img src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/diglett.gif" className="absolute bottom-[20%] left-[10%] w-10 pixelated-rendering pokemon-dig" data-parallax="1" alt="Diglett"/>
    </div>
);

// --- MAIN WORLD MAP PAGE COMPONENT ---
export default function WorldMapPage() {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [completedRegions, setCompletedRegions] = useState(['starter_shore']);
  const [regionHistory, setRegionHistory] = useState({'starter_shore': new Date().toLocaleString()});
  const [showUnlockEffect, setShowUnlockEffect] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const mapOrder = Object.keys(mapData);
  const mapContainerRef = useRef(null);

  // --- UNLOCK LOGIC ---
  const isUnlocked = useCallback((regionId) => {
      const regionIndex = mapOrder.indexOf(regionId);
      if (regionIndex === 0) return true;
      const previousRegionId = mapOrder[regionIndex - 1];
      return completedRegions.includes(previousRegionId);
  }, [completedRegions, mapOrder]);

  const isRecommended = useCallback((regionId) => {
      return isUnlocked(regionId) && !completedRegions.includes(regionId);
  }, [isUnlocked, completedRegions]);

  // --- REGION CLICK ---
  const handleRegionClick = useCallback((regionId) => {
    const region = mapData[regionId];
    setSelectedRegionId(regionId);
    gsap.to(mapContainerRef.current, { 
      duration: 1, 
      scale: 2.5, 
      x: `${-parseInt(region.position.left) + 50}%`, 
      y: `${-parseInt(region.position.top) + 50}%`, 
      ease: 'power3.inOut' 
    });
    playSound('https://cdn.pixabay.com/audio/2022/07/26/audio_121b3b7f12.mp3', soundEnabled); // region select SFX
  }, [soundEnabled]);

  const handleClosePanel = useCallback(() => {
    setSelectedRegionId(null);
    gsap.to(mapContainerRef.current, { 
      duration: 1, 
      scale: 1, 
      x: '0%', 
      y: '0%', 
      ease: 'power3.inOut' 
    });
  }, []);

  // --- COMPLETE REGION ---
  const handleCompleteRegion = useCallback((regionId) => {
    if (!completedRegions.includes(regionId)) {
        setCompletedRegions(prev => [...prev, regionId]);
        setRegionHistory(prev => ({...prev, [regionId]: new Date().toLocaleString()}));
        setShowUnlockEffect(true);
        playSound('https://cdn.pixabay.com/audio/2022/08/20/audio_123b3b8e2a.mp3', soundEnabled); // unlock SFX
        setTimeout(()=>setShowUnlockEffect(false),2000);
    }
    handleClosePanel();
  }, [completedRegions, soundEnabled, handleClosePanel]);

  // --- KEYBOARD REGION NAVIGATION ---
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') setFocusedIndex(i => (i+1)%mapOrder.length);
        if (e.key === 'ArrowLeft') setFocusedIndex(i => (i-1+mapOrder.length)%mapOrder.length);
        if (e.key === 'Enter') handleRegionClick(mapOrder[focusedIndex]);
        if (e.key === 'Escape') handleClosePanel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapOrder, focusedIndex, handleRegionClick, handleClosePanel]);

  // --- INITIAL & PARALLAX ANIMATIONS ---
  useEffect(() => {
    gsap.fromTo('.region-marker', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1, delay: 0.5 });
    gsap.to('.region-marker.unlocked', { y: -5, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut', stagger: { each: 0.2, from: 'random' } });
    gsap.to('.sun-glow', { scale: 1.1, opacity: 0.7, repeat: -1, yoyo: true, duration: 5, ease: 'sine.inOut'});
    const onMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to("[data-parallax]", { x: (i, t) => x * 15 * parseFloat(t.dataset.parallax), y: (i, t) => y * 10 * parseFloat(t.dataset.parallax), duration: 0.8, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const selectedRegion = selectedRegionId ? mapData[selectedRegionId] : null;

  return (
    <div className="min-h-screen text-white overflow-hidden relative font-pixel bg-[#1a0a0a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .text-shadow-pixel { text-shadow: 2px 2px 0 #000; }
        .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }
        .recommended-glow::after { content: '★'; position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 24px; color: #fef08a; text-shadow: 0 0 10px #f59e0b; animation: star-bounce 1s infinite; }
        @keyframes star-bounce { 0%, 100% { transform: translate(-50%, 0) scale(1); } 50% { transform: translate(-50%, -5px) scale(1.1); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-100vh) translateX(20px); opacity: 0; } }
        .lava-glow { animation: pulseGlow 2s infinite ease-in-out; }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        .ocean { animation: wave 8s infinite alternate ease-in-out; background: linear-gradient(to top, #1e3a8a, #3b82f6); opacity: 0.5; }
        @keyframes wave { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
        .pokemon-bob { animation: bob 4s infinite ease-in-out; }
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .pokemon-fly { animation: fly 25s infinite linear; }
        @keyframes fly { from { transform: translateX(-10%); } to { transform: translateX(120vw); } }
        .pokemon-dig { animation: dig 6s infinite steps(2, end); }
        @keyframes dig { 0%, 50%, 100% { transform: translateY(0); } 25%, 75% { transform: translateY(50%); } }
        /* Region overlays */
        @keyframes fogMove { from { transform: translateX(0); } to { transform: translateX(60px); } }
        @keyframes sandstormMove { from { transform: translateX(0) scale(1); } to { transform: translateX(40px) scale(1.2); } }
        @keyframes snowFall { from { transform: translateY(0); } to { transform: translateY(80vh); } }
        @keyframes lavaPulse { from { opacity:0.7; } to { opacity:1; transform:scale(1.08);} }
        /* Unlock effect */
        .unlock-sparkle { pointer-events:none; position:absolute; inset:0; z-index:100; }
        .unlock-sparkle span {
            position:absolute; font-size:32px; color:#fef08a; text-shadow:0 0 12px #f59e0b;
            animation: sparkleDrop 1.5s cubic-bezier(.61,1.63,.37,-0.85) forwards;
        }
        @keyframes sparkleDrop { 0%{opacity:1;transform:scale(0.2) translateY(-80px);} 80%{opacity:1;} 100%{opacity:0;transform:scale(1.2) translateY(80px);} }
        /* Tooltip */
        .region-tooltip { 
            pointer-events: none; position: absolute; left: 50%; top: -38px; transform: translateX(-50%);
            background: #222; color: #fef08a; font-size: 13px; padding: 5px 12px; border-radius: 8px; border: 2px solid #000;
            white-space: nowrap; z-index: 12; box-shadow: 2px 2px 0 #000;
        }
        /* Focus marker */
        .region-marker:focus { outline:2px solid #fef08a; box-shadow:0 0 10px #f59e0b; }
      `}</style>

      <header className="relative z-20 bg-black/50 border-b-4 border-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 py-4 text-center flex items-center justify-between">
            <span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">World of EduQuest</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 select-none text-lg">
                <input type="checkbox" className="w-5 h-5" checked={soundEnabled} onChange={e=>setSoundEnabled(e.target.checked)} />
                <span>{soundEnabled ? "🔊" : "🔇"}</span>
              </label>
              <span className="text-xs text-yellow-200">Sound</span>
            </div>
        </div>
      </header>

      <main className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full origin-center">
            <Battlefield />
            <ProgressionPaths completedRegions={completedRegions} />
            {/* Region Overlays */}
            {Object.entries(mapData).map(([id, region]) => (
                <RegionEffectOverlay 
                    key={id+'effect'} 
                    effect={region.effect} 
                    visible={selectedRegionId===id || isRecommended(id)} 
                />
            ))}
            {/* Region Markers */}
            {Object.entries(mapData).map(([id, region], i) => {
              const unlocked = isUnlocked(id);
              const recommended = isRecommended(id);
              const focused = focusedIndex === i;
              return (
                  <button
                    key={id}
                    type="button"
                    className="absolute"
                    style={{ ...region.position, zIndex:10 }}
                    onClick={() => handleRegionClick(id)}
                    tabIndex={0}
                    aria-label={unlocked ? region.name : 'Locked Region'}
                    autoFocus={focused}
                  >
                      <div className={`region-marker relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110 ${unlocked ? 'unlocked' : 'locked'} ${focused ? 'ring-2 ring-yellow-400' : ''}`} >
                          <div className={`relative w-8 h-8 border-4 border-black bg-red-800 rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] ${!unlocked ? 'bg-gray-700 filter grayscale' : ''} ${recommended ? 'recommended-glow' : ''}`}>
                              {completedRegions.includes(id) && (
                                <span className="text-2xl absolute inset-0 flex items-center justify-center">{regionBadges[id]}</span>
                              )}
                              {!unlocked && <span className="text-xl">?</span>}
                          </div>
                          <span className={`mt-2 font-bold text-sm text-center px-2 py-1 bg-black/70 rounded ${!unlocked ? 'text-gray-400' : 'text-white'}`}>{unlocked ? region.name : '???'}</span>
                          {/* Tooltip for locked */}
                          {!unlocked && (
                              <span className="region-tooltip">Complete previous region to unlock</span>
                          )}
                      </div>
                  </button>
              );
            })}
            {/* Unlock effect sparkles */}
            {showUnlockEffect && (
                <div className="unlock-sparkle absolute inset-0">
                  {Array.from({length:16}).map((_,i)=>(
                    <span key={i} style={{
                        left: `${12+Math.random()*76}%`,
                        top: `${30+Math.random()*40}%`,
                        animationDelay: `${Math.random()*0.8}s`,
                        fontSize: `${28+Math.random()*16}px`
                    }}>✨</span>
                  ))}
                </div>
            )}
        </div>

        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-black/70 backdrop-blur-sm border-l-4 border-black shadow-[-8px_0_20px_rgba(0,0,0,0.5)] p-6 flex flex-col transition-transform duration-500 ease-in-out ${selectedRegion ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedRegion && <>
             <button onClick={handleClosePanel} aria-label="Close panel" className="absolute top-4 right-4 text-4xl font-bold hover:text-red-500 transition-colors">&times;</button>
             <h2 className="text-3xl font-bold text-shadow-pixel text-yellow-300 mb-2 flex items-center gap-2">
                {isUnlocked(selectedRegionId) ? selectedRegion.name : '???'}
                {completedRegions.includes(selectedRegionId) && <span title="Mastered">{regionBadges[selectedRegionId]}</span>}
             </h2>
             <p className="text-sm text-gray-300 mb-6">{isUnlocked(selectedRegionId) ? selectedRegion.description : "You must unlock this region to see its details."}</p>
             {/* Region overlay effect */}
             <RegionEffectOverlay effect={selectedRegion.effect} visible={true} />
             {isUnlocked(selectedRegionId) ? (
                 <>
                     <h3 className="text-xl font-bold mb-2">Your Progress</h3>
                     <div className="flex items-center gap-4 mb-2">
                         <ProgressBar progress={completedRegions.includes(selectedRegionId) ? 100 : selectedRegion.userProgress} />
                         <span className="font-bold text-xl">{completedRegions.includes(selectedRegionId) ? 100 : selectedRegion.userProgress}%</span>
                     </div>
                     {/* Achievement & history */}
                     {completedRegions.includes(selectedRegionId) && (
                       <div className="text-green-400 font-bold text-sm mb-6">
                         <span>Achievement unlocked! {regionBadges[selectedRegionId]}<br/></span>
                         <span>Completed: {regionHistory[selectedRegionId]}</span>
                       </div>
                     )}
                     <h3 className="text-xl font-bold mb-4">Region Leaderboard</h3>
                     <div className="flex-grow bg-black/40 border-4 border-black p-4 shadow-[inset_4px_4px_0_rgba(0,0,0,0.5)] overflow-y-auto">
                         {selectedRegion.leaderboard.length > 0 ? (
                             <ol className="space-y-2">{selectedRegion.leaderboard.map(e => (<li key={e.rank} className={`flex justify-between items-center text-lg p-1 ${e.name === 'You' ? 'bg-red-900/50' : ''}`}><span className={`${e.rank === 1 ? 'text-yellow-400' : 'text-white'} font-bold`}>#{e.rank} {e.name}</span><span className="text-yellow-400">{e.score} XP</span></li>))}</ol>
                         ) : <p className="text-gray-400 text-center">No scores yet. Be the first!</p>}
                     </div>
                     <PixelButton 
                        className="w-full mt-6"
                        onClick={() => handleCompleteRegion(selectedRegionId)}
                        disabled={completedRegions.includes(selectedRegionId)}
                     >
                        {completedRegions.includes(selectedRegionId) ? "Region Mastered!" : "Complete & Unlock Next"}
                     </PixelButton>
                 </>
             ) : (
                <div className="text-center flex-grow flex-col items-center justify-center">
                  <span className="text-6xl mb-4">🔒</span>
                  <h3 className="text-2xl font-bold text-red-500">Region Locked</h3>
                  <p className="mt-2">Complete previous regions to unlock.</p>
                </div>
             )}
           </>}
        </div>
      </main>
    </div>
  );
}