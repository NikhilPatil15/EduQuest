import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import PixelButton from '../components/Dashboard/PixelButton';

const User = ({ trainerData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hoveredCard, setHoveredCard] = useState(null);
  const rootRef = useRef(null);
  const threeContainerRef = useRef(null);
  const tabContentRef = useRef(null);

  // Dummy user data matching API structure
  const userData = {
    user: {
      userName: "ashketchum",
      level: 15,
      xp: 12500,
      coins: 450,
      dailyStreak: 7,
      totalQuizzes: 42,
      correctAnswers: 315,
      unlockedSubjects: ["math", "science", "history"],
      avatar: "/tranier.png",
      joinDate: "2024-01-01T00:00:00.000Z"
    }
  };

  // Dummy friends data
  const friendsData = {
    friends: [
      {
        _id: "friend_1",
        userName: "mistywater",
        level: 12,
        xp: 9800,
        status: "online",
        avatar: "tranier.png",
        lastActive: "2024-01-20T15:30:00.000Z"
      },
      {
        _id: "friend_2",
        userName: "brockstone",
        level: 14,
        xp: 11500,
        status: "offline",
        avatar: "tranier.png",
        lastActive: "2024-01-19T20:15:00.000Z"
      },
      {
        _id: "friend_3",
        userName: "garyoak",
        level: 16,
        xp: 13500,
        status: "online",
        avatar: "tranier.png",
        lastActive: "2024-01-20T14:45:00.000Z"
      }
    ],
    requests: [
      {
        _id: "req_1",
        userName: "dawnlight",
        level: 11,
        avatar: "tranier.png",
        sentAt: "2024-01-20T10:30:00.000Z"
      }
    ],
    suggestions: [
      {
        _id: "sug_1",
        userName: "mayberry",
        level: 13,
        xp: 10500,
        avatar: "tranier.png",
        commonSubjects: ["math", "science"]
      },
      {
        _id: "sug_2",
        userName: "maxmaple",
        level: 10,
        xp: 8500,
        avatar: "tranier.png",
        commonSubjects: ["history"]
      }
    ]
  };

  // Dummy badges data
  const badgesData = {
    badges: [
      {
        _id: "badge_1",
        name: "Math Master",
        description: "Complete 50 math quizzes with 90%+ accuracy",
        icon: "🧮",
        progress: 85,
        unlocked: false,
        rarity: "rare"
      },
      {
        _id: "badge_2",
        name: "Science Whiz",
        description: "Score 100% in 10 science quizzes",
        icon: "🔬",
        progress: 60,
        unlocked: false,
        rarity: "common"
      },
      {
        _id: "badge_3",
        name: "History Buff",
        description: "Complete all history modules",
        icon: "📜",
        progress: 30,
        unlocked: false,
        rarity: "common"
      },
      {
        _id: "badge_4",
        name: "Quiz Champion",
        description: "Win 25 PvP battles",
        icon: "🏆",
        progress: 100,
        unlocked: true,
        rarity: "epic"
      },
      {
        _id: "badge_5",
        name: "Pokémon Collector",
        description: "Catch 20 different Pokémon",
        icon: "⚡",
        progress: 75,
        unlocked: false,
        rarity: "rare"
      },
      {
        _id: "badge_6",
        name: "Streak Master",
        description: "Maintain a 30-day learning streak",
        icon: "🔥",
        progress: 23,
        unlocked: false,
        rarity: "legendary"
      }
    ],
    stats: {
      totalBadges: 1,
      unlockedBadges: 1,
      completionRate: 17,
      rareBadges: 0,
      epicBadges: 1,
      legendaryBadges: 0
    }
  };

  // Dummy shares data
  const sharesData = {
    shares: [
      {
        _id: "share_1",
        type: "victory",
        title: "Quiz Victory!",
        message: "Scored 95% in Math Quiz!",
        data: {
          score: 95,
          subject: "math",
          correctAnswers: 19,
          totalQuestions: 20
        },
        createdAt: "2024-01-20T14:30:00.000Z",
        likes: 12,
        comments: 3
      },
      {
        _id: "share_2",
        type: "level_up",
        title: "Level Up!",
        message: "Reached Level 15!",
        data: {
          level: 15
        },
        createdAt: "2024-01-19T09:15:00.000Z",
        likes: 8,
        comments: 2
      },
      {
        _id: "share_3",
        type: "pokemon_catch",
        title: "New Pokémon!",
        message: "Caught Mathchu!",
        data: {
          pokemonName: "Mathchu",
          rarity: "common"
        },
        createdAt: "2024-01-18T16:45:00.000Z",
        likes: 15,
        comments: 5
      }
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Initial page load animation
        gsap.fromTo('.page-title', 
          { opacity: 0, y: -50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
        );

        gsap.fromTo('.tab-button',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );

        // Tab content animation
        gsap.fromTo('.tab-content',
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
        );

        // Enhanced floating animations
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

        // Pulsing glow effect for main cards
        gsap.to('.pulse-glow', {
          opacity: 0.6,
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: 'sine.inOut'
        });

        // Three.js Background
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

  // Animation when tab changes
  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(tabContentRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
    
    // Hover animation
    const card = document.getElementById(`card-${cardId}`);
    if (card) {
      gsap.to(card, {
        scale: 1.02,
        y: -5,
        rotationY: 5,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleCardLeave = (cardId) => {
    setHoveredCard(null);
    
    const card = document.getElementById(`card-${cardId}`);
    if (card) {
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleButtonHover = (button) => {
    gsap.to(button, {
      scale: 1.05,
      y: -2,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleButtonLeave = (button) => {
    gsap.to(button, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const sendFriendRequest = (username) => {
    console.log('Sending friend request to:', username);
  };

  const acceptFriendRequest = (requestId) => {
    console.log('Accepting friend request:', requestId);
  };

  const declineFriendRequest = (requestId) => {
    console.log('Declining friend request:', requestId);
  };

  const removeFriend = (friendId) => {
    console.log('Removing friend:', friendId);
  };

  const shareBadge = (badgeId) => {
    console.log('Sharing badge:', badgeId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
    return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
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

  const renderProfile = () => (
    <div ref={tabContentRef} className="space-y-6 tab-content">
      {/* User Card with enhanced hover */}
      <div 
        id="card-profile"
        className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000] pixelated-rendering transform-gpu cursor-pointer hover:shadow-[12px_12px_0_#000] transition-all duration-300"
        onMouseEnter={() => handleCardHover('profile')}
        onMouseLeave={() => handleCardLeave('profile')}
      >
        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px] pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded"></div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white border-4 border-black rounded flex items-center justify-center shadow-[4px_4px_0_#000] floating-element">
              <img 
                src={userData.user.avatar}
                alt={userData.user.userName}
                className="w-16 h-16 transform-gpu hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-yellow-300 mb-2 capitalize text-shadow-pixel hover:text-yellow-200 transition-colors duration-300">
              {userData.user.userName}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { value: userData.user.level, label: 'Level', color: 'text-white' },
                { value: userData.user.xp.toLocaleString(), label: 'XP', color: 'text-white' },
                { value: userData.user.coins, label: 'Coins', color: 'text-yellow-400' },
                { value: `${userData.user.dailyStreak} days`, label: 'Streak', color: 'text-green-400' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-red-200 group-hover:text-red-100 transition-colors duration-300">{stat.label}</div>
                  <div className={`font-bold text-lg ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with individual hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: userData.user.totalQuizzes, label: 'Quizzes Taken', color: 'text-blue-400', icon: '📝' },
          { value: userData.user.correctAnswers, label: 'Correct Answers', color: 'text-green-400', icon: '✅' },
          { value: Math.round((userData.user.correctAnswers / (userData.user.totalQuizzes * 10)) * 100) + '%', label: 'Accuracy', color: 'text-yellow-300', icon: '🎯' },
          { value: userData.user.unlockedSubjects.length, label: 'Subjects', color: 'text-purple-400', icon: '📚' }
        ].map((stat, index) => (
          <div 
            key={index}
            id={`card-stat-${index}`}
            className="relative p-4 bg-black/70 border-4 border-red-800/80 shadow-[4px_4px_0_#000] text-center transform-gpu cursor-pointer group hover:border-yellow-500 transition-all duration-300"
            onMouseEnter={() => handleCardHover(`stat-${index}`)}
            onMouseLeave={() => handleCardLeave(`stat-${index}`)}
          >
            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px] group-hover:border-yellow-400/60 transition-all duration-300"></div>
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} text-shadow-pixel group-hover:scale-105 transition-transform duration-300`}>{stat.value}</div>
            <div className="text-sm text-red-200 group-hover:text-yellow-200 transition-colors duration-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Unlocked Subjects with bounce animation */}
      <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
        <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Unlocked Subjects</h4>
        <div className="flex flex-wrap gap-3">
          {userData.user.unlockedSubjects.map((subject, index) => (
            <span 
              key={index}
              className="bg-red-600 text-white px-4 py-2 rounded border-2 border-black font-bold capitalize shadow-[2px_2px_0_#000] floating-element hover:bg-red-500 hover:scale-105 hover:shadow-[4px_4px_0_#000] transition-all duration-300 cursor-pointer transform-gpu"
              onMouseEnter={(e) => {
                gsap.to(e.target, {
                  scale: 1.1,
                  y: -3,
                  duration: 0.2,
                  ease: 'back.out(1.7)'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.target, {
                  scale: 1,
                  y: 0,
                  duration: 0.2,
                  ease: 'power2.out'
                });
              }}
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFriends = () => (
    <div ref={tabContentRef} className="space-y-6 tab-content">
      {/* Friend Requests */}
      {friendsData.requests.length > 0 && (
        <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
          <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
          <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friend Requests</h4>
          <div className="space-y-3">
            {friendsData.requests.map(request => (
              <div 
                key={request._id}
                className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded transform-gpu hover:bg-red-800/40 hover:scale-[1.02] hover:border-yellow-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={request.avatar} 
                    alt={request.userName} 
                    className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000] hover:scale-110 transition-transform duration-300" 
                  />
                  <div>
                    <div className="font-bold text-white capitalize hover:text-yellow-300 transition-colors duration-300">{request.userName}</div>
                    <div className="text-sm text-red-200">Level {request.level}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onMouseEnter={(e) => handleButtonHover(e.target)}
                    onMouseLeave={(e) => handleButtonLeave(e.target)}
                    onClick={() => acceptFriendRequest(request._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded border-2 border-black font-bold shadow-[2px_2px_0_#000] transform-gpu"
                  >
                    Accept
                  </button>
                  <button 
                    onMouseEnter={(e) => handleButtonHover(e.target)}
                    onMouseLeave={(e) => handleButtonLeave(e.target)}
                    onClick={() => declineFriendRequest(request._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border-2 border-black font-bold shadow-[2px_2px_0_#000] transform-gpu"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
        <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friends ({friendsData.friends.length})</h4>
        <div className="space-y-3">
          {friendsData.friends.map(friend => (
            <div 
              key={friend._id}
              className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded transform-gpu hover:bg-red-800/40 hover:scale-[1.02] hover:border-yellow-500 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={friend.avatar} 
                    alt={friend.userName} 
                    className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000] group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black animate-pulse ${
                    friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <div>
                  <div className="font-bold text-white capitalize group-hover:text-yellow-300 transition-colors duration-300">{friend.userName}</div>
                  <div className="text-sm text-red-200">Level {friend.level} • {friend.xp.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-300 group-hover:text-yellow-300 transition-colors duration-300">{formatTime(friend.lastActive)}</span>
                <button 
                  onMouseEnter={(e) => handleButtonHover(e.target)}
                  onMouseLeave={(e) => handleButtonLeave(e.target)}
                  onClick={() => removeFriend(friend._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border-2 border-black font-bold shadow-[2px_2px_0_#000] transform-gpu"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Suggestions */}
      <div className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000]">
        <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px]"></div>
        <h4 className="text-xl font-bold text-yellow-300 mb-4 text-shadow-pixel">Friend Suggestions</h4>
        <div className="space-y-3">
          {friendsData.suggestions.map(suggestion => (
            <div 
              key={suggestion._id}
              className="flex items-center justify-between p-3 bg-red-900/30 border-2 border-red-700 rounded transform-gpu hover:bg-red-800/40 hover:scale-[1.02] hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={suggestion.avatar} 
                  alt={suggestion.userName} 
                  className="w-12 h-12 border-2 border-black rounded shadow-[2px_2px_0_#000] hover:scale-110 transition-transform duration-300" 
                />
                <div>
                  <div className="font-bold text-white capitalize hover:text-blue-300 transition-colors duration-300">{suggestion.userName}</div>
                  <div className="text-sm text-red-200">Level {suggestion.level} • {suggestion.commonSubjects.join(', ')}</div>
                </div>
              </div>
              <button 
                onMouseEnter={(e) => handleButtonHover(e.target)}
                onMouseLeave={(e) => handleButtonLeave(e.target)}
                onClick={() => sendFriendRequest(suggestion.userName)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded border-2 border-black font-bold shadow-[2px_2px_0_#000] transform-gpu"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div ref={tabContentRef} className="space-y-6 tab-content">
      {/* Badge Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { value: `${badgesData.stats.unlockedBadges}/${badgesData.stats.totalBadges}`, label: 'Badges Unlocked', color: 'text-yellow-300', icon: '🏆' },
          { value: `${badgesData.stats.completionRate}%`, label: 'Completion', color: 'text-green-400', icon: '📊' },
          { value: badgesData.stats.epicBadges, label: 'Epic Badges', color: 'text-purple-400', icon: '⭐' }
        ].map((stat, index) => (
          <div 
            key={index}
            className="relative p-4 bg-black/70 border-4 border-red-800/80 shadow-[4px_4px_0_#000] text-center transform-gpu hover:scale-105 hover:border-yellow-500 transition-all duration-300 cursor-pointer group"
          >
            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px] group-hover:border-yellow-400/60 transition-all duration-300"></div>
            <div className="text-2xl mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} text-shadow-pixel group-hover:scale-105 transition-transform duration-300`}>{stat.value}</div>
            <div className="text-sm text-red-200 group-hover:text-yellow-200 transition-colors duration-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Badges Grid with enhanced hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badgesData.badges.map(badge => (
          <div 
            key={badge._id}
            id={`card-badge-${badge._id}`}
            className={`relative p-4 border-4 shadow-[4px_4px_0_#000] transform-gpu cursor-pointer group hover:scale-105 hover:shadow-[8px_8px_0_#000] transition-all duration-500 ${
              badge.unlocked 
                ? 'bg-green-900/50 border-green-600 hover:border-green-400 hover:bg-green-800/60' 
                : 'bg-black/70 border-red-800/80 hover:border-yellow-500'
            }`}
            onMouseEnter={() => handleCardHover(`badge-${badge._id}`)}
            onMouseLeave={() => handleCardLeave(`badge-${badge._id}`)}
          >
            <div className="absolute -inset-1 border-2 border-red-400/40 blur-[1px] group-hover:border-yellow-400/60 transition-all duration-300"></div>
            <div className="text-center">
              <div className="text-4xl mb-2 floating-element group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                {badge.icon}
              </div>
              <h5 className={`font-bold text-lg mb-1 ${getRarityColor(badge.rarity)} text-shadow-pixel group-hover:scale-105 transition-transform duration-300`}>
                {badge.name}
              </h5>
              <p className="text-sm text-red-200 mb-3 group-hover:text-yellow-200 transition-colors duration-300">{badge.description}</p>
              
              {!badge.unlocked && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-200 group-hover:text-yellow-200 transition-colors duration-300">Progress</span>
                    <span className="text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">{badge.progress}%</span>
                  </div>
                  <div className="w-full bg-red-900/50 border-2 border-black h-2 group-hover:bg-red-800/60 transition-colors duration-300">
                    <div 
                      className="bg-yellow-500 h-full transition-all duration-500 group-hover:bg-yellow-400"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2 py-1 rounded border-2 border-black transform-gpu group-hover:scale-105 transition-transform duration-300 ${
                  badge.rarity === 'common' ? 'bg-gray-600' :
                  badge.rarity === 'rare' ? 'bg-blue-600' :
                  badge.rarity === 'epic' ? 'bg-purple-600' : 'bg-yellow-600'
                }`}>
                  {badge.rarity.toUpperCase()}
                </span>
                {badge.unlocked && (
                  <button 
                    onMouseEnter={(e) => handleButtonHover(e.target)}
                    onMouseLeave={(e) => handleButtonLeave(e.target)}
                    onClick={() => shareBadge(badge._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded border-2 border-black font-bold shadow-[2px_2px_0_#000] transform-gpu"
                  >
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderShares = () => (
    <div ref={tabContentRef} className="space-y-4 tab-content">
      {sharesData.shares.map(share => (
        <div 
          key={share._id}
          id={`card-share-${share._id}`}
          className="relative p-6 bg-black/70 border-4 border-red-800/80 shadow-[8px_8px_0_#000] transform-gpu cursor-pointer hover:scale-[1.02] hover:border-yellow-500 hover:shadow-[12px_12px_0_#000] transition-all duration-300 group"
          onMouseEnter={() => handleCardHover(`share-${share._id}`)}
          onMouseLeave={() => handleCardLeave(`share-${share._id}`)}
        >
          <div className="absolute -inset-1 border-2 border-red-400/60 blur-[1px] group-hover:border-yellow-400/60 transition-all duration-300"></div>
          <div className="flex items-start space-x-4">
            <div className="text-3xl floating-element group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              {share.type === 'victory' && '🏆'}
              {share.type === 'level_up' && '🎉'}
              {share.type === 'pokemon_catch' && '⚡'}
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-yellow-300 text-lg mb-1 text-shadow-pixel group-hover:text-yellow-200 transition-colors duration-300">{share.title}</h5>
              <p className="text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">{share.message}</p>
              <div className="text-sm text-red-200 mb-3 group-hover:text-yellow-200 transition-colors duration-300">
                {formatTime(share.createdAt)} • 👍 {share.likes} • 💬 {share.comments}
              </div>
              {share.type === 'victory' && (
                <div className="bg-red-900/30 p-3 rounded border border-red-700 group-hover:bg-red-800/40 group-hover:border-yellow-500 transition-all duration-300">
                  <div className="text-sm">
                    <span className="text-green-400 group-hover:text-green-300 transition-colors duration-300">{share.data.score}% Score</span> • 
                    <span className="text-blue-400 ml-2 group-hover:text-blue-300 transition-colors duration-300">{share.data.correctAnswers}/{share.data.totalQuestions} Correct</span> • 
                    <span className="text-yellow-400 ml-2 capitalize group-hover:text-yellow-300 transition-colors duration-300">{share.data.subject}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="min-h-screen text-white overflow-hidden relative font-pixel p-4">
      {/* Styles matching LoginPage */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .text-shadow-pixel { text-shadow: 4px 4px 0 #000; }
        .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }
        .dither-overlay {
          background-image: linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%);
          background-size: 4px 4px;
          background-position: 0 0, 2px 2px;
        }
        .transform-gpu { transform: translateZ(0); }
      `}</style>

      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.4),rgba(179,0,0,0.25),transparent_70%),linear-gradient(180deg,#0a0303_0%,#1a0a0a_50%,#2d0f0f_100%)]"></div>
      <div aria-hidden className="dither-overlay absolute inset-0 -z-10 opacity-70"></div>
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
      <div ref={threeContainerRef} className="absolute inset-0 -z-10"></div>

      {/* Enhanced decorative elements */}
      <div className="floating-element absolute top-8 left-8 w-12 h-12 bg-red-500 rounded-full border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center hover:scale-110 hover:rotate-12 transition-transform duration-300 cursor-pointer">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" className="w-8 h-8 pixelated-rendering" />
      </div>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" alt="Pikachu" className="floating-element absolute top-4 right-8 w-20 h-20 pixelated-rendering drop-shadow-[4px_4px_0_#000] hover:scale-110 transition-transform duration-300 cursor-pointer" />
      <div className="floating-element absolute bottom-8 right-8 w-10 h-10 bg-red-500 rounded-full border-4 border-black shadow-[4px_4px_0_#000] hover:scale-110 hover:bg-yellow-500 transition-all duration-300 cursor-pointer"></div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-300 text-shadow-pixel bg-red-800/30 px-6 py-3 rounded border-4 border-red-700 page-title hover:scale-105 hover:border-yellow-500 transition-all duration-300 cursor-pointer">
          👤 TRAINER PROFILE
        </h2>
        
        {/* Enhanced Tab Navigation */}
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
              className={`px-6 py-3 rounded-lg border-4 border-black font-bold transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-1 tab-button ${
                activeTab === tab.key 
                  ? `${tab.color} text-white shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]` 
                  : 'bg-gray-700 text-white hover:bg-gray-600 shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#222]'
              }`}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  gsap.to(e.target, {
                    y: -3,
                    duration: 0.2,
                    ease: 'power2.out'
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  gsap.to(e.target, {
                    y: 0,
                    duration: 0.2,
                    ease: 'power2.out'
                  });
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
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