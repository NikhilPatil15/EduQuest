import React, { useState, useEffect, useRef, useCallback } from "react";
// FIX: Changed imports to use a CDN URL to resolve the module error.
import { gsap } from "https://esm.sh/gsap";
import { MotionPathPlugin } from "https://esm.sh/gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

/**
 * Self-contained pixel-style world map — V6 UI Polish
 * - All V5 features (panning, quiz, persistence, etc.)
 * - ENHANCED: The Quiz Modal UI has been redesigned for better text presentation and readability.
 */

// --- MAP & QUIZ DATA ---
const mapData = {
  verdant_valley: {
    id: "verdant_valley",
    name: "Verdant Valley",
    description: "A lush valley where new trainers begin their journey. The creatures here are gentle.",
    position: { top: "78%", left: "18%" },
    userProgress: 0,
    pathId: "#path1",
    recommendedLevel: 1,
    creatureType: "leaf",
    badgeIcon: "🌿",
  },
  whispering_woods: {
    id: "whispering_woods",
    name: "Whispering Woods",
    description: "A dense forest filled with mysterious rustling. Be prepared for trickery.",
    position: { top: "60%", left: "33%" },
    userProgress: 0,
    pathId: "#path2",
    recommendedLevel: 5,
    creatureType: "leaf",
    badgeIcon: "🌳",
  },
  crimson_desert: {
    id: "crimson_desert",
    name: "Crimson Desert",
    description: "A scorching wasteland that tests endurance. Fire-type inhabitants thrive here.",
    position: { top: "75%", left: "56%" },
    userProgress: 0,
    pathId: "#path3",
    recommendedLevel: 12,
    creatureType: "fire",
    badgeIcon: "🔥",
  },
  ironclad_citadel: {
    id: "ironclad_citadel",
    name: "Ironclad Citadel",
    description: "A fortress of knowledge and courage, guarded by unyielding sentinels.",
    position: { top: "45%", left: "72%" },
    userProgress: 0,
    pathId: "#path4",
    recommendedLevel: 20,
    creatureType: "steel",
    badgeIcon: "🛡️",
  },
  crystal_spire: {
    id: "crystal_spire",
    name: "Crystal Spire",
    description: "The pinnacle of wisdom where legends are made. Only the strongest may enter.",
    position: { top: "22%", left: "88%" },
    userProgress: 0,
    pathId: null, // Last location has no outgoing path
    recommendedLevel: 30,
    creatureType: "ice",
    badgeIcon: "💎",
  },
};

const quizData = {
  verdant_valley: {
    question: "Which process do plants use to make their own food?",
    options: ["Photosynthesis", "Respiration", "Transpiration", "Pollination"],
    correctAnswer: "Photosynthesis"
  },
  whispering_woods: {
    question: "What is the primary gas that trees absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Carbon Dioxide"
  },
  crimson_desert: {
      question: "Which of these animals is best adapted to a hot, dry desert climate?",
      options: ["Polar Bear", "Penguin", "Camel", "Frog"],
      correctAnswer: "Camel"
  },
  ironclad_citadel: {
      question: "In medieval times, what was the main purpose of a citadel?",
      options: ["Marketplace", "A fortified stronghold", "A place of worship", "Farmland"],
      correctAnswer: "A fortified stronghold"
  },
  crystal_spire: {
      question: "What state of matter is ice?",
      options: ["Solid", "Liquid", "Gas", "Plasma"],
      correctAnswer: "Solid"
  }
};


// --- CUSTOM HOOKS ---

const useUserProgress = () => {
    // **MODIFIED**: State is now initialized from localStorage, or defaults to mapData.
    const [progress, setProgress] = useState(() => {
        try {
            const savedProgress = localStorage.getItem('eduQuestProgressV1');
            if (savedProgress) {
                const parsed = JSON.parse(savedProgress);
                // Merge with default mapData to allow for future map expansions
                return { ...mapData, ...parsed };
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage:", error);
        }
        return mapData;
    });

    // **MODIFIED**: Effect hook to save progress whenever it changes.
    useEffect(() => {
        try {
            localStorage.setItem('eduQuestProgressV1', JSON.stringify(progress));
        } catch (error) {
            console.error("Failed to save progress to localStorage:", error);
        }
    }, [progress]);
    
    const keys = Object.keys(progress);
    const isUnlocked = (regionId) => {
      const i = keys.indexOf(regionId);
      if (i === 0) return true;
      const prevRegionId = keys[i - 1];
      return progress[prevRegionId]?.userProgress === 100;
    };
  
    const isRecommended = (regionId) =>
      isUnlocked(regionId) && progress[regionId].userProgress < 100;
      
    const lastCompletedIndex = keys.reduce((lastIdx, key, currentIdx) => {
        return progress[key].userProgress === 100 ? currentIdx : lastIdx;
    }, -1);

    // Player starts at the first uncompleted unlocked region, or the very first region
    const firstUncompletedIndex = keys.findIndex(key => isUnlocked(key) && progress[key].userProgress < 100);
    const playerCurrentRegionId = keys[firstUncompletedIndex !== -1 ? firstUncompletedIndex : 0];

    return { progress, setProgress, isUnlocked, isRecommended, playerCurrentRegionId };
};

const useTypewriter = (text, speed = 30) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        setDisplayText(''); 
        if (!text) return;
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);
        return () => clearInterval(typingInterval);
    }, [text, speed]);
    return displayText;
};


// --- UI & HELPER COMPONENTS ---

const MiniSprite = ({ size = 28, type = "leaf" }) => {
    const types = {
      leaf: <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated"><rect width="24" height="24" rx="4" fill="#082f07" /><path d="M6 16c6-6 10-6 12-10c-6 2-8 6-12 10z" fill="#6ee7b7" /></svg>,
      fire: <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated"><rect width="24" height="24" rx="4" fill="#3a0b00" /><path d="M12 5c2 2 3 3 3 6c0 3-2 6-3 7c-1-1-3-4-3-7c0-3 1-4 3-6z" fill="#ffb300" /></svg>,
      ice: <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated"><rect width="24" height="24" rx="4" fill="#0b233a" /><circle cx="12" cy="12" r="5" fill="#a5f3fc" /></svg>,
      steel: <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated"><rect width="24" height="24" rx="4" fill="#2a2a2d" /><path d="M4 12 L12 4 L20 12 L12 20 Z" fill="#b0b0b8" stroke="#f0f0f8" strokeWidth="2" /></svg>
    };
    return types[type] || types.leaf;
};
  
const LockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
  
const PlayerSprite = React.forwardRef((props, ref) => (
    <img 
      ref={ref} 
      src="/trainer1.png" // The trainer image in your `public` folder
      alt="Player Trainer" 
      className="absolute pixelated" 
      style={{ 
          width: '48px', 
          height: 'auto',
          // This transform makes the trainer's feet align with the location coordinates
          transform: 'translate(-50%, -100%)', 
          willChange: 'transform' 
      }} 
    />
));

// **UPDATED**: Quiz Modal Component with improved UI
const QuizModal = ({ quiz, onCorrectAnswer, onClose, playSound }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        setSelectedAnswer(null);
        setFeedback("");
    }, [quiz.question]);

    const handleAnswerClick = (option) => {
        if (feedback) return; // Prevent changing answer

        setSelectedAnswer(option);
        const isCorrect = option === quiz.correctAnswer;

        if (isCorrect) {
            setFeedback("Correct!");
            playSound('success');
            setTimeout(() => {
                onCorrectAnswer();
                onClose();
            }, 1200);
        } else {
            setFeedback("Not quite, try again!");
            playSound('fail');
            setTimeout(() => {
                setFeedback("");
                setSelectedAnswer(null);
            }, 1200);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md panel-border p-6 relative">
                <button onClick={onClose} className="absolute -top-2 -right-2 text-3xl font-bold hover:text-red-500 transition-colors" style={{ textShadow: "2px 2px 0 #000" }}>×</button>
                <h3 className="text-lg text-yellow-300 text-shadow-pixel mb-4 text-center">⚔️ Challenge Question! ⚔️</h3>
                
                <div className="bg-black/50 border-4 border-black p-4 my-6 shadow-[inset_4px_4px_0_rgba(0,0,0,0.2)]">
                    <p className="text-base leading-relaxed text-center text-white">{quiz.question}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quiz.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        let buttonClass = "bg-red-700 hover:bg-red-600";
                        if (isSelected) {
                            buttonClass = feedback === "Correct!" ? "bg-green-600" : "bg-red-900";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(option)}
                                disabled={!!feedback}
                                className={`w-full text-white border-4 border-black px-4 py-3 font-bold text-shadow-pixel shadow-[4px_4px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm ${buttonClass}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
                {feedback && <p className={`mt-4 text-center font-bold text-shadow-pixel text-lg ${feedback === "Correct!" ? 'text-green-400' : 'text-red-400'}`}>{feedback}</p>}
            </div>
        </div>
    );
};


/* ---------- MAIN PAGE COMPONENT ---------- */
export default function WorldMapPixel({ backgroundImage = "/pixel-map-bg.png" }) {
    const [selected, setSelected] = useState(null);
    const { progress, setProgress, isUnlocked, isRecommended, playerCurrentRegionId } = useUserProgress();
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [isMoving, setIsMoving] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isQuizActive, setIsQuizActive] = useState(false); // **NEW**: State for quiz modal

    const audioRefs = useRef({
      hover: typeof Audio !== "undefined" ? new Audio('/sounds/hover.wav') : null,
      click: typeof Audio !== "undefined" ? new Audio('/sounds/click.wav') : null,
      success: typeof Audio !== "undefined" ? new Audio('/sounds/success.wav') : null,
      fail: typeof Audio !== "undefined" ? new Audio('/sounds/fail.wav') : null, // **NEW**
      music: typeof Audio !== "undefined" ? new Audio('/sounds/bg-music.mp3') : null,
    });
  
    const playSound = useCallback((sound) => {
      if (isMuted) return;
      const audio = audioRefs.current[sound];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = sound === 'music' ? 0.3 : 0.6;
        audio.play().catch(err => console.error(`Audio playback failed for ${sound}:`, err));
      }
    }, [isMuted]);
  
    useEffect(() => {
        const initialPos = progress[playerCurrentRegionId].position;
        gsap.set(playerRef.current, { top: initialPos.top, left: initialPos.left });
        
        const music = audioRefs.current.music;
        if (music) {
            music.loop = true;
            music.volume = 0.3;
            if (!isMuted) {
                music.play().catch(e => console.log("Music autoplay prevented"));
            } else {
                music.pause();
            }
        }
    }, [isMuted, playerCurrentRegionId, progress]);
  
  
    useEffect(() => {
        const container = containerRef.current;
        if (zoom <= 1) {
          container.style.cursor = 'default';
          return;
        };
        
        container.style.cursor = 'grab';
        let isDown = false;
        let startX, startY;
        let mapStartPos = { x: gsap.getProperty(mapRef.current, "x"), y: gsap.getProperty(mapRef.current, "y") };
    
        const onMouseDown = (e) => {
          isDown = true;
          container.style.cursor = 'grabbing';
          startX = e.pageX - container.offsetLeft;
          startY = e.pageY - container.offsetTop;
          mapStartPos = { x: gsap.getProperty(mapRef.current, "x"), y: gsap.getProperty(mapRef.current, "y") };
        };
    
        const onMouseMove = (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - container.offsetLeft;
          const y = e.pageY - container.offsetTop;
          const walkX = (x - startX);
          const walkY = (y - startY);
          gsap.set(mapRef.current, { x: mapStartPos.x + walkX, y: mapStartPos.y + walkY });
        };
    
        const onMouseUp = () => {
          isDown = false;
          container.style.cursor = 'grab';
        };
    
        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseUp);
    
        return () => {
          container.removeEventListener('mousedown', onMouseDown);
          container.removeEventListener('mousemove', onMouseMove);
          container.removeEventListener('mouseup', onMouseUp);
          container.removeEventListener('mouseleave', onMouseUp);
        };
    }, [zoom]);
  
  
    useEffect(() => {
      gsap.fromTo(".region-marker", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1, delay: 0.2 });
      gsap.to(".cloud-1", { x: "+=1500", duration: 180, repeat: -1, ease: "linear" });
      gsap.to(".cloud-2", { x: "+=1200", duration: 220, repeat: -1, ease: "linear" });
    }, []);
  
    const centerOnPoint = (clientX, clientY, scale = 2.2) => {
      const contRect = containerRef.current.getBoundingClientRect();
      const mapRect = mapRef.current.getBoundingClientRect();
      const px = clientX - mapRect.left;
      const py = clientY - mapRect.top;
      const cx = contRect.width / 2;
      const cy = contRect.height / 2;
      const tx = cx - scale * px;
      const ty = cy - scale * py;
  
      gsap.to(mapRef.current, { duration: 1.1, scale: scale, x: tx, y: ty, ease: "power3.inOut", overwrite: true });
      setZoom(scale);
    };
  
    const resetZoom = () => {
      gsap.to(mapRef.current, { duration: 1.1, scale: 1, x: 0, y: 0, ease: "power3.inOut", overwrite: true });
      setZoom(1);
      setSelected(null);
    };
  
    const handleRegionClick = (e, regionId) => {
      playSound('click');
      const marker = e.currentTarget;
  
      if (!isUnlocked(regionId)) {
        gsap.to(marker, { x: "-=6", duration: 0.1, ease: "power2.inOut", repeat: 3, yoyo: true, onComplete: () => gsap.set(marker, { x: 0 }) });
        return;
      }
      
      const mRect = marker.getBoundingClientRect();
      const centerX = mRect.left + mRect.width / 2;
      const centerY = mRect.top + mRect.height / 2;
  
      setSelected(regionId);
      centerOnPoint(centerX, centerY);
    };
  
    // **MODIFIED**: This function now OPENS THE QUIZ instead of completing the region.
    const handleChallengeClick = () => {
        if (!selected || isMoving || progress[selected].userProgress === 100) return;
        playSound('click');
        setIsQuizActive(true);
    };

    // **NEW**: This function contains the logic to run after a quiz is passed.
    const handleQuizSuccess = () => {
        if (!selected) return;
        const currentRegion = progress[selected];
    
        setProgress(prev => ({
            ...prev,
            [selected]: { ...currentRegion, userProgress: 100 }
        }));
        
        const keys = Object.keys(mapData);
        const currentIndex = keys.indexOf(selected);
        const nextRegionId = keys[currentIndex + 1];

        if (nextRegionId && currentRegion.pathId) {
            setIsMoving(true);
            gsap.to(playerRef.current, {
                motionPath: {
                    path: currentRegion.pathId,
                    align: currentRegion.pathId,
                    alignOrigin: [0.5, 1],
                    autoRotate: true,
                },
                duration: 2.5,
                ease: "power1.inOut",
                onComplete: () => {
                    setIsMoving(false);
                    // Automatically select the next region to show its info
                    if (isUnlocked(nextRegionId)) {
                       setSelected(nextRegionId);
                    }
                }
            });
        }
    };
  
    const selectedRegion = selected ? progress[selected] : null;
    const typedDescription = useTypewriter(selectedRegion?.description);
  
    return (
      <div className="min-h-screen bg-[#0e0404] text-white overflow-hidden font-pixel">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .font-pixel { font-family: 'Press Start 2P', cursive; }
          .pixelated { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }
          .text-shadow-pixel { text-shadow: 2px 2px 0 #000; }
          .panel-border { border: 24px solid transparent; border-image: url('/ui-border.svg') 8; background-clip: padding-box; background-color: #18181b; }
          .vignette { pointer-events: none; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%); }
          .scanlines { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(22,22,22,0.2) 70%, rgba(22,22,22,0.6) 100%); background-size: 100% 4px; animation: scanline 8s linear infinite; }
          @keyframes scanline { to { background-position-y: -100vh; } }
          .cloud { position: absolute; opacity: 0.15; filter: blur(10px); transform: translateZ(0); }
          .cloud-1 { top: 6%; left: -25%; width: 400px; height: 180px; background: #fff; border-radius: 50%; }
          .cloud-2 { top: 22%; left: -40%; width: 240px; height: 120px; background: #fff; border-radius: 50%; }
          .recommended .marker-bg { animation: pulse-recommended 2s infinite cubic-bezier(0.4, 0, 0.6, 1); }
          @keyframes pulse-recommended { 0%, 100% { transform: scale(1); box-shadow: 6px 6px 0 #000, 0 0 0 0 rgba(254, 240, 138, 0.4); } 50% { transform: scale(1.1); box-shadow: 8px 8px 0 #000, 0 0 20px 10px rgba(254, 240, 138, 0.1); } }
          .animated-water::after {
            content: ''; position: absolute; top: 65%; left: 20%; width: 30%; height: 30%;
            background: linear-gradient(-45deg, rgba(70,140,220,0.4) 25%, transparent 25%, transparent 50%, rgba(70,140,220,0.4) 50%, rgba(70,140,220,0.4) 75%, transparent 75%, transparent);
            background-size: 20px 20px;
            animation: move-water 2s linear infinite; opacity: 0.5;
          }
          @keyframes move-water { from { background-position: 0 0; } to { background-position: 20px 20px; } }
        `}</style>

        {isQuizActive && selectedRegion && (
            <QuizModal 
                quiz={quizData[selectedRegion.id]}
                onClose={() => setIsQuizActive(false)}
                onCorrectAnswer={handleQuizSuccess}
                playSound={playSound}
            />
        )}
  
        <header className="z-30 relative bg-black/70 p-4" style={{ borderBottom: "4px solid #18181b" }}>
          <div className="panel-border" style={{ borderWidth: '12px', padding: '0.5rem 1rem', backgroundColor: 'transparent' }}>
              <div className="flex justify-between items-center">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-xl hover:text-yellow-300 transition-colors">{isMuted ? '🔇' : '🔊'}</button>
                  <h1 className="text-xl md:text-2xl text-shadow-pixel font-bold text-center text-amber-300">EduQuest World Map</h1>
                  <div className="w-8"></div>
              </div>
          </div>
        </header>
  
        <main ref={containerRef} className="relative h-[calc(100vh-128px)]">
          <div className="cloud cloud-1" aria-hidden />
          <div className="cloud cloud-2" aria-hidden />
  
          <div ref={mapRef} style={{ transformOrigin: "0 0" }} className="absolute inset-0 will-change-transform">
            <div className="absolute inset-0 bg-cover bg-center pixelated animated-water" style={{ backgroundImage: `url(${backgroundImage})` }}/>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(110deg, transparent 45%, rgba(255,255,255,0.05) 50%, transparent 55%)", backgroundSize: '400% 400%', animation: 'shimmer 10s infinite linear' }} />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
              <path id="path1" d="M252 702 C 294 651, 392 585, 462 540" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="12 8" />
              <path id="path2" d="M462 540 C 574 612, 700 686, 784 672" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="12 8" />
              <path id="path3" d="M784 672 C 952 644, 980 432, 1148 396" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="12 8" />
              <path id="path4" d="M1148 396 C 1176 336, 1204 252, 1232 198" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="12 8" />
            </svg>
  
            {Object.entries(progress).map(([id, region]) => {
              const unlocked = isUnlocked(id);
              const recommended = isRecommended(id);
              return (
                <div
                  key={id}
                  className={`region-marker absolute flex flex-col items-center select-none cursor-pointer group ${recommended ? "recommended" : ""}`}
                  style={{ top: region.position.top, left: region.position.left, transform: "translate(-50%, -50%)" }}
                  onClick={(e) => handleRegionClick(e, id)}
                  onMouseEnter={() => playSound('hover')}
                  role="button" aria-label={region.name}
                >
                  <div className={`marker-bg relative w-14 h-14 border-4 border-black rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${unlocked ? "bg-red-800" : "bg-gray-800"}`} style={{ boxShadow: '6px 6px 0 #000' }}>
                    {unlocked ? <MiniSprite size={32} type={region.creatureType} /> : <LockIcon />}
                  </div>
                  <div className="label mt-3 text-xs bg-black/80 px-3 py-1 rounded text-shadow-pixel whitespace-nowrap transition-all duration-200 group-hover:text-yellow-300">
                    {unlocked ? region.name : "Locked"}
                  </div>
                </div>
              );
            })}
            
            <PlayerSprite ref={playerRef} />
          </div>
  
          <div className="vignette" />
          <div className="scanlines" />
  
          <aside className={`absolute right-0 top-0 h-full w-full max-w-sm panel-border p-6 transition-transform duration-500 ease-in-out ${selected ? "translate-x-0" : "translate-x-full"}`}>
            {selectedRegion ? (
              <>
                <button onClick={resetZoom} className="absolute top-4 right-4 text-3xl font-bold hover:text-red-500 transition-colors">×</button>
                <h2 className="text-2xl text-yellow-300 font-bold text-shadow-pixel">{selectedRegion.name}</h2>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span>Lv. {selectedRegion.recommendedLevel}</span>
                  <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                      <MiniSprite size={16} type={selectedRegion.creatureType} /> {selectedRegion.creatureType.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-4 leading-relaxed min-h-[96px]">{typedDescription}</p>
                
                <div className="mt-8">
                  {selectedRegion.userProgress === 100 ? (
                      <div className="text-center bg-black/50 border-4 border-black p-4 shadow-[4px_4px_0_#000]">
                          <div className="text-5xl">{selectedRegion.badgeIcon}</div>
                          <h3 className="mt-2 font-bold text-yellow-400 text-shadow-pixel">Region Mastered!</h3>
                      </div>
                  ) : (
                      <>
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Region Progress</span>
                              <span className="font-bold text-lg">{selectedRegion.userProgress}%</span>
                          </div>
                          <div className="w-full bg-black/50 border-4 border-black p-1 shadow-[4px_4px_0_#000]">
                              <div className="h-4 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all" style={{ width: `${selectedRegion.userProgress}%` }} />
                          </div>
                      </>
                  )}
                </div>

                <button 
                  onClick={handleChallengeClick} // **MODIFIED**: Now calls the quiz opener
                  disabled={selectedRegion.userProgress === 100 || isMoving}
                  className="mt-8 w-full bg-red-700 text-white border-4 border-black px-6 py-3 font-bold text-shadow-pixel shadow-[6px_6px_0_#000] hover:bg-red-600 active:bg-red-800 active:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 transition-all disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed">
                  {isMoving ? "Traveling..." : selectedRegion.userProgress === 100 ? "Completed" : "Challenge Region"}
                </button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <div className="text-6xl mb-4 opacity-50">✦</div>
                <h3 className="text-lg font-bold text-white">Select a Region</h3>
                <p className="text-sm mt-2">Click an unlocked marker to view details.</p>
              </div>
            )}
          </aside>
        </main>
      </div>
    );
}

