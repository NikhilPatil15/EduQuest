import React, { useState } from 'react';

const LeaderboardTab = ({ trainerData }) => {
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [timeframe, setTimeframe] = useState('all-time');

  // Hardcoded leaderboard data matching API structure
  const leaderboardData = {
    global: {
      type: "global",
      rankings: [
        {
          rank: 1,
          user: {
            userName: "ashketchum",
            level: 25,
            xp: 25000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"
          },
          score: 2850,
          badges: 15,
          pokemonCount: 42,
          streak: 14
        },
        {
          rank: 2,
          user: {
            userName: "mistywater",
            level: 23,
            xp: 22000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png"
          },
          score: 2650,
          badges: 12,
          pokemonCount: 38,
          streak: 10
        },
        {
          rank: 3,
          user: {
            userName: "brockstone",
            level: 22,
            xp: 21000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png"
          },
          score: 2450,
          badges: 11,
          pokemonCount: 35,
          streak: 8
        },
        {
          rank: 4,
          user: {
            userName: "garyoak",
            level: 21,
            xp: 19500,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png"
          },
          score: 2300,
          badges: 10,
          pokemonCount: 32,
          streak: 12
        },
        {
          rank: 5,
          user: {
            userName: "dawnlight",
            level: 20,
            xp: 18000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png"
          },
          score: 2150,
          badges: 9,
          pokemonCount: 28,
          streak: 6
        },
        {
          rank: 156,
          user: {
            userName: trainerData?.username || "YOU",
            level: trainerData?.level || 15,
            xp: trainerData?.xp || 1250,
            avatar: trainerData?.avatar || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"
          },
          score: 850,
          badges: 3,
          pokemonCount: 12,
          streak: 2
        }
      ],
      userRank: 156
    },
    subject: {
      type: "subject",
      rankings: [
        {
          rank: 1,
          user: {
            userName: "professoroak",
            level: 28,
            xp: 28000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/6.png"
          },
          score: 1950,
          badges: 18,
          pokemonCount: 45,
          streak: 20
        },
        {
          rank: 2,
          user: {
            userName: "ashketchum",
            level: 25,
            xp: 25000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"
          },
          score: 1850,
          badges: 15,
          pokemonCount: 42,
          streak: 14
        },
        {
          rank: 3,
          user: {
            userName: "garyoak",
            level: 21,
            xp: 19500,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png"
          },
          score: 1750,
          badges: 10,
          pokemonCount: 32,
          streak: 12
        }
      ],
      userRank: 25
    },
    weekly: {
      type: "weekly",
      rankings: [
        {
          rank: 1,
          user: {
            userName: "mistywater",
            level: 23,
            xp: 22000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png"
          },
          score: 850,
          badges: 12,
          pokemonCount: 38,
          streak: 10
        },
        {
          rank: 2,
          user: {
            userName: "brockstone",
            level: 22,
            xp: 21000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png"
          },
          score: 750,
          badges: 11,
          pokemonCount: 35,
          streak: 8
        },
        {
          rank: 3,
          user: {
            userName: "dawnlight",
            level: 20,
            xp: 18000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png"
          },
          score: 650,
          badges: 9,
          pokemonCount: 28,
          streak: 6
        }
      ],
      userRank: 12
    },
    friends: {
      type: "friends",
      rankings: [
        {
          rank: 1,
          user: {
            userName: "mistywater",
            level: 23,
            xp: 22000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png"
          },
          score: 2650,
          badges: 12,
          pokemonCount: 38,
          streak: 10
        },
        {
          rank: 2,
          user: {
            userName: "brockstone",
            level: 22,
            xp: 21000,
            avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png"
          },
          score: 2450,
          badges: 11,
          pokemonCount: 35,
          streak: 8
        }
      ],
      userRank: 3
    }
  };

  const currentLeaderboard = leaderboardData[leaderboardType];
  const userRank = currentLeaderboard.userRank;

  const getRankBadge = (rank) => {
    switch(rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getTypeDisplay = (type) => {
    const types = {
      global: "🌍 Global",
      subject: "📚 Subject",
      weekly: "📅 Weekly",
      friends: "👥 Friends"
    };
    return types[type] || type;
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">🏆 LEADERBOARD</h2>
      
      {/* Leaderboard Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {['global', 'subject', 'weekly', 'friends'].map(type => (
          <button
            key={type}
            onClick={() => setLeaderboardType(type)}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold transition-all ${
              leaderboardType === type 
                ? 'bg-red-600 text-white shadow-[4px_4px_0_#000]' 
                : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[4px_4px_0_#000]'
            }`}
          >
            {getTypeDisplay(type)}
          </button>
        ))}
      </div>

      {/* Subject Selector (for subject leaderboard) */}
      {leaderboardType === 'subject' && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {['math', 'science', 'history', 'english', 'geography'].map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-lg border-2 border-black font-bold capitalize ${
                selectedSubject === subject 
                  ? 'bg-blue-600 text-white shadow-[4px_4px_0_#000]' 
                  : 'bg-gray-600 text-white hover:bg-gray-500 shadow-[4px_4px_0_#000]'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      )}

      {/* Timeframe Selector */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {['daily', 'weekly', 'monthly', 'all-time'].map(time => (
          <button
            key={time}
            onClick={() => setTimeframe(time)}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold capitalize ${
              timeframe === time 
                ? 'bg-green-600 text-white shadow-[4px_4px_0_#000]' 
                : 'bg-gray-600 text-white hover:bg-gray-500 shadow-[4px_4px_0_#000]'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* User Rank Card */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 border-4 border-yellow-300 rounded-lg p-4 mb-6 shadow-[6px_6px_0_#000]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{getRankBadge(userRank)}</span>
            <div className="w-12 h-12 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
              <img 
                src={trainerData?.avatar || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"}
                alt="Your avatar"
                className="w-10 h-10"
              />
            </div>
            <div>
              <div className="font-bold text-lg">#{userRank} {trainerData?.username || "YOU"}</div>
              <div className="text-sm">Level {trainerData?.level || 15}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">{currentLeaderboard.rankings.find(r => r.rank === userRank)?.score || 850} Points</div>
            <div className="text-sm">Your Rank</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Rankings */}
      <div className="space-y-3 mb-6">
        {currentLeaderboard.rankings.filter(rank => rank.rank <= 5).map((leader) => (
          <div 
            key={leader.rank}
            className={`dashboard-card group flex items-center justify-between p-4 border-4 rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] ${
              leader.rank === userRank 
                ? 'bg-gradient-to-r from-[#ffcc00]/40 to-[#ffaa00]/40 border-[#ffcc00]' 
                : 'bg-gradient-to-r from-[#600000] to-[#400000] border-black hover:bg-[#800000]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold w-8">{getRankBadge(leader.rank)}</span>
              <div className="w-12 h-12 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                <img 
                  src={leader.user.avatar}
                  alt={leader.user.userName}
                  className="w-10 h-10"
                />
              </div>
              <div>
                <div className="font-bold text-lg capitalize">{leader.user.userName}</div>
                <div className="text-sm text-yellow-300">Level {leader.user.level} • {leader.badges} Badges</div>
                <div className="text-xs text-gray-300">{leader.pokemonCount} Pokémon • Streak: {leader.streak} days</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-xl text-yellow-300">{leader.score.toLocaleString()} Points</div>
              <div className="text-sm text-white">{leader.user.xp.toLocaleString()} XP</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-yellow-300">🏆</div>
          <div className="text-sm">Top Player</div>
          <div className="font-bold text-white">{currentLeaderboard.rankings[0]?.user.userName}</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-yellow-300">⭐</div>
          <div className="text-sm">Your Rank</div>
          <div className="font-bold text-white">#{userRank}</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-yellow-300">📊</div>
          <div className="text-sm">Total Players</div>
          <div className="font-bold text-white">1,250</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
          <div className="text-2xl font-bold text-yellow-300">🔥</div>
          <div className="text-sm">Active Today</div>
          <div className="font-bold text-white">842</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;