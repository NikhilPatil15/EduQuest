import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="reveal py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-10">A Pokémon-Inspired Gamified Learning Adventure</h2>
      
      {/* First Row */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="about-card group relative bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 hover:border-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 via-red-600/0 to-orange-500/0 group-hover:from-red-900/20 group-hover:via-red-600/10 group-hover:to-orange-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ff4d4d]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff8844]"></div>
          <div className="absolute top-1/2 right-4 w-1 h-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 shadow-[0_0_4px_#ffaa00]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-red-600 border-2 border-black shadow-[4px_4px_0_#000] mb-3 flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Immersive Worlds</h3>
          </div>
          <p className="text-red-100 relative z-10 group-hover:text-red-50 transition-colors duration-300">
            Ambient parallax worlds, pixel-red glows, and smooth motion welcome learners into an adventure.
          </p>
        </div>
        
        <div className="about-card group relative bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 hover:border-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 via-red-600/0 to-red-500/0 group-hover:from-orange-900/20 group-hover:via-red-600/10 group-hover:to-red-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-3 left-2 w-2 h-2 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ff8844]"></div>
          <div className="absolute bottom-2 right-3 w-1.5 h-1.5 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff4d4d]"></div>
          <div className="absolute top-1/3 left-4 w-1 h-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 shadow-[0_0_4px_#ffaa00]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-orange-600 border-2 border-black shadow-[4px_4px_0_#000] mb-3 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Evolve Your Skills</h3>
          </div>
          <p className="text-red-100 relative z-10 group-hover:text-red-50 transition-colors duration-300">
            Capture knowledge, evolve skills, and challenge friends with quizzes and leaderboards.
          </p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="about-card group relative bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 hover:border-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/0 via-orange-600/0 to-red-500/0 group-hover:from-yellow-900/20 group-hover:via-orange-600/10 group-hover:to-red-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#ffaa00]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff4d4d]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-yellow-600 border-2 border-black shadow-[4px_4px_0_#000] mb-3 flex items-center justify-center">
              <span className="text-2xl">⚔️</span>
            </div>
            <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Battle Mode</h3>
          </div>
          <p className="text-red-100 relative z-10 group-hover:text-red-50 transition-colors duration-300">
            Challenge other trainers in real-time knowledge battles and climb the rankings.
          </p>
        </div>

        <div className="about-card group relative bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 hover:border-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 via-purple-600/0 to-pink-500/0 group-hover:from-red-900/20 group-hover:via-purple-600/10 group-hover:to-pink-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-3 left-2 w-2 h-2 bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#dd77ff]"></div>
          <div className="absolute bottom-2 right-3 w-1.5 h-1.5 bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#ff77aa]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-purple-600 border-2 border-black shadow-[4px_4px_0_#000] mb-3 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Earn Badges</h3>
          </div>
          <p className="text-red-100 relative z-10 group-hover:text-red-50 transition-colors duration-300">
            Collect achievement badges as you master new subjects and complete challenging quests.
          </p>
        </div>

        <div className="about-card group relative bg-black/40 backdrop-blur-sm border-4 border-black p-6 shadow-[8px_8px_0_#000] transition-all duration-300 hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 hover:border-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/0 via-emerald-600/0 to-teal-500/0 group-hover:from-green-900/20 group-hover:via-emerald-600/10 group-hover:to-teal-500/5 transition-all duration-500 -z-10"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#44ff88]"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_6px_#44ddaa]"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,77,77,0.1) 2px, rgba(255,77,77,0.1) 4px)'
          }}></div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-green-600 border-2 border-black shadow-[4px_4px_0_#000] mb-3 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-bold text-xl text-red-200 mb-2 group-hover:text-red-100 transition-colors">Track Progress</h3>
          </div>
          <p className="text-red-100 relative z-10 group-hover:text-red-50 transition-colors duration-300">
            Monitor your learning journey with detailed stats, XP tracking, and skill trees.
          </p>
        </div>
      </div>

     
    </section>
  );
}

export { AboutSection };