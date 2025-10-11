import React, { useState } from 'react';

const PokedexTab = ({ trainerData }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    rarity: 'all',
    discovered: 'all',
    favorite: false,
    sortBy: 'pokedexNumber',
    sortOrder: 'asc'
  });

  // Hardcoded Pokédex data matching API structure
  const pokedexData = [
    {
      pokemon: {
        pokedexNumber: 1,
        name: "Mathchu",
        type: "math",
        rarity: "common",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        description: "Loves solving equations and mathematical puzzles"
      },
      discovered: true,
      discoveredAt: "2024-01-15T10:30:00.000Z",
      timesEncountered: 5,
      timesCaught: 2,
      isFavorite: true,
      researchProgress: 85,
      isCaught: true
    },
    {
      pokemon: {
        pokedexNumber: 2,
        name: "Sciencor",
        type: "science",
        rarity: "common",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        description: "Excels in scientific experiments and discoveries"
      },
      discovered: true,
      discoveredAt: "2024-01-20T14:15:00.000Z",
      timesEncountered: 3,
      timesCaught: 1,
      isFavorite: false,
      researchProgress: 60,
      isCaught: true
    },
    {
      pokemon: {
        pokedexNumber: 3,
        name: "Historia",
        type: "history",
        rarity: "rare",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        description: "Knowledgeable about historical events and figures"
      },
      discovered: true,
      discoveredAt: "2024-02-01T09:45:00.000Z",
      timesEncountered: 2,
      timesCaught: 1,
      isFavorite: true,
      researchProgress: 75,
      isCaught: true
    },
    {
      pokemon: {
        pokedexNumber: 4,
        name: "Codegon",
        type: "coding",
        rarity: "epic",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        description: "Master of algorithms and programming logic"
      },
      discovered: false,
      discoveredAt: null,
      timesEncountered: 0,
      timesCaught: 0,
      isFavorite: false,
      researchProgress: 0,
      isCaught: false
    },
    {
      pokemon: {
        pokedexNumber: 5,
        name: "Literatops",
        type: "english",
        rarity: "common",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
        description: "Expert in literature and language arts"
      },
      discovered: true,
      discoveredAt: "2024-01-25T16:20:00.000Z",
      timesEncountered: 4,
      timesCaught: 2,
      isFavorite: false,
      researchProgress: 90,
      isCaught: true
    },
    {
      pokemon: {
        pokedexNumber: 6,
        name: "Geographix",
        type: "geography",
        rarity: "rare",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
        description: "Knows all about countries, capitals, and landscapes"
      },
      discovered: false,
      discoveredAt: null,
      timesEncountered: 0,
      timesCaught: 0,
      isFavorite: false,
      researchProgress: 0,
      isCaught: false
    },
    {
      pokemon: {
        pokedexNumber: 7,
        name: "Algebrat",
        type: "math",
        rarity: "legendary",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
        description: "Legendary Pokémon that solves complex algebraic problems"
      },
      discovered: false,
      discoveredAt: null,
      timesEncountered: 0,
      timesCaught: 0,
      isFavorite: false,
      researchProgress: 0,
      isCaught: false
    },
    {
      pokemon: {
        pokedexNumber: 8,
        name: "Physiquake",
        type: "science",
        rarity: "epic",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
        description: "Understands the fundamental laws of physics"
      },
      discovered: true,
      discoveredAt: "2024-02-05T11:10:00.000Z",
      timesEncountered: 1,
      timesCaught: 1,
      isFavorite: true,
      researchProgress: 95,
      isCaught: true
    }
  ];

  // Filter and sort Pokémon
  const filteredPokemon = pokedexData.filter(pokemon => {
    if (filters.type !== 'all' && pokemon.pokemon.type !== filters.type) return false;
    if (filters.rarity !== 'all' && pokemon.pokemon.rarity !== filters.rarity) return false;
    if (filters.discovered === 'discovered' && !pokemon.discovered) return false;
    if (filters.discovered === 'undiscovered' && pokemon.discovered) return false;
    if (filters.favorite && !pokemon.isFavorite) return false;
    return true;
  }).sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;
    switch (filters.sortBy) {
      case 'pokedexNumber':
        return (a.pokemon.pokedexNumber - b.pokemon.pokedexNumber) * order;
      case 'name':
        return a.pokemon.name.localeCompare(b.pokemon.name) * order;
      case 'rarity':
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
        return (rarityOrder[a.pokemon.rarity] - rarityOrder[b.pokemon.rarity]) * order;
      case 'researchProgress':
        return (a.researchProgress - b.researchProgress) * order;
      default:
        return 0;
    }
  });

  const discoveredCount = pokedexData.filter(p => p.discovered).length;
  const caughtCount = pokedexData.filter(p => p.isCaught).length;
  const favoriteCount = pokedexData.filter(p => p.isFavorite).length;

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

  const toggleFavorite = (pokedexNumber) => {
    // In a real app, this would make an API call
    console.log('Toggle favorite for:', pokedexNumber);
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">📖 POKÉDEX</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#600000] border-2 border-black p-3 rounded shadow-[3px_3px_0_#000] text-center">
          <div className="text-2xl font-bold text-yellow-300">{discoveredCount}/{pokedexData.length}</div>
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
            {Math.round((discoveredCount / pokedexData.length) * 100)}%
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
        </select>

        <button
          onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
          className="bg-[#600000] border-2 border-black text-white px-3 py-2 rounded font-bold"
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Pokédex Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemon.map((entry) => (
          <div
            key={entry.pokemon.pokedexNumber}
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

      {/* Completion Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#600000] to-[#400000] border-2 border-yellow-600 rounded-lg">
        <div className="text-center font-bold text-lg text-yellow-300 mb-2">
          POKÉDEX COMPLETION: {discoveredCount}/{pokedexData.length}
        </div>
        <div className="w-full bg-[#300000] border-2 border-black h-4 shadow-[2px_2px_0_#000]">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full transition-all duration-500"
            style={{ width: `${(discoveredCount / pokedexData.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PokedexTab;