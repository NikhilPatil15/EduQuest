// WorldMapPixel.jsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Self-contained pixel-style world map.
 * - No external background image (uses inline SVG "pixel" tiles)
 * - Correct GSAP centering math so clicks zoom to the clicked region
 * - Parallax clouds, shimmer, subtle vignette and lighting
 * - Stylized "pokemon" sprites as small inline SVGs (replaceable)
 *
 * Drop-in replacement for your WorldMapPage component.
 */

// --- MAP DATA (positions are percentages) ---
const mapData = {
  verdant_valley: {
    id: "verdant_valley",
    name: "Verdant Valley",
    description: "A lush valley where new trainers begin their journey.",
    position: { top: "78%", left: "18%" },
    userProgress: 100,
    unlocks: "path_to_woods",
  },
  whispering_woods: {
    id: "whispering_woods",
    name: "Whispering Woods",
    description: "A dense forest filled with mysterious rustling.",
    position: { top: "60%", left: "33%" },
    userProgress: 80,
    unlocks: "path_to_desert",
  },
  crimson_desert: {
    id: "crimson_desert",
    name: "Crimson Desert",
    description: "A scorching wasteland that tests endurance.",
    position: { top: "75%", left: "56%" },
    userProgress: 0,
    unlocks: "path_to_citadel",
  },
  ironclad_citadel: {
    id: "ironclad_citadel",
    name: "Ironclad Citadel",
    description: "A fortress of knowledge and courage.",
    position: { top: "45%", left: "72%" },
    userProgress: 0,
    unlocks: "path_to_spire",
  },
  crystal_spire: {
    id: "crystal_spire",
    name: "Crystal Spire",
    description: "The pinnacle of wisdom. Legends are made here.",
    position: { top: "22%", left: "88%" },
    userProgress: 0,
    unlocks: null,
  },
};

const useUserProgress = () => {
  // simulate backend progress
  const completedRegions = ["verdant_valley"];
  const keys = Object.keys(mapData);
  const isUnlocked = (regionId) => {
    const i = keys.indexOf(regionId);
    if (i === 0) return true;
    const prev = keys[i - 1];
    return completedRegions.includes(prev);
  };
  const isRecommended = (regionId) =>
    isUnlocked(regionId) && mapData[regionId].userProgress < 100;
  return { completedRegions, isUnlocked, isRecommended };
};

/* ---------- tiny inline pokemon-ish SVG (replace with sprite img if you want) ---------- */
const MiniSprite = ({ size = 28, type = "leaf" }) => {
  // simple stylized badges to read as "pokemon" placeholders
  if (type === "leaf")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated">
        <rect width="24" height="24" rx="4" fill="#082f07" />
        <path d="M6 16c6-6 10-6 12-10c-6 2-8 6-12 10z" fill="#6ee7b7" />
      </svg>
    );
  if (type === "fire")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated">
        <rect width="24" height="24" rx="4" fill="#3a0b00" />
        <path d="M12 5c2 2 3 3 3 6c0 3-2 6-3 7c-1-1-3-4-3-7c0-3 1-4 3-6z" fill="#ffb300" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="pixelated">
      <rect width="24" height="24" rx="4" fill="#0b233a" />
      <circle cx="12" cy="12" r="5" fill="#a5f3fc" />
    </svg>
  );
};

/* ---------- PixelMapSVG: produces a tiled/pixel map as inline SVG ---------- */
const PixelMapSVG = ({ width = 1000, height = 600 }) => {
  // We'll render a simple "island" layout made of colored rect tiles to simulate pixel art.
  const tile = 8; // tile size in SVG units (smaller => more detail)
  const cols = Math.ceil(width / tile);
  const rows = Math.ceil(height / tile);

  // simple procedural pattern for terrain (deterministic)
  const getTerrainColor = (c, r) => {
    // place a main continent on left half, a desert patch, citadel island
    const cx = cols * 0.25;
    const cy = rows * 0.6;
    const dx = c - cx;
    const dy = r - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // big green-ish continent
    if (dist < 28 && c < cols * 0.45) {
      return r % 3 === 0 ? "#2f8b3a" : "#3fb04f";
    }
    // forest blur near center-left
    if (c > cols * 0.3 && c < cols * 0.45 && r < rows * 0.55 && (c + r) % 5 < 3) {
      return "#1f5b2a";
    }
    // desert band middle
    if (c > cols * 0.45 && c < cols * 0.7 && r > rows * 0.6) {
      return (c + r) % 4 === 0 ? "#d97706" : "#fca311";
    }
    // small citadel island right
    if (Math.hypot(c - Math.floor(cols * 0.78), r - Math.floor(rows * 0.28)) < 9) {
      return (c + r) % 2 === 0 ? "#44474a" : "#6b7280";
    }
    // sea
    if ((c + r) % 7 === 0) return "#0b3b66";
    return "#0f4b79";
  };

  const rects = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fill = getTerrainColor(c, r);
      rects.push(
        <rect
          key={`${c}-${r}`}
          x={c * tile}
          y={r * tile}
          width={tile}
          height={tile}
          fill={fill}
        />
      );
    }
  }

  // draw simple rivers/paths with bezier-ish shapes (paths styled later)
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* tiled pixel terrain */}
      <g>{rects}</g>

      {/* faint river / path strokes for depth */}
      <path d="M160 420 C 210 390, 280 350, 330 320" stroke="#c9a86a" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.35" />
      <path d="M330 320 C 410 360, 500 420, 620 420" stroke="#c9a86a" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.35" />
      <path d="M620 420 C 680 360, 740 290, 820 240" stroke="#c9a86a" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.35" />

      {/* small decorative crystals / citadel glints */}
      <g filter="url(#softGlow)" opacity="0.9">
        <ellipse cx="840" cy="120" rx="6" ry="14" fill="#9be7ff" transform="rotate(-20 840 120)" />
        <ellipse cx="850" cy="140" rx="4" ry="10" fill="#bcefff" transform="rotate(-30 850 140)" />
      </g>
    </svg>
  );
};

/* ---------- MAIN PAGE COMPONENT ---------- */
export default function WorldMapPixel() {
  const [selected, setSelected] = useState(null);
  const { completedRegions, isUnlocked, isRecommended } = useUserProgress();
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // entrance animation for markers
    gsap.fromTo(
      ".region-marker",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", stagger: 0.1 }
    );
    // clouds horizontal drift
    gsap.to(".cloud", { x: "+=1200", duration: 140, repeat: -1, ease: "linear" });
    // shimmer
    gsap.to(".shimmer", { opacity: 0.9, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  // zoom & center math:
  const centerOnPoint = (clientX, clientY, scale = 1.8) => {
    const container = containerRef.current;
    const mapEl = mapRef.current;
    if (!container || !mapEl) return;

    const contRect = container.getBoundingClientRect();
    const mapRect = mapEl.getBoundingClientRect();

    // px coordinates relative to map top-left (map visuals match container)
    const px = clientX - mapRect.left;
    const py = clientY - mapRect.top;

    // container center in px
    const cx = contRect.width / 2;
    const cy = contRect.height / 2;

    // with transform origin (0,0), after scale: s*px + Tx = cx => Tx = cx - s*px
    const tx = cx - scale * px;
    const ty = cy - scale * py;

    // animate transform (we keep transformOrigin top-left)
    gsap.to(mapEl, {
      duration: 0.9,
      scale: scale,
      x: tx,
      y: ty,
      ease: "power3.inOut",
      overwrite: true,
    });

    setZoom(scale);
  };

  const resetZoom = () => {
    const mapEl = mapRef.current;
    if (!mapEl) return;
    gsap.to(mapEl, { duration: 0.9, scale: 1, x: 0, y: 0, ease: "power3.inOut", overwrite: true });
    setZoom(1);
    setSelected(null);
  };

  const handleRegionClick = (e, regionId) => {
    // Get the marker center in client coordinates, then center camera
    const marker = e.currentTarget;
    const mRect = marker.getBoundingClientRect();
    const centerX = mRect.left + mRect.width / 2;
    const centerY = mRect.top + mRect.height / 2;
    setSelected(regionId);
    centerOnPoint(centerX, centerY, 1.9);
  };

  // small UI helpers
  const selectedRegion = selected ? mapData[selected] : null;
  const completed = completedRegions || [];

  return (
    <div className="min-h-screen bg-[#0e0404] text-white overflow-hidden font-pixel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .pixelated { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
        .text-shadow-pixel { text-shadow: 2px 2px 0 #000; }
        .region-marker .label { font-size: 10px; padding: 4px 8px; border-radius: 4px; }
        /* recommended star */
        .recommended::after { content: '★'; position: absolute; top: -18px; left: 50%; transform: translateX(-50%); color: #fef08a; text-shadow: 0 0 8px #f59e0b; font-size: 16px; animation: star 1s infinite linear; }
        @keyframes star { 0% { transform: translate(-50%,-2px);} 50% { transform: translate(-50%,-8px);} 100% { transform: translate(-50%,-2px);} }
        /* small vignette */
        .vignette { pointer-events: none; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%); mix-blend-mode: multiply; }
        .panel { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        /* clouds */
        .cloud { position: absolute; top: 6%; left: -25%; width: 260px; height: 120px; background: rgba(255,255,255,0.08); filter: blur(8px); border-radius: 50%; transform: translateZ(0); }
        .cloud.small { width: 140px; height: 70px; top: 22%; left: -40%; opacity: 0.9; }
      `}</style>

      {/* header */}
      <header className="z-30 relative bg-black/60 border-b-4 border-red-700 p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl text-shadow-pixel font-bold">EduQuest — World Map</h1>
        </div>
      </header>

      {/* map container */}
      <main ref={containerRef} className="relative h-[calc(100vh-84px)]">
        {/* floating clouds */}
        <div className="cloud" aria-hidden />
        <div className="cloud small" style={{ top: "18%", left: "-40%" }} aria-hidden />

        {/* map viewport that we transform (scale + translate) */}
        <div
          ref={mapRef}
          style={{ transformOrigin: "0 0" }}
          className="absolute inset-0 transition-transform duration-200 will-change-transform"
        >
          {/* pixel SVG background */}
          <div className="absolute inset-0">
            <PixelMapSVG width={1400} height={900} />
          </div>

          {/* overlay: light shimmer */}
          <div className="absolute inset-0 pointer-events-none shimmer" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.02))" }} />

          {/* progress paths (styled) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path d="M160 420 C 210 390, 280 350, 330 320" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
            <path d="M330 320 C 410 360, 500 420, 620 420" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
            <path d="M620 420 C 680 360, 740 290, 820 240" stroke="rgba(255,235,153,0.7)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
          </svg>

          {/* region markers (absolute in percent using CSS style) */}
          {Object.entries(mapData).map(([id, region]) => {
            const unlocked = isUnlocked(id);
            const recommended = isRecommended(id);
            const top = region.position.top;
            const left = region.position.left;
            return (
              <div
                key={id}
                className={`region-marker absolute flex flex-col items-center select-none`}
                style={{
                  top,
                  left,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  pointerEvents: unlocked ? "auto" : "auto", // show locked too
                }}
                onClick={(e) => handleRegionClick(e, id)}
                role="button"
                aria-label={region.name}
              >
                <div
                  className={`relative w-12 h-12 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] ${unlocked ? "bg-red-800" : "bg-gray-700"}`}
                  style={{ boxShadow: "4px 4px 0 #000" }}
                >
                  {/* sprite or locked question */}
                  {unlocked ? (
                    <div style={{ width: 36, height: 36 }}>
                      {/* choose sprite by id for variety */}
                      <MiniSprite
                        size={36}
                        type={id === "verdant_valley" ? "leaf" : id === "crimson_desert" ? "fire" : id === "crystal_spire" ? "ice" : "leaf"}
                      />
                    </div>
                  ) : (
                    <span className="text-xl">?</span>
                  )}
                </div>

                <div className="label mt-2 text-xs bg-black/70 px-2 py-1 rounded text-shadow-pixel" style={{ whiteSpace: "nowrap", marginTop: 8 }}>
                  {region.name}
                </div>

                {recommended && <div className="recommended" />}
              </div>
            );
          })}
        </div>

        {/* vignette and lighting overlay */}
        <div className="vignette" />

        {/* right-side panel */}
        <aside className={`absolute right-0 top-0 h-full max-w-md w-full md:w-[360px] panel bg-black/70 border-l-4 border-black p-6 transition-transform ${selected ? "translate-x-0" : "translate-x-full"}`}>
          {selectedRegion ? (
            <>
              <button onClick={resetZoom} className="absolute top-4 right-4 text-3xl font-bold">×</button>
              <h2 className="text-2xl text-yellow-300 font-bold">{selectedRegion.name}</h2>
              <p className="text-sm text-gray-300 mt-2">{selectedRegion.description}</p>

              {/* progress bar */}
              <div className="mt-6">
                <div className="w-full bg-black/50 border-4 border-black p-1 shadow-[4px_4px_0_#000]">
                  <div className="h-4 bg-gradient-to-r from-yellow-500 to-orange-500 transition-all" style={{ width: `${selectedRegion.userProgress}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-bold">{selectedRegion.userProgress}%</span>
                  <span className="text-sm text-gray-400">Your Progress</span>
                </div>
              </div>

              <button className="mt-6 w-full bg-[#b30000] text-white border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0_#000] hover:bg-[#cc0000]">Challenge Region</button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-2">✦</div>
              <h3 className="text-lg font-bold">Select a region</h3>
              <p className="text-sm text-gray-400 mt-2">Click any unlocked marker to zoom in and see details.</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
