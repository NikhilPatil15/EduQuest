import React from 'react';
import PixelButton from './PixelButton';

const LearnTab = ({ trainerData }) => {
  const modules = [
    { 
      name: 'BASIC ARITHMETIC', 
      difficulty: 'BEGINNER', 
      xp: 100, 
      duration: '15 MIN',
      completed: true,
      type: 'MATH',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif'
    },
    { 
      name: 'INTRODUCTION TO CODING', 
      difficulty: 'BEGINNER', 
      xp: 150, 
      duration: '20 MIN',
      completed: true,
      type: 'PROGRAMMING',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif'
    },
    { 
      name: 'SCIENCE EXPERIMENTS', 
      difficulty: 'INTERMEDIATE', 
      xp: 200, 
      duration: '25 MIN',
      completed: false,
      type: 'SCIENCE',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif'
    },
    { 
      name: 'WORLD HISTORY', 
      difficulty: 'INTERMEDIATE', 
      xp: 180, 
      duration: '30 MIN',
      completed: false,
      type: 'HISTORY',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif'
    },
    { 
      name: 'ADVANCED MATH', 
      difficulty: 'ADVANCED', 
      xp: 300, 
      duration: '45 MIN',
      completed: false,
      type: 'MATH',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif'
    },
    { 
      name: 'CREATIVE WRITING', 
      difficulty: 'INTERMEDIATE', 
      xp: 220, 
      duration: '35 MIN',
      completed: false,
      type: 'LANGUAGE',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif'
    }
  ];

  const difficultyColors = {
    BEGINNER: 'bg-[#00cc00]',
    INTERMEDIATE: 'bg-[#ffcc00] text-black',
    ADVANCED: 'bg-[#cc0000]'
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">📚 LEARNING MODULES</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {modules.map((module, index) => (
          <div key={index} className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-4 rounded-lg shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                <img 
                  src={module.gif}
                  alt={module.name}
                  className="w-10 h-10 pixelated-rendering pokemon-gif"
                />
              </div>
              <span className={`text-xs font-bold px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000] tracking-wider ${difficultyColors[module.difficulty]}`}>
                {module.difficulty}
              </span>
            </div>
            
            <h3 className="font-bold text-lg mb-2 text-shadow-pixel tracking-wider">{module.name}</h3>
            <p className="text-sm text-gray-300 mb-3 tracking-wider">{module.type}</p>
            
            <div className="flex justify-between items-center mb-4 text-sm font-bold">
              <div className="flex items-center space-x-1">
                <span className="text-[#ffcc00]">⭐</span>
                <span>{module.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[#00cc00]">⏱️</span>
                <span>{module.duration}</span>
              </div>
            </div>
            
            <PixelButton 
              variant={module.completed ? 'success' : 'primary'}
              className="w-full py-2 text-sm tracking-wider"
            >
              {module.completed ? '✅ COMPLETED' : 'START LEARNING'}
            </PixelButton>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#ffcc00]">{modules.filter(m => m.completed).length}</div>
          <div className="text-sm tracking-wider">MODULES COMPLETED</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#00cc00]">{modules.reduce((acc, m) => acc + (m.completed ? m.xp : 0), 0)}</div>
          <div className="text-sm tracking-wider">TOTAL XP EARNED</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#0088ff]">{modules.length - modules.filter(m => m.completed).length}</div>
          <div className="text-sm tracking-wider">MODULES REMAINING</div>
        </div>
      </div>
    </>
  );
};

export default LearnTab;