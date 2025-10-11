import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// --- Custom CSS Utility Classes (You need to define these in your main CSS file) ---
// .pixel-font, .text-shadow-pixel, .pixel-box, .pixel-button-shadow, .pixel-hit-text, @keyframes hit-pulse
// ----------------------------------------------------------------

// Helper to apply the pixel-font class
const P = (props) => <p className="pixel-font" {...props} />;
const H2 = (props) => <h2 className="pixel-font" {...props} />;
const H3 = (props) => <h3 className="pixel-font" {...props} />;
const H4 = (props) => <h4 className="pixel-font" {...props} />;

// ----------------------------------------------------------------
// NEW CHATBOX COMPONENT
// ----------------------------------------------------------------

const ChatBox = ({ opponentName, chatMessages, onChatSubmit, disabled }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        onChatSubmit(input.trim());
        setInput('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    return (
        <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
            <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">ARENA CHAT</H3>
            <div className="h-48 overflow-y-auto space-y-2 bg-black/50 p-2 rounded-lg border-2 border-gray-700 mb-2">
                {chatMessages.map((msg, index) => (
                    <P key={index} className={`text-sm ${msg.sender === 'player' ? 'text-blue-300 text-right' : 'text-red-300 text-left'}`}>
                        <span className="font-bold">{msg.sender === 'player' ? 'You' : opponentName}:</span> {msg.message}
                    </P>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something..."
                    disabled={disabled}
                    className="flex-1 w-[100px] p-2 bg-gray-700 text-white border-2 border-black focus:outline-none focus:border-yellow-500 pixel-font"
                    style={{ WebkitAppearance: 'none' }} // Fix for iOS zoom
                />
                <button
                    type="submit"
                    disabled={disabled}
                    className={`px-4 py-2 font-bold rounded-lg border-4 border-black pixel-font ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-black pixel-button-shadow'}`}
                >
                    Send
                </button>
            </form>
        </div>
    );
};


// ----------------------------------------------------------------
// DUELS TAB COMPONENT
// ----------------------------------------------------------------

const DuelsTab = ({ trainerData = { username: 'Pikachu Trainer' } }) => {
  const [battleState, setBattleState] = useState({
    status: 'idle',
    opponent: null,
    currentQuestion: null,
    playerReady: false,
    opponentReady: false,
    timer: 15,
    playerHealth: 100,
    opponentHealth: 100,
    battleLog: [],
    selectedSubject: null,
    roundActive: true,
    answered: false,
    attackAnimation: null,
    playerPokemon: 'pikachu',
    opponentPokemon: 'bulbasaur', // Default opponent for initial state
    playerCorrect: 0,
    opponentCorrect: 0,
    totalRounds: 2,
    // --- NEW STATE FOR CHAT ---
    chatMessages: [], 
    // -------------------------
  });

  const timerRef = useRef(null);
  const opponentTimerRef = useRef(null);
  const battleAreaRef = useRef(null);
  const playerPokemonRef = useRef(null);
  const opponentPokemonRef = useRef(null);

  // Pokémon data with updated Kanto starters
  const pokemonData = {
    pikachu: {
      name: 'Pikachu',
      type: 'electric',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
      attack: 'thunderbolt',
      color: 'yellow'
    },
    bulbasaur: {
      name: 'Bulbasaur',
      type: 'grass',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif',
      attack: 'vinewhip',
      color: 'green'
    },
    charmander: {
      name: 'Charmander',
      type: 'fire',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif',
      attack: 'flamethrower',
      color: 'orange'
    },
    squirtle: {
      name: 'Squirtle',
      type: 'water',
      gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif',
      attack: 'watergun',
      color: 'blue'
    }
  };

  // Demo Questions Data (kept the same as they relate to subjects, not Pokémon)
  const demoQuestions = {
    math: [
      {
        id: 'math_1',
        question: "What is 15 × 8?",
        options: ["100", "120", "140", "160"],
        correctAnswer: 1,
        damage: 30
      },
      {
        id: 'math_2',
        question: "What is the next prime number after 7?",
        options: ["8", "9", "11", "13"],
        correctAnswer: 2,
        damage: 35
      },
      {
        id: 'math_3',
        question: "What is the square root of 81?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 2,
        damage: 25
      },
      {
        id: 'math_4',
        question: "What is the value of pi (π) rounded to two decimal places?",
        options: ["3.10", "3.14", "3.41", "3.16"],
        correctAnswer: 1,
        damage: 20
      }
    ],
    science: [
      {
        id: 'science_1',
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        damage: 25
      },
      {
        id: 'science_2',
        question: "What is H₂O commonly known as?",
        options: ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"],
        correctAnswer: 2,
        damage: 20
      }
    ],
    history: [
      {
        id: 'history_1',
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: 1,
        damage: 25
      },
      {
        id: 'history_2',
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: 2,
        damage: 20
      }
    ]
  };

  // Demo Opponents (Updated to use Kanto starters)
  const demoOpponents = [
    { 
      id: 1, 
      username: 'Grass Genius', 
      level: 5, 
      pokemon: 'bulbasaur', 
      avatar: '🌿',
      pokemonData: pokemonData.bulbasaur
    },
    { 
      id: 2, 
      username: 'Fire Master', 
      level: 7, 
      pokemon: 'charmander', 
      avatar: '🔥',
      pokemonData: pokemonData.charmander
    },
    { 
      id: 3, 
      username: 'Water Whiz', 
      level: 8, 
      pokemon: 'squirtle', 
      avatar: '💧',
      pokemonData: pokemonData.squirtle
    }
  ];

  // Cleanup timers
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(opponentTimerRef.current);
    };
  }, []);

  // Animation effects
  useEffect(() => {
    if (battleState.attackAnimation) {
      playAttackAnimation(battleState.attackAnimation);
    }
  }, [battleState.attackAnimation]);

  const playAttackAnimation = (attackData) => {
    const { attacker, target, damage, isCorrect } = attackData;
    const attackerRef = attacker === 'player' ? playerPokemonRef : opponentPokemonRef;
    const targetRef = attacker === 'player' ? opponentPokemonRef : playerPokemonRef;

    if (attackerRef.current && targetRef.current && battleAreaRef.current) {
      const tl = gsap.timeline();

      // Attacker animation: Jumps forward and back
      tl.to(attackerRef.current, {
        x: attacker === 'player' ? 50 : -50,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(attackerRef.current, {
        x: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      // Attack effect
      if (isCorrect) {
        // 1. Create and animate the "HIT!" text
        const hitText = document.createElement('div');
        hitText.className = 'absolute text-4xl font-bold text-red-500 pixel-hit-text text-shadow-pixel';
        hitText.textContent = `HIT!`;
        hitText.style.left = attacker === 'player' ? '25%' : '65%';
        hitText.style.top = '50%';
        hitText.style.transform = 'translate(-50%, -50%)';
        battleAreaRef.current.appendChild(hitText);
        
        // 2. Target hit animation (recoil)
        tl.to(targetRef.current, {
          x: attacker === 'player' ? -30 : 30,
          y: -15,
          opacity: 0.5,
          duration: 0.1,
          ease: "power2.in"
        }, "-=0.2")
        .to(targetRef.current, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.2,
          ease: "bounce.out"
        });
        
        // 3. Damage numbers (move up and fade out)
        const damageText = document.createElement('div');
        damageText.className = 'absolute text-3xl font-bold text-yellow-300 text-shadow-pixel';
        damageText.textContent = `-${damage}`;
        damageText.style.left = attacker === 'player' ? '70%' : '30%';
        damageText.style.top = '30%';
        battleAreaRef.current.appendChild(damageText);

        tl.to(damageText, {
          y: -50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            // Check if the parent ref is still mounted before removal
            if (battleAreaRef.current) { 
              battleAreaRef.current.removeChild(damageText);
              battleAreaRef.current.removeChild(hitText);
            }
          }
        }, "-=0.8");
      }

      // Clear attack animation after completion
      setTimeout(() => {
        setBattleState(prev => ({ ...prev, attackAnimation: null }));
      }, 1500);
    }
  };

  const addBattleLog = (message) => {
    setBattleState(prev => ({
      ...prev,
      battleLog: [message, ...prev.battleLog.slice(0, 4)]
    }));
  };

  // --- NEW CHAT FUNCTIONALITY ---
  const addChatMessage = (message, sender) => {
    setBattleState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { message, sender }]
    }));
  };

  const handleChatSubmit = (message) => {
    addChatMessage(message, 'player');
    
    // Simulate AI response after a delay
    setTimeout(() => {
        const aiResponses = [
            "Good luck, trainer!",
            "Let's see what you've got!",
            "Prepare for battle!",
            "My Pokémon is ready!",
            "I'm feeling confident!",
            "GG, let's go!"
        ];
        const aiMessage = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addChatMessage(aiMessage, 'opponent');
    }, 1500);
  };
  // ------------------------------

  const startTimer = () => {
    clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setBattleState(prev => {
        if (prev.timer <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return { ...prev, timer: 0 };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (battleState.status === 'battling' && battleState.roundActive) {
      addBattleLog("⏰ Time's up! No one answered.");
      endRound(null);
    }
  };

  const simulateOpponentAnswer = () => {
    clearTimeout(opponentTimerRef.current);
    
    const answerTime = Math.random() * 4000 + 3000;
    
    opponentTimerRef.current = setTimeout(() => {
      if (battleState.status === 'battling' && battleState.roundActive && !battleState.answered) {
        const shouldAnswerCorrectly = Math.random() > 0.3;
        const correctIndex = battleState.currentQuestion.correctAnswer;
        const selectedIndex = shouldAnswerCorrectly ? correctIndex : (correctIndex + 1) % 4;
        
        handleAnswer(selectedIndex, 'opponent');
      }
    }, answerTime);
  };

  const handleAnswer = (selectedIndex, answerer) => {
    if (!battleState.roundActive || battleState.answered) return;

    clearInterval(timerRef.current);
    clearTimeout(opponentTimerRef.current);

    const isCorrect = selectedIndex === battleState.currentQuestion.correctAnswer;
    const isPlayer = answerer === 'player';
    const attackerName = isPlayer ? 'You' : battleState.opponent?.username || 'Opponent';
    const damage = battleState.currentQuestion.damage;

    setBattleState(prev => ({ 
      ...prev, 
      answered: true, 
      roundActive: false,
      playerCorrect: isPlayer && isCorrect ? prev.playerCorrect + 1 : prev.playerCorrect,
      opponentCorrect: !isPlayer && isCorrect ? prev.opponentCorrect + 1 : prev.opponentCorrect,
      attackAnimation: {
        attacker: answerer,
        target: isPlayer ? 'opponent' : 'player',
        damage: damage,
        isCorrect: isCorrect
      }
    }));

    if (isCorrect) {      
      if (isPlayer) {
        const newOpponentHealth = Math.max(0, battleState.opponentHealth - damage);
        setBattleState(prev => ({ ...prev, opponentHealth: newOpponentHealth }));
        addBattleLog(`⚡ ${attackerName} connected for ${damage} damage!`);
      } else {
        const newPlayerHealth = Math.max(0, battleState.playerHealth - damage);
        setBattleState(prev => ({ ...prev, playerHealth: newPlayerHealth }));
        addBattleLog(`💥 ${attackerName} connected for ${damage} damage!`);
      }
    } else {
      addBattleLog(`❌ ${attackerName} missed the attack!`);
    }

    setTimeout(() => {
      if (battleState.playerHealth <= 0 || battleState.opponentHealth <= 0 || battleState.playerCorrect + battleState.opponentCorrect >= battleState.totalRounds) {
        endBattle();
      } else {
        nextRound();
      }
    }, 2500);
  };

  const endRound = (winner) => {
    setBattleState(prev => ({ ...prev, roundActive: false, answered: true }));
    
    setTimeout(() => {
      if (battleState.playerHealth <= 0 || battleState.opponentHealth <= 0 || battleState.playerCorrect + battleState.opponentCorrect >= battleState.totalRounds) {
        endBattle();
      } else {
        nextRound();
      }
    }, 2000);
  };

  const nextRound = () => {
    const questions = demoQuestions[battleState.selectedSubject];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    setBattleState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      timer: 15,
      roundActive: true,
      answered: false
    }));

    startTimer();
    simulateOpponentAnswer();
  };

  const endBattle = () => {
    const winner = battleState.opponentHealth <= 0 ? 'player' : 'opponent';
    const isWinner = winner === 'player';
    
    addBattleLog(isWinner ? '🎉 You won the battle!' : '💔 You lost the battle!');
    
    // Victory/defeat animation: Winner bounces, loser fades
    if (battleAreaRef.current) {
      const tl = gsap.timeline();
      const winnerRef = isWinner ? playerPokemonRef : opponentPokemonRef;
      const loserRef = isWinner ? opponentPokemonRef : playerPokemonRef;
      
      if (winnerRef.current) {
        tl.to(winnerRef.current, {
          scale: 1.3,
          y: -20,
          duration: 0.5,
          ease: "bounce.out"
        })
        .to(winnerRef.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.2");
      }
      
      if (loserRef.current) {
        // Loser fades away
        tl.to(loserRef.current, {
          opacity: 0,
          duration: 1,
        }, "-=0.8");
      }
    }
    
    setBattleState(prev => ({
      ...prev,
      status: 'finished',
      roundActive: false
    }));

    // Post-battle chat message
    setTimeout(() => {
      const postBattleMessage = isWinner 
          ? "GG! You fought well, but I'll get you next time!" 
          : "That was a great fight! A well-deserved win.";
      addChatMessage(postBattleMessage, 'opponent');
    }, 1000);
  };

  // Battle Actions
  const findBattle = () => {
    setBattleState(prev => ({ ...prev, status: 'searching' }));
    
    setTimeout(() => {
      const randomOpponent = demoOpponents[Math.floor(Math.random() * demoOpponents.length)];
      const playerPokemon = 'pikachu'; 
      
      setBattleState(prev => ({
        ...prev,
        status: 'subject_select',
        opponent: randomOpponent,
        playerPokemon: playerPokemon,
        // Initial chat message when opponent is found
        chatMessages: [{ message: `A challenger appears! I'm ${randomOpponent.username}. Ready to duel?`, sender: 'opponent' }]
      }));
    }, 1500);
  };

  const selectSubject = (subject) => {
    setBattleState(prev => ({
      ...prev,
      status: 'ready',
      selectedSubject: subject
    }));
  };

  const markReady = () => {
    setBattleState(prev => ({ ...prev, playerReady: true }));
    addChatMessage("I'm ready!", 'player');
    
    setTimeout(() => {
      setBattleState(prev => ({ ...prev, opponentReady: true }));
      addChatMessage("My Pokémon is pumped! Let's start.", 'opponent');

      setTimeout(() => {
        startBattle();
      }, 1000);
    }, 1000);
  };

  const startBattle = () => {
    const questions = demoQuestions[battleState.selectedSubject];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    setBattleState(prev => ({
      ...prev,
      status: 'battling',
      currentQuestion: randomQuestion,
      timer: 15,
      roundActive: true,
      answered: false,
      playerHealth: 100,
      opponentHealth: 100,
      playerCorrect: 0,
      opponentCorrect: 0
    }));

    // Initial Pokémon entrance animation
    if (playerPokemonRef.current && opponentPokemonRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(playerPokemonRef.current, 
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      )
      .fromTo(opponentPokemonRef.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
      );
    }

    startTimer();
    simulateOpponentAnswer();
  };

  const leaveBattle = () => {
    clearInterval(timerRef.current);
    clearTimeout(opponentTimerRef.current);
    
    setBattleState({
      status: 'idle',
      opponent: null,
      currentQuestion: null,
      playerReady: false,
      opponentReady: false,
      timer: 15,
      playerHealth: 100,
      opponentHealth: 100,
      battleLog: [],
      selectedSubject: null,
      roundActive: true,
      answered: false,
      attackAnimation: null,
      playerPokemon: 'pikachu',
      opponentPokemon: 'bulbasaur',
      playerCorrect: 0,
      opponentCorrect: 0,
      totalRounds: 2,
      chatMessages: [], // Reset chat messages
    });
  };

  const submitAnswer = (selectedIndex) => {
    if (!battleState.roundActive || battleState.answered) return;
    handleAnswer(selectedIndex, 'player');
  };


  // Render different battle states
  const renderBattleContent = () => {
    // Determine which Pokémon represents which subject for the idle screen
    const subjectPokemon = {
        science: 'squirtle',
        history: 'charmander',
        math: 'bulbasaur'
    };
    
    switch (battleState.status) {
      case 'idle':
      case 'subject_select':
      case 'ready':
      case 'searching':
        return (
            <div className='flex flex-col items-center justify-center min-h-72'>
                {battleState.status === 'idle' && (
                    <div className="text-center">
                        <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">CHOOSE YOUR CHALLENGE!</H3>
                        <div className='grid grid-cols-3 gap-4 mb-6'>
                            {/* Science (Squirtle) */}
                            <div 
                                onClick={() => selectSubject('science')}
                                className="cursor-pointer p-4 bg-blue-800 border-4 border-black hover:border-yellow-500 transition-all duration-200 pixel-button-shadow"
                            >
                                <img src={pokemonData[subjectPokemon.science].gif} alt="Science" className="mx-auto w-24 h-24" style={{ imageRendering: 'pixelated' }} />
                                <P className='mt-2 font-bold text-lg text-white'>Science</P>
                                <P className='text-sm text-yellow-300'>{pokemonData[subjectPokemon.science].name}</P>
                            </div>
                            {/* History (Charmander) */}
                            <div 
                                onClick={() => selectSubject('history')}
                                className="cursor-pointer p-4 bg-orange-800 border-4 border-black hover:border-yellow-500 transition-all duration-200 pixel-button-shadow"
                            >
                                <img src={pokemonData[subjectPokemon.history].gif} alt="History" className="mx-auto w-24 h-24" style={{ imageRendering: 'pixelated' }} />
                                <P className='mt-2 font-bold text-lg text-white'>History</P>
                                <P className='text-sm text-yellow-300'>{pokemonData[subjectPokemon.history].name}</P>
                            </div>
                            {/* Math (Bulbasaur) */}
                            <div 
                                onClick={() => selectSubject('math')}
                                className="cursor-pointer p-4 bg-green-800 border-4 border-black hover:border-yellow-500 transition-all duration-200 pixel-button-shadow"
                            >
                                <img src={pokemonData[subjectPokemon.math].gif} alt="Math" className="mx-auto w-24 h-24" style={{ imageRendering: 'pixelated' }} />
                                <P className='mt-2 font-bold text-lg text-white'>Math</P>
                                <P className='text-sm text-yellow-300'>{pokemonData[subjectPokemon.math].name}</P>
                            </div>
                        </div>
                        
                        <button
                            onClick={findBattle}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg border-4 border-yellow-500 font-bold text-lg transform hover:scale-105 transition-all duration-300 pixel-button-shadow"
                        >
                            Start Battle!
                        </button>
                    </div>
                )}
                {battleState.status === 'searching' && (
                    <div className="text-center p-12">
                        <div className="animate-pulse text-yellow-300 text-xl mb-6 pixel-font">
                        🔍 Searching for opponent...
                        </div>
                        <div className="w-32 h-32 mx-auto mb-6 relative">
                        <img 
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                            alt="Searching"
                            className="w-full h-full animate-spin"
                            style={{ animationDuration: '2s', imageRendering: 'pixelated' }}
                        />
                        </div>
                        <button
                        onClick={leaveBattle}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded border-2 border-black pixel-font"
                        >
                        Cancel
                        </button>
                    </div>
                )}
                {battleState.status === 'subject_select' && (
                    <div className="text-center p-6">
                        <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">Opponent Found!</H3>
                        <div className="bg-red-800 rounded-lg p-4 mb-6 border-4 border-yellow-500 pixel-box">
                            <div className="flex items-center justify-center space-x-4 mb-3">
                                <div className="w-16 h-16 bg-white rounded-full border-4 border-black p-1">
                                    <img 
                                        src={battleState.opponent?.pokemonData?.gif} 
                                        alt={battleState.opponent?.pokemonData?.name}
                                        className="w-full h-full"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                                <div>
                                    <P className="font-bold text-lg">{battleState.opponent?.avatar} {battleState.opponent?.username}</P>
                                    <P className="text-sm text-yellow-200">Lvl: {battleState.opponent?.level} | {battleState.opponent?.pokemonData?.name}</P>
                                </div>
                            </div>
                        </div>
                        
                        <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">Confirm Battle Subject: <span className='capitalize'>{battleState.selectedSubject}</span></H4>
                        <button
                            onClick={markReady}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow"
                        >
                            I'm Ready!
                        </button>
                    </div>
                )}
                {battleState.status === 'ready' && (
                    <div className="text-center p-6">
                        <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">Battle Ready!</H3>
                        <div className="bg-red-800 rounded-lg p-4 mb-4 border-4 border-yellow-500 pixel-box">
                            <P className="font-bold text-lg">Subject: <span className="capitalize">{battleState.selectedSubject}</span></P>
                            <P className="text-sm text-yellow-200">First correct answer attacks!</P>
                        </div>
                        
                        <div className="flex justify-center space-x-8 mb-6">
                            <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.playerReady ? 'bg-green-600' : 'bg-gray-600'}`}>
                                You: {battleState.playerReady ? '✅ Ready' : '❌ Not Ready'}
                            </div>
                            <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.opponentReady ? 'bg-green-600' : 'bg-gray-600'}`}>
                                Opponent: {battleState.opponentReady ? '✅ Ready' : '❌ Not Ready'}
                            </div>
                        </div>
            
                        {!battleState.playerReady && (
                            <button
                                onClick={markReady}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow"
                            >
                                I'm Ready!
                            </button>
                        )}
                    </div>
                )}
            </div>
        );

      case 'battling':
        return (
          <div className="text-center">
            {/* Pokémon Battle Arena */}
            <div ref={battleAreaRef} className="relative bg-gradient-to-b from-gray-900 to-red-900 rounded-lg p-6 mb-4 border-4 border-yellow-500 min-h-72 pixel-box">
              
              {/* Timer at the Top Center */}
              <div className="absolute inset-x-0 top-0 -translate-y-1/2">
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full border-4 border-black bg-black text-white text-2xl font-bold pixel-font text-shadow-pixel ${battleState.timer <= 5 ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}>
                    {battleState.timer}
                </div>
              </div>

              {/* Player Pokémon & UI */}
              <div className="absolute left-10 bottom-10 transform transition-all duration-300" ref={playerPokemonRef}>
                <div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -top-12 -left-2 rounded-lg shadow-lg">
                    <P className="font-bold text-white text-sm pixel-font">{trainerData?.username || 'Player'}</P>
                    <div className="w-full bg-gray-600 rounded-full h-3 border border-black">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${battleState.playerHealth}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-300 pixel-font text-right">{battleState.playerHealth}/100</div>
                </div>
                <img 
                    src={pokemonData[battleState.playerPokemon]?.gif} 
                    alt={pokemonData[battleState.playerPokemon]?.name}
                    className="w-24 h-24"
                    style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Opponent Pokémon & UI */}
              <div className="absolute right-10 top-10 transform transition-all duration-300" ref={opponentPokemonRef}>
                <div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -bottom-12 -right-2 rounded-lg shadow-lg">
                    <P className="font-bold text-white text-sm pixel-font text-right">{battleState.opponent?.username || 'Opponent'}</P>
                    <div className="w-full bg-gray-600 rounded-full h-3 border border-black">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${battleState.opponentHealth}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-300 pixel-font">{battleState.opponentHealth}/100</div>
                </div>
                <img 
                    src={battleState.opponent?.pokemonData?.gif} 
                    alt={battleState.opponent?.pokemonData?.name}
                    className="w-24 h-24"
                    style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Question Box (Updated look) */}
            {battleState.currentQuestion && (
              <div className="bg-red-800 border-4 border-black rounded-lg p-4 mb-4 shadow-lg pixel-box">
                <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">
                  {battleState.currentQuestion.question}
                </H4>
                <div className="grid grid-cols-2 gap-3">
                  {battleState.currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitAnswer(index)}
                      disabled={!battleState.roundActive || battleState.answered}
                      className={`font-bold py-3 px-4 rounded-lg border-4 border-black transition-all duration-300 pixel-font pixel-button-shadow ${
                        !battleState.roundActive || battleState.answered
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                      } ${
                        battleState.answered && index === battleState.currentQuestion.correctAnswer 
                          ? 'bg-green-500 border-green-700' 
                          : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'finished':
        const isWinner = battleState.opponentHealth <= 0;
        const correctRatio = `${battleState.playerCorrect} / ${battleState.totalRounds}`;
        const hpRemaining = Math.max(0, battleState.playerHealth);
        
        return (
          <div className="text-center p-6">
            <H2 className={`text-3xl font-bold mb-8 ${isWinner ? 'text-yellow-300' : 'text-red-400'} text-shadow-pixel`}>
              {isWinner ? 'YOU WON!' : 'YOU LOST!'}
            </H2>
            
            <div className="bg-black/80 rounded-lg p-6 mb-6 border-4 border-yellow-500 pixel-box">
              <H3 className="font-bold text-xl text-white mb-4 text-shadow-pixel">Battle Summary</H3>
              
              <P className="text-lg mb-2">Correct Answers: <span className="text-yellow-400">{correctRatio}</span></P>
              <P className="text-lg mb-2">XP Gained: <span className="text-green-400 font-bold">+500</span></P>
              <P className="text-lg">HP Remaining: <span className="text-red-400 font-bold">{hpRemaining}</span></P>
            </div>

            <button
              onClick={leaveBattle}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-yellow-500 pixel-button-shadow"
            >
              Rematch!
            </button>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="text-white bg-red-900 min-h-screen p-8" style={{ imageRendering: 'pixelated' }}>
      <H2 className="text-3xl font-bold text-center mb-6 text-yellow-300 text-shadow-pixel">
        EDUQUEST ARENA
      </H2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Battle Area */}
        <div className="lg:col-span-2">
          <div className="bg-red-900 border-4 border-yellow-500 rounded-lg p-6 shadow-2xl pixel-box">
            {renderBattleContent()}
          </div>
        </div>

        {/* Battle Info & Log */}
        <div className="space-y-6">
          {/* Battle Log */}
          <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
            <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">BATTLE LOG</H3>
            <div className="h-48 overflow-y-auto space-y-2 bg-black/50 p-2 rounded-lg border-2 border-gray-700">
              {battleState.battleLog.length > 0 ? (
                battleState.battleLog.map((log, index) => (
                  <P key={index} className="p-1 text-sm border-l-4 border-yellow-500 pixel-font">
                    {log}
                  </P>
                ))
              ) : (
                <P className="text-gray-300 text-center p-4">Battle log will appear here...</P>
              )}
            </div>
          </div>
          
          {/* CHAT BOX (NEWLY ADDED) */}
          <ChatBox 
            opponentName={battleState.opponent?.username || 'Opponent'}
            chatMessages={battleState.chatMessages}
            onChatSubmit={handleChatSubmit}
            disabled={battleState.status === 'idle' || battleState.status === 'searching' || battleState.status === 'battling'}
          />
          {/* END CHAT BOX */}

          {/* Player Info (Health/XP) */}
          <div className="bg-blue-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
            <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">TRAINER DATA</H3>
            <div className='flex items-center justify-between'>
                <div className='w-16 h-16 rounded-full bg-white border-2 border-black p-1'>
                    <img src={pokemonData.pikachu.gif} alt='Player Pokemon' style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className='flex-1 ml-4'>
                    <P className='text-lg font-bold'>{trainerData?.username || 'Player'}</P>
                    <div className='text-sm text-yellow-300'>Level 1</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelsTab;