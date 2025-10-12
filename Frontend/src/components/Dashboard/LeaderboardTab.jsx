// LeaderboardTab.jsx
import React, { useState, useEffect } from 'react';
// Import the centralized Axios instance
import axiosInstance from '../../utils/axiosInstance'; 

// API Endpoint
// NOTE: We don't need to specify the method in the endpoint path
const LEADERBOARD_ENDPOINT = '/users/leaderboard';

const LeaderboardTab = ({ trainerData }) => {
  // ----------------------------------------------------
  // 1. STATE MANAGEMENT
  // ----------------------------------------------------
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [timeframe, setTimeframe] = useState('all-time');

  // State for fetched data
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded fallback data (for demonstration/error handling)
  const hardcodedFallback = {
    rankings: [
      { rank: 1, user: { userName: "ashketchum", level: 25, xp: 25000, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png" }, score: 2850, badges: 15, pokemonCount: 42, streak: 14 },
      { rank: 2, user: { userName: "mistywater", level: 23, xp: 22000, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png" }, score: 2650, badges: 12, pokemonCount: 38, streak: 10 },
      { rank: 3, user: { userName: "brockstone", level: 22, xp: 21000, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png" }, score: 2450, badges: 11, pokemonCount: 35, streak: 8 },
      { rank: 4, user: { userName: "garyoak", level: 21, xp: 19500, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png" }, score: 2300, badges: 10, pokemonCount: 32, streak: 12 },
      { rank: 5, user: { userName: "dawnlight", level: 20, xp: 18000, avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png" }, score: 2150, badges: 9, pokemonCount: 28, streak: 6 },
    ],
    // The user's actual rank might be deeper in the rankings or calculated separately
    userRank: 999, 
  };


  // ----------------------------------------------------
  // 2. API INTEGRATION (Axios GET with Query Params)
  // ----------------------------------------------------

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    // 2.1. Construct the Query Parameters object to match the backend's req.query
    const params = {
      type: leaderboardType,
      timeframe: timeframe,
    };

    if (leaderboardType === 'subject') {
      params.subject = selectedSubject;
    }
    // Limit is already set to 100 in the backend, but could be added here:
    // params.limit = 50; 

    try {
      // 2.2. SWITCHED TO axiosInstance.get and passing the filters via the 'params' config object
      const response = await axiosInstance.get(LEADERBOARD_ENDPOINT, { params });
      
      const result = response.data;

      // The backend structure: { success, data: { leaderboard, userRank, filters } }
      if (result.success && result.data && Array.isArray(result.data.leaderboard)) {
        // Map the backend structure to our local state structure
        setLeaderboardData({
            rankings: result.data.leaderboard,
            userRank: result.data.userRank,
        }); 
      } else {
        console.error("API response structure unexpected, using fallback:", result);
        setLeaderboardData(hardcodedFallback); 
      }
    } catch (e) {
      // Axios interceptor handles 401. Other errors are caught here.
      console.error("Error fetching leaderboard:", e);
      
      const message = e.response?.data?.message || e.message || "Network error. Try again.";
      setError(`Failed to load Leaderboard: ${message}`);
      setLeaderboardData(hardcodedFallback); 
    } finally {
      setLoading(false);
    }
  };

  // 2.3. useEffect hook to trigger fetch on state change
  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType, selectedSubject, timeframe]); 

  
  // ----------------------------------------------------
  // 3. UTILITY FUNCTIONS & DISPLAY DATA
  // ----------------------------------------------------

  const rankings = leaderboardData?.rankings || [];
  const userRank = leaderboardData?.userRank || hardcodedFallback.userRank;
  const userScore = rankings.find(r => r.rank === userRank)?.score || trainerData?.score || 850;

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

  // ----------------------------------------------------
  // 4. COMPONENT RENDER
  // ----------------------------------------------------

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">🏆 LEADERBOARD</h2>
      
      {/* Leaderboard Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {['global', 'subject', 'friends'].map(type => (
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

      {/* Timeframe Selector (Applies to Global/Subject/Friends) */}
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
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-xl p-8 text-yellow-300">
          <div className="animate-spin inline-block w-6 h-6 border-4 border-t-4 border-yellow-300 border-opacity-25 rounded-full"></div>
          <p className="mt-2">Fetching Trainer Rankings...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center p-4 bg-red-800 border-2 border-red-600 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      {!loading && (
        <>
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
                <div className="font-bold text-xl">{userScore.toLocaleString()} Points</div>
                <div className="text-sm">Your Rank</div>
              </div>
            </div>
          </div>

          {/* Leaderboard Rankings */}
          <div className="space-y-3 mb-6">
            {rankings.length > 0 ? rankings.map((leader) => (
              <div 
                key={leader.rank}
                className={`dashboard-card group flex items-center justify-between p-4 border-4 rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] ${
                  leader.rank === userRank || leader.user.userName === trainerData?.username // Highlight if user's entry
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
            )) : (
                <div className="text-center p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
                    No rankings found for the current selection.
                </div>
            )}
          </div>

          {/* Stats Summary (Placeholder data, ideally fetched via /api/v1/pokedex/stats or another endpoint) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000]">
              <div className="text-2xl font-bold text-yellow-300">🏆</div>
              <div className="text-sm">Top Player</div>
              <div className="font-bold text-white">{rankings[0]?.user.userName || 'N/A'}</div>
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
        </>
      )}
    </div>
  );
};

export default LeaderboardTab;