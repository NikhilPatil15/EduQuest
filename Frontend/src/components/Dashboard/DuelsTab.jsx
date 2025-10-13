import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// --- MOCK DATA FOR HARDCODED DEMO ---
const mockOpponent = {
  _id: "opponent_id_456",
  userName: "Rival Gary",
  level: 2,
};

const mockQuestion = {
  _id: "q1",
  question: "Which of these is a water-type Pokémon?",
  options: ["Charmander", "Squirtle", "Bulbasaur", "Pikachu"],
  correctAnswer: "Squirtle", // The correct string, not the index
};

// --- Helper Components ---
const P = (props) => <p className="pixel-font" {...props} />;
const H2 = (props) => <h2 className="pixel-font" {...props} />;
const H3 = (props) => <h3 className="pixel-font" {...props} />;
const H4 = (props) => <h4 className="pixel-font" {...props} />;

const ChatBox = ({ opponentName, chatMessages, onChatSubmit, disabled }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    onChatSubmit(input.trim());
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
      <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">
        ARENA CHAT
      </H3>
      <div className="h-48 overflow-y-auto space-y-2 bg-black/50 p-2 rounded-lg border-2 border-gray-700 mb-2">
        {chatMessages.map((msg, index) => (
          <P
            key={index}
            className={`text-sm ${
              msg.sender === "player"
                ? "text-blue-300 text-right"
                : "text-red-300 text-left"
            }`}
          >
            <span className="font-bold">
              {msg.sender === "player" ? "You" : opponentName}:
            </span>{" "}
            {msg.message}
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
          style={{ WebkitAppearance: "none" }}
        />
        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-2 font-bold rounded-lg border-4 border-black pixel-font ${
            disabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400 text-black pixel-button-shadow"
          }`}
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

const DuelsTab = ({
  trainerData = { userName: "Ash", _id: "user_id_123", level: 1 },
}) => {
  const [battleState, setBattleState] = useState({
    roomId: null,
    player1: null,
    player2: null,
    player1Pokemon: null,
    player2Pokemon: null,
    currentQuestion: null,
    status: "idle",
    winner: null,
    rewards: null,
    playerHealth: 100,
    opponentHealth: 100,
    playerReady: false,
    opponentReady: false,
    timer: 15,
    battleLog: ["Welcome to the Arena!"],
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

  const pokemonData = {
    pikachu: { name: "Pikachu", gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif" },
    bulbasaur: { name: "Bulbasaur", gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif" },
    charmander: { name: "Charmander", gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif" },
    squirtle: { name: "Squirtle", gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif" },
  };

  const getPokemonByRef = (pokemonRef) => pokemonData[pokemonRef] || pokemonData.pikachu;
  const subjectPokemon = { science: "squirtle", coding: "charmander", math: "bulbasaur" };

  const isPlayer1 = battleState.player1?._id === myId;
  const player = isPlayer1 ? battleState.player1 : battleState.player2;
  const opponent = isPlayer1 ? battleState.player2 : battleState.player1;
  const opponentName = opponent?.userName || "Opponent";

  useEffect(() => console.log("🔍 Current battle state:", battleState), [battleState]);

  // Clean up timer on unmount
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // --- BATTLE LOGIC & STATE TRANSITIONS (SIMULATED) ---
  const addBattleLog = (message) => {
    setBattleState((prev) => ({
      ...prev,
      battleLog: [message, ...prev.battleLog.slice(0, 4)],
    }));
  };

  const addChatMessage = (message, sender) => {
    setBattleState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { message, sender }],
    }));
  };

  const handleChatSubmit = (message) => addChatMessage(message, "player");

  const findBattle = () => {
    if (!battleState.selectedSubject) {
      addBattleLog("❌ Please select a subject first!");
      return;
    }
    setBattleState((prev) => ({ ...prev, status: "searching" }));
    addBattleLog("🔍 Searching for opponent...");

    setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,
        status: "subject_select",
        roomId: "mock_room_123",
        player1: trainerData,
        player2: mockOpponent,
      }));
      addBattleLog(`🎮 Match found! Opponent: ${mockOpponent.userName}`);
      addChatMessage(`Match found! Your opponent is ${mockOpponent.userName}. Ready to duel?`, "opponent");
    }, 2000);
  };

  const selectSubject = (subject) => {
    setBattleState((prev) => ({ ...prev, selectedSubject: subject }));
    addBattleLog(`📚 Subject selected: ${subject.toUpperCase()}`);
  };

  const markReady = () => {
    if (!battleState.selectedSubject) {
      addBattleLog("❌ Please select a subject first!");
      return;
    }

    setBattleState((prev) => ({ ...prev, playerReady: true, status: "ready" }));
    addChatMessage("I'm ready!", "player");
    addBattleLog("✅ You are ready!");

    // Simulate opponent readying up and starting the battle
    setTimeout(() => {
      addBattleLog(`✅ ${opponentName} is ready!`);
      setBattleState((prev) => ({ ...prev, opponentReady: true }));

      setTimeout(() => {
        addBattleLog(`⚔️ Battle started! Subject: ${battleState.selectedSubject.toUpperCase()}`);
        setBattleState((prev) => ({
          ...prev,
          status: "active",
          currentQuestion: mockQuestion,
          player1Pokemon: "pikachu", // Assign Pokémon for the battle
          player2Pokemon: subjectPokemon[prev.selectedSubject] || "bulbasaur",
        }));
        startTimer();
      }, 1500);
    }, 1000);
  };

  const submitAnswer = (selectedIndex) => {
    if (battleState.answered || battleState.status !== "active" || !battleState.currentQuestion) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setBattleState((prev) => ({ ...prev, answered: true }));

    const myAnswer = battleState.currentQuestion.options[selectedIndex];
    const myTime = 15 - battleState.timer;
    const myResult = {
      isCorrect: myAnswer === battleState.currentQuestion.correctAnswer,
      time: myTime,
    };

    addBattleLog(`📝 You answered: ${myAnswer}`);

    // Simulate opponent's answer
    const oppResult = {
      isCorrect: Math.random() > 0.4, // 60% chance to be correct
      time: Math.random() * 5 + 2,    // 2-7 seconds
    };

    // --- Process Round Results ---
    let attacker = null;
    let logMessage = null;

    if (myResult.isCorrect && oppResult.isCorrect) {
      if (myResult.time < oppResult.time) attacker = "player";
      else if (oppResult.time < myResult.time) attacker = "opponent";
      else logMessage = "⚔️ Both answered correctly at the same time! No damage.";
    } else if (myResult.isCorrect) {
      attacker = "player";
    } else if (oppResult.isCorrect) {
      attacker = "opponent";
    } else {
      logMessage = "❌ Both answered incorrectly! No damage dealt.";
    }

    if (attacker) {
      const damage = 20; // Hardcoded damage
      const target = attacker === "player" ? "opponent" : "player";
      const attackerName = attacker === "player" ? "You" : opponentName;
      addBattleLog(`⚡ ${attackerName} strikes for ${damage} damage!`);

      const newPlayerHealth = battleState.playerHealth - (target === "player" ? damage : 0);
      const newOpponentHealth = battleState.opponentHealth - (target === "opponent" ? damage : 0);

      setBattleState((prev) => ({
        ...prev,
        attackAnimation: { attacker, target, damage, isCorrect: true },
        playerHealth: Math.max(0, newPlayerHealth),
        opponentHealth: Math.max(0, newOpponentHealth),
        playerCorrect: prev.playerCorrect + (attacker === "player" ? 1 : 0),
        opponentCorrect: prev.opponentCorrect + (attacker === "opponent" ? 1 : 0),
      }));

      // Check for winner after attack animation
      setTimeout(() => {
        if (newPlayerHealth <= 0 || newOpponentHealth <= 0) {
          handleGameOver(newPlayerHealth <= 0 ? opponent._id : player._id);
        } else {
          loadNextQuestion();
        }
      }, 1500);
    } else {
      addBattleLog(logMessage);
      setTimeout(loadNextQuestion, 1500);
    }
  };

  const loadNextQuestion = () => {
    addBattleLog("❓ Next question incoming...");
    setBattleState((prev) => ({
      ...prev,
      answered: false,
      timer: 15,
      currentQuestion: { ...mockQuestion, _id: `q${Date.now()}` }, // Give new ID to re-trigger effects
      attackAnimation: null,
    }));
    startTimer();
  };

  const handleGameOver = (winnerId) => {
    const isWinner = winnerId === myId;
    addBattleLog(isWinner ? "🎉 You won the battle!" : "💔 You lost the battle!");
    setBattleState((prev) => ({
      ...prev,
      status: "finished",
      winner: winnerId,
      rewards: { xp: isWinner ? 100 : 25 },
    }));
    playEndBattleAnimation(isWinner);
  };
  
  const leaveBattle = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Reset to initial state
    setBattleState({
      roomId: null, player1: null, player2: null, player1Pokemon: null,
      player2Pokemon: null, currentQuestion: null, status: "idle", winner: null,
      rewards: null, playerHealth: 100, opponentHealth: 100, playerReady: false,
      opponentReady: false, timer: 15, battleLog: ["Welcome back to the Arena!"],
      selectedSubject: null, answered: false, attackAnimation: null, chatMessages: [],
      playerCorrect: 0, opponentCorrect: 0, totalRounds: 5,
    });
  };

  // --- TIMER & ANIMATIONS ---
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBattleState((prev) => ({ ...prev, timer: 15 }));

    timerRef.current = setInterval(() => {
      setBattleState((prev) => {
        if (prev.timer <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!prev.answered && prev.status === "active") {
            // Auto-submit a wrong answer if time runs out
            submitAnswer(-1); // Pass an invalid index to guarantee wrong answer
          }
          return { ...prev, timer: 0 };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
  };

  useEffect(() => {
    if (battleState.attackAnimation) playAttackAnimation(battleState.attackAnimation);
  }, [battleState.attackAnimation]);

  const playAttackAnimation = (attackData) => {
    const { attacker, target, damage } = attackData;
    const attackerRef = attacker === "player" ? playerPokemonRef : opponentPokemonRef;
    const targetRef = attacker === "player" ? opponentPokemonRef : playerPokemonRef;

    if (!attackerRef.current || !targetRef.current || !battleAreaRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setBattleState((prev) => ({ ...prev, attackAnimation: null }));
      },
    });

    tl.to(attackerRef.current, { x: attacker === "player" ? 50 : -50, duration: 0.2, ease: "power2.out" })
      .to(attackerRef.current, { x: 0, duration: 0.3, ease: "back.out(1.7)" });

    tl.to(targetRef.current, { x: attacker === "player" ? 15 : -15, yoyo: true, repeat: 3, duration: 0.08, ease: "power1.inOut" }, "-=0.4");

    const damageText = document.createElement("div");
    damageText.className = "absolute text-3xl font-bold text-yellow-300 text-shadow-pixel";
    damageText.textContent = `-${damage}`;
    damageText.style.left = target === "player" ? "25%" : "75%";
    damageText.style.top = "40%";
    damageText.style.transform = "translateX(-50%)";
    battleAreaRef.current.appendChild(damageText);

    tl.to(damageText, { y: -60, opacity: 0, duration: 1.5, ease: "power2.out", onComplete: () => damageText.remove() }, "-=0.5");
  };

  const playEndBattleAnimation = (isWinner) => {
    const winnerRef = isWinner ? playerPokemonRef : opponentPokemonRef;
    const loserRef = isWinner ? opponentPokemonRef : playerPokemonRef;

    if (winnerRef.current) {
        gsap.timeline()
            .to(winnerRef.current, { scale: 1.3, y: -20, duration: 0.5, ease: "bounce.out" })
            .to(winnerRef.current, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.2");
    }
    if (loserRef.current) {
        gsap.to(loserRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.in" });
    }
  };


  // --- RENDER FUNCTIONS ---
  const renderBattleContent = () => {
    switch (battleState.status) {
      case "idle":
      case "searching":
      case "subject_select":
      case "ready":
        return (
          <div className="flex flex-col items-center justify-center min-h-72">
            {battleState.status === "idle" && (
                <div className="text-center">
                    <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">CHOOSE YOUR CHALLENGE!</H3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {Object.keys(subjectPokemon).map((subject) => (
                            <div key={subject} onClick={() => selectSubject(subject)}
                                className={`cursor-pointer p-4 border-4 hover:border-yellow-500 transition-all duration-200 pixel-button-shadow bg-gray-800 ${battleState.selectedSubject === subject ? 'border-yellow-500' : 'border-black'}`}>
                                <img src={getPokemonByRef(subjectPokemon[subject]).gif} alt={subject} className="mx-auto w-24 h-24" style={{ imageRendering: "pixelated" }}/>
                                <P className="mt-2 font-bold text-lg text-white capitalize">{subject}</P>
                            </div>
                        ))}
                    </div>
                     <button onClick={findBattle} disabled={!battleState.selectedSubject}
                        className={`mt-6 ${!battleState.selectedSubject ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} text-white px-8 py-3 rounded-lg border-4 border-yellow-500 font-bold text-lg transform hover:scale-105 transition-all duration-300 pixel-button-shadow`}>
                        {`Start ${battleState.selectedSubject ? battleState.selectedSubject.toUpperCase() : ''} Battle!`}
                    </button>
                </div>
            )}
            {battleState.status === "subject_select" && (
                <div className="text-center">
                    <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">Opponent: {opponentName}</H4>
                    <p className="mb-4 text-gray-300">Subject Selected: {battleState.selectedSubject?.toUpperCase()}</p>
                    <button onClick={markReady}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-black pixel-button-shadow">
                        I'm Ready!
                    </button>
                </div>
            )}
            {battleState.status === "searching" && (
              <div className="text-center p-12">
                <div className="animate-pulse text-yellow-300 text-xl mb-6 pixel-font">🔍 Searching for opponent...</div>
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Searching" className="w-full h-full animate-spin" style={{ animationDuration: "2s", imageRendering: "pixelated" }}/>
                </div>
                <button onClick={leaveBattle} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded border-2 border-black pixel-font">Cancel</button>
              </div>
            )}
             {battleState.status === "ready" && (
                  <div className="text-center p-6">
                      <H3 className="text-xl font-bold mb-4 text-yellow-200 text-shadow-pixel">GET READY!</H3>
                      <div className="flex justify-center space-x-8 mb-6">
                          <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.playerReady ? "bg-green-600" : "bg-gray-600"}`}>
                              You: {battleState.playerReady ? "✅ Ready" : "❌ Not Ready"}
                          </div>
                          <div className={`px-4 py-2 rounded-lg border-2 border-black pixel-font ${battleState.opponentReady ? "bg-green-600" : "bg-gray-600"}`}>
                              Opponent: {battleState.opponentReady ? "✅ Ready" : "❌ Not Ready"}
                          </div>
                      </div>
                      <P className="text-gray-300 animate-pulse">Waiting for battle to start...</P>
                  </div>
              )}
          </div>
        );

      case "active":
        return (
          <div className="text-center">
            <div ref={battleAreaRef} className="relative bg-gradient-to-b from-gray-900 to-red-900 rounded-lg p-6 mb-4 border-4 border-yellow-500 min-h-72 pixel-box overflow-hidden">
                <div className="absolute inset-x-0 top-0 -translate-y-1/2">
                    <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full border-4 border-black text-white text-2xl font-bold pixel-font text-shadow-pixel ${battleState.timer <= 5 ? "bg-red-600 animate-pulse" : "bg-gray-700"}`}>
                        {battleState.timer}
                    </div>
                </div>
                {/* Player Pokémon & UI */}
                <div className="absolute left-10 bottom-10" ref={playerPokemonRef}>
                    <div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -top-12 -left-2 rounded-lg shadow-lg">
                        <P className="font-bold text-white text-sm truncate">{player?.userName || "Player"}</P>
                        <div className="w-full bg-gray-600 rounded-full h-3 border border-black mt-1">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${battleState.playerHealth}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-300 text-right">{battleState.playerHealth}/100</div>
                    </div>
                    <img src={getPokemonByRef(battleState.player1Pokemon).gif} alt="Player Pokemon" className="w-24 h-24" style={{ imageRendering: "pixelated" }}/>
                </div>
                {/* Opponent Pokémon & UI */}
                <div className="absolute right-10 top-10" ref={opponentPokemonRef}>
                    <div className="w-32 bg-gray-800 border-4 border-black p-2 absolute -bottom-12 -right-2 rounded-lg shadow-lg">
                        <P className="font-bold text-white text-sm truncate text-right">{opponentName}</P>
                        <div className="w-full bg-gray-600 rounded-full h-3 border border-black mt-1">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${battleState.opponentHealth}%` }}></div>
                        </div>
                         <div className="text-xs text-gray-300">{battleState.opponentHealth}/100</div>
                    </div>
                    <img src={getPokemonByRef(battleState.player2Pokemon).gif} alt="Opponent Pokemon" className="w-24 h-24" style={{ imageRendering: "pixelated" }}/>
                </div>
            </div>
            {/* Question Box */}
            {battleState.currentQuestion && (
              <div className="bg-red-800 border-4 border-black rounded-lg p-4 shadow-lg pixel-box">
                <H4 className="text-lg font-bold mb-4 text-white text-shadow-pixel">{battleState.currentQuestion.question}</H4>
                <div className="grid grid-cols-2 gap-3">
                  {battleState.currentQuestion.options.map((option, index) => (
                    <button key={index} onClick={() => submitAnswer(index)} disabled={battleState.answered}
                      className={`font-bold py-3 px-4 rounded-lg border-4 border-black transition-all duration-300 pixel-font pixel-button-shadow ${battleState.answered ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black"}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "finished":
        const isWinner = battleState.winner === myId;
        return (
          <div className="text-center p-6">
            <H2 className={`text-3xl font-bold mb-8 ${isWinner ? "text-yellow-300" : "text-red-400"} text-shadow-pixel`}>
              {isWinner ? "VICTORY!" : "DEFEAT!"}
            </H2>
            <div className="bg-black/80 rounded-lg p-6 mb-6 border-4 border-yellow-500 pixel-box">
              <H3 className="font-bold text-xl text-white mb-4 text-shadow-pixel">Battle Summary</H3>
              <P className="text-lg mb-2">Correct Answers: <span className="text-yellow-400">{battleState.playerCorrect}</span></P>
              <P className="text-lg mb-2">XP Gained: <span className="text-green-400 font-bold">+{battleState.rewards?.xp || 0}</span></P>
            </div>
            <button onClick={leaveBattle} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform hover:scale-105 transition-all duration-300 border-4 border-yellow-500 pixel-button-shadow">
              Play Again
            </button>
          </div>
        );

      default:
        return <div className="text-center p-8"><div className="animate-pulse text-yellow-300 text-xl pixel-font">Loading...</div></div>;
    }
  };

  return (
    <div className="text-white bg-red-900 min-h-screen p-8" style={{ imageRendering: "pixelated" }}>
      <H2 className="text-3xl font-bold text-center mb-6 text-yellow-300 text-shadow-pixel">EDUQUEST ARENA ⚔️</H2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-red-900 border-4 border-yellow-500 rounded-lg p-6 shadow-2xl pixel-box">
            {renderBattleContent()}
          </div>
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
            disabled={!battleState.roomId}
          />
          <div className="bg-blue-800 border-4 border-yellow-500 rounded-lg p-4 shadow-lg pixel-box">
            <H3 className="text-lg font-bold mb-2 text-yellow-200 text-center text-shadow-pixel">TRAINER DATA</H3>
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-black p-1">
                <img src={pokemonData.pikachu.gif} alt="Player Avatar" style={{ imageRendering: "pixelated" }}/>
              </div>
              <div className="flex-1 ml-4 text-right">
                <P className="text-lg font-bold">{trainerData.userName}</P>
                <div className="text-sm text-yellow-300">Level {trainerData.level}</div>
                <div className="text-sm text-green-300">Correct: {battleState.playerCorrect}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelsTab;