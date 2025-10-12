import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Assuming correct path
import PixelButton from './PixelButton'; // Assuming PixelButton path is correct

// --- API Endpoint ---
const PROFILE_ENDPOINT = '/users/game-profile';

// --- Loading Component ---
const LoadingProfile = () => (
    <div className="trainer-profile flex items-center space-x-4 bg-[#400000] border-4 border-[#ffcc00] p-4 rounded-lg shadow-[6px_6px_0_#000] text-sm text-gray-300 animate-pulse">
        <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
        <div className="flex flex-col space-y-2 w-32">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-600 rounded w-2/3"></div>
        </div>
    </div>
);

// ------------------------------------------------------------------
// 1. TrainerProfile Component (Presentation) - REMAINS THE SAME
// ------------------------------------------------------------------

const TrainerProfile = ({ trainerData }) => {
    const navigate = useNavigate();

    // Helper function to handle undefined/null data gracefully
    if (!trainerData) return null;

    // Animated trainer sprites (uses mock paths)
    const getTrainerGif = (level, badges) => {
        const trainers = {
            beginner: '/tranier.png',
            ace: '/tranier.png',
            veteran: '/tranier.png',
            champion: '/tranier.png'
        };

        if (level >= 25 || badges >= 8) return trainers.champion;
        if (level >= 20 || badges >= 6) return trainers.veteran;
        if (level >= 15 || badges >= 4) return trainers.ace;
        return trainers.beginner;
    };

    // Get border color based on trainer level
    const getBorderColor = (level) => {
        if (level >= 25) return 'border-[#ffd700]'; // Gold
        if (level >= 20) return 'border-[#c0c0c0]'; // Silver
        if (level >= 15) return 'border-[#cd7f32]'; // Bronze
        return 'border-[#ffcc00]'; // Default yellow
    };

    // Get background glow based on streak
    const getStreakGlow = (streak) => {
        if (streak >= 7) return 'shadow-[0_0_20px_rgba(255,100,0,0.7)]';
        if (streak >= 3) return 'shadow-[0_0_15px_rgba(255,200,0,0.5)]';
        return '';
    };
    
    // Ensure data fields exist, using 0/defaults for safety
    const level = trainerData.level || 1;
    const xp = trainerData.xp || 0;
    const coins = trainerData.coins || 0;
    const dailyStreak = trainerData.dailyStreak || 0;
    const badges = trainerData.badges || 0;
    const nextLevelXP = trainerData.nextLevelXP || 1000;
    const progressToNextLevel = trainerData.progressToNextLevel || 0;
    const userName = trainerData.userName || 'New Trainer';

    return (
        <div 
            onClick={() => navigate('/user')} 
            className={`trainer-profile flex items-center space-x-4 bg-[#400000] border-4 ${getBorderColor(level)} p-4 rounded-lg shadow-[6px_6px_0_#000] floating-element cursor-pointer hover:shadow-[8px_8px_0_#cc0000] hover:scale-[1.02] transition-all duration-200 ${getStreakGlow(dailyStreak)}`}
        >
            <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ffcc00] to-[#ffaa00] border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000] animate-pulse">
                    <img 
                        src={'/trainer1.png'}
                        alt="Trainer"
                        className="w-14 h-14 pixelated-rendering transform hover:scale-110 transition-transform duration-300"
                    />
                </div>
                {/* Level badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0_#000]">
                    <span className="text-xs font-bold text-white">{level}</span>
                </div>
            </div>
            
            <div className="text-right">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-[#ffcc00] text-shadow-pixel text-lg"></span>
                    <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent capitalize">
                        {userName}
                    </span>
                </div>
                
                {/* XP Progress */}
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-300 font-bold">XP</span>
                    <div className="flex-1 bg-[#300000] border-2 border-black h-3 shadow-[2px_2px_0_#000]">
                        <div 
                            className="progress-bar bg-gradient-to-r from-[#00cc00] to-[#00ff00] h-full pixelated-rendering"
                            style={{ width: `${progressToNextLevel}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-[#ffcc00] font-bold">
                        {progressToNextLevel}%
                    </span>
                </div>
                
                {/* Stats Row */}
                <div className="flex items-center space-x-2 text-xs font-bold tracking-wider">
                    <span className="flex items-center bg-gradient-to-r from-[#cc0000] to-[#ff0000] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
                        <span className="text-[#ffcc00] mr-1">★</span>
                        {badges}
                    </span>
                    <span className="flex items-center bg-gradient-to-r from-[#0066cc] to-[#0088ff] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
                        <span className="text-white mr-1">🔥</span>
                        {dailyStreak}
                    </span>
                    <span className="flex items-center bg-gradient-to-r from-[#ffcc00] to-[#ffaa00] px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
                        <span className="text-[#cc0000] mr-1">$</span>
                        {coins.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// 2. Header Component (Presentation) - UPDATED TO TAKE LOADING STATE
// ------------------------------------------------------------------

const Header = ({ navigate, trainerData, isLoading }) => (
    <header className=" top-0 z-40 bg-gradient-to-r from-black/80 via-red-900/20 to-black/80 backdrop-blur-md border-b-4 border-[#ffcc00] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <PixelButton onClick={() => navigate('/')} className="text-sm py-2">
                    ◀️ HOME
                </PixelButton>
                <span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">
                    EDUQUEST TRAINER
                </span>
            </div>

            {isLoading ? <LoadingProfile /> : <TrainerProfile trainerData={trainerData} />}
        </div>
    </header>
);


// ------------------------------------------------------------------
// 3. HeaderContainer Component (Logic) - NEW
// ------------------------------------------------------------------

const HeaderContainer = () => {
    const navigate = useNavigate();
    const [trainerData, setTrainerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrainerProfile = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(PROFILE_ENDPOINT);
            
            if (response.data.success && response.data.data) {
                const apiUser = response.data.data;
                
                // Map API response to the expected TrainerProfile structure
                setTrainerData({
                    userName: apiUser.userName,
                    level: apiUser.level,
                    xp: apiUser.xp,
                    coins: apiUser.coins,
                    dailyStreak: apiUser.dailyStreak,
                    // Calculate XP progress and percentage based on new fields
                    nextLevelXP: apiUser.nextLevelXP,
                    progressToNextLevel: apiUser.progressToNextLevel, 
                    // Badges and name need to be simulated or fetched separately if not in this endpoint
                    badges: apiUser.badges || 0, // Assuming badges is 0 if missing
                    name: apiUser.fullName || apiUser.userName, // Use fullName or userName
                });
            } else {
                throw new Error('Invalid API response structure.');
            }
        } catch (error) {
            console.error("Error fetching trainer data:", error);
            // Fallback to a minimal error state or default data
            setTrainerData({
                userName: 'Error', level: 1, xp: 0, coins: 0, dailyStreak: 0, badges: 0,
                nextLevelXP: 1000, progressToNextLevel: 0, name: 'Error Trainer'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainerProfile();
    }, []);

    return <Header navigate={navigate} trainerData={trainerData} isLoading={isLoading} />;
};

export default HeaderContainer;