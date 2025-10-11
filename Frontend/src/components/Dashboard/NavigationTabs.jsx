import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'world', name: 'WORLD MAP', icon: '🗺️' },
    { id: 'learn', name: 'LEARN', icon: '⚡' },
    { id: 'pokedex', name: 'POKéDEX', icon: '📱' },
    { id: 'leaderboard', name: 'LEADERBOARD', icon: '🏆' },
    { id: 'quests', name: 'QUESTS', icon: '🎯' },
    { id: 'shop', name: 'POKéMART', icon: '🛒' }
  ];

  return (
    <nav className="bg-[#400000] border-b-4 border-[#cc0000] shadow-[0_4px_0_#000] py-5">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto space-x-1 p-2">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`tab-button flex items-center space-x-2 px-6 py-3 border-4 font-bold transition-all whitespace-nowrap pixelated-rendering ${
      isActive 
        ? 'bg-[#ffcc00] border-black text-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-1' 
        : 'bg-[#600000] border-[#400000] text-white hover:bg-[#800000] shadow-[4px_4px_0_#222] hover:shadow-[6px_6px_0_#222] hover:-translate-y-1'
    } active:translate-y-0 active:shadow-[2px_2px_0_#000]`}
  >
    <span className="text-lg">{tab.icon}</span>
    <span className="hidden md:inline tracking-wider">{tab.name}</span>
  </button>
);

export default NavigationTabs;