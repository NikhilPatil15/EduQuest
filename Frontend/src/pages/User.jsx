import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import PixelButton from '../components/Dashboard/PixelButton';
import axiosInstance from '../utils/axiosInstance';

// --- API Endpoints ---
const PROFILE_ENDPOINT = '/users/game-profile';
const FRIENDS_ENDPOINT = '/leaderboard/friends';
const FRIEND_REQUESTS_ENDPOINT = '/leaderboard/friends/requests';
const FRIEND_SUGGESTIONS_ENDPOINT = '/leaderboard/friends/suggestions';
const BADGES_ENDPOINT = '/leaderboard/badges';
const BADGE_STATS_ENDPOINT = '/leaderboard/badges/stats';
const SHARES_ENDPOINT = '/leaderboard/shares';

const User = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const rootRef = useRef(null);
    const threeContainerRef = useRef(null);
    const tabContentRef = useRef(null);

    // --- API Data States ---
    const [userData, setUserData] = useState(null);
    const [friendsData, setFriendsData] = useState({ friends: [], requests: [], suggestions: [] });
    const [badgesData, setBadgesData] = useState({ badges: [], stats: {} });
    const [sharesData, setSharesData] = useState({ shares: [] });

    // --- Loading States ---
    const [profileLoading, setProfileLoading] = useState(true);
    const [socialLoading, setSocialLoading] = useState(false);
    const [badgesLoading, setBadgesLoading] = useState(false);
    const [sharesLoading, setSharesLoading] = useState(false);
    
    const [error, setError] = useState(null);

    // --- DUMMY/FALLBACK DATA GETTERS (EXPANDED) ---

    const getDummyUserData = () => ({
        user: {
            userName: "ashketchum", level: 15, xp: 12500, coins: 450, dailyStreak: 7,
            totalQuizzes: 42, correctAnswers: 378, unlockedSubjects: ["Math", "Science", "History", "Coding"],
            avatar: "/tranier.png", joinDate: "2024-01-01T00:00:00.000Z",
            rank: 10, nextLevelXP: 13000, progressToNextLevel: 50,
            totalBattles: 10, battlesWon: 6, longestStreak: 14
        }
    });

    const getDummyFriendsData = () => ({
        friends: [
            { _id: "friend_1", userName: "mistywater", level: 12, xp: 9800, status: "online", avatar: "/trainer1.png", lastActive: "2025-10-13T14:30:00.000Z" },
            { _id: "friend_2", userName: "brockstone", level: 14, xp: 11500, status: "offline", avatar: "/trainer1.png", lastActive: "2025-10-12T20:15:00.000Z" },
            { _id: "friend_3", userName: "garyoak", level: 16, xp: 14500, status: "online", avatar: "/trainer1.png", lastActive: "2025-10-13T15:05:00.000Z" }
        ],
        requests: [
            { _id: "req_1", userName: "dawnlight", level: 11, avatar: "/trainer1.png", sentAt: "2025-10-12T10:30:00.000Z" }
        ],
        suggestions: [
            { _id: "sug_1", userName: "mayberry", level: 13, xp: 10500, avatar: "/trainer1.png", commonSubjects: ["Math", "Science"] },
            { _id: "sug_2", userName: "serenastar", level: 15, xp: 12800, avatar: "/trainer1.png", commonSubjects: ["History"] }
        ]
    });

    const getDummyBadgesData = () => ({
        badges: [
            { _id: "badge_4", name: "Quiz Champion", description: "Win 25 PvP battles", icon: "🏆", progress: 100, unlocked: true, rarity: "epic" },
            { _id: "badge_1", name: "Math Master", description: "Complete 50 math quizzes with 90%+ accuracy", icon: "🧮", progress: 85, unlocked: false, rarity: "rare" },
            { _id: "badge_2", name: "Science Wiz", description: "Unlock all science topics.", icon: "🔬", progress: 40, unlocked: false, rarity: "rare" },
            { _id: "badge_3", name: "Legendary Learner", description: "Reach Level 50.", icon: "🌟", progress: 30, unlocked: false, rarity: "legendary" },
            { _id: "badge_5", name: "First Steps", description: "Complete your first quiz.", icon: "👟", progress: 100, unlocked: true, rarity: "common" },

        ],
        stats: { totalBadges: 10, unlockedBadges: 2, completionRate: 20, epicBadges: 1 }
    });
    
    const getDummySharesData = () => ({
        shares: [
            { _id: "share_1", type: "victory", title: "Quiz Victory!", message: "Scored 95% in Math Quiz!", data: { score: 95, subject: "math", correctAnswers: 19, totalQuestions: 20 }, createdAt: "2025-10-12T14:30:00.000Z", likes: 12, comments: 3 },
            { _id: "share_2", type: "level_up", title: "Leveled Up!", message: "Just reached Level 15! Onwards and upwards!", data: { newLevel: 15 }, createdAt: "2025-10-11T18:00:00.000Z", likes: 25, comments: 6 }
        ]
    });
    
    // --- API Fetch Functions ---

    const fetchProfile = async () => {
        setProfileLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(PROFILE_ENDPOINT);
            if (response.data.success && response.data.data) {
                setUserData({ user: response.data.data });
            } else {
                throw new Error("Invalid response structure from profile API.");
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
            setError(`Failed to load profile. Displaying sample data.`);
            setUserData(getDummyUserData()); 
        } finally {
            setProfileLoading(false);
        }
    };

    const fetchFriends = async () => {
        setSocialLoading(true);
        setError(null);
        try {
            const [friendsRes, requestsRes, suggestionsRes] = await Promise.all([
                axiosInstance.get(FRIENDS_ENDPOINT),
                axiosInstance.get(FRIEND_REQUESTS_ENDPOINT),
                axiosInstance.get(FRIEND_SUGGESTIONS_ENDPOINT),
            ]);

            setFriendsData({
                friends: friendsRes.data?.data?.friends || [],
                requests: requestsRes.data?.data?.requests || [],
                suggestions: suggestionsRes.data?.data?.suggestions || [],
            });
        } catch (e) {
            console.error("Error fetching friends data:", e);
            setError(`Failed to load social data. Displaying sample data.`);
            setFriendsData(getDummyFriendsData());
        } finally {
            setSocialLoading(false);
        }
    };

    const fetchBadges = async () => {
        setBadgesLoading(true);
        setError(null);
        try {
            const [badgesRes, statsRes] = await Promise.all([
                axiosInstance.get(BADGES_ENDPOINT),
                axiosInstance.get(BADGE_STATS_ENDPOINT),
            ]);

            const fetchedBadges = badgesRes.data?.data?.badges;
            const fetchedStats = statsRes.data?.data?.stats;

            if (Array.isArray(fetchedBadges) && fetchedStats) {
                 setBadgesData({
                    badges: fetchedBadges,
                    stats: fetchedStats,
                });
            } else {
                throw new Error("Invalid data structure received from badges API.");
            }

        } catch (e) {
            console.error("Error fetching badges data:", e);
            setError(`Failed to load badges. Displaying sample data as a fallback.`);
            setBadgesData(getDummyBadgesData());
        } finally {
            setBadgesLoading(false);
        }
    };

    const fetchShares = async () => {
        setSharesLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(SHARES_ENDPOINT);
            setSharesData({ shares: response.data?.data?.shares || [] });
        } catch (e) {
            console.error("Error fetching shares:", e);
            setError(`Failed to load shares feed. Displaying sample data.`);
            setSharesData(getDummySharesData());
        } finally {
            setSharesLoading(false);
        }
    };

    // --- useEffect Hooks ---
    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        switch (activeTab) {
            case 'friends':
                if (friendsData.friends.length === 0) fetchFriends();
                break;
            case 'badges':
                if (badgesData.badges.length === 0) fetchBadges();
                break;
            case 'shares':
                if (sharesData.shares.length === 0) fetchShares();
                break;
            default:
                break;
        }
    }, [activeTab]);

    // --- Action Handlers ---
    const handleBack = () => {
        window.history.back();
    };
    
    const sendFriendRequest = async (friendUsername) => {
        try {
            await axiosInstance.post('/leaderboard/friends/request', { friendUsername });
            alert(`Friend request sent to ${friendUsername}!`);
            fetchFriends();
        } catch (e) {
            alert(`Failed to send request: ${e.response?.data?.message || e.message}`);
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            await axiosInstance.post(`/leaderboard/friends/requests/${requestId}/accept`);
            alert(`Friend request accepted!`);
            fetchFriends();
        } catch (e) {
            alert(`Failed to accept request: ${e.response?.data?.message || e.message}`);
        }
    };

    const declineFriendRequest = async (requestId) => {
        try {
            await axiosInstance.delete(`/leaderboard/friends/requests/${requestId}/decline`);
            alert(`Friend request declined.`);
            fetchFriends();
        } catch (e) {
            alert(`Failed to decline request: ${e.response?.data?.message || e.message}`);
        }
    };

    const removeFriend = async (friendId) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        try {
            await axiosInstance.delete(`/leaderboard/friends/${friendId}`);
            alert(`Friend removed.`);
            fetchFriends();
        } catch (e) {
            alert(`Failed to remove friend: ${e.response?.data?.message || e.message}`);
        }
    };

    const shareBadge = async (badgeId) => {
        try {
            await axiosInstance.post(`/leaderboard/badges/share`, { badgeId });
            alert('Badge shared successfully!');
        } catch (e) {
            alert(`Failed to share badge: ${e.response?.data?.message || e.message}`);
        }
    };

    // --- Utility Functions and GSAP ---
    
    useEffect(() => {
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.fromTo('.page-title', 
                  { opacity: 0, y: -50, scale: 0.8 },
                  { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
                );
        
                gsap.fromTo('.tab-button',
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
                );
        
                gsap.fromTo('.tab-content',
                  { opacity: 0, x: 50 },
                  { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
                );
        
                const floatingElements = gsap.utils.toArray('.floating-element');
                floatingElements.forEach((el, i) => {
                  gsap.to(el, {
                    y: gsap.utils.random(-15, 15),
                    x: gsap.utils.random(-10, 10),
                    rotation: gsap.utils.random(-8, 8),
                    repeat: -1,
                    yoyo: true,
                    duration: gsap.utils.random(2, 4),
                    ease: 'sine.inOut',
                    delay: i * 0.2,
                  });
                });
        
                gsap.to('.pulse-glow', {
                  opacity: 0.6,
                  scale: 1.05,
                  repeat: -1,
                  yoyo: true,
                  duration: 2,
                  ease: 'sine.inOut'
                });
        
                (async () => {
                  try {
                    const container = threeContainerRef.current;
                    if (!container) return;
        
                    const pixelationFactor = 4;
                    const scene = new THREE.Scene();
                    scene.background = new THREE.Color('#1a0808');
                    scene.fog = new THREE.Fog('#0d0404', 50, 180);
        
                    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
                    camera.position.set(0, 0, 60);
        
                    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
                    renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor);
                    renderer.setPixelRatio(1);
                    renderer.outputColorSpace = THREE.SRGBColorSpace;
                    container.appendChild(renderer.domElement);
                    renderer.domElement.style.width = '100%';
                    renderer.domElement.style.height = '100%';
                    renderer.domElement.style.imageRendering = 'pixelated';
        
                    const ambient = new THREE.AmbientLight(0xff8844, 0.8);
                    const point = new THREE.PointLight(0xff4411, 2.2, 200);
                    point.position.set(20, 20, 20);
                    scene.add(ambient, point);
        
                    const orbGeo = new THREE.SphereGeometry(3, 16, 16);
                    const orbMat = new THREE.MeshStandardMaterial({ color: '#b30000', emissive: '#ff1a1a', emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.2 });
                    const orbs = Array.from({ length: 6 }, () => {
                      const orb = new THREE.Mesh(orbGeo, orbMat);
                      orb.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, -20 - Math.random() * 40);
                      scene.add(orb);
                      return orb;
                    });
        
                    const particlesCount = 400;
                    const positions = new Float32Array(particlesCount * 3);
                    for (let i = 0; i < particlesCount; i++) {
                        positions[i * 3] = (Math.random() - 0.5) * 200;
                        positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
                        positions[i * 3 + 2] = -50 - Math.random() * 200;
                    }
                    const pGeo = new THREE.BufferGeometry();
                    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const pMat = new THREE.PointsMaterial({ color: 0xff6633, size: 1.4, sizeAttenuation: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 });
                    const points = new THREE.Points(pGeo, pMat);
                    scene.add(points);
        
                    const mouse = new THREE.Vector2(0, 0);
                    const onResize = () => {
                      if (!container) return;
                      camera.aspect = container.clientWidth / container.clientHeight;
                      camera.updateProjectionMatrix();
                      renderer.setSize(container.clientWidth / pixelationFactor, container.clientHeight / pixelationFactor);
                    };
                    const onMove = (e) => {
                      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
                      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
                    };
                    window.addEventListener('resize', onResize);
                    window.addEventListener('mousemove', onMove);
        
                    const clock = new THREE.Clock();
                    let rafId;
                    const animate = () => {
                      const t = clock.getElapsedTime();
                      orbs.forEach((o, i) => {
                        o.position.y += Math.sin(t * 0.8 + i) * 0.02;
                        o.position.x += Math.cos(t * 0.5 + i) * 0.015;
                      });
                      points.rotation.y += 0.0008;
                      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
                      camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05;
                      camera.lookAt(0, 0, -40);
                      renderer.render(scene, camera);
                      rafId = requestAnimationFrame(animate);
                    };
                    animate();
        
                    ctx.add(() => {
                      cancelAnimationFrame(rafId);
                      window.removeEventListener('resize', onResize);
                      window.removeEventListener('mousemove', onMove);
                      renderer.dispose();
                      if (container && renderer.domElement) {
                        container.removeChild(renderer.domElement);
                      }
                    });
                  } catch (e) {
                    console.error("Three.js failed to load:", e);
                  }
                })();
            }, rootRef);
        
            return () => ctx.revert();
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (tabContentRef.current) {
            gsap.fromTo(tabContentRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffHours < 1) return `LESS THAN AN HOUR AGO`;
        if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
        return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
    };

    const getRarityColor = (rarity) => {
        const colors = {
            common: 'text-gray-300', rare: 'text-blue-400', epic: 'text-purple-400', legendary: 'text-yellow-400'
        };
        return colors[rarity] || 'text-gray-300';
    };

    // --- Loading/Error Handler JSX ---
    const LoadingState = ({ message = "Loading data..." }) => (
        <div className="text-center text-xl p-8 text-yellow-300">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-t-4 border-yellow-300 border-opacity-25 rounded-full"></div>
            <p className="mt-2">{message}</p>
        </div>
    );

    const ErrorAlert = () => error && (
        <div className="text-center p-4 bg-red-800 border-2 border-red-600 rounded mb-4">
            ⚠️ {error}
        </div>
    );
    
    // --- Render Functions using State Data ---
    const renderProfile = () => {
        if (profileLoading) return <LoadingState message="Fetching Trainer Profile..." />;
        if (!userData || !userData.user) return <ErrorAlert />;
        
        const user = userData.user;
        const totalQuizzes = user.totalQuizzes || 0;
        const correctAnswers = user.correctAnswers || 0;
        const accuracy = totalQuizzes > 0 ? Math.round((correctAnswers / (totalQuizzes * 10)) * 100) : 0;
        
        return (
            <div ref={tabContentRef} className="space-y-6 tab-content">
                {error && <ErrorAlert />}
                <div id="card-profile" className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000] pixelated-rendering transform-gpu">
                    <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px] pulse-glow"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10"></div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-white border-4 border-black rounded flex items-center justify-center shadow-[4px_4px_0_#000] floating-element">
                                <img src={"/trainer1.png"} alt={user.userName} className="w-16 h-16"/>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-yellow-300 mb-2 capitalize text-shadow-pixel">
                                {user.userName}
                            </h3>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>LEVEL {user.level}</span>
                                    <span>XP: {user.xp.toLocaleString()} / {user.nextLevelXP.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-red-900/50 border-2 border-black h-3 shadow-[2px_2px_0_#000]">
                                    <div className="bg-green-500 h-full" style={{ width: `${user.progressToNextLevel}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {[
                                    { value: `#${user.rank}`, label: 'Rank', color: 'text-white' },
                                    { value: user.coins, label: 'Coins', color: 'text-yellow-400' },
                                    { value: `${user.dailyStreak} days`, label: 'Streak', color: 'text-green-400' },
                                    { value: user.longestStreak, label: 'Longest Streak', color: 'text-red-400' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-red-200">{stat.label}</div>
                                        <div className={`font-bold text-lg ${stat.color}`}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { value: totalQuizzes, label: 'Quizzes Taken', color: 'text-blue-400', icon: '📝' },
                        { value: correctAnswers, label: 'Correct Answers', color: 'text-green-400', icon: '✅' },
                        { value: `${accuracy}%`, label: 'Accuracy', color: 'text-yellow-300', icon: '🎯' },
                        { value: user.totalBattles || 0, label: 'Total Battles', color: 'text-purple-400', icon: '⚔️' },
                        { value: user.battlesWon || 0, label: 'Battles Won', color: 'text-pink-400', icon: '🥇' },
                        { value: user.unlockedSubjects?.length || 0, label: 'Subjects', color: 'text-cyan-400', icon: '📚' }
                    ].map((stat, index) => (
                        <div key={index} className="relative p-4 bg-black/70 border-4 border-red-800/80 shadow-[4px_4px_0_#000] text-center transform-gpu">
                            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px]"></div>
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl font-bold ${stat.color} text-shadow-pixel`}>{stat.value}</div>
                            <div className="text-sm text-red-200">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                    <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
                    <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Unlocked Subjects</h4>
                    <div className="flex flex-wrap gap-3">
                        {user.unlockedSubjects?.map((subject, index) => (
                            <span key={index} className="bg-red-600 text-white px-4 py-2 rounded border-2 border-black font-bold capitalize shadow-[2px_2px_0_#000] floating-element">
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderFriends = () => {
        if (socialLoading) return <LoadingState message="Fetching Friends and Requests..." />;
        const { friends, requests, suggestions } = friendsData;
        return (
            <div ref={tabContentRef} className="space-y-6 tab-content">
                {error && <ErrorAlert />}
                {requests.length > 0 && (
                    <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
                        <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friend Requests ({requests.length})</h4>
                        <div className="space-y-3">
                            {requests.map(request => (
                                <div key={request._id} className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded">
                                    <div className="flex items-center space-x-3">
                                        <img src={request.avatar || "/trainer1.png"} alt={request.userName} className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000]" />
                                        <div>
                                            <div className="font-bold text-white capitalize">{request.userName}</div>
                                            <div className="text-sm text-red-200">Level {request.level}</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <PixelButton onClick={() => acceptFriendRequest(request._id)} className="!px-3 !py-1 !text-sm !bg-green-600 hover:!bg-green-700">Accept</PixelButton>
                                        <PixelButton onClick={() => declineFriendRequest(request._id)} className="!px-3 !py-1 !text-sm">Decline</PixelButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                    <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
                    <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friends ({friends.length})</h4>
                    <div className="space-y-3">
                        {friends.map(friend => (
                            <div key={friend._id} className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img src={friend.avatar || "/trainer1.png"} alt={friend.userName} className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000]" />
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white capitalize">{friend.userName}</div>
                                        <div className="text-sm text-red-200">Level {friend.level} • {friend.xp?.toLocaleString() || 'N/A'} XP</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-red-300">{friend.lastActive ? formatTime(friend.lastActive) : 'Unknown'}</span>
                                    <PixelButton onClick={() => removeFriend(friend._id)} className="!px-3 !py-1 !text-sm">Remove</PixelButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                    <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
                    <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friend Suggestions ({suggestions.length})</h4>
                    <div className="space-y-3">
                        {suggestions.map(suggestion => (
                            <div key={suggestion._id} className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded">
                                <div className="flex items-center space-x-3">
                                    <img src={suggestion.avatar || "/trainer1.png"} alt={suggestion.userName} className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000]" />
                                    <div>
                                        <div className="font-bold text-white capitalize">{suggestion.userName}</div>
                                        <div className="text-sm text-red-200">Level {suggestion.level} • {suggestion.commonSubjects?.join(', ') || 'N/A'}</div>
                                    </div>
                                </div>
                                <PixelButton onClick={() => sendFriendRequest(suggestion.userName)} className="!px-3 !py-1 !text-sm !bg-blue-600 hover:!bg-blue-700">Add Friend</PixelButton>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderBadges = () => {
        if (badgesLoading) return <LoadingState message="Fetching Badges and Stats..." />;
        const { badges, stats } = badgesData;
        
        // Use live stats if available, otherwise calculate from badge list
        const totalBadges = stats.totalBadges ?? badges.length;
        const unlockedBadges = stats.earnedBadges ?? badges.filter(b => b.unlocked).length;
        const completionRate = totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0;
        
        if (!badgesLoading && badges.length === 0) {
            return (
                <div ref={tabContentRef} className="space-y-6 tab-content">
                    {error && <ErrorAlert />}
                    <div className="text-center p-8 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h4 className="text-xl font-bold text-yellow-300 mb-2">Your Badge Case is Empty!</h4>
                        <p className="text-lg text-yellow-200">Complete quizzes and challenges to start earning badges.</p>
                    </div>
                </div>
            );
        }

        return (
            <div ref={tabContentRef} className="space-y-6 tab-content">
                {error && <ErrorAlert />}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { value: `${unlockedBadges}/${totalBadges}`, label: 'Badges Unlocked', color: 'text-yellow-300', icon: '🏆' },
                        { value: `${completionRate}%`, label: 'Completion', color: 'text-green-400', icon: '📊' },
                        { value: stats.byRarity?.find(r => r.rarity === 'epic')?.count || 0, label: 'Epic Badges', color: 'text-purple-400', icon: '⭐' }
                    ].map((stat, index) => (
                        <div key={index} className="relative p-4 bg-black/70 border-4 border-red-800/80 shadow-[4px_4px_0_#000] text-center">
                            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px]"></div>
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl font-bold text-shadow-pixel ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-red-200">{stat.label}</div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => (
                        <div key={badge._id} className={`relative p-4 border-4 shadow-[4px_4px_0_#000] ${badge.unlocked ? 'bg-green-900/50 border-green-600' : 'bg-black/70 border-red-800/80'}`}>
                            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px]"></div>
                            <div className="text-center">
                                <div className="text-4xl mb-2 floating-element">{badge.icon}</div>
                                <h5 className={`font-bold text-lg mb-1 ${getRarityColor(badge.rarity)} text-shadow-pixel`}>{badge.name}</h5>
                                <p className="text-sm text-red-200 mb-3">{badge.description}</p>
                                {!badge.unlocked && (
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Progress</span>
                                            <span>{badge.progress}%</span>
                                        </div>
                                        <div className="w-full bg-red-900/50 border-2 border-black h-2">
                                            <div className="bg-yellow-500 h-full" style={{ width: `${badge.progress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs font-bold px-2 py-1 rounded border-2 border-black ${
                                        badge.rarity === 'common' ? 'bg-gray-600' :
                                        badge.rarity === 'rare' ? 'bg-blue-600' :
                                        badge.rarity === 'epic' ? 'bg-purple-600' : 'bg-yellow-600'
                                    }`}>{badge.rarity.toUpperCase()}</span>
                                    {badge.unlocked && (
                                        <PixelButton onClick={() => shareBadge(badge._id)} className="!px-3 !py-1 !text-sm !bg-green-600 hover:!bg-green-700">Share</PixelButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderShares = () => {
        if (sharesLoading) return <LoadingState message="Fetching Trainer Shares..." />;
        const { shares } = sharesData;
        return (
            <div ref={tabContentRef} className="space-y-4 tab-content">
                {error && <ErrorAlert />}
                {shares.length > 0 ? shares.map(share => (
                    <div key={share._id} className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
                        <div className="flex items-start space-x-4">
                            <div className="text-3xl floating-element">
                                {share.type === 'victory' && '🏆'}
                                {share.type === 'level_up' && '🎉'}
                                {share.type === 'badge_unlock' && '🌟'}
                                {!['victory', 'level_up', 'badge_unlock'].includes(share.type) && '📢'} 
                            </div>
                            <div className="flex-1">
                                <h5 className="font-bold text-yellow-300 text-lg mb-1 text-shadow-pixel">{share.title}</h5>
                                <p className="text-white mb-2">{share.message}</p>
                                <div className="text-sm text-red-200 mb-3">{formatTime(share.createdAt)} • 👍 {share.likes || 0} • 💬 {share.comments || 0}</div>
                                {share.type === 'victory' && share.data && (
                                    <div className="bg-red-900/30 p-3 rounded border border-red-700">
                                        <div className="text-sm">
                                            <span className="text-green-400">{share.data.score}% Score</span> • 
                                            <span className="text-blue-400 ml-2">{share.data.correctAnswers}/{share.data.totalQuestions} Correct</span> • 
                                            <span className="text-yellow-400 ml-2 capitalize">{share.data.subject}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-8 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
                        <p className="text-lg text-yellow-200">No shares found. Go complete a quiz or win a battle to share your success!</p>
                    </div>
                )}
            </div>
        );
    };

    // --- Main Component Render ---
    return (
        <div ref={rootRef} className="min-h-screen text-white overflow-hidden relative font-pixel bg-[#1a0a0a] p-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                .font-pixel { font-family: 'Press Start 2P', cursive; }
                .text-shadow-pixel { text-shadow: 2px 2px 0 #000; }
                .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
                .dither-overlay { background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%); background-size: 4px 4px; background-position: 0 0, 2px 2px; }
                .transform-gpu { transform: translateZ(0); }
            `}</style>

            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
            <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div>
            <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
            <div ref={threeContainerRef} className="absolute inset-0 -z-10"></div>
            
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" alt="Pikachu" className="floating-element absolute top-4 right-8 w-20 h-20 pixelated-rendering drop-shadow-[4px_4px_0_#000]" />

            <div className="max-w-6xl mx-auto">
                <div className="relative flex justify-center items-center mb-8 page-title">
                     <PixelButton 
                        onClick={handleBack}
                        className="!absolute left-0 top-1/2 -translate-y-1/2 !bg-gray-700 hover:!bg-gray-600 !px-4 !py-2"
                    >
                        ← Back
                    </PixelButton>
                    <h2 className="text-3xl font-bold text-center text-yellow-300 text-shadow-pixel bg-red-800/30 px-6 py-3 rounded border-4 border-red-700">
                        👤 TRAINER PROFILE
                    </h2>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {[
                        { key: 'profile', label: '👤 Profile', color: 'bg-red-600' },
                        { key: 'friends', label: '👥 Friends', color: 'bg-blue-600' },
                        { key: 'badges', label: '🏆 Badges', color: 'bg-yellow-600' },
                        { key: 'shares', label: '📢 Shares', color: 'bg-green-600' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-3 rounded-lg border-4 border-black font-bold transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-1 tab-button ${ activeTab === tab.key ? `${tab.color} text-white shadow-[6px_6px_0_#000]` : 'bg-gray-700 text-white hover:bg-gray-600 shadow-[6px_6px_0_#000]' }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'friends' && renderFriends()}
                    {activeTab === 'badges' && renderBadges()}
                    {activeTab === 'shares' && renderShares()}
                </div>
            </div>
        </div>
    );
};

export default User;