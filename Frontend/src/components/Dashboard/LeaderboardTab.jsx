import React from 'react';

const LeaderboardTab = ({ trainerData }) => {
  const leaderboardData = [
    { rank: 1, name: 'ASH KETCHUM', level: 25, xp: 15420, badge: '🏆', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png' },
    { rank: 2, name: 'MISTY WATER', level: 23, xp: 14890, badge: '🥈', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png' },
    { rank: 3, name: 'BROCK STONE', level: 22, xp: 13750, badge: '🥉', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png' },
    { rank: 4, name: 'GARY OAK', level: 21, xp: 12340, badge: '⭐', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png' },
    { rank: 5, name: 'DAWN LIGHT', level: 20, xp: 11980, badge: '⭐', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png' },
    { rank: 156, name: 'YOU', level: 15, xp: 1250, badge: '👤', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png' }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">🏆 GLOBAL LEADERBOARD</h2>
      
      <div className="space-y-3">
        {leaderboardData.map((leader, index) => (
          <div 
            key={index}
            className={`dashboard-card group flex items-center justify-between p-4 border-4 rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] pixelated-rendering ${
              leader.rank === 156 
                ? 'bg-gradient-to-r from-[#ffcc00]/40 to-[#ffaa00]/40 border-[#ffcc00] hover:shadow-[6px_6px_0_#d97706]' 
                : 'bg-gradient-to-r from-[#600000] to-[#400000] border-black hover:bg-[#800000]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">{leader.badge}</span>
              <div className="w-10 h-10 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                <img 
                  src={leader.gif}
                  alt={leader.name}
                  className="w-8 h-8 pixelated-rendering pokemon-gif"
                />
              </div>
              <div>
                <div className="font-bold text-lg text-shadow-pixel tracking-wider">#{leader.rank} {leader.name}</div>
                <div className="text-sm text-[#ffcc00] font-bold tracking-wider">LEVEL {leader.level}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-xl text-[#ffcc00] text-shadow-pixel">{leader.xp.toLocaleString()} XP</div>
              <div className="text-sm text-white font-bold tracking-wider">CHAMPION RANK</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#ffcc00]">1st</div>
          <div className="text-sm">ASH KETCHUM</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#ffcc00]">2nd</div>
          <div className="text-sm">MISTY WATER</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-[#ffcc00]">3rd</div>
          <div className="text-sm">BROCK STONE</div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardTab;