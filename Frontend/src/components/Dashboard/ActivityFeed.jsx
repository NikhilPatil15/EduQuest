import React, { useState } from 'react';

const ActivityFeed = ({ trainerData }) => {
  const [activeTab, setActiveTab] = useState('notifications'); // notifications, quests, insights, streak

  // Hardcoded data matching API structure
  const notificationsData = [
    {
      _id: "notif_1",
      type: "level_up",
      title: "Level Up!",
      message: "Congratulations! You reached Level 16",
      data: { level: 16 },
      isRead: false,
      createdAt: "2024-01-20T10:30:00.000Z"
    },
    {
      _id: "notif_2",
      type: "quest_complete",
      title: "Quest Completed!",
      message: "Daily Math Challenge completed",
      data: { questId: "quest_1", reward: { xp: 150, coins: 25 } },
      isRead: false,
      createdAt: "2024-01-20T09:15:00.000Z"
    },
    {
      _id: "notif_3",
      type: "streak_milestone",
      title: "Streak Milestone!",
      message: "7-day learning streak achieved!",
      data: { streak: 7 },
      isRead: true,
      createdAt: "2024-01-19T08:00:00.000Z"
    },
    {
      _id: "notif_4",
      type: "pokemon_catch",
      title: "New Pokémon!",
      message: "You caught Mathchu!",
      data: { pokemonId: "mathchu_1" },
      isRead: true,
      createdAt: "2024-01-18T16:45:00.000Z"
    },
    {
      _id: "notif_5",
      type: "badge_earned",
      title: "Badge Earned!",
      message: "Algebra Master badge unlocked",
      data: { badgeId: "algebra_master" },
      isRead: true,
      createdAt: "2024-01-18T14:20:00.000Z"
    }
  ];

  const questsData = [
    {
      _id: "quest_1",
      title: "Complete 3 Quizzes",
      description: "Complete any 3 quizzes to earn rewards",
      type: "quiz_completion",
      goal: 3,
      progress: 2,
      reward: {
        xp: 150,
        coins: 25
      },
      status: "active",
      expiresAt: "2024-01-20T23:59:59.000Z"
    },
    {
      _id: "quest_2",
      title: "Math Master",
      description: "Score 90% or higher in a math quiz",
      type: "quiz_performance",
      goal: 1,
      progress: 1,
      reward: {
        xp: 200,
        coins: 50,
        item: "rare_candy"
      },
      status: "completed",
      expiresAt: "2024-01-20T23:59:59.000Z"
    },
    {
      _id: "quest_3",
      title: "Daily Streak",
      description: "Maintain your learning streak for 5 days",
      type: "streak",
      goal: 5,
      progress: 3,
      reward: {
        xp: 300,
        coins: 75
      },
      status: "active",
      expiresAt: "2024-01-20T23:59:59.000Z"
    },
    {
      _id: "quest_4",
      title: "Pokémon Collector",
      description: "Catch 2 new Pokémon today",
      type: "collection",
      goal: 2,
      progress: 1,
      reward: {
        xp: 100,
        coins: 20,
        item: "pokeball"
      },
      status: "active",
      expiresAt: "2024-01-20T23:59:59.000Z"
    }
  ];

  const insightsData = [
    {
      _id: "insight_1",
      type: "strength",
      title: "Math Strength",
      message: "You're excelling in algebra problems!",
      data: { subject: "math", topic: "algebra", accuracy: 95 },
      isRead: false,
      createdAt: "2024-01-20T10:00:00.000Z"
    },
    {
      _id: "insight_2",
      type: "improvement",
      title: "Science Improvement",
      message: "Your science scores improved by 15% this week",
      data: { subject: "science", improvement: 15 },
      isRead: true,
      createdAt: "2024-01-19T09:30:00.000Z"
    },
    {
      _id: "insight_3",
      type: "suggestion",
      title: "Study Suggestion",
      message: "Try focusing on geometry problems for better balance",
      data: { subject: "math", topic: "geometry", currentAccuracy: 65 },
      isRead: true,
      createdAt: "2024-01-18T15:20:00.000Z"
    }
  ];

  const streakData = {
    currentStreak: 7,
    longestStreak: 12,
    lastActivity: "2024-01-20T10:30:00.000Z",
    streakHistory: [
      { date: "2024-01-14", completed: true },
      { date: "2024-01-15", completed: true },
      { date: "2024-01-16", completed: true },
      { date: "2024-01-17", completed: true },
      { date: "2024-01-18", completed: true },
      { date: "2024-01-19", completed: true },
      { date: "2024-01-20", completed: true }
    ]
  };

  const markAsRead = (id) => {
    // In real app, this would call PATCH /api/v1/feedback/notifications/:id/read
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In real app, this would call PATCH /api/v1/feedback/notifications/read-all
    console.log('Mark all as read');
  };

  const claimQuest = (questId) => {
    // In real app, this would call POST /api/v1/feedback/quests/:questId/claim
    console.log('Claim quest:', questId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} MIN AGO`;
    if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
    return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      level_up: '🎉',
      quest_complete: '✅',
      streak_milestone: '🔥',
      pokemon_catch: '⚡',
      badge_earned: '🏆',
      strength: '💪',
      improvement: '📈',
      suggestion: '💡'
    };
    return icons[type] || '📢';
  };

  const renderNotifications = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-yellow-300">Notifications</h4>
        <button
          onClick={markAllAsRead}
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border-2 border-black font-bold"
        >
          Mark All Read
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notificationsData.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-start space-x-3 p-3 border-2 rounded shadow-[2px_2px_0_#000] cursor-pointer transition-all ${
              notification.isRead 
                ? 'bg-black/30 border-gray-700' 
                : 'bg-yellow-600/20 border-yellow-500'
            }`}
            onClick={() => markAsRead(notification._id)}
          >
            <span className="text-lg mt-1">{getNotificationIcon(notification.type)}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className={`font-bold text-sm ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                  {notification.title}
                </p>
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-300">{notification.message}</p>
              <p className="text-xs text-gray-400">{formatTime(notification.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuests = () => (
    <div>
      <h4 className="font-bold text-yellow-300 mb-4">Daily Quests</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {questsData.map((quest) => (
          <div
            key={quest._id}
            className="bg-black/40 border-2 border-gray-700 p-3 rounded shadow-[2px_2px_0_#000]"
          >
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-white">{quest.title}</h5>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                quest.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
              }`}>
                {quest.status === 'completed' ? 'COMPLETED' : 'ACTIVE'}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress: {quest.progress}/{quest.goal}</span>
                <span>{Math.round((quest.progress / quest.goal) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 border-2 border-black h-3">
                <div 
                  className="bg-yellow-500 h-full transition-all duration-500"
                  style={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-green-400">+{quest.reward.xp} XP</span>
                {quest.reward.coins && <span className="text-yellow-400 ml-2">+{quest.reward.coins} coins</span>}
                {quest.reward.item && <span className="text-blue-400 ml-2">+{quest.reward.item}</span>}
              </div>
              {quest.status === 'completed' && (
                <button
                  onClick={() => claimQuest(quest._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded border-2 border-black font-bold"
                >
                  Claim
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div>
      <h4 className="font-bold text-yellow-300 mb-4">Performance Insights</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {insightsData.map((insight) => (
          <div
            key={insight._id}
            className={`flex items-start space-x-3 p-3 border-2 rounded shadow-[2px_2px_0_#000] ${
              insight.isRead ? 'bg-black/30 border-gray-700' : 'bg-blue-600/20 border-blue-500'
            }`}
          >
            <span className="text-lg mt-1">{getNotificationIcon(insight.type)}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-sm text-white">{insight.title}</p>
                {!insight.isRead && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-300">{insight.message}</p>
              <p className="text-xs text-gray-400">{formatTime(insight.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStreak = () => (
    <div>
      <h4 className="font-bold text-yellow-300 mb-4">Learning Streak</h4>
      <div className="bg-black/40 border-2 border-gray-700 p-4 rounded shadow-[2px_2px_0_#000] mb-4">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-yellow-300 mb-2">{streakData.currentStreak}</div>
          <div className="text-sm text-gray-300">Current Streak (Days)</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-400">{streakData.longestStreak}</div>
            <div className="text-xs text-gray-300">Longest Streak</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {formatTime(streakData.lastActivity)}
            </div>
            <div className="text-xs text-gray-300">Last Activity</div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border-2 border-gray-700 p-3 rounded shadow-[2px_2px_0_#000]">
        <h5 className="font-bold text-white text-center mb-3">This Week</h5>
        <div className="flex justify-between">
          {streakData.streakHistory.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto mb-1 ${
                day.completed 
                  ? 'bg-green-600 border-green-400' 
                  : 'bg-gray-600 border-gray-400'
              }`}>
                {day.completed ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-300">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-card bg-[#400000]/80 border-4 border-black p-5 rounded-lg shadow-[6px_6px_0_#000]">
      <h3 className="text-xl font-bold text-center mb-5 text-yellow-300 tracking-wider">
        📊 ACTIVITY & FEEDBACK
      </h3>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'notifications', label: '📢 Notifications' },
          { key: 'quests', label: '🎯 Quests' },
          { key: 'insights', label: '💡 Insights' },
          { key: 'streak', label: '🔥 Streak' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm rounded-lg border-2 border-black font-bold transition-all ${
              activeTab === tab.key 
                ? 'bg-red-600 text-white shadow-[3px_3px_0_#000]' 
                : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[3px_3px_0_#000]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'quests' && renderQuests()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'streak' && renderStreak()}
      </div>
    </div>
  );
};

export default ActivityFeed;