import React from 'react';
import PixelButton from './PixelButton';

const Header = ({ navigate, trainerData }) => (
  <header className=" top-0  z-40 bg-gradient-to-r from-black/80 via-red-900/20 to-black/80 backdrop-blur-md border-b-4 border-[#ffcc00] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <PixelButton onClick={() => navigate('/')} className="text-sm py-2">
          ◀️ HOME
        </PixelButton>
        <span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">
          EDUQUEST TRAINER
        </span>
      </div>

      {trainerData && <TrainerProfile trainerData={trainerData} />}
    </div>
  </header>
);

const TrainerProfile = ({ trainerData }) => {
  // Animated trainer sprites from Pokémon games
  const getTrainerGif = (level, badges) => {
    const trainers = {
      beginner: '/tranier.png', // Beginner Trainer
      ace: 'tranier.png',     // Ace Trainer
      veteran: 'tranier.png', // Veteran
      champion: 'tranier.png' // Champion
    };

    if (level >= 25 || badges >= 8) return trainers.champion;
    if (level >= 20 || badges >= 6) return trainers.veteran;
    if (level >= 15 || badges >= 4) return trainers.ace;
    return trainers.beginner;
  };

  // Get border color based on trainer level
  const getBorderColor = (level) => {
    if (level >= 25) return 'border-[#ffd700]'; // Gold
    if (level >= 20) return 'border-[#c0c0c0]'; // Silver
    if (level >= 15) return 'border-[#cd7f32]'; // Bronze
    return 'border-[#ffcc00]'; // Default yellow
  };

  // Get background glow based on streak
  const getStreakGlow = (streak) => {
    if (streak >= 7) return 'shadow-[0_0_20px_rgba(255,100,0,0.7)]';
    if (streak >= 3) return 'shadow-[0_0_15px_rgba(255,200,0,0.5)]';
    return '';
  };

  return (
    <div className={`trainer-profile flex items-center space-x-4 bg-[#400000] border-4 ${getBorderColor(trainerData.level)} p-4 rounded-lg shadow-[6px_6px_0_#000] floating-element ${getStreakGlow(trainerData.streak)}`}>
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-[#ffcc00] to-[#ffaa00] border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000] animate-pulse">
          <img 
            src={getTrainerGif(trainerData.level, trainerData.badges)}
            alt="Trainer"
            className="w-14 h-14 pixelated-rendering transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        {/* Level badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0_#000]">
          <span className="text-xs font-bold text-white">{trainerData.level}</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center space-x-3 mb-2">
          <span className="font-bold text-[#ffcc00] text-shadow-pixel text-lg">TRAINER</span>
          <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            {trainerData.name}
          </span>
        </div>
        
        {/* XP Progress */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-300 font-bold">XP</span>
          <div className="flex-1 bg-[#300000] border-2 border-black h-3 shadow-[2px_2px_0_#000]">
            <div 
              className="progress-bar bg-gradient-to-r from-[#00cc00] to-[#00ff00] h-full pixelated-rendering"
              style={{ width: `${(trainerData.xp / trainerData.xpToNextLevel) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-[#ffcc00] font-bold">
            {Math.round((trainerData.xp / trainerData.xpToNextLevel) * 100)}%
          </span>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center space-x-2 text-xs font-bold tracking-wider">
          <span className="flex items-center bg-gradient-to-r from-[#cc0000] to-[#ff0000] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[#ffcc00] mr-1">★</span>
            {trainerData.badges}
          </span>
          <span className="flex items-center bg-gradient-to-r from-[#0066cc] to-[#0088ff] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-white mr-1">🔥</span>
            {trainerData.streak}
          </span>
          <span className="flex items-center bg-gradient-to-r from-[#ffcc00] to-[#ffaa00] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[#cc0000] mr-1">$</span>
            {trainerData.coins}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;