// PokedexTab.jsx
import React, { useState, useEffect } from 'react';
// 1. Import the centralized Axios instance
import axiosInstance from '../../utils/axiosInstance'; 

// NOTE: The API_BASE_URL is now configured in axiosInstance.js.
// We only need the endpoint path relative to the base URL here.
const POKEDEX_ENDPOINT = '/pokedex/pokedex'; 

const PokedexTab = ({ trainerData }) => {
  // ----------------------------------------------------
  // 1. STATE MANAGEMENT
  // ----------------------------------------------------
  const [filters, setFilters] = useState({
    type: 'all',
    rarity: 'all',
    discovered: 'all',
    favorite: false,
    sortBy: 'pokedexNumber',
    sortOrder: 'asc'
  });

  // State to hold the data fetched from the API
  const [apiPokedexData, setApiPokedexData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded fallback data (used if API fails or returns unexpected structure)
  const hardcodedPokedexData = [
    {
      pokemon: { pokedexNumber: 1, name: "Mathchu", type: "math", rarity: "common", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", description: "Loves solving equations and mathematical puzzles" },
      discovered: true, discoveredAt: "2024-01-15T10:30:00.000Z", timesEncountered: 5, timesCaught: 2, isFavorite: true, researchProgress: 85, isCaught: true
    },
    {
      pokemon: { pokedexNumber: 2, name: "Sciencor", type: "science", rarity: "common", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", description: "Excels in scientific experiments and discoveries" },
      discovered: true, discoveredAt: "2024-01-20T14:15:00.000Z", timesEncountered: 3, timesCaught: 1, isFavorite: false, researchProgress: 60, isCaught: true
    },
    {
      pokemon: { pokedexNumber: 3, name: "Historia", type: "history", rarity: "rare", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", description: "Knowledgeable about historical events and figures" },
      discovered: true, discoveredAt: "2024-02-01T09:45:00.000Z", timesEncountered: 2, timesCaught: 1, isFavorite: true, researchProgress: 75, isCaught: true
    },
    {
      pokemon: { pokedexNumber: 4, name: "Codegon", type: "coding", rarity: "epic", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", description: "Master of algorithms and programming logic" },
      discovered: false, discoveredAt: null, timesEncountered: 0, timesCaught: 0, isFavorite: false, researchProgress: 0, isCaught: false
    },
    {
      pokemon: { pokedexNumber: 5, name: "Literatops", type: "english", rarity: "common", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png", description: "Expert in literature and language arts" },
      discovered: true, discoveredAt: "2024-01-25T16:20:00.000Z", timesEncountered: 4, timesCaught: 2, isFavorite: false, researchProgress: 90, isCaught: true
    },
    {
      pokemon: { pokedexNumber: 6, name: "Geographix", type: "geography", rarity: "rare", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png", description: "Knows all about countries, capitals, and landscapes" },
      discovered: false, discoveredAt: null, timesEncountered: 0, timesCaught: 0, isFavorite: false, researchProgress: 0, isCaught: false
    },
    {
      pokemon: { pokedexNumber: 7, name: "Algebrat", type: "math", rarity: "legendary", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png", description: "Legendary Pokémon that solves complex algebraic problems" },
      discovered: false, discoveredAt: null, timesEncountered: 0, timesCaught: 0, isFavorite: false, researchProgress: 0, isCaught: false
    },
    {
      pokemon: { pokedexNumber: 8, name: "Physiquake", type: "science", rarity: "epic", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png", description: "Understands the fundamental laws of physics" },
      discovered: true, discoveredAt: "2024-02-05T11:10:00.000Z", timesEncountered: 1, timesCaught: 1, isFavorite: true, researchProgress: 95, isCaught: true
    }
  ];

  // ----------------------------------------------------
  // 2. API INTEGRATION & DATA FETCHING
  // ----------------------------------------------------

  const buildQueryParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.type !== 'all') params.append('type', filters.type);
    if (filters.rarity !== 'all') params.append('rarity', filters.rarity);
    if (filters.discovered === 'discovered') params.append('discovered', 'true');
    if (filters.discovered === 'undiscovered') params.append('discovered', 'false');
    if (filters.favorite) params.append('favorite', 'true');
    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);
    return params;
  };

  /**
   * Fetches the Pokédex data using the Axios instance.
   */
  const fetchPokedex = async () => {
    setLoading(true);
    setError(null);

    const params = buildQueryParams(filters);
    
    try {
      // 2. Use axiosInstance.get()
      const response = await axiosInstance.get(POKEDEX_ENDPOINT, { params });
      
      // Axios puts the response data under the 'data' property
      const result = response.data;
      
      if (result.success && result.data && Array.isArray(result.data.pokedex)) {
        setApiPokedexData(result.data.pokedex);
      } else {
        console.error("API response structure unexpected, using fallback:", result);
        setApiPokedexData(hardcodedPokedexData); 
      }
    } catch (e) {
      // The interceptor handles 401. Other errors are caught here.
      console.error("Error fetching Pokédex:", e.message);
      
      let message = "An unknown error occurred.";
      if (e.response && e.response.data && e.response.data.message) {
          message = e.response.data.message; // Use backend error message
      } else if (e.message) {
          message = e.message; // Use Axios/Network message
      }
      
      setError(`Failed to load Pokédex: ${message}. Showing local data.`);
      setApiPokedexData(hardcodedPokedexData); 
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook: Run the fetch function whenever the filters state changes
  useEffect(() => {
    fetchPokedex();
  }, [filters]); 

  /**
   * Handles the PATCH request to toggle a Pokémon's favorite status.
   */
  const toggleFavorite = async (pokedexNumber) => {
    // 1. Optimistic UI update
    setApiPokedexData(prevData => prevData.map(p => 
        p.pokemon.pokedexNumber === pokedexNumber 
            ? { ...p, isFavorite: !p.isFavorite } 
            : p
    ));

    try {
      // 2. Use axiosInstance.patch()
      await axiosInstance.patch(`${POKEDEX_ENDPOINT}/${pokedexNumber}/favorite`);
      console.log(`Favorite toggled for ${pokedexNumber}`);
      // No explicit state update needed if optimistic update was successful
    } catch (e) {
      console.error(e);
      setError("Failed to update favorite status. Please try again.");
      
      // 3. Revert optimistic update on failure
      setApiPokedexData(prevData => prevData.map(p => 
          p.pokemon.pokedexNumber === pokedexNumber 
              ? { ...p, isFavorite: !p.isFavorite } // Revert the change
              : p
      ));
    }
  };


  // ----------------------------------------------------
  // 3. UTILITY FUNCTIONS & CALCULATIONS
  // ----------------------------------------------------

  const pokedexDisplayData = apiPokedexData; 
  const totalCount = hardcodedPokedexData.length; 
  const discoveredCount = pokedexDisplayData.filter(p => p.discovered).length;
  const caughtCount = pokedexDisplayData.filter(p => p.isCaught).length;
  const favoriteCount = pokedexDisplayData.filter(p => p.isFavorite).length;

  const getTypeColor = (type) => {
    const colors = {
      math: 'bg-blue-600',
      science: 'bg-green-600',
      history: 'bg-yellow-600',
      coding: 'bg-purple-600',
      english: 'bg-red-600',
      geography: 'bg-indigo-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-300',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400'
    };
    return colors[rarity] || 'text-gray-300';
  };

  const getRarityBadge = (rarity) => {
    const badges = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡'
    };
    return badges[rarity] || '⚪';
  };

  // ----------------------------------------------------
  // 4. COMPONENT RENDER
  // ----------------------------------------------------

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">📖 POKÉDEX</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000] text-center">
          <div className="text-2xl font-bold text-yellow-300">{discoveredCount}/{totalCount}</div>
          <div className="text-sm">Discovered</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000] text-center">
          <div className="text-2xl font-bold text-yellow-300">{caughtCount}</div>
          <div className="text-sm">Caught</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000] text-center">
          <div className="text-2xl font-bold text-yellow-300">{favoriteCount}</div>
          <div className="text-sm">Favorites</div>
        </div>
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000] text-center">
          <div className="text-2xl font-bold text-yellow-300">
            {totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0}%
          </div>
          <div className="text-sm">Complete</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Type Filter */}
        <select 
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          <option value="all">All Types</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="coding">Coding</option>
          <option value="english">English</option>
          <option value="geography">Geography</option>
        </select>

        {/* Rarity Filter */}
        <select 
          value={filters.rarity}
          onChange={(e) => setFilters({...filters, rarity: e.target.value})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        {/* Discovered Filter */}
        <select 
          value={filters.discovered}
          onChange={(e) => setFilters({...filters, discovered: e.target.value})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          <option value="all">All</option>
          <option value="discovered">Discovered</option>
          <option value="undiscovered">Undiscovered</option>
        </select>

        {/* Favorite Filter */}
        <button
          onClick={() => setFilters({...filters, favorite: !filters.favorite})}
          className={`px-3 py-2 border-2 border-black rounded font-bold ${
            filters.favorite ? 'bg-yellow-600 text-white' : 'bg-[#600000] text-white'
          }`}
        >
          ⭐ Favorites
        </button>

        {/* Sort Options */}
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          <option value="pokedexNumber">Number</option>
          <option value="name">Name</option>
          <option value="rarity">Rarity</option>
          <option value="researchProgress">Progress</option>
          <option value="discoveredAt">Discovered Date</option>
        </select>

        <button
          onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-xl p-8 text-yellow-300">
          <div className="animate-spin inline-block w-6 h-6 border-4 border-t-4 border-yellow-300 border-opacity-25 rounded-full"></div>
          <p className="mt-2">Loading Pokédex...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-800 border-2 border-red-600 rounded mb-4">
          ⚠️ {error}
        </div>
      )}
      
      {/* Pokédex Grid */}
      {!loading && pokedexDisplayData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pokedexDisplayData.map((entry) => (
            <div
              key={entry.pokemon.pokedexNumber}
              // Conditional styling based on discovered status
              className={`dashboard-card group relative border-4 p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 ${
                entry.discovered 
                  ? 'bg-gradient-to-br from-[#600000] to-[#400000] border-black hover:shadow-[6px_6px_0_#000]' 
                  : 'bg-gradient-to-br from-[#300000] to-[#200000] border-gray-800 opacity-70'
              } shadow-[4px_4px_0_#000]`}
            >
              {/* Pokémon Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-gray-400">#{entry.pokemon.pokedexNumber.toString().padStart(3, '0')}</div>
                  <h3 className={`font-bold text-lg capitalize ${getRarityColor(entry.pokemon.rarity)}`}>
                    {entry.pokemon.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getRarityBadge(entry.pokemon.rarity)}</span>
                  <button
                    onClick={() => toggleFavorite(entry.pokemon.pokedexNumber)}
                    className={`text-lg ${entry.isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
                    disabled={!entry.discovered} // Cannot favorite an undiscovered Pokémon
                  >
                    {entry.isFavorite ? '★' : '☆'}
                  </button>
                </div>
              </div>

              {/* Pokémon Image */}
              <div className="w-24 h-24 mx-auto mb-3 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                {entry.discovered ? (
                  <img 
                    src={entry.pokemon.image}
                    alt={entry.pokemon.name}
                    className="w-20 h-20"
                  />
                ) : (
                  <div className="text-4xl">❓</div>
                )}
              </div>

              {/* Type Badge */}
              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 border-2 border-black font-bold text-white rounded text-sm ${getTypeColor(entry.pokemon.type)}`}>
                  {entry.pokemon.type.toUpperCase()}
                </span>
              </div>

              {/* Pokémon Info */}
              {entry.discovered ? (
                <div className="space-y-2 text-sm">
                  <div className="text-center text-gray-300 italic">
                    {entry.pokemon.description}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold">Encountered</div>
                      <div>{entry.timesEncountered} times</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">Caught</div>
                      <div>{entry.timesCaught} times</div>
                    </div>
                  </div>

                  {/* Research Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Research</span>
                      <span>{entry.researchProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 border-2 border-black h-2">
                      <div 
                        className="bg-yellow-500 h-full"
                        style={{ width: `${entry.researchProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`text-center text-xs font-bold px-2 py-1 border-2 border-black ${
                    entry.isCaught ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {entry.isCaught ? '✅ CAUGHT' : '❌ NOT CAUGHT'}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-lg mb-2">???</div>
                  <div className="text-sm">Not yet discovered</div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center p-8 text-gray-400 border-2 border-gray-700 rounded-lg">
          No Pokémon matched your current filters. Try adjusting them!
        </div>
      )}


      {/* Completion Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#600000] to-[#400000] border-2 border-yellow-600 rounded-lg">
        <div className="text-center font-bold text-lg text-yellow-300 mb-2">
          POKÉDEX COMPLETION: {discoveredCount}/{totalCount}
        </div>
        <div className="w-full bg-[#300000] border-2 border-black h-4 shadow-[2px_2px_0_#000]">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full transition-all duration-500"
            style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PokedexTab;