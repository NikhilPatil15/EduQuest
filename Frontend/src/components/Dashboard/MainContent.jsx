import React from 'react';
import WorldMapTab from './WorldMapTab.jsx';
import LearnTab from './LearnTab.jsx';
import PokedexTab from './PokedexTab';
import LeaderboardTab from './LeaderboardTab.jsx';
import QuestsTab from './QuestsTab.jsx';
import ShopTab from './ShopTab.jsx';

const MainContent = ({ activeTab, trainerData }) => {
  const tabComponents = {
    world: WorldMapTab,
    learn: LearnTab,
    pokedex: PokedexTab,
    leaderboard: LeaderboardTab,
    quests: QuestsTab,
    shop: ShopTab,
  };

  const TabComponent = tabComponents[activeTab];

  return (
    <div className="dashboard-card bg-[#400000]/80 border-4 border-black p-6 rounded-lg shadow-[8px_8px_0_#000]">
      <TabComponent trainerData={trainerData} />
    </div>
  );
};

export default MainContent;