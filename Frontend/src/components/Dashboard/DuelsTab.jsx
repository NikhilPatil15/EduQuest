import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { io } from 'socket.io-client'; // 1. Import Socket.IO client

// --- Socket.IO Setup ---
// Replace with your actual backend URL/environment variable
const SOCKET_URL = import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:5000'; 
const socket = io(`${SOCKET_URL}/battle`, {
    // You might need to pass the access token in the connection options
    // auth: { token: localStorage.getItem('accessToken') }
});

// --- Helper Components (P, H2, H3, H4, ChatBox remain the same) ---
const P = (props) => <p className="pixel-font" {...props} />;
const H2 = (props) => <h2 className="pixel-font" {...props} />;
const H3 = (props) => <h3 className="pixel-font" {...props} />;
const H4 = (props) => <h4 className="pixel-font" {...props} />;

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
                    style={{ WebkitAppearance: 'none' }}
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

const DuelsTab = ({ trainerData = { username: 'Pikachu Trainer', _id: 'user_id_123' } }) => {
    // Consolidated state to match the Battle Model structure where possible
    const [battleState, setBattleState] = useState({
        // Server data fields
        roomId: null,
        player1: null,
        player2: null,
        player1Pokemon: null,
        player2Pokemon: null,
        currentQuestion: null,
        status: 'idle', // 'idle', 'searching', 'subject_select', 'ready', 'active', 'finished'
        winner: null,
        rewards: null,

        // Client UI fields
        playerHealth: 100, // Derived from battle-update, managed locally for animation
        opponentHealth: 100, // Derived from battle-update, managed locally for animation
        playerReady: false,
        opponentReady: false,
        timer: 15, // Managed locally for display
        battleLog: [],
        selectedSubject: null,
        answered: false,
        attackAnimation: null,
        chatMessages: [],
        playerCorrect: 0,
        opponentCorrect: 0,
        totalRounds: 5, // Set max rounds for display/logic
    });

    const timerRef = useRef(null);
    const battleAreaRef = useRef(null);
    const playerPokemonRef = useRef(null);
    const opponentPokemonRef = useRef(null);
    const myId = trainerData._id;

    // --- Static Pokémon and Subject Data (for UI display) ---
    const pokemonData = {
        pikachu: { name: 'Pikachu', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
        bulbasaur: { name: 'Bulbasaur', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif' },
        charmander: { name: 'Charmander', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
        squirtle: { name: 'Squirtle', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' }
    };
    const getPokemonByRef = (pokemonRef) => pokemonData[pokemonRef] || pokemonData.pikachu;
    const subjectPokemon = { science: 'squirtle', history: 'charmander', math: 'bulbasaur' };
    
    // Determine player's and opponent's data based on the room state
    const isPlayer1 = battleState.player1?._id === myId;
    const player = isPlayer1 ? battleState.player1 : battleState.player2;
    const opponent = isPlayer1 ? battleState.player2 : battleState.player1;
    const playerPokemon = isPlayer1 ? battleState.player1Pokemon : battleState.player2Pokemon;
    const opponentPokemon = isPlayer1 ? battleState.player2Pokemon : battleState.player1Pokemon;
    const opponentName = opponent?.userName || 'Opponent';
    
    // --- SOCKET.IO EVENT LISTENERS ---
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket Connected:', socket.id);
            addBattleLog('🟢 Arena connected.');
        });

        socket.on('disconnect', () => {
            console.log('Socket Disconnected');
            addBattleLog('🔴 Arena disconnected. Attempting to reconnect...');
        });
        
        // 1. Initial Matchmaking Response
        socket.on('match-found', (data) => {
            const { roomId, player1, player2 } = data;
            setBattleState(prev => ({
                ...prev,
                status: 'subject_select', // Transition to selection screen
                roomId: roomId,
                player1: player1,
                player2: player2,
                chatMessages: [{ message: `Match found! Your opponent is ${player2.userName}. Ready to duel?`, sender: 'opponent' }]
            }));
        });
        
        // 2. Battle State Update (Core Game Loop)
        socket.on('battle-update', (battle) => {
            console.log('Battle Update:', battle);
            const isPlayer1Update = battle.player1?._id === myId;
            const myHealth = isPlayer1Update ? battle.player1Health : battle.player2Health;
            const oppHealth = isPlayer1Update ? battle.player2Health : battle.player1Health;
            const playerReady = battle.player1Ready;
            const opponentReady = battle.player2Ready;
            
            // Start the timer when the status becomes 'active'
            if (battle.status === 'active' && battleState.status !== 'active') {
                startTimer();
            }

            // Update local state based on server model
            setBattleState(prev => ({
                ...prev,
                ...battle, // Spread new server data
                status: battle.status,
                playerHealth: myHealth,
                opponentHealth: oppHealth,
                playerReady: playerReady,
                opponentReady: opponentReady,
                currentQuestion: battle.currentQuestion,
                answered: false, // Reset answered state for a new question
            }));
            
            if (battle.status === 'active' && battle.currentQuestion?._id !== battleState.currentQuestion?._id) {
                addBattleLog(`❓ Round ${battle.round || 1} begins! Subject: ${battle.subject}`);
            }
        });
        
        // 3. Round Results Update (Triggers Animation)
        socket.on('round-results', (data) => {
            const myResult = isPlayer1 ? data.player1 : data.player2;
            const oppResult = isPlayer1 ? data.player2 : data.player1;
            
            // Determine who answered first and correctly
            let attacker = null;
            let target = null;
            let logMessage = null;

            if (myResult.isCorrect && oppResult.isCorrect) {
                if (myResult.time < oppResult.time) {
                    attacker = 'player';
                } else if (oppResult.time < myResult.time) {
                    attacker = 'opponent';
                } else {
                    logMessage = "⚔️ Both answered correctly at the same time! No damage dealt.";
                }
            } else if (myResult.isCorrect) {
                attacker = 'player';
            } else if (oppResult.isCorrect) {
                attacker = 'opponent';
            } else {
                logMessage = "❌ Both missed! Next question.";
            }
            
            // Stop the timer and process attack
            clearInterval(timerRef.current);
            setBattleState(prev => ({ ...prev, answered: true, roundActive: false }));

            if (attacker) {
                target = attacker === 'player' ? 'opponent' : 'player';
                const damage = data.damageDealt;
                const attackerName = attacker === 'player' ? 'You' : opponentName;
                
                addBattleLog(`⚡ ${attackerName} strikes! Correct in ${attacker === 'player' ? myResult.time : oppResult.time}s.`);
                
                setBattleState(prev => ({
                    ...prev,
                    attackAnimation: { attacker, target, damage, isCorrect: true },
                    playerCorrect: prev.playerCorrect + (attacker === 'player' ? 1 : 0),
                    opponentCorrect: prev.opponentCorrect + (attacker === 'opponent' ? 1 : 0),
                    // Health update will come from the next 'battle-update' or 'battle-finished'
                }));
            } else {
                addBattleLog(logMessage);
            }
            
            // Server should automatically send the next 'battle-update' event after a delay
        });
        
        // 4. Battle Finished
        socket.on('battle-finished', (data) => {
            const isWinner = data.winner === myId;
            addBattleLog(isWinner ? '🎉 You won the battle!' : '💔 You lost the battle!');
            
            setBattleState(prev => ({
                ...prev,
                status: 'finished',
                winner: data.winner,
                rewards: data.rewards,
                roundActive: false
            }));
            
            // Post-battle animation logic
            playEndBattleAnimation(isWinner);
            
            // Post-battle chat
            setTimeout(() => {
                const postBattleMessage = isWinner 
                    ? "GG! You fought well, but I'll get you next time!" 
                    : "That was a great fight! A well-deserved win.";
                addChatMessage(postBattleMessage, 'opponent');
            }, 1000);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('match-found');
            socket.off('battle-update');
            socket.off('round-results');
            socket.off('battle-finished');
            clearInterval(timerRef.current);
        };
    }, [myId, opponentName]); // Ensure listeners are stable and only rely on necessary external state

    // --- CLIENT UI LOGIC ---

    // Clean up timer on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    // Timer control (Local UI display only)
    const startTimer = () => {
        clearInterval(timerRef.current);
        setBattleState(prev => ({ ...prev, timer: 15 }));
        
        timerRef.current = setInterval(() => {
            setBattleState(prev => {
                if (prev.timer <= 1) {
                    clearInterval(timerRef.current);
                    // No need to call handleTimeUp, server handles time limit
                    return { ...prev, timer: 0, answered: true };
                }
                return { ...prev, timer: prev.timer - 1 };
            });
        }, 1000);
    };

    // Animation effects (These remain largely the same, but the trigger is now 'round-results')
    useEffect(() => {
        if (battleState.attackAnimation) {
            // Wait for the next battle-update to set the NEW health before playing animation
            playAttackAnimation(battleState.attackAnimation);
        }
    }, [battleState.attackAnimation, battleState.playerHealth, battleState.opponentHealth]); // Trigger when animation data changes

    const playAttackAnimation = (attackData) => {
        const { attacker, target, damage, isCorrect } = attackData;
        const attackerRef = attacker === 'player' ? playerPokemonRef : opponentPokemonRef;
        const targetRef = attacker === 'player' ? opponentPokemonRef : playerPokemonRef;
    
        if (attackerRef.current && targetRef.current && battleAreaRef.current) {
            // ... (GSAP animation code remains the same as provided in the original prompt) ...
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
    
    const playEndBattleAnimation = (isWinner) => {
        if (battleAreaRef.current) {
            const tl = gsap.timeline();
            const winnerRef = isWinner ? playerPokemonRef : opponentPokemonRef;
            const loserRef = isWinner ? opponentPokemonRef : playerPokemonRef;
            
            if (winnerRef.current) {
                tl.to(winnerRef.current, { scale: 1.3, y: -20, duration: 0.5, ease: "bounce.out" })
                  .to(winnerRef.current, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.2");
            }
            
            if (loserRef.current) {
                tl.to(loserRef.current, { opacity: 0, duration: 1, }, "-=0.8");
            }
        }
    };

    const addBattleLog = (message) => {
        setBattleState(prev => ({
            ...prev,
            battleLog: [message, ...prev.battleLog.slice(0, 4)]
        }));
    };

    const addChatMessage = (message, sender) => {
        setBattleState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, { message, sender }]
        }));
    };

    const handleChatSubmit = (message) => {
        addChatMessage(message, 'player');
        // NOTE: In a production app, this would be a socket.emit('chat-message', { message, roomId })
        // The server would echo it back to all clients, and a simplified opponent AI response would be generated there.
    };
    
    // --- SOCKET.IO ACTIONS (Emit Events) ---

    // 1. Start Matchmaking (Emit event to join a room)
    const findBattle = () => {
        setBattleState(prev => ({ ...prev, status: 'searching' }));
        // Note: The backend needs to handle finding a match and sending 'match-found'
        socket.emit('matchmaking-request', { playerId: myId }); 
    };

    // 2. Select Subject (Only for UI, assumes subject is part of the initial matchmaking criteria)
    const selectSubject = (subject) => {
        setBattleState(prev => ({ ...prev, selectedSubject: subject, status: 'subject_select' }));
    };

    // 3. Mark Player Ready (Emit event)
    const markReady = () => {
        // Optimistically set self as ready
        setBattleState(prev => ({ ...prev, playerReady: true, status: 'ready' }));
        addChatMessage("I'm ready!", 'player');
        
        socket.emit('player-ready', {
            roomId: battleState.roomId,
            playerId: myId,
            subject: battleState.selectedSubject // Pass selected subject
        });
        
        // Opponent readiness will be handled by the 'battle-update' event
    };

    // 4. Submit Answer (Emit event)
    const submitAnswer = (selectedIndex) => {
        if (battleState.answered || battleState.status !== 'active') return;
        
        setBattleState(prev => ({ ...prev, answered: true, roundActive: false }));
        clearInterval(timerRef.current);
        
        const answer = battleState.currentQuestion.options[selectedIndex];
        const timeSpent = 15 - battleState.timer; // Simple time calculation
        
        socket.emit('player-answer', {
            roomId: battleState.roomId,
            playerId: myId,
            answer: answer,
            timeSpent: timeSpent,
            questionId: battleState.currentQuestion._id
        });
        
        addBattleLog('... Waiting for opponent answer/server results...');
        // The result is handled by the 'round-results' event listener
    };

    // 5. Leave Battle (Emit event)
    const leaveBattle = () => {
        if (battleState.roomId) {
            socket.emit('leave-battle', { roomId: battleState.roomId });
        }
        
        clearInterval(timerRef.current);
        setBattleState({
            status: 'idle', roomId: null, opponent: null, currentQuestion: null,
            playerReady: false, opponentReady: false, timer: 15, playerHealth: 100,
            opponentHealth: 100, battleLog: [], selectedSubject: null, answered: false,
            attackAnimation: null, playerPokemon: 'pikachu', opponentPokemon: 'bulbasaur',
            playerCorrect: 0, opponentCorrect: 0, totalRounds: 5, chatMessages: [],
        });
        addBattleLog('Arena left.');
    };

    // Render different battle states (JSX remains largely the same)
    const renderBattleContent = () => {
        
        switch (battleState.status) {
            case 'idle':
            case 'subject_select':
            case 'ready':
            case 'searching':
                return (
                    <div className='flex flex-col items-center justify-center min-h-72'>
                        {(battleState.status === 'idle' || battleState.status === 'subject_select') && (
                            <div className="text-center">
                                <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">CHOOSE YOUR CHALLENGE!</H3>
                                
                                {battleState.status === 'idle' && (
                                    <div className='grid grid-cols-3 gap-4 mb-6'>
                                        {Object.keys(subjectPokemon).map(subject => (
                                            <div 
                                                key={subject}
                                                onClick={() => selectSubject(subject)}
                                                className={`cursor-pointer p-4 border-4 border-black hover:border-yellow-500 transition-all duration-200 pixel-button-shadow bg-${pokemonData[subjectPokemon[subject]].color || 'gray'}-800`}
                                            >
                                                <img src={pokemonData[subjectPokemon[subject]].gif} alt={subject} className="mx-auto w-24 h-24" style={{ imageRendering: 'pixelated' }} />
                                                <P className='mt-2 font-bold text-lg text-white capitalize'>{subject}</P>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <button
                                    onClick={findBattle}
                                    disabled={!battleState.selectedSubject || battleState.status === 'searching'}
                                    className={`mt-6 ${battleState.selectedSubject ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600'} text-white px-8 py-3 rounded-lg border-4 border-yellow-500 font-bold text-lg transform hover:scale-105 transition-all duration-300 pixel-button-shadow`}
                                >
                                    {battleState.status === 'searching' ? '🔍 Searching...' : `Start ${battleState.selectedSubject ? battleState.selectedSubject.toUpperCase() : ''} Battle!`}
                                </button>
                                
                                {battleState.status === 'subject_select' && (
                                    <div className="mt-4">
                                        <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">Opponent: {opponentName}</H4>
                                        <button onClick={markReady} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow">I'm Ready!</button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {battleState.status === 'ready' && (
                            <div className="text-center p-6">
                                <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">GET READY!</H3>
                                <div className="flex justify-center space-x-8 mb-6">
                                    <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.playerReady ? 'bg-green-600' : 'bg-gray-600'}`}>You: {battleState.playerReady ? '✅ Ready' : '❌ Not Ready'}</div>
                                    <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.opponentReady ? 'bg-green-600' : 'bg-gray-600'}`}>Opponent: {battleState.opponentReady ? '✅ Ready' : '❌ Not Ready'}</div>
                                </div>
                            </div>
                        )}
                        
                        {battleState.status === 'searching' && (
                            <div className="text-center p-12">
                                <div className="animate-pulse text-yellow-300 text-xl mb-6 pixel-font">🔍 Searching for opponent...</div>
                                <div className="w-32 h-32 mx-auto mb-6 relative">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Searching" className="w-full h-full animate-spin" style={{ animationDuration: '2s', imageRendering: 'pixelated' }} />
                                </div>
                                <button onClick={leaveBattle} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded border-2 border-black pixel-font">Cancel</button>
                            </div>
                        )}
                    </div>
                );

            case 'active':
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
                                    <P className="font-bold text-white text-sm pixel-font">{player?.userName || 'Player'}</P>
                                    <div className="w-full bg-gray-600 rounded-full h-3 border border-black">
                                        <div 
                                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${battleState.playerHealth}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-300 pixel-font text-right">{battleState.playerHealth}/100</div>
                                </div>
                                <img 
                                    src={getPokemonByRef(playerPokemon?.name?.toLowerCase()).gif} 
                                    alt={playerPokemon?.name}
                                    className="w-24 h-24"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>

                            {/* Opponent Pokémon & UI */}
                            <div className="absolute right-10 top-10 transform transition-all duration-300" ref={opponentPokemonRef}>
                                <div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -bottom-12 -right-2 rounded-lg shadow-lg">
                                    <P className="font-bold text-white text-sm pixel-font text-right">{opponentName}</P>
                                    <div className="w-full bg-gray-600 rounded-full h-3 border border-black">
                                        <div 
                                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${battleState.opponentHealth}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-300 pixel-font">{battleState.opponentHealth}/100</div>
                                </div>
                                <img 
                                    src={getPokemonByRef(opponentPokemon?.name?.toLowerCase()).gif} 
                                    alt={opponentPokemon?.name}
                                    className="w-24 h-24"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>

                        {/* Question Box */}
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
                                            disabled={battleState.answered || battleState.status !== 'active'}
                                            className={`font-bold py-3 px-4 rounded-lg border-4 border-black transition-all duration-300 pixel-font pixel-button-shadow ${
                                                battleState.answered || battleState.status !== 'active'
                                                ? 'bg-gray-500 cursor-not-allowed' 
                                                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
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
                const isWinner = battleState.winner === myId;
                const totalRounds = battleState.playerCorrect + battleState.opponentCorrect;
                const correctRatio = `${battleState.playerCorrect} / ${totalRounds}`;
                const hpRemaining = Math.max(0, isWinner ? battleState.playerHealth : battleState.opponentHealth);
                
                return (
                    <div className="text-center p-6">
                        <H2 className={`text-3xl font-bold mb-8 ${isWinner ? 'text-yellow-300' : 'text-red-400'} text-shadow-pixel`}>
                            {isWinner ? 'YOU WON!' : 'YOU LOST!'}
                        </H2>
                        
                        <div className="bg-black/80 rounded-lg p-6 mb-6 border-4 border-yellow-500 pixel-box">
                            <H3 className="font-bold text-xl text-white mb-4 text-shadow-pixel">Battle Summary</H3>
                            
                            <P className="text-lg mb-2">Correct Rounds Won: <span className="text-yellow-400">{correctRatio}</span></P>
                            <P className="text-lg mb-2">XP Gained: <span className="text-green-400 font-bold">+{battleState.rewards?.xp || 0}</span></P>
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
                return <div>Connecting to Arena...</div>;
        }
    };

    return (
        <div className="text-white bg-red-900 min-h-screen p-8" style={{ imageRendering: 'pixelated' }}>
            <H2 className="text-3xl font-bold text-center mb-6 text-yellow-300 text-shadow-pixel">
                EDUQUEST ARENA ⚔️
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
                                <P className="text-gray-300 text-center p-4">Awaiting opponent...</P>
                            )}
                        </div>
                    </div>
                    
                    {/* CHAT BOX */}
                    <ChatBox 
                        opponentName={opponentName}
                        chatMessages={battleState.chatMessages}
                        onChatSubmit={handleChatSubmit}
                        // Chat is only enabled when the status is 'subject_select' or 'ready'
                        disabled={battleState.status === 'idle' || battleState.status === 'searching' || battleState.status === 'active' || battleState.status === 'finished'}
                    />
                    
                    {/* Player Info (Health/XP) */}
                    <div className="bg-blue-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
                        <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">TRAINER DATA</H3>
                        <div className='flex items-center justify-between'>
                            <div className='w-16 h-16 rounded-full bg-white border-2 border-black p-1'>
                                <img src={getPokemonByRef(playerPokemon?.name?.toLowerCase()).gif} alt='Player Pokemon' style={{ imageRendering: 'pixelated' }} />
                            </div>
                            <div className='flex-1 ml-4'>
                                <P className='text-lg font-bold'>{player?.userName || 'Player'}</P>
                                <div className='text-sm text-yellow-300'>Level {player?.level || 1}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuelsTab;