import React from 'react';

export default function FeaturesSection() {
  return (
    <section id="features" className="reveal py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-10">Core Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Interactive Homepage */}
        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#ff0000] hover:-translate-y-2 hover:border-red-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 via-red-600/0 to-orange-500/0 group-hover:from-red-900/20 group-hover:via-red-600/10 group-hover:to-orange-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ff4d4d]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff8844]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-red-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">🎮</span>
            </div>
            <div className="text-xs bg-red-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000]">
              NEW!
            </div>
          </div>
          <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Interactive Homepage</h3>
          <p className="text-red-100 group-hover:text-red-50 transition-colors duration-300">Dynamic hero with FireRed vibes and GSAP transitions.</p>
        </div>

        {/* Trainer Dashboard */}
        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#00ff00] hover:-translate-y-2 hover:border-green-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/0 via-green-600/0 to-emerald-500/0 group-hover:from-green-900/20 group-hover:via-green-600/10 group-hover:to-emerald-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#4dff4d]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#44ff88]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(77,255,77,0.1) 2px, rgba(77,255,77,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-green-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div className="text-xs bg-green-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000]">
              PRO
            </div>
          </div>
          <h3 className="font-bold text-xl text-green-200 mb-2 group-hover:text-green-100 transition-colors">Trainer Dashboard</h3>
          <p className="text-green-100 group-hover:text-green-50 transition-colors duration-300">Track XP, badges, and captured knowledge-creatures.</p>
        </div>

        {/* Leaderboards */}
        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#ffff00] hover:-translate-y-2 hover:border-yellow-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/0 via-yellow-600/0 to-amber-500/0 group-hover:from-yellow-900/20 group-hover:via-yellow-600/10 group-hover:to-amber-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ffff4d]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ffcc44]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,77,0.1) 2px, rgba(255,255,77,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-yellow-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">🏆</span>
            </div>
            <div className="text-xs bg-yellow-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000]">
              RANK
            </div>
          </div>
          <h3 className="font-bold text-xl text-yellow-200 mb-2 group-hover:text-yellow-100 transition-colors">Leaderboards</h3>
          <p className="text-yellow-100 group-hover:text-yellow-50 transition-colors duration-300">Compete and climb ranks with friends.</p>
        </div>

        {/* Pokémon Style Duels - NEW CARD */}
        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#ff6b35] hover:-translate-y-2 hover:border-orange-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 via-orange-600/0 to-red-500/0 group-hover:from-orange-900/20 group-hover:via-orange-600/10 group-hover:to-red-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ff8844]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff4d4d]"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 shadow-[0_0_4px_#ffaa00]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,107,53,0.1) 2px, rgba(255,107,53,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-orange-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div className="text-xs bg-orange-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000] animate-pulse">
              BATTLE!
            </div>
          </div>
          <h3 className="font-bold text-xl text-orange-200 mb-2 group-hover:text-orange-100 transition-colors">Pokémon Style Duels</h3>
          <p className="text-orange-100 group-hover:text-orange-50 transition-colors duration-300">Real-time knowledge battles with friends using turn-based combat system.</p>
        </div>

        {/* Additional feature cards to maintain grid layout */}
        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#9b59b6] hover:-translate-y-2 hover:border-purple-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 via-purple-600/0 to-pink-500/0 group-hover:from-purple-900/20 group-hover:via-purple-600/10 group-hover:to-pink-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#bb77ff]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff77aa]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(155,89,182,0.1) 2px, rgba(155,89,182,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <div className="text-xs bg-purple-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000]">
              QUEST
            </div>
          </div>
          <h3 className="font-bold text-xl text-purple-200 mb-2 group-hover:text-purple-100 transition-colors">Daily Quests</h3>
          <p className="text-purple-100 group-hover:text-purple-50 transition-colors duration-300">Complete daily challenges to earn bonus XP and rare items.</p>
        </div>

        <div className="feature-card group relative bg-[#1c1c1c]/80 border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#3498db] hover:-translate-y-2 hover:border-blue-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 via-blue-600/0 to-cyan-500/0 group-hover:from-blue-900/20 group-hover:via-blue-600/10 group-hover:to-cyan-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#4488ff]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#44ccff]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(52,152,219,0.1) 2px, rgba(52,152,219,0.1) 4px)'
          }}></div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-600 border-2 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
            <div className="text-xs bg-blue-600 px-2 py-1 border border-black shadow-[2px_2px_0_#000]">
              SYNC
            </div>
          </div>
          <h3 className="font-bold text-xl text-blue-200 mb-2 group-hover:text-blue-100 transition-colors">Cloud Sync</h3>
          <p className="text-blue-100 group-hover:text-blue-50 transition-colors duration-300">Your progress saved across all devices automatically.</p>
        </div>
      </div>
    </section>
  );
}