import React from 'react';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-black/80 via-red-900/20 to-black/80 backdrop-blur-md border-b-4 border-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 border-2 border-black rotate-45 shadow-[3px_3px_0_#000] relative">
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-orange-400 rotate-45"></div>
          </div>
          <span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">EduQuest</span>
        </div>

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
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 p-3 bg-red-900/30 border-2 border-red-600/50 hover:bg-red-900/50 transition-all duration-300">
          <div className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
          <div className="w-6 h-0.5 bg-white transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
          <div className="w-6 h-0.5 bg-white mt-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
        </button>
      </div>
      
      <div className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-black/95 to-red-900/20 backdrop-blur-md border-b-4 border-red-600 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-6 py-8">
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">About</a>
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">Features</a>
          <a href="#team" onClick={() => setIsMenuOpen(false)} className="text-xl px-6 py-3 text-white hover:text-red-300 transition-all duration-300 border-2 border-transparent hover:border-red-500/50 hover:bg-red-900/20">Team</a>
        </nav>
      </div>
    </header>
  );
}
