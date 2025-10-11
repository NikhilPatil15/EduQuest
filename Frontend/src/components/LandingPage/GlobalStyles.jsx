import React from 'react';

export default function GlobalStyles() {
  return (
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
      .dither-overlay {
        background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%);
        background-size: 4px 4px;
        background-position: 0 0, 2px 2px;
      }
      .moving-fire {
        position: absolute;
        width: 40px;
        height: 40px;
        image-rendering: pixelated;
        animation: moveFire 8s linear infinite;
      }
      .moving-fire:nth-child(2) { animation-delay: -2s; animation-duration: 10s; }
      .moving-fire:nth-child(3) { animation-delay: -4s; animation-duration: 12s; }
      .moving-fire:nth-child(4) { animation-delay: -6s; animation-duration: 9s; }
      .moving-fire:nth-child(5) { animation-delay: -8s; animation-duration: 11s; }
      @keyframes moveFire {
        0% { transform: translateX(-50px); }
        100% { transform: translateX(calc(100vw + 50px)); }
      }
    `}</style>
  );
}
