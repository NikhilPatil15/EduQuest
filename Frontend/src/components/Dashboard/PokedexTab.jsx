import React from 'react';
import PixelButton from './PixelButton';

const PokedexTab = ({ trainerData }) => {
  const pokemonData = [
    { name: 'PIKACHU', type: 'ELECTRIC', level: 15, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
    { name: 'CHARMANDER', type: 'FIRE', level: 12, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
    { name: 'BULBASAUR', type: 'GRASS', level: 10, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif' },
    { name: 'SQUIRTLE', type: 'WATER', level: 8, captured: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' },
    { name: 'GEODUDE', type: 'ROCK', level: 5, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/74.gif' },
    { name: 'ABRA', type: 'PSYCHIC', level: 3, captured: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/63.gif' },
    { name: 'EEVEE', type: 'NORMAL', level: 6, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif' },
    { name: 'GASTLY', type: 'GHOST', level: 4, captured: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/92.gif' },
    { name: 'MACHOP', type: 'FIGHTING', level: 7, captured: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/66.gif' }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">📱 POKéDEX COLLECTION</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonData.map((pkmn, index) => (
          <div
            key={index}
            className={`dashboard-card group relative border-4 border-black p-3 rounded-lg text-center transition-all duration-300 hover:-translate-y-2 pixelated-rendering ${
              pkmn.captured 
                ? 'bg-gradient-to-br from-[#00aa00]/30 to-[#008800]/30 hover:shadow-[6px_6px_0_#00aa00]' 
                : 'bg-gradient-to-br from-[#600000] to-[#400000] opacity-60 hover:opacity-80'
            } shadow-[4px_4px_0_#000]`}
          >
            <div className="w-16 h-16 mx-auto mb-2 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000] floating-element">
              <img 
                src={pkmn.gif}
                alt={pkmn.name}
                className="w-14 h-14 pixelated-rendering pokemon-gif"
              />
            </div>
            
            <h3 className="font-bold text-sm mb-2 text-shadow-pixel tracking-wider">{pkmn.name}</h3>
            
            <div className="flex justify-center space-x-1 mb-2">
              <span className="text-xs bg-[#0066cc] px-2 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider">
                {pkmn.type}
              </span>
              <span className="text-xs bg-[#ffcc00] px-2 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider text-black">
                LV.{pkmn.level}
              </span>
            </div>
            
            <div className={`text-xs font-bold px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000] tracking-wider ${
              pkmn.captured ? 'bg-[#00cc00] text-black' : 'bg-[#cc0000] text-white'
            }`}>
              {pkmn.captured ? '✅ CAPTURED' : '❌ NOT CAUGHT'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] rounded-lg">
        <div className="text-center font-bold text-lg text-[#ffcc00] tracking-wider">
          POKéDEX COMPLETION: {pokemonData.filter(p => p.captured).length}/{pokemonData.length}
        </div>
        <div className="w-full bg-[#300000] border-2 border-black h-4 mt-2 shadow-[2px_2px_0_#000]">
          <div 
            className="progress-bar bg-gradient-to-r from-[#ffcc00] to-[#ffaa00] h-full"
            style={{ width: `${(pokemonData.filter(p => p.captured).length / pokemonData.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default PokedexTab;