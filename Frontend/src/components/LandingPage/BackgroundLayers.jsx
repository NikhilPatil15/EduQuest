
import React from 'react';

export default function BackgroundLayers() {
  return (
    <>
      <div aria-hidden data-parallax="-0.4" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
      <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
      <div aria-hidden className="pixel-grid absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="scanlines absolute inset-0 -z-10 pointer-events-none"></div>
      <div aria-hidden data-parallax="-0.2" className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(80)].map((_, i) => (
          <span key={i} className="pixel-particle absolute w-1 h-1 bg-red-400/80" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, boxShadow: '0 0 8px #ff4d4d' }}></span>
        ))}
      </div>
    </>
  );
}