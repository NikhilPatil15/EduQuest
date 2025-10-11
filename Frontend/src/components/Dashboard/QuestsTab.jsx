import React from 'react';
import PixelButton from './PixelButton';

const QuestsTab = ({ trainerData }) => {
  const questsData = [
    { name: 'MATH PRACTICE', reward: '50 COINS', progress: 3, total: 5, completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
    { name: 'SCIENCE QUIZ', reward: '75 COINS', progress: 0, total: 3, completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
    { name: 'CODING CHALLENGE', reward: '100 COINS', progress: 5, total: 5, completed: true, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' },
    { name: '7-DAY STREAK', reward: '200 COINS', progress: 6, total: 7, completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/38.gif' },
    { name: 'CAPTURE POKéMON', reward: '1 RARE CANDY', progress: 0, total: 1, completed: false, gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">🎯 DAILY QUESTS</h2>
      
      <div className="space-y-4">
        {questsData.map((quest, index) => (
          <div key={index} className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-5 rounded-lg shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                  <img 
                    src={quest.gif}
                    alt={quest.name}
                    className="w-10 h-10 pixelated-rendering pokemon-gif"
                  />
                </div>
                <h3 className="font-bold text-xl text-shadow-pixel tracking-wider">{quest.name}</h3>
              </div>
              <span className="text-sm bg-[#ffcc00] px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider text-black">
                REWARD: {quest.reward}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2 font-bold tracking-wider">
                <span>PROGRESS</span>
                <span>{quest.progress}/{quest.total}</span>
              </div>
              <div className="w-full bg-[#300000] border-2 border-black h-4 shadow-[2px_2px_0_#000]">
                <div 
                  className={`progress-bar h-full transition-all duration-500 pixelated-rendering ${
                    quest.completed ? 'bg-gradient-to-r from-[#00cc00] to-[#00ff00]' : 'bg-gradient-to-r from-[#0066cc] to-[#0088ff]'
                  }`}
                  style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <PixelButton 
              variant={quest.completed ? 'success' : 'primary'}
              className="w-full py-3 text-lg tracking-wider"
              disabled={quest.completed}
            >
              {quest.completed ? '✅ CLAIMED' : '🎯 START QUEST'}
            </PixelButton>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] rounded-lg">
        <div className="text-center font-bold text-lg text-[#ffcc00] tracking-wider mb-2">
          DAILY QUEST PROGRESS
        </div>
        <div className="flex justify-between text-sm font-bold mb-2">
          <span>COMPLETED: {questsData.filter(q => q.completed).length}/{questsData.length}</span>
          <span>REWARDS: {questsData.filter(q => q.completed).length * 50} COINS</span>
        </div>
      </div>
    </>
  );
};

export default QuestsTab;