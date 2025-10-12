import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance'; // Assuming this path is correct

// --- API Endpoints ---
const QUESTS_ENDPOINT = '/feedback/quests';
const INSIGHTS_ENDPOINT = '/feedback/insights';
const STREAK_ENDPOINT = '/feedback/streak';
const NOTIFICATIONS_ENDPOINT = '/feedback/notifications';

const ActivityFeed = ({ trainerData }) => {
    // ----------------------------------------------------
    // 1. STATE MANAGEMENT
    // ----------------------------------------------------
    const [activeTab, setActiveTab] = useState('notifications');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data States
    const [notifications, setNotifications] = useState([]);
    const [quests, setQuests] = useState([]);
    const [insights, setInsights] = useState([]);
    const [streakInfo, setStreakInfo] = useState({});

    // ----------------------------------------------------
    // 2. DATA FETCHING LOGIC
    // ----------------------------------------------------

    const fetchData = async (endpoint, setter, fallbackData) => {
        setLoading(true);
        setError(null);
        
        try {
            let params = {};
            // Special handling for notifications to get unread count
            if (endpoint === NOTIFICATIONS_ENDPOINT) {
                // Fetch up to 50 notifications, including read ones for display
                params = { limit: 50 }; 
            }

            const response = await axiosInstance.get(endpoint, { params });
            
            if (response.data.success && response.data.data) {
                // Extract data based on the response structure
                const data = response.data.data[Object.keys(response.data.data)[0]];
                setter(data || []);
            } else {
                throw new Error("Invalid response structure or empty data.");
            }
        } catch (e) {
            console.error(`Error fetching ${endpoint}:`, e);
            setError(`Failed to load ${activeTab}: ${e.response?.data?.message || e.message}`);
            // Fallback to local data on error
            setter(fallbackData); 
        } finally {
            setLoading(false);
        }
    };

    // --- Fetchers triggered by activeTab ---
    const fetchNotifications = () => fetchData(NOTIFICATIONS_ENDPOINT, setNotifications, getDummyNotificationsData());
    const fetchQuests = () => fetchData(QUESTS_ENDPOINT, setQuests, getDummyQuestsData());
    const fetchInsights = () => fetchData(INSIGHTS_ENDPOINT, setInsights, getDummyInsightsData());
    const fetchStreak = () => fetchData(STREAK_ENDPOINT, setStreakInfo, getDummyStreakData());

    // --- useEffect Hook for Tab Switching ---
    useEffect(() => {
        setError(null); // Clear old errors when switching tabs
        switch (activeTab) {
            case 'notifications':
                fetchNotifications();
                break;
            case 'quests':
                fetchQuests();
                break;
            case 'insights':
                fetchInsights();
                break;
            case 'streak':
                fetchStreak();
                break;
            default:
                break;
        }
    }, [activeTab]);

    // ----------------------------------------------------
    // 3. ACTION HANDLERS
    // ----------------------------------------------------

    const markAsRead = async (id, isInsight = false) => {
        const endpoint = isInsight 
            ? `/feedback/insights/${id}/read` 
            : `/feedback/notifications/${id}/read`;
        
        try {
            await axiosInstance.patch(endpoint);
            
            // Optimistically update the local state
            if (isInsight) {
                setInsights(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
            } else {
                setNotifications(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
            }
        } catch (e) {
            console.error("Failed to mark as read:", e);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.patch('/feedback/notifications/read-all');
            // Optimistically update the local state
            setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
        } catch (e) {
            console.error("Failed to mark all as read:", e);
        }
    };

    const claimQuest = async (questId) => {
        try {
            const response = await axiosInstance.post(`/feedback/quests/${questId}/claim`);
            alert(`Rewards claimed! +${response.data.data.xp} XP, +${response.data.data.coins} Coins.`);
            
            // Refresh quests list to show the quest as claimed/removed
            fetchQuests(); 
        } catch (e) {
            alert(`Failed to claim quest: ${e.response?.data?.message || e.message}`);
        }
    };

    // ----------------------------------------------------
    // 4. UTILITY & DUMMY DATA (For fallback)
    // ----------------------------------------------------

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const diffMs = new Date() - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} MIN AGO`;
        if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
        return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
    };

    const getNotificationIcon = (type) => {
        const icons = { level_up: '🎉', quest_complete: '✅', streak_milestone: '🔥', pokemon_catch: '⚡', badge_earned: '🏆', strength: '💪', improvement: '📈', suggestion: '💡' };
        return icons[type] || '📢';
    };
    
    // Fallback Data Functions (Using the original hardcoded arrays)
    const getDummyNotificationsData = () => [
        { _id: "notif_1", type: "level_up", title: "Level Up!", message: "You reached Level 16", isRead: false, createdAt: new Date(new Date() - 3600000).toISOString() },
        { _id: "notif_2", type: "quest_complete", title: "Quest Completed!", message: "Daily Math Challenge completed", isRead: false, createdAt: new Date(new Date() - 5400000).toISOString() },
        { _id: "notif_3", type: "streak_milestone", title: "Streak Milestone!", message: "7-day learning streak achieved!", isRead: true, createdAt: new Date(new Date() - 86400000).toISOString() }
    ];
    const getDummyQuestsData = () => [
        { _id: "quest_1", title: "Complete 3 Quizzes", description: "Complete any 3 quizzes to earn rewards", goal: 3, progress: 2, reward: { xp: 150, coins: 25 }, status: "active", expiresAt: "2024-01-20T23:59:59.000Z" },
        { _id: "quest_2", title: "Math Master", description: "Score 90% or higher in a math quiz", goal: 1, progress: 1, reward: { xp: 200, coins: 50, item: "rare_candy" }, status: "completed", expiresAt: "2024-01-20T23:59:59.000Z" }
    ];
    const getDummyInsightsData = () => [
        { _id: "insight_1", type: "strength", title: "Math Strength", message: "You're excelling in algebra problems!", isRead: false, createdAt: new Date(new Date() - 3600000).toISOString() },
        { _id: "insight_2", type: "improvement", title: "Science Improvement", message: "Your science scores improved by 15% this week", isRead: true, createdAt: new Date(new Date() - 86400000).toISOString() }
    ];
    const getDummyStreakData = () => ({
        currentStreak: 7,
        longestStreak: 12,
        lastActivity: new Date().toISOString(),
        streakHistory: [
            { date: new Date(new Date() - 6 * 86400000).toISOString(), completed: true },
            { date: new Date(new Date() - 5 * 86400000).toISOString(), completed: true },
            { date: new Date(new Date() - 4 * 86400000).toISOString(), completed: true },
            { date: new Date(new Date() - 3 * 86400000).toISOString(), completed: true },
            { date: new Date(new Date() - 2 * 86400000).toISOString(), completed: true },
            { date: new Date(new Date() - 1 * 86400000).toISOString(), completed: true },
            { date: new Date().toISOString(), completed: true }
        ]
    });


    // ----------------------------------------------------
    // 5. RENDER FUNCTIONS
    // ----------------------------------------------------
    const LoadingState = () => (
        <div className="text-center text-xl p-8 text-yellow-300">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-t-4 border-yellow-300 border-opacity-25 rounded-full"></div>
            <p className="mt-2">Fetching {activeTab}...</p>
        </div>
    );
    
    const renderNotifications = () => {
        if (loading) return <LoadingState />;
        
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-yellow-300">Notifications ({notifications.filter(n => !n.isRead).length} unread)</h4>
                    <button
                        onClick={markAllAsRead}
                        disabled={notifications.every(n => n.isRead)}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border-2 border-black font-bold disabled:bg-gray-500"
                    >
                        Mark All Read
                    </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`flex items-start space-x-3 p-3 border-2 rounded shadow-[2px_2px_0_#000] cursor-pointer transition-all ${
                                notification.isRead 
                                    ? 'bg-black/30 border-gray-700' 
                                    : 'bg-yellow-600/20 border-yellow-500'
                            }`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
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
                    )) : (
                        <div className="text-center p-4 text-gray-400">No new notifications.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderQuests = () => {
        if (loading) return <LoadingState />;

        return (
            <div>
                <h4 className="font-bold text-yellow-300 mb-4">Daily Quests</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {quests.length > 0 ? quests.map((quest) => {
                        const progressPercent = Math.min(100, Math.round((quest.progress / quest.goal) * 100)) || 0;
                        const isCompleted = quest.status === 'completed';
                        const isClaimed = quest.status === 'claimed' || (isCompleted && !quest.reward.xp); // Simple proxy for already claimed if no rewards left
                        
                        return (
                            <div
                                key={quest._id}
                                className="bg-black/40 border-2 border-gray-700 p-3 rounded shadow-[2px_2px_0_#000]"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-white">{quest.title}</h5>
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                                        isCompleted ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                    }`}>
                                        {isCompleted ? 'COMPLETED' : 'ACTIVE'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                                
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Progress: {quest.progress}/{quest.goal}</span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 border-2 border-black h-3">
                                        <div 
                                            className="bg-yellow-500 h-full transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="text-green-400">+{quest.reward?.xp || 0} XP</span>
                                        {quest.reward?.coins > 0 && <span className="text-yellow-400 ml-2">+{quest.reward.coins} coins</span>}
                                        {quest.reward?.item && <span className="text-blue-400 ml-2">+{quest.reward.item}</span>}
                                    </div>
                                    {isCompleted && !isClaimed && (
                                        <button
                                            onClick={() => claimQuest(quest._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded border-2 border-black font-bold"
                                        >
                                            Claim
                                        </button>
                                    )}
                                    {isClaimed && (
                                        <span className="text-green-400 text-sm font-bold">✅ Claimed</span>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center p-4 text-gray-400">All quests completed or no quests available!</div>
                    )}
                </div>
            </div>
        );
    };

    const renderInsights = () => {
        if (loading) return <LoadingState />;

        return (
            <div>
                <h4 className="font-bold text-yellow-300 mb-4">Performance Insights</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {insights.length > 0 ? insights.map((insight) => (
                        <div
                            key={insight._id}
                            className={`flex items-start space-x-3 p-3 border-2 rounded shadow-[2px_2px_0_#000] cursor-pointer ${
                                insight.isRead ? 'bg-black/30 border-gray-700' : 'bg-blue-600/20 border-blue-500'
                            }`}
                            onClick={() => !insight.isRead && markAsRead(insight._id, true)}
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
                    )) : (
                        <div className="text-center p-4 text-gray-400">No new insights. Keep studying!</div>
                    )}
                </div>
            </div>
        );
    };

    const renderStreak = () => {
        if (loading) return <LoadingState />;
        
        // Ensure streakInfo has necessary properties, using fallback defaults
        const currentStreak = streakInfo.currentStreak || 0;
        const longestStreak = streakInfo.longestStreak || 0;
        const lastActivity = streakInfo.lastActivity || new Date().toISOString();
        const streakHistory = streakInfo.streakHistory || getDummyStreakData().streakHistory;
        
        return (
            <div>
                <h4 className="font-bold text-yellow-300 mb-4">Learning Streak</h4>
                <div className="bg-black/40 border-2 border-gray-700 p-4 rounded shadow-[2px_2px_0_#000] mb-4">
                    <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-yellow-300 mb-2">{currentStreak}</div>
                        <div className="text-sm text-gray-300">Current Streak (Days)</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-green-400">{longestStreak}</div>
                            <div className="text-xs text-gray-300">Longest Streak</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-blue-400">
                                {formatTime(lastActivity)}
                            </div>
                            <div className="text-xs text-gray-300">Last Activity</div>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 border-2 border-gray-700 p-3 rounded shadow-[2px_2px_0_#000]">
                    <h5 className="font-bold text-white text-center mb-3">This Week</h5>
                    <div className="flex justify-between">
                        {streakHistory.slice(-7).map((day, index) => (
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
    };

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

            {/* Error Display */}
            {error && (
                <div className="text-center p-3 bg-red-800 border-2 border-red-600 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

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