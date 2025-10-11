import React from 'react';

const ActivityFeed = ({ trainerData }) => {
  const activities = [
    { message: 'LEVELED UP TO 15!', time: '2 MIN AGO', icon: '🎉' },
    { message: 'CAUGHT PIKACHU!', time: '1 HOUR AGO', icon: '⚡' },
    { message: 'MATH BADGE EARNED!', time: '3 HOURS AGO', icon: '🏆' },
    { message: 'DAILY QUEST COMPLETED!', time: '5 HOURS AGO', icon: '✅' },
    { message: '7-DAY STREAK!', time: '1 DAY AGO', icon: '🔥' }
  ];

  return (
    <div className="dashboard-card bg-[#400000]/80 border-4 border-black p-5 rounded-lg shadow-[6px_6px_0_#000]">
      <h3 className="text-xl font-bold text-center text-shadow-pixel mb-5 text-[#ffcc00] tracking-wider">
        📊 ACTIVITY FEED
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </div>

      <QuickStats />
    </div>
  );
};

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 bg-black/40 border-2 border-gray-700 rounded shadow-[2px_2px_0_#000]">
    <span className="text-lg">{activity.icon}</span>
    <div className="flex-1">
      <p className="text-sm font-bold text-shadow-pixel tracking-wider">{activity.message}</p>
      <p className="text-xs text-gray-400 font-bold">{activity.time}</p>
    </div>
  </div>
);

const QuickStats = () => (
  <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] rounded">
    <h4 className="font-bold text-center mb-3 text-shadow-pixel tracking-wider">TODAY'S PROGRESS</h4>
    <div className="grid grid-cols-2 gap-3 text-sm font-bold">
      <div className="text-center bg-black/40 p-2 border-2 border-black rounded shadow-[2px_2px_0_#000]">
        <div className="text-lg text-green-400">30MIN</div>
        <div className="text-xs tracking-wider">STUDY TIME</div>
      </div>
      <div className="text-center bg-black/40 p-2 border-2 border-black rounded shadow-[2px_2px_0_#000]">
        <div className="text-lg text-blue-400">5/8</div>
        <div className="text-xs tracking-wider">QUESTS DONE</div>
      </div>
    </div>
  </div>
);

export default ActivityFeed;