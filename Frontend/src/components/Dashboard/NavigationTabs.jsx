// NavigationTabs.jsx or similar component
import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'world', label: 'World Map' },
    { id: 'learn', label: 'Learn' },
    { id: 'pokedex', label: 'Pokédex' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'quests', label: 'Quests' },
    { id: 'shop', label: 'Shop' },
    { id: 'duels', label: 'Duels' }, // Add this line
  ];

  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg font-bold border-2 border-black ${
            activeTab === tab.id 
              ? 'bg-red-600 text-white shadow-[4px_4px_0_#000]' 
              : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[4px_4px_0_#000]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;