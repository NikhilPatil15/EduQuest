import React from 'react';
import PixelButton from './PixelButton';

const ShopTab = ({ trainerData }) => {
  const shopItems = [
    { name: 'POKé BALL', price: 200, description: 'BASIC CAPTURE RATE', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
    { name: 'GREAT BALL', price: 600, description: 'BETTER CAPTURE RATE', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
    { name: 'RARE CANDY', price: 1000, description: 'LEVEL UP INSTANTLY', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png' },
    { name: 'XP BOOST', price: 500, description: '+50% XP FOR 1 HOUR', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png' },
    { name: 'TRAINER HAT', price: 300, description: 'CUSTOMIZE YOUR LOOK', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png' },
    { name: 'THEME PACK', price: 800, description: 'NEW UI THEME', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png' }
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">🛒 POKéMART SHOP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shopItems.map((item, index) => (
          <div key={index} className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-4 rounded-lg text-center shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-3 bg-white border-4 border-black rounded flex items-center justify-center shadow-[4px_4px_0_#000] floating-element">
              <img 
                src={item.icon}
                alt={item.name}
                className="w-12 h-12 pixelated-rendering pokemon-gif"
              />
            </div>
            
            <h3 className="font-bold text-lg mb-2 text-shadow-pixel tracking-wider">{item.name}</h3>
            <p className="text-sm text-gray-300 mb-3 tracking-wider">{item.description}</p>
            
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-[#ffcc00] font-bold">💰</span>
              <span className="font-bold text-lg text-[#ffcc00]">{item.price}</span>
              <span className="text-sm text-gray-300">COINS</span>
            </div>
            
            <PixelButton 
              variant={trainerData.coins >= item.price ? 'yellow' : 'secondary'}
              className="w-full py-2 text-sm tracking-wider"
              disabled={trainerData.coins < item.price}
            >
              {trainerData.coins >= item.price ? 'BUY NOW' : 'NEED MORE COINS'}
            </PixelButton>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] rounded-lg">
        <div className="text-center font-bold text-lg text-[#ffcc00] tracking-wider mb-2">
          YOUR BALANCE: <span className="text-white">{trainerData.coins} COINS</span>
        </div>
        <div className="text-center text-sm text-gray-300 tracking-wider">
          Complete quests and battles to earn more coins!
        </div>
      </div>
    </>
  );
};

export default ShopTab;