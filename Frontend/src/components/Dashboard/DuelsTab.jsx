import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { io } from 'socket.io-client';

// --- Socket.IO Setup ---
const SOCKET_URL = import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:5000'; 

// Global socket connection
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true
});

// Battle namespace connection
const battleSocket = io(`${SOCKET_URL}/battle`, {
  transports: ['websocket', 'polling'],
  autoConnect: true
});

// --- Helper Components ---
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
                    className="flex-1 p-2 bg-gray-700 text-white border-2 border-black focus:outline-none focus:border-yellow-500 pixel-font"
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

// --- Main DuelsTab Component ---
const DuelsTab = ({ trainerData = { username: 'Pikachu Trainer', _id: 'user_id_123' } }) => {
    const [battleState, setBattleState] = useState({
        roomId: null,
        player1: null,
        player2: null,
        player1Pokemon: null,
        player2Pokemon: null,
        currentQuestion: null,
        status: 'idle',
        winner: null,
        rewards: null,
        playerHealth: 100,
        opponentHealth: 100,
        playerReady: false,
        opponentReady: false,
        timer: 15,
        battleLog: [],
        selectedSubject: null,
        answered: false,
        attackAnimation: null,
        chatMessages: [],
        playerCorrect: 0,
        opponentCorrect: 0,
        totalRounds: 5,
    });

    const timerRef = useRef(null);
    const battleAreaRef = useRef(null);
    const playerPokemonRef = useRef(null);
    const opponentPokemonRef = useRef(null);
    const myId = trainerData._id;

    // --- Static Data ---
    const pokemonData = {
        pikachu: { name: 'Pikachu', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
        bulbasaur: { name: 'Bulbasaur', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif' },
        charmander: { name: 'Charmander', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
        squirtle: { name: 'Squirtle', gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' }
    };
    
    const getPokemonByRef = (pokemonRef) => pokemonData[pokemonRef] || pokemonData.pikachu;
    const subjectPokemon = { science: 'squirtle', history: 'charmander', math: 'bulbasaur' };
    
    const isPlayer1 = battleState.player1?._id === myId;
    const player = isPlayer1 ? battleState.player1 : battleState.player2;
    const opponent = isPlayer1 ? battleState.player2 : battleState.player1;
    const opponentName = opponent?.userName || 'Opponent';
    
    // --- Socket Listeners ---
    useEffect(() => {
        const handleConnect = () => addBattleLog('🟢 Arena connected.');
        const handleDisconnect = () => addBattleLog('🔴 Arena disconnected.');
        const handleMatchFound = (data) => {
            const opponent = data.player1._id === myId ? data.player2 : data.player1;
            setBattleState(prev => ({
                ...prev,
                status: 'subject_select',
                roomId: data.roomId,
                player1: data.player1,
                player2: data.player2,
                chatMessages: [{ message: `Match found! Your opponent is ${opponent.userName}. Ready to duel?`, sender: 'opponent' }]
            }));
            addBattleLog(`🎮 Match found! Opponent: ${opponent.userName}`);
        };
        const handleBattleUpdate = (battle) => {
            const isThisPlayer1 = battle.player1?._id === myId;
            const myHealth = isThisPlayer1 ? battle.player1Health : battle.player2Health;
            const oppHealth = isThisPlayer1 ? battle.player2Health : battle.player1Health;

            if (battle.status === 'active' && battleState.status !== 'active') {
                startTimer();
                addBattleLog(`⚔ Battle started! Subject: ${battle.subject || 'General'}`);
            }

            setBattleState(prev => ({
                ...prev, ...battle,
                playerHealth: myHealth !== undefined ? myHealth : prev.playerHealth,
                opponentHealth: oppHealth !== undefined ? oppHealth : prev.opponentHealth,
                answered: false,
            }));
            
            if (battle.status === 'active' && battle.currentQuestion?._id !== battleState.currentQuestion?._id) {
                addBattleLog(`❓ Round ${battle.round || 1} begins!`);
            }
        };
        const handleRoundResults = (data) => {
            if (timerRef.current) clearInterval(timerRef.current);
            setBattleState(prev => ({ ...prev, answered: true }));

            const myResult = isPlayer1 ? data.player1 : data.player2;
            const oppResult = isPlayer1 ? data.player2 : data.player1;
            let attacker = null;

            if (myResult.isCorrect && (!oppResult.isCorrect || myResult.time < oppResult.time)) {
                attacker = 'player';
            } else if (oppResult.isCorrect && (!myResult.isCorrect || oppResult.time < myResult.time)) {
                attacker = 'opponent';
            }

            if (attacker) {
                const attackerName = attacker === 'player' ? 'You' : opponentName;
                addBattleLog(`⚡ ${attackerName} strikes! Correct in ${attacker === 'player' ? myResult.time : oppResult.time}s.`);
                setBattleState(prev => ({
                    ...prev,
                    attackAnimation: { attacker, damage: data.damageDealt, isCorrect: true },
                    playerCorrect: prev.playerCorrect + (attacker === 'player' ? 1 : 0),
                    opponentCorrect: prev.opponentCorrect + (attacker === 'opponent' ? 1 : 0),
                }));
            } else {
                addBattleLog("❌ Both missed or tied! Next question.");
            }
        };
        const handleBattleFinished = (data) => {
            const isWinner = data.winner === myId;
            addBattleLog(isWinner ? '🎉 You won the battle!' : '💔 You lost the battle!');
            setBattleState(prev => ({ ...prev, status: 'finished', winner: data.winner, rewards: data.rewards }));
            playEndBattleAnimation(isWinner);
        };
        const handlePlayerReady = (data) => {
            if (data.playerId !== myId) {
                setBattleState(prev => ({ ...prev, opponentReady: true }));
                addBattleLog(`✅ ${opponentName} is ready!`);
            }
        };

        battleSocket.on('connect', handleConnect);
        battleSocket.on('disconnect', handleDisconnect);
        battleSocket.on('match-found', handleMatchFound);
        battleSocket.on('battle-update', handleBattleUpdate);
        battleSocket.on('round-results', handleRoundResults);
        battleSocket.on('battle-finished', handleBattleFinished);
        battleSocket.on('player-ready', handlePlayerReady);

        return () => {
            battleSocket.off('connect', handleConnect);
            battleSocket.off('disconnect', handleDisconnect);
            battleSocket.off('match-found', handleMatchFound);
            battleSocket.off('battle-update', handleBattleUpdate);
            battleSocket.off('round-results', handleRoundResults);
            battleSocket.off('battle-finished', handleBattleFinished);
            battleSocket.off('player-ready', handlePlayerReady);
        };
    }, [myId, opponentName, battleState.status, isPlayer1]);

    // --- Timers & Animations ---
    useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setBattleState(prev => ({ ...prev, timer: 15 }));
        timerRef.current = setInterval(() => {
            setBattleState(prev => {
                if (prev.timer <= 1) {
                    clearInterval(timerRef.current);
                    if (!prev.answered && prev.status === 'active') {
                        submitAnswer(-1, true); // -1 indicates timeout
                    }
                    return { ...prev, timer: 0, answered: true };
                }
                return { ...prev, timer: prev.timer - 1 };
            });
        }, 1000);
    };

    useEffect(() => {
        if (battleState.attackAnimation) playAttackAnimation(battleState.attackAnimation);
    }, [battleState.attackAnimation]);

    const playAttackAnimation = ({ attacker, damage }) => {
        const attackerRef = attacker === 'player' ? playerPokemonRef : opponentPokemonRef;
        const targetRef = attacker === 'player' ? opponentPokemonRef : playerPokemonRef;
        if (!attackerRef.current || !targetRef.current) return;

        const tl = gsap.timeline({ onComplete: () => setBattleState(prev => ({ ...prev, attackAnimation: null })) });
        tl.to(attackerRef.current, { x: attacker === 'player' ? 30 : -30, duration: 0.2, ease: "power2.out" })
          .to(targetRef.current, { x: attacker === 'player' ? -15 : 15, yoyo: true, repeat: 3, duration: 0.1, ease: "power1.inOut" }, "<0.1")
          .to(attackerRef.current, { x: 0, duration: 0.3, ease: "back.out(1.7)" });
    };
    
    const playEndBattleAnimation = (isWinner) => {
        const winnerRef = isWinner ? playerPokemonRef.current : opponentPokemonRef.current;
        const loserRef = isWinner ? opponentPokemonRef.current : playerPokemonRef.current;
        if (winnerRef) gsap.to(winnerRef, { scale: 1.2, y: -10, yoyo: true, repeat: 1, duration: 0.5 });
        if (loserRef) gsap.to(loserRef, { opacity: 0, duration: 1 });
    };

    // --- UI Helpers & Actions ---
    const addBattleLog = (message) => setBattleState(prev => ({ ...prev, battleLog: [message, ...prev.battleLog.slice(0, 4)] }));
    const addChatMessage = (message, sender) => setBattleState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, { message, sender }] }));
    const handleChatSubmit = (message) => addChatMessage(message, 'player');
    
    const findBattle = () => {
        setBattleState(prev => ({ ...prev, status: 'searching' }));
        battleSocket.emit('matchmaking-request', { playerId: myId });
        addBattleLog('🔍 Searching for opponent...');
    };

    const selectSubject = (subject) => {
        setBattleState(prev => ({ ...prev, selectedSubject: subject }));
        addBattleLog(`📚 Subject selected: ${subject.toUpperCase()}`);
    };

    const markReady = () => {
        if (!battleState.selectedSubject) return addBattleLog('❌ Please select a subject first!');
        setBattleState(prev => ({ ...prev, playerReady: true, status: 'ready' }));
        addChatMessage("I'm ready!", 'player');
        addBattleLog('✅ You are ready!');
        battleSocket.emit('player-ready', { roomId: battleState.roomId, playerId: myId, subject: battleState.selectedSubject });
    };

    const submitAnswer = (selectedIndex, isTimeout = false) => {
        if (battleState.answered || !battleState.currentQuestion) return;
        setBattleState(prev => ({ ...prev, answered: true }));
        if(timerRef.current) clearInterval(timerRef.current);

        const answer = isTimeout ? '' : battleState.currentQuestion.options[selectedIndex];
        battleSocket.emit('player-answer', {
            roomId: battleState.roomId,
            playerId: myId,
            answer,
            timeSpent: 15 - battleState.timer,
            questionId: battleState.currentQuestion._id
        });
        if (!isTimeout) addBattleLog(`📝 You answered: ${answer}`);
    };

    const leaveBattle = () => {
        if (battleState.roomId) battleSocket.emit('leave-battle', { roomId: battleState.roomId });
        if (timerRef.current) clearInterval(timerRef.current);
        // Reset state to initial values
        setBattleState({
            roomId: null, player1: null, player2: null, currentQuestion: null, status: 'idle', winner: null, rewards: null,
            playerHealth: 100, opponentHealth: 100, playerReady: false, opponentReady: false, timer: 15, battleLog: [],
            selectedSubject: null, answered: false, attackAnimation: null, chatMessages: [], playerCorrect: 0, opponentCorrect: 0, totalRounds: 5
        });
        addBattleLog('🏠 Left the arena.');
    };

    // --- Render Logic ---
    const renderBattleContent = () => {
        switch (battleState.status) {
            case 'idle':
            case 'searching':
                return (
                    <div className='flex flex-col items-center justify-center min-h-72 text-center'>
                        {battleState.status === 'idle' && (
                            <>
                                <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">CHOOSE YOUR CHALLENGE!</H3>
                                <div className='grid grid-cols-3 gap-4 mb-6'>
                                    {Object.keys(subjectPokemon).map(subject => (
                                        <div key={subject} onClick={() => selectSubject(subject)} className={`cursor-pointer p-4 border-4 transition-all duration-200 pixel-button-shadow bg-gray-800 ${battleState.selectedSubject === subject ? 'border-yellow-400' : 'border-black hover:border-yellow-500'}`}>
                                            <img src={getPokemonByRef(subjectPokemon[subject]).gif} alt={subject} className="mx-auto w-24 h-24" style={{ imageRendering: 'pixelated' }} />
                                            <P className='mt-2 font-bold text-lg text-white capitalize'>{subject}</P>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={findBattle} disabled={!battleState.selectedSubject} className={`mt-6 ${battleState.selectedSubject ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600'} text-white px-8 py-3 rounded-lg border-4 border-black font-bold text-lg transform hover:scale-105 transition-all duration-300 pixel-button-shadow`}>
                                    Find Battle!
                                </button>
                            </>
                        )}
                        {battleState.status === 'searching' && (
                            <>
                                <div className="animate-pulse text-yellow-300 text-xl mb-6 pixel-font">🔍 Searching for opponent...</div>
                                <button onClick={leaveBattle} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded border-2 border-black pixel-font">Cancel</button>
                            </>
                        )}
                    </div>
                );
            case 'subject_select':
            case 'ready':
                 return (
                    <div className='flex flex-col items-center justify-center min-h-72 text-center'>
                         <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">{battleState.status === 'ready' ? 'GET READY!' : 'OPPONENT FOUND!'}</H3>
                         <div className="flex justify-center space-x-8 mb-6">
                            <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.playerReady ? 'bg-green-600' : 'bg-gray-600'}`}>You: {battleState.playerReady ? '✅ Ready' : '❌ Not Ready'}</div>
                            <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.opponentReady ? 'bg-green-600' : 'bg-gray-600'}`}>Opponent: {battleState.opponentReady ? '✅ Ready' : '❌ Not Ready'}</div>
                         </div>
                         {!battleState.playerReady && <button onClick={markReady} disabled={!battleState.selectedSubject} className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow`}>I'm Ready!</button>}
                         <P className="mt-2 text-gray-300">Selected: {battleState.selectedSubject?.toUpperCase()}</P>
                    </div>
                 );
            case 'active':
                return (
                    <div className="text-center">
                        <div ref={battleAreaRef} className="relative bg-gradient-to-b from-gray-900 to-red-900 rounded-lg p-6 mb-4 border-4 border-yellow-500 min-h-72 pixel-box">
                            <div className="absolute inset-x-0 top-0 -translate-y-1/2"><div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full border-4 border-black text-white text-2xl font-bold pixel-font text-shadow-pixel ${battleState.timer <= 5 ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}>{battleState.timer}</div></div>
                            <div className="absolute left-10 bottom-10" ref={playerPokemonRef}><div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -top-12 -left-2 rounded-lg shadow-lg"><P className="font-bold text-white text-sm">{player?.userName || 'Player'}</P><div className="w-full bg-gray-600 h-3 border border-black"><div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${battleState.playerHealth}%` }}></div></div><div className="text-xs text-gray-300 text-right">{battleState.playerHealth}/100</div></div><img src={pokemonData.pikachu.gif} alt="Player Pokemon" className="w-24 h-24" style={{ imageRendering: 'pixelated' }} /></div>
                            <div className="absolute right-10 top-10" ref={opponentPokemonRef}><div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -bottom-12 -right-2 rounded-lg shadow-lg"><P className="font-bold text-white text-sm text-right">{opponentName}</P><div className="w-full bg-gray-600 h-3 border border-black"><div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${battleState.opponentHealth}%` }}></div></div><div className="text-xs text-gray-300">{battleState.opponentHealth}/100</div></div><img src={pokemonData.bulbasaur.gif} alt="Opponent Pokemon" className="w-24 h-24" style={{ imageRendering: 'pixelated' }} /></div>
                        </div>
                        {battleState.currentQuestion && (
                            <div className="bg-red-800 border-4 border-black rounded-lg p-4 mb-4 shadow-lg pixel-box">
                                <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">{battleState.currentQuestion.question}</H4>
                                <div className="grid grid-cols-2 gap-3">
                                    {battleState.currentQuestion.options.map((option, index) => (
                                        <button key={index} onClick={() => submitAnswer(index)} disabled={battleState.answered} className={`font-bold py-3 px-4 rounded-lg border-4 border-black transition-all duration-300 pixel-font pixel-button-shadow ${battleState.answered ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}>
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
                return (
                    <div className="text-center p-6 min-h-72 flex flex-col justify-center">
                        <H2 className={`text-3xl font-bold mb-8 ${isWinner ? 'text-yellow-300' : 'text-red-400'} text-shadow-pixel`}>{isWinner ? 'VICTORY!' : 'DEFEAT!'}</H2>
                        <div className="bg-black/80 rounded-lg p-6 mb-6 border-4 border-yellow-500 pixel-box">
                            <H3 className="font-bold text-xl text-white mb-4 text-shadow-pixel">Battle Summary</H3>
                            <P className="text-lg mb-2">Correct Answers: <span className="text-yellow-400">{battleState.playerCorrect} / {battleState.totalRounds}</span></P>
                            <P className="text-lg mb-2">XP Gained: <span className="text-green-400 font-bold">+{battleState.rewards?.xp || 50}</span></P>
                        </div>
                        <button onClick={leaveBattle} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow">
                            Play Again!
                        </button>
                    </div>
                );
            default:
                return <div className="text-center p-8"><div className="animate-pulse text-yellow-300 text-xl pixel-font">Connecting to Arena...</div></div>;
        }
    };

    return (
        <div className="text-white bg-red-900 min-h-screen p-4 md:p-8" style={{ imageRendering: 'pixelated' }}>
            <H2 className="text-3xl font-bold text-center mb-6 text-yellow-300 text-shadow-pixel">EDUQUEST ARENA ⚔</H2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-red-900 border-4 border-yellow-500 rounded-lg p-6 shadow-2xl pixel-box">{renderBattleContent()}</div>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
                        <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">BATTLE LOG</H3>
                        <div className="h-48 overflow-y-auto space-y-2 bg-black/50 p-2 rounded-lg border-2 border-gray-700">
                            {battleState.battleLog.length > 0 ? (
                                battleState.battleLog.map((log, index) => <P key={index} className="p-1 text-sm border-l-4 border-yellow-500">{log}</P>)
                            ) : (
                                <P className="text-gray-300 text-center p-4">Battle log will appear here...</P>
                            )}
                        </div>
                    </div>
                    <ChatBox 
                        opponentName={opponentName}
                        chatMessages={battleState.chatMessages}
                        onChatSubmit={handleChatSubmit}
                        disabled={!['subject_select', 'ready'].includes(battleState.status)}
                    />
                    <div className="bg-blue-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
                        <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">TRAINER DATA</H3>
                        <div className='flex items-center justify-between'>
                            <div className='w-16 h-16 rounded-full bg-white border-2 border-black p-1'><img src={pokemonData.pikachu.gif} alt='Player Pokemon' style={{ imageRendering: 'pixelated' }} /></div>
                            <div className='flex-1 ml-4'>
                                <P className='text-lg font-bold'>{player?.userName || 'Player'}</P>
                                <div className='text-sm text-yellow-300'>Level {player?.level || 1}</div>
                                <div className='text-sm text-green-300'>Correct: {battleState.playerCorrect}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DuelsTab;