import React from 'react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#8b0000] via-[#600000] to-[#400000] flex items-center justify-center pixelated-rendering">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_#000]">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
          alt="Loading"
          className="w-16 h-16 pixelated-rendering"
        />
      </div>
      <p className="text-white font-pixel text-shadow-pixel text-lg">LOADING YOUR ADVENTURE...</p>
      <div className="mt-4 w-48 h-4 bg-gray-800 border-2 border-black mx-auto shadow-[3px_3px_0_#000]">
        <div className="h-full bg-red-600 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default LoadingScreen;