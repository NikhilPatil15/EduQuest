import React from 'react';
import PixelButton from './PixelButton';

const WorldMapTab = ({ trainerData }) => {
  const locations = [
    { name: 'MATH FOREST', level: '1-5', type: 'NUMBERS', completed: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
    { name: 'SCIENCE CAVE', level: '6-10', type: 'EXPERIMENTS', completed: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/74.gif' },
    { name: 'HISTORY MOUNTAIN', level: '11-15', type: 'EVENTS', completed: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/95.gif' },
    { name: 'CODING OCEAN', level: '16-20', type: 'PROGRAMMING', completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' },
    { name: 'LANGUAGE DESERT', level: '21-25', type: 'GRAMMAR', completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/50.gif' },
    { name: 'ART GARDEN', level: '26-30', type: 'CREATIVITY', completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/43.gif' }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">🗺️ LEARNING WORLD MAP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {locations.map((location, index) => (
          <div key={index} className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-5 rounded-lg text-center shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-2 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-3 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] floating-element">
              <img 
                src={location.gif}
                alt={location.name}
                className="w-16 h-16 pixelated-rendering pokemon-gif"
              />
            </div>
            
            <h3 className="font-bold text-xl mb-2 text-shadow-pixel tracking-wider">{location.name}</h3>
            <div className="flex justify-center space-x-2 mb-3">
              <span className="text-sm bg-[#0066cc] px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider">
                {location.type}
              </span>
              <span className="text-sm bg-[#ffcc00] px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider text-black">
                LV.{location.level}
              </span>
            </div>
            
            <div className={`text-sm font-bold px-4 py-2 border-2 border-black shadow-[2px_2px_0_#000] tracking-wider mb-3 ${
              location.completed ? 'bg-[#00cc00] text-black' : 'bg-[#cc0000] text-white'
            }`}>
              {location.completed ? '✅ COMPLETED' : '🔒 LOCKED'}
            </div>
            
            <PixelButton 
              variant={location.completed ? 'success' : 'secondary'}
              className="w-full py-2 text-sm tracking-wider"
              disabled={!location.completed}
            >
              {location.completed ? 'REVISIT AREA' : 'COMPLETE PREVIOUS'}
            </PixelButton>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] p-4 rounded-lg">
          <h3 className="font-bold text-center mb-3 text-[#ffcc00] tracking-wider">CURRENT QUEST</h3>
          <div className="text-center">
            <div className="text-lg font-bold mb-2">CODING OCEAN</div>
            <div className="text-sm text-gray-300 mb-3">Learn programming basics and algorithms</div>
            <div className="w-full bg-[#300000] border-2 border-black h-4 mb-2 shadow-[2px_2px_0_#000]">
              <div className="progress-bar bg-gradient-to-r from-[#0066cc] to-[#0088ff] h-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-sm font-bold">65% COMPLETE</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#00cc00]/20 to-[#00aa00]/20 border-2 border-[#00cc00] p-4 rounded-lg">
          <h3 className="font-bold text-center mb-3 text-[#00cc00] tracking-wider">NEXT UNLOCK</h3>
          <div className="text-center">
            <div className="text-lg font-bold mb-2">LANGUAGE DESERT</div>
            <div className="text-sm text-gray-300 mb-3">Master grammar and vocabulary</div>
            <div className="flex justify-center space-x-2">
              <span className="text-sm bg-[#ffcc00] px-2 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider text-black">
                LEVEL 21 REQUIRED
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorldMapTab;