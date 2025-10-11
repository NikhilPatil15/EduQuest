import React from 'react';
import BattleGround from './BattleGround';

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center">
      <div className="container mx-auto px-4 flex flex-col items-center text-center pointer-events-auto">
        <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-shadow-pixel bg-red-800/20 px-4 py-2 rounded">
          EduQuest
        </h1>
        <BattleGround />
        <div className="mt-14 grid grid-cols-3 gap-6">
          <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-white relative"></div>
            </div>
          </div>
          <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3"></div>
          </div>
          <div className="float-icon bg-black/40 border-4 border-black px-4 py-3 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}